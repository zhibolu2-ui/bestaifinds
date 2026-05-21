"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";

export default function MyContentPage() {
  const { data: session } = useSession();

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">My Content</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">View and manage your generated articles</p>
        </div>
        <Link
          href="/content-machine/generate-article"
          className="px-4 py-2 bg-indigo-500 text-white rounded-lg text-sm font-semibold hover:bg-indigo-600 transition-colors"
        >
          + New Article
        </Link>
      </div>

      {!session?.user ? (
        <div className="bg-white dark:bg-[#1e2024] rounded-2xl border border-gray-200 dark:border-gray-800 p-12 text-center">
          <p className="text-gray-500 dark:text-gray-400 mb-4">Sign in to view your content</p>
          <Link href="/signin" className="px-5 py-2.5 bg-indigo-500 text-white rounded-lg text-sm font-semibold hover:bg-indigo-600 transition-colors">
            Sign In
          </Link>
        </div>
      ) : (
        <div className="bg-white dark:bg-[#1e2024] rounded-2xl border border-gray-200 dark:border-gray-800 p-12 text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
            <svg className="w-8 h-8 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><line x1="16" x2="8" y1="13" y2="13"/><line x1="16" x2="8" y1="17" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
          </div>
          <h3 className="font-semibold text-gray-900 dark:text-white mb-2">No content yet</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
            Generate your first article and it will appear here.
          </p>
          <Link
            href="/content-machine/generate-article"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-500 text-white rounded-lg text-sm font-semibold hover:bg-indigo-600 transition-colors"
          >
            <span>✍️</span> Generate Article
          </Link>
        </div>
      )}
    </div>
  );
}
