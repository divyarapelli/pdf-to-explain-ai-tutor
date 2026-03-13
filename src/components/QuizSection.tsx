import { useState } from "react";
import { generateQuiz } from "@/lib/api";
import type { QuizQuestion } from "@/types";
import LoadingSpinner from "./LoadingSpinner";
import { HelpCircle, CheckCircle, XCircle, Trophy } from "lucide-react";

export default function QuizSection({ documentId }: { documentId: string }) {
  const [questions, setQuestions] = useState<QuizQuestion[]>([]); 
  const [loading, setLoading] = useState(false); 
  const [error, setError] = useState<string | null>(null); 
  const [answers, setAnswers] = useState<Record<number, number>>({}); 
  const [submitted, setSubmitted] = useState(false); 
  const [difficulty, setDifficulty] = useState("medium"); 
  const [count, setCount] = useState(5);
  
  const generate = async () => { 
    setLoading(true); 
    setError(null); 
    setAnswers({}); 
    setSubmitted(false); 
    try {
      setQuestions((await generateQuiz(documentId, count, difficulty)).questions); 
    } catch(e: unknown) { 
      setError(e instanceof Error ? e.message : "Failed"); 
    } finally { 
      setLoading(false); 
    } 
  };
  
  const pick = (qi: number, oi: number) => { 
    if (submitted) return; 
    setAnswers(p => ({ ...p, [qi]: oi })); 
  };
  
  const score = questions.reduce((s, q, i) => s + (answers[i] === q.correct_answer ? 1 : 0), 0);
  
  if (loading) return <LoadingSpinner message="📝 Generating quiz…" />;
  
  if (!questions.length) return (
    <div className="space-y-6">
      <div className="rounded-xl bg-white border border-slate-200 p-6 shadow-sm">
        <h3 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
          <HelpCircle className="h-5 w-5 text-brand-500"/>
          Generate Quiz
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-2">Questions</label>
            <select 
              value={count} 
              onChange={e => setCount(+e.target.value)} 
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
            >
              {[3, 5, 10].map(n => (
                <option key={n} value={n}>{n}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-2">Difficulty</label>
            <select 
              value={difficulty} 
              onChange={e => setDifficulty(e.target.value)} 
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
            >
              {["easy", "medium", "hard"].map(d => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>
        </div>
        <button 
          onClick={generate} 
          className="mt-6 w-full rounded-xl bg-brand-600 px-6 py-3 text-white font-semibold hover:bg-brand-700 shadow-lg shadow-brand-600/20"
        >
          Generate Quiz
        </button>
      </div>
      {error && <p className="rounded-lg bg-red-50 p-4 text-sm text-red-600">{error}</p>}
    </div>
  );
  
  return (
    <div className="space-y-6 animate-fade-in">
      {submitted && (
        <div className={`rounded-xl p-6 text-center ${
          score / questions.length >= 0.7 ? 
            "bg-emerald-50 border border-emerald-200" : 
            "bg-amber-50 border border-amber-200"
        }`}>
          <Trophy className={`h-12 w-12 mx-auto mb-2 ${
            score / questions.length >= 0.7 ? "text-emerald-500" : "text-amber-500"
          }`}/>
          <h3 className="text-2xl font-bold text-slate-800">{score}/{questions.length}</h3>
        </div>
      )}
      
      {questions.map((q, qi) => (
        <div key={qi} className="rounded-xl bg-white border border-slate-200 p-6 shadow-sm">
          <p className="font-semibold text-slate-800 mb-4">
            <span className="text-brand-600">Q{qi + 1}.</span> {q.question}
          </p>
          <div className="space-y-2">
            {q.options.map((opt, oi) => {
              const sel = answers[qi] === oi;
              const correct = q.correct_answer === oi;
              let cls = "rounded-lg border p-3 text-sm w-full text-left flex items-center gap-3 ";
              
              if (submitted) {
                cls += correct ? 
                  "border-emerald-300 bg-emerald-50 text-emerald-800" : 
                  sel ? "border-red-300 bg-red-50 text-red-800" : 
                  "border-slate-200 text-slate-500";
              } else {
                cls += sel ? 
                  "border-brand-400 bg-brand-50 text-brand-800" : 
                  "border-slate-200 hover:border-brand-300 hover:bg-slate-50 cursor-pointer";
              }
              
              return (
                <button 
                  key={oi} 
                  onClick={() => pick(qi, oi)} 
                  className={cls}
                >
                  {submitted ? (
                    correct ? 
                      <CheckCircle className="h-5 w-5 text-emerald-500 flex-shrink-0"/> : 
                      sel ? <XCircle className="h-5 w-5 text-red-500 flex-shrink-0"/> : 
                      <span className="h-5 w-5 rounded-full border-2 border-slate-300 inline-block flex-shrink-0"/>
                  ) : (
                    <span className={`h-5 w-5 rounded-full border-2 inline-block flex-shrink-0 ${
                      sel ? "border-brand-500 bg-brand-500" : "border-slate-300"
                    }`}/>
                  )}
                  {opt}
                </button>
              );
            })}
          </div>
          {submitted && (
            <div className="mt-4 rounded-lg bg-blue-50 border border-blue-100 p-3">
              <p className="text-sm text-blue-800">
                <strong>Explanation:</strong> {q.explanation}
              </p>
            </div>
          )}
        </div>
      ))}
      
      <div className="flex gap-4">
        {!submitted ? (
          <button 
            onClick={() => setSubmitted(true)} 
            disabled={Object.keys(answers).length < questions.length} 
            className="flex-1 rounded-xl bg-brand-600 px-6 py-3 text-white font-semibold disabled:opacity-50"
          >
            Submit ({Object.keys(answers).length}/{questions.length})
          </button>
        ) : (
          <button 
            onClick={generate} 
            className="flex-1 rounded-xl bg-brand-600 px-6 py-3 text-white font-semibold"
          >
            🔄 New Quiz
          </button>
        )}
      </div>
    </div>
  );
}
