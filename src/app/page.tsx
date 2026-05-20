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

/* ── Category cards ── */
const CAT_CARDS: { cat: Category; icon: string; bg: string; label: string; solve: string }[] = [
  { cat: "pdf", icon: "📄", bg: "bg-[#764FE5]", label: "PDF Tools", solve: "Solve Your PDF Problems" },
  { cat: "image", icon: "🖼️", bg: "bg-[#E54F6D]", label: "Image Tools", solve: "Solve Your Image Problems" },
  { cat: "video", icon: "🎬", bg: "bg-[#E5854F]", label: "Video Tools", solve: "Solve Your Video Problems" },
  { cat: "write", icon: "✍️", bg: "bg-[#6ECA1C]", label: "AI Write", solve: "Solve Your Text Problems" },
  { cat: "file", icon: "📁", bg: "bg-[#1A8FE3]", label: "File Tools", solve: "Solve Your File Problems" },
];

/* ── Tabs ── */
const TAB_ITEMS: { id: Category | "all"; label: string; icon: string }[] = [
  { id: "all", label: "All Tools", icon: "🔧" },
  { id: "pdf", label: "Pdf Tools", icon: "📄" },
  { id: "video", label: "Video Tools", icon: "🎬" },
  { id: "image", label: "Image Tools", icon: "🖼️" },
  { id: "file", label: "Converter Tools", icon: "📁" },
  { id: "write", label: "AI Write", icon: "✍️" },
];

/* ── Category icon colors ── */
const CAT_ICON_BG: Record<Category, string> = {
  pdf: "bg-[#764FE5]/15",
  image: "bg-[#E54F6D]/15",
  write: "bg-[#6ECA1C]/15",
  video: "bg-[#E5854F]/15",
  file: "bg-[#1A8FE3]/15",
};

const CAT_TAG_COLOR: Record<Category, string> = {
  pdf: "text-[#764FE5]",
  image: "text-[#E54F6D]",
  write: "text-[#6ECA1C]",
  video: "text-[#E5854F]",
  file: "text-[#1A8FE3]",
};

const CAT_DOT_COLOR: Record<Category, string> = {
  pdf: "bg-[#764FE5]",
  image: "bg-[#E54F6D]",
  write: "bg-[#6ECA1C]",
  video: "bg-[#E5854F]",
  file: "bg-[#1A8FE3]",
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

  /* ── Tool card (reusable) ── */
  const ToolCard = ({ t }: { t: typeof TOOLS[number] }) => (
    <Link
      key={`${t.category}-${t.slug}`}
      href={`/${t.category}/${t.slug}`}
      className="relative flex items-start gap-4 px-5 py-5 rounded-2xl border border-gray-100 dark:border-gray-800/60 hover:border-[#1A8FE3]/40 dark:hover:border-[#1A8FE3]/40 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 group bg-white dark:bg-[#1e2024]"
    >
      <div className={`w-12 h-12 rounded-xl ${CAT_ICON_BG[t.category]} flex items-center justify-center text-2xl shrink-0`}>
        {t.icon}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[15px] font-semibold text-gray-900 dark:text-white leading-tight group-hover:text-[#1A8FE3] transition-colors">
          {t.name}
        </p>
        <p className={`text-xs font-medium mt-1 ${CAT_TAG_COLOR[t.category]}`}>
          {CATEGORIES[t.category].label} Tools
        </p>
        <p className="text-[13px] text-gray-500 dark:text-gray-400 mt-1.5 leading-relaxed line-clamp-2">
          {t.description}
        </p>
      </div>
      <div className={`absolute top-4 right-4 w-3 h-3 rounded-full ${CAT_DOT_COLOR[t.category]} opacity-60`} />
    </Link>
  );

  return (
    <div className="bg-[#f7f7f8] dark:bg-[#16181c]">
      {/* ═══ Hero ═══ */}
      <section className="relative bg-white dark:bg-[#16181c]">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-16 left-[12%] w-3.5 h-3.5 rounded-full bg-yellow-400/60 animate-bounce" style={{ animationDuration: "3s" }} />
          <div className="absolute top-24 right-[18%] w-4 h-4 rotate-45 bg-pink-400/50 animate-bounce" style={{ animationDelay: "0.5s", animationDuration: "4s" }} />
          <div className="absolute top-36 left-[8%] w-3.5 h-3.5 bg-blue-400/40 rotate-12 animate-bounce" style={{ animationDelay: "1s", animationDuration: "3.5s" }} />
          <div className="absolute top-20 right-[8%] w-3 h-3 rounded-full bg-purple-400/50 animate-bounce" style={{ animationDelay: "1.5s", animationDuration: "4.5s" }} />
          <div className="absolute top-32 right-[28%] w-2.5 h-2.5 bg-green-400/50 rotate-45 animate-bounce" style={{ animationDelay: "2s", animationDuration: "3.2s" }} />
        </div>

        <div className="relative mx-auto max-w-[900px] px-6 pt-14 pb-8 text-center">
          <h1 className="text-[40px] sm:text-[48px] lg:text-[56px] font-extrabold text-gray-900 dark:text-white leading-[1.15] tracking-tight">
            Free Tools to Make{" "}
            <span className="text-[#1A8FE3]">Everything</span>
            {" "}Simple
          </h1>

          <p className="mt-4 text-[16px] text-gray-500 dark:text-gray-400 max-w-lg mx-auto leading-relaxed">
            We offer PDF, video, image and other online tools to make your life easier
          </p>

          {/* Search */}
          <div className="relative mt-8 max-w-[600px] mx-auto z-[100]">
            <div className={`flex items-center gap-3 h-[56px] pl-5 pr-2 rounded-full bg-white dark:bg-[#1e2024] border transition-all shadow-[3px_10px_40px_rgba(24,29,32,0.05)] dark:shadow-none ${
              focused
                ? "border-[#1A8FE3] ring-2 ring-[#1A8FE3]/20"
                : "border-gray-200 dark:border-gray-700"
            }`}>
              <svg className="w-5 h-5 text-gray-400 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
              <input
                type="text"
                placeholder="Search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onFocus={() => setFocused(true)}
                onBlur={() => setTimeout(() => setFocused(false), 200)}
                className="flex-1 bg-transparent text-[15px] text-gray-900 dark:text-gray-100 placeholder:text-gray-400 focus:outline-none"
              />
              <button className="shrink-0 h-10 px-7 rounded-full bg-[#1A8FE3] hover:bg-[#1580d0] text-white text-sm font-semibold transition-colors">
                Search
              </button>
            </div>
            {filtered.length > 0 && focused && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-[#1e2024] rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-700 py-2 z-[200] max-h-96 overflow-y-auto">
                {filtered.map((t) => (
                  <Link
                    key={`${t.category}-${t.slug}`}
                    href={`/${t.category}/${t.slug}`}
                    className="flex items-center gap-3 px-5 py-3 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                  >
                    <span className="text-lg">{t.icon}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-semibold text-gray-800 dark:text-gray-100">{t.name}</p>
                        <span className={`shrink-0 text-[10px] font-semibold uppercase ${CAT_TAG_COLOR[t.category]}`}>{t.category}</span>
                      </div>
                      <p className="text-xs text-gray-400 truncate mt-0.5">{t.description}</p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ═══ Category Horizontal Scroll ═══ */}
      <section className="mx-auto max-w-6xl px-4 mt-4 mb-10">
        <div className="flex gap-4 overflow-x-auto pb-2 lg:grid lg:grid-cols-5" style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}>
          {CAT_CARDS.map(({ cat, icon, bg, label, solve }) => {
            const tools = getToolsByCategory(cat);
            const featured = tools.filter((t) => t.featured).slice(0, 1);
            return (
              <Link
                key={cat}
                href={`/${cat}`}
                className={`shrink-0 w-[220px] lg:w-auto rounded-[18px] p-6 ${bg} text-white hover:-translate-y-1 hover:shadow-xl transition-all duration-300 group relative`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-xl">{icon}</div>
                  <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-white/20">{tools.length}+ tools</span>
                </div>
                <h3 className="text-[16px] font-bold">{label}</h3>
                <p className="text-[13px] text-white/70 mt-0.5">{solve}</p>
                {featured.length > 0 && (
                  <div className="mt-4 pt-3 border-t border-white/20 flex items-center justify-between">
                    <span className="text-[11px] text-white/50">Featured Tool:</span>
                    <span className="text-[11px] text-white/90 font-medium px-2.5 py-1 rounded-full bg-white/10">{featured[0].name}</span>
                  </div>
                )}
                <div className="absolute bottom-4 right-4 w-8 h-8 rounded-full bg-white/20 flex items-center justify-center group-hover:bg-white/30 transition-colors">
                  <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m9 18 6-6-6-6"/></svg>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* ═══ Stats (TinyWow style with dividers) ═══ */}
      <section className="mx-auto max-w-5xl px-4 py-8 mb-4">
        <div className="rounded-2xl bg-[#1e2428] dark:bg-[#1e2428] border border-gray-700/30 px-8 py-6">
          <div className="flex items-center justify-between">
            {[
              { num: "1m", label: "Active\nUsers" },
              { num: "10m", label: "Files\nConverted" },
              { num: "200+", label: "Online\nTools" },
              { num: "500k", label: "PDFs\nCreated" },
            ].map((s, i) => (
              <div key={s.label} className="flex items-center gap-6">
                {i > 0 && <div className="hidden sm:block w-px h-12 bg-gray-600/40" />}
                <div className="flex items-center gap-3 sm:gap-4">
                  <p className="text-[32px] sm:text-[40px] font-bold text-white italic tracking-tight">{s.num}</p>
                  <p className="text-[12px] sm:text-[13px] text-gray-400 leading-tight whitespace-pre-line">{s.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ Our Most Popular Tools ═══ */}
      <section className="mx-auto max-w-[1100px] px-4 py-12">
        <h2 className="text-[28px] sm:text-[36px] font-bold text-center text-gray-900 dark:text-white leading-tight">
          Our Most Popular Tools
        </h2>
        <p className="text-center text-[15px] text-gray-500 dark:text-gray-400 mt-3 mb-8">
          We present the best of the best. All free, no catch
        </p>

        {/* Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {TAB_ITEMS.map(({ id, label, icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full text-[14px] font-medium transition-all duration-200 ${
                activeTab === id
                  ? "bg-[#1A8FE3] text-white shadow-md shadow-[#1A8FE3]/25"
                  : "text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-[#1e2024]"
              }`}
            >
              <span className="text-[15px]">{icon}</span>
              {label}
            </button>
          ))}
        </div>

        {/* 4-col grid — first 8 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {popularTools.slice(0, 8).map((t) => <ToolCard key={`${t.category}-${t.slug}`} t={t} />)}
        </div>

        {/* Ad space */}
        <div className="my-6 min-h-[90px] rounded-2xl bg-gray-50 dark:bg-[#1e2024]" />

        {/* 4-col grid — remaining */}
        {popularTools.length > 8 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {popularTools.slice(8).map((t) => <ToolCard key={`${t.category}-${t.slug}-2`} t={t} />)}
          </div>
        )}

        {/* All Tools button */}
        <div className="mt-10 text-center">
          <Link
            href={activeTab === "all" ? "/pdf" : `/${activeTab}`}
            className="inline-flex items-center gap-1.5 px-7 py-3 rounded-full border border-gray-300 dark:border-gray-700 text-[14px] font-medium text-gray-600 dark:text-gray-300 hover:border-[#1A8FE3] hover:text-[#1A8FE3] transition-colors"
          >
            All {activeTab === "all" ? "Tools" : CATEGORIES[activeTab].label}
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m9 18 6-6-6-6"/></svg>
          </Link>
        </div>
      </section>

      {/* ═══ Featured Carousel ═══ */}
      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-gray-400 dark:text-gray-500 mb-2">
              NO LIMITS, NO SIGN-UP
            </p>
            <h2 className="text-[24px] sm:text-[32px] font-bold text-gray-900 dark:text-white leading-tight">
              Free Tools You&apos;d Usually Pay For
            </h2>
            <p className="text-[14px] text-gray-500 dark:text-gray-400 mt-2">
              Here&apos;s our featured tools
            </p>
          </div>
          <div className="hidden sm:flex items-center gap-2">
            <button onClick={() => scrollCarousel("left")} className="w-10 h-10 rounded-full border border-gray-200 dark:border-gray-700 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:border-gray-300 transition-colors">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m15 18-6-6 6-6"/></svg>
            </button>
            <button onClick={() => scrollCarousel("right")} className="w-10 h-10 rounded-full bg-[#1A8FE3] text-white flex items-center justify-center hover:bg-[#1580d0] transition-colors">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m9 18 6-6-6-6"/></svg>
            </button>
          </div>
        </div>

        <div ref={carouselRef} className="flex gap-5 overflow-x-auto pb-4 snap-x snap-mandatory" style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}>
          {featuredTools.map((t) => (
            <Link
              key={`feat-${t.category}-${t.slug}`}
              href={`/${t.category}/${t.slug}`}
              className="shrink-0 w-[340px] sm:w-[380px] snap-start rounded-2xl border border-gray-100 dark:border-gray-800/60 hover:border-[#1A8FE3]/40 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 flex overflow-hidden bg-white dark:bg-[#1e2024] group"
            >
              <div className="flex-1 p-6">
                <h3 className="text-[16px] font-bold text-gray-900 dark:text-white group-hover:text-[#1A8FE3] transition-colors leading-tight">
                  {t.name}
                </h3>
                <p className="text-[13px] text-gray-500 dark:text-gray-400 mt-2 line-clamp-2 leading-relaxed">
                  {t.description}
                </p>
                <p className="text-[14px] font-medium text-[#1A8FE3] mt-4 inline-flex items-center gap-1 group-hover:gap-2 transition-all">
                  Learn more
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m9 18 6-6-6-6"/></svg>
                </p>
              </div>
              <div className={`w-36 ${CAT_ICON_BG[t.category]} flex items-center justify-center shrink-0`}>
                <span className="text-5xl">{t.icon}</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ═══ CTA ═══ */}
      <section className="mx-auto max-w-6xl px-4 pb-16">
        <div className="bg-gradient-to-r from-gray-900 to-gray-800 dark:from-[#1e2024] dark:to-[#252830] rounded-3xl px-8 sm:px-16 py-14 text-center">
          <h2 className="text-[24px] sm:text-[32px] font-bold text-white mb-3">
            Ready to Get Started?
          </h2>
          <p className="text-gray-400 mb-8 max-w-md mx-auto text-[14px]">
            No sign-up required. Just pick a tool and start working. It&apos;s that simple.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link href="/pdf" className="inline-flex px-8 py-3 rounded-full bg-[#1A8FE3] hover:bg-[#1580d0] text-white font-semibold transition-colors">
              Try PDF Tools
            </Link>
            <Link href="/pricing" className="inline-flex px-8 py-3 rounded-full border border-gray-600 text-gray-300 hover:text-white hover:border-gray-400 font-semibold transition-colors">
              View Pricing
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
