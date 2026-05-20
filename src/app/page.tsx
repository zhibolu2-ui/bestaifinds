"use client";

import Link from "next/link";
import { useState, useRef } from "react";
import ToolCard from "@/components/ToolCard";
import {
  CATEGORIES,
  Category,
  getToolsByCategory,
  getFeaturedTools,
  TOOLS,
} from "@/lib/tools";

const TAB_CONFIG: { id: Category | "all"; label: string; icon: string }[] = [
  { id: "all", label: "All Tools", icon: "🔧" },
  { id: "pdf", label: "Pdf Tools", icon: "📄" },
  { id: "image", label: "Image Tools", icon: "🖼️" },
  { id: "write", label: "AI Write", icon: "✍️" },
  { id: "video", label: "Video Tools", icon: "🎬" },
  { id: "file", label: "Converter Tools", icon: "📁" },
];

const FEATURES = [
  { icon: "🔒", title: "100% Secure", desc: "Files are processed locally in your browser" },
  { icon: "⚡", title: "Lightning Fast", desc: "No upload needed, instant processing" },
  { icon: "🆓", title: "Completely Free", desc: "No sign-up, no limits, no watermarks" },
  { icon: "📱", title: "Works Everywhere", desc: "Desktop, tablet and mobile compatible" },
];

export default function Home() {
  const [query, setQuery] = useState("");
  const [focused, setFocused] = useState(false);
  const [activeTab, setActiveTab] = useState<Category | "all">("all");
  const carouselRef = useRef<HTMLDivElement>(null);

  const filtered = (() => {
    if (query.length < 1) return [];
    const q = query.toLowerCase().trim();
    const words = q.split(/\s+/).filter(Boolean);

    return TOOLS.map((t) => {
      const name = t.name.toLowerCase();
      const desc = t.description.toLowerCase();
      const cat = t.category.toLowerCase();
      let score = 0;
      if (name === q) score += 100;
      else if (name.startsWith(q)) score += 60;
      else if (name.includes(q)) score += 40;
      if (desc.includes(q)) score += 20;
      if (cat.includes(q)) score += 15;
      for (const w of words) {
        if (name.includes(w)) score += 30;
        if (desc.includes(w)) score += 10;
        if (cat.includes(w)) score += 8;
      }
      return { tool: t, score };
    })
      .filter(({ score }) => score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 12)
      .map(({ tool }) => tool);
  })();

  const displayTools = activeTab === "all"
    ? TOOLS
    : getToolsByCategory(activeTab);

  const featuredTools = getFeaturedTools();

  const scrollCarousel = (dir: "left" | "right") => {
    if (!carouselRef.current) return;
    const amount = 340;
    carouselRef.current.scrollBy({ left: dir === "left" ? -amount : amount, behavior: "smooth" });
  };

  return (
    <div className="bg-white dark:bg-gray-950">
      {/* Hero */}
      <section className="relative bg-gradient-to-b from-indigo-50 via-white to-white dark:from-gray-900 dark:via-gray-950 dark:to-gray-950 pb-4">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-indigo-200/30 dark:bg-indigo-900/20 rounded-full blur-3xl" />
          <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-purple-200/20 dark:bg-purple-900/10 rounded-full blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-4xl px-4 pt-20 pb-12 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 text-xs font-medium mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
            {TOOLS.length}+ Free Tools Available
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 dark:text-white leading-tight tracking-tight">
            Free Online Tools
            <br />
            <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              That Just Work
            </span>
          </h1>

          <p className="mt-5 text-lg text-gray-500 dark:text-gray-400 max-w-xl mx-auto">
            PDF, image, video, AI writing and file conversion tools.
            No sign-up required. All free.
          </p>

          {/* Search */}
          <div className="relative mt-8 max-w-lg mx-auto z-[100]">
            <div className={`flex items-center gap-3 px-5 py-3.5 rounded-2xl bg-white dark:bg-gray-900 border-2 transition-all shadow-lg ${
              focused ? "border-indigo-400 dark:border-indigo-500 shadow-indigo-100 dark:shadow-indigo-900/30" : "border-gray-200 dark:border-gray-700"
            }`}>
              <svg className="w-5 h-5 text-gray-400 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
              <input
                type="text"
                placeholder="Search tools... e.g. merge pdf, compress image"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onFocus={() => setFocused(true)}
                onBlur={() => setTimeout(() => setFocused(false), 200)}
                className="w-full bg-transparent text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-400 focus:outline-none"
              />
            </div>
            {filtered.length > 0 && focused && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-900 rounded-xl shadow-2xl border border-gray-100 dark:border-gray-700 py-2 z-[200] max-h-96 overflow-y-auto">
                {filtered.map((t) => (
                  <Link
                    key={`${t.category}-${t.slug}`}
                    href={`/${t.category}/${t.slug}`}
                    className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  >
                    <span className="text-lg">{t.icon}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium text-gray-800 dark:text-gray-100">{t.name}</p>
                        <span className="shrink-0 text-[10px] font-medium px-1.5 py-0.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 uppercase">{t.category}</span>
                      </div>
                      <p className="text-xs text-gray-400 truncate">{t.description}</p>
                    </div>
                  </Link>
                ))}
                <p className="text-center text-[11px] text-gray-400 py-1.5 border-t border-gray-100 dark:border-gray-800 mt-1">
                  {filtered.length} result{filtered.length > 1 ? "s" : ""} found
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Most Popular Tools - Tab Filter */}
      <section className="mx-auto max-w-6xl px-4 py-12">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-center text-gray-900 dark:text-white mb-2">
          Our Most Popular Tools
        </h2>
        <p className="text-center text-gray-500 dark:text-gray-400 mb-8">
          We present the best of the best. All free, no catch
        </p>

        {/* Tab Bar */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {TAB_CONFIG.map(({ id, label, icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                activeTab === id
                  ? "bg-indigo-500 text-white shadow-md shadow-indigo-200 dark:shadow-indigo-900/30"
                  : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
              }`}
            >
              <span>{icon}</span>
              {label}
            </button>
          ))}
        </div>

        {/* Tool Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {displayTools.map((t) => (
            <Link
              key={`${t.category}-${t.slug}`}
              href={`/${t.category}/${t.slug}`}
              className="flex items-start gap-3 p-4 rounded-xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 hover:border-indigo-200 dark:hover:border-indigo-800 hover:shadow-md transition-all group"
            >
              <span className="text-2xl mt-0.5 shrink-0">{t.icon}</span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-gray-800 dark:text-gray-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                  {t.name}
                </p>
                <p className="text-xs font-medium text-indigo-500 dark:text-indigo-400 mt-0.5">
                  {CATEGORIES[t.category].label} Tools
                </p>
                <p className="text-xs text-gray-400 mt-1 line-clamp-2">{t.description}</p>
              </div>
            </Link>
          ))}
        </div>

        {activeTab !== "all" && (
          <div className="mt-6 text-center">
            <Link
              href={`/${activeTab}`}
              className="inline-flex items-center gap-1 text-sm font-medium text-indigo-500 hover:text-indigo-600 dark:text-indigo-400 transition-colors"
            >
              View All {CATEGORIES[activeTab].label} Tools
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m9 18 6-6-6-6"/></svg>
            </Link>
          </div>
        )}
      </section>

      {/* Features Bar */}
      <section className="border-y border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50">
        <div className="mx-auto max-w-6xl px-4 py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {FEATURES.map((f) => (
              <div key={f.title} className="flex items-center gap-3">
                <span className="text-2xl">{f.icon}</span>
                <div>
                  <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">{f.title}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Tools Carousel */}
      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white">
              Free Tools You&apos;d Usually Pay For
            </h2>
            <p className="text-gray-500 dark:text-gray-400 mt-1">
              No Limits, No Sign-Up. Here&apos;s our featured tools
            </p>
          </div>
          <div className="hidden sm:flex items-center gap-2">
            <button
              onClick={() => scrollCarousel("left")}
              className="w-10 h-10 rounded-full border border-gray-200 dark:border-gray-700 flex items-center justify-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:border-gray-300 dark:hover:border-gray-600 transition-colors"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m15 18-6-6 6-6"/></svg>
            </button>
            <button
              onClick={() => scrollCarousel("right")}
              className="w-10 h-10 rounded-full bg-indigo-500 text-white flex items-center justify-center hover:bg-indigo-600 transition-colors"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m9 18 6-6-6-6"/></svg>
            </button>
          </div>
        </div>

        <div
          ref={carouselRef}
          className="flex gap-5 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {featuredTools.map((t) => (
            <Link
              key={`feat-${t.category}-${t.slug}`}
              href={`/${t.category}/${t.slug}`}
              className="shrink-0 w-72 sm:w-80 snap-start group"
            >
              <div className="h-44 rounded-xl bg-gradient-to-br from-gray-100 to-gray-50 dark:from-gray-800 dark:to-gray-900 border border-gray-200 dark:border-gray-700 flex items-center justify-center mb-3 group-hover:border-indigo-300 dark:group-hover:border-indigo-700 transition-colors overflow-hidden">
                <div className="text-center">
                  <span className="text-5xl block mb-2">{t.icon}</span>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{t.name}</p>
                </div>
              </div>
              <h3 className="font-semibold text-gray-800 dark:text-gray-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                {t.name}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
                {t.description}
              </p>
              <p className="text-sm font-medium text-indigo-500 dark:text-indigo-400 mt-2 inline-flex items-center gap-1 group-hover:gap-2 transition-all">
                Learn more
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m9 18 6-6-6-6"/></svg>
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-r from-indigo-600 to-purple-700 py-16">
        <div className="mx-auto max-w-3xl px-4 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-indigo-200 mb-8 max-w-md mx-auto">
            No sign-up required. Just pick a tool and start working. It&apos;s that simple.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/pdf"
              className="inline-flex px-8 py-3 rounded-xl bg-white text-indigo-700 font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all"
            >
              Try PDF Tools
            </Link>
            <Link
              href="/pricing"
              className="inline-flex px-8 py-3 rounded-xl border-2 border-white/30 text-white font-semibold hover:bg-white/10 transition-all"
            >
              View Pricing
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
