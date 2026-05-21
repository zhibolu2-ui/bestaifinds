"use client";

import Link from "next/link";
import { useState, useRef, useEffect, useCallback } from "react";
import { useSession, signOut } from "next-auth/react";
import { CATEGORIES, Category, TOOLS, getToolsByCategory } from "@/lib/tools";
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

function MegaMenu({ cat, onEnter, onLeave }: { cat: Category; onEnter: () => void; onLeave: () => void }) {
  const tools = getToolsByCategory(cat);
  const featured = tools.filter((t) => t.featured);
  const others = tools.filter((t) => !t.featured);

  return (
    <div
      className="absolute left-0 right-0 top-full bg-white dark:bg-gray-950 border-b border-gray-200 dark:border-gray-800 shadow-xl z-[60]"
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
    >
      <div className="mx-auto max-w-6xl px-4 py-6">
        <div className="flex gap-8">
          {/* Featured tools - left column */}
          {featured.length > 0 && (
            <div className="w-64 shrink-0 border-r border-gray-100 dark:border-gray-800 pr-6">
              <h3 className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-3">
                Featured Tools
              </h3>
              <div className="space-y-1">
                {featured.map((t) => (
              <Link
                  key={t.slug}
                  href={`/${t.category}/${t.slug}`}
                  onClick={onLeave}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors group"
                  >
                    <span className="text-xl">{t.icon}</span>
                    <div>
                      <p className="text-sm font-semibold text-gray-800 dark:text-gray-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{t.name}</p>
                      <p className="text-xs text-gray-400 line-clamp-1">{t.description}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Other tools - right columns */}
          <div className="flex-1">
            <h3 className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-3">
              {featured.length > 0 ? `Other ${CATEGORIES[cat].label} Tools` : `All ${CATEGORIES[cat].label} Tools`}
            </h3>
            <div className="grid grid-cols-3 gap-x-6 gap-y-1">
              {(featured.length > 0 ? others : tools).map((t) => (
                <Link
                  key={t.slug}
                  href={`/${t.category}/${t.slug}`}
                  onClick={onLeave}
                  className="px-2 py-1.5 rounded-md text-sm text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
                >
                  {t.name}
                </Link>
              ))}
            </div>

            <div className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-800">
              <Link
                href={`/${cat}`}
                onClick={onLeave}
                className="inline-flex items-center gap-1 text-sm font-medium text-indigo-500 hover:text-indigo-600 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors"
              >
                All {CATEGORIES[cat].label} Tools
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m9 18 6-6-6-6"/></svg>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Navbar() {
  const { data: session } = useSession();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [signInOpen, setSignInOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const [query, setQuery] = useState("");
  const [scrolled, setScrolled] = useState(false);
  const [hoveredCat, setHoveredCat] = useState<Category | null>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const hoverTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setSearchOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
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

  const handleCatEnter = useCallback((cat: Category) => {
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    setHoveredCat(cat);
  }, []);

  const handleCatLeave = useCallback(() => {
    hoverTimeoutRef.current = setTimeout(() => setHoveredCat(null), 150);
  }, []);

  const handleMegaClose = useCallback(() => {
    setHoveredCat(null);
  }, []);

  const filtered = (() => {
    if (query.length < 1) return [];
    const q = query.toLowerCase().trim();
    const words = q.split(/\s+/).filter(Boolean);

    return TOOLS.map((t) => {
      const name = t.name.toLowerCase();
      const desc = t.description.toLowerCase();
      let score = 0;
      if (name === q) score += 100;
      else if (name.startsWith(q)) score += 60;
      else if (name.includes(q)) score += 40;
      if (desc.includes(q)) score += 20;
      for (const w of words) {
        if (name.includes(w)) score += 30;
        if (desc.includes(w)) score += 10;
      }
      return { tool: t, score };
    })
      .filter(({ score }) => score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 8)
      .map(({ tool }) => tool);
  })();

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

          {/* Desktop nav with hover mega menu */}
          <div className="hidden md:flex items-center gap-0.5">
            {NAV_ITEMS.map(({ cat, icon, color }) => (
              <div
                key={cat}
                onMouseEnter={() => handleCatEnter(cat)}
                onMouseLeave={handleCatLeave}
                className="relative"
              >
                <Link
                  href={`/${cat}`}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    hoveredCat === cat
                      ? "text-indigo-600 dark:text-indigo-400 bg-gray-50 dark:bg-gray-900"
                      : `text-gray-600 dark:text-gray-300 ${color}`
                  }`}
                >
                  <span className="text-base">{icon}</span>
                  {CATEGORIES[cat].label}
                  <svg className={`w-3 h-3 ml-0.5 transition-transform ${hoveredCat === cat ? "rotate-180" : ""}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m6 9 6 6 6-6"/></svg>
                </Link>
                {/* Invisible bridge to connect nav item to mega menu */}
                {hoveredCat === cat && <div className="absolute left-0 right-0 h-4 top-full" />}
              </div>
            ))}
          </div>

          {/* Right side actions */}
          <div className="flex items-center gap-1">
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

            {session?.user ? (
              <div ref={profileRef} className="relative hidden sm:block ml-1">
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="w-9 h-9 rounded-full bg-indigo-500 flex items-center justify-center text-white text-sm font-bold overflow-hidden ring-2 ring-transparent hover:ring-indigo-300 dark:hover:ring-indigo-600 transition-all"
                >
                  {session.user.image ? (
                    <img src={session.user.image} alt="" className="w-full h-full object-cover" />
                  ) : (
                    (session.user.name?.[0] || session.user.email?.[0] || "U").toUpperCase()
                  )}
                </button>

                {profileOpen && (
                  <div className="absolute right-0 top-12 w-56 bg-white dark:bg-gray-900 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 py-1.5 z-50">
                    <div className="px-4 py-2.5 border-b border-gray-100 dark:border-gray-800">
                      <p className="text-sm text-gray-700 dark:text-gray-300 truncate">{session.user.email}</p>
                    </div>

                    <div className="py-1 border-b border-gray-100 dark:border-gray-800">
                      <Link href="/account" onClick={() => setProfileOpen(false)} className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                        <svg className="w-4 h-4 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
                        Billing Info
                      </Link>
                      <Link href="/account?tab=favourites" onClick={() => setProfileOpen(false)} className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                        <svg className="w-4 h-4 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 21l-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>
                        Favourite Tools
                      </Link>
                      <button
                        onClick={() => {
                          const isDark = document.documentElement.classList.toggle("dark");
                          localStorage.setItem("theme", isDark ? "dark" : "light");
                          setProfileOpen(false);
                        }}
                        className="flex items-center justify-between w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                      >
                        <span className="flex items-center gap-3">
                          <svg className="w-4 h-4 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>
                          Dark Mode
                        </span>
                        <div className="w-8 h-4.5 rounded-full relative transition-colors bg-gray-300 dark:bg-indigo-500">
                          <div className="absolute top-0.5 w-3.5 h-3.5 rounded-full bg-white shadow transition-transform translate-x-0.5 dark:translate-x-3.5" />
                        </div>
                      </button>
                      <Link href="/account" onClick={() => setProfileOpen(false)} className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                        <svg className="w-4 h-4 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>
                        Settings
                      </Link>
                    </div>

                    <div className="py-1 border-b border-gray-100 dark:border-gray-800">
                      <Link href="/pricing" onClick={() => setProfileOpen(false)} className="flex items-center gap-3 px-4 py-2 text-sm text-indigo-600 dark:text-indigo-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors font-medium">
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275Z"/></svg>
                        Upgrade
                      </Link>
                    </div>

                    <div className="py-1">
                      <button
                        onClick={() => { setProfileOpen(false); signOut(); }}
                        className="flex items-center gap-3 w-full px-4 py-2 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                      >
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/></svg>
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => setSignInOpen(true)}
                className="hidden sm:inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-medium transition-colors ml-1"
              >
                Sign In
              </button>
            )}

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

        {/* Mega dropdown menu */}
        {hoveredCat && (
          <MegaMenu
            cat={hoveredCat}
            onEnter={() => handleCatEnter(hoveredCat)}
            onLeave={handleCatLeave}
          />
        )}

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
              {session?.user ? (
                <button
                  onClick={() => { setMobileOpen(false); signOut(); }}
                  className="w-full flex items-center justify-center px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 text-sm font-medium"
                >
                  Sign Out ({session.user.name || session.user.email})
                </button>
              ) : (
                <button
                  onClick={() => { setMobileOpen(false); setSignInOpen(true); }}
                  className="w-full flex items-center justify-center px-4 py-2.5 rounded-lg bg-indigo-500 text-white text-sm font-medium"
                >
                  Sign In
                </button>
              )}
            </div>
          </div>
        )}
      </header>

      <SignInModal open={signInOpen} onClose={() => setSignInOpen(false)} />
    </>
  );
}
