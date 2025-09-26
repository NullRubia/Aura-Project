# diarization.py (수정된 안전한 버전)
import io
import os
import torchaudio
import torch
import numpy as np
from pyannote.audio import Pipeline, Inference
from sklearn.metrics.pairwise import cosine_similarity
from dotenv import load_dotenv

load_dotenv()
HUGGINGFACE_TOKEN = os.getenv("HUGGINGFACE_TOKEN")

# pipeline / embedding 불러오기
pipeline = Pipeline.from_pretrained("pyannote/speaker-diarization-3.1", use_auth_token=HUGGINGFACE_TOKEN)
embedding_model = Inference("pyannote/embedding", use_auth_token=HUGGINGFACE_TOKEN)

# 상태 저장
speaker_embeddings = {}   # {speaker_id: [1D numpy vectors]}
previous_segments = []
_next_speaker_id = 0

def _to_numpy_array(x):
    """pyannote/Inference의 반환 타입들을 안전하게 numpy 2D array로 변환"""
    # Torch tensor
    if torch.is_tensor(x):
        return x.detach().cpu().numpy()
    # SlidingWindowFeature (pyannote) -> .data 가능
    if hasattr(x, "data"):
        data = x.data
        if torch.is_tensor(data):
            return data.detach().cpu().numpy()
        return np.asarray(data)
    # numpy already
    return np.asarray(x)

def get_embedding(waveform: torch.Tensor, sample_rate: int, start: float, end: float):
    """
    waveform: torch.Tensor, shape (channels, time)
    start, end: seconds
    반환: 1D numpy vector (embedding)
    """
    start_sample = int(start * sample_rate)
    end_sample = int(end * sample_rate)
    # 안전성: 범위 검사
    if end_sample <= start_sample:
        return None

    segment = waveform[:, start_sample:end_sample]  # torch.Tensor
    # embedding_model에 segment (torch tensor) 전달
    emb_out = embedding_model({"waveform": segment, "sample_rate": sample_rate})

    emb_arr = _to_numpy_array(emb_out)  # numpy array
    # emb_arr 형태는 보통 (n_windows, dim) 또는 (dim,) 또는 (1, dim)
    if emb_arr.ndim == 0:
        emb_arr = emb_arr.reshape(1, -1)
    elif emb_arr.ndim == 1:
        emb_arr = emb_arr.reshape(1, -1)
    elif emb_arr.ndim > 2:
        # 예외적: flatten time/frames dims -> (n_windows, dim)
        emb_arr = emb_arr.reshape(emb_arr.shape[0], -1)

    # 여러 윈도우가 있으면 평균해서 하나의 벡터로 만듦
    vec = np.mean(emb_arr, axis=0)  # 1D
    return vec  # 1D numpy

def match_speaker(embedding_vec: np.ndarray, threshold: float = 0.7):
    """
    embedding_vec: 1D numpy
    returns: speaker_id (string)
    """
    global _next_speaker_id

    if embedding_vec is None:
        return None

    if embedding_vec.ndim != 1:
        embedding_vec = embedding_vec.reshape(-1)

    if not speaker_embeddings:
        spk = f"SPEAKER_{_next_speaker_id}"
        speaker_embeddings[spk] = [embedding_vec]
        _next_speaker_id += 1
        return spk

    best_spk = None
    best_sim = -1.0
    for spk, vecs in speaker_embeddings.items():
        avg = np.mean(vecs, axis=0)  # 1D
        sim = cosine_similarity(embedding_vec.reshape(1, -1), avg.reshape(1, -1))[0, 0]
        if sim > best_sim:
            best_sim = sim
            best_spk = spk

    if best_sim >= threshold:
        speaker_embeddings[best_spk].append(embedding_vec)
        return best_spk
    else:
        spk = f"SPEAKER_{_next_speaker_id}"
        speaker_embeddings[spk] = [embedding_vec]
        _next_speaker_id += 1
        return spk

def run_diarization_bytes(audio_bytes: bytes, offset: float = 0.0, match_threshold: float = 0.36):
    """
    audio_bytes: WAV/PCM bytes
    offset: chunk 시작 시각(초) — 청크 분할 전송하면 offset을 누적해서 넘겨줘야 함
    returns: list of segments with speaker ids [{start, end, speaker}, ...]
    match_threshold: 같은 화자를 구분하는 값. 보통 0.5 이상에서 조정
    """
    global previous_segments

    buffer = io.BytesIO(audio_bytes)
    waveform, sample_rate = torchaudio.load(buffer)  # waveform: torch.Tensor (channels, time)

    # ensure 2D torch tensor (channels, time)
    if waveform.dim() == 1:
        waveform = waveform.unsqueeze(0)
    if waveform.size(0) > 1:
        # mix to mono (평균)
        waveform = waveform.mean(dim=0, keepdim=True)

    # call pipeline with torch.Tensor (NOT numpy)
    diarization = pipeline({"waveform": waveform, "sample_rate": sample_rate})

    new_segments = []
    for turn, _, _ in diarization.itertracks(yield_label=True):
        # turn.start, turn.end in seconds (local to this chunk)
        if turn.end <= turn.start:
            continue
        emb_vec = get_embedding(waveform, sample_rate, turn.start, turn.end)
        if emb_vec is None:
            continue
        spk_id = match_speaker(emb_vec, threshold=match_threshold)
        new_segments.append({
            "start": float(turn.start) + float(offset),
            "end": float(turn.end) + float(offset),
            "speaker": spk_id
        })

    # 보존(슬라이딩 윈도우)
    if new_segments:
        cutoff = new_segments[-1]["end"] - 30.0
        previous_segments.extend(new_segments)
        previous_segments = [p for p in previous_segments if p["end"] >= cutoff]

    return new_segments
