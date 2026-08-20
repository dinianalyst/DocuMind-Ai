from datetime import datetime
from fastapi import APIRouter
from app.core.config import settings
from app.rag.vector_store import vector_store_manager
from app.models.schemas import SystemConfigResponse, SystemConfigUpdateRequest, HealthResponse

router = APIRouter(tags=["Config & Health"])

@router.get("/config", response_model=SystemConfigResponse)
async def get_system_config():
    """
    Get current RAG configuration parameters and runtime statistics.
    """
    docs = vector_store_manager.get_all_documents()
    total_vectors = vector_store_manager.get_total_vectors()
    
    return SystemConfigResponse(
        project_name=settings.PROJECT_NAME,
        version=settings.VERSION,
        model_name=settings.MODEL_NAME,
        embedding_model=settings.EMBEDDING_MODEL,
        has_api_key=bool(settings.OPENAI_API_KEY and len(settings.OPENAI_API_KEY.strip()) > 5),
        top_k=settings.TOP_K,
        chunk_size=settings.CHUNK_SIZE,
        chunk_overlap=settings.CHUNK_OVERLAP,
        similarity_threshold=settings.SIMILARITY_THRESHOLD,
        total_documents=len(docs),
        total_chunks=total_vectors
    )

@router.post("/config", response_model=SystemConfigResponse)
async def update_system_config(req: SystemConfigUpdateRequest):
    """
    Update live runtime RAG hyperparameters or API credentials.
    """
    if req.openai_api_key is not None:
        settings.OPENAI_API_KEY = req.openai_api_key.strip()
    if req.openai_base_url is not None:
        settings.OPENAI_BASE_URL = req.openai_base_url.strip()
    if req.model_name is not None:
        settings.MODEL_NAME = req.model_name.strip()
    if req.top_k is not None:
        settings.TOP_K = max(1, min(20, req.top_k))
    if req.chunk_size is not None:
        settings.CHUNK_SIZE = max(100, min(4000, req.chunk_size))
    if req.chunk_overlap is not None:
        settings.CHUNK_OVERLAP = max(0, min(1000, req.chunk_overlap))
    if req.similarity_threshold is not None:
        settings.SIMILARITY_THRESHOLD = max(0.0, min(1.0, req.similarity_threshold))

    return await get_system_config()

@router.get("/health", response_model=HealthResponse)
async def health_check():
    """
    System health check and vector store verification.
    """
    total_vectors = vector_store_manager.get_total_vectors()
    docs = vector_store_manager.get_all_documents()
    
    return HealthResponse(
        status="healthy",
        version=settings.VERSION,
        timestamp=datetime.now().isoformat(),
        vector_store_status="online (Qdrant Cloud)",
        documents_indexed=len(docs),
        total_vectors=total_vectors
    )
