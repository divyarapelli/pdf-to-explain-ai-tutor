"use client";

const SIZES: Record<string, string> = {
  sm: "h-6 w-6 border-2",
  md: "h-10 w-10 border-[3px]",
  lg: "h-16 w-16 border-4"
};

export default function LoadingSpinner({ 
  message = "Processing…", 
  size = "md" 
}: { 
  message?: string; 
  size?: "sm" | "md" | "lg"; 
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-12">
      <div className={`${SIZES[size]} animate-spin rounded-full border-brand-200 border-t-brand-600`} />
      <p className="text-sm text-slate-500 animate-pulse">{message}</p>
    </div>
  );
}
