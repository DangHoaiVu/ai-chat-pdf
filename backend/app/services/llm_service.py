import httpx
from fastapi import HTTPException, status
from app.config import settings
from typing import List, Dict, Any

SYSTEM_PROMPT = """Bạn là một trợ lý AI thông minh, đa năng, hoạt động và phản hồi hoàn toàn tự nhiên tương tự như ChatGPT và Gemini.

Nhiệm vụ của bạn là trò chuyện, giải đáp thắc mắc và hỗ trợ người dùng ở mọi chủ đề. 
- Nếu người dùng hỏi các câu hỏi liên quan đến tài liệu PDF được cung cấp bên dưới, hãy kết hợp thông tin từ tài liệu để trả lời một cách chính xác nhất có thể.
- Nếu câu hỏi nằm ngoài tài liệu, hoặc là các câu hỏi trò chuyện tự do, thảo luận lập trình, lập kế hoạch, tư vấn lộ trình học tập, hay bất kỳ chủ đề đời sống nào khác, hãy sử dụng toàn bộ vốn kiến thức sâu rộng của bạn để trả lời một cách tự nhiên, chi tiết và thông minh.
- Tuyệt đối không từ chối trả lời, không dùng các câu trả lời máy móc hay hạn chế người dùng. Hãy luôn cởi mở và tư vấn như một chuyên gia thực thụ.

Định dạng câu trả lời rõ ràng, mạch lạc, sử dụng markdown khi cần thiết."""

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
        "temperature": 0.7  # Higher temperature for natural, human-like phrasing
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
