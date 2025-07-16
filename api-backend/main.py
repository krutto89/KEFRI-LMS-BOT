from fastapi import FastAPI
from pydantic import BaseModel
import google.generativeai as genai
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os
from fastapi.staticfiles import StaticFiles

# Load environment variables
load_dotenv()

# Configure API
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

# Initialize
app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["POST"],
    allow_headers=["*"],
)

# Initialize model 
model = genai.GenerativeModel("gemini-1.5-flash")

# request body
class MessageRequest(BaseModel):
    message: str

@app.post("/librarybot")
async def librarybot(request: MessageRequest):
    chat = model.start_chat(history=[])
    system_prompt = (
        "You are a Jazamiti chatbot. Answer only questions about trees,seedlings and cultivation. "
        "Politely refuse non-related questions. Use simple English, friendly tone, under 100 words. User question: "
    )
    full_message = system_prompt + request.message
    response = chat.send_message(full_message)
    return {"response": response.text}

# Mount static frontend files (assumes they are in a folder named 'frontend')
app.mount("/", StaticFiles(directory="frontend", html=True), name="frontend")
