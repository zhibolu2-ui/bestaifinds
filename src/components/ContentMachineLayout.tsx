"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { useState } from "react";

const NAV_SECTIONS = [
  {
    title: "Content Generation",
    items: [
      { href: "/content-machine", label: "Dashboard", icon: "📊" },
      { href: "/content-machine/generate-article", label: "Generate Article", icon: "✍️" },
      { href: "/content-machine/my-content", label: "My Content", icon: "📁" },
      { href: "/content-machine/batch-generator", label: "Batch Generator", icon: "⚡" },
    ],
  },
  {
    title: "Research",
    items: [
      { href: "/content-machine/topic-ideas", label: "Topic Ideas", icon: "💡" },
    ],
  },
  {
    title: "Integration",
    items: [
      { href: "#", label: "WordPress", icon: "🔗", soon: true },
      { href: "#", label: "Webflow", icon: "🌐", soon: true },
    ],
  },
];

function SidebarContent({ onClose }: { onClose?: () => void }) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const userPlan = (session?.user as Record<string, unknown>)?.plan as string || "free";

  return (
    <>
      {userPlan === "free" && (
        <div className="mb-4 px-3 py-2.5 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800/40">
          <div className="flex items-center gap-1.5 mb-1">
            <span className="text-green-600 dark:text-green-400 text-xs font-semibold">Credits: 0</span>
          </div>
          <Link href="/pricing" onClick={onClose} className="text-xs text-blue-500 hover:text-blue-600 font-semibold">
            Upgrade Now →
          </Link>
        </div>
      )}

      {NAV_SECTIONS.map((section) => (
        <div key={section.title} className="mb-4">
          <p className="px-3 mb-1 text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
            {section.title}
          </p>
          {section.items.map((item) => {
            const active = pathname === item.href;
            const isSoon = (item as { soon?: boolean }).soon;
            return (
              <Link
                key={item.href + item.label}
                href={isSoon ? "#" : item.href}
                onClick={!isSoon ? onClose : undefined}
                className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors mb-0.5 ${
                  active
                    ? "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-semibold"
                    : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800"
                } ${isSoon ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                <span className="text-base">{item.icon}</span>
                <span>{item.label}</span>
                {isSoon && (
                  <span className="ml-auto text-[9px] px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-700 text-gray-400 font-medium">Soon</span>
                )}
              </Link>
            );
          })}
        </div>
      ))}
    </>
  );
}

export default function ContentMachineLayout({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-[calc(100vh-3.5rem)] bg-[#f7f7f8] dark:bg-[#16181c] flex">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col w-56 shrink-0 bg-white dark:bg-[#1e2024] border-r border-gray-200 dark:border-gray-800 px-3 py-4 sticky top-14 h-[calc(100vh-3.5rem)] overflow-y-auto">
        <SidebarContent />
      </aside>

      {/* Mobile sidebar toggle */}
      <button
        className="lg:hidden fixed bottom-4 left-4 z-40 w-12 h-12 rounded-full bg-blue-500 text-white shadow-lg flex items-center justify-center hover:bg-blue-600 transition-colors"
        onClick={() => setMobileOpen(true)}
      >
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 6h16M4 12h16M4 18h16"/></svg>
      </button>

      {/* Mobile sidebar overlay */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/40" onClick={() => setMobileOpen(false)} />
          <div className="relative w-64 bg-white dark:bg-[#1e2024] p-4 shadow-2xl overflow-y-auto">
            <button
              onClick={() => setMobileOpen(false)}
              className="absolute top-3 right-3 p-1 text-gray-400 hover:text-gray-600"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6 6 18M6 6l12 12"/></svg>
            </button>
            <SidebarContent onClose={() => setMobileOpen(false)} />
          </div>
        </div>
      )}

      {/* Main content */}
      <main className="flex-1 min-w-0 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
