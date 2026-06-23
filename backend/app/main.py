from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import api
from app.config import settings

app = FastAPI(
    title="AI Chat PDF API",
    description="API backend for uploading PDFs and chatting with them using RAG",
    version="1.0.0"
)

# Set up CORS
origins = [
    settings.frontend_url,
    "http://localhost:3000",
    "http://127.0.0.1:3000"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API Router
app.include_router(api.router, prefix="/api")

@app.get("/")
def read_root():
    return {"message": "AI Chat PDF API is running."}
