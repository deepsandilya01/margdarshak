import os
import re

from langchain_chroma import Chroma
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_google_genai import ChatGoogleGenerativeAI
from dotenv import load_dotenv
from langchain_core.messages import HumanMessage, SystemMessage


# ============================================================
# 1. LOAD ENVIRONMENT VARIABLES
# ============================================================

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
load_dotenv(os.path.join(BASE_DIR, ".env"))


# ============================================================
# 2. CHROMADB LOCATION
# ============================================================

persistent_directory = os.path.join(
    os.path.dirname(os.path.abspath(__file__)),
    "chroma_db"
)


# ============================================================
# 3. LOAD THE SAME EMBEDDING MODEL USED DURING INGESTION
# ============================================================

print("Loading embedding model...")

embedding_model = HuggingFaceEmbeddings(
    model_name="sentence-transformers/all-MiniLM-L6-v2"
)


# ============================================================
# 4. LOAD CHROMADB
# ============================================================

print("Loading ChromaDB...")

db = Chroma(
    persist_directory=persistent_directory,
    embedding_function=embedding_model,
    collection_metadata={"hnsw:space": "cosine"}
)


def generate_answer(query, db, model):
    retriever = db.as_retriever(
        search_kwargs={"k": 5}
    )

    relevant_docs = retriever.invoke(query)

    # Exact lookup prevents vector similarity from missing a specific IS number.
    is_number_match = re.search(r"\b(?:IS|IS/IEC|IS/ISO)\s*[/A-Z]*\s*\d+", query, re.IGNORECASE)
    if is_number_match:
        requested_is_number = re.sub(
            r"\s+", " ", is_number_match.group(0).upper()
        ).strip()
        collection_data = db._collection.get(
            include=["documents", "metadatas"]
        )
        exact_docs = []
        for text, metadata in zip(
            collection_data.get("documents", []),
            collection_data.get("metadatas", [])
        ):
            normalized_text = re.sub(r"\s+", " ", text.upper())
            if requested_is_number in normalized_text:
                from langchain_core.documents import Document

                exact_docs.append(
                    Document(page_content=text, metadata=metadata or {})
                )
        if exact_docs:
            relevant_docs = exact_docs[:5]

    documents = "\n\n".join(
        [
            f"Document {i}:\n{doc.page_content}"
            for i, doc in enumerate(relevant_docs, 1)
        ]
    )

    combined_input = f"""
You are a precise information extraction assistant.

USER QUESTION:
{query}

RETRIEVED DOCUMENTS:
{documents}

IMPORTANT RULES:

1. Answer ONLY what the user has asked.
2. Extract ONLY the information requested in the question.
3. Do NOT return unrelated fields from the documents.
4. Do NOT copy the complete document.
5. Do NOT list every value present in the retrieved documents.
6. Use ONLY the information present in the retrieved documents.
7. Do NOT use outside knowledge.
8. Do NOT guess or assume missing information.
9. If the requested information is not available in the documents, say:
"I don't have enough information to answer that question based on the provided documents."
10. Keep the answer short and direct.
"""

    messages = [
        SystemMessage(
            content="""
You are a precise RAG information extraction assistant.

Your job is to answer the user's question using ONLY the
retrieved documents.

Return ONLY the information requested by the user.

Never dump the entire document.

Never provide unrelated fields.

Never guess or use outside knowledge.
"""
        ),
        HumanMessage(
            content=combined_input
        )
    ]

    result = model.invoke(messages)
    
    answer_text = ""
    if isinstance(result.content, list):
        for block in result.content:
            if isinstance(block, dict):
                if block.get("type") == "text":
                    answer_text += block.get("text", "")
    else:
        answer_text = result.content

    citations = []
    sources = []
    for doc in relevant_docs:
        meta = doc.metadata or {}
        source = meta.get("source")
        page = meta.get("page")
        if source and source not in sources:
            sources.append(source)
            citations.append({
                "source": source,
                "page": page
            })
            
    return {
        "answer": answer_text,
        "citations": citations,
        "sources": sources,
        "metadata": {
            "retrieval": "chromadb"
        }
    }


if __name__ == "__main__":
    # ============================================================
    # 5. TAKE USER QUERY FROM TERMINAL
    # ============================================================

    query = input("\nAsk your question: ")

    print(f"\nUser Query: {query}")

    # ============================================================
    # 6. RUN GENERATE ANSWER
    # ============================================================
    
    print("\nGenerating answer...")
    
    result = generate_answer(query, db, model)

    print("\n--- Retrieved Context (Citations) ---")
    for cit in result["citations"]:
        print(f"Source: {cit.get('source')}, Page: {cit.get('page')}")

    print("\n--- Generated Response ---")
    print(result["answer"])