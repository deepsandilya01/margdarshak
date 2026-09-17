import os
import sys
import importlib
import traceback
from contextlib import asynccontextmanager
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from dotenv import load_dotenv

# We need to ensure we can import the scripts despite them starting with numbers
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

ingestion = importlib.import_module("1_ingestion_pipeline")
retrieval = importlib.import_module("2_retrievel_pipeline")
answer_gen = importlib.import_module("3_answer_generation")

from langchain_chroma import Chroma
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_google_genai import ChatGoogleGenerativeAI

load_dotenv()

# Global resources
app_resources = {}

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Load embedding model
    try:
        print("Initializing embedding model...")
        embedding_model = HuggingFaceEmbeddings(
            model_name="sentence-transformers/all-MiniLM-L6-v2"
        )
        app_resources["embedding_model"] = embedding_model
        
        # Load Chroma
        print("Initializing ChromaDB...")
        persistent_directory = os.path.join(
            os.path.dirname(os.path.abspath(__file__)),
            "chroma_db"
        )
        db = Chroma(
            persist_directory=persistent_directory,
            embedding_function=embedding_model,
            collection_metadata={"hnsw:space": "cosine"}
        )
        app_resources["db"] = db
        
        # Load LLM
        print("Initializing Gemini LLM...")
        model = ChatGoogleGenerativeAI(
            model="gemini-3.6-flash",
            temperature=0
        )
        app_resources["model"] = model
        
        print("All resources initialized successfully.")
    except Exception as e:
        print(f"Error initializing resources: {e}")
        # Allow startup to continue, endpoint health will report issues
        
    yield
    
    # Cleanup (if any)
    app_resources.clear()

app = FastAPI(lifespan=lifespan)

# --- Models ---
class ChatRequest(BaseModel):
    message: str
    sessionId: Optional[str] = None
    context: Optional[Dict[str, Any]] = None

class SearchRequest(BaseModel):
    query: str
    topK: Optional[int] = 5
    filters: Optional[Dict[str, Any]] = None

# --- Endpoints ---
@app.get("/health")
async def health():
    services = {
        "rag": "ok",
        "chromadb": "ok" if "db" in app_resources else "error",
        "llm": "ok" if "model" in app_resources else "error"
    }
    
    # Also check if Chroma is empty
    if "db" in app_resources:
        try:
            count = app_resources["db"]._collection.count()
            if count == 0:
                services["chromadb"] = "empty"
        except Exception:
            services["chromadb"] = "error"

    return {
        "status": "ok" if all(v in ["ok", "empty"] for v in services.values()) else "error",
        "services": services
    }

@app.post("/chat")
async def chat(req: ChatRequest):
    if "db" not in app_resources or "model" not in app_resources:
        raise HTTPException(status_code=503, detail="AI services unavailable")
        
    if not req.message:
        raise HTTPException(status_code=400, detail="Empty query")
        
    try:
        # Call the existing RAG function
        result = answer_gen.generate_answer(
            query=req.message,
            db=app_resources["db"],
            model=app_resources["model"]
        )
        return result
    except Exception as e:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail="Internal RAG generation error")

@app.post("/search")
async def search(req: SearchRequest):
    if "db" not in app_resources:
        raise HTTPException(status_code=503, detail="ChromaDB unavailable")
        
    if not req.query:
        raise HTTPException(status_code=400, detail="Empty query")
        
    try:
        # Use existing retrieval logic
        docs = retrieval.search_documents(
            query=req.query,
            db=app_resources["db"],
            k=req.topK or 5
        )
        
        results = []
        for doc in docs:
            results.append({
                "title": doc.metadata.get("source", "Unknown"),
                "score": None, # Chroma similarity isn't directly exposed in vanilla retriever without search_with_score
                "metadata": doc.metadata
            })
            
        return {"results": results}
    except Exception as e:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail="Search error")

@app.post("/ingest")
async def run_ingest():
    try:
        # Calls the existing main() which loads and splits docs then updates Chroma
        new_db = ingestion.main()
        
        # Optionally update the shared db reference
        app_resources["db"] = new_db
        
        # We try to guess the counts from the existing persistent vector store collection
        try:
            count = new_db._collection.count()
        except:
            count = 0
            
        return {
            "status": "success",
            "documentsProcessed": "Unknown (used existing pipeline)",
            "chunksCreated": count
        }
    except Exception as e:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail="Ingestion error")
