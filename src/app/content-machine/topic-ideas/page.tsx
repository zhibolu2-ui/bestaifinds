"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";

export default function TopicIdeasPage() {
  const { data: session } = useSession();
  const [niche, setNiche] = useState("");
  const [loading, setLoading] = useState(false);
  const [ideas, setIdeas] = useState<string[]>([]);
  const [error, setError] = useState("");

  const handleGenerate = async () => {
    if (!session?.user) {
      setError("Please sign in first.");
      return;
    }
    if (niche.trim().length < 2) {
      setError("Please enter a niche or industry.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/content-machine", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: `Generate 10 SEO-optimized blog post title ideas for the niche: "${niche.trim()}". Return ONLY a numbered list, one title per line, no extra explanation.`,
          style: "seo",
          length: "short",
        }),
      });
      const data = await res.json();
      if (data.error) {
        setError(data.error);
      } else {
        const parsed = data.article
          .split("\n")
          .map((line: string) => line.replace(/^\d+[\.\)]\s*/, "").trim())
          .filter((line: string) => line.length > 5 && !line.startsWith("#"));
        setIdeas(parsed.slice(0, 10));
      }
    } catch {
      setError("Failed to generate ideas. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-6 py-10">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 text-center">Topic Ideas</h1>
      <p className="text-gray-500 dark:text-gray-400 text-center mb-8">
        Enter your niche and let AI suggest article topics for you
      </p>

      <div className="bg-white dark:bg-[#1e2024] rounded-2xl border border-gray-200 dark:border-gray-800 p-6 mb-6">
        <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">Your Niche or Industry</label>
        <div className="flex gap-3">
          <input
            type="text"
            placeholder="e.g. Real Estate, Health & Fitness, Digital Marketing..."
            value={niche}
            onChange={(e) => setNiche(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !loading && handleGenerate()}
            className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 text-sm text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-300"
          />
          <button
            onClick={handleGenerate}
            disabled={loading || niche.trim().length < 2}
            className="shrink-0 px-5 py-2.5 bg-indigo-500 text-white rounded-xl text-sm font-semibold hover:bg-indigo-600 transition-colors disabled:opacity-50"
          >
            {loading ? "Generating..." : "Get Ideas"}
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 rounded-xl p-4 mb-6">
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        </div>
      )}

      {ideas.length > 0 && (
        <div className="bg-white dark:bg-[#1e2024] rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden">
          <div className="px-6 py-3 border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50">
            <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
              {ideas.length} Topic Ideas for &quot;{niche}&quot;
            </h2>
          </div>
          <ul className="divide-y divide-gray-100 dark:divide-gray-800">
            {ideas.map((idea, i) => (
              <li key={i} className="flex items-center justify-between px-6 py-3.5 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors group">
                <span className="text-sm text-gray-700 dark:text-gray-300">{idea}</span>
                <Link
                  href={`/content-machine/generate-article?title=${encodeURIComponent(idea)}`}
                  className="shrink-0 ml-4 px-3 py-1.5 text-xs font-medium text-indigo-500 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-indigo-100 dark:hover:bg-indigo-900/50"
                >
                  Write Article →
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
