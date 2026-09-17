from langchain_chroma import Chroma
from langchain_huggingface import HuggingFaceEmbeddings

persistent_directory = "./chroma_db"

# Load the SAME embedding model used during ingestion
embedding_model = HuggingFaceEmbeddings(
    model_name="sentence-transformers/all-MiniLM-L6-v2"
)

# Load existing ChromaDB
db = Chroma(
    persist_directory=persistent_directory,
    embedding_function=embedding_model,
    collection_metadata={"hnsw:space": "cosine"}
)

# Search for relevant documents
query = "AES Laboratories (P) Ltd Noida OSL"

retriever = db.as_retriever(
    search_kwargs={"k": 5}
)

relevant_docs = retriever.invoke(query)

print(f"User Query: {query}")

# Display results
print("\n--- Context ---")

for i, doc in enumerate(relevant_docs, 1):
    print(f"\nDocument {i}:")
    print(f"Source: {doc.metadata.get('source', 'Unknown')}")
    print(doc.page_content)