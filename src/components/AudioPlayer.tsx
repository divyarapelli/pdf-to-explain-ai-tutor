import { useState, useRef } from "react";
import { generateAudio, getAudioUrl } from "@/lib/api";
import type { AudioResponse } from "@/types";
import LoadingSpinner from "./LoadingSpinner";
import { Volume2, Play, Pause, RotateCcw } from "lucide-react";

export default function AudioPlayer({ documentId }: { documentId: string }) {
  const [audio, setAudio] = useState<AudioResponse | null>(null); 
  const [loading, setLoading] = useState(false); 
  const [error, setError] = useState<string | null>(null); 
  const [playing, setPlaying] = useState(false); 
  const [voice, setVoice] = useState("alloy"); 
  const [speed, setSpeed] = useState(1.0); 
  const ref = useRef<HTMLAudioElement>(null);
  
  const generate = async () => { 
    setLoading(true); 
    setError(null); 
    try {
      setAudio(await generateAudio(documentId, voice, speed)); 
    } catch(e: unknown) { 
      setError(e instanceof Error ? e.message : "Failed"); 
    } finally { 
      setLoading(false); 
    } 
  };
  
  const toggle = () => { 
    if (!ref.current) return; 
    playing ? ref.current.pause() : ref.current.play(); 
    setPlaying(!playing); 
  };
  
  const restart = () => { 
    if (!ref.current) return; 
    ref.current.currentTime = 0; 
    ref.current.play(); 
    setPlaying(true); 
  };
  
  if (loading) return <LoadingSpinner message="🔊 Generating audio…" />;
  
  if (!audio) return (
    <div className="space-y-6">
      <div className="rounded-xl bg-white border border-slate-200 p-6 shadow-sm">
        <h3 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
          <Volume2 className="h-5 w-5 text-brand-500"/>
          Audio Narration
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-2">Voice</label>
            <select 
              value={voice} 
              onChange={e => setVoice(e.target.value)} 
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
            >
              {["alloy", "echo", "fable", "onyx", "nova", "shimmer"].map(v => (
                <option key={v} value={v}>{v}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-2">
              Speed: {speed}×
            </label>
            <input 
              type="range" 
              min={0.5} 
              max={2} 
              step={0.1} 
              value={speed} 
              onChange={e => setSpeed(+e.target.value)} 
              className="w-full accent-brand-600"
            />
          </div>
        </div>
        <button 
          onClick={generate} 
          className="mt-6 w-full rounded-xl bg-brand-600 px-6 py-3 text-white font-semibold hover:bg-brand-700 shadow-lg shadow-brand-600/20"
        >
          Generate Audio
        </button>
      </div>
      {error && <p className="rounded-lg bg-red-50 p-4 text-sm text-red-600">{error}</p>}
    </div>
  );
  
  return (
    <div className="animate-fade-in">
      <div className="rounded-2xl bg-gradient-to-br from-brand-600 to-purple-700 p-8 text-white shadow-xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-bold">🎧 Audio</h3>
            <p className="text-sm text-white/60">~{audio.duration_estimate} min</p>
          </div>
          <span className="rounded-full bg-white/20 px-3 py-1 text-xs">
            {voice}·{speed}×
          </span>
        </div>
        <audio 
          ref={ref} 
          src={getAudioUrl(audio.audio_url)} 
          onEnded={() => setPlaying(false)} 
          onPause={() => setPlaying(false)} 
          onPlay={() => setPlaying(true)}
        />
        <div className="flex items-center justify-center gap-6">
          <button 
            onClick={restart} 
            className="rounded-full bg-white/20 p-3 hover:bg-white/30"
          >
            <RotateCcw className="h-5 w-5"/>
          </button>
          <button 
            onClick={toggle} 
            className="rounded-full bg-white p-5 text-brand-700 hover:scale-105 shadow-lg"
          >
            {playing ? 
              <Pause className="h-8 w-8"/> : 
              <Play className="h-8 w-8 ml-1"/>
            }
          </button>
          <button 
            onClick={generate} 
            className="rounded-full bg-white/20 p-3 hover:bg-white/30 text-xs"
          >
            🔄
          </button>
        </div>
        <audio 
          controls 
          src={getAudioUrl(audio.audio_url)} 
          className="w-full h-10 opacity-60 mt-6"
        />
      </div>
    </div>
  );
}
