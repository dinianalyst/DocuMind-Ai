from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from datetime import datetime

class DocumentMetadata(BaseModel):
    id: str
    filename: str
    original_filename: str
    file_type: str
    file_size: int
    page_count: int
    chunk_count: int
    char_count: int
    upload_timestamp: str
    status: str = "processed"  # "processing", "processed", "failed"
    error_message: Optional[str] = None

class DocumentResponse(BaseModel):
    document: DocumentMetadata
    message: str = "Success"

class DocumentListResponse(BaseModel):
    documents: List[DocumentMetadata]
    total_count: int
    total_chunks: int

class ChunkMetadata(BaseModel):
    id: str
    document_id: str
    filename: str
    page_number: int
    chunk_index: int
    char_count: int
    text: str
    preview: str

class DocumentChunksResponse(BaseModel):
    document_id: str
    filename: str
    total_chunks: int
    chunks: List[ChunkMetadata]

class SourceCitation(BaseModel):
    chunk_id: str
    document_id: str
    filename: str
    page_number: int
    chunk_index: int
    similarity_score: float  # Percentage (0 - 100) or normalized (0 - 1)
    text_snippet: str
    full_text: Optional[str] = None

class ChatMessage(BaseModel):
    role: str  # "user", "assistant", "system"
    content: str
    timestamp: Optional[str] = None
    citations: Optional[List[SourceCitation]] = None

class ChatRequest(BaseModel):
    question: str
    session_id: Optional[str] = "default"
    document_ids: Optional[List[str]] = None  # None or empty = all documents
    top_k: Optional[int] = None
    similarity_threshold: Optional[float] = None
    chat_history: Optional[List[ChatMessage]] = None
    use_stream: Optional[bool] = False

class ChatResponse(BaseModel):
    answer: str
    session_id: str
    citations: List[SourceCitation]
    retrieval_stats: Dict[str, Any]
    llm_model: str
    timestamp: str

class SearchQueryRequest(BaseModel):
    query: str
    document_ids: Optional[List[str]] = None
    top_k: Optional[int] = 5
    similarity_threshold: Optional[float] = 0.0

class SearchQueryResult(BaseModel):
    chunk_id: str
    document_id: str
    filename: str
    page_number: int
    chunk_index: int
    similarity_score: float
    text: str

class SearchResponse(BaseModel):
    query: str
    total_matches: int
    results: List[SearchQueryResult]

class SystemConfigResponse(BaseModel):
    project_name: str
    version: str
    model_name: str
    embedding_model: str
    has_api_key: bool
    top_k: int
    chunk_size: int
    chunk_overlap: int
    similarity_threshold: float
    total_documents: int
    total_chunks: int

class SystemConfigUpdateRequest(BaseModel):
    openai_api_key: Optional[str] = None
    openai_base_url: Optional[str] = None
    model_name: Optional[str] = None
    top_k: Optional[int] = None
    chunk_size: Optional[int] = None
    chunk_overlap: Optional[int] = None
    similarity_threshold: Optional[float] = None

class HealthResponse(BaseModel):
    status: str = "healthy"
    version: str
    timestamp: str
    vector_store_status: str
    documents_indexed: int
    total_vectors: int
