import { Metadata } from "next";
import Link from "next/link";
import { getRecentPosts } from "@/lib/blog";

export const metadata: Metadata = {
  title: "Blog – BestAIFinds",
  description: "Tips, guides, and tutorials on using free online tools for PDF, image, video, and file conversion.",
};

export default function BlogPage() {
  const posts = getRecentPosts();

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-3">Blog</h1>
        <p className="text-gray-500 dark:text-gray-400">Tips, guides, and tutorials on free online tools</p>
      </div>

      <div className="space-y-6">
        {posts.map((post) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="group block p-6 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900/60 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
          >
            <div className="flex items-start gap-5">
              <div className="w-14 h-14 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-2xl shrink-0 group-hover:scale-110 transition-transform">
                {post.image}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-xs font-semibold text-indigo-500 bg-indigo-50 dark:bg-indigo-900/30 px-2 py-0.5 rounded-full">
                    {post.category}
                  </span>
                  <span className="text-xs text-gray-400">{post.date}</span>
                  <span className="text-xs text-gray-400">{post.readTime}</span>
                </div>
                <h2 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-indigo-500 transition-colors mb-1.5 line-clamp-2">
                  {post.title}
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
                  {post.excerpt}
                </p>
              </div>
              <svg className="w-5 h-5 text-gray-300 dark:text-gray-600 group-hover:text-indigo-500 shrink-0 mt-2 group-hover:translate-x-1 transition-all" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m9 18 6-6-6-6"/></svg>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
