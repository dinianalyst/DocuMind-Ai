import os
import io
import re
from typing import List, Dict, Any, Tuple
from pathlib import Path
from pypdf import PdfReader
import docx

class DocumentExtractor:
    """
    Extracts text and page-level metadata from PDF, DOCX, and TXT files.
    """

    @staticmethod
    def clean_text(text: str) -> str:
        """Cleans extracted text by normalizing whitespace and special characters."""
        if not text:
            return ""
        # Replace multiple spaces/tabs with single space
        text = re.sub(r'[ \t]+', ' ', text)
        # Normalize excessive newlines (keep at most 2 for paragraph separation)
        text = re.sub(r'\n{3,}', '\n\n', text)
        # Strip trailing/leading spaces per line
        lines = [line.strip() for line in text.split('\n')]
        return '\n'.join(lines).strip()

    @classmethod
    def extract_from_pdf(cls, file_bytes: bytes, filename: str) -> List[Dict[str, Any]]:
        """
        Extracts text from PDF file page by page.
        Returns list of pages with text, page number, and char count.
        """
        reader = PdfReader(io.BytesIO(file_bytes))
        pages_data = []
        
        for idx, page in enumerate(reader.pages):
            page_num = idx + 1
            extracted_text = page.extract_text() or ""
            cleaned = cls.clean_text(extracted_text)
            
            if cleaned:
                pages_data.append({
                    "page_number": page_num,
                    "text": cleaned,
                    "char_count": len(cleaned)
                })
        
        # Fallback if no text extracted (e.g. empty or OCR needed)
        if not pages_data:
            pages_data.append({
                "page_number": 1,
                "text": f"[Empty or image-only PDF document: {filename}]",
                "char_count": 0
            })
            
        return pages_data

    @classmethod
    def extract_from_docx(cls, file_bytes: bytes, filename: str) -> List[Dict[str, Any]]:
        """
        Extracts text from DOCX file, grouping paragraphs and tables.
        Estimates pages based on typical character length (~2000 chars/page).
        """
        doc = docx.Document(io.BytesIO(file_bytes))
        paragraphs = []
        
        for p in doc.paragraphs:
            text = cls.clean_text(p.text)
            if text:
                paragraphs.append(text)
                
        # Also extract text from tables
        for table in doc.tables:
            for row in table.rows:
                row_text = " | ".join([cls.clean_text(cell.text) for cell in row.cells if cell.text.strip()])
                if row_text:
                    paragraphs.append(f"[Table Row] {row_text}")
        
        full_text = "\n\n".join(paragraphs)
        if not full_text.strip():
            full_text = f"[Empty DOCX document: {filename}]"
            
        # Split into logical pseudo-pages (approx 2000 chars each) for citation granularity
        page_size = 2000
        pages_data = []
        total_len = len(full_text)
        
        if total_len <= page_size:
            pages_data.append({
                "page_number": 1,
                "text": full_text,
                "char_count": total_len
            })
        else:
            current_idx = 0
            page_num = 1
            while current_idx < total_len:
                end_idx = min(current_idx + page_size, total_len)
                # Try to break at a newline if possible
                if end_idx < total_len:
                    next_nl = full_text.rfind("\n", current_idx, end_idx)
                    if next_nl != -1 and next_nl > current_idx + 500:
                        end_idx = next_nl
                        
                chunk_text = full_text[current_idx:end_idx].strip()
                if chunk_text:
                    pages_data.append({
                        "page_number": page_num,
                        "text": chunk_text,
                        "char_count": len(chunk_text)
                    })
                    page_num += 1
                current_idx = end_idx
                
        return pages_data

    @classmethod
    def extract_from_txt(cls, file_bytes: bytes, filename: str) -> List[Dict[str, Any]]:
        """
        Extracts text from TXT file with multi-encoding fallback.
        """
        encodings = ['utf-8', 'utf-8-sig', 'latin-1', 'cp1252', 'iso-8859-1']
        raw_text = ""
        
        for enc in encodings:
            try:
                raw_text = file_bytes.decode(enc)
                break
            except (UnicodeDecodeError, AttributeError):
                continue
                
        cleaned = cls.clean_text(raw_text)
        if not cleaned:
            cleaned = f"[Empty TXT file: {filename}]"
            
        # Segment into logical pages (~2000 chars)
        page_size = 2000
        pages_data = []
        total_len = len(cleaned)
        
        if total_len <= page_size:
            pages_data.append({
                "page_number": 1,
                "text": cleaned,
                "char_count": total_len
            })
        else:
            current_idx = 0
            page_num = 1
            while current_idx < total_len:
                end_idx = min(current_idx + page_size, total_len)
                if end_idx < total_len:
                    next_nl = cleaned.rfind("\n", current_idx, end_idx)
                    if next_nl != -1 and next_nl > current_idx + 500:
                        end_idx = next_nl
                        
                chunk_text = cleaned[current_idx:end_idx].strip()
                if chunk_text:
                    pages_data.append({
                        "page_number": page_num,
                        "text": chunk_text,
                        "char_count": len(chunk_text)
                    })
                    page_num += 1
                current_idx = end_idx
                
        return pages_data

    @classmethod
    def extract(cls, file_bytes: bytes, filename: str) -> Tuple[List[Dict[str, Any]], str]:
        """
        Main extraction entry point. Dispatches by file extension.
        Returns: (pages_data, file_type)
        """
        ext = Path(filename).suffix.lower()
        if ext == ".pdf":
            return cls.extract_from_pdf(file_bytes, filename), "PDF"
        elif ext in [".docx", ".doc"]:
            return cls.extract_from_docx(file_bytes, filename), "DOCX"
        elif ext in [".txt", ".md", ".csv", ".json", ".log"]:
            return cls.extract_from_txt(file_bytes, filename), "TXT"
        else:
            # Attempt generic text decode
            try:
                return cls.extract_from_txt(file_bytes, filename), "TXT"
            except Exception as e:
                raise ValueError(f"Unsupported file format '{ext}' for file {filename}: {str(e)}")
