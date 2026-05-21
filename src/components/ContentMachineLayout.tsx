"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";

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

export default function ContentMachineLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const userPlan = (session?.user as Record<string, unknown>)?.plan as string || "free";

  return (
    <div className="min-h-screen bg-[#f7f7f8] dark:bg-[#16181c] flex">
      {/* Sidebar */}
      <aside className="hidden lg:flex flex-col w-56 shrink-0 bg-white dark:bg-[#1e2024] border-r border-gray-200 dark:border-gray-800 px-3 py-5">
        {userPlan === "free" && (
          <div className="mb-4 px-3 py-2 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
            <p className="text-xs text-amber-700 dark:text-amber-400 font-medium">Credits: 0</p>
            <Link href="/pricing" className="text-xs text-indigo-500 hover:text-indigo-600 font-semibold">
              Upgrade Now →
            </Link>
          </div>
        )}

        {NAV_SECTIONS.map((section) => (
          <div key={section.title} className="mb-5">
            <p className="px-3 mb-1.5 text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
              {section.title}
            </p>
            {section.items.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href + item.label}
                  href={(item as { soon?: boolean }).soon ? "#" : item.href}
                  className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors mb-0.5 ${
                    active
                      ? "bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 font-semibold"
                      : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800"
                  } ${(item as { soon?: boolean }).soon ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  <span className="text-base">{item.icon}</span>
                  <span>{item.label}</span>
                  {(item as { soon?: boolean }).soon && (
                    <span className="ml-auto text-[9px] px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-700 text-gray-400 font-medium">Soon</span>
                  )}
                </Link>
              );
            })}
          </div>
        ))}
      </aside>

      {/* Main content */}
      <main className="flex-1 min-w-0 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
