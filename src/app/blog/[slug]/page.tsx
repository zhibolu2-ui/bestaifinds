import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getBlogPost, getRecentPosts, BLOG_POSTS } from "@/lib/blog";

export function generateStaticParams() {
  return BLOG_POSTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) return { title: "Not Found" };
  return {
    title: `${post.title} – BestAIFinds`,
    description: post.excerpt,
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) notFound();

  const related = getRecentPosts(6).filter((p) => p.slug !== slug).slice(0, 3);

  const html = post.content
    .replace(/^### (.+)$/gm, '<h3 class="text-lg font-bold text-gray-900 dark:text-white mt-8 mb-3">$1</h3>')
    .replace(/^## (.+)$/gm, '<h2 class="text-xl font-bold text-gray-900 dark:text-white mt-10 mb-4">$1</h2>')
    .replace(/^\| (.+)$/gm, (match) => {
      const cells = match.split("|").filter(Boolean).map((c) => c.trim());
      return `<tr>${cells.map((c) => `<td class="px-3 py-2 border border-gray-200 dark:border-gray-700 text-sm">${c}</td>`).join("")}</tr>`;
    })
    .replace(/^- \*\*(.+?)\*\*: (.+)$/gm, '<li class="mb-2"><strong class="text-gray-900 dark:text-white">$1</strong>: $2</li>')
    .replace(/^- (.+)$/gm, '<li class="mb-1.5">$1</li>')
    .replace(/^\d+\. \*\*(.+?)\*\*: (.+)$/gm, '<li class="mb-2"><strong class="text-gray-900 dark:text-white">$1</strong>: $2</li>')
    .replace(/^\d+\. (.+)$/gm, '<li class="mb-1.5">$1</li>')
    .replace(/\*\*(.+?)\*\*/g, '<strong class="text-gray-900 dark:text-white">$1</strong>')
    .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" class="text-indigo-500 hover:text-indigo-600 underline">$1</a>')
    .replace(/\n\n/g, '</p><p class="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">');

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-400 mb-8">
        <Link href="/" className="hover:text-gray-600 dark:hover:text-gray-300">Home</Link>
        <span>/</span>
        <Link href="/blog" className="hover:text-gray-600 dark:hover:text-gray-300">Blog</Link>
        <span>/</span>
        <span className="text-gray-600 dark:text-gray-300 truncate">{post.title}</span>
      </nav>

      {/* Header */}
      <header className="mb-10">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-xs font-semibold text-indigo-500 bg-indigo-50 dark:bg-indigo-900/30 px-2.5 py-1 rounded-full">
            {post.category}
          </span>
          <span className="text-sm text-gray-400">{post.date}</span>
          <span className="text-sm text-gray-400">·</span>
          <span className="text-sm text-gray-400">{post.readTime}</span>
        </div>
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white leading-tight mb-4">
          {post.title}
        </h1>
        <p className="text-lg text-gray-500 dark:text-gray-400">
          {post.excerpt}
        </p>
      </header>

      {/* Content */}
      <article
        className="prose-custom text-gray-600 dark:text-gray-300 leading-relaxed"
        dangerouslySetInnerHTML={{ __html: `<p class="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">${html}</p>` }}
      />

      {/* Related posts */}
      {related.length > 0 && (
        <div className="mt-16 pt-8 border-t border-gray-200 dark:border-gray-800">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Related Articles</h2>
          <div className="grid gap-4 sm:grid-cols-3">
            {related.map((r) => (
              <Link
                key={r.slug}
                href={`/blog/${r.slug}`}
                className="group p-4 rounded-xl border border-gray-200 dark:border-gray-800 hover:shadow-md transition-all"
              >
                <div className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-lg mb-3 group-hover:scale-110 transition-transform">
                  {r.image}
                </div>
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white group-hover:text-indigo-500 line-clamp-2 mb-1">
                  {r.title}
                </h3>
                <p className="text-xs text-gray-400">{r.date}</p>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
