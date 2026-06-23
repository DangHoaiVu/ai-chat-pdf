import httpx
from fastapi import HTTPException, status
from app.config import settings
from typing import List, Dict, Any

SYSTEM_PROMPT = """You are a professional assistant that helps users chat with their PDF documents.
Follow these instructions to handle different types of user queries:

1. PRIORITY - PDF CONTEXT: If the user's question can be answered using the provided context, answer based ONLY on the context. Keep the answer clear, structured, and in Vietnamese.
2. FALLBACK - GENERAL KNOWLEDGE: If the question is conversational, general knowledge, or cannot be answered using the provided context, do NOT refuse to answer. Answer the question politely using your general knowledge.

Do not make up facts about the document itself. Keep the language natural and helpful."""

async def generate_rag_answer(question: str, context_chunks: List[Dict[str, Any]]) -> str:
    """
    Sends the user's question and retrieved context to OpenRouter to generate an answer.
    """
    if not settings.openrouter_api_key:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="OpenRouter API Key has not been configured in backend env."
        )

    # Build context string
    context_str = ""
    for idx, chunk in enumerate(context_chunks):
        source = chunk["metadata"].get("source", "Unknown Page")
        context_str += f"[Source: {source}]\n{chunk['text']}\n\n"

    user_message = f"CONTEXT FROM PDF:\n{context_str}\nQUESTION:\n{question}\n\nANSWER:"

    url = "https://openrouter.ai/api/v1/chat/completions"
    headers = {
        "Authorization": f"Bearer {settings.openrouter_api_key}",
        "Content-Type": "application/json",
        "HTTP-Referer": "https://github.com/DangHoaiVu/ai-chat-pdf",
        "X-Title": "AI Chat PDF"
    }
    
    payload = {
        "model": settings.openrouter_model,
        "messages": [
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": user_message}
        ],
        "max_tokens": 1500,
        "temperature": 0.3  # Low temperature for factual accuracy
    }

    try:
        async with httpx.AsyncClient(timeout=45) as client:
            response = await client.post(url, headers=headers, json=payload)
            response.raise_for_status()
            data = response.json()
            return data["choices"][0]["message"]["content"]
    except httpx.HTTPStatusError as exc:
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail=f"OpenRouter returned HTTP error {exc.response.status_code}: {exc.response.text}"
        ) from exc
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail=f"Error generating answer from LLM: {str(exc)}"
        ) from exc
