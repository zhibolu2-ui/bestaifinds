"use client";

import { use, useState } from "react";
import { notFound } from "next/navigation";
import ToolLayout from "@/components/ToolLayout";
import { getToolBySlug } from "@/lib/tools";

export default function WriteToolPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const tool = getToolBySlug("write", slug);
  if (!tool) notFound();

  return <WriteToolContent tool={tool} />;
}

function WriteToolContent({ tool }: { tool: NonNullable<ReturnType<typeof getToolBySlug>> }) {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!input.trim()) return;
    setLoading(true);
    setOutput("");
    try {
      const res = await fetch("/api/ai/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tool: tool.slug, input }),
      });
      const data = await res.json();
      setOutput(data.result || "Something went wrong. Please try again.");
    } catch {
      setOutput("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ToolLayout tool={tool}>
      <div className="mx-auto max-w-3xl space-y-6">
        {/* Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Your Input
          </label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={getPlaceholder(tool.slug)}
            rows={6}
            className="w-full rounded-2xl border border-gray-200 p-4 text-sm leading-relaxed focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-transparent resize-none"
          />
          <p className="mt-1 text-xs text-gray-400 text-right">
            {input.length} characters
          </p>
        </div>

        <button
          disabled={loading || !input.trim()}
          onClick={handleGenerate}
          className="w-full py-3 rounded-xl bg-gradient-to-r from-primary-500 to-primary-600 text-white font-medium shadow-md shadow-primary-200 hover:shadow-lg disabled:opacity-50 transition-all"
        >
          {loading ? (
            <span className="inline-flex items-center gap-2">
              <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" className="opacity-25"/><path d="M4 12a8 8 0 018-8" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/></svg>
              Writing...
            </span>
          ) : (
            tool.name
          )}
        </button>

        {/* Output */}
        {output && (
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-gray-700">Result</label>
              <button
                onClick={() => navigator.clipboard.writeText(output)}
                className="text-xs text-primary-500 hover:text-primary-700 font-medium transition-colors"
              >
                Copy to clipboard
              </button>
            </div>
            <div className="rounded-2xl border border-gray-200 bg-surface-alt p-5 text-sm leading-relaxed text-gray-700 whitespace-pre-wrap">
              {output}
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}

function getPlaceholder(slug: string): string {
  const map: Record<string, string> = {
    "content-improver": "Paste the text you want to improve...",
    "essay-writer": "Enter your essay topic and any specific requirements...",
    "grammar-fixer": "Paste text to fix grammar, spelling and punctuation...",
    "sentence-rewriter": "Enter the sentence you want to rephrase...",
    "content-summarizer": "Paste the long text you want to summarize...",
    "humanizer-ai": "Paste AI-generated text to make it sound more human...",
    "translate": "Enter text to translate...",
    "blog-post": "Enter your blog post topic...",
  };
  return map[slug] || "Enter your text here...";
}
