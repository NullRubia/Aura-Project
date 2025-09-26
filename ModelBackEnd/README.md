# **AI백엔드(FASTAPI) 구성**

**MODLEBACKEND 폴더안에 2개의 FastAPI서버**

- LLM_model
  - 로컬경로: MODELBACKEND/LLM_model/local/ChatAIBackend/voiceguard_backend_chat_patch
    - env.txt에 있는 내용을 .env를 생성하여 등록
  - 코랩경로: MODELBACKEND/LLM_model/colab
  - QwenLLM 모델을 이용하여 프롬프트 수정하여 구성
- detection_modle
  - 로컬경로: MODELBACKEND/detection_model/local
  - 코랩경로: MODELBACKEND/detection_model/colab
  - 변조탐지모델(my_model.py) + Whisper STT모델(STT.py) + pyannote.audio 화자분리모델(diarization.py)로 구성
  - .env파일을 만들어 "HUGGINGFACE_TOKEN=[본인의 허깅페이스 토큰]"을 등록
    - 허깅페이스에서 pyannote/speaker-diarization-3.1과 pyannote/embedding 사용 권한 등록 필요

## **실행방법**

- 코랩에서 각 폴더에 있는 .ipynb 주피터 노트북 파일을 열기
- 각 폴더에 있는 zip파일을 기본경로(content)에 업로드
  - detection_modle은 본인이 만든 .env 파일도 같이 업로드
- 각 셀을 실행

## **파일설명**

### **Whisper2.ipynb**

- Whisper encoder 부분을 수정하여 만든 변조탐지모델 학습용 코드(Whisper/base 사용)

### **Description.md**

- 변조모델의 실제 음성과 변조 음성을 구분하는 기준에 대한 설명
