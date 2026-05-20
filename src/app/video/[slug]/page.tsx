"use client";

import { use, useState, useCallback } from "react";
import { notFound } from "next/navigation";
import ToolLayout from "@/components/ToolLayout";
import FileUpload from "@/components/FileUpload";
import { getToolBySlug, Tool } from "@/lib/tools";

export default function VideoToolPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const tool = getToolBySlug("video", slug);
  if (!tool) notFound();

  if (tool.slug === "youtube-to-text") return <YoutubeToTextContent tool={tool} />;
  return <VideoToolContent tool={tool} />;
}

function VideoToolContent({ tool }: { tool: Tool }) {
  const [files, setFiles] = useState<File[]>([]);
  const [processing, setProcessing] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");
  const [progress, setProgress] = useState(0);

  const handleFiles = useCallback((incoming: File[]) => {
    setFiles(incoming);
    setDone(false);
    setError("");
  }, []);

  const process = async () => {
    if (!files[0]) return;
    setProcessing(true);
    setError("");
    setProgress(10);

    const formData = new FormData();
    formData.append("file", files[0]);
    formData.append("action", tool.slug);

    const progressInterval = setInterval(() => {
      setProgress((p) => Math.min(p + 5, 90));
    }, 1000);

    try {
      const res = await fetch("/api/video/process", {
        method: "POST",
        body: formData,
      });

      clearInterval(progressInterval);

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Processing failed");
        setProcessing(false);
        return;
      }

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      const disposition = res.headers.get("Content-Disposition") || "";
      const filenameMatch = disposition.match(/filename="(.+)"/);
      a.href = url;
      a.download = filenameMatch?.[1] || `processed_${files[0].name}`;
      a.click();
      URL.revokeObjectURL(url);

      setProgress(100);
      setDone(true);
    } catch {
      clearInterval(progressInterval);
      setError("Network error. Please try again.");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <ToolLayout tool={tool}>
      {files.length === 0 ? (
        <FileUpload accept="video/*" maxSizeMB={500} label="Upload Video" onFiles={handleFiles} />
      ) : (
        <div className="mx-auto max-w-2xl space-y-4">
          <div className="flex items-center justify-between p-3 rounded-xl bg-surface-alt border border-gray-100">
            <div className="flex items-center gap-3 min-w-0">
              <span className="text-xl shrink-0">🎬</span>
              <div className="min-w-0">
                <p className="text-sm font-medium text-gray-800 truncate">{files[0].name}</p>
                <p className="text-xs text-gray-400">{(files[0].size / (1024 * 1024)).toFixed(1)} MB</p>
              </div>
            </div>
            <button onClick={() => { setFiles([]); setDone(false); setProgress(0); }} className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
            </button>
          </div>

          {processing && (
            <div className="space-y-2">
              <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-primary-500 to-primary-600 rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
              </div>
              <p className="text-xs text-gray-400 text-center">Processing... {progress}%</p>
            </div>
          )}

          {error && <p className="text-sm text-red-500 text-center">{error}</p>}

          {done ? (
            <div className="text-center space-y-3">
              <div className="inline-flex w-12 h-12 rounded-full bg-green-100 items-center justify-center">
                <svg className="w-6 h-6 text-green-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>
              </div>
              <p className="text-sm font-medium text-gray-800">Done! File downloaded.</p>
              <button onClick={() => { setFiles([]); setDone(false); setProgress(0); }} className="text-sm text-primary-500 font-medium">Process another</button>
            </div>
          ) : (
            <button disabled={processing} onClick={process} className="w-full py-2.5 rounded-xl bg-gradient-to-r from-primary-500 to-primary-600 text-white text-sm font-medium shadow-md disabled:opacity-50 transition-all">
              {processing ? "Processing..." : tool.name}
            </button>
          )}
        </div>
      )}
    </ToolLayout>
  );
}

function YoutubeToTextContent({ tool }: { tool: Tool }) {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");
  const [error, setError] = useState("");

  const transcribe = async () => {
    setLoading(true);
    setError("");
    setResult("");
    try {
      const res = await fetch("/api/ai/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tool: "youtube-to-text",
          input: `Please note that direct YouTube transcription requires yt-dlp and Whisper API which are not yet integrated. The user provided this URL: ${url}. Inform them that this feature will be available soon.`,
        }),
      });
      const data = await res.json();
      setResult(data.result || "Feature coming soon.");
    } catch {
      setError("Network error.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ToolLayout tool={tool}>
      <div className="mx-auto max-w-2xl space-y-4">
        <input type="url" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="Paste YouTube URL here..." className="w-full rounded-2xl border border-gray-200 p-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300" />
        <button disabled={loading || !url.trim()} onClick={transcribe} className="w-full py-2.5 rounded-xl bg-gradient-to-r from-primary-500 to-primary-600 text-white text-sm font-medium shadow-md disabled:opacity-50 transition-all">
          {loading ? "Processing..." : "Get Transcript"}
        </button>
        {error && <p className="text-sm text-red-500 text-center">{error}</p>}
        {result && (
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-gray-700">Transcript</label>
              <button onClick={() => navigator.clipboard.writeText(result)} className="text-xs text-primary-500 font-medium">Copy</button>
            </div>
            <div className="rounded-2xl border border-gray-200 bg-surface-alt p-5 text-sm text-gray-700 whitespace-pre-wrap">{result}</div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
