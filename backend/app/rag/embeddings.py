import logging
from typing import List
import numpy as np
from app.core.config import settings

logger = logging.getLogger(__name__)


class EmbeddingManager:
    """
    Manages vector embedding generation.

    On Vercel (serverless), SentenceTransformers cannot be used because the model
    files (~90 MB) combined with all other dependencies exceed Vercel's 250 MB limit,
    and cold-start loading would be prohibitively slow.

    Strategy (in priority order):
    1. OpenAI `text-embedding-3-small` via API  ← default for cloud/Vercel
    2. Deterministic hash-based fallback (for demo / no API key)
    """

    _instance = None
    _openai_client = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(EmbeddingManager, cls).__new__(cls)
            cls._instance._initialize()
        return cls._instance

    def _initialize(self):
        self.model_name = settings.EMBEDDING_MODEL
        # OpenAI text-embedding-3-small produces 1536-dimensional vectors
        self._dimension = 1536

    def _get_openai_client(self):
        if settings.OPENAI_API_KEY and self._openai_client is None:
            try:
                from openai import OpenAI

                self._openai_client = OpenAI(
                    api_key=settings.OPENAI_API_KEY,
                    base_url=settings.OPENAI_BASE_URL,
                )
            except Exception as e:
                logger.error(f"Error initialising OpenAI client for embeddings: {e}")
                self._openai_client = None
        return self._openai_client

    def _fallback_embedding(self, text: str, dim: int = 1536) -> List[float]:
        """
        Fast deterministic pseudo-semantic vector (no external dependency).
        Used only when no OpenAI API key is configured.
        NOTE: Semantic quality is limited — only suitable for demo / testing.
        """
        vec = np.zeros(dim, dtype=np.float32)
        words = text.lower().split()
        for i, word in enumerate(words):
            h = hash(word)
            idx1 = abs(h) % dim
            idx2 = abs(hash(word + str(i))) % dim
            vec[idx1] += 1.0 / (1.0 + 0.1 * i)
            vec[idx2] += 0.5
        norm = np.linalg.norm(vec)
        if norm > 0:
            vec = vec / norm
        return vec.tolist()

    def generate_embedding(self, text: str) -> List[float]:
        """Generates an embedding vector for a single string."""
        return self.generate_embeddings([text])[0]

    def generate_embeddings(self, texts: List[str]) -> List[List[float]]:
        """Generates embeddings for a batch of strings."""
        if not texts:
            return []

        client = self._get_openai_client()
        if client:
            try:
                response = client.embeddings.create(
                    input=texts,
                    model="text-embedding-3-small",
                )
                return [data.embedding for data in response.data]
            except Exception as e:
                logger.warning(
                    f"OpenAI embedding call failed ({e}). Falling back to hash-based embeddings."
                )

        # Fallback — works without any API key (semantic quality is reduced)
        logger.info("Using hash-based fallback embeddings (no OpenAI API key configured).")
        return [self._fallback_embedding(t, dim=self._dimension) for t in texts]


embedding_manager = EmbeddingManager()
