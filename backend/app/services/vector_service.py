import chromadb
from chromadb.utils import embedding_functions
from app.config import settings
from typing import List, Dict, Any

# Initialize persistent ChromaDB client
chroma_client = chromadb.PersistentClient(path=str(settings.chroma_db_dir))

# Using ONNX MiniLM-L6-V2 embedding function (local, offline, fast)
embedding_function = embedding_functions.ONNXMiniLM_L6_V2()

def get_or_create_collection():
    return chroma_client.get_or_create_collection(
        name="pdf_documents",
        embedding_function=embedding_function
    )

def store_chunks(file_id: str, chunks: List[Dict[str, Any]]):
    """
    Stores document chunks into ChromaDB under the specified file_id.
    """
    collection = get_or_create_collection()
    
    ids = []
    documents = []
    metadatas = []
    
    for i, chunk in enumerate(chunks):
        chunk_id = f"{file_id}_{i}"
        ids.append(chunk_id)
        documents.append(chunk["text"])
        
        # Merge metadata with file_id
        meta = chunk["metadata"].copy()
        meta["file_id"] = file_id
        metadatas.append(meta)
        
    collection.add(
        ids=ids,
        documents=documents,
        metadatas=metadatas
    )

def search_chunks(file_id: str, query: str, top_k: int = 5) -> List[Dict[str, Any]]:
    """
    Searches ChromaDB for chunks matching the query under the specified file_id.
    """
    collection = get_or_create_collection()
    
    results = collection.query(
        query_texts=[query],
        n_results=top_k,
        where={"file_id": file_id}
    )
    
    hits = []
    if results and "documents" in results and results["documents"]:
        docs = results["documents"][0]
        metas = results["metadatas"][0]
        distances = results["distances"][0] if "distances" in results else [0.0] * len(docs)
        
        for doc, meta, dist in zip(docs, metas, distances):
            hits.append({
                "text": doc,
                "metadata": meta,
                "distance": dist
            })
            
    return hits
