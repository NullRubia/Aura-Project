import asyncio
import websockets
import sounddevice as sd
import soundfile as sf
from io import BytesIO
import json

# 서버 주소 (FastAPI WebSocket 엔드포인트)
SERVER_URI = "wss://30915c9b4501.ngrok-free.app/ws"

# 오디오 설정
SAMPLE_RATE = 16000   # Whisper, pyannote 기본 샘플레이트
CHANNELS = 1
CHUNK_DURATION = 5    # 초 단위 청크 (실시간이면 2~5초 권장)
CHUNK_SIZE = SAMPLE_RATE * CHUNK_DURATION


async def record_and_send(websocket):
    """마이크에서 오디오를 녹음하여 WebSocket으로 전송"""
    while True:
        print(f"🎙️ Recording {CHUNK_DURATION}s...")
        audio = sd.rec(
            frames=CHUNK_SIZE,
            samplerate=SAMPLE_RATE,
            channels=CHANNELS,
            dtype="float32"
        )
        sd.wait()

        # WAV 바이트 변환
        wav_bytes = BytesIO()
        sf.write(wav_bytes, audio, SAMPLE_RATE, format="WAV")
        wav_bytes.seek(0)

        # 서버 전송
        await websocket.send(wav_bytes.read())
        print("📤 Chunk sent.")


async def receive_messages(websocket):
    """서버에서 오는 diarization/STT/spoof 결과 수신"""
    while True:
        try:
            msg = await websocket.recv()
            data = json.loads(msg)

            if "spoof_prob" in data:
                print(f"🛑 Spoof probability: {data['spoof_prob']:.3f}")

            if "diarization" in data:
                print("👥 Diarization:", data["diarization"])

            if "stt_segment" in data:
                seg = data["stt_segment"]
                print(f"[{seg['speaker']}] {seg['text']}")

        except websockets.exceptions.ConnectionClosed:
            print("⚠️ Connection closed by server")
            break


async def main():
    async with websockets.connect(SERVER_URI, max_size=None) as websocket:
        print("✅ Connected to server")

        # 동시에 송신/수신 처리
        await asyncio.gather(
            record_and_send(websocket),
            receive_messages(websocket)
        )


if __name__ == "__main__":
    asyncio.run(main())