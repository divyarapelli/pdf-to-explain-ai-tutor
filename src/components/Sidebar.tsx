"use client";

import type { TabType } from "@/types";
import { BookOpen, GitBranch, Volume2, HelpCircle, MessageSquare, Play, GraduationCap } from "lucide-react";

const TABS: { id: TabType; label: string; icon: React.ReactNode; desc: string }[] = [
  { id: "explain", label: "Explain", icon: <BookOpen className="h-5 w-5"/>, desc: "AI explanation" },
  { id: "diagrams", label: "Diagrams", icon: <GitBranch className="h-5 w-5"/>, desc: "Visual diagrams" },
  { id: "animation", label: "Animate", icon: <Play className="h-5 w-5"/>, desc: "Step-by-step" },
  { id: "audio", label: "Audio", icon: <Volume2 className="h-5 w-5"/>, desc: "Listen & learn" },
  { id: "quiz", label: "Quiz", icon: <HelpCircle className="h-5 w-5"/>, desc: "Test yourself" },
  { id: "chat", label: "AI Tutor", icon: <MessageSquare className="h-5 w-5"/>, desc: "Ask questions" },
];

export default function Sidebar({ 
  activeTab, 
  onTabChange, 
  documentUploaded 
}: { 
  activeTab: TabType; 
  onTabChange: (t: TabType) => void; 
  documentUploaded: boolean; 
}) {
  return (
    <div className="w-full lg:w-64 lg:flex-shrink-0">
      <div className="rounded-xl bg-white border border-slate-200 p-2 shadow-sm lg:sticky lg:top-6">
        <div className="flex items-center gap-3 px-3 py-4 mb-2">
          <div className="rounded-xl bg-brand-600 p-2">
            <GraduationCap className="h-6 w-6 text-white"/>
          </div>
          <div>
            <h2 className="font-bold text-slate-800 text-sm">AI Tutor</h2>
            <p className="text-xs text-slate-400">PDF Explorer</p>
          </div>
        </div>
        <nav className="space-y-1">
          {TABS.map(tab => (
            <button 
              key={tab.id} 
              onClick={() => documentUploaded && onTabChange(tab.id)} 
              disabled={!documentUploaded} 
              className={`w-full flex items-center gap-3 rounded-lg px-3 py-3 text-left transition-all ${
                activeTab === tab.id ? 
                  "bg-brand-50 text-brand-700 shadow-sm" : 
                  documentUploaded ? 
                    "text-slate-600 hover:bg-slate-50" : 
                    "text-slate-300 cursor-not-allowed"
              }`}
            >
              {tab.icon}
              <div>
                <p className="text-sm font-medium">{tab.label}</p>
                <p className="text-xs opacity-60">{tab.desc}</p>
              </div>
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
}
