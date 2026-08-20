import logging
from typing import List, Dict, Any, Optional

from app.core.config import settings

logger = logging.getLogger(__name__)

# Qdrant vector dimension — must match the embedding model:
# OpenAI text-embedding-3-small → 1536 dimensions
# Fallback hash-based embeddings → 384 dimensions
VECTOR_DIM = 1536


class VectorStoreManager:
    """
    Manages cloud vector storage via Qdrant Cloud, replacing the local ChromaDB store.
    Provides the same interface as the original ChromaDB implementation so all
    upstream code (retriever, document_service) is unaffected.

    Document metadata (registry) is stored directly in Qdrant point payloads,
    eliminating the need for a local JSON registry file.
    """

    _instance = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(VectorStoreManager, cls).__new__(cls)
            cls._instance._initialized = False
        return cls._instance

    def _get_client(self):
        """Lazily initialise the Qdrant client on first use."""
        if not self._initialized:
            try:
                from qdrant_client import QdrantClient
                from qdrant_client.models import Distance, VectorParams

                if settings.QDRANT_URL and settings.QDRANT_API_KEY:
                    logger.info(f"Connecting to Qdrant Cloud at {settings.QDRANT_URL}")
                    self._client = QdrantClient(
                        url=settings.QDRANT_URL,
                        api_key=settings.QDRANT_API_KEY,
                        timeout=30,
                    )
                else:
                    # In-memory Qdrant for local development / demo without credentials
                    logger.warning(
                        "QDRANT_URL / QDRANT_API_KEY not set — using in-memory Qdrant. "
                        "Data will NOT persist across restarts."
                    )
                    self._client = QdrantClient(":memory:")

                # Ensure the collection exists
                existing = [c.name for c in self._client.get_collections().collections]
                if settings.QDRANT_COLLECTION not in existing:
                    self._client.create_collection(
                        collection_name=settings.QDRANT_COLLECTION,
                        vectors_config=VectorParams(size=VECTOR_DIM, distance=Distance.COSINE),
                    )
                    logger.info(f"Created Qdrant collection '{settings.QDRANT_COLLECTION}'")
                else:
                    logger.info(f"Using existing Qdrant collection '{settings.QDRANT_COLLECTION}'")

                self._initialized = True
            except Exception as e:
                logger.error(f"Failed to initialise Qdrant client: {e}")
                self._client = None
                self._initialized = True  # prevent retry spam

        return self._client

    # ------------------------------------------------------------------
    # Document registry helpers (stored in Qdrant payloads)
    # ------------------------------------------------------------------

    @property
    def registry(self) -> Dict[str, Any]:
        """
        Builds an in-memory registry from Qdrant payloads by scrolling for
        unique document_id entries.  This is cached per-request (lazy).
        """
        return self._build_registry()

    def _build_registry(self) -> Dict[str, Any]:
        client = self._get_client()
        if client is None:
            return {}
        try:
            from qdrant_client.models import Filter, FieldCondition, MatchValue
            reg: Dict[str, Any] = {}
            offset = None
            while True:
                results, next_offset = client.scroll(
                    collection_name=settings.QDRANT_COLLECTION,
                    scroll_filter=None,
                    limit=256,
                    offset=offset,
                    with_payload=True,
                    with_vectors=False,
                )
                for point in results:
                    p = point.payload or {}
                    doc_id = p.get("document_id")
                    if doc_id and doc_id not in reg:
                        # Reconstruct doc metadata from payload
                        reg[doc_id] = {
                            "id": doc_id,
                            "filename": p.get("filename", ""),
                            "original_filename": p.get("original_filename", p.get("filename", "")),
                            "file_type": p.get("file_type", ""),
                            "file_size": p.get("file_size", 0),
                            "page_count": p.get("page_count", 0),
                            "chunk_count": p.get("chunk_count", 0),
                            "char_count": p.get("char_count", 0),
                            "upload_timestamp": p.get("upload_timestamp", ""),
                            "status": p.get("status", "processed"),
                        }
                if next_offset is None:
                    break
                offset = next_offset
            return reg
        except Exception as e:
            logger.error(f"Error building registry from Qdrant: {e}")
            return {}

    def _save_registry(self):
        """No-op — registry is stored as Qdrant payload, no local file needed."""
        pass

    # ------------------------------------------------------------------
    # Public API (mirrors ChromaDB VectorStoreManager)
    # ------------------------------------------------------------------

    def add_document(
        self,
        doc_metadata: Dict[str, Any],
        chunks: List[Dict[str, Any]],
        embeddings: List[List[float]],
    ):
        """Upserts all chunk vectors and metadata into Qdrant."""
        client = self._get_client()
        if client is None:
            logger.error("Qdrant client unavailable — skipping add_document.")
            return

        from qdrant_client.models import PointStruct
        import uuid

        points = []
        for chunk, embedding in zip(chunks, embeddings):
            # Pad / trim embedding to VECTOR_DIM if needed (fallback produces 384-dim)
            vec = embedding
            if len(vec) != VECTOR_DIM:
                if len(vec) < VECTOR_DIM:
                    vec = vec + [0.0] * (VECTOR_DIM - len(vec))
                else:
                    vec = vec[:VECTOR_DIM]

            payload = {
                "document_id": chunk["document_id"],
                "filename": chunk["filename"],
                "page_number": int(chunk.get("page_number", 1)),
                "chunk_index": int(chunk.get("chunk_index", 0)),
                "char_count": int(chunk.get("char_count", len(chunk["text"]))),
                "text": chunk["text"],
                # Document-level metadata duplicated on every point (for registry rebuild)
                "original_filename": doc_metadata.get("original_filename", chunk["filename"]),
                "file_type": doc_metadata.get("file_type", ""),
                "file_size": doc_metadata.get("file_size", 0),
                "page_count": doc_metadata.get("page_count", 0),
                "chunk_count": doc_metadata.get("chunk_count", len(chunks)),
                "char_count_doc": doc_metadata.get("char_count", 0),
                "upload_timestamp": doc_metadata.get("upload_timestamp", ""),
                "status": doc_metadata.get("status", "processed"),
            }

            # Use deterministic UUID from chunk id string
            point_id = str(uuid.uuid5(uuid.NAMESPACE_URL, chunk["id"]))
            points.append(PointStruct(id=point_id, vector=vec, payload=payload))

        if points:
            client.upsert(collection_name=settings.QDRANT_COLLECTION, points=points)
            logger.info(
                f"Indexed document '{doc_metadata['filename']}' "
                f"({doc_metadata['id']}) with {len(points)} chunks into Qdrant."
            )

    def get_all_documents(self) -> List[Dict[str, Any]]:
        """Returns all documents from the Qdrant-backed registry."""
        return list(self._build_registry().values())

    def get_document(self, document_id: str) -> Optional[Dict[str, Any]]:
        """Returns metadata for a single document."""
        return self._build_registry().get(document_id)

    def delete_document(self, document_id: str) -> bool:
        """Deletes all vectors for a document from Qdrant."""
        client = self._get_client()
        if client is None:
            return False
        try:
            from qdrant_client.models import Filter, FieldCondition, MatchValue

            client.delete(
                collection_name=settings.QDRANT_COLLECTION,
                points_selector=Filter(
                    must=[FieldCondition(key="document_id", match=MatchValue(value=document_id))]
                ),
            )
            logger.info(f"Deleted all vectors for document '{document_id}' from Qdrant.")
            return True
        except Exception as e:
            logger.error(f"Error deleting document '{document_id}' from Qdrant: {e}")
            return False

    def get_document_chunks(self, document_id: str) -> List[Dict[str, Any]]:
        """Retrieves all chunks for a given document from Qdrant."""
        client = self._get_client()
        if client is None:
            return []
        try:
            from qdrant_client.models import Filter, FieldCondition, MatchValue

            results, _ = client.scroll(
                collection_name=settings.QDRANT_COLLECTION,
                scroll_filter=Filter(
                    must=[FieldCondition(key="document_id", match=MatchValue(value=document_id))]
                ),
                limit=1000,
                with_payload=True,
                with_vectors=False,
            )

            chunks = []
            for point in results:
                p = point.payload or {}
                text = p.get("text", "")
                chunks.append(
                    {
                        "id": str(point.id),
                        "document_id": document_id,
                        "filename": p.get("filename", ""),
                        "page_number": p.get("page_number", 1),
                        "chunk_index": p.get("chunk_index", 0),
                        "char_count": len(text),
                        "text": text,
                        "preview": text[:120] + "..." if len(text) > 120 else text,
                    }
                )

            chunks.sort(key=lambda x: x["chunk_index"])
            return chunks
        except Exception as e:
            logger.error(f"Error fetching chunks for '{document_id}': {e}")
            return []

    def similarity_search(
        self,
        query_embedding: List[float],
        top_k: int = 4,
        document_ids: Optional[List[str]] = None,
        similarity_threshold: float = 0.0,
    ) -> List[Dict[str, Any]]:
        """Performs cosine similarity search in Qdrant."""
        client = self._get_client()
        if client is None:
            return []

        # Pad / trim query embedding to VECTOR_DIM
        vec = query_embedding
        if len(vec) != VECTOR_DIM:
            if len(vec) < VECTOR_DIM:
                vec = vec + [0.0] * (VECTOR_DIM - len(vec))
            else:
                vec = vec[:VECTOR_DIM]

        try:
            query_filter = None
            if document_ids:
                from qdrant_client.models import Filter, FieldCondition, MatchAny, MatchValue

                if len(document_ids) == 1:
                    query_filter = Filter(
                        must=[FieldCondition(key="document_id", match=MatchValue(value=document_ids[0]))]
                    )
                else:
                    query_filter = Filter(
                        must=[FieldCondition(key="document_id", match=MatchAny(any=document_ids))]
                    )

            results = client.search(
                collection_name=settings.QDRANT_COLLECTION,
                query_vector=vec,
                query_filter=query_filter,
                limit=top_k * 2,
                with_payload=True,
            )

            matched_chunks = []
            for hit in results:
                # Qdrant cosine score is in [−1, 1]; normalise to [0, 1]
                similarity = max(0.0, min(1.0, (hit.score + 1.0) / 2.0))
                if similarity < similarity_threshold:
                    continue

                p = hit.payload or {}
                text = p.get("text", "")
                matched_chunks.append(
                    {
                        "chunk_id": str(hit.id),
                        "document_id": p.get("document_id", ""),
                        "filename": p.get("filename", ""),
                        "page_number": p.get("page_number", 1),
                        "chunk_index": p.get("chunk_index", 0),
                        "similarity_score": round(similarity * 100, 2),
                        "similarity_raw": similarity,
                        "text": text,
                        "preview": text[:150] + "..." if len(text) > 150 else text,
                    }
                )

            matched_chunks.sort(key=lambda x: x["similarity_raw"], reverse=True)
            return matched_chunks[:top_k]

        except Exception as e:
            logger.error(f"Qdrant similarity search error: {e}")
            return []

    def get_total_vectors(self) -> int:
        """Returns total vectors stored in Qdrant."""
        client = self._get_client()
        if client is None:
            return 0
        try:
            info = client.get_collection(settings.QDRANT_COLLECTION)
            return info.points_count or 0
        except Exception:
            return 0


vector_store_manager = VectorStoreManager()
