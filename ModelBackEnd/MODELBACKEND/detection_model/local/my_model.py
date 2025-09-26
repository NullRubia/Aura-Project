"""
- 목적: Whisper 기반의 feature extractor와 Whisper 모델 인코더를 활용하여 오디오의 스푸핑(변조음성) 여부를 분류하는 작은 분류기 구성
- 사용 라이브러리: torch, transformers(WhisperModel, WhisperFeatureExtractor), soundfile, torchaudio(샘플레이트 변환 시 사용)


주의사항 및 기대 입력/출력
- preprocess_audio(raw_bytes, target_length=3000)은 WebSocket 등으로 전달된 *오디오 파일의 바이트*(예: WAV 파일 전체 바이트)를 입력으로 받는다고 가정합니다.
soundfile.sf.read(BytesIO(raw_bytes))가 파일형식(예: WAV, FLAC)을 인식할 수 있어야 합니다.
- FeatureExtractor는 학습 할 때와 동일한 모델명을 사용해야 합니다(여기선 "openai/whisper-base").
- load_model(model_path)는 disk에 저장된 state dict를 불러와 모델에 적용합니다.


간단 사용 예시
- bytes = <클라이언트에서 받은 WAV 파일의 raw bytes>
- inputs = preprocess_audio(bytes)
- model = load_model("best.pt")
- logits = model(inputs)
- score = torch.sigmoid(logits) # 이진 분류 확률로 변환
"""
import torch
from transformers import WhisperModel, WhisperFeatureExtractor
import soundfile as sf
from io import BytesIO

# 학습 때 사용한 Feature Extractor 모델명
FE_MODEL = "openai/whisper-base"
# feature extractor는 오디오를 Whisper 모델이 기대하는 입력 형태(예: log-mel spectrogram 등)로 변환합니다.
feature_extractor = WhisperFeatureExtractor.from_pretrained(FE_MODEL)

# Whisper 기반 스푸핑 분류기 (학습 코드 그대로)
class WhisperSpoofClassifier(torch.nn.Module):
    """
    WhisperModel의 encoder만 재사용하고, 그 위에 간단한 MLP 분류기를 올린 모델입니다.


    구조 요약:
    - encoder: Whisper 모델의 encoder 부분 (출력: last_hidden_state)
    - classifier: encoder 출력의 시간축을 평균(pooling)하여 (batch_size, hidden_dim) 형태로 만든 뒤 MLP로 이진 점수(logit) 출력


    주의:
    - whisper_model은 HuggingFace의 WhisperModel.from_pretrained로 불러온 객체를 전달해야 합니다.
    - 마지막 출력은 스칼라(logit) 형태이며, 이 값을 sigmoid에 통과시키면 [0,1] 확률값이 됩니다.
    """
    def __init__(self, whisper_model, hidden_dim=256, dropout=0.2):
        super().__init__()
        # Whisper 모델의 encoder 부분만 재사용
        self.encoder = whisper_model.encoder
        # 모델의 hidden dimension을 config에서 가져옵니다 (d_model)
        self.dim = whisper_model.config.d_model

        # 단순한 2층 분류기
        # 입력: encoder의 pooled 출력 (batch_size, dim)
        # 출력: single logit (batch_size,)
        self.classifier = torch.nn.Sequential(
            torch.nn.Linear(self.dim, hidden_dim),
            torch.nn.ReLU(),
            torch.nn.Dropout(dropout),
            torch.nn.Linear(hidden_dim, 1)
        )

    def forward(self, input_features):
        """
        input_features: feature_extractor로 생성된 딕셔너리
        expected key: "input_features" -> Tensor, shape = (B, n_mels, T)


        처리 순서:
        1) encoder에 입력
        2) encoder의 시퀀스 출력(last_hidden_state)을 시퀀스 축(시간축)으로 평균(pooling)
        3) MLP 분류기에 통과시키고 마지막 차원 squeeze


        반환: (B,) 형태의 로짓
        """
        # 코드에서 기대하는 입력 텐서
        x = input_features["input_features"]  # (B, n_mels, T)

        # encoder의 출력은 HuggingFace 모델의 표준 형태를 따릅니다.
        # 보통 last_hidden_state는 (batch_size, seq_len, hidden_dim)입니다.
        enc = self.encoder(x).last_hidden_state

        # 시퀀스(시간) 축(여기서는 dim=1)으로 평균내서 (batch_size, hidden_dim)로 만듭니다.
        # 주의: encoder의 출력 차원 순서가 다르다면 dim 인덱스를 맞춰야 합니다.
        pooled = enc.mean(dim=1)
        # classifier는 (batch_size, 1) -> squeeze로 (batch_size,) 반환
        return self.classifier(pooled).squeeze(-1)


def preprocess_audio(raw_bytes, target_length=3000):
    """
    WebSocket 등에서 전달받은 오디오 바이트(raw_bytes)를 WhisperFeatureExtractor 입력 형태로 변환합니다.


    동작:
    1) soundfile을 이용해 BytesIO에서 오디오 읽기 (numpy array, sampling rate 반환)
    2) 샘플링레이트가 16kHz가 아니면 torchaudio로 리샘플링
    3) WhisperFeatureExtractor에 넣어 input_features 생성
    4) 모델 학습 시 사용한 target_length(T)와 맞추기 위해 시간축을 패딩하거나 잘라냄


    파라미터:
    - raw_bytes: WAV 등의 파일 포맷 전체 바이트 (bytes)
    - target_length: 학습 시 사용한 입력 길이에 맞추기 위한 시간축 길이 (프레임 단위)


    반환: feature_extractor가 만든 inputs 딕셔너리 ("input_features" 키 포함), 값은 Tensor
    """
    # BytesIO로 감싸서 soundfile이 파일로 읽게 함
    waveform, sr = sf.read(BytesIO(raw_bytes), dtype='float32')

    # 모노 변환: stereo이면 평균 내기
    if waveform.ndim > 1:
        waveform = waveform.mean(axis=1)

    # 1) Whisper는 16kHz 기준
    if sr != 16000:
        import torchaudio
        # soundfile이 준 numpy array를 tensor로 변환
        waveform = torch.tensor(waveform, dtype=torch.float32)
        # torchaudio.functional.resample은 1D(또는 (channels, time)) 텐서를 기대
        # 만약 waveform이 1D이면 그대로 사용됩니다.
        waveform = torchaudio.functional.resample(waveform, sr, 16000).numpy()
        sr = 16000

    # 2) Whisper Feature Extractor 적용
    # return_tensors="pt"를 쓰면 torch.Tensor로 반환됩니다.
    inputs = feature_extractor(
        waveform,
        sampling_rate=sr,
        return_tensors="pt",
        padding=True
    )

    # 3) target_length(학습 시와 동일한 길이) 맞추기
    feats = inputs["input_features"]  # (1, n_mels, T)
    B, n_mels, T = feats.shape
    if T < target_length:
        feats = torch.nn.functional.pad(feats, (0, target_length - T))
    elif T > target_length:
        feats = feats[:, :, :target_length]

    inputs["input_features"] = feats
    return inputs


def load_model(model_path: str):
    """
    disk에 저장된 체크포인트를 불러와 WhisperSpoofClassifier를 생성하고 상태를 로드합니다.


    주의사항:
    - torch.load(..., map_location="cpu")로 불러오기 때문에 CPU 환경에서도 동작합니다.
    - 만약 저장한 체크포인트가 dict 형태로 {"model_state_dict": ..., "other": ...}와 같이 저장돼 있다면
    torch.load로 반환되는 객체를 검사해서 state = state["model_state_dict"] 와 같이 접근해야 합니다.


    반환: 평가 모드로 전환된 model
    """
    # Whisper 모델(encoder 포함)을 동일한 FE_MODEL로 불러옴
    whisper_model = WhisperModel.from_pretrained(FE_MODEL)

    # 위에서 정의한 분류기 초기화
    model = WhisperSpoofClassifier(whisper_model)

    # 체크포인트 불러오기 (CPU로 매핑)
    state = torch.load(model_path, map_location="cpu")
    model.load_state_dict(state)

    # 평가 모드로 전환 (dropout, batchnorm 등 평가모드 설정)
    model.eval()
    return model
