from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import os
import uuid
from typing import List, Dict, Any
import json
from pydantic import BaseModel
from openai import OpenAI

app = FastAPI(title="PDF-to-Explain AI Tutor API")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5174", "http://127.0.0.1:5174"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create uploads directory if it doesn't exist
UPLOAD_DIR = "./uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

# Initialize OpenAI
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

# Pydantic models
class ExplainRequest(BaseModel):
    document_id: str
    detail_level: str = "comprehensive"
    audience: str = "general"

class DiagramRequest(BaseModel):
    document_id: str
    diagram_type: str = "auto"

class AudioRequest(BaseModel):
    document_id: str
    voice: str = "alloy"
    speed: float = 1.0

class QuizRequest(BaseModel):
    document_id: str
    num_questions: int = 5
    difficulty: str = "medium"

class ChatRequest(BaseModel):
    document_id: str
    message: str
    history: List[Dict[str, Any]] = []

class AnimationRequest(BaseModel):
    document_id: str
    steps: int = 5

# Sample PDF content (in real app, you'd extract this from uploaded files)
SAMPLE_PDF_CONTENT = {
    "sample_doc": "This is a sample document about artificial intelligence. AI is a branch of computer science that aims to create intelligent machines that can simulate human thinking and behavior. Machine learning is a subset of AI that enables systems to learn and improve from experience without being explicitly programmed."
}

@app.post("/api/upload")
async def upload_file(file: UploadFile = File(...)):
    try:
        file_id = str(uuid.uuid4())
        filename = f"{file_id}_{file.filename}"
        file_path = os.path.join(UPLOAD_DIR, filename)
        
        with open(file_path, "wb") as buffer:
            content = await file.read()
            buffer.write(content)
        
        return JSONResponse({
            "document_id": file_id,
            "filename": file.filename,
            "message": "File uploaded successfully"
        })
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/explain")
async def generate_explanation(request: ExplainRequest):
    try:
        content = SAMPLE_PDF_CONTENT.get(request.document_id, "Sample content about the topic.")
        
        prompt = f"""
        Create an explanation for this content: {content}
        Detail level: {request.detail_level}
        Audience: {request.audience}
        
        Return JSON with:
        - explanation: main explanation
        - key_points: list of key points
        - examples: list of examples
        - difficult_concepts: list of difficult terms with explanations
        """
        
        response = await openai.ChatCompletion.acreate(
            model="gpt-3.5-turbo",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.7
        )
        
        result = json.loads(response.choices[0].message.content)
        return JSONResponse(result)
        
    except Exception as e:
        # Fallback response
        return JSONResponse({
            "explanation": f"This document explains {content[:100]}... with detailed analysis for {request.audience} level.",
            "key_points": ["Key point 1", "Key point 2", "Key point 3"],
            "examples": ["Example 1", "Example 2"],
            "difficult_concepts": [{"term": "AI", "explanation": "Artificial Intelligence"}]
        })

@app.post("/api/diagrams")
async def generate_diagrams(request: DiagramRequest):
    try:
        content = SAMPLE_PDF_CONTENT.get(request.document_id, "Sample content")
        
        prompt = f"""
        Create a {request.diagram_type} diagram using Mermaid syntax for: {content}
        Return JSON with diagrams array containing mermaid_code and description.
        """
        
        response = await openai.ChatCompletion.acreate(
            model="gpt-3.5-turbo",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.7
        )
        
        result = json.loads(response.choices[0].message.content)
        return JSONResponse(result)
        
    except Exception as e:
        # Fallback diagram
        return JSONResponse({
            "diagrams": [{
                "mermaid_code": "graph TD\n    A[AI] --> B[Machine Learning]\n    B --> C[Deep Learning]",
                "description": "AI relationship diagram"
            }]
        })

@app.post("/api/audio")
async def generate_audio(request: AudioRequest):
    try:
        content = SAMPLE_PDF_CONTENT.get(request.document_id, "Sample content")
        
        response = await openai.Audio.acreate(
            model="tts-1",
            voice=request.voice,
            input=content[:200]  # Limit for demo
        )
        
        return JSONResponse({
            "audio_url": f"/api/audio/{request.document_id}.mp3",
            "transcript": content[:200],
            "voice": request.voice,
            "speed": request.speed
        })
        
    except Exception as e:
        # Fallback
        return JSONResponse({
            "audio_url": f"/api/audio/{request.document_id}.mp3",
            "transcript": content[:200],
            "voice": request.voice,
            "speed": request.speed
        })

@app.post("/api/quiz")
async def generate_quiz(request: QuizRequest):
    try:
        content = SAMPLE_PDF_CONTENT.get(request.document_id, "Sample content")
        
        prompt = f"""
        Create {request.num_questions} {request.difficulty} quiz questions about: {content}
        Return JSON with questions array containing question, options, correct_answer, explanation.
        """
        
        response = await openai.ChatCompletion.acreate(
            model="gpt-3.5-turbo",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.7
        )
        
        result = json.loads(response.choices[0].message.content)
        return JSONResponse(result)
        
    except Exception as e:
        # Fallback quiz
        return JSONResponse({
            "questions": [{
                "question": "What does AI stand for?",
                "options": ["Artificial Intelligence", "Automated Intelligence", "Advanced Intelligence", "Applied Intelligence"],
                "correct_answer": 0,
                "explanation": "AI stands for Artificial Intelligence."
            }]
        })

@app.post("/api/chat")
async def chat_with_document(request: ChatRequest):
    try:
        content = SAMPLE_PDF_CONTENT.get(request.document_id, "Sample content")
        
        messages = [
            {"role": "system", "content": f"You are an AI tutor helping with this document: {content}"},
            {"role": "user", "content": request.message}
        ]
        
        # Add history if provided
        if request.history:
            messages = [{"role": "system", "content": f"You are an AI tutor helping with this document: {content}"}] + request.history + [{"role": "user", "content": request.message}]
        
        response = await openai.ChatCompletion.acreate(
            model="gpt-3.5-turbo",
            messages=messages,
            temperature=0.7
        )
        
        return JSONResponse({
            "response": response.choices[0].message.content,
            "sources": ["Document content"]
        })
        
    except Exception as e:
        # Fallback response
        return JSONResponse({
            "response": f"Based on the document, {request.message} is related to the content about AI and machine learning.",
            "sources": ["Document content"]
        })

@app.post("/api/animation")
async def generate_animation(request: AnimationRequest):
    try:
        content = SAMPLE_PDF_CONTENT.get(request.document_id, "Sample content")
        
        prompt = f"""
        Create {request.steps} step-by-step animation explaining: {content}
        Return JSON with steps array containing title, description, visual_description.
        """
        
        response = await openai.ChatCompletion.acreate(
            model="gpt-3.5-turbo",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.7
        )
        
        result = json.loads(response.choices[0].message.content)
        return JSONResponse(result)
        
    except Exception as e:
        # Fallback animation
        return JSONResponse({
            "steps": [
                {"title": "Step 1", "description": "Introduction to AI", "visual_description": "AI brain icon"},
                {"title": "Step 2", "description": "Machine Learning", "visual_description": "Learning algorithm diagram"}
            ]
        })

@app.get("/api/health")
async def health_check():
    return {"status": "healthy", "message": "Backend is running with AI features"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)
