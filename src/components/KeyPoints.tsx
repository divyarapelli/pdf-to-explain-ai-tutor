"use client";

import type { KeyPoint } from "@/types";

const COLORS: Record<string, string> = {
  high: "bg-red-100 text-red-700 border-red-200",
  medium: "bg-amber-100 text-amber-700 border-amber-200",
  low: "bg-green-100 text-green-700 border-green-200"
};

export default function KeyPoints({ points }: { points: KeyPoint[] }) {
  if (!points.length) return null;
  
  return (
    <div className="rounded-xl bg-white border border-slate-200 p-6 shadow-sm">
      <h3 className="text-lg font-bold text-slate-800 mb-4">🔑 Key Points</h3>
      <div className="space-y-3">
        {points.map((pt, i) => (
          <div key={i} className="flex items-start gap-4 rounded-lg border border-slate-100 p-4 hover:bg-slate-50">
            <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-brand-100 text-brand-700 text-sm font-bold">
              {i + 1}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h4 className="font-semibold text-slate-800">{pt.title}</h4>
                <span className={`rounded-full px-2 py-0.5 text-xs font-medium border ${
                  COLORS[pt.importance] ?? COLORS.medium
                }`}>
                  {pt.importance}
                </span>
              </div>
              <p className="text-sm text-slate-600">{pt.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
