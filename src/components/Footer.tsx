import Link from "next/link";
import { CATEGORIES, Category, getToolsByCategory } from "@/lib/tools";

export default function Footer() {
  return (
    <footer className="mt-auto bg-gray-900 dark:bg-gray-950 border-t border-gray-800">
      <div className="mx-auto max-w-6xl px-4 py-12">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-8">
          {/* Brand */}
          <div className="col-span-2 sm:col-span-3 lg:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                <span className="text-white font-bold text-sm">B</span>
              </div>
              <span className="font-bold text-lg text-white">
                Best<span className="text-indigo-400">AI</span>Finds
              </span>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed mb-4">
              Free online tools for PDF, image, video, AI writing and more. No sign-up required.
            </p>
            <div className="flex items-center gap-3">
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-lg bg-gray-800 hover:bg-gray-700 flex items-center justify-center text-gray-400 hover:text-white transition-colors">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
              </a>
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-lg bg-gray-800 hover:bg-gray-700 flex items-center justify-center text-gray-400 hover:text-white transition-colors">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
              </a>
            </div>
          </div>

          {/* Categories */}
          {(Object.keys(CATEGORIES) as Category[]).map((cat) => {
            const tools = getToolsByCategory(cat).slice(0, 5);
            return (
              <div key={cat}>
                <h3 className="text-sm font-semibold text-white mb-3">
                  {CATEGORIES[cat].label} Tools
                </h3>
                <ul className="space-y-2">
                  {tools.map((t) => (
                    <li key={t.slug}>
                      <Link
                        href={`/${cat}/${t.slug}`}
                        className="text-sm text-gray-400 hover:text-indigo-400 transition-colors"
                      >
                        {t.name}
                      </Link>
                    </li>
                  ))}
                  <li>
                    <Link
                      href={`/${cat}`}
                      className="text-sm text-indigo-400 hover:text-indigo-300 font-medium transition-colors"
                    >
                      View all &rarr;
                    </Link>
                  </li>
                </ul>
              </div>
            );
          })}
        </div>

        <div className="mt-10 pt-8 border-t border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-500">
            &copy; {new Date().getFullYear()} BestAIFinds. All rights reserved. All tools are free to use.
          </p>
          <div className="flex flex-wrap justify-center gap-5">
            <Link href="/about" className="text-xs text-gray-400 hover:text-indigo-400 transition-colors">About Us</Link>
            <Link href="/blog" className="text-xs text-gray-400 hover:text-indigo-400 transition-colors">Blog</Link>
            <Link href="/pricing" className="text-xs text-gray-400 hover:text-indigo-400 transition-colors">Pricing</Link>
            <Link href="/privacy" className="text-xs text-gray-400 hover:text-indigo-400 transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="text-xs text-gray-400 hover:text-indigo-400 transition-colors">Terms of Service</Link>
            <Link href="/contact" className="text-xs text-gray-400 hover:text-indigo-400 transition-colors">Contact</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
