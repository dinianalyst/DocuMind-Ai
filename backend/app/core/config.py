import os
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

    # Embeddings — defaults to OpenAI for Vercel compatibility
    # SentenceTransformers are NOT supported on Vercel (model files exceed 250 MB limit).
    EMBEDDING_MODEL: str = os.getenv("EMBEDDING_MODEL", "openai-text-embedding-3-small")

    # Qdrant Cloud Vector DB (replaces ChromaDB for serverless / cloud deployments)
    QDRANT_URL: Optional[str] = os.getenv("QDRANT_URL", "")
    QDRANT_API_KEY: Optional[str] = os.getenv("QDRANT_API_KEY", "")
    QDRANT_COLLECTION: str = os.getenv("QDRANT_COLLECTION", "documind_vectors")

    # RAG Hyperparameters
    TOP_K: int = 4
    CHUNK_SIZE: int = 600
    CHUNK_OVERLAP: int = 120
    SIMILARITY_THRESHOLD: float = 0.25  # Minimum similarity score (0.0 to 1.0)

    # CORS — tighten in production by setting CORS_ORIGINS env var
    CORS_ORIGINS: list[str] = ["*"]

    class Config:
        env_file = ".env"
        extra = "ignore"


settings = Settings()
