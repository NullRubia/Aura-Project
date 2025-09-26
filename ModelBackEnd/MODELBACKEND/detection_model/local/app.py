# app.py
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
import torch
import soundfile as sf
from io import BytesIO
import tempfile
import asyncio
from my_model import load_model, preprocess_audio
from STT import transcribe_audio
from diarization import run_diarization_bytes
import os
from pydub import AudioSegment
import base64
import json

app = FastAPI()
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
model = load_model("best_stageB_eer_0.0003.pt").to(device)
model.eval()


# -----------------------------
# 화자별 STT 처리
# -----------------------------
async def async_stt_segment(websocket: WebSocket, audio, sr, seg):
    start_sample = int(seg["start"] * sr)
    end_sample = int(seg["end"] * sr)
    segment_audio = audio[start_sample:end_sample]

    if len(segment_audio) == 0:
        return

    if segment_audio.ndim > 1:
        segment_audio = segment_audio.mean(axis=1)

    tmp = tempfile.NamedTemporaryFile(suffix=".wav", delete=False)
    tmp_path = tmp.name
    tmp.close()
    sf.write(tmp_path, segment_audio, sr)

    try:
        text = transcribe_audio(tmp_path, language="ko")
    except Exception as e:
        text = ""
        print(f"⚠️ STT error: {e}")
    finally:
        os.remove(tmp_path)

    if websocket.client_state.name == "CONNECTED" and text.strip():
        await websocket.send_json({
            "stt_segment": {
                "speaker": seg["speaker"],
                "start": seg["start"],
                "end": seg["end"],
                "text": text
            }
        })


# -----------------------------
# 모든 오디오 포맷 → WAV 변환
# -----------------------------
# -----------------------------
# 모든 오디오 포맷 → WAV 변환 (마이크용 단순화)
# -----------------------------
def audio_to_wav_bytes(audio_bytes: bytes, fmt: str = None) -> bytes:
    """
    이제 마이크 chunk는 이미 WAV이므로 그대로 반환.
    파일 업로드는 기존대로 AudioSegment 사용.
    """
    if fmt is None or fmt.lower() == "wav":
        return audio_bytes  # 이미 WAV chunk이면 그대로 사용
    else:
        tmp_file = tempfile.NamedTemporaryFile(delete=False).name
        with open(tmp_file, "wb") as f:
            f.write(audio_bytes)
        try:
            audio = AudioSegment.from_file(tmp_file, format=fmt)
            wav_io = BytesIO()
            audio.export(wav_io, format="wav")
            wav_io.seek(0)
            return wav_io.getvalue()
        finally:
            if os.path.exists(tmp_file):
                os.remove(tmp_file)


# -----------------------------
# WebSocket 엔드포인트
# -----------------------------
@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    print("✅ WebSocket connected")

    try:
        while True:
            msg = await websocket.receive()

            audio_bytes = None
            fmt = None

            # 1️⃣ raw binary (마이크 chunk, WAV)
            if "bytes" in msg and msg["bytes"] is not None:
                audio_bytes = msg["bytes"]
                fmt = "wav"  # 이미 WAV chunk

            # 2️⃣ JSON (파일 업로드)
            elif "text" in msg and msg["text"] is not None:
                try:
                    payload = json.loads(msg["text"])
                    audio_bytes = base64.b64decode(payload["audio"])
                    fmt = payload.get("format", "wav")
                except Exception as e:
                    await websocket.send_json({"error": f"Invalid JSON: {e}"})
                    continue
            else:
                continue

            # WAV 변환 (필요한 경우만)
            try:
                wav_bytes = audio_to_wav_bytes(audio_bytes, fmt)
            except Exception as e:
                await websocket.send_json({"error": f"Audio conversion failed: {e}"})
                continue

            # (A) 스푸핑 탐지
            try:
                inputs = preprocess_audio(wav_bytes)
                inputs = {k: v.to(device) if torch.is_tensor(v) else v for k, v in inputs.items()}
                with torch.no_grad():
                    logits = model(inputs)
                    spoof_prob = torch.sigmoid(logits).item()
            except Exception as e:
                await websocket.send_json({"error": f"Spoof detection failed: {e}"})
                continue

            # (B) 화자 분리
            try:
                diarization_result = run_diarization_bytes(wav_bytes)
            except Exception as e:
                await websocket.send_json({"error": f"Diarization failed: {e}"})
                diarization_result = []

            await websocket.send_json({
                "spoof_prob": spoof_prob,
                "diarization": diarization_result
            })

            # (C) STT 처리 (비동기)
            try:
                audio, sr = sf.read(BytesIO(wav_bytes), dtype="float32")
                if audio.ndim > 1:
                    audio = audio.mean(axis=1)
                for seg in diarization_result:
                    asyncio.create_task(async_stt_segment(websocket, audio, sr, seg))
            except Exception as e:
                await websocket.send_json({"error": f"STT failed: {e}"})

    except WebSocketDisconnect:
        print("⚠️ WebSocket disconnected")
    except Exception as e:
        try:
            await websocket.send_json({"error": f"Unexpected: {e}"})
        except Exception:
            pass