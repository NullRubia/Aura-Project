# VoiceGuard Backend (FastAPI)

## Quick Start (Local)
```bash
cd voiceguard_backend
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
export ALLOWED_ORIGINS=http://localhost:3000
export WS_ALLOWED_ORIGINS=http://localhost:3000
export API_TOKEN=devtoken
uvicorn app.main:app --reload --host 0.0.0.0 --port 8080
```

Frontend `.env.local`:
```
NEXT_PUBLIC_WS_URL=ws://localhost:8000/v1/stream?token=devtoken
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080
```

## Docker
```bash
docker compose up --build
```

## Notes
- WebSocket endpoint expects **binary Int16 PCM 16k mono** frames (~200ms).
- If you want ASR on server, uncomment `faster-whisper` in `requirements.txt` and related env vars, and provide GPU/CPU capacity.
- REST `/v1/sessions/:id/report` returns a placeholder for now.


## Chat (RAG) Endpoint
- `POST /v1/chat` (token required)
  ```json
  {
    "query": "사기 의심될 때 어떻게 해야 해?",
    "history": [{"role":"user","content":"..."}],
    "use_rag": true,
    "top_k": 4,
    "token": "devtoken"
  }
  ```
- 환경변수
  - `OPENAI_API_KEY` : (선택) OpenAI 호환 API 키 (vLLM/로컬 서버 가능)
  - `OPENAI_BASE_URL` : (선택) 기본값 `https://api.openai.com` / 로컬일 경우 `http://localhost:8080`
  - `CHAT_MODEL` : 모델 이름 (예: `gpt-4o-mini` 또는 `qwen2-7b-instruct`)
  - `KB_PATH` : 지식베이스 폴더 경로 (기본 `./kb`)

지식베이스는 `kb/*.md|*.txt` 파일을 자동 로딩하여 BM25로 검색합니다.
