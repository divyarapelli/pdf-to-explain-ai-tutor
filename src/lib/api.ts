import type { 
  UploadResponse, 
  ExplainResponse, 
  VisualResponse, 
  AudioResponse, 
  QuizResponse, 
  ChatResponse, 
  ChatMessage, 
  AnimationResponse 
} from "@/types";

const API = import.meta.env.VITE_API_URL || "http://localhost:8000";

async function apiFetch<T>(endpoint: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API}${endpoint}`, init);
  if (!res.ok) {
    const body = await res.json().catch(() => ({ detail: res.statusText }));
    throw new Error(body.detail || `API ${res.status}`);
  }
  return res.json();
}

export async function uploadPDF(file: File): Promise<UploadResponse> {
  console.log("Uploading PDF:", file.name, "Size:", file.size);
  
  const fd = new FormData();
  fd.append("file", file);
  
  try {
    const response = await fetch("http://localhost:8000/api/upload", { 
      method: "POST", 
      body: fd,
      mode: "cors"
    });
    
    console.log("Response status:", response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error("Upload failed:", errorText);
      throw new Error(`Upload failed: ${response.status} - ${errorText}`);
    }
    
    const result = await response.json();
    console.log("Upload successful:", result);
    return result;
  } catch (error) {
    console.error("Upload error:", error);
    throw new Error(error instanceof Error ? error.message : "Upload failed");
  }
}

export async function generateExplanation(
  documentId: string, 
  detailLevel = "medium", 
  targetAudience = "high school student"
): Promise<ExplainResponse> {
  return apiFetch<ExplainResponse>("/api/explain", { 
    method: "POST", 
    headers: { "Content-Type": "application/json" }, 
    body: JSON.stringify({ 
      document_id: documentId, 
      detail_level: detailLevel, 
      target_audience: targetAudience 
    }) 
  });
}

export async function generateDiagrams(
  documentId: string, 
  diagramType = "auto"
): Promise<VisualResponse> {
  return apiFetch<VisualResponse>("/api/visual/diagrams", { 
    method: "POST", 
    headers: { "Content-Type": "application/json" }, 
    body: JSON.stringify({ 
      document_id: documentId, 
      diagram_type: diagramType 
    }) 
  });
}

export async function generateAnimation(documentId: string): Promise<AnimationResponse> {
  return apiFetch<AnimationResponse>("/api/visual/animation", { 
    method: "POST", 
    headers: { "Content-Type": "application/json" }, 
    body: JSON.stringify({ 
      document_id: documentId 
    }) 
  });
}

export async function generateAudio(
  documentId: string, 
  voice = "alloy", 
  speed = 1.0
): Promise<AudioResponse> {
  return apiFetch<AudioResponse>("/api/audio/generate", { 
    method: "POST", 
    headers: { "Content-Type": "application/json" }, 
    body: JSON.stringify({ 
      document_id: documentId, 
      voice, 
      speed 
    }) 
  });
}

export function getAudioUrl(path: string): string {
  return `${API}${path}`;
}

export async function generateQuiz(
  documentId: string, 
  numQuestions = 5, 
  difficulty = "medium"
): Promise<QuizResponse> {
  return apiFetch<QuizResponse>("/api/quiz/generate", { 
    method: "POST", 
    headers: { "Content-Type": "application/json" }, 
    body: JSON.stringify({ 
      document_id: documentId, 
      num_questions: numQuestions, 
      difficulty 
    }) 
  });
}

export async function chatWithDocument(
  documentId: string, 
  message: string, 
  history: ChatMessage[]
): Promise<ChatResponse> {
  return apiFetch<ChatResponse>("/api/chat", { 
    method: "POST", 
    headers: { "Content-Type": "application/json" }, 
    body: JSON.stringify({ 
      document_id: documentId, 
      message, 
      history 
    }) 
  });
}
