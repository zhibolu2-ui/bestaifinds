import Link from "next/link";
import type { Tool } from "@/lib/tools";

const CAT_ACCENT: Record<string, string> = {
  pdf: "group-hover:border-red-400 dark:group-hover:border-red-500",
  image: "group-hover:border-blue-400 dark:group-hover:border-blue-500",
  write: "group-hover:border-emerald-400 dark:group-hover:border-emerald-500",
  video: "group-hover:border-purple-400 dark:group-hover:border-purple-500",
  file: "group-hover:border-amber-400 dark:group-hover:border-amber-500",
};

const CAT_ICON_BG: Record<string, string> = {
  pdf: "bg-red-100 dark:bg-red-900/40",
  image: "bg-blue-100 dark:bg-blue-900/40",
  write: "bg-emerald-100 dark:bg-emerald-900/40",
  video: "bg-purple-100 dark:bg-purple-900/40",
  file: "bg-amber-100 dark:bg-amber-900/40",
};

export default function ToolCard({ tool }: { tool: Tool }) {
  return (
    <Link
      href={`/${tool.category}/${tool.slug}`}
      className={`group flex items-center gap-4 p-4 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900/60 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 ${CAT_ACCENT[tool.category]}`}
    >
      <div className={`w-11 h-11 rounded-lg ${CAT_ICON_BG[tool.category]} flex items-center justify-center text-xl shrink-0 group-hover:scale-110 transition-transform`}>
        {tool.icon}
      </div>
      <div className="min-w-0 flex-1">
        <h3 className="font-semibold text-gray-900 dark:text-white text-sm leading-tight truncate">
          {tool.name}
        </h3>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 line-clamp-1">
          {tool.description}
        </p>
      </div>
      <svg
        className="w-4 h-4 text-gray-300 dark:text-gray-600 group-hover:text-gray-500 dark:group-hover:text-gray-400 shrink-0 group-hover:translate-x-0.5 transition-all"
        viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
        strokeLinecap="round" strokeLinejoin="round"
      >
        <path d="m9 18 6-6-6-6"/>
      </svg>
    </Link>
  );
}
