
import os
import json
from typing import List, Dict, Any, Optional
import httpx

from .rag import RAGIndex
from llama_cpp import Llama

# ======= Optional dual-model routing (PRIMARY/SECONDARY with ROUTING) =======
PRIMARY_MODEL = os.getenv("PRIMARY_MODEL", "qwen2.5-7b-instruct-q6_k_l")
SECONDARY_MODEL = os.getenv("SECONDARY_MODEL", "llama3.1:8b")
ROUTING = os.getenv("ROUTING", "auto")  # auto | qwen | llama

def _is_korean(text: str, threshold: float = 0.2) -> bool:
    if not text:
        return False
    hangul = sum(0xAC00 <= ord(ch) <= 0xD7A3 for ch in text)
    return (hangul / max(len(text), 1)) >= threshold

def _pick_model(user_query: str, history):
    if ROUTING == "qwen":
        return PRIMARY_MODEL
    if ROUTING == "llama":
        return SECONDARY_MODEL
    # auto: 간단 한국어 비율 기반 라우팅
    hist = " ".join(m.get("content", "") for m in (history or []))
    text = (user_query or "") + " " + hist
    return PRIMARY_MODEL if _is_korean(text) else SECONDARY_MODEL

SYSTEM_PROMPT = """당신은 보이스피싱 탐지 도우미 챗봇입니다.
- 항상 한국어로, 친절하고 공감하는 말투로 답하세요.
- 답변은 1문장으로 작성하세요.
- 첫 문장은 핵심 결론을 한 줄로 말하세요.
- 이후 1~3번 번호 목록으로 구체적 대응 절차를 안내하세요.
- 각 단계는 실행 동사로 시작하고, 이유를 짧게 덧붙이세요.
- 위험 징후(기관 사칭, 원격제어앱, 시간 압박, 금액·계좌 요구)를 경고하세요.
- 반드시 공식 대표번호 확인과 신고 채널(112, 1332)을 포함하세요.
- 제공된 컨텍스트 범위 안에서만 답하고, 모르면 모른다고 답하세요.
"""

def build_context_from_chunks(chunks) -> str:
    if not chunks: 
        return ""
    out = []
    for c in chunks:
        out.append(f"[{c.source}] {c.text}")
    return "\n\n".join(out)

def _openai_chat(user_query: str, model: str, base_url: str, api_key: str) -> str:
    """
    llama.cpp 서버용 한국어 강제 프롬프트 전달 (ChatML)
    """
    url = base_url.rstrip("/") + "/v1/chat/completions"
    headers = {"Authorization": f"Bearer {api_key}", "Content-Type": "application/json"}

    payload = {
        "model": model,
        "messages": [
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": user_query}
        ],
        "temperature": 0.2,
        "max_tokens": 512
    }

    with httpx.Client(timeout=500) as client:
        r = client.post(url, headers=headers, json=payload)
        r.raise_for_status()
        data = r.json()

    if "choices" in data and len(data["choices"]) > 0:
        return data["choices"][0].get("message", {}).get("content", "")
    else:
        return json.dumps(data, ensure_ascii=False)
    
class ChatEngine:
    def __init__(self):
        self.rag = RAGIndex()
        kb_path = os.getenv("KB_PATH", os.path.join(os.path.dirname(__file__), "..", "kb"))
        self.rag.build_from_folder(kb_path)
        # Model selection: supports CHAT_MODEL or (PRIMARY/SECONDARY with ROUTING)
        chat_model_env = os.getenv("CHAT_MODEL")
        primary_model = os.getenv("PRIMARY_MODEL")
        secondary_model = os.getenv("SECONDARY_MODEL")
        routing_pref = (os.getenv("ROUTING", "auto") or "auto").lower()

        if primary_model or secondary_model:
            if routing_pref == "qwen" and primary_model:
                resolved_model = primary_model
            elif routing_pref == "llama" and secondary_model:
                resolved_model = secondary_model
            else:
                # auto/default: prefer primary when defined, else secondary
                resolved_model = primary_model or secondary_model
        else:
            resolved_model = chat_model_env or "gpt-4o-mini"

        self.model = resolved_model  # local or remote model id

        # OpenAI-compatible base URL and API key (Ollama ignores key; dummy ok)
        self.base_url = os.getenv("OPENAI_BASE_URL", "https://api.openai.com")
        self.api_key = os.getenv("OPENAI_API_KEY", "")

    def chat(self, user_query: str, history: Optional[List[Dict[str, str]]] = None, use_rag=True, top_k=4) -> Dict[str, Any]:
        history = history or []
        chunks = self.rag.search(user_query, top_k=top_k) if use_rag else []
        context = build_context_from_chunks(chunks)
        sys = {"role": "system", "content": SYSTEM_PROMPT}
        if context:
            prompt_text = SYSTEM_PROMPT + "\n\n컨텍스트:\n" + context + "\n사용자: " + user_query + "\nAI:"
        else:
            prompt_text = SYSTEM_PROMPT + "\n\n사용자: " + user_query + "\nAI:"

        if self.api_key:
            model_name = _pick_model(user_query, history)
            answer = _openai_chat(user_query, model_name, self.base_url, self.api_key)
        else:
            answer = f"(로컬 템플릿) 질문 요약: {user_query}\n- 참고한 문서 수: {len(chunks)}"

        sources = [{"source": c.source, "doc_id": c.doc_id, "chunk_id": c.chunk_id} for c in chunks]
        return {"answer": answer, "sources": sources}
