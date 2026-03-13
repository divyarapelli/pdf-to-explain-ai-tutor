"use client";

import { useState, useRef, useEffect } from "react";
import { chatWithDocument } from "@/lib/api";
import type { ChatMessage } from "@/types";
import { Send, Bot, User, Sparkles } from "lucide-react";

const TIPS = [
  "Summarise the main topic",
  "What are the key concepts?",
  "Explain like I'm 5",
  "Give me an example",
  "What should I learn first?"
];

export default function ChatInterface({ documentId }: { documentId: string }) {
  const [msgs, setMsgs] = useState<ChatMessage[]>([]); 
  const [input, setInput] = useState(""); 
  const [busy, setBusy] = useState(false); 
  const [sources, setSources] = useState<string[]>([]); 
  const [showSrc, setShowSrc] = useState(false); 
  const bottom = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    bottom.current?.scrollIntoView({ behavior: "smooth" });
  }, [msgs]);
  
  const send = async (text?: string) => { 
    const t = text ?? input.trim(); 
    if (!t || busy) return; 
    
    setMsgs(p => [...p, { role: "user", content: t }]); 
    setInput(""); 
    setBusy(true); 
    
    try {
      const res = await chatWithDocument(documentId, t, msgs); 
      setMsgs(p => [...p, { role: "assistant", content: res.answer }]); 
      setSources(res.relevant_sections); 
    } catch {
      setMsgs(p => [...p, { role: "assistant", content: "Sorry, something went wrong." }]); 
    } finally {
      setBusy(false); 
    } 
  };
  
  return (
    <div className="flex flex-col h-[600px] rounded-xl bg-white border border-slate-200 shadow-sm overflow-hidden">
      <div className="flex items-center gap-3 border-b border-slate-200 px-6 py-4 bg-gradient-to-r from-brand-50 to-purple-50">
        <div className="rounded-full bg-brand-600 p-2">
          <Bot className="h-5 w-5 text-white"/>
        </div>
        <div>
          <h3 className="font-semibold text-slate-800">AI Tutor</h3>
          <p className="text-xs text-slate-500">Ask anything</p>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {msgs.length === 0 && (
          <div className="text-center py-8">
            <Sparkles className="h-12 w-12 text-brand-300 mx-auto mb-4"/>
            <p className="text-slate-500 mb-4">Ask me anything!</p>
            <div className="flex flex-wrap gap-2 justify-center">
              {TIPS.map(q => (
                <button 
                  key={q} 
                  onClick={() => send(q)} 
                  className="rounded-full border border-brand-200 bg-brand-50 px-3 py-1.5 text-xs text-brand-700 hover:bg-brand-100"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}
        
        {msgs.map((m, i) => (
          <div key={i} className={`flex gap-3 ${
            m.role === "user" ? "justify-end" : "justify-start"
          }`}>
            {m.role === "assistant" && (
              <div className="flex-shrink-0 rounded-full bg-brand-100 p-2 h-8 w-8 flex items-center justify-center">
                <Bot className="h-4 w-4 text-brand-600"/>
              </div>
            )}
            <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm ${
              m.role === "user" ? 
                "bg-brand-600 text-white rounded-br-md" : 
                "bg-slate-100 text-slate-700 rounded-bl-md"
            }`}>
              <p className="whitespace-pre-wrap">{m.content}</p>
            </div>
            {m.role === "user" && (
              <div className="flex-shrink-0 rounded-full bg-slate-200 p-2 h-8 w-8 flex items-center justify-center">
                <User className="h-4 w-4 text-slate-600"/>
              </div>
            )}
          </div>
        ))}
        
        {busy && (
          <div className="flex gap-3 justify-start">
            <div className="flex-shrink-0 rounded-full bg-brand-100 p-2 h-8 w-8 flex items-center justify-center">
              <Bot className="h-4 w-4 text-brand-600"/>
            </div>
            <div className="rounded-2xl bg-slate-100 px-4 py-3 rounded-bl-md">
              <div className="flex gap-1">
                <span className="h-2 w-2 rounded-full bg-slate-400 animate-bounce"/>
                <span className="h-2 w-2 rounded-full bg-slate-400 animate-bounce [animation-delay:0.15s]"/>
                <span className="h-2 w-2 rounded-full bg-slate-400 animate-bounce [animation-delay:0.3s]"/>
              </div>
            </div>
          </div>
        )}
        
        <div ref={bottom}/>
      </div>
      
      {sources.length > 0 && (
        <div className="border-t border-slate-100 px-4 py-2">
          <button 
            onClick={() => setShowSrc(!showSrc)} 
            className="text-xs text-slate-400 hover:text-slate-600"
          >
            📚 {showSrc ? "Hide" : "Show"} sources ({sources.length})
          </button>
          {showSrc && (
            <div className="mt-2 max-h-32 overflow-y-auto space-y-2">
              {sources.map((s, i) => (
                <p key={i} className="text-xs text-slate-400 bg-slate-50 rounded p-2 line-clamp-2">
                  {s}
                </p>
              ))}
            </div>
          )}
        </div>
      )}
      
      <form 
        onSubmit={e => { e.preventDefault(); send(); }} 
        className="border-t border-slate-200 p-4 flex gap-2"
      >
        <input 
          value={input} 
          onChange={e => setInput(e.target.value)} 
          placeholder="Ask a question…" 
          disabled={busy} 
          className="flex-1 rounded-xl border border-slate-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 disabled:opacity-50"
        />
        <button 
          type="submit" 
          disabled={!input.trim() || busy} 
          className="rounded-xl bg-brand-600 px-4 py-2.5 text-white hover:bg-brand-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Send className="h-4 w-4"/>
        </button>
      </form>
    </div>
  );
}
