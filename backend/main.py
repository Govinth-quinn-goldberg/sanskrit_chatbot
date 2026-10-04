import os
import sys
sys.stdout.reconfigure(encoding='utf-8')
import requests
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from knowledge_base import load_knowledge_base, search_knowledge_base
from translation_service import translator_service

# 1. Load configuration from .env file
load_dotenv()

OLLAMA_URL = os.getenv("OLLAMA_URL", "http://localhost:11434/api/generate")
MODEL_NAME = os.getenv("MODEL_NAME", "llama3.2:3b")

# Load knowledge base on module import
load_knowledge_base()

# 2. Create the FastAPI app
app = FastAPI(title="Sanskrit Learning Chatbot Backend")

# 3. Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 4. Load IndicTrans2 model once when backend starts
@app.on_event("startup")
def startup_event():
    translator_service.load_model()

# 5. System Prompt for Llama 3.2 3B normal tutoring
SYSTEM_PROMPT = (
    "You are a Sanskrit teacher helping beginners.\n"
    "Teach Sanskrit clearly using simple English.\n"
    "Give Sanskrit examples and English meanings when useful.\n"
    "Correct learner mistakes and briefly explain why they are wrong.\n"
    "For simple vocabulary or translation questions, give the answer first and keep the explanation concise.\n"
    "Use the provided Sanskrit learning material when it is relevant.\n"
    "Do not invent Sanskrit grammar rules.\n"
    "If you are uncertain, say so.\n"
    "Do not generate unnecessarily long answers."
)

# 6. Define request body structures
class ChatMessage(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    message: str
    history: list[ChatMessage] = []

class EvalRequest(BaseModel):
    question: str
    user_answer: str
    expected_answer: str = ""

# 7. Health & Status endpoints
@app.get("/")
def home():
    return {"status": "Sanskrit Learning Chatbot API is running"}

@app.get("/translation-status")
def translation_status():
    """Reports IndicTrans2 loading status, model name, device, load time, and error if any."""
    return translator_service.get_status()

# 8. Main Chat endpoint with separate Translation Routing & RAG context
@app.post("/chat")
def chat(request: ChatRequest):
    user_message = request.message.strip()

    # Reject empty messages
    if not user_message:
        raise HTTPException(status_code=400, detail="Message cannot be empty.")

    # A. SEPARATE TRANSLATION PATH: Detect explicit translation requests
    if translator_service.is_translation_request(user_message):
        res = translator_service.translate(user_message)
        return {
            "reply": res.get("reply", ""),
            "translation_data": res if res.get("type") == "translation" else None
        }

    # B. NORMAL CHAT & TUTORING PATH (Llama 3.2 3B + RAG + Conversation Memory)
    # 1. RAG Retrieval from local Sanskrit knowledge base (top 2 concise snippets max)
    retrieved_knowledge = search_knowledge_base(user_message, top_k=2)
    knowledge_context = ""
    if retrieved_knowledge:
        knowledge_context = (
            "Relevant Sanskrit Reference Material:\n"
            f"{retrieved_knowledge}\n\n"
            "Use the provided Sanskrit learning material when answering. "
            "Do not contradict the provided material. "
            "If the material does not contain the answer, answer cautiously.\n\n"
        )

    # 2. Build formatted recent conversation history (limit to last 10 messages max)
    history_text = ""
    recent_history = request.history[-10:] if request.history else []
    if recent_history:
        history_lines = []
        for item in recent_history:
            speaker = "User" if item.role == "user" else "Assistant"
            history_lines.append(f"{speaker}: {item.content}")
        history_text = "Previous conversation:\n" + "\n".join(history_lines) + "\n\n"

    # 3. Combine knowledge context, recent history, and current user question
    full_prompt = f"{knowledge_context}{history_text}Current user question:\n{user_message}"

    # Data payload sent to Ollama's local API with CPU generation limits
    ollama_payload = {
        "model": MODEL_NAME,
        "system": SYSTEM_PROMPT,
        "prompt": full_prompt,
        "stream": False,
        "options": {
            "temperature": 0.3,
            "num_predict": 200
        }
    }

    try:
        response = requests.post(OLLAMA_URL, json=ollama_payload, timeout=120)
        
        if response.status_code != 200:
            raise HTTPException(
                status_code=500,
                detail=f"Ollama error: Returned status code {response.status_code}"
            )

        data = response.json()
        reply_text = data.get("response", "").strip()

        if not reply_text:
            raise HTTPException(
                status_code=500,
                detail="Ollama returned an empty response."
            )

        return {"reply": reply_text}

    except requests.exceptions.ConnectionError:
        raise HTTPException(
            status_code=503,
            detail="Could not connect to Ollama. Make sure Ollama is running."
        )
    except requests.exceptions.Timeout:
        raise HTTPException(
            status_code=504,
            detail="LLM response took too long. Please try a shorter question."
        )
    except HTTPException as he:
        raise he
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"An unexpected error occurred: {str(e)}"
        )

# 9. Conversation Test Evaluation endpoint
@app.post("/conversation-test/eval")
def eval_conversation(req: EvalRequest):
    user_ans = req.user_answer.strip()
    exp_ans = req.expected_answer.strip()
    question = req.question.strip()

    if not user_ans:
        return {
            "status": "incorrect",
            "feedback": "No answer provided.",
            "expected_answer": exp_ans,
            "explanation": "Please type or speak an answer to evaluate."
        }

    # Check normalized match
    norm_user = user_ans.lower().replace(" ", "").replace("।", "").replace(".", "")
    norm_exp = exp_ans.lower().replace(" ", "").replace("।", "").replace(".", "")

    if norm_user == norm_exp:
        return {
            "status": "correct",
            "feedback": "Excellent! Your answer is completely correct. Perfect Sanskrit!",
            "expected_answer": exp_ans,
            "explanation": "Great job! Keep practicing."
        }

    # Attempt LLM evaluation if Ollama is available
    prompt = (
        f"Question asked to student: '{question}'\n"
        f"Expected Sanskrit answer: '{exp_ans}'\n"
        f"Student's actual answer: '{user_ans}'\n\n"
        "Evaluate the student's answer as a Sanskrit teacher.\n"
        "Determine if it is 'correct', 'partially_correct', or 'incorrect'.\n"
        "Provide a concise 2-sentence feedback explaining any grammar/vocabulary mistake."
    )

    try:
        response = requests.post(
            OLLAMA_URL,
            json={
                "model": MODEL_NAME,
                "system": "You are a fair Sanskrit teacher evaluating a student's answer. Keep feedback short and helpful.",
                "prompt": prompt,
                "stream": False,
                "options": {
                    "temperature": 0.3,
                    "num_predict": 120
                }
            },
            timeout=30
        )
        if response.status_code == 200:
            llm_feedback = response.json().get("response", "").strip()
            if llm_feedback:
                status = "partially_correct"
                if "correct" in llm_feedback.lower() and "incorrect" not in llm_feedback.lower():
                    status = "correct"
                elif "incorrect" in llm_feedback.lower() or "wrong" in llm_feedback.lower():
                    status = "incorrect"

                return {
                    "status": status,
                    "feedback": llm_feedback,
                    "expected_answer": exp_ans,
                    "explanation": f"Expected: {exp_ans}"
                }
    except Exception:
        pass  # Rule-based fallback below

    # Rule-based fallback evaluation
    overlap = any(w in user_ans for w in exp_ans.split() if len(w) > 2)
    if overlap:
        return {
            "status": "partially_correct",
            "feedback": "Good effort! Your answer contains parts of the correct Sanskrit expression.",
            "expected_answer": exp_ans,
            "explanation": f"Expected target answer: '{exp_ans}'."
        }

    return {
        "status": "incorrect",
        "feedback": f"Not quite. The target answer was '{exp_ans}'.",
        "expected_answer": exp_ans,
        "explanation": "Practice this vocabulary item and try again!"
    }

# 10. Knowledge base keyword search endpoint
@app.post("/knowledge/search")
def search_knowledge(query: str):
    results = search_knowledge_base(query, top_k=5)
    return {"query": query, "results": results}
