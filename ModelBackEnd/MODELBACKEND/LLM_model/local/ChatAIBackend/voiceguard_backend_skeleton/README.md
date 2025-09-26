# VoiceGuard Backend (FastAPI)

## Quick Start (Local)
```bash
cd voiceguard_backend
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
export ALLOWED_ORIGINS=http://localhost:3000
export WS_ALLOWED_ORIGINS=http://localhost:3000
export API_TOKEN=devtoken
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

Frontend `.env.local`:
```
NEXT_PUBLIC_WS_URL=ws://localhost:8000/v1/stream?token=devtoken
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
```

## Docker
```bash
docker compose up --build
```

## Notes
- WebSocket endpoint expects **binary Int16 PCM 16k mono** frames (~200ms).
- If you want ASR on server, uncomment `faster-whisper` in `requirements.txt` and related env vars, and provide GPU/CPU capacity.
- REST `/v1/sessions/:id/report` returns a placeholder for now.
