import { useEffect, useRef, useState, useCallback } from "react";
import { generateDiagrams } from "@/lib/api";
import type { DiagramData } from "@/types";
import LoadingSpinner from "./LoadingSpinner";
import { GitBranch } from "lucide-react";

function MermaidDiagram({ diagram, index }: { diagram: DiagramData; index: number }) {
  const ref = useRef<HTMLDivElement>(null); 
  const [bad, setBad] = useState(false);
  
  const render = useCallback(async () => { 
    if (!ref.current) return; 
    try { 
      const mermaid = (await import("mermaid")).default; 
      mermaid.initialize({
        startOnLoad: false, 
        theme: "default", 
        securityLevel: "loose"
      }); 
      const { svg } = await mermaid.render(`mmd-${index}-${Date.now()}`, diagram.mermaid_code); 
      ref.current.innerHTML = svg; 
      setBad(false); 
    } catch { 
      setBad(true); 
    } 
  }, [diagram.mermaid_code, index]);
  
  useEffect(() => { render(); }, [render]);
  
  return (
    <div className="rounded-xl bg-white border border-slate-200 p-6 shadow-sm">
      <h4 className="font-semibold text-slate-800 mb-2">{diagram.title}</h4>
      <p className="text-sm text-slate-500 mb-4">{diagram.description}</p>
      <div className="rounded-lg bg-slate-50 p-4 overflow-auto mermaid-container">
        {bad ? (
          <>
            <p className="text-sm text-amber-600">⚠️ Render failed:</p>
            <pre className="text-xs bg-slate-100 p-3 rounded mt-2">{diagram.mermaid_code}</pre>
          </>
        ) : (
          <div ref={ref}/>
        )}
      </div>
      <span className="inline-block mt-3 rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-500">
        {diagram.diagram_type}
      </span>
    </div>
  );
}

export default function DiagramView({ documentId }: { documentId: string }) {
  const [diagrams, setDiagrams] = useState<DiagramData[]>([]); 
  const [loading, setLoading] = useState(false); 
  const [error, setError] = useState<string | null>(null); 
  const [type, setType] = useState("auto");
  
  const generate = async () => { 
    setLoading(true); 
    setError(null); 
    try {
      setDiagrams((await generateDiagrams(documentId, type)).diagrams); 
    } catch(e: unknown) { 
      setError(e instanceof Error ? e.message : "Failed"); 
    } finally { 
      setLoading(false); 
    } 
  };
  
  if (loading) return <LoadingSpinner message="🎨 Generating diagrams…" />;
  
  if (!diagrams.length) return (
    <div className="space-y-6">
      <div className="rounded-xl bg-white border border-slate-200 p-6 shadow-sm">
        <h3 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
          <GitBranch className="h-5 w-5 text-brand-500"/>
          Generate Diagrams
        </h3>
        <select 
          value={type} 
          onChange={e => setType(e.target.value)} 
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm mb-6 focus:outline-none focus:ring-2 focus:ring-brand-500"
        >
          <option value="auto">Auto</option>
          <option value="flowchart">Flowchart</option>
          <option value="mindmap">Mind Map</option>
          <option value="sequence">Sequence</option>
          <option value="timeline">Timeline</option>
        </select>
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
  
  return (
    <div className="space-y-6 animate-fade-in">
      {diagrams.map((d, i) => <MermaidDiagram key={i} diagram={d} index={i}/>)}
      <button 
        onClick={generate} 
        className="text-sm text-brand-600 hover:text-brand-700 font-medium"
      >
        🔄 Regenerate
      </button>
    </div>
  );
}
