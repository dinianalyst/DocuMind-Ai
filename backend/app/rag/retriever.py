import logging
from typing import List, Dict, Any, Optional, Tuple
from app.core.config import settings
from app.rag.embeddings import embedding_manager
from app.rag.vector_store import vector_store_manager
from app.models.schemas import SourceCitation

logger = logging.getLogger(__name__)

class DocumentRetriever:
    """
    Orchestrates semantic retrieval:
    1. Generates query vector embedding
    2. Executes similarity search across indexed document chunks
    3. Formats source citations and context prompt injection block
    """

    def __init__(self):
        self.embedding_mgr = embedding_manager
        self.vector_store = vector_store_manager

    def retrieve_context(
        self,
        query: str,
        document_ids: Optional[List[str]] = None,
        top_k: Optional[int] = None,
        similarity_threshold: Optional[float] = None
    ) -> Tuple[str, List[SourceCitation], Dict[str, Any]]:
        """
        Retrieves relevant chunks and builds structured context for LLM generation.
        Returns: (formatted_context_string, citations_list, retrieval_stats)
        """
        k = top_k or settings.TOP_K
        threshold = similarity_threshold if similarity_threshold is not None else settings.SIMILARITY_THRESHOLD
        
        # 1. Generate query embedding
        query_embedding = self.embedding_mgr.generate_embedding(query)
        
        # 2. Similarity search in ChromaDB
        matched_chunks = self.vector_store.similarity_search(
            query_embedding=query_embedding,
            top_k=k,
            document_ids=document_ids,
            similarity_threshold=threshold
        )
        
        # 3. Format citations and context block
        citations: List[SourceCitation] = []
        context_blocks: List[str] = []

        for idx, chunk in enumerate(matched_chunks):
            # Create citation object
            snippet = chunk["text"][:240].strip() + ("..." if len(chunk["text"]) > 240 else "")
            citation = SourceCitation(
                chunk_id=chunk["chunk_id"],
                document_id=chunk["document_id"],
                filename=chunk["filename"],
                page_number=chunk["page_number"],
                chunk_index=chunk["chunk_index"],
                similarity_score=chunk["similarity_score"],
                text_snippet=snippet,
                full_text=chunk["text"]
            )
            citations.append(citation)

            # Build formatted context block
            context_blocks.append(
                f"--- [SOURCE {idx + 1}: {chunk['filename']} | Page {chunk['page_number']} | Similarity: {chunk['similarity_score']}%] ---\n"
                f"{chunk['text']}\n"
            )

        formatted_context = "\n".join(context_blocks)
        
        retrieval_stats = {
            "query": query,
            "chunks_retrieved": len(matched_chunks),
            "top_k": k,
            "similarity_threshold": threshold,
            "highest_similarity": matched_chunks[0]["similarity_score"] if matched_chunks else 0.0,
            "document_filter": document_ids or "all"
        }

        return formatted_context, citations, retrieval_stats

retriever = DocumentRetriever()
