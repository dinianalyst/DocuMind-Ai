import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.api.router import api_router
from app.services.document_service import document_service

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s"
)
logger = logging.getLogger(__name__)

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: Seed initial portfolio knowledge base documents
    logger.info(f"Starting {settings.PROJECT_NAME} v{settings.VERSION}...")
    try:
        document_service.seed_sample_knowledge_base()
    except Exception as e:
        logger.error(f"Error seeding sample documents: {e}")
    yield
    # Shutdown
    logger.info(f"Shutting down {settings.PROJECT_NAME}...")

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="Production-grade RAG AI Document Assistant powered by FastAPI, ChromaDB, and LangChain.",
    lifespan=lifespan
)

# Enable CORS for Frontend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount API router
app.include_router(api_router, prefix=settings.API_PREFIX)

# Optional Static Frontend Mounting for Single-Container Deployment (e.g. Hugging Face Spaces / Render)
frontend_dist = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))), "frontend", "dist")
if os.path.exists(frontend_dist):
    from fastapi.staticfiles import StaticFiles
    from fastapi.responses import FileResponse
    
    app.mount("/assets", StaticFiles(directory=os.path.join(frontend_dist, "assets")), name="assets")
    
    @app.get("/{full_path:path}")
    async def serve_spa(full_path: str):
        if full_path.startswith("api/") or full_path == "api" or full_path.startswith("docs") or full_path.startswith("openapi.json"):
            return None
        file_path = os.path.join(frontend_dist, full_path)
        if os.path.exists(file_path) and os.path.isfile(file_path):
            return FileResponse(file_path)
        return FileResponse(os.path.join(frontend_dist, "index.html"))
else:
    @app.get("/")
    async def root():
        return {
            "app": settings.PROJECT_NAME,
            "version": settings.VERSION,
            "status": "operational",
            "docs_url": "/docs",
            "api_prefix": settings.API_PREFIX
        }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
