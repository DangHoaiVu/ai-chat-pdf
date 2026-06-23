from fastapi import APIRouter, UploadFile, File, HTTPException, status
from app.schemas import ChatRequest, ChatResponse, UploadResponse
from app.config import settings
from app.services.pdf_service import extract_chunks_from_pdf
from app.services.vector_service import store_chunks, search_chunks, get_or_create_collection
from app.services.llm_service import generate_rag_answer
import uuid
import shutil
from pathlib import Path

router = APIRouter()

# Static ID since the current spec handles 1 active document at a time
ACTIVE_FILE_ID = "active_document"

@router.post("/upload", response_model=UploadResponse)
async def upload_pdf(file: UploadFile = File(...)):
    # 1. Validate PDF format
    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Chỉ hỗ trợ định dạng tập tin PDF."
        )
        
    # 2. Validate file size (20MB limit)
    # Read file size from spool
    file.file.seek(0, 2)
    file_size = file.file.tell()
    file.file.seek(0)
    
    max_size = 20 * 1024 * 1024
    if file_size > max_size:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Kích thước tập tin tối đa là 20MB."
        )
        
    # 3. Save file temporarily
    file_path = settings.upload_dir / f"{ACTIVE_FILE_ID}.pdf"
    try:
        with file_path.open("wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Không thể lưu tập tin: {str(exc)}"
        )

    # 4. Clear existing embeddings for the active document to avoid contamination
    try:
        collection = get_or_create_collection()
        collection.delete(where={"file_id": ACTIVE_FILE_ID})
    except Exception:
        # If collection doesn't exist or error during delete, proceed anyway
        pass

    # 5. Extract chunks
    try:
        chunks = extract_chunks_from_pdf(file_path)
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=f"Lỗi khi trích xuất tài liệu PDF: {str(exc)}"
        )
        
    if not chunks:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Tài liệu PDF không chứa văn bản hợp lệ để phân tích."
        )

    # 6. Store chunks in vector database
    try:
        store_chunks(ACTIVE_FILE_ID, chunks)
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Lỗi khi lưu trữ vector embedding: {str(exc)}"
        )
        
    return UploadResponse(
        success=True,
        fileId=ACTIVE_FILE_ID,
        message="Tải tập tin và phân tích dữ liệu thành công."
    )

@router.post("/chat", response_model=ChatResponse)
async def chat_with_pdf(request: ChatRequest):
    # 1. Check if we have an active document uploaded
    file_path = settings.upload_dir / f"{ACTIVE_FILE_ID}.pdf"
    if not file_path.exists():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Vui lòng tải lên tài liệu PDF trước khi trò chuyện."
        )

    # 2. Similarity search
    try:
        context_chunks = search_chunks(ACTIVE_FILE_ID, request.question, top_k=5)
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Lỗi khi tìm kiếm ngữ cảnh: {str(exc)}"
        )
        
    if not context_chunks:
        return ChatResponse(
            answer="Tôi không tìm thấy ngữ cảnh nào liên quan trong tài liệu để trả lời câu hỏi này.",
            sources=[]
        )

    # 3. Generate answer via OpenRouter RAG
    answer = await generate_rag_answer(request.question, context_chunks)
    
    # 4. Extract unique source page citations
    sources = []
    for chunk in context_chunks:
        source_label = chunk["metadata"].get("source")
        if source_label and source_label not in sources:
            sources.append(source_label)
            
    # Sort sources (e.g. Page 1, Page 2)
    try:
        sources.sort(key=lambda s: int(s.replace("Page ", "")))
    except ValueError:
        sources.sort()
        
    return ChatResponse(
        answer=answer,
        sources=sources
    )
