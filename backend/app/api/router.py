from fastapi import APIRouter
from app.api.endpoints import documents, chat, rag, config

api_router = APIRouter()

api_router.include_router(documents.router)
api_router.include_router(chat.router)
api_router.include_router(rag.router)
api_router.include_router(config.router)
