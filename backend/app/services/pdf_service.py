import fitz  # PyMuPDF
from typing import List, Dict, Any
from pathlib import Path

def extract_chunks_from_pdf(pdf_path: Path, chunk_size: int = 1000, chunk_overlap: int = 200) -> List[Dict[str, Any]]:
    """
    Extracts text from a PDF page-by-page, splits it into overlapping chunks,
    and returns a list of dictionaries containing chunk text and metadata.
    """
    chunks = []
    
    # Open PDF
    doc = fitz.open(str(pdf_path))
    
    for page_num in range(len(doc)):
        page = doc[page_num]
        # Extract text and normalize whitespaces
        page_text = page.get_text("text")
        cleaned_text = " ".join(page_text.split())
        
        if not cleaned_text:
            continue
            
        # Chunking this page
        start = 0
        text_len = len(cleaned_text)
        
        # If the page text is shorter than chunk_size, store it as one chunk
        if text_len <= chunk_size:
            chunks.append({
                "text": cleaned_text,
                "metadata": {
                    "page": page_num + 1,
                    "source": f"Page {page_num + 1}"
                }
            })
            continue
            
        while start < text_len:
            end = min(start + chunk_size, text_len)
            chunk_text = cleaned_text[start:end]
            
            chunks.append({
                "text": chunk_text,
                "metadata": {
                    "page": page_num + 1,
                    "source": f"Page {page_num + 1}"
                }
            })
            
            start += (chunk_size - chunk_overlap)
            
    doc.close()
    return chunks
