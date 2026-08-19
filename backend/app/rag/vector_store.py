import os
import json
import logging
from typing import List, Dict, Any, Optional
import chromadb
from chromadb.config import Settings as ChromaSettings
from app.core.config import settings

logger = logging.getLogger(__name__)

class VectorStoreManager:
    """
    Manages persistent ChromaDB vector storage, collection indexing,
    similarity search queries, and chunk retrieval with metadata.
    """
    _instance = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(VectorStoreManager, cls).__new__(cls)
            cls._instance._initialize()
        return cls._instance

    def _initialize(self):
        persist_dir = settings.CHROMA_PERSIST_DIR
        os.makedirs(persist_dir, exist_ok=True)
        
        logger.info(f"Initializing ChromaDB vector store at {persist_dir}")
        self.client = chromadb.PersistentClient(
            path=persist_dir,
            settings=ChromaSettings(
                anonymized_telemetry=False,
                allow_reset=True
            )
        )
        
        # Create or get collection with cosine space
        self.collection_name = "documind_vectors"
        self.collection = self.client.get_or_create_collection(
            name=self.collection_name,
            metadata={"hnsw:space": "cosine"}
        )
        
        # In-memory document registry metadata json path
        self.registry_file = os.path.join(persist_dir, "documents_registry.json")
        self._load_registry()

    def _load_registry(self):
        if os.path.exists(self.registry_file):
            try:
                with open(self.registry_file, "r", encoding="utf-8") as f:
                    self.registry = json.load(f)
            except Exception as e:
                logger.error(f"Error loading registry: {e}")
                self.registry = {}
        else:
            self.registry = {}

    def _save_registry(self):
        try:
            with open(self.registry_file, "w", encoding="utf-8") as f:
                json.dump(self.registry, f, indent=2)
        except Exception as e:
            logger.error(f"Error saving registry: {e}")

    def add_document(self, doc_metadata: Dict[str, Any], chunks: List[Dict[str, Any]], embeddings: List[List[float]]):
        """
        Stores document metadata in registry and inserts chunks + embeddings into Chroma.
        """
        doc_id = doc_metadata["id"]
        
        if chunks and embeddings:
            ids = [c["id"] for c in chunks]
            texts = [c["text"] for c in chunks]
            metadatas = [
                {
                    "document_id": c["document_id"],
                    "filename": c["filename"],
                    "page_number": int(c["page_number"]),
                    "chunk_index": int(c["chunk_index"]),
                    "char_count": int(c["char_count"])
                }
                for c in chunks
            ]
            
            # Upsert into Chroma
            self.collection.upsert(
                ids=ids,
                embeddings=embeddings,
                metadatas=metadatas,
                documents=texts
            )
            
        # Update registry
        self.registry[doc_id] = doc_metadata
        self._save_registry()
        logger.info(f"Indexed document {doc_metadata['filename']} ({doc_id}) with {len(chunks)} chunks.")

    def get_all_documents(self) -> List[Dict[str, Any]]:
        """Returns all documents in the registry."""
        return list(self.registry.values())

    def get_document(self, document_id: str) -> Optional[Dict[str, Any]]:
        """Returns a single document metadata."""
        return self.registry.get(document_id)

    def delete_document(self, document_id: str) -> bool:
        """Deletes all chunks of a document from Chroma and removes it from registry."""
        try:
            # Delete from chroma
            self.collection.delete(
                where={"document_id": document_id}
            )
        except Exception as e:
            logger.warning(f"Chroma delete where error: {e}")
            
        # Delete from registry
        if document_id in self.registry:
            del self.registry[document_id]
            self._save_registry()
            return True
        return False

    def get_document_chunks(self, document_id: str) -> List[Dict[str, Any]]:
        """Retrieves all chunk records for a given document."""
        try:
            results = self.collection.get(
                where={"document_id": document_id},
                include=["metadatas", "documents"]
            )
            
            chunks = []
            if results and results.get("ids"):
                for i, cid in enumerate(results["ids"]):
                    meta = results["metadatas"][i] if results.get("metadatas") else {}
                    text = results["documents"][i] if results.get("documents") else ""
                    chunks.append({
                        "id": cid,
                        "document_id": document_id,
                        "filename": meta.get("filename", ""),
                        "page_number": meta.get("page_number", 1),
                        "chunk_index": meta.get("chunk_index", i),
                        "char_count": len(text),
                        "text": text,
                        "preview": text[:120] + "..." if len(text) > 120 else text
                    })
            # Sort by chunk_index
            chunks.sort(key=lambda x: x["chunk_index"])
            return chunks
        except Exception as e:
            logger.error(f"Error fetching chunks for {document_id}: {e}")
            return []

    def similarity_search(
        self,
        query_embedding: List[float],
        top_k: int = 4,
        document_ids: Optional[List[str]] = None,
        similarity_threshold: float = 0.0
    ) -> List[Dict[str, Any]]:
        """
        Performs vector similarity search against Chroma collection.
        Returns matched chunks with cosine similarity score.
        """
        total_count = self.collection.count()
        if total_count == 0:
            return []

        n_results = min(top_k * 2, total_count)
        
        where_filter = None
        if document_ids and len(document_ids) == 1:
            where_filter = {"document_id": document_ids[0]}
        elif document_ids and len(document_ids) > 1:
            where_filter = {"document_id": {"$in": document_ids}}

        try:
            results = self.collection.query(
                query_embeddings=[query_embedding],
                n_results=n_results,
                where=where_filter,
                include=["metadatas", "documents", "distances"]
            )
        except Exception as e:
            logger.error(f"Chroma query error: {e}")
            return []

        matched_chunks = []
        if results and results.get("ids") and len(results["ids"]) > 0:
            ids = results["ids"][0]
            metadatas = results["metadatas"][0] if results.get("metadatas") else []
            documents = results["documents"][0] if results.get("documents") else []
            distances = results["distances"][0] if results.get("distances") else []

            for i in range(len(ids)):
                dist = distances[i] if i < len(distances) else 1.0
                # In cosine distance [0, 2], similarity is 1.0 - (dist / 2.0)
                similarity = max(0.0, min(1.0, 1.0 - (dist / 2.0)))
                
                if similarity >= similarity_threshold:
                    meta = metadatas[i] if i < len(metadatas) else {}
                    text = documents[i] if i < len(documents) else ""
                    
                    matched_chunks.append({
                        "chunk_id": ids[i],
                        "document_id": meta.get("document_id", ""),
                        "filename": meta.get("filename", ""),
                        "page_number": meta.get("page_number", 1),
                        "chunk_index": meta.get("chunk_index", 0),
                        "similarity_score": round(similarity * 100, 2),  # In % (e.g. 92.4%)
                        "similarity_raw": similarity,
                        "text": text,
                        "preview": text[:150] + "..." if len(text) > 150 else text
                    })

        # Sort by similarity descending and slice top_k
        matched_chunks.sort(key=lambda x: x["similarity_raw"], reverse=True)
        return matched_chunks[:top_k]

    def get_total_vectors(self) -> int:
        """Returns total vectors stored in ChromaDB."""
        try:
            return self.collection.count()
        except Exception:
            return 0

vector_store_manager = VectorStoreManager()
