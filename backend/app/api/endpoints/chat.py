from fastapi import APIRouter, HTTPException, Query
from typing import List, Optional
from app.services.chat_service import chat_service
from app.models.schemas import ChatRequest, ChatResponse, ChatMessage

router = APIRouter(prefix="/chat", tags=["Chat"])

@router.post("", response_model=ChatResponse)
async def chat_with_documents(request: ChatRequest):
    """
    Query indexed documents via semantic vector retrieval and generate grounded AI response.
    """
    if not request.question or not request.question.strip():
        raise HTTPException(status_code=400, detail="Question cannot be empty.")

    try:
        response = chat_service.process_chat_query(request)
        return response
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"RAG Chat failed: {str(e)}")

@router.get("/history", response_model=List[ChatMessage])
async def get_chat_history(session_id: str = Query("default", description="Session identifier")):
    """
    Get conversation message history for a given session.
    """
    return chat_service.get_session_history(session_id)

@router.delete("/history")
async def clear_chat_history(session_id: str = Query("default", description="Session identifier")):
    """
    Clear all messages for a given chat session.
    """
    chat_service.clear_session_history(session_id)
    return {"message": "Chat history cleared.", "session_id": session_id}
