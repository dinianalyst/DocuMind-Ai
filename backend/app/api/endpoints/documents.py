import os
from typing import List, Optional
from fastapi import APIRouter, UploadFile, File, HTTPException, BackgroundTasks
from app.services.document_service import document_service
from app.models.schemas import (
    DocumentResponse, 
    DocumentListResponse, 
    DocumentChunksResponse,
    DocumentMetadata
)

router = APIRouter(prefix="/documents", tags=["Documents"])

SUPPORTED_EXTENSIONS = {".pdf", ".docx", ".doc", ".txt", ".md", ".csv", ".json"}
MAX_FILE_SIZE = 25 * 1024 * 1024  # 25 MB limit

@router.post("/upload", response_model=DocumentResponse)
async def upload_document(file: UploadFile = File(...)):
    """
    Upload and index a document (PDF, DOCX, TXT) into the RAG vector database.
    """
    filename = file.filename or "unknown_document.txt"
    ext = os.path.splitext(filename)[1].lower()
    
    if ext not in SUPPORTED_EXTENSIONS:
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported file type '{ext}'. Supported formats: PDF, DOCX, TXT, MD, CSV, JSON."
        )

    try:
        contents = await file.read()
        if len(contents) > MAX_FILE_SIZE:
            raise HTTPException(status_code=400, detail="File exceeds maximum 25MB limit.")
        if len(contents) == 0:
            raise HTTPException(status_code=400, detail="Uploaded file is empty.")

        doc_meta = document_service.process_and_store_document(
            file_bytes=contents,
            filename=filename
        )
        
        if doc_meta.status == "failed":
            raise HTTPException(
                status_code=500,
                detail=f"Document processing failed: {doc_meta.error_message}"
            )
            
        return DocumentResponse(
            document=doc_meta,
            message=f"Successfully indexed '{filename}' ({doc_meta.chunk_count} chunks)."
        )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to process upload: {str(e)}")

@router.get("", response_model=DocumentListResponse)
async def list_documents():
    """
    Retrieves all indexed documents with metadata, page counts, and chunk statistics.
    """
    docs = document_service.get_all_documents()
    total_chunks = sum(d.chunk_count for d in docs)
    return DocumentListResponse(
        documents=docs,
        total_count=len(docs),
        total_chunks=total_chunks
    )

@router.get("/{document_id}", response_model=DocumentResponse)
async def get_document(document_id: str):
    """
    Get detailed metadata for a single document.
    """
    doc = document_service.get_document(document_id)
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found.")
    return DocumentResponse(document=doc)

@router.delete("/{document_id}")
async def delete_document(document_id: str):
    """
    Delete a document and purge all associated vector embeddings from ChromaDB.
    """
    success = document_service.delete_document(document_id)
    if not success:
        raise HTTPException(status_code=404, detail="Document not found or already deleted.")
    return {"message": "Document and associated vectors deleted successfully.", "document_id": document_id}

