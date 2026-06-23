import os
from pathlib import Path
from dataclasses import dataclass
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

@dataclass(frozen=True)
class Settings:
    openrouter_api_key: str = os.getenv("OPENROUTER_API_KEY", "").strip()
    openrouter_model: str = os.getenv("OPENROUTER_MODEL", "google/gemini-2.5-flash").strip()
    chroma_db_dir: Path = Path(os.getenv("CHROMA_DB_DIR", Path(__file__).resolve().parent.parent / "chroma_db"))
    upload_dir: Path = Path(os.getenv("UPLOAD_DIR", Path(__file__).resolve().parent.parent / "uploaded_files"))
    frontend_url: str = os.getenv("FRONTEND_URL", "http://localhost:3000").strip()

settings = Settings()

# Create directories if they don't exist
settings.chroma_db_dir.mkdir(parents=True, exist_ok=True)
settings.upload_dir.mkdir(parents=True, exist_ok=True)
