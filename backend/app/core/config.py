import os
from pathlib import Path
from typing import Optional
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "DocuMind AI"
    VERSION: str = "1.0.0"
    API_PREFIX: str = "/api"
    
    # LLM Settings
    OPENAI_API_KEY: Optional[str] = os.getenv("OPENAI_API_KEY", "")
    OPENAI_BASE_URL: Optional[str] = os.getenv("OPENAI_BASE_URL", "https://api.openai.com/v1")
    MODEL_NAME: str = os.getenv("MODEL_NAME", "gpt-4o-mini")
    
    # Embeddings & Vector DB Settings
    EMBEDDING_MODEL: str = os.getenv("EMBEDDING_MODEL", "all-MiniLM-L6-v2")
    CHROMA_PERSIST_DIR: str = os.getenv(
        "CHROMA_PERSIST_DIRECTORY",
        str(Path(__file__).resolve().parent.parent.parent / "data" / "chroma_db")
    )
    UPLOAD_DIR: str = str(Path(__file__).resolve().parent.parent.parent / "data" / "uploads")
    SAMPLE_DOCS_DIR: str = str(Path(__file__).resolve().parent.parent.parent / "data" / "sample_docs")
    
    # RAG Hyperparameters
    TOP_K: int = 4
    CHUNK_SIZE: int = 600
    CHUNK_OVERLAP: int = 120
    SIMILARITY_THRESHOLD: float = 0.25  # Minimum similarity score (0.0 to 1.0)
    
    # CORS
    CORS_ORIGINS: list[str] = ["*"]

    class Config:
        env_file = ".env"
        extra = "ignore"

settings = Settings()

# Ensure directories exist
Path(settings.CHROMA_PERSIST_DIR).mkdir(parents=True, exist_ok=True)
Path(settings.UPLOAD_DIR).mkdir(parents=True, exist_ok=True)
Path(settings.SAMPLE_DOCS_DIR).mkdir(parents=True, exist_ok=True)
