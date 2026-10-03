import os
import requests
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

# 1. Load configuration from .env file
load_dotenv()

OLLAMA_URL = os.getenv("OLLAMA_URL", "http://localhost:11434/api/generate")
MODEL_NAME = os.getenv("MODEL_NAME", "llama3.2:3b")

# 2. Create the FastAPI app
app = FastAPI(title="Sanskrit Learning Chatbot Backend")

# 3. Configure CORS so React (frontend) can send requests to FastAPI (backend)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows requests from any origin during local development
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 4. System prompt that defines the Sanskrit teacher persona for Ollama / Llama 3.2 3B
SYSTEM_PROMPT = (
    "You are a Sanskrit teacher.\n"
    "Teach beginners.\n"
    "Explain concepts in simple English.\n"
    "Give Sanskrit examples.\n"
    "Give meanings of Sanskrit examples.\n"
    "Correct user mistakes.\n"
    "Explain why an answer is wrong.\n"
    "Do not invent Sanskrit grammar rules.\n"
    "Keep explanations understandable."
)

# 5. Define the request body structure using Pydantic
class ChatRequest(BaseModel):
    message: str

# 6. Basic health check route
@app.get("/")
def home():
    return {"status": "Sanskrit Learning Chatbot API is running"}

# 7. Main Chat endpoint
@app.post("/chat")
def chat(request: ChatRequest):
    user_message = request.message.strip()

    # Reject empty messages
    if not user_message:
        raise HTTPException(status_code=400, detail="Message cannot be empty.")

    # Data payload sent to Ollama's local API
    ollama_payload = {
        "model": MODEL_NAME,
        "system": SYSTEM_PROMPT,
        "prompt": user_message,
        "stream": False
    }

    try:
        # Call the local Ollama endpoint directly using python-requests
        response = requests.post(OLLAMA_URL, json=ollama_payload, timeout=60)
        
        # If Ollama returns a non-200 HTTP code
        if response.status_code != 200:
            raise HTTPException(
                status_code=500,
                detail=f"Ollama error: Returned status code {response.status_code}"
            )

        # Parse Ollama's JSON response
        data = response.json()
        reply_text = data.get("response", "").strip()

        # Return the reply to the React frontend
        return {"reply": reply_text}

    except requests.exceptions.ConnectionError:
        # Error handling when Ollama service is not running locally
        raise HTTPException(
            status_code=503,
            detail="Could not connect to Ollama. Make sure Ollama is running."
        )
    except requests.exceptions.Timeout:
        raise HTTPException(
            status_code=504,
            detail="Ollama request timed out. The model took too long to respond."
        )
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"An unexpected error occurred: {str(e)}"
        )
