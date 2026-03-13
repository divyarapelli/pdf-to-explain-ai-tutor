import { useState } from "react";
import { generateExplanation } from "@/lib/api";
import type { ExplainResponse } from "@/types";
import LoadingSpinner from "./LoadingSpinner";
import KeyPoints from "./KeyPoints";
import DifficultyHighlighter from "./DifficultyHighlighter";
import { BookOpen, Sparkles } from "lucide-react";

export default function ExplanationView({ documentId }: { documentId: string }) {
  const [data, setData] = useState<ExplainResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [level, setLevel] = useState("medium");
  const [audience, setAudience] = useState("high school student");
  
  const generate = async () => { 
    setLoading(true); 
    setError(null); 
    try { 
      setData(await generateExplanation(documentId, level, audience)); 
    } catch(e: unknown) { 
      setError(e instanceof Error ? e.message : "Failed"); 
    } finally { 
      setLoading(false); 
    } 
  };
  
  if (loading) return <LoadingSpinner message="🧠 AI is reading your document…" />;
  
  if (!data) return (
    <div className="space-y-6">
      <div className="rounded-xl bg-white border border-slate-200 p-6 shadow-sm">
        <h3 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-brand-500"/>
          Customise Explanation
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-2">Detail Level</label>
            <select 
              value={level} 
              onChange={e => setLevel(e.target.value)} 
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
            >
              <option value="simple">Simple</option>
              <option value="medium">Medium</option>
              <option value="detailed">Detailed</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-2">Audience</label>
            <select 
              value={audience} 
              onChange={e => setAudience(e.target.value)} 
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
            >
              <option value="middle school student">Middle School</option>
              <option value="high school student">High School</option>
              <option value="college freshman">College</option>
              <option value="graduate student">Graduate</option>
              <option value="complete beginner">Beginner</option>
            </select>
          </div>
        </div>
        <button 
          onClick={generate} 
          className="mt-6 w-full rounded-xl bg-brand-600 px-6 py-3 text-white font-semibold hover:bg-brand-700 shadow-lg shadow-brand-600/20"
        >
          <span className="flex items-center justify-center gap-2">
            <BookOpen className="h-5 w-5"/>
            Generate Explanation
          </span>
        </button>
      </div>
      {error && <p className="rounded-lg bg-red-50 p-4 text-sm text-red-600">{error}</p>}
    </div>
  );
  
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="rounded-xl bg-gradient-to-br from-brand-50 to-blue-50 border border-brand-100 p-6">
        <h3 className="text-lg font-bold text-brand-800 mb-3">📋 Summary</h3>
        <p className="text-slate-700 leading-relaxed whitespace-pre-line">{data.summary}</p>
      </div>
      
      <div className="rounded-xl bg-white border border-slate-200 p-6 shadow-sm">
        <h3 className="text-lg font-bold text-slate-800 mb-3">💡 Simple Explanation</h3>
        <p className="text-slate-600 leading-relaxed whitespace-pre-line">{data.simple_explanation}</p>
      </div>
      
      <KeyPoints points={data.key_points}/>
      
      {data.examples.length > 0 && (
        <div className="rounded-xl bg-white border border-slate-200 p-6 shadow-sm">
          <h3 className="text-lg font-bold text-slate-800 mb-4">🎯 Examples</h3>
          <div className="space-y-3">
            {data.examples.map((ex, i) => (
              <div key={i} className="flex gap-3 rounded-lg bg-amber-50 border border-amber-100 p-4">
                <span className="text-lg">💡</span>
                <p className="text-sm text-slate-700">{ex}</p>
              </div>
            ))}
          </div>
        </div>
      )}
      
      <DifficultyHighlighter concepts={data.difficult_concepts}/>
      
      <button 
        onClick={generate} 
        className="text-sm text-brand-600 hover:text-brand-700 font-medium"
      >
        🔄 Regenerate
      </button>
    </div>
  );
}
