"use client";

import Link from "next/link";
import { useState, useRef } from "react";
import {
  CATEGORIES,
  Category,
  getToolsByCategory,
  getFeaturedTools,
  TOOLS,
} from "@/lib/tools";

const CAT_CARDS: { cat: Category; icon: string; bg: string; label: string; solve: string }[] = [
  { cat: "pdf", icon: "📄", bg: "bg-[#764FE5]", label: "PDF Tools", solve: "Solve Your PDF Problems" },
  { cat: "image", icon: "🖼️", bg: "bg-[#E54F6D]", label: "Image Tools", solve: "Solve Your Image Problems" },
  { cat: "video", icon: "🎬", bg: "bg-[#E5854F]", label: "Video Tools", solve: "Solve Your Video Problems" },
  { cat: "write", icon: "✍️", bg: "bg-[#6ECA1C]", label: "AI Write", solve: "Solve Your Text Problems" },
  { cat: "file", icon: "📁", bg: "bg-[#1A8FE3]", label: "File Tools", solve: "Solve Your File Problems" },
];

const TAB_ITEMS: { id: Category | "all"; label: string; icon: string }[] = [
  { id: "all", label: "All Tools", icon: "🔧" },
  { id: "pdf", label: "Pdf Tools", icon: "📄" },
  { id: "video", label: "Video Tools", icon: "🎬" },
  { id: "image", label: "Image Tools", icon: "🖼️" },
  { id: "file", label: "Converter Tools", icon: "📁" },
  { id: "write", label: "AI Write", icon: "✍️" },
];

const STATS = [
  { num: "70+", label: "Online Tools" },
  { num: "100%", label: "Free to Use" },
  { num: "0", label: "Sign-ups Required" },
  { num: "5", label: "Tool Categories" },
];

const CAT_COLORS: Record<Category, string> = {
  pdf: "text-[#764FE5]",
  image: "text-[#E54F6D]",
  write: "text-[#6ECA1C]",
  video: "text-[#E5854F]",
  file: "text-[#1A8FE3]",
};

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

  const popularTools = activeTab === "all"
    ? TOOLS.slice(0, 12)
    : getToolsByCategory(activeTab).slice(0, 12);

  const featuredTools = getFeaturedTools();

  const scrollCarousel = (dir: "left" | "right") => {
    if (!carouselRef.current) return;
    carouselRef.current.scrollBy({ left: dir === "left" ? -400 : 400, behavior: "smooth" });
  };

  return (
    <div className="bg-white dark:bg-gray-950">
      {/* Hero */}
      <section className="relative bg-gradient-to-b from-indigo-50/50 via-white to-white dark:from-gray-900 dark:via-gray-950 dark:to-gray-950">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-12 left-[15%] w-3 h-3 rounded-full bg-yellow-400/60 animate-bounce" style={{ animationDelay: "0s", animationDuration: "3s" }} />
          <div className="absolute top-20 right-[20%] w-4 h-4 rotate-45 bg-pink-400/50 animate-bounce" style={{ animationDelay: "0.5s", animationDuration: "4s" }} />
          <div className="absolute top-32 left-[10%] w-3 h-3 bg-blue-400/40 rotate-12 animate-bounce" style={{ animationDelay: "1s", animationDuration: "3.5s" }} />
          <div className="absolute top-16 right-[10%] w-3 h-3 rounded-full bg-purple-400/50 animate-bounce" style={{ animationDelay: "1.5s", animationDuration: "4.5s" }} />
          <div className="absolute top-28 right-[30%] w-2 h-2 bg-green-400/50 rotate-45 animate-bounce" style={{ animationDelay: "2s", animationDuration: "3.2s" }} />
        </div>

        <div className="relative mx-auto max-w-[900px] px-6 pt-16 pb-10 text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-[56px] font-extrabold text-gray-900 dark:text-white leading-tight">
            Free Tools to Make{" "}
            <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Everything
            </span>
            {" "}Simple
          </h1>

          <p className="mt-4 text-base text-gray-500 dark:text-gray-400 max-w-lg mx-auto">
            We offer PDF, video, image and other online tools to make your life easier
          </p>

          {/* Search */}
          <div className="relative mt-8 max-w-[600px] mx-auto z-[100]">
            <div className={`flex items-center gap-3 h-[56px] pl-5 pr-2 rounded-2xl bg-white dark:bg-gray-900 border transition-all shadow-lg ${
              focused ? "border-indigo-400 dark:border-indigo-500 shadow-indigo-100/50 dark:shadow-indigo-900/30" : "border-gray-200 dark:border-gray-700"
            }`}>
              <svg className="w-5 h-5 text-gray-400 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
              <input
                type="text"
                placeholder="Search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onFocus={() => setFocused(true)}
                onBlur={() => setTimeout(() => setFocused(false), 200)}
                className="flex-1 bg-transparent text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-400 focus:outline-none"
              />
              <button className="shrink-0 h-10 px-6 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-semibold transition-colors">
                Search
              </button>
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
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Category Horizontal Scroll Cards */}
      <section className="mx-auto max-w-6xl px-4 mt-6 mb-10">
        <div
          className="flex gap-4 overflow-x-auto pb-2 pr-4"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {CAT_CARDS.map(({ cat, icon, bg, label, solve }) => {
            const tools = getToolsByCategory(cat);
            const featured = tools.filter((t) => t.featured).slice(0, 2);

            return (
              <Link
                key={cat}
                href={`/${cat}`}
                className={`shrink-0 w-[220px] lg:w-auto lg:flex-1 rounded-[18px] p-6 ${bg} text-white hover:-translate-y-1 hover:shadow-xl transition-all duration-300 group relative`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-xl">
                    {icon}
                  </div>
                  <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-white/20">
                    {tools.length}+ tools
                  </span>
                </div>
                <h3 className="text-base font-bold">{label}</h3>
                <p className="text-xs text-white/70 mt-0.5">{solve}</p>

                {featured.length > 0 && (
                  <div className="mt-4 pt-3 border-t border-white/20">
                    <p className="text-[10px] text-white/50 italic">
                      Featured Tool: <span className="text-white/80">{featured[0].name}</span>
                    </p>
                  </div>
                )}

                <div className="absolute bottom-4 right-4 w-7 h-7 rounded-full bg-white/20 flex items-center justify-center group-hover:bg-white/30 transition-colors">
                  <svg className="w-3.5 h-3.5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m9 18 6-6-6-6"/></svg>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Stats */}
      <section className="mx-auto max-w-4xl px-4 py-6">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
          {STATS.map((s) => (
            <div key={s.label}>
              <p className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">{s.num}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Our Most Popular Tools */}
      <section className="mx-auto max-w-[1000px] px-4 py-12">
        <h2 className="text-2xl sm:text-[32px] font-bold text-center text-gray-900 dark:text-white">
          Our Most Popular Tools
        </h2>
        <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-2 mb-8">
          We present the best of the best. All free, no catch
        </p>

        {/* Tab Filter */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {TAB_ITEMS.map(({ id, label, icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full text-sm font-medium transition-all ${
                activeTab === id
                  ? "bg-indigo-500 text-white shadow-md"
                  : "text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
              }`}
            >
              <span className="text-base">{icon}</span>
              {label}
            </button>
          ))}
        </div>

        {/* 4-Column Tool Grid with Ad Space */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {popularTools.slice(0, 8).map((t) => (
            <Link
              key={`${t.category}-${t.slug}`}
              href={`/${t.category}/${t.slug}`}
              className="relative flex items-start gap-3 px-4 py-4 rounded-[14px] border border-gray-200 dark:border-gray-800 hover:border-indigo-300 dark:hover:border-indigo-700 hover:shadow-md hover:-translate-y-0.5 transition-all group bg-white dark:bg-gray-900"
            >
              <div className="w-11 h-11 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-xl shrink-0">
                {t.icon}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-gray-800 dark:text-gray-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                  {t.name}
                </p>
                <p className={`text-xs font-medium mt-0.5 ${CAT_COLORS[t.category]}`}>
                  {CATEGORIES[t.category].label} Tools
                </p>
                <p className="text-xs text-gray-400 mt-1 line-clamp-2">{t.description}</p>
              </div>
              <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-indigo-400" />
              </div>
            </Link>
          ))}
        </div>

        {/* Ad Placeholder Space */}
        <div className="my-4 min-h-[90px] flex items-center justify-center rounded-xl bg-gray-50 dark:bg-gray-900 border border-dashed border-gray-200 dark:border-gray-800">
          <p className="text-xs text-gray-300 dark:text-gray-700">Ad Space</p>
        </div>

        {/* Remaining Tools */}
        {popularTools.length > 8 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {popularTools.slice(8).map((t) => (
              <Link
                key={`${t.category}-${t.slug}-2`}
                href={`/${t.category}/${t.slug}`}
                className="relative flex items-start gap-3 px-4 py-4 rounded-[14px] border border-gray-200 dark:border-gray-800 hover:border-indigo-300 dark:hover:border-indigo-700 hover:shadow-md hover:-translate-y-0.5 transition-all group bg-white dark:bg-gray-900"
              >
                <div className="w-11 h-11 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-xl shrink-0">
                  {t.icon}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-gray-800 dark:text-gray-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    {t.name}
                  </p>
                  <p className={`text-xs font-medium mt-0.5 ${CAT_COLORS[t.category]}`}>
                    {CATEGORIES[t.category].label} Tools
                  </p>
                  <p className="text-xs text-gray-400 mt-1 line-clamp-2">{t.description}</p>
                </div>
                <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-indigo-400" />
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* All Tools Button */}
        <div className="mt-8 text-center">
          <Link
            href={activeTab === "all" ? "/pdf" : `/${activeTab}`}
            className="inline-flex items-center gap-1 px-6 py-2.5 rounded-full border border-gray-300 dark:border-gray-700 text-sm font-medium text-gray-600 dark:text-gray-300 hover:border-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors"
          >
            All Tools
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m9 18 6-6-6-6"/></svg>
          </Link>
        </div>
      </section>

      {/* Free Tools You'd Usually Pay For */}
      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white">
              Free Tools You&apos;d Usually Pay For
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
              No Limits, No Sign-Up. Here&apos;s our featured tools
            </p>
          </div>
          <div className="hidden sm:flex items-center gap-2">
            <button
              onClick={() => scrollCarousel("left")}
              className="w-10 h-10 rounded-full border border-gray-200 dark:border-gray-700 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:border-gray-300 transition-colors"
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
          className="flex gap-5 overflow-x-auto pb-4 snap-x snap-mandatory"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {featuredTools.map((t) => (
            <Link
              key={`feat-${t.category}-${t.slug}`}
              href={`/${t.category}/${t.slug}`}
              className="shrink-0 w-[360px] sm:w-[400px] snap-start rounded-[18px] border border-gray-200 dark:border-gray-800 hover:border-indigo-300 dark:hover:border-indigo-700 hover:shadow-lg hover:-translate-y-0.5 transition-all flex overflow-hidden bg-white dark:bg-gray-900 group"
            >
              <div className="flex-1 p-6">
                <h3 className="font-bold text-gray-800 dark:text-gray-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors text-base">
                  {t.name}
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 line-clamp-2 leading-relaxed">
                  {t.description}
                </p>
                <p className="text-sm font-medium text-indigo-500 mt-4 inline-flex items-center gap-1 group-hover:gap-2 transition-all">
                  Learn more
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m9 18 6-6-6-6"/></svg>
                </p>
              </div>
              <div className="w-36 bg-gray-50 dark:bg-gray-800 flex items-center justify-center shrink-0">
                <span className="text-5xl">{t.icon}</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Premium CTA */}
      <section className="mx-auto max-w-6xl px-4 pb-16">
        <div className="bg-gradient-to-r from-gray-900 to-gray-800 dark:from-gray-800 dark:to-gray-700 rounded-3xl px-8 sm:px-16 py-12 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">
            Ready to Get Started?
          </h2>
          <p className="text-gray-400 mb-8 max-w-md mx-auto text-sm">
            No sign-up required. Just pick a tool and start working. It&apos;s that simple.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/pdf"
              className="inline-flex px-8 py-3 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white font-semibold transition-colors"
            >
              Try PDF Tools
            </Link>
            <Link
              href="/pricing"
              className="inline-flex px-8 py-3 rounded-xl border border-gray-600 text-gray-300 hover:text-white hover:border-gray-400 font-semibold transition-colors"
            >
              View Pricing
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
