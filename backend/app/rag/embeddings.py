import os
import logging
from typing import List, Union
import numpy as np
from app.core.config import settings

logger = logging.getLogger(__name__)

class EmbeddingManager:
    """
    Manages vector embedding generation with support for:
    1. Local SentenceTransformers (all-MiniLM-L6-v2)
    2. OpenAI Embeddings (text-embedding-3-small)
    3. Resilient fallback vector generation
    """
    _instance = None
    _model = None
    _openai_client = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(EmbeddingManager, cls).__new__(cls)
            cls._instance._initialize()
        return cls._instance

    def _initialize(self):
        self.model_name = settings.EMBEDDING_MODEL
        self._local_model = None
        self._dimension = 384

    def _get_local_model(self):
        if self._local_model is None:
            try:
                from sentence_transformers import SentenceTransformer
                logger.info(f"Loading local SentenceTransformer embedding model: {self.model_name}")
                self._local_model = SentenceTransformer(self.model_name)
                if hasattr(self._local_model, "get_embedding_dimension"):
                    self._dimension = self._local_model.get_embedding_dimension()
                else:
                    self._dimension = self._local_model.get_sentence_embedding_dimension()
                logger.info(f"Loaded SentenceTransformer with dimension: {self._dimension}")
            except Exception as e:
                logger.warning(f"Could not load SentenceTransformer ({str(e)}). Using optimized fallback vectorizer.")
                self._local_model = False
        return self._local_model

    def _get_openai_client(self):
        if settings.OPENAI_API_KEY and self._openai_client is None:
            try:
                from openai import OpenAI
                self._openai_client = OpenAI(
                    api_key=settings.OPENAI_API_KEY,
                    base_url=settings.OPENAI_BASE_URL
                )
            except Exception as e:
                logger.error(f"Error initializing OpenAI client for embeddings: {e}")
                self._openai_client = None
        return self._openai_client

    def _fallback_embedding(self, text: str, dim: int = 384) -> List[float]:
        """
        Fast deterministic pseudo-semantic vector generation fallback
        using normalized character n-grams and hashing.
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
        """Generates embedding vector for a single string."""
        return self.generate_embeddings([text])[0]

    def generate_embeddings(self, texts: List[str]) -> List[List[float]]:
        """Generates embeddings for a batch of strings."""
        if not texts:
            return []

        # If OpenAI is configured and explicitly selected
        client = self._get_openai_client()
        if client and "openai" in settings.EMBEDDING_MODEL.lower():
            try:
                response = client.embeddings.create(
                    input=texts,
                    model="text-embedding-3-small"
                )
                return [data.embedding for data in response.data]
            except Exception as e:
                logger.warning(f"OpenAI embedding call failed ({e}). Falling back to local embedding.")

        # Local Sentence Transformers
        local_model = self._get_local_model()
        if local_model:
            try:
                embeddings = local_model.encode(
                    texts,
                    show_progress_bar=False,
                    normalize_embeddings=True
                )
                return embeddings.tolist()
            except Exception as e:
                logger.error(f"SentenceTransformer encoding error: {e}")

        # Fallback
        return [self._fallback_embedding(t) for t in texts]

embedding_manager = EmbeddingManager()
