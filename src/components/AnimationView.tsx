"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { generateAnimation } from "@/lib/api";
import type { AnimationStep } from "@/types";
import LoadingSpinner from "./LoadingSpinner";
import { Play, ChevronLeft, ChevronRight, RotateCcw } from "lucide-react";

export default function AnimationView({ documentId }: { documentId: string }) {
  const [steps, setSteps] = useState<AnimationStep[]>([]); 
  const [title, setTitle] = useState(""); 
  const [loading, setLoading] = useState(false); 
  const [error, setError] = useState<string | null>(null); 
  const [cur, setCur] = useState(0); 
  const [auto, setAuto] = useState(false);
  
  const generate = async () => { 
    setLoading(true); 
    setError(null); 
    try {
      const r = await generateAnimation(documentId); 
      setSteps(r.steps); 
      setTitle(r.title); 
      setCur(0); 
    } catch(e: unknown) { 
      setError(e instanceof Error ? e.message : "Failed"); 
    } finally { 
      setLoading(false); 
    } 
  };
  
  const autoPlay = () => { 
    setAuto(true); 
    setCur(0); 
    let i = 0; 
    const iv = setInterval(() => { 
      i++; 
      if (i >= steps.length) { 
        clearInterval(iv); 
        setAuto(false); 
      } else {
        setCur(i); 
      }
    }, 3000); 
  };
  
  if (loading) return <LoadingSpinner message="🎬 Creating animation…" />;
  
  if (!steps.length) return (
    <div className="space-y-6">
      <div className="rounded-xl bg-white border border-slate-200 p-6 shadow-sm">
        <h3 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
          <Play className="h-5 w-5 text-brand-500"/>
          Animated Explanation
        </h3>
        <p className="text-sm text-slate-500 mb-6">Step-by-step animated slides.</p>
        <button 
          onClick={generate} 
          className="w-full rounded-xl bg-brand-600 px-6 py-3 text-white font-semibold hover:bg-brand-700 shadow-lg shadow-brand-600/20"
        >
          Generate
        </button>
      </div>
      {error && <p className="rounded-lg bg-red-50 p-4 text-sm text-red-600">{error}</p>}
    </div>
  );
  
  const step = steps[cur];
  
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="text-center">
        <h3 className="text-xl font-bold text-slate-800">{title}</h3>
        <p className="text-sm text-slate-400 mt-1">Step {cur + 1} of {steps.length}</p>
      </div>
      
      <div className="flex gap-1.5">
        {steps.map((_, i) => (
          <button 
            key={i} 
            onClick={() => setCur(i)} 
            className={`h-2 flex-1 rounded-full transition-all ${
              i <= cur ? "bg-brand-500" : "bg-slate-200"
            }`}
          />
        ))}
      </div>
      
      <AnimatePresence mode="wait">
        <motion.div 
          key={cur} 
          initial={{ opacity: 0, x: 50, scale: 0.95 }} 
          animate={{ opacity: 1, x: 0, scale: 1 }} 
          exit={{ opacity: 0, x: -50, scale: 0.95 }} 
          transition={{ duration: 0.4 }} 
          className="rounded-2xl bg-gradient-to-br from-white to-slate-50 border border-slate-200 p-8 shadow-lg min-h-[300px] flex flex-col items-center justify-center text-center"
        >
          <motion.div 
            initial={{ scale: 0 }} 
            animate={{ scale: 1 }} 
            transition={{ delay: 0.2, type: "spring" }} 
            className="text-6xl mb-6"
          >
            {step.icon}
          </motion.div>
          <motion.h4 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ delay: 0.3 }} 
            className="text-xl font-bold text-slate-800 mb-4"
          >
            {step.title}
          </motion.h4>
          <motion.p 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ delay: 0.4 }} 
            className="text-slate-600 leading-relaxed max-w-lg"
          >
            {step.content}
          </motion.p>
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            transition={{ delay: 0.6 }} 
            className="mt-6 rounded-lg bg-purple-50 border border-purple-100 px-4 py-2"
          >
            <p className="text-xs text-purple-600">🎨 {step.visual_description}</p>
          </motion.div>
        </motion.div>
      </AnimatePresence>
      
      <div className="flex items-center justify-center gap-4">
        <button 
          onClick={() => setCur(c => Math.max(0, c - 1))} 
          disabled={cur === 0} 
          className="rounded-xl border border-slate-200 p-3 hover:bg-slate-50 disabled:opacity-30"
        >
          <ChevronLeft className="h-5 w-5"/>
        </button>
        <button 
          onClick={autoPlay} 
          disabled={auto} 
          className="rounded-xl bg-brand-600 px-6 py-3 text-white font-semibold hover:bg-brand-700 disabled:opacity-50 flex items-center gap-2"
        >
          {auto ? (
            <>
              <RotateCcw className="h-4 w-4 animate-spin"/>
              Playing…
            </>
          ) : (
            <>
              <Play className="h-4 w-4"/>
              Auto Play
            </>
          )}
        </button>
        <button 
          onClick={() => setCur(c => Math.min(steps.length - 1, c + 1))} 
          disabled={cur === steps.length - 1} 
          className="rounded-xl border border-slate-200 p-3 hover:bg-slate-50 disabled:opacity-30"
        >
          <ChevronRight className="h-5 w-5"/>
        </button>
      </div>
    </div>
  );
}
