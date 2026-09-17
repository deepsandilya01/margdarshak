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


# ============================================================
# 5. TAKE USER QUERY FROM TERMINAL
# ============================================================

query = input("\nAsk your question: ")


# ============================================================
# 6. RETRIEVE RELEVANT DOCUMENTS
# ============================================================

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


# ============================================================
# 7. DISPLAY USER QUERY
# ============================================================

print(f"\nUser Query: {query}")


# ============================================================
# 8. DISPLAY RETRIEVED DOCUMENTS
# ============================================================

print("\n--- Retrieved Context ---")

for i, doc in enumerate(relevant_docs, 1):

    print(f"\nDocument {i}:")
    print(f"Source: {doc.metadata.get('source', 'Unknown')}")
    print(doc.page_content)


# ============================================================
# 9. COMBINE RETRIEVED DOCUMENTS
# ============================================================

documents = "\n\n".join(
    [
        f"Document {i}:\n{doc.page_content}"
        for i, doc in enumerate(relevant_docs, 1)
    ]
)


# ============================================================
# 10. CREATE PROMPT FOR GEMINI
# ============================================================

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


# ============================================================
# 11. LOAD GEMINI
# ============================================================

model = ChatGoogleGenerativeAI(
    model="gemini-3.6-flash",
    temperature=0
)


# ============================================================
# 12. CREATE MESSAGES
# ============================================================

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


# ============================================================
# 13. GENERATE FINAL ANSWER
# ============================================================

print("\nGenerating answer...")

result = model.invoke(messages)


# ============================================================
# 14. DISPLAY FINAL ANSWER
# ============================================================

print("\n--- Generated Response ---")


if isinstance(result.content, list):

    for block in result.content:

        if isinstance(block, dict):

            if block.get("type") == "text":

                print(block.get("text", ""))

else:

    print(result.content)