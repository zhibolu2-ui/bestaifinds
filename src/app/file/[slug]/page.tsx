"use client";

import { use, useState, useCallback, useRef, useEffect } from "react";
import { notFound } from "next/navigation";
import ToolLayout from "@/components/ToolLayout";
import FileUpload from "@/components/FileUpload";
import { getToolBySlug, Tool } from "@/lib/tools";
import { csvToJson, jsonToCsv, xmlToJson, jsonToXml, xmlToCsv, csvToExcel, excelToCsv, downloadText } from "@/lib/file-tools";

const TEXT_TOOLS = ["word-counter", "base64", "epoch-converter", "qr-code"];

export default function FileToolPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const tool = getToolBySlug("file", slug);
  if (!tool) notFound();

  if (tool.slug === "qr-code") return <QrCodeContent tool={tool} />;
  if (TEXT_TOOLS.includes(tool.slug)) return <TextToolContent tool={tool} />;
  return <FileConvertContent tool={tool} />;
}

function FileConvertContent({ tool }: { tool: Tool }) {
  const [files, setFiles] = useState<File[]>([]);
  const [processing, setProcessing] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");
  const [comingSoon, setComingSoon] = useState(false);

  const handleFiles = useCallback((incoming: File[]) => {
    setFiles(incoming);
    setDone(false);
    setError("");
  }, []);

  const acceptMap: Record<string, string> = {
    "csv-to-json": ".csv",
    "json-to-csv": ".json",
    "csv-to-excel": ".csv",
    "xml-to-json": ".xml",
    "json-to-xml": ".json",
    "excel-to-csv": ".xlsx,.xls",
    "excel-to-pdf": ".xlsx,.xls",
    "xml-to-csv": ".xml",
  };

  const convert = async () => {
    if (!files[0]) return;
    setProcessing(true);
    setError("");
    try {
      const text = await files[0].text();
      switch (tool.slug) {
        case "csv-to-json": {
          const result = csvToJson(text);
          downloadText(result, "converted.json");
          break;
        }
        case "json-to-csv": {
          const result = jsonToCsv(text);
          downloadText(result, "converted.csv");
          break;
        }
        case "xml-to-json": {
          const result = xmlToJson(text);
          downloadText(result, "converted.json");
          break;
        }
        case "json-to-xml": {
          const result = jsonToXml(text);
          downloadText(result, "converted.xml");
          break;
        }
        case "xml-to-csv": {
          const csvFromXml = xmlToCsv(text);
          downloadText(csvFromXml, "converted.csv");
          break;
        }
        case "csv-to-excel":
          csvToExcel(text, "converted.xlsx");
          break;
        case "excel-to-csv": {
          const csvFromExcel = await excelToCsv(files[0]);
          downloadText(csvFromExcel, "converted.csv");
          break;
        }
        case "excel-to-pdf":
          setComingSoon(true); setProcessing(false); return;
        default:
          setComingSoon(true); setProcessing(false); return;
      }
      setDone(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Conversion failed");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <ToolLayout tool={tool}>
      {files.length === 0 ? (
        <FileUpload accept={acceptMap[tool.slug] || "*/*"} label="Upload File" onFiles={handleFiles} />
      ) : (
        <div className="mx-auto max-w-2xl space-y-4">
          <div className="flex items-center justify-between p-3 rounded-xl bg-surface-alt dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700">
            <div className="flex items-center gap-3 min-w-0">
              <span className="text-xl shrink-0">📂</span>
              <div className="min-w-0">
                <p className="text-sm font-medium text-gray-800 dark:text-gray-100 truncate">{files[0].name}</p>
                <p className="text-xs text-gray-400 dark:text-gray-500">{(files[0].size / 1024).toFixed(1)} KB</p>
              </div>
            </div>
            <button onClick={() => { setFiles([]); setDone(false); }} className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
            </button>
          </div>
          {error && <p className="text-sm text-red-500 text-center">{error}</p>}
          {comingSoon ? (
            <div className="text-center space-y-3 py-8">
              <div className="inline-flex w-14 h-14 rounded-full bg-amber-100 dark:bg-amber-900/30 items-center justify-center"><span className="text-2xl">🚧</span></div>
              <p className="text-lg font-semibold text-gray-800 dark:text-white">Coming Soon</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">This tool is under development and will be available soon.</p>
              <button onClick={() => { setFiles([]); setComingSoon(false); }} className="text-sm text-indigo-500 hover:text-indigo-700 font-medium">Try another tool</button>
            </div>
          ) : done ? (
            <div className="text-center space-y-3">
              <div className="inline-flex w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/40 items-center justify-center">
                <svg className="w-6 h-6 text-green-600 dark:text-green-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>
              </div>
              <p className="text-sm font-medium text-gray-800 dark:text-gray-100">Done! File downloaded.</p>
              <button onClick={() => { setFiles([]); setDone(false); }} className="text-sm text-indigo-500 font-medium">Convert another</button>
            </div>
          ) : (
            <button disabled={processing} onClick={convert} className="w-full py-2.5 rounded-xl bg-gradient-to-r from-primary-500 to-primary-600 text-white text-sm font-medium shadow-md disabled:opacity-50 transition-all">
              {processing ? "Converting..." : "Convert Now"}
            </button>
          )}
        </div>
      )}
    </ToolLayout>
  );
}

function QrCodeContent({ tool }: { tool: Tool }) {
  const [input, setInput] = useState("");
  const [size, setSize] = useState(256);
  const [fgColor, setFgColor] = useState("#000000");
  const [bgColor, setBgColor] = useState("#ffffff");
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [generated, setGenerated] = useState(false);

  const generate = async () => {
    if (!input.trim() || !canvasRef.current) return;
    const QRCode = (await import("qrcode")).default;
    await QRCode.toCanvas(canvasRef.current, input, {
      width: size,
      margin: 2,
      color: { dark: fgColor, light: bgColor },
    });
    setGenerated(true);
  };

  const download = () => {
    if (!canvasRef.current) return;
    const link = document.createElement("a");
    link.download = "qrcode.png";
    link.href = canvasRef.current.toDataURL("image/png");
    link.click();
  };

  return (
    <ToolLayout tool={tool}>
      <div className="mx-auto max-w-2xl space-y-6">
        <div>
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">URL or Text</label>
          <input
            type="text"
            value={input}
            onChange={(e) => { setInput(e.target.value); setGenerated(false); }}
            placeholder="https://example.com or any text..."
            className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300 dark:focus:ring-primary-600 text-gray-900 dark:text-gray-100"
          />
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1 block">Size (px)</label>
            <select value={size} onChange={(e) => { setSize(Number(e.target.value)); setGenerated(false); }}
              className="w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-2 text-sm text-gray-900 dark:text-gray-100">
              <option value={128}>128</option>
              <option value={256}>256</option>
              <option value={512}>512</option>
              <option value={1024}>1024</option>
            </select>
          </div>
          <div>
            <label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1 block">Foreground</label>
            <input type="color" value={fgColor} onChange={(e) => { setFgColor(e.target.value); setGenerated(false); }}
              className="w-full h-9 rounded-lg border border-gray-200 dark:border-gray-700 cursor-pointer" />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1 block">Background</label>
            <input type="color" value={bgColor} onChange={(e) => { setBgColor(e.target.value); setGenerated(false); }}
              className="w-full h-9 rounded-lg border border-gray-200 dark:border-gray-700 cursor-pointer" />
          </div>
        </div>

        <button onClick={generate} disabled={!input.trim()} className="w-full py-2.5 rounded-xl bg-gradient-to-r from-primary-500 to-primary-600 text-white text-sm font-medium shadow-md disabled:opacity-50 transition-all">
          Generate QR Code
        </button>

        <div className="flex flex-col items-center gap-4">
          <canvas ref={canvasRef} className={`rounded-xl border border-gray-100 dark:border-gray-700 ${generated ? "" : "hidden"}`} />
          {generated && (
            <button onClick={download} className="inline-flex items-center gap-2 px-5 py-2 rounded-lg bg-green-500 text-white text-sm font-medium hover:bg-green-600 transition-colors">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
              Download PNG
            </button>
          )}
        </div>
      </div>
    </ToolLayout>
  );
}

function TextToolContent({ tool }: { tool: Tool }) {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");

  useEffect(() => {
    if (tool.slug === "word-counter" && input) {
      const words = input.trim() ? input.trim().split(/\s+/).length : 0;
      const chars = input.length;
      const charsNoSpace = input.replace(/\s/g, "").length;
      const sentences = input.split(/[.!?]+/).filter((s) => s.trim()).length;
      const paragraphs = input.split(/\n\n+/).filter((s) => s.trim()).length;
      setOutput(
        `Words: ${words}\nCharacters (with spaces): ${chars}\nCharacters (no spaces): ${charsNoSpace}\nSentences: ${sentences}\nParagraphs: ${paragraphs}\nReading time: ~${Math.ceil(words / 200)} min`,
      );
    }
  }, [input, tool.slug]);

  const process = () => {
    switch (tool.slug) {
      case "word-counter":
        break;
      case "base64": {
        try {
          const decoded = atob(input);
          setOutput(`Decoded:\n${decoded}`);
        } catch {
          try {
            setOutput(`Encoded:\n${btoa(unescape(encodeURIComponent(input)))}`);
          } catch {
            setOutput("Could not encode — input may contain unsupported characters.");
          }
        }
        break;
      }
      case "epoch-converter": {
        const num = Number(input);
        if (!isNaN(num) && input.trim()) {
          const d = num > 1e12 ? new Date(num) : new Date(num * 1000);
          if (!isNaN(d.getTime())) {
            setOutput(`UTC: ${d.toUTCString()}\nLocal: ${d.toLocaleString()}\nISO: ${d.toISOString()}`);
          } else {
            setOutput("Invalid timestamp");
          }
        } else {
          const d = new Date(input);
          if (!isNaN(d.getTime())) {
            setOutput(`Epoch (seconds): ${Math.floor(d.getTime() / 1000)}\nEpoch (milliseconds): ${d.getTime()}`);
          } else {
            setOutput("Invalid input. Enter a Unix timestamp or date string.");
          }
        }
        break;
      }
      default:
        setOutput("Processing...");
    }
  };

  return (
    <ToolLayout tool={tool}>
      <div className="mx-auto max-w-3xl space-y-4">
        <div>
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">Input</label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={tool.slug === "epoch-converter" ? "Enter a timestamp (e.g. 1700000000) or date string..." : tool.slug === "base64" ? "Enter text to encode, or paste Base64 to decode..." : "Enter your text here..."}
            rows={6}
            className="w-full rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 text-sm leading-relaxed text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-300 dark:focus:ring-primary-600 resize-none"
          />
        </div>
        {tool.slug !== "word-counter" && (
          <button onClick={process} disabled={!input.trim()} className="w-full py-2.5 rounded-xl bg-gradient-to-r from-primary-500 to-primary-600 text-white text-sm font-medium shadow-md disabled:opacity-50 transition-all">
            Process
          </button>
        )}
        {output && (
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Result</label>
              <button onClick={() => navigator.clipboard.writeText(output)} className="text-xs text-primary-500 hover:text-primary-700 dark:hover:text-primary-300 font-medium">Copy</button>
            </div>
            <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-surface-alt dark:bg-gray-800/50 p-5 text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap font-mono">{output}</div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
