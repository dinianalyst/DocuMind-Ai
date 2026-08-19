import logging
from datetime import datetime
from typing import List, Dict, Any, Optional
from app.rag.retriever import retriever
from app.rag.generator import generator
from app.models.schemas import ChatRequest, ChatResponse, ChatMessage
from app.core.config import settings

logger = logging.getLogger(__name__)

class ChatService:
    """
    Manages chat sessions, conversational context, RAG orchestration, and history persistence.
    """

    def __init__(self):
        self.retriever = retriever
        self.generator = generator
        # In-memory session history storage {session_id: [ChatMessage]}
        self.sessions: Dict[str, List[ChatMessage]] = {}

    def get_session_history(self, session_id: str) -> List[ChatMessage]:
        return self.sessions.get(session_id, [])

    def clear_session_history(self, session_id: str):
        if session_id in self.sessions:
            self.sessions[session_id] = []

    def process_chat_query(self, req: ChatRequest) -> ChatResponse:
        """
        Executes RAG conversational query:
        1. Retrieves relevant document context & source citations from ChromaDB.
        2. Injects retrieved context into grounded generator prompt.
        3. Formulates response and appends to session history.
        """
        session_id = req.session_id or "default"
        timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

        # 1. Retrieve Context and Source Citations
        context_str, citations, retrieval_stats = self.retriever.retrieve_context(
            query=req.question,
            document_ids=req.document_ids,
            top_k=req.top_k,
            similarity_threshold=req.similarity_threshold
        )

        # 2. Get history for conversational context
        session_msgs = self.sessions.get(session_id, [])
        history_dicts = [{"role": m.role, "content": m.content} for m in session_msgs]

        # 3. Generate grounded answer
        answer = self.generator.generate_answer(
            question=req.question,
            context=context_str,
            citations=citations,
            chat_history=history_dicts
        )

        # 4. Save to history
        user_msg = ChatMessage(role="user", content=req.question, timestamp=timestamp)
        assistant_msg = ChatMessage(role="assistant", content=answer, timestamp=timestamp, citations=citations)
        
        if session_id not in self.sessions:
            self.sessions[session_id] = []
        self.sessions[session_id].append(user_msg)
        self.sessions[session_id].append(assistant_msg)

        model_name = settings.MODEL_NAME if settings.OPENAI_API_KEY else "DocuMind Grounded RAG Engine"

        return ChatResponse(
            answer=answer,
            session_id=session_id,
            citations=citations,
            retrieval_stats=retrieval_stats,
            llm_model=model_name,
            timestamp=timestamp
        )

chat_service = ChatService()
