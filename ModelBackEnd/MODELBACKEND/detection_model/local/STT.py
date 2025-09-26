# STT.py
import whisper

model = whisper.load_model("medium")

def transcribe_audio(audio_path: str, language: str = "ko") -> str:
    result = model.transcribe(audio_path, language=language)
    return result.get("text", "")