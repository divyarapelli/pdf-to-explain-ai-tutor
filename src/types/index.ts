export interface UploadResponse {
  document_id: string;
  filename: string;
  page_count: number;
  total_chunks: number;
  preview_text: string;
}

export interface KeyPoint {
  title: string;
  description: string;
  importance: string;
}

export interface DifficultConcept {
  term: string;
  original_context: string;
  simple_explanation: string;
  analogy: string;
}

export interface ExplainResponse {
  document_id: string;
  summary: string;
  simple_explanation: string;
  key_points: KeyPoint[];
  examples: string[];
  difficult_concepts: DifficultConcept[];
}

export interface DiagramData {
  title: string;
  mermaid_code: string;
  description: string;
  diagram_type: string;
}

export interface VisualResponse {
  document_id: string;
  diagrams: DiagramData[];
}

export interface AudioResponse {
  document_id: string;
  audio_url: string;
  duration_estimate: string;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correct_answer: number;
  explanation: string;
}

export interface QuizResponse {
  document_id: string;
  questions: QuizQuestion[];
}

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export interface ChatResponse {
  answer: string;
  relevant_sections: string[];
}

export interface AnimationStep {
  step_number: number;
  title: string;
  content: string;
  visual_description: string;
  icon: string;
}

export interface AnimationResponse {
  document_id: string;
  title: string;
  steps: AnimationStep[];
}

export type TabType = "explain" | "diagrams" | "audio" | "quiz" | "chat" | "animation";
