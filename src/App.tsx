import { useState, useEffect } from "react";
import type { UploadResponse, TabType } from "@/types";
import FileUpload from "@/components/FileUpload";
import Sidebar from "@/components/Sidebar";
import ExplanationView from "@/components/ExplanationView";
import DiagramView from "@/components/DiagramView";
import AudioPlayer from "@/components/AudioPlayer";
import QuizSection from "@/components/QuizSection";
import ChatInterface from "@/components/ChatInterface";
import AnimationView from "@/components/AnimationView";
import { GraduationCap, Sparkles } from "lucide-react";

export default function App() {
  const [upload, setUpload] = useState<UploadResponse | null>(null); 
  const [tab, setTab] = useState<TabType>("explain");
  const [loaded, setLoaded] = useState(false);
  const docId = upload?.document_id;
  
  useEffect(() => {
    setLoaded(true);
  }, []);
  
  const panel = () => { 
    if (!docId) return null; 
    switch(tab) { 
      case "explain": 
        return <ExplanationView documentId={docId}/>; 
      case "diagrams": 
        return <DiagramView documentId={docId}/>; 
      case "audio": 
        return <AudioPlayer documentId={docId}/>; 
      case "quiz": 
        return <QuizSection documentId={docId}/>; 
      case "chat": 
        return <ChatInterface documentId={docId}/>; 
      case "animation": 
        return <AnimationView documentId={docId}/>; 
    } 
  };
  
  return (
    <main className="min-h-screen relative overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute w-96 h-96 rounded-full blur-3xl animate-float" style={{ top: '10%', left: '10%', background: 'rgba(255, 0, 110, 0.15)', animationDelay: '0s' }} />
        <div className="absolute w-96 h-96 rounded-full blur-3xl animate-float" style={{ top: '50%', right: '10%', background: 'rgba(0, 245, 255, 0.15)', animationDelay: '2s' }} />
        <div className="absolute w-80 h-80 rounded-full blur-3xl animate-float" style={{ bottom: '10%', left: '30%', background: 'rgba(157, 0, 255, 0.15)', animationDelay: '4s' }} />
      </div>
      
      {/* Main Content */}
      <div className="relative z-10">
        {/* Header */}
        <header className="glass border-b border-white/10 sticky top-0 z-50">
          <div className="mx-auto max-w-7xl px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-gradient-to-br from-[#FF006E] to-[#9D00FF] p-2.5 glow-pink">
                <GraduationCap className="h-7 w-7 text-white"/>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gradient">PDF-to-Explain AI Tutor</h1>
                <p className="text-xs text-white/50">Upload → Understand → Learn</p>
              </div>
            </div>
            {upload && (
              <div className="hidden sm:flex items-center gap-2 text-sm text-white/70">
                <span className="h-2 w-2 rounded-full bg-[#39FF14] animate-pulse"/>
                <span className="glass px-3 py-1 rounded-full text-xs">
                  {upload.filename}
                </span>
              </div>
            )}
          </div>
        </header>
        
        {/* Main Content Area */}
        <div className="mx-auto max-w-7xl px-6 py-8">
          {!upload ? (
            <div className={`mx-auto max-w-2xl transition-all duration-700 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              {/* Hero Section */}
              <div className="text-center mb-12">
                <div className="inline-flex items-center gap-2 glass px-4 py-2 rounded-full mb-6">
                  <Sparkles className="h-4 w-4 text-[#FF006E]" />
                  <span className="text-sm text-white/80">Powered by AI</span>
                </div>
                
                <h2 className="text-5xl font-bold mb-6">
                  <span className="text-gradient">Learn Anything</span>
                  <br />
                  <span className="text-white">from Your PDFs</span>
                </h2>
                
                <p className="text-white/60 text-lg max-w-md mx-auto mb-8">
                  Upload any PDF and get AI explanations, diagrams, audio, quizzes, and a personal tutor.
                </p>
              </div>
              
              {/* File Upload */}
              <div className="glass glow-cyan hover-lift">
                <FileUpload onUploadComplete={setUpload}/>
              </div>
              
              {/* Feature Cards */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-12">
                {[
                  { i: "📖", t: "Explanations", d: "Complex → simple", c: "from-[#FF006E] to-[#9D00FF]" },
                  { i: "📊", t: "Diagrams", d: "Visual flowcharts", c: "from-[#00F5FF] to-[#39FF14]" },
                  { i: "🔊", t: "Audio", d: "Listen & learn", c: "from-[#FF5F1F] to-[#FFFF00]" },
                  { i: "📝", t: "Quiz", d: "Test knowledge", c: "from-[#9D00FF] to-[#FF006E]" },
                  { i: "🤖", t: "AI Tutor", d: "Ask anything", c: "from-[#39FF14] to-[#00F5FF]" },
                  { i: "🎬", t: "Animation", d: "Step-by-step", c: "from-[#FFFF00] to-[#FF5F1F]" }
                ].map((f, index) => (
                  <div 
                    key={f.t} 
                    className="glass p-5 text-center hover-lift card-3d group"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className={`w-12 h-12 mx-auto rounded-xl bg-gradient-to-br ${f.c} flex items-center justify-center text-2xl mb-3 group-hover:scale-110 transition-transform`}>
                      {f.i}
                    </div>
                    <h4 className="font-semibold text-white text-sm">{f.t}</h4>
                    <p className="text-xs text-white/50 mt-1">{f.d}</p>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex flex-col lg:flex-row gap-8 animate-slide-up">
              <Sidebar activeTab={tab} onTabChange={setTab} documentUploaded={!!upload}/>
              <div className="flex-1 min-w-0">
                <div className="glass p-6 min-h-[600px]">
                  {panel()}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
