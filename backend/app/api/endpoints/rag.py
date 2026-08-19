from fastapi import APIRouter, HTTPException
from typing import List
from app.rag.embeddings import embedding_manager
from app.rag.vector_store import vector_store_manager
from app.models.schemas import SearchQueryRequest, SearchResponse, SearchQueryResult

router = APIRouter(prefix="/rag", tags=["RAG Direct Search"])

@router.post("/search", response_model=SearchResponse)
async def semantic_search(request: SearchQueryRequest):
    """
    Perform direct vector similarity search without LLM generation for technical evaluation and debugging.
    """
    if not request.query or not request.query.strip():
        raise HTTPException(status_code=400, detail="Query cannot be empty.")

    try:
        query_vec = embedding_manager.generate_embedding(request.query)
        chunks = vector_store_manager.similarity_search(
            query_embedding=query_vec,
            top_k=request.top_k or 5,
            document_ids=request.document_ids,
            similarity_threshold=request.similarity_threshold or 0.0
        )
        
        results = [
            SearchQueryResult(
                chunk_id=c["chunk_id"],
                document_id=c["document_id"],
                filename=c["filename"],
                page_number=c["page_number"],
                chunk_index=c["chunk_index"],
                similarity_score=c["similarity_score"],
                text=c["text"]
            )
            for c in chunks
        ]
        
        return SearchResponse(
            query=request.query,
            total_matches=len(results),
            results=results
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Semantic search failed: {str(e)}")
