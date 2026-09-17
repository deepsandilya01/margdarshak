import os

from langchain_chroma import Chroma
from langchain_huggingface import HuggingFaceEmbeddings

def search_documents(query, db, k=5):
    retriever = db.as_retriever(search_kwargs={"k": k})
    relevant_docs = retriever.invoke(query)
    return relevant_docs

if __name__ == "__main__":
    persistent_directory = os.path.join(
        os.path.dirname(os.path.abspath(__file__)),
        "chroma_db"
    )

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
    
    relevant_docs = search_documents(query, db, k=5)

    print(f"User Query: {query}")

    # Display results
    print("\n--- Context ---")

    for i, doc in enumerate(relevant_docs, 1):
        print(f"\nDocument {i}:")
        print(f"Source: {doc.metadata.get('source', 'Unknown')}")
        print(doc.page_content)