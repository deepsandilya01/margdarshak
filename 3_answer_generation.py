import os
import re

from langdetect import detect, DetectorFactory

from langchain_chroma import Chroma
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_google_genai import ChatGoogleGenerativeAI
from dotenv import load_dotenv
from langchain_core.messages import HumanMessage, SystemMessage


# ============================================================
# 1. LOAD ENVIRONMENT VARIABLES
# ============================================================

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

load_dotenv(
    os.path.join(BASE_DIR, ".env")
)


# Make language detection deterministic
DetectorFactory.seed = 0


# ============================================================
# 2. CHROMADB LOCATION
# ============================================================

persistent_directory = os.path.join(
    BASE_DIR,
    "chroma_db"
)


# ============================================================
# 3. LANGUAGE DETECTION
# ============================================================

def detect_language(query):
    """
    Detect the language of the user's question.
    """

    language_names = {
        "en": "English",
        "hi": "Hindi",
        "mr": "Marathi",
        "bn": "Bengali",
        "gu": "Gujarati",
        "ta": "Tamil",
        "te": "Telugu",
        "kn": "Kannada",
        "ml": "Malayalam",
        "pa": "Punjabi",
        "or": "Odia",
        "ur": "Urdu"
    }

    # Common Roman Hindi / Hinglish words
    hindi_words = {
        "kya",
        "hai",
        "ka",
        "ki",
        "ke",
        "ko",
        "mein",
        "me",
        "se",
        "kaise",
        "kahan",
        "kitna",
        "kitne",
        "batao",
        "bataiye",
        "chahiye",
        "karna",
        "karo",
        "hoga",
        "hoti",
        "mujhe",
        "iska",
        "iski",
        "iske",
        "kaunsa",
        "kaunse"
    }

    words = query.lower().split()

    hindi_count = 0

    for word in words:

        word = word.strip(
            ".,!?;:'\"()[]{}"
        )

        if word in hindi_words:
            hindi_count += 1

    # Detect common Roman Hindi
    if hindi_count >= 2:
        return "Hindi"

    # Detect using langdetect
    try:

        detected_code = detect(query)

        return language_names.get(
            detected_code,
            "English"
        )

    except Exception:

        return "English"


# ============================================================
# 4. LOAD THE SAME EMBEDDING MODEL USED DURING INGESTION
# ============================================================

print("Loading embedding model...")

embedding_model = HuggingFaceEmbeddings(
    model_name="sentence-transformers/all-MiniLM-L6-v2"
)


# ============================================================
# 5. LOAD CHROMADB
# ============================================================

print("Loading ChromaDB...")

db = Chroma(
    persist_directory=persistent_directory,
    embedding_function=embedding_model,
    collection_metadata={
        "hnsw:space": "cosine"
    }
)


# ============================================================
# 6. TAKE USER QUERY
# ============================================================

query = input(
    "\nAsk your question: "
)


# ============================================================
# 7. DETECT USER LANGUAGE
# ============================================================

detected_language = detect_language(
    query
)

print(
    f"\nDetected Language: "
    f"{detected_language}"
)


# ============================================================
# 8. RETRIEVE RELEVANT DOCUMENTS
# ============================================================

retriever = db.as_retriever(
    search_kwargs={
        "k": 5
    }
)

relevant_docs = retriever.invoke(
    query
)


# ============================================================
# 9. EXACT IS NUMBER LOOKUP
# ============================================================

# This prevents vector similarity from missing
# a specific IS number.

is_number_match = re.search(
    r"\b(?:IS|IS/IEC|IS/ISO)\s*[/A-Z]*\s*\d+",
    query,
    re.IGNORECASE
)

if is_number_match:

    requested_is_number = re.sub(
        r"\s+",
        " ",
        is_number_match.group(0).upper()
    ).strip()

    collection_data = db._collection.get(
        include=[
            "documents",
            "metadatas"
        ]
    )

    exact_docs = []

    for text, metadata in zip(
        collection_data.get("documents", []),
        collection_data.get("metadatas", [])
    ):

        normalized_text = re.sub(
            r"\s+",
            " ",
            text.upper()
        )

        if requested_is_number in normalized_text:

            from langchain_core.documents import Document

            exact_docs.append(
                Document(
                    page_content=text,
                    metadata=metadata or {}
                )
            )

    if exact_docs:

        relevant_docs = exact_docs[:5]


# ============================================================
# 10. DISPLAY USER QUERY
# ============================================================

print(
    f"\nUser Query: {query}"
)

print(
    f"Detected Language: "
    f"{detected_language}"
)


# ============================================================
# 11. DISPLAY RETRIEVED DOCUMENTS
# ============================================================

print("\n--- Retrieved Context ---")

for i, doc in enumerate(
    relevant_docs,
    1
):

    print(
        f"\nDocument {i}:"
    )

    print(
        f"Source: "
        f"{doc.metadata.get('source', 'Unknown')}"
    )

    print(
        f"Page: "
        f"{doc.metadata.get('page', 'Unknown')}"
    )

    print(
        doc.page_content
    )


# ============================================================
# 12. COMBINE RETRIEVED DOCUMENTS
# ============================================================

documents = "\n\n".join(
    [
        f"Document {i}:\n{doc.page_content}"
        for i, doc in enumerate(
            relevant_docs,
            1
        )
    ]
)


# ============================================================
# 13. CREATE PROMPT FOR GEMINI
# ============================================================

combined_input = f"""
You are a precise multilingual RAG information extraction assistant.

USER QUESTION:
{query}

DETECTED USER LANGUAGE:
{detected_language}

RETRIEVED DOCUMENTS:
{documents}

IMPORTANT RULES:

1. Answer ONLY what the user has asked.

2. Answer in the SAME LANGUAGE as the user's question.

3. The detected language is:
{detected_language}

4. If the detected language is Marathi, answer completely in Marathi.

5. If the detected language is Hindi, answer completely in Hindi.

6. If the detected language is English, answer completely in English.

7. Do NOT translate technical BIS terms unnecessarily.

8. Keep technical terms such as:
   - IS 1417
   - IS 13252
   - BIS
   - OSL
   - Laboratory names
   - Standard numbers
   unchanged when appropriate.

9. Extract ONLY the information requested in the question.

10. Do NOT return unrelated fields from the documents.

11. Do NOT copy the complete document.

12. Do NOT list every value present in the retrieved documents.

13. Use ONLY the information present in the retrieved documents.

14. Do NOT use outside knowledge.

15. Do NOT guess or assume missing information.

16. If the requested information is not available in the documents,
say the following meaning in the user's language:

English:
"I don't have enough information to answer that question based on the provided documents."

Hindi:
"दिए गए दस्तावेज़ों के आधार पर इस प्रश्न का उत्तर देने के लिए पर्याप्त जानकारी उपलब्ध नहीं है।"

Marathi:
"दिलेल्या दस्तऐवजांच्या आधारे या प्रश्नाचे उत्तर देण्यासाठी पुरेशी माहिती उपलब्ध नाही."

17. Keep the answer short and direct.
"""


# ============================================================
# 14. LOAD GEMINI
# ============================================================

model = ChatGoogleGenerativeAI(
    model="gemini-3.6-flash",
    temperature=0
)


# ============================================================
# 15. CREATE MESSAGES
# ============================================================

messages = [

    SystemMessage(
        content=f"""
You are a precise multilingual RAG information extraction assistant.

Your job is to answer the user's question using ONLY
the retrieved documents.

The user's detected language is:

{detected_language}

Always answer in the same language as the user's question.

Never dump the entire document.

Never provide unrelated fields.

Never guess.

Never use outside knowledge.

Preserve BIS technical terms, standard numbers,
laboratory names and abbreviations when appropriate.
"""
    ),

    HumanMessage(
        content=combined_input
    )
]


# ============================================================
# 16. GENERATE FINAL ANSWER
# ============================================================

print(
    "\nGenerating answer..."
)

result = model.invoke(
    messages
)


# ============================================================
# 17. DISPLAY FINAL ANSWER
# ============================================================

print(
    "\n--- Generated Response ---"
)


if isinstance(
    result.content,
    list
):

    for block in result.content:

        if isinstance(
            block,
            dict
        ):

            if block.get("type") == "text":

                print(
                    block.get(
                        "text",
                        ""
                    )
                )

else:

    print(
        result.content
    )