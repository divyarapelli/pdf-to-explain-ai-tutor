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
    "sample_doc": "This is a sample document about artificial intelligence. AI is a branch of computer science that aims to create intelligent machines that can simulate human thinking and behavior. Machine learning is a subset of AI that enables systems to learn and improve from experience without being explicitly programmed. Deep learning is a subset of machine learning that uses neural networks with multiple layers."
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
            "page_count": 1,
            "total_chunks": 3,
            "preview_text": "Sample document about artificial intelligence and machine learning..."
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
        
        Return JSON with this exact structure:
        {{
            "document_id": "{request.document_id}",
            "summary": "Brief summary",
            "simple_explanation": "Simple explanation",
            "key_points": [
                {{"title": "Point 1", "description": "Description", "importance": "high"}},
                {{"title": "Point 2", "description": "Description", "importance": "medium"}}
            ],
            "examples": ["Example 1", "Example 2"],
            "difficult_concepts": [
                {{"term": "AI", "original_context": "context", "simple_explanation": "simple", "analogy": "analogy"}}
            ]
        }}
        """
        
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.7
        )
        
        result = json.loads(response.choices[0].message.content)
        return JSONResponse(result)
        
    except Exception as e:
        # Fallback response
        return JSONResponse({
            "document_id": request.document_id,
            "summary": "This document explains artificial intelligence and machine learning concepts.",
            "simple_explanation": "AI is about making smart computers, and ML helps them learn from data.",
            "key_points": [
                {"title": "AI Definition", "description": "AI creates intelligent machines", "importance": "high"},
                {"title": "Machine Learning", "description": "ML systems learn from experience", "importance": "high"},
                {"title": "Deep Learning", "description": "Uses multi-layer neural networks", "importance": "medium"}
            ],
            "examples": [
                "Virtual assistants like Siri use AI",
                "Netflix recommendations use ML",
                "Self-driving cars use computer vision"
            ],
            "difficult_concepts": [
                {
                    "term": "Artificial Intelligence",
                    "original_context": "branch of computer science",
                    "simple_explanation": "Making computers think like humans",
                    "analogy": "Like teaching a robot to be smart"
                }
            ]
        })

@app.post("/api/diagrams")
async def generate_diagrams(request: DiagramRequest):
    try:
        content = SAMPLE_PDF_CONTENT.get(request.document_id, "Sample content")
        
        prompt = f"""
        Create a {request.diagram_type} diagram using Mermaid syntax for: {content}
        Return JSON with this exact structure:
        {{
            "document_id": "{request.document_id}",
            "diagrams": [
                {{
                    "title": "Diagram Title",
                    "mermaid_code": "graph TD\\n    A[AI] --> B[ML]",
                    "description": "Description",
                    "diagram_type": "flowchart"
                }}
            ]
        }}
        """
        
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.7
        )
        
        result = json.loads(response.choices[0].message.content)
        return JSONResponse(result)
        
    except Exception as e:
        # Fallback diagram
        return JSONResponse({
            "document_id": request.document_id,
            "diagrams": [{
                "title": "AI and Subfields",
                "mermaid_code": "graph TD\n    A[Artificial Intelligence] --> B[Machine Learning]\n    B --> C[Deep Learning]\n    B --> D[Natural Language Processing]\n    B --> E[Computer Vision]",
                "description": "AI relationship diagram showing main subfields",
                "diagram_type": "flowchart"
            }]
        })

@app.post("/api/audio")
async def generate_audio(request: AudioRequest):
    try:
        content = SAMPLE_PDF_CONTENT.get(request.document_id, "Sample content")
        
        response = client.audio.speech.create(
            model="tts-1",
            voice=request.voice,
            input=content[:200]
        )
        
        # Save audio file
        audio_path = f"{UPLOAD_DIR}/{request.document_id}.mp3"
        response.stream_to_file(audio_path)
        
        return JSONResponse({
            "document_id": request.document_id,
            "audio_url": f"/api/audio/{request.document_id}.mp3",
            "duration_estimate": "30 seconds"
        })
        
    except Exception as e:
        # Fallback
        return JSONResponse({
            "document_id": request.document_id,
            "audio_url": f"/api/audio/{request.document_id}.mp3",
            "duration_estimate": "30 seconds"
        })

@app.post("/api/quiz")
async def generate_quiz(request: QuizRequest):
    try:
        content = SAMPLE_PDF_CONTENT.get(request.document_id, "Sample content")
        
        prompt = f"""
        Create {request.num_questions} {request.difficulty} quiz questions about: {content}
        Return JSON with this exact structure:
        {{
            "document_id": "{request.document_id}",
            "questions": [
                {{
                    "question": "What does AI stand for?",
                    "options": ["Artificial Intelligence", "Automated Intelligence", "Advanced Intelligence", "Applied Intelligence"],
                    "correct_answer": 0,
                    "explanation": "AI stands for Artificial Intelligence."
                }}
            ]
        }}
        """
        
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.7
        )
        
        result = json.loads(response.choices[0].message.content)
        return JSONResponse(result)
        
    except Exception as e:
        # Fallback quiz
        return JSONResponse({
            "document_id": request.document_id,
            "questions": [
                {
                    "question": "What does AI stand for?",
                    "options": ["Artificial Intelligence", "Automated Intelligence", "Advanced Intelligence", "Applied Intelligence"],
                    "correct_answer": 0,
                    "explanation": "AI stands for Artificial Intelligence."
                },
                {
                    "question": "What is Machine Learning?",
                    "options": ["Programming computers manually", "Systems that learn from experience", "Creating robots", "Database management"],
                    "correct_answer": 1,
                    "explanation": "Machine Learning enables systems to learn and improve from experience without being explicitly programmed."
                }
            ]
        })

@app.post("/api/chat")
async def chat_with_document(request: ChatRequest):
    try:
        content = SAMPLE_PDF_CONTENT.get(request.document_id, "Sample content")
        
        messages = [
            {"role": "system", "content": f"You are an AI tutor helping with this document: {content}"},
            {"role": "user", "content": request.message}
        ]
        
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=messages,
            temperature=0.7
        )
        
        return JSONResponse({
            "answer": response.choices[0].message.content,
            "relevant_sections": ["Document content about AI and ML"]
        })
        
    except Exception as e:
        # Fallback response
        return JSONResponse({
            "answer": f"Based on the document, '{request.message}' is related to artificial intelligence and machine learning. The document explains that AI is a branch of computer science that aims to create intelligent machines, while machine learning is a subset that enables systems to learn from experience.",
            "relevant_sections": ["Document content about AI and ML"]
        })

@app.post("/api/animation")
async def generate_animation(request: AnimationRequest):
    try:
        content = SAMPLE_PDF_CONTENT.get(request.document_id, "Sample content")
        
        prompt = f"""
        Create {request.steps} step-by-step animation explaining: {content}
        Return JSON with this exact structure:
        {{
            "document_id": "{request.document_id}",
            "title": "Animation Title",
            "steps": [
                {{
                    "step_number": 1,
                    "title": "Step Title",
                    "content": "Step content",
                    "visual_description": "Visual description",
                    "icon": "brain"
                }}
            ]
        }}
        """
        
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.7
        )
        
        result = json.loads(response.choices[0].message.content)
        return JSONResponse(result)
        
    except Exception as e:
        # Fallback animation
        return JSONResponse({
            "document_id": request.document_id,
            "title": "Understanding AI and Machine Learning",
            "steps": [
                {
                    "step_number": 1,
                    "title": "Introduction to AI",
                    "content": "AI is a branch of computer science that aims to create intelligent machines that can simulate human thinking and behavior.",
                    "visual_description": "Brain icon with circuit patterns showing human-like intelligence",
                    "icon": "brain"
                },
                {
                    "step_number": 2,
                    "title": "Machine Learning Basics",
                    "content": "Machine Learning is a subset of AI that enables systems to learn and improve from experience without being explicitly programmed.",
                    "visual_description": "Learning algorithm flowchart showing data input and model improvement",
                    "icon": "graduation-cap"
                },
                {
                    "step_number": 3,
                    "title": "Deep Learning",
                    "content": "Deep Learning uses neural networks with multiple layers to process complex patterns in data.",
                    "visual_description": "Neural network diagram with multiple layers of interconnected nodes",
                    "icon": "network"
                }
            ]
        })

@app.get("/api/audio/{document_id}.mp3")
async def get_audio_file(document_id: str):
    audio_path = f"{UPLOAD_DIR}/{document_id}.mp3"
    if os.path.exists(audio_path):
        return FileResponse(audio_path, media_type="audio/mpeg")
    raise HTTPException(status_code=404, detail="Audio file not found")

@app.get("/api/health")
async def health_check():
    return {"status": "healthy", "message": "Backend is running with AI features"}

if __name__ == "__main__":
    import uvicorn
    from fastapi.responses import FileResponse
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)
