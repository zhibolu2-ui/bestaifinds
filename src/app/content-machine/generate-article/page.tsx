"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";

const STYLES = [
  { value: "professional", label: "Professional" },
  { value: "casual", label: "Casual" },
  { value: "academic", label: "Academic" },
  { value: "creative", label: "Creative" },
  { value: "seo", label: "SEO Focused" },
];

const LENGTHS = [
  { value: "short", label: "Short (400-600 words)" },
  { value: "medium", label: "Medium (800-1200 words)" },
  { value: "long", label: "Long (1500-2000 words)" },
];

export default function GenerateArticlePage() {
  const { data: session } = useSession();
  const [title, setTitle] = useState("");
  const [style, setStyle] = useState("professional");
  const [length, setLength] = useState("medium");
  const [loading, setLoading] = useState(false);
  const [article, setArticle] = useState("");
  const [error, setError] = useState("");

  const handleGenerate = async () => {
    if (!session?.user) {
      setError("Please sign in first to generate content.");
      return;
    }
    if (title.trim().length < 3) {
      setError("Please enter a valid title (at least 3 characters).");
      return;
    }

    setLoading(true);
    setError("");
    setArticle("");

    try {
      const res = await fetch("/api/content-machine", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, style, length }),
      });
      const data = await res.json();
      if (data.error) {
        setError(data.error);
      } else {
        setArticle(data.article);
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(article);
  };

  return (
    <div className="max-w-3xl mx-auto px-6 py-10">
      {/* Credits banner */}
      {!session?.user && (
        <div className="mb-6 flex items-center justify-between bg-amber-50 dark:bg-amber-900/20 rounded-xl px-5 py-3">
          <p className="text-sm text-amber-700 dark:text-amber-400">Sign in to start generating content</p>
          <Link href="/signin" className="px-4 py-1.5 bg-indigo-500 text-white rounded-lg text-sm font-medium hover:bg-indigo-600 transition-colors">
            Sign In
          </Link>
        </div>
      )}

      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 text-center">Generate Article</h1>
      <p className="text-gray-500 dark:text-gray-400 text-center mb-8">Enter a title and we&apos;ll generate a full article for you</p>

      {/* Input area */}
      <div className="bg-white dark:bg-[#1e2024] rounded-2xl border border-gray-200 dark:border-gray-800 p-6 mb-6">
        <div className="mb-5">
          <div className="flex items-center gap-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl px-4 py-3">
            <input
              type="text"
              placeholder="e.g. Benefits of Using a Real Estate Agent"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && !loading && handleGenerate()}
              className="flex-1 bg-transparent text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none text-sm"
            />
            <button
              onClick={handleGenerate}
              disabled={loading || title.trim().length < 3}
              className="shrink-0 px-5 py-2 bg-indigo-500 text-white rounded-lg text-sm font-semibold hover:bg-indigo-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
                  Generating...
                </span>
              ) : (
                "Generate"
              )}
            </button>
          </div>
        </div>

        {/* Options */}
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-[140px]">
            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">Writing Style</label>
            <select
              value={style}
              onChange={(e) => setStyle(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-300"
            >
              {STYLES.map((s) => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </select>
          </div>
          <div className="flex-1 min-w-[140px]">
            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">Article Length</label>
            <select
              value={length}
              onChange={(e) => setLength(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-300"
            >
              {LENGTHS.map((l) => (
                <option key={l.value} value={l.value}>{l.label}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Automation banner */}
      {!article && !loading && (
        <p className="text-center text-sm text-gray-400 dark:text-gray-500">
          Want full automation? Use our{" "}
          <Link href="/content-machine/batch-generator" className="text-indigo-500 hover:text-indigo-600 font-medium">
            Batch Generator
          </Link>
        </p>
      )}

      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 rounded-xl p-4 mb-6">
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        </div>
      )}

      {/* Generated article */}
      {article && (
        <div className="bg-white dark:bg-[#1e2024] rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden">
          <div className="flex items-center justify-between px-6 py-3 border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50">
            <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Generated Article</h2>
            <div className="flex items-center gap-2">
              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-600 dark:text-gray-400 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect width="14" height="14" x="8" y="8" rx="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
                Copy
              </button>
              <button
                onClick={() => {
                  const blob = new Blob([article], { type: "text/markdown" });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement("a");
                  a.href = url;
                  a.download = `${title.trim().replace(/\s+/g, "-").toLowerCase()}.md`;
                  a.click();
                  URL.revokeObjectURL(url);
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-indigo-500 rounded-lg hover:bg-indigo-600 transition-colors"
              >
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
                Download
              </button>
            </div>
          </div>
          <div className="px-6 py-6 prose prose-sm dark:prose-invert max-w-none">
            {article.split("\n").map((line, i) => {
              if (line.startsWith("### ")) return <h3 key={i} className="text-base font-bold text-gray-900 dark:text-white mt-4 mb-2">{line.slice(4)}</h3>;
              if (line.startsWith("## ")) return <h2 key={i} className="text-lg font-bold text-gray-900 dark:text-white mt-6 mb-2">{line.slice(3)}</h2>;
              if (line.startsWith("# ")) return <h1 key={i} className="text-xl font-bold text-gray-900 dark:text-white mt-6 mb-3">{line.slice(2)}</h1>;
              if (line.startsWith("- ") || line.startsWith("* ")) return <li key={i} className="text-gray-700 dark:text-gray-300 text-sm ml-4">{line.slice(2)}</li>;
              if (line.trim() === "") return <br key={i} />;
              return <p key={i} className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed mb-3">{line}</p>;
            })}
          </div>
        </div>
      )}
    </div>
  );
}
