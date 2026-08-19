import os
import uuid
import logging
from datetime import datetime
from typing import List, Dict, Any, Optional
from pathlib import Path

from app.core.config import settings
from app.rag.extractor import DocumentExtractor
from app.rag.chunker import DocumentChunker
from app.rag.embeddings import embedding_manager
from app.rag.vector_store import vector_store_manager
from app.models.schemas import DocumentMetadata, ChunkMetadata

logger = logging.getLogger(__name__)

class DocumentService:
    """
    Manages document processing lifecycle:
    Upload -> Extraction -> Chunking -> Vector Embeddings -> ChromaDB Storage.
    """

    def __init__(self):
        self.extractor = DocumentExtractor
        self.chunker = DocumentChunker()
        self.embeddings = embedding_manager
        self.vector_store = vector_store_manager

    def process_and_store_document(
        self,
        file_bytes: bytes,
        filename: str,
        document_id: Optional[str] = None
    ) -> DocumentMetadata:
        """
        Executes end-to-end ingestion pipeline for an uploaded file.
        """
        doc_id = document_id or f"doc_{uuid.uuid4().hex[:10]}"
        timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        
        # Save raw file to uploads directory
        safe_filename = f"{doc_id}_{filename}"
        upload_path = os.path.join(settings.UPLOAD_DIR, safe_filename)
        with open(upload_path, "wb") as f:
            f.write(file_bytes)
            
        try:
            # 1. Text Extraction
            pages_data, file_type = self.extractor.extract(file_bytes, filename)
            total_chars = sum(p["char_count"] for p in pages_data)
            
            # 2. Chunking
            chunks = self.chunker.chunk_document(
                document_id=doc_id,
                filename=filename,
                pages_data=pages_data
            )
            
            # 3. Embedding Generation
            chunk_texts = [c["text"] for c in chunks]
            embeddings = self.embeddings.generate_embeddings(chunk_texts)
            
            # 4. Store in ChromaDB
            doc_meta = {
                "id": doc_id,
                "filename": filename,
                "original_filename": filename,
                "file_type": file_type,
                "file_size": len(file_bytes),
                "page_count": len(pages_data),
                "chunk_count": len(chunks),
                "char_count": total_chars,
                "upload_timestamp": timestamp,
                "status": "processed",
                "file_path": upload_path
            }
            
            self.vector_store.add_document(doc_meta, chunks, embeddings)
            return DocumentMetadata(**doc_meta)
            
        except Exception as e:
            logger.error(f"Error processing document {filename}: {e}", exc_info=True)
            doc_meta = {
                "id": doc_id,
                "filename": filename,
                "original_filename": filename,
                "file_type": Path(filename).suffix.replace(".", "").upper(),
                "file_size": len(file_bytes),
                "page_count": 0,
                "chunk_count": 0,
                "char_count": 0,
                "upload_timestamp": timestamp,
                "status": "failed",
                "error_message": str(e),
                "file_path": upload_path
            }
            self.vector_store.registry[doc_id] = doc_meta
            self.vector_store._save_registry()
            return DocumentMetadata(**doc_meta)

    def get_all_documents(self) -> List[DocumentMetadata]:
        docs = self.vector_store.get_all_documents()
        return [DocumentMetadata(**d) for d in docs]

    def get_document(self, document_id: str) -> Optional[DocumentMetadata]:
        doc = self.vector_store.get_document(document_id)
        return DocumentMetadata(**doc) if doc else None

    def delete_document(self, document_id: str) -> bool:
        return self.vector_store.delete_document(document_id)

    def get_document_chunks(self, document_id: str) -> List[ChunkMetadata]:
        raw_chunks = self.vector_store.get_document_chunks(document_id)
        return [ChunkMetadata(**c) for c in raw_chunks]

    def reprocess_document(self, document_id: str) -> Optional[DocumentMetadata]:
        doc = self.vector_store.get_document(document_id)
        if not doc or not os.path.exists(doc.get("file_path", "")):
            return None
            
        with open(doc["file_path"], "rb") as f:
            file_bytes = f.read()
            
        # Delete old vectors
        self.vector_store.delete_document(document_id)
        return self.process_and_store_document(file_bytes, doc["filename"], document_id)

    def seed_sample_knowledge_base(self):
        """
        Creates rich sample documents for portfolio demonstration if vector store is empty.
        """
        if self.vector_store.get_total_vectors() > 0:
            logger.info("ChromaDB vector store already populated with documents.")
            return

        logger.info("Seeding sample portfolio documents into DocuMind AI...")
        
        sample_doc_1 = """# AI Engineering Handbook: Retrieval-Augmented Generation (RAG) Architecture

## Overview
Retrieval-Augmented Generation (RAG) combines dense vector retrieval with large language models to provide grounded, domain-specific responses with zero fine-tuning required.

## Key Pipeline Components
1. **Document Ingestion & Chunking**: Raw files (PDF, DOCX, TXT) are normalized and segmented using recursive character splitters. Typical optimal chunk size ranges between 500 to 800 characters with a 15-20% overlap to preserve semantic continuity across boundaries.
2. **Embedding Space**: SentenceTransformers (such as all-MiniLM-L6-v2, 384 dimensions) map text passages into high-dimensional semantic vector spaces where cosine distance measures conceptual similarity.
3. **Vector Database**: ChromaDB indexes chunk embeddings using HNSW (Hierarchical Navigable Small World) graphs for sub-millisecond approximate nearest neighbor (ANN) lookups.
4. **Context Injection & LLM Generation**: Top-k retrieved chunks are formatted into a strict anti-hallucination prompt template. The LLM generates responses citing exact document source names and page numbers.

## Mitigating Hallucinations
- Strict grounding system prompts instructing models to decline answering when retrieved context similarity is below the confidence threshold.
- Maximal Marginal Relevance (MMR) to diversify retrieved context chunks and eliminate redundancy.
- Source attribution metadata linking generated claims directly to paragraph indices."""

        sample_doc_2 = """# Enterprise Cloud & Machine Learning Systems Report 2026

## Executive Summary
Modern enterprise AI systems are shifting rapidly toward modular agentic workflows, hybrid vector-search architectures, and privacy-preserving on-premise inference engines.

## Performance Benchmarks
- **Retrieval Latency**: ChromaDB localized HNSW index delivers average query latencies of 4.2ms across 50,000 embedded documents.
- **Accuracy Improvement**: Grounded RAG pipelines demonstrated an 89.4% reduction in factual errors compared to pure ungrounded LLM zero-shot prompts.
- **Cost Optimization**: Embedding-based retrieval reduces context window token consumption by up to 73% by filtering out irrelevant document sections before generation.

## Security & Compliance
All document parsing operates in isolated runtime sandboxes. Document access policies are enforced prior to similarity search, ensuring multi-tenant isolation and strict GDPR compliance."""

        sample_doc_3 = """# Quantum Computing and Quantum Machine Learning Foundations

## Introduction to Quantum State Encoding
Quantum Machine Learning (QML) explores the intersection of quantum algorithms and classical statistical learning. Quantum feature maps encode classical vector representations into quantum Hilbert spaces using parameterized quantum circuits (PQCs).

## Hybrid Quantum-Classical Algorithms
- **VQE (Variational Quantum Eigensolver)**: Used for molecular simulation and quantum chemistry ground-state approximations.
- **QAOA (Quantum Approximate Optimization Algorithm)**: Solves combinatorial graph optimization problems with provable polynomial speedups.
- **Quantum Kernels**: Maps non-linearly separable data into exponentially large feature spaces for quantum support vector classification."""

        samples = [
            ("AI_Engineering_RAG_Handbook.txt", sample_doc_1),
            ("Enterprise_ML_Systems_Report_2026.txt", sample_doc_2),
            ("Quantum_Computing_Foundations.txt", sample_doc_3)
        ]

        for filename, content in samples:
            self.process_and_store_document(
                file_bytes=content.encode("utf-8"),
                filename=filename
            )
        logger.info(f"Successfully seeded {len(samples)} sample knowledge documents.")

document_service = DocumentService()
