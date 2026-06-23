import httpx
from fastapi import HTTPException, status
from app.config import settings
from typing import List, Dict, Any

SYSTEM_PROMPT = """Bạn là một trợ lý AI thông minh, thân thiện và tự nhiên (tương tự như ChatGPT và Gemini). Nhiệm vụ của bạn là hỗ trợ người dùng thảo luận và trả lời các câu hỏi về tài liệu PDF đã được tải lên.

Hãy tuân thủ các nguyên tắc sau để tối ưu hóa trải nghiệm trò chuyện:
1. PHONG CÁCH TỰ NHIÊN: Trả lời bằng tiếng Việt trôi chảy, tự nhiên, thân thiện và dễ hiểu. Tránh cách nói máy móc hoặc quá trang trọng.
2. TẬP TRUNG NGỮ CẢNH: Nếu câu hỏi liên quan trực tiếp đến tài liệu, hãy ưu tiên sử dụng thông tin trong tài liệu để trả lời một cách chính xác.
3. LINH HOẠT VÀ THÔNG MINH (Không từ chối cứng nhắc):
   - Nếu tài liệu không chứa đủ thông tin chi tiết hoặc câu hỏi mang tính chất mở rộng (ví dụ: yêu cầu lên kế hoạch, tư vấn lộ trình, thảo luận thêm), hãy kết hợp linh hoạt giữa thông tin có trong tài liệu và kiến thức xã hội/kỹ thuật sâu rộng của bạn để trả lời và giúp đỡ người dùng một cách trọn vẹn nhất.
   - Tuyệt đối không trả lời máy móc theo kiểu "Dựa trên ngữ cảnh được cung cấp, tài liệu không có thông tin này...". Hãy trả lời tự nhiên như một chuyên gia tư vấn.
4. ĐỊNH DẠNG: Sử dụng markdown, danh sách gạch đầu dòng để câu trả lời rõ ràng và dễ theo dõi."""

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
