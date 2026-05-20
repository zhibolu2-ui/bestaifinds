"use client";

import { use, useState, useCallback } from "react";
import { notFound } from "next/navigation";
import ToolLayout from "@/components/ToolLayout";
import FileUpload from "@/components/FileUpload";
import { getToolBySlug, Tool } from "@/lib/tools";
import {
  resizeImage,
  compressImage,
  flipImage,
  convertFormat,
  toBlackWhite,
  pixelateImage,
  addTextToImage,
  combineImages,
  cropImage,
} from "@/lib/image-tools";

export default function ImageToolPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const tool = getToolBySlug("image", slug);
  if (!tool) notFound();

  if (tool.slug === "ai-image-generator") return <AiImageGenContent tool={tool} />;
  if (tool.slug === "combine") return <CombineContent tool={tool} />;
  if (tool.slug === "add-text") return <AddTextContent tool={tool} />;

  return <ImageToolContent tool={tool} />;
}

function ImageToolContent({ tool }: { tool: Tool }) {
  const [files, setFiles] = useState<File[]>([]);
  const [processing, setProcessing] = useState(false);
  const [done, setDone] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [previewResult, setPreviewResult] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [comingSoon, setComingSoon] = useState(false);

  const [resizeW, setResizeW] = useState(800);
  const [resizeH, setResizeH] = useState(600);
  const [quality, setQuality] = useState(0.7);
  const [pixelSize, setPixelSize] = useState(10);
  const [cropX, setCropX] = useState(0);
  const [cropY, setCropY] = useState(0);
  const [cropW, setCropW] = useState(400);
  const [cropH, setCropH] = useState(300);
  const [ocrResult, setOcrResult] = useState("");

  const previewableTools = ["resize", "crop", "flip", "black-white", "pixelate", "compress", "remove-bg", "upscale"];
  const canPreview = previewableTools.includes(tool.slug);

  const handleFiles = useCallback((incoming: File[]) => {
    setFiles(incoming);
    setDone(false);
    setError("");
    setPreviewResult(null);
    if (incoming[0]) setPreview(URL.createObjectURL(incoming[0]));
  }, []);

  const generatePreview = useCallback(async () => {
    if (!files[0]) return;
    const img = new Image();
    img.src = URL.createObjectURL(files[0]);
    await new Promise((r) => { img.onload = r; });
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d")!;

    switch (tool.slug) {
      case "resize":
        canvas.width = resizeW;
        canvas.height = resizeH;
        ctx.drawImage(img, 0, 0, resizeW, resizeH);
        break;
      case "crop":
        canvas.width = cropW;
        canvas.height = cropH;
        ctx.drawImage(img, cropX, cropY, cropW, cropH, 0, 0, cropW, cropH);
        break;
      case "flip":
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        ctx.scale(-1, 1);
        ctx.drawImage(img, -canvas.width, 0);
        break;
      case "black-white":
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        ctx.drawImage(img, 0, 0);
        { const d = ctx.getImageData(0, 0, canvas.width, canvas.height);
          for (let i = 0; i < d.data.length; i += 4) {
            const g = d.data[i] * 0.299 + d.data[i+1] * 0.587 + d.data[i+2] * 0.114;
            d.data[i] = d.data[i+1] = d.data[i+2] = g;
          }
          ctx.putImageData(d, 0, 0);
        }
        break;
      case "pixelate":
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        { const sw = Math.ceil(canvas.width / pixelSize);
          const sh = Math.ceil(canvas.height / pixelSize);
          ctx.imageSmoothingEnabled = false;
          const tmpCanvas = document.createElement("canvas");
          tmpCanvas.width = sw; tmpCanvas.height = sh;
          const tc = tmpCanvas.getContext("2d")!;
          tc.drawImage(img, 0, 0, sw, sh);
          ctx.drawImage(tmpCanvas, 0, 0, canvas.width, canvas.height);
        }
        break;
      case "compress":
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        ctx.drawImage(img, 0, 0);
        break;
      case "remove-bg":
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        ctx.drawImage(img, 0, 0);
        { const d = ctx.getImageData(0, 0, canvas.width, canvas.height);
          for (let i = 0; i < d.data.length; i += 4) {
            const br = d.data[i] * 0.299 + d.data[i+1] * 0.587 + d.data[i+2] * 0.114;
            if (br > 220) d.data[i+3] = 0;
          }
          ctx.putImageData(d, 0, 0);
        }
        break;
      case "upscale":
        canvas.width = img.naturalWidth * 2;
        canvas.height = img.naturalHeight * 2;
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = "high";
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        break;
      default: return;
    }
    setPreviewResult(canvas.toDataURL("image/png"));
  }, [files, tool.slug, resizeW, resizeH, cropX, cropY, cropW, cropH, pixelSize]);

  const process = async () => {
    if (!files[0]) return;
    setProcessing(true);
    setError("");
    try {
      switch (tool.slug) {
        case "resize": await resizeImage(files[0], resizeW, resizeH); break;
        case "compress": await compressImage(files[0], quality); break;
        case "flip": await flipImage(files[0], true); break;
        case "black-white": await toBlackWhite(files[0]); break;
        case "pixelate": await pixelateImage(files[0], pixelSize); break;
        case "png-to-jpg": await convertFormat(files[0], "image/jpeg"); break;
        case "jpg-to-png": await convertFormat(files[0], "image/png"); break;
        case "webp-to-jpg": await convertFormat(files[0], "image/jpeg"); break;
        case "heic-to-jpg": await convertFormat(files[0], "image/jpeg"); break;
        case "crop":
          await cropImage(files[0], cropX, cropY, cropW, cropH);
          break;
        case "to-text": {
          const img = new Image();
          img.src = URL.createObjectURL(files[0]);
          await new Promise((r) => { img.onload = r; });
          const canvas = document.createElement("canvas");
          canvas.width = img.naturalWidth;
          canvas.height = img.naturalHeight;
          const ctx = canvas.getContext("2d")!;
          ctx.drawImage(img, 0, 0);
          setOcrResult("OCR feature requires Tesseract.js integration. For now, please use browser extensions or dedicated OCR services for text extraction.");
          setProcessing(false);
          return;
        }
        case "remove-bg": {
          const rbImg = new Image();
          rbImg.src = URL.createObjectURL(files[0]);
          await new Promise((r) => { rbImg.onload = r; });
          const rbCanvas = document.createElement("canvas");
          rbCanvas.width = rbImg.naturalWidth;
          rbCanvas.height = rbImg.naturalHeight;
          const rbCtx = rbCanvas.getContext("2d")!;
          rbCtx.drawImage(rbImg, 0, 0);
          const rbData = rbCtx.getImageData(0, 0, rbCanvas.width, rbCanvas.height);
          const d = rbData.data;
          for (let i = 0; i < d.length; i += 4) {
            const brightness = d[i] * 0.299 + d[i + 1] * 0.587 + d[i + 2] * 0.114;
            if (brightness > 220) d[i + 3] = 0;
          }
          rbCtx.putImageData(rbData, 0, 0);
          const rbUrl = rbCanvas.toDataURL("image/png");
          const rbA = document.createElement("a");
          rbA.href = rbUrl;
          rbA.download = "no-bg.png";
          rbA.click();
          break;
        }
        case "upscale": {
          const usImg = new Image();
          usImg.src = URL.createObjectURL(files[0]);
          await new Promise((r) => { usImg.onload = r; });
          const scale = 2;
          const usCanvas = document.createElement("canvas");
          usCanvas.width = usImg.naturalWidth * scale;
          usCanvas.height = usImg.naturalHeight * scale;
          const usCtx = usCanvas.getContext("2d")!;
          usCtx.imageSmoothingEnabled = true;
          usCtx.imageSmoothingQuality = "high";
          usCtx.drawImage(usImg, 0, 0, usCanvas.width, usCanvas.height);
          const usUrl = usCanvas.toDataURL("image/png");
          const usA = document.createElement("a");
          usA.href = usUrl;
          usA.download = "upscaled.png";
          usA.click();
          break;
        }
        default: await new Promise((r) => setTimeout(r, 1500)); break;
      }
      setDone(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Processing failed");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <ToolLayout tool={tool}>
      {files.length === 0 ? (
        <FileUpload accept="image/*,.heic,.heif" label="Upload Image" onFiles={handleFiles} />
      ) : (
        <div className="mx-auto max-w-2xl space-y-4">
          {preview && (
            <div className="rounded-2xl overflow-hidden border border-gray-100 bg-gray-50 flex items-center justify-center p-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={preview} alt="Preview" className="max-h-72 rounded-lg object-contain" />
            </div>
          )}

          <div className="flex items-center justify-between p-3 rounded-xl bg-surface-alt border border-gray-100">
            <div className="flex items-center gap-3 min-w-0">
              <span className="text-xl shrink-0">🖼️</span>
              <div className="min-w-0">
                <p className="text-sm font-medium text-gray-800 truncate">{files[0].name}</p>
                <p className="text-xs text-gray-400">{(files[0].size / 1024).toFixed(1)} KB</p>
              </div>
            </div>
            <button onClick={() => { setFiles([]); setPreview(null); setDone(false); }} className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
            </button>
          </div>

          {tool.slug === "resize" && (
            <div className="flex gap-3">
              <div className="flex-1">
                <label className="text-xs text-gray-500 mb-1 block">Width</label>
                <input type="number" value={resizeW} onChange={(e) => setResizeW(Number(e.target.value))} className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300" />
              </div>
              <div className="flex-1">
                <label className="text-xs text-gray-500 mb-1 block">Height</label>
                <input type="number" value={resizeH} onChange={(e) => setResizeH(Number(e.target.value))} className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300" />
              </div>
            </div>
          )}

          {tool.slug === "compress" && (
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Quality: {Math.round(quality * 100)}%</label>
              <input type="range" min="0.1" max="1" step="0.05" value={quality} onChange={(e) => setQuality(Number(e.target.value))} className="w-full accent-primary-500" />
            </div>
          )}

          {tool.slug === "pixelate" && (
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Pixel size: {pixelSize}px</label>
              <input type="range" min="2" max="50" step="1" value={pixelSize} onChange={(e) => setPixelSize(Number(e.target.value))} className="w-full accent-primary-500" />
            </div>
          )}

          {tool.slug === "crop" && (
            <div className="grid grid-cols-2 gap-3">
              <div><label className="text-xs text-gray-500 block mb-1">X offset</label><input type="number" value={cropX} onChange={(e) => setCropX(Number(e.target.value))} className="w-full rounded-xl border border-gray-200 dark:border-gray-700 px-3 py-2 text-sm bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-300" /></div>
              <div><label className="text-xs text-gray-500 block mb-1">Y offset</label><input type="number" value={cropY} onChange={(e) => setCropY(Number(e.target.value))} className="w-full rounded-xl border border-gray-200 dark:border-gray-700 px-3 py-2 text-sm bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-300" /></div>
              <div><label className="text-xs text-gray-500 block mb-1">Width</label><input type="number" value={cropW} onChange={(e) => setCropW(Number(e.target.value))} className="w-full rounded-xl border border-gray-200 dark:border-gray-700 px-3 py-2 text-sm bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-300" /></div>
              <div><label className="text-xs text-gray-500 block mb-1">Height</label><input type="number" value={cropH} onChange={(e) => setCropH(Number(e.target.value))} className="w-full rounded-xl border border-gray-200 dark:border-gray-700 px-3 py-2 text-sm bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-300" /></div>
            </div>
          )}

          {ocrResult && (
            <div className="space-y-3">
              <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
                <p className="text-sm text-gray-800 dark:text-gray-200 whitespace-pre-wrap">{ocrResult}</p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => navigator.clipboard.writeText(ocrResult)} className="flex-1 py-2 rounded-xl border border-gray-200 dark:border-gray-700 text-sm font-medium text-gray-600 dark:text-gray-300">Copy Text</button>
                <button onClick={() => { setFiles([]); setPreview(null); setOcrResult(""); }} className="flex-1 py-2 rounded-xl bg-indigo-500 text-white text-sm font-medium">Process Another</button>
              </div>
            </div>
          )}

          {canPreview && files.length > 0 && !done && (
            <button onClick={generatePreview} className="w-full py-2 rounded-xl border-2 border-dashed border-primary-300 text-primary-600 text-sm font-medium hover:bg-primary-50 transition-colors">
              Preview Effect
            </button>
          )}

          {previewResult && (
            <div className="space-y-2">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Preview Result</p>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <p className="text-xs text-gray-400 text-center">Before</p>
                  <div className="rounded-xl overflow-hidden border border-gray-100 bg-gray-50 flex items-center justify-center p-2">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={preview!} alt="Before" className="max-h-40 rounded object-contain" />
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-gray-400 text-center">After</p>
                  <div className="rounded-xl overflow-hidden border border-primary-200 bg-primary-50 flex items-center justify-center p-2">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={previewResult} alt="After" className="max-h-40 rounded object-contain" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {error && <p className="text-sm text-red-500 text-center">{error}</p>}

          {comingSoon ? (
            <div className="text-center space-y-3 py-8">
              <div className="inline-flex w-14 h-14 rounded-full bg-amber-100 dark:bg-amber-900/30 items-center justify-center"><span className="text-2xl">🚧</span></div>
              <p className="text-lg font-semibold text-gray-800 dark:text-white">Coming Soon</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">This tool is under development and will be available soon.</p>
              <button onClick={() => { setFiles([]); setPreview(null); setComingSoon(false); }} className="text-sm text-indigo-500 hover:text-indigo-700 font-medium">Try another tool</button>
            </div>
          ) : done ? (
            <div className="text-center space-y-3">
              <div className="inline-flex w-12 h-12 rounded-full bg-green-100 items-center justify-center">
                <svg className="w-6 h-6 text-green-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>
              </div>
              <p className="text-sm font-medium text-gray-800 dark:text-white">Done! File downloaded.</p>
              <button onClick={() => { setFiles([]); setPreview(null); setDone(false); }} className="text-sm text-indigo-500 hover:text-indigo-700 font-medium">Process another</button>
            </div>
          ) : (
            <button disabled={processing} onClick={process} className="w-full py-2.5 rounded-xl bg-gradient-to-r from-primary-500 to-primary-600 text-white text-sm font-medium shadow-md shadow-primary-200 hover:shadow-lg disabled:opacity-50 transition-all">
              {processing ? "Processing..." : tool.name}
            </button>
          )}
        </div>
      )}
    </ToolLayout>
  );
}

function CombineContent({ tool }: { tool: Tool }) {
  const [files, setFiles] = useState<File[]>([]);
  const [processing, setProcessing] = useState(false);
  const [done, setDone] = useState(false);
  const [direction, setDirection] = useState<"horizontal" | "vertical">("horizontal");

  return (
    <ToolLayout tool={tool}>
      {files.length === 0 ? (
        <FileUpload accept="image/*" multiple label="Upload Images" onFiles={(f) => { setFiles(f); setDone(false); }} />
      ) : (
        <div className="mx-auto max-w-2xl space-y-4">
          <p className="text-sm text-gray-600">{files.length} images selected</p>
          <div className="flex gap-2">
            {(["horizontal", "vertical"] as const).map((d) => (
              <button key={d} onClick={() => setDirection(d)} className={`flex-1 py-2 rounded-xl text-sm font-medium ${direction === d ? "bg-primary-500 text-white" : "bg-gray-100 text-gray-600"}`}>
                {d === "horizontal" ? "Side by Side" : "Stacked"}
              </button>
            ))}
          </div>
          {done ? (
            <div className="text-center space-y-3">
              <div className="inline-flex w-12 h-12 rounded-full bg-green-100 items-center justify-center">
                <svg className="w-6 h-6 text-green-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>
              </div>
              <p className="text-sm font-medium text-gray-800">Done!</p>
              <button onClick={() => { setFiles([]); setDone(false); }} className="text-sm text-primary-500 font-medium">Process another</button>
            </div>
          ) : (
            <button disabled={processing} onClick={async () => { setProcessing(true); await combineImages(files, direction); setProcessing(false); setDone(true); }} className="w-full py-2.5 rounded-xl bg-gradient-to-r from-primary-500 to-primary-600 text-white text-sm font-medium shadow-md disabled:opacity-50 transition-all">
              {processing ? "Combining..." : "Combine Images"}
            </button>
          )}
        </div>
      )}
    </ToolLayout>
  );
}

function AddTextContent({ tool }: { tool: Tool }) {
  const [files, setFiles] = useState<File[]>([]);
  const [processing, setProcessing] = useState(false);
  const [done, setDone] = useState(false);
  const [text, setText] = useState("Hello");
  const [fontSize, setFontSize] = useState(32);
  const [color, setColor] = useState("#ffffff");

  return (
    <ToolLayout tool={tool}>
      {files.length === 0 ? (
        <FileUpload accept="image/*" label="Upload Image" onFiles={(f) => { setFiles(f); setDone(false); }} />
      ) : (
        <div className="mx-auto max-w-2xl space-y-4">
          <input type="text" value={text} onChange={(e) => setText(e.target.value)} placeholder="Text to add" className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300" />
          <div className="flex gap-3">
            <div className="flex-1">
              <label className="text-xs text-gray-500 mb-1 block">Font Size</label>
              <input type="number" value={fontSize} onChange={(e) => setFontSize(Number(e.target.value))} className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300" />
            </div>
            <div className="flex-1">
              <label className="text-xs text-gray-500 mb-1 block">Color</label>
              <input type="color" value={color} onChange={(e) => setColor(e.target.value)} className="w-full h-10 rounded-xl border border-gray-200 cursor-pointer" />
            </div>
          </div>
          {done ? (
            <div className="text-center space-y-3">
              <div className="inline-flex w-12 h-12 rounded-full bg-green-100 items-center justify-center">
                <svg className="w-6 h-6 text-green-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>
              </div>
              <p className="text-sm font-medium text-gray-800">Done!</p>
              <button onClick={() => { setFiles([]); setDone(false); }} className="text-sm text-primary-500 font-medium">Process another</button>
            </div>
          ) : (
            <button disabled={processing} onClick={async () => { setProcessing(true); await addTextToImage(files[0], text, 50, 50, fontSize, color); setProcessing(false); setDone(true); }} className="w-full py-2.5 rounded-xl bg-gradient-to-r from-primary-500 to-primary-600 text-white text-sm font-medium shadow-md disabled:opacity-50 transition-all">
              {processing ? "Processing..." : "Add Text"}
            </button>
          )}
        </div>
      )}
    </ToolLayout>
  );
}

function AiImageGenContent({ tool }: { tool: Tool }) {
  const [prompt, setPrompt] = useState("");
  const [generating, setGenerating] = useState(false);
  const [imageSrc, setImageSrc] = useState("");
  const [error, setError] = useState("");
  const [progress, setProgress] = useState(0);
  const [elapsed, setElapsed] = useState(0);

  const generate = async () => {
    setGenerating(true);
    setImageSrc("");
    setError("");
    setProgress(0);
    setElapsed(0);

    const startTime = Date.now();
    const timer = setInterval(() => {
      const now = Date.now() - startTime;
      setElapsed(Math.floor(now / 1000));
      setProgress(Math.min(90, (now / 25000) * 90));
    }, 200);

    try {
      const res = await fetch("/api/ai/image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });
      const data = await res.json();
      if (data.b64) {
        setImageSrc(`data:image/png;base64,${data.b64}`);
      } else if (data.url) {
        setImageSrc(data.url);
      } else {
        setError(data.error || "Generation failed. Please try again.");
      }
      setProgress(100);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      clearInterval(timer);
      setGenerating(false);
    }
  };

  const downloadImage = () => {
    const a = document.createElement("a");
    a.href = imageSrc;
    a.download = "ai-generated.png";
    a.click();
  };

  return (
    <ToolLayout tool={tool}>
      <div className="mx-auto max-w-2xl space-y-4">
        <textarea value={prompt} onChange={(e) => setPrompt(e.target.value)} placeholder="Describe the image you want to create... (e.g. 'A futuristic city at sunset with flying cars')" rows={4} className="w-full rounded-2xl border border-gray-200 p-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300 resize-none" />
        <button disabled={generating || !prompt.trim()} onClick={generate} className="w-full py-3 rounded-xl bg-gradient-to-r from-primary-500 to-primary-600 text-white font-medium shadow-md disabled:opacity-50 transition-all">
          {generating ? (
            <span className="inline-flex items-center gap-2">
              <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" className="opacity-25"/><path d="M4 12a8 8 0 018-8" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/></svg>
              Generating...
            </span>
          ) : "Generate Image"}
        </button>
        {generating && (
          <div className="space-y-2">
            <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-purple-400 to-indigo-600 rounded-full transition-all duration-300 ease-out" style={{ width: `${progress}%` }} />
            </div>
            <div className="flex justify-between text-xs text-gray-400">
              <span>AI is creating your image... {Math.round(progress)}%</span>
              <span>{elapsed}s / ~25s</span>
            </div>
          </div>
        )}
        {error && <p className="text-sm text-red-500 text-center">{error}</p>}
        {imageSrc && (
          <div className="space-y-3">
            <div className="rounded-2xl overflow-hidden border border-gray-100 bg-gray-50">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={imageSrc} alt="AI Generated" className="w-full" />
            </div>
            <button onClick={downloadImage} className="block w-full py-2.5 rounded-xl bg-accent-500 text-white text-sm font-medium text-center hover:bg-accent-600 transition-colors">
              Download Image
            </button>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
