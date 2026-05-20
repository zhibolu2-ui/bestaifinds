"use client";

import { use, useState, useCallback } from "react";
import { notFound } from "next/navigation";
import ToolLayout from "@/components/ToolLayout";
import FileUpload from "@/components/FileUpload";
import { getToolBySlug, Tool } from "@/lib/tools";
import {
  mergePdfs,
  splitPdf,
  rotatePdf,
  deletePages,
  addWatermark,
  addPageNumbers,
  protectPdf,
  imagesToPdf,
  rearrangePages,
  compressPdf,
  pdfToImages,
  esignPdf,
  cropPdf,
} from "@/lib/pdf-tools";

export default function PdfToolPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const tool = getToolBySlug("pdf", slug);
  if (!tool) notFound();

  return <PdfToolContent tool={tool} />;
}

function PdfToolContent({ tool }: { tool: Tool }) {
  const [files, setFiles] = useState<File[]>([]);
  const [processing, setProcessing] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");
  const [comingSoon, setComingSoon] = useState(false);
  const [aiResult, setAiResult] = useState("");
  const [watermarkText, setWatermarkText] = useState("CONFIDENTIAL");
  const [password, setPassword] = useState("");
  const [rotateAngle, setRotateAngle] = useState(90);
  const [signatureData, setSignatureData] = useState("");
  const [cropMargin, setCropMargin] = useState(20);

  const handleFiles = useCallback((incoming: File[]) => {
    setFiles((prev) => [...prev, ...incoming]);
    setDone(false);
    setError("");
  }, []);

  const removeFile = useCallback((index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const process = async () => {
    setProcessing(true);
    setError("");
    try {
      switch (tool.slug) {
        case "merge":
          await mergePdfs(files);
          break;
        case "split":
          await splitPdf(files[0], [{ start: 0, end: 0 }]);
          break;
        case "rotate":
          await rotatePdf(files[0], rotateAngle);
          break;
        case "delete-pages":
          await deletePages(files[0], [0]);
          break;
        case "watermark":
          await addWatermark(files[0], watermarkText);
          break;
        case "page-numbers":
          await addPageNumbers(files[0]);
          break;
        case "protect":
          if (!password) { setError("Please enter a password"); setProcessing(false); return; }
          await protectPdf(files[0], password);
          break;
        case "from-images":
          await imagesToPdf(files);
          break;
        case "rearrange":
          await rearrangePages(files[0], files[0] ? Array.from({ length: 10 }, (_, i) => i) : []);
          break;
        case "translator":
        case "summarize": {
          const text = await files[0].text().catch(() => "");
          if (!text) { setError("Could not read PDF text. Please try a text-based PDF."); setProcessing(false); return; }
          const res = await fetch("/api/pdf/process", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ action: tool.slug === "translator" ? "translate" : "summarize", text }),
          });
          if (!res.ok) { setError("AI service unavailable"); setProcessing(false); return; }
          const data = await res.json();
          setAiResult(data.result || "No result");
          break;
        }
        case "compress":
          await compressPdf(files[0]);
          break;
        case "to-jpg":
          await pdfToImages(files[0], "image/jpeg");
          break;
        case "to-png":
          await pdfToImages(files[0], "image/png");
          break;
        case "esign":
          if (!signatureData) { setError("Please draw your signature first"); setProcessing(false); return; }
          await esignPdf(files[0], signatureData);
          break;
        case "crop":
          await cropPdf(files[0], cropMargin);
          break;
        case "to-word":
        case "word-to-pdf":
        case "edit":
        case "unlock":
          setComingSoon(true);
          setProcessing(false);
          return;
      }
      setDone(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Processing failed");
    } finally {
      setProcessing(false);
    }
  };

  const isImageInput = tool.slug === "from-images";
  const isMulti = tool.slug === "merge" || tool.slug === "from-images";

  return (
    <ToolLayout tool={tool}>
      {files.length === 0 ? (
        <div className="space-y-4">
          <FileUpload
            accept={isImageInput ? "image/jpeg,image/png" : ".pdf"}
            multiple={isMulti}
            label={isImageInput ? "Upload Images" : "Upload PDF"}
            onFiles={handleFiles}
          />
        </div>
      ) : (
        <div className="mx-auto max-w-2xl space-y-4">
          {/* File list */}
          <div className="space-y-2">
            {files.map((f, i) => (
              <div key={`${f.name}-${i}`} className="flex items-center justify-between p-3 rounded-xl bg-surface-alt border border-gray-100">
                <div className="flex items-center gap-3 min-w-0">
                  <span className="text-xl shrink-0">{isImageInput ? "🖼️" : "📄"}</span>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-800 truncate">{f.name}</p>
                    <p className="text-xs text-gray-400">{(f.size / 1024).toFixed(1)} KB</p>
                  </div>
                </div>
                <button onClick={() => removeFile(i)} className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                </button>
              </div>
            ))}
          </div>

          {isMulti && (
            <button
              onClick={() => { const input = document.createElement("input"); input.type = "file"; input.accept = isImageInput ? "image/jpeg,image/png" : ".pdf"; input.multiple = true; input.onchange = (e) => { const t = e.target as HTMLInputElement; if (t.files) handleFiles(Array.from(t.files)); }; input.click(); }}
              className="w-full py-2 rounded-xl border border-dashed border-primary-300 text-primary-500 text-sm font-medium hover:bg-primary-50 transition-colors"
            >
              + Add More Files
            </button>
          )}

          {/* Tool-specific options */}
          {tool.slug === "watermark" && (
            <input type="text" value={watermarkText} onChange={(e) => setWatermarkText(e.target.value)} placeholder="Watermark text" className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300" />
          )}
          {tool.slug === "protect" && (
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter password" className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300" />
          )}
          {tool.slug === "rotate" && (
            <div className="flex gap-2">
              {[90, 180, 270].map((a) => (
                <button key={a} onClick={() => setRotateAngle(a)} className={`flex-1 py-2 rounded-xl text-sm font-medium transition-colors ${rotateAngle === a ? "bg-primary-500 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>
                  {a}°
                </button>
              ))}
            </div>
          )}
          {tool.slug === "esign" && (
            <div className="space-y-2">
              <label className="text-xs text-gray-500 block">Draw your signature below</label>
              <canvas
                width={400}
                height={120}
                className="w-full border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 cursor-crosshair"
                onMouseDown={(e) => {
                  const canvas = e.currentTarget;
                  const ctx = canvas.getContext("2d")!;
                  ctx.strokeStyle = "#000";
                  ctx.lineWidth = 2;
                  ctx.lineCap = "round";
                  const rect = canvas.getBoundingClientRect();
                  const draw = (ev: MouseEvent) => {
                    ctx.lineTo(ev.clientX - rect.left, ev.clientY - rect.top);
                    ctx.stroke();
                  };
                  ctx.beginPath();
                  ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
                  const stop = () => {
                    document.removeEventListener("mousemove", draw);
                    document.removeEventListener("mouseup", stop);
                    setSignatureData(canvas.toDataURL("image/png"));
                  };
                  document.addEventListener("mousemove", draw);
                  document.addEventListener("mouseup", stop);
                }}
              />
              <button
                onClick={(e) => {
                  const canvas = (e.currentTarget.previousElementSibling!.previousElementSibling as HTMLCanvasElement);
                  const ctx = canvas.getContext("2d")!;
                  ctx.clearRect(0, 0, canvas.width, canvas.height);
                  setSignatureData("");
                }}
                className="text-xs text-red-500 hover:text-red-600"
              >Clear signature</button>
            </div>
          )}
          {tool.slug === "crop" && (
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Crop margin: {cropMargin}px from each edge</label>
              <input type="range" min="5" max="100" step="5" value={cropMargin} onChange={(e) => setCropMargin(Number(e.target.value))} className="w-full accent-primary-500" />
            </div>
          )}

          {error && <p className="text-sm text-red-500 text-center">{error}</p>}

          {comingSoon ? (
            <div className="text-center space-y-3 py-8">
              <div className="inline-flex w-14 h-14 rounded-full bg-amber-100 dark:bg-amber-900/30 items-center justify-center">
                <span className="text-2xl">🚧</span>
              </div>
              <p className="text-lg font-semibold text-gray-800 dark:text-white">Coming Soon</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">This tool is under development and will be available soon.</p>
              <button onClick={() => { setFiles([]); setComingSoon(false); }} className="text-sm text-indigo-500 hover:text-indigo-700 font-medium">
                Try another tool
              </button>
            </div>
          ) : aiResult ? (
            <div className="space-y-3">
              <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
                <pre className="text-sm text-gray-800 dark:text-gray-200 whitespace-pre-wrap leading-relaxed">{aiResult}</pre>
              </div>
              <div className="flex gap-2">
                <button onClick={() => navigator.clipboard.writeText(aiResult)} className="flex-1 py-2 rounded-xl border border-gray-200 dark:border-gray-700 text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800">
                  Copy Result
                </button>
                <button onClick={() => { setFiles([]); setAiResult(""); }} className="flex-1 py-2 rounded-xl bg-indigo-500 text-white text-sm font-medium hover:bg-indigo-600">
                  Process Another
                </button>
              </div>
            </div>
          ) : done ? (
            <div className="text-center space-y-3">
              <div className="inline-flex w-12 h-12 rounded-full bg-green-100 items-center justify-center">
                <svg className="w-6 h-6 text-green-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>
              </div>
              <p className="text-sm font-medium text-gray-800">Done! File downloaded.</p>
              <button onClick={() => { setFiles([]); setDone(false); }} className="text-sm text-primary-500 hover:text-primary-700 font-medium">
                Process another file
              </button>
            </div>
          ) : (
            <div className="flex gap-3">
              <button onClick={() => setFiles([])} className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">
                Clear
              </button>
              <button disabled={processing} onClick={process} className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-primary-500 to-primary-600 text-white text-sm font-medium shadow-md shadow-primary-200 hover:shadow-lg disabled:opacity-50 transition-all">
                {processing ? "Processing..." : tool.name}
              </button>
            </div>
          )}
        </div>
      )}
    </ToolLayout>
  );
}
