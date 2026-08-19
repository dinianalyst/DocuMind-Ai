import uuid
from typing import List, Dict, Any
from langchain_text_splitters import RecursiveCharacterTextSplitter
from app.core.config import settings

class DocumentChunker:
    """
    Chunks extracted document pages into semantically cohesive passages
    with granular metadata for vector search and citation grounding.
    """

    def __init__(self, chunk_size: int = None, chunk_overlap: int = None):
        self.chunk_size = chunk_size or settings.CHUNK_SIZE
        self.chunk_overlap = chunk_overlap or settings.CHUNK_OVERLAP
        
        self.splitter = RecursiveCharacterTextSplitter(
            chunk_size=self.chunk_size,
            chunk_overlap=self.chunk_overlap,
            separators=["\n\n", "\n", ". ", "? ", "! ", "; ", " ", ""],
            length_function=len,
            is_separator_regex=False
        )

    def chunk_document(
        self, 
        document_id: str, 
        filename: str, 
        pages_data: List[Dict[str, Any]]
    ) -> List[Dict[str, Any]]:
        """
        Takes page-by-page extracted data and produces structured chunk objects.
        """
        chunks_list = []
        global_chunk_idx = 0

        for page in pages_data:
            page_num = page["page_number"]
            page_text = page["text"]
            
            if not page_text.strip():
                continue

            # Split text of this page
            page_chunks = self.splitter.split_text(page_text)
            
            for chunk_str in page_chunks:
                chunk_str = chunk_str.strip()
                if not chunk_str:
                    continue
                
                chunk_id = f"{document_id}_c{global_chunk_idx}_{uuid.uuid4().hex[:6]}"
                preview = chunk_str[:120] + "..." if len(chunk_str) > 120 else chunk_str
                
                chunk_obj = {
                    "id": chunk_id,
                    "document_id": document_id,
                    "filename": filename,
                    "page_number": page_num,
                    "chunk_index": global_chunk_idx,
                    "char_count": len(chunk_str),
                    "text": chunk_str,
                    "preview": preview
                }
                chunks_list.append(chunk_obj)
                global_chunk_idx += 1

        return chunks_list
