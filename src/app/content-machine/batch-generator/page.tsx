"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";

export default function BatchGeneratorPage() {
  const { data: session } = useSession();
  const userPlan = (session?.user as Record<string, unknown>)?.plan as string || "free";

  return (
    <div className="max-w-3xl mx-auto px-6 py-10">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 text-center">Batch Generator</h1>
      <p className="text-gray-500 dark:text-gray-400 text-center mb-8">
        Generate multiple articles at once from a list of titles
      </p>

      {userPlan === "free" || userPlan === "pro" ? (
        <div className="bg-white dark:bg-[#1e2024] rounded-2xl border border-gray-200 dark:border-gray-800 p-12 text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
            <span className="text-2xl">⚡</span>
          </div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Business Plan Required</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 max-w-md mx-auto">
            Batch generation is available on the Business plan. Upgrade to generate multiple articles simultaneously and save hours of work.
          </p>
          <Link
            href="/pricing"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl text-sm font-semibold hover:from-indigo-600 hover:to-purple-700 transition-all shadow-lg"
          >
            Upgrade to Business
          </Link>
        </div>
      ) : (
        <div className="bg-white dark:bg-[#1e2024] rounded-2xl border border-gray-200 dark:border-gray-800 p-6">
          <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">
            Enter article titles (one per line)
          </label>
          <textarea
            rows={8}
            placeholder={"Benefits of Using a Real Estate Agent\nHow to Get Past Writer's Block\nCar Maintenance Tips for Beginners"}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 text-sm text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-300 resize-none"
          />
          <div className="mt-4 flex items-center justify-between">
            <p className="text-xs text-gray-400">Max 10 articles per batch</p>
            <button className="px-5 py-2.5 bg-indigo-500 text-white rounded-xl text-sm font-semibold hover:bg-indigo-600 transition-colors">
              Generate All
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
