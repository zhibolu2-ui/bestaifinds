"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { CATEGORIES, Category, TOOLS } from "@/lib/tools";
import ThemeToggle from "./ThemeToggle";
import ShareButton from "./ShareButton";
import SignInModal from "./SignInModal";

const NAV_ITEMS: { cat: Category; icon: string; color: string }[] = [
  { cat: "pdf", icon: "📄", color: "hover:text-red-500" },
  { cat: "image", icon: "🖼️", color: "hover:text-blue-500" },
  { cat: "write", icon: "✍️", color: "hover:text-emerald-500" },
  { cat: "video", icon: "🎬", color: "hover:text-purple-500" },
  { cat: "file", icon: "📁", color: "hover:text-amber-500" },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [signInOpen, setSignInOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [scrolled, setScrolled] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setSearchOpen(false);
      }
    }
    function onScroll() {
      setScrolled(window.scrollY > 10);
    }
    document.addEventListener("mousedown", onClickOutside);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      document.removeEventListener("mousedown", onClickOutside);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  const filtered = query.length > 0
    ? TOOLS.filter(
        (t) =>
          t.name.toLowerCase().includes(query.toLowerCase()) ||
          t.description.toLowerCase().includes(query.toLowerCase()),
      ).slice(0, 8)
    : [];

  return (
    <>
      <header className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/90 dark:bg-gray-950/90 backdrop-blur-xl shadow-sm border-b border-gray-200 dark:border-gray-800"
          : "bg-white dark:bg-gray-950 border-b border-gray-100 dark:border-gray-900"
      }`}>
        <nav className="mx-auto max-w-6xl px-4 flex items-center justify-between h-14">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <span className="text-white font-bold text-sm">B</span>
            </div>
            <span className="font-bold text-lg tracking-tight text-gray-900 dark:text-white">
              Best<span className="text-indigo-500">AI</span>Finds
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-0.5">
            {NAV_ITEMS.map(({ cat, icon, color }) => (
              <Link
                key={cat}
                href={`/${cat}`}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-300 ${color} transition-colors`}
              >
                <span className="text-base">{icon}</span>
                {CATEGORIES[cat].label}
              </Link>
            ))}
          </div>

          {/* Right side actions */}
          <div className="flex items-center gap-1">
            {/* Search */}
            <div ref={searchRef} className="relative">
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className="p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                aria-label="Search"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
              </button>

              {searchOpen && (
                <div className="absolute right-0 top-12 w-80 bg-white dark:bg-gray-900 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 p-3 z-50">
                  <input
                    type="text"
                    autoFocus
                    placeholder={`Search ${TOOLS.length}+ tools...`}
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-300 dark:focus:ring-indigo-600 focus:border-transparent placeholder:text-gray-400"
                  />
                  {filtered.length > 0 && (
                    <ul className="mt-2 max-h-64 overflow-y-auto divide-y divide-gray-100 dark:divide-gray-800">
                      {filtered.map((t) => (
                        <li key={`${t.category}-${t.slug}`}>
                          <Link
                            href={`/${t.category}/${t.slug}`}
                            onClick={() => { setSearchOpen(false); setQuery(""); }}
                            className="flex items-center gap-3 px-2 py-2.5 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                          >
                            <span className="text-lg">{t.icon}</span>
                            <div className="min-w-0 flex-1">
                              <p className="text-sm font-medium text-gray-800 dark:text-gray-100">{t.name}</p>
                              <p className="text-xs text-gray-400 line-clamp-1">{t.description}</p>
                            </div>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                  {query.length > 0 && filtered.length === 0 && (
                    <p className="mt-3 text-xs text-gray-400 text-center py-4">No tools found</p>
                  )}
                </div>
              )}
            </div>

            <ThemeToggle />
            <ShareButton />

            <button
              onClick={() => setSignInOpen(true)}
              className="hidden sm:inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-medium transition-colors ml-1"
            >
              Sign In
            </button>

            {/* Mobile hamburger */}
            <button
              className="md:hidden p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Menu"
            >
              {mobileOpen ? (
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
              ) : (
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 12h16"/><path d="M4 6h16"/><path d="M4 18h16"/></svg>
              )}
            </button>
          </div>
        </nav>

        {/* Mobile drawer */}
        {mobileOpen && (
          <div className="md:hidden border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-950 px-4 pb-4 pt-2 space-y-1">
            {NAV_ITEMS.map(({ cat, icon }) => (
              <Link
                key={cat}
                href={`/${cat}`}
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                <span className="text-lg">{icon}</span>
                {CATEGORIES[cat].label} Tools
              </Link>
            ))}
            <div className="pt-2 border-t border-gray-100 dark:border-gray-800">
              <button
                onClick={() => { setMobileOpen(false); setSignInOpen(true); }}
                className="w-full flex items-center justify-center px-4 py-2.5 rounded-lg bg-indigo-500 text-white text-sm font-medium"
              >
                Sign In
              </button>
            </div>
          </div>
        )}
      </header>

      <SignInModal open={signInOpen} onClose={() => setSignInOpen(false)} />
    </>
  );
}
