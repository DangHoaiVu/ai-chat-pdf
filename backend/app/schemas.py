from pydantic import BaseModel
from typing import List

class ChatRequest(BaseModel):
    question: str

class ChatResponse(BaseModel):
    answer: str
    sources: List[str]

class UploadResponse(BaseModel):
    success: bool
    fileId: str
    message: str
