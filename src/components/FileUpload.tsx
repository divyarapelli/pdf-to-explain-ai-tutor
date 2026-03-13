import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, FileText, CheckCircle, AlertCircle } from "lucide-react";
import { uploadPDF } from "@/lib/api-direct";
import type { UploadResponse } from "@/types";
import LoadingSpinner from "./LoadingSpinner";

interface Props { 
  onUploadComplete: (data: UploadResponse) => void; 
}

export default function FileUpload({ onUploadComplete }: Props) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<UploadResponse | null>(null);

  const onDrop = useCallback(async (accepted: File[]) => {
    const file = accepted[0]; 
    if (!file) return;
    
    console.log("File dropped:", file.name, "Size:", file.size);
    
    if (!file.name.toLowerCase().endsWith(".pdf")) { 
      setError("Please upload a PDF file."); 
      return; 
    }
    
    if (file.size > 50 * 1024 * 1024) { 
      setError("File exceeds 50 MB limit."); 
      return; 
    }
    
    setError(null); 
    setUploading(true);
    
    try { 
      const data = await uploadPDF(file); 
      console.log("Upload successful:", data);
      setResult(data); 
      onUploadComplete(data); 
    }
    catch (e: unknown) { 
      console.error("Upload error:", e);
      const errorMessage = e instanceof Error ? e.message : "Failed to upload file. Please try again.";
      setError(errorMessage); 
    }
    finally { 
      setUploading(false); 
    }
  }, [onUploadComplete]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
    onDrop, 
    accept: { "application/pdf": [".pdf"] }, 
    maxFiles: 1, 
    disabled: uploading 
  });

  if (result) return (
    <div className="rounded-2xl border-2 border-emerald-200 bg-emerald-50 p-8">
      <div className="flex items-center gap-3 mb-4">
        <CheckCircle className="h-8 w-8 text-emerald-600" />
        <div>
          <h3 className="text-lg font-semibold text-emerald-800">PDF Uploaded!</h3>
          <p className="text-sm text-emerald-600">{result.filename}</p>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-4 mt-4">
        {[
          {v: result.page_count, l: "Pages"}, 
          {v: result.total_chunks, l: "Chunks"}, 
          {v: "✓", l: "Indexed"}
        ].map(c => (
          <div key={c.l} className="rounded-xl bg-white p-4 text-center shadow-sm">
            <p className="text-2xl font-bold text-brand-600">{c.v}</p>
            <p className="text-xs text-slate-500 mt-1">{c.l}</p>
          </div>
        ))}
      </div>
      <div className="mt-4 rounded-lg bg-white p-4 shadow-sm">
        <p className="text-xs font-medium text-slate-400 mb-2">PREVIEW</p>
        <p className="text-sm text-slate-600 line-clamp-4">{result.preview_text}</p>
      </div>
      <button 
        onClick={() => {setResult(null); setError(null);}} 
        className="mt-4 text-sm text-brand-600 hover:text-brand-700 font-medium"
      >
        Upload a different PDF →
      </button>
    </div>
  );

  if (uploading) return (
    <div className="rounded-2xl border-2 border-brand-200 bg-brand-50 p-12">
      <LoadingSpinner message="Uploading & processing…" size="lg" />
    </div>
  );

  return (
    <div>
      <div 
        {...getRootProps()} 
        className={`cursor-pointer rounded-2xl border-2 border-dashed p-12 text-center transition-all ${
          isDragActive 
            ? "border-brand-500 bg-brand-50" 
            : "border-slate-300 bg-white hover:border-brand-400 hover:bg-slate-50"
        }`}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center gap-4">
          <div className={`rounded-2xl p-4 ${
            isDragActive ? "bg-brand-100" : "bg-slate-100"
          }`}>
            {isDragActive ? 
              <FileText className="h-12 w-12 text-brand-600"/> : 
              <Upload className="h-12 w-12 text-slate-400"/>
            }
          </div>
          <div>
            <p className="text-lg font-semibold text-slate-700">
              {isDragActive ? "Drop your PDF here" : "Upload your PDF"}
            </p>
            <p className="text-sm text-slate-400 mt-1">
              Drag & drop or click · Max 50 MB
            </p>
          </div>
        </div>
      </div>
      {error && (
        <div className="mt-4 flex items-start gap-2 rounded-lg bg-red-50 p-4 text-sm text-red-600">
          <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5"/>
          <div>
            <p className="font-semibold mb-2">Upload Failed</p>
            <p className="text-xs opacity-80">{error}</p>
            <p className="text-xs mt-2 font-medium">Troubleshooting:</p>
            <ul className="text-xs space-y-1 list-disc list-inside">
              <li>Check if backend is running on port 8000</li>
              <li>Verify file is a valid PDF (under 50MB)</li>
              <li>Try refreshing the page</li>
              <li>Check browser console for errors</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
