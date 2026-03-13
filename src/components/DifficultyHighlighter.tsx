"use client";

import { useState } from "react";
import type { DifficultConcept } from "@/types";
import { AlertTriangle, ChevronDown, ChevronUp } from "lucide-react";

export default function DifficultyHighlighter({ concepts }: { concepts: DifficultConcept[] }) {
  const [open, setOpen] = useState<Set<number>>(new Set());
  
  if (!concepts.length) return null;
  
  const toggle = (i: number) => {
    setOpen(prev => {
      const n = new Set(prev);
      n.has(i) ? n.delete(i) : n.add(i);
      return n;
    });
  };
  
  return (
    <div className="rounded-xl bg-white border border-slate-200 p-6 shadow-sm">
      <h3 className="text-lg font-bold text-slate-800 mb-2 flex items-center gap-2">
        <AlertTriangle className="h-5 w-5 text-amber-500"/>
        Difficult Concepts
      </h3>
      <div className="space-y-2 mt-4">
        {concepts.map((c, i) => (
          <div key={i} className="rounded-lg border border-slate-200 overflow-hidden">
            <button 
              onClick={() => toggle(i)} 
              className="w-full flex items-center justify-between p-4 hover:bg-slate-50 text-left"
            >
              <span className="font-semibold text-brand-700">📌 {c.term}</span>
              {open.has(i) ? 
                <ChevronUp className="h-4 w-4 text-slate-400"/> : 
                <ChevronDown className="h-4 w-4 text-slate-400"/>
              }
            </button>
            {open.has(i) && (
              <div className="px-4 pb-4 space-y-3 animate-fade-in">
                <div className="rounded-lg bg-slate-50 p-3">
                  <p className="text-xs font-medium text-slate-400 mb-1">CONTEXT</p>
                  <p className="text-sm text-slate-600 italic">
                    &ldquo;{c.original_context}&rdquo;
                  </p>
                </div>
                <div className="rounded-lg bg-emerald-50 p-3">
                  <p className="text-xs font-medium text-emerald-600 mb-1">SIMPLE</p>
                  <p className="text-sm text-slate-700">{c.simple_explanation}</p>
                </div>
                <div className="rounded-lg bg-purple-50 p-3">
                  <p className="text-xs font-medium text-purple-600 mb-1">ANALOGY</p>
                  <p className="text-sm text-slate-700">💭 {c.analogy}</p>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
