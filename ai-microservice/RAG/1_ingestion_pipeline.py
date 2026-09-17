import os
import sys

from langchain_community.document_loaders import PyPDFLoader, DirectoryLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_chroma import Chroma
from dotenv import load_dotenv

load_dotenv()

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# Fix Windows terminal encoding
if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")


# ============================================================
# STEP 1: LOAD PDF DOCUMENTS
# ============================================================

def load_documents(docs_path=BASE_DIR):
    """Load all PDF files from the docs directory."""

    print(f"Loading PDF documents from {docs_path}...")

    if not os.path.exists(docs_path):
        raise FileNotFoundError(
            f"The directory '{docs_path}' does not exist. "
            "Please create it and add your PDF documents."
        )

    # Load all PDF files
    loader = DirectoryLoader(
        path=docs_path,
        glob="*.pdf",
        loader_cls=PyPDFLoader,
        show_progress=True
    )

    documents = loader.load()

    if len(documents) == 0:
        raise FileNotFoundError(
            f"No PDF files found in '{docs_path}'. "
            "Please add your PDF documents."
        )

    print(f"\n✅ Loaded {len(documents)} PDF pages.")

    # Show first 2 pages
    for i, doc in enumerate(documents[:2]):

        print(f"\nDocument/Page {i + 1}:")

        print(
            f"  Source: "
            f"{doc.metadata.get('source', 'Unknown')}"
        )

        print(
            f"  Page: "
            f"{doc.metadata.get('page', 'Unknown')}"
        )

        print(
            f"  Content length: "
            f"{len(doc.page_content)} characters"
        )

        print(
            f"  Content preview: "
            f"{doc.page_content[:300]}..."
        )

        print(
            f"  Metadata: "
            f"{doc.metadata}"
        )

    return documents


# ============================================================
# STEP 2: SPLIT DOCUMENTS INTO CHUNKS
# ============================================================

def split_documents(
    documents,
    chunk_size=3000,
    chunk_overlap=200
):
    """
    Split PDF text into chunks.

    chunk_size:
        Maximum number of characters in each chunk.

    chunk_overlap:
        Number of characters shared between chunks.
    """

    print("\nSplitting PDF documents into chunks...")

    print(f"Chunk size: {chunk_size}")
    print(f"Chunk overlap: {chunk_overlap}")

    # Recursive splitter is better for PDFs
    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=chunk_size,
        chunk_overlap=chunk_overlap,
        separators=[
            "\n\n",
            "\n",
            ". ",
            " ",
            ""
        ]
    )

    chunks = text_splitter.split_documents(documents)

    print(
        f"\n✅ Total chunks created: "
        f"{len(chunks)}"
    )

    # Show first 5 chunks
    for i, chunk in enumerate(chunks[:5]):

        print(f"\n--- Chunk {i + 1} ---")

        print(
            f"Source: "
            f"{chunk.metadata.get('source', 'Unknown')}"
        )

        print(
            f"Page: "
            f"{chunk.metadata.get('page', 'Unknown')}"
        )

        print(
            f"Length: "
            f"{len(chunk.page_content)} characters"
        )

        print("Content:")
        print(chunk.page_content)

        print("-" * 50)

    if len(chunks) > 5:
        print(
            f"\n... and "
            f"{len(chunks) - 5} more chunks"
        )

    return chunks


# ============================================================
# STEP 3: CREATE CHROMADB
# ============================================================

def create_vector_store(
    chunks,
    persist_directory="db/chroma_db"
):
    """Create and persist ChromaDB vector store."""

    print("\nUsing local Hugging Face embedding model...")
    print(
        "Embedding model: "
        "sentence-transformers/all-MiniLM-L6-v2"
    )

    print("Creating embeddings locally...")

    embedding_model = HuggingFaceEmbeddings(
        model_name="sentence-transformers/all-MiniLM-L6-v2"
    )

    print("\n--- Creating vector store ---")

    vectorstore = Chroma(
        embedding_function=embedding_model,
        persist_directory=persist_directory,
        collection_metadata={
            "hnsw:space": "cosine"
        }
    )

    print(
        f"Adding {len(chunks)} chunks "
        f"to ChromaDB..."
    )

    # Add chunks and create embeddings
    vectorstore.add_documents(chunks)

    print(
        "\n--- Finished creating vector store ---"
    )

    print(
        f"✅ Vector store created and saved to: "
        f"{persist_directory}"
    )

    return vectorstore


# ============================================================
# LOAD EXISTING VECTOR STORE
# ============================================================

def load_existing_vector_store(
    persist_directory="db/chroma_db"
):
    """Load an existing ChromaDB vector store."""

    print("\nLoading existing ChromaDB...")

    print(
        "Using local Hugging Face embedding model..."
    )

    print(
        "Embedding model: "
        "sentence-transformers/all-MiniLM-L6-v2"
    )

    embedding_model = HuggingFaceEmbeddings(
        model_name="sentence-transformers/all-MiniLM-L6-v2"
    )

    vectorstore = Chroma(
        persist_directory=persist_directory,
        embedding_function=embedding_model,
        collection_metadata={
            "hnsw:space": "cosine"
        }
    )

    document_count = vectorstore._collection.count()

    print(
        f"✅ Existing vector store contains "
        f"{document_count} documents/chunks."
    )

    return vectorstore


# ============================================================
# MAIN INGESTION PIPELINE
# ============================================================

def main():

    print("=" * 60)
    print("        PDF RAG DOCUMENT INGESTION")
    print("=" * 60)

    # --------------------------------------------------
    # Configuration
    # --------------------------------------------------

    docs_path = BASE_DIR

    persistent_directory = os.path.join(BASE_DIR, "chroma_db")

    chunk_size = 3000
    chunk_overlap = 200

    # --------------------------------------------------
    # Check existing vector store
    # --------------------------------------------------

    vectorstore = None

    if os.path.exists(persistent_directory):

        print(
            f"\n⚠️ Vector store already exists at:"
            f"\n{persistent_directory}"
        )

        vectorstore = load_existing_vector_store(
            persistent_directory
        )

        document_count = vectorstore._collection.count()

        if document_count == 0:

            print(
                "\n⚠️ Existing vector store is empty."
            )

            print(
                "Continuing with ingestion..."
            )

    # --------------------------------------------------
    # STEP 1: LOAD PDF DOCUMENTS
    # --------------------------------------------------

    print("\n" + "=" * 60)
    print("STEP 1: LOADING PDF DOCUMENTS")
    print("=" * 60)

    documents = load_documents(docs_path)

    if vectorstore is not None:
        stored_data = vectorstore._collection.get(include=["metadatas"])
        indexed_sources = {
            os.path.basename(metadata.get("source", ""))
            for metadata in stored_data.get("metadatas", [])
            if metadata
        }
        documents = [
            document
            for document in documents
            if os.path.basename(document.metadata.get("source", ""))
            not in indexed_sources
        ]

        if not documents:
            print("\n✅ All PDF documents are already indexed.")
            return vectorstore

        print(f"\nNew PDF pages to index: {len(documents)}")

    # --------------------------------------------------
    # STEP 2: SPLIT DOCUMENTS
    # --------------------------------------------------

    print("\n" + "=" * 60)
    print("STEP 2: SPLITTING PDF DOCUMENTS")
    print("=" * 60)

    chunks = split_documents(
        documents,
        chunk_size=chunk_size,
        chunk_overlap=chunk_overlap
    )

    # --------------------------------------------------
    # STEP 3: CREATE VECTOR STORE
    # --------------------------------------------------

    print("\n" + "=" * 60)
    print("STEP 3: CREATING VECTOR STORE")
    print("=" * 60)

    if vectorstore is None:
        vectorstore = create_vector_store(
            chunks,
            persistent_directory
        )
    else:
        print(f"\nAdding {len(chunks)} new chunks to ChromaDB...")
        vectorstore.add_documents(chunks)

    # --------------------------------------------------
    # COMPLETE
    # --------------------------------------------------

    print("\n" + "=" * 60)
    print("✅ PDF INGESTION COMPLETE")
    print("=" * 60)

    print(
        f"\nPDF pages loaded: "
        f"{len(documents)}"
    )

    print(
        f"Chunks created: "
        f"{len(chunks)}"
    )

    print(
        f"Vector database: "
        f"{persistent_directory}"
    )

    print(
        "\nYour PDF documents are now ready "
        "for RAG queries."
    )

    return vectorstore


# ============================================================
# RUN
# ============================================================

if __name__ == "__main__":
    main()