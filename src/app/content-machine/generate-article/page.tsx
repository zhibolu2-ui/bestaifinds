"use client";

import { useState, useEffect, Suspense } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

function GenerateArticleContent() {
  const { data: session } = useSession();
  const searchParams = useSearchParams();
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [article, setArticle] = useState("");
  const [error, setError] = useState("");
  const userPlan = (session?.user as Record<string, unknown>)?.plan as string || "free";

  useEffect(() => {
    const t = searchParams.get("title");
    if (t) setTitle(t);
  }, [searchParams]);

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
        body: JSON.stringify({ title, style: "seo", length: "medium" }),
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

  return (
    <div className="max-w-3xl mx-auto px-6 py-10">
      {/* Credits banner */}
      {userPlan === "free" && session?.user && (
        <div className="flex items-center justify-center gap-3 mb-8">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 text-xs font-medium">
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/></svg>
            Credits remaining: 0
          </span>
          <Link href="/pricing" className="px-4 py-1.5 bg-indigo-500 text-white rounded-full text-xs font-semibold hover:bg-indigo-600 transition-colors">
            Upgrade Now
          </Link>
        </div>
      )}

      {/* Title */}
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white text-center mb-2">
        Generate Article
      </h1>
      <p className="text-gray-500 dark:text-gray-400 text-center mb-10">
        Enter a title and we&apos;ll generate a full article for you
      </p>

      {/* Input area */}
      <div className="flex items-center gap-3 bg-amber-50/50 dark:bg-amber-900/10 border border-amber-200/60 dark:border-amber-800/30 rounded-xl px-5 py-4 mb-4">
        <input
          type="text"
          placeholder="e.g. Benefits of Using a Real Estate Agent"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && !loading && handleGenerate()}
          className="flex-1 bg-transparent text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none"
        />
        <button
          onClick={handleGenerate}
          disabled={loading || title.trim().length < 3}
          className="shrink-0 px-6 py-2.5 bg-amber-400 hover:bg-amber-500 text-gray-900 rounded-lg font-semibold text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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

      {/* Automation hint */}
      {!article && !loading && !error && (
        <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-6">
          Want to automate everything? Use our{" "}
          <Link href="/content-machine/batch-generator" className="text-indigo-500 hover:text-indigo-600 font-medium">
            Automation Guide
          </Link>
        </p>
      )}

      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 rounded-xl p-4 mt-6">
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        </div>
      )}

      {/* Loading state */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-16">
          <div className="w-12 h-12 border-3 border-indigo-500 border-t-transparent rounded-full animate-spin mb-4" />
          <p className="text-gray-500 dark:text-gray-400 text-sm">Generating your article...</p>
          <p className="text-gray-400 dark:text-gray-500 text-xs mt-1">This may take 15-30 seconds</p>
        </div>
      )}

      {/* Generated article */}
      {article && (
        <div className="mt-8 bg-white dark:bg-[#1e2024] rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden">
          <div className="flex items-center justify-between px-6 py-3 border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50">
            <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Generated Article</h2>
            <div className="flex items-center gap-2">
              <button
                onClick={() => navigator.clipboard.writeText(article)}
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

export default function GenerateArticlePage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center py-20"><div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" /></div>}>
      <GenerateArticleContent />
    </Suspense>
  );
}
