"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";

const QUICK_ACTIONS = [
  { href: "/content-machine/generate-article", icon: "✍️", title: "Generate Article", desc: "Create a full SEO article from a title" },
  { href: "/content-machine/topic-ideas", icon: "💡", title: "Topic Ideas", desc: "Get AI-powered topic suggestions" },
  { href: "/content-machine/batch-generator", icon: "⚡", title: "Batch Generator", desc: "Generate multiple articles at once" },
  { href: "/content-machine/my-content", icon: "📁", title: "My Content", desc: "View and manage your generated content" },
];

const FEATURES = [
  { icon: "🎯", title: "SEO Optimized", desc: "Content crafted for search engine visibility" },
  { icon: "🖼️", title: "Featured Images", desc: "AI generates unique featured images" },
  { icon: "📝", title: "Multiple Styles", desc: "Choose from professional, casual, academic and more" },
  { icon: "🌐", title: "WordPress Ready", desc: "Publish directly to your WordPress site" },
];

export default function ContentMachineDashboard() {
  const { data: session } = useSession();
  const userPlan = (session?.user as Record<string, unknown>)?.plan as string || "free";

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Content Machine</h1>
        <p className="text-gray-500 dark:text-gray-400">
          Let AI create SEO-optimized content at scale. Generate articles, blog posts, and more.
        </p>
      </div>

      {userPlan === "free" && (
        <div className="mb-8 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold mb-1">Upgrade to unlock Content Machine</h2>
              <p className="text-indigo-100 text-sm">Get unlimited article generation, batch processing, and more.</p>
            </div>
            <Link href="/pricing" className="shrink-0 px-5 py-2.5 bg-white text-indigo-600 rounded-xl font-semibold text-sm hover:bg-gray-50 transition-colors">
              Upgrade Now
            </Link>
          </div>
        </div>
      )}

      {/* Quick actions */}
      <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Quick Actions</h2>
      <div className="grid sm:grid-cols-2 gap-4 mb-10">
        {QUICK_ACTIONS.map((action) => (
          <Link
            key={action.href}
            href={action.href}
            className="flex items-start gap-4 p-5 bg-white dark:bg-[#1e2024] rounded-xl border border-gray-200 dark:border-gray-800 hover:border-indigo-300 dark:hover:border-indigo-700 hover:shadow-md transition-all group"
          >
            <span className="text-2xl shrink-0 mt-0.5">{action.icon}</span>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{action.title}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{action.desc}</p>
            </div>
          </Link>
        ))}
      </div>

      {/* Features */}
      <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Features</h2>
      <div className="grid sm:grid-cols-2 gap-4">
        {FEATURES.map((f) => (
          <div key={f.title} className="flex items-start gap-3 p-4 bg-white dark:bg-[#1e2024] rounded-xl border border-gray-200 dark:border-gray-800">
            <span className="text-xl shrink-0">{f.icon}</span>
            <div>
              <h3 className="font-medium text-gray-900 dark:text-white text-sm">{f.title}</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{f.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
