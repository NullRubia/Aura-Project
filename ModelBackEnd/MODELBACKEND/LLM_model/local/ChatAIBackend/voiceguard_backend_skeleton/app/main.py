
import os
from dotenv import load_dotenv
import re
import time
from typing import List, Optional

from fastapi import FastAPI, WebSocket, WebSocketDisconnect, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

# Load environment variables from .env if present
load_dotenv()

# === Optional: faster-whisper for ASR ===
ASR_ENABLED = False
try:
    from faster_whisper import WhisperModel  # type: ignore
    ASR_ENABLED = True
except Exception:
    ASR_ENABLED = False

ALLOWED_ORIGINS = [o.strip() for o in os.getenv("ALLOWED_ORIGINS", "*").split(",")]
WS_ALLOWED_ORIGINS = [o.strip() for o in os.getenv("WS_ALLOWED_ORIGINS", "*").split(",")]
API_TOKEN = os.getenv("API_TOKEN", "devtoken")

# Instantiate app
app = FastAPI(title="VoiceGuard Backend", version="0.1.0")

# REST CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS if ALLOWED_ORIGINS != ["*"] else ["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Optional ASR model (lazy load to speed cold start)
model = None
if ASR_ENABLED and os.getenv("LOAD_ASR_AT_START", "false").lower() in ("1","true","yes"):
    model_size = os.getenv("ASR_MODEL_SIZE", "small")
    compute_type = os.getenv("ASR_COMPUTE_TYPE", "int8")
    model = WhisperModel(model_size, compute_type=compute_type)


# ======= Domain types =======
class ReportSpeakerSegment(BaseModel):
    startMs: int
    endMs: int
    text: str

class ReportSpeaker(BaseModel):
    speaker: str  # 'A'|'B'
    segments: List[ReportSpeakerSegment]

class Report(BaseModel):
    sessionId: str
    summary: str
    risk: int
    speakers: List[ReportSpeaker]


# ======= Utils =======
RISK_PATTERNS = [
    r"(금감원|검찰|경찰|수사|계좌.?동결|압수)",
    r"(원격제어|anydesk|teamviewer|apk)",
    r"(계좌|입금|이체|otp|공동인증서)",
    r"(\d{1,3}(?:,\d{3})+ ?원|\d+ ?만원|\d+ ?백만원)",
    r"(지금|바로|10분|급히)"
]

def risk_score(text: str) -> int:
    score = 0
    for pat in RISK_PATTERNS:
        if re.search(pat, text, flags=re.I):
            score += 20
    return min(score, 100)

def check_rest_auth(token: Optional[str] = None):
    if token != API_TOKEN:
        raise HTTPException(status_code=401, detail="Unauthorized")


# ======= REST endpoints =======
@app.get("/health")
def health():
    return {"ok": True, "asr": ASR_ENABLED}

@app.get("/v1/sessions/{session_id}/report", response_model=Report)
def get_report(session_id: str, token: Optional[str] = None):
    check_rest_auth(token)
    # Placeholder report
    return Report(
        sessionId=session_id,
        summary="통화 요약 예시: 상대방이 금감원 사칭, 원격제어앱 설치와 계좌이체 요구.",
        risk=85,
        speakers=[
            ReportSpeaker(speaker="A", segments=[
                ReportSpeakerSegment(startMs=0, endMs=5000, text="여기는 금융감독원입니다. 본인 계좌가 범죄에 연루되었습니다."),
            ]),
            ReportSpeaker(speaker="B", segments=[
                ReportSpeakerSegment(startMs=5000, endMs=9000, text="무슨 말씀이신지요?"),
            ]),
        ]
    )


# ======= WebSocket (binary PCM16k) =======
def _check_ws_origin(headers) -> bool:
    if WS_ALLOWED_ORIGINS == ["*"]:
        return True
    origin = headers.get("origin") or headers.get("Origin")
    if not origin:
        return False
    return origin in WS_ALLOWED_ORIGINS

def _check_ws_token(query_params) -> bool:
    # Simple token in query: ?token=...
    return query_params.get("token") == API_TOKEN

@app.websocket("/v1/stream")
async def stream(ws: WebSocket):
    # Manual origin/token check (WebSocket doesn't go through CORS middleware)
    if not _check_ws_origin(ws.headers):
        await ws.close(code=4403)
        return
    if not _check_ws_token(ws.query_params):
        await ws.close(code=4401)
        return

    await ws.accept()
    session_id = f"s_{int(time.time()*1000)}"
    buf = bytearray()
    chunk_bytes = int(os.getenv("STREAM_CHUNK_BYTES", "32000"))  # ~200ms at 16k mono int16 ~= 6400 bytes; 32000 for ~1s

    # optional ASR lazy load
    global model
    if ASR_ENABLED and model is None:
        model_size = os.getenv("ASR_MODEL_SIZE", "small")
        compute_type = os.getenv("ASR_COMPUTE_TYPE", "int8")
        model = WhisperModel(model_size, compute_type=compute_type)

    try:
        while True:
            data = await ws.receive()
            if "bytes" in data and data["bytes"] is not None:
                buf.extend(data["bytes"])
                if len(buf) >= chunk_bytes:
                    text = ""
                    if ASR_ENABLED and model is not None:
                        segments, _ = model.transcribe(bytes(buf), language="ko", vad_filter=True)
                        text = " ".join(s.text for s in segments)
                    else:
                        # Placeholder when ASR is disabled
                        text = "(ASR 미활성화: 서버에서 전사 기능을 켜면 텍스트가 여기에 표시됩니다.)"

                    score = risk_score(text)
                    await ws.send_json({"sessionId": session_id, "partial": text, "risk": score, "ts": time.time()})
                    buf.clear()

            elif "text" in data and data["text"] is not None:
                if data["text"] == "__END__":
                    break
            else:
                # ignore ping/pong/control frames
                pass

    except WebSocketDisconnect:
        pass
    finally:
        await ws.close()
