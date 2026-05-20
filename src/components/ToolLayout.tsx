import Link from "next/link";
import { CATEGORIES, type Tool, getToolsByCategory } from "@/lib/tools";
import { getToolGuide } from "@/lib/tool-guides";

interface ToolLayoutProps {
  tool: Tool;
  children: React.ReactNode;
}

export default function ToolLayout({ tool, children }: ToolLayoutProps) {
  const related = getToolsByCategory(tool.category)
    .filter((t) => t.slug !== tool.slug)
    .slice(0, 6);

  const guide = getToolGuide(tool.category, tool.slug, tool.name, tool.description);

  return (
    <div className="min-h-[calc(100vh-4rem)]">
      {/* Breadcrumb */}
      <div className="bg-surface-alt dark:bg-gray-950 border-b border-gray-100 dark:border-gray-800">
        <div className="mx-auto max-w-5xl px-4 py-3 flex items-center gap-2 text-sm text-gray-400 dark:text-gray-500">
          <Link href="/" className="hover:text-indigo-500 transition-colors">Home</Link>
          <span>/</span>
          <Link href={`/${tool.category}`} className="hover:text-indigo-500 transition-colors">
            {CATEGORIES[tool.category].label}
          </Link>
          <span>/</span>
          <span className="text-gray-700 dark:text-gray-200 font-medium">{tool.name}</span>
        </div>
      </div>

      {/* Tool header */}
      <div className="mx-auto max-w-5xl px-4 pt-10 pb-6 text-center">
        <span className="text-4xl mb-4 block">{tool.icon}</span>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
          {tool.name}
        </h1>
        <p className="text-gray-500 dark:text-gray-400 max-w-lg mx-auto">{tool.description}</p>
        <p className="text-xs text-green-600 dark:text-green-400 mt-2 flex items-center justify-center gap-1">
          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
          Uploaded files are processed securely and never stored
        </p>
      </div>

      {/* Tool content */}
      <div className="mx-auto max-w-5xl px-4 pb-12">{children}</div>

      {/* How To Use */}
      <section className="bg-white dark:bg-gray-950 py-12 border-t border-gray-100 dark:border-gray-800">
        <div className="mx-auto max-w-3xl px-4">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white text-center mb-2">
            How To {tool.name}
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 text-center mb-8">
            Follow along with the steps below
          </p>

          <div className="grid sm:grid-cols-3 gap-6">
            {guide.steps.map((step, i) => (
              <div key={i} className="text-center">
                <div className="w-12 h-12 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center mx-auto mb-3">
                  <span className="text-indigo-600 dark:text-indigo-400 font-bold">{i + 1}</span>
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-1.5 text-sm">
                  Step {i + 1}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 font-medium mb-1">
                  {step.title}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-500 leading-relaxed">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SEO Description */}
      <section className="bg-gray-50 dark:bg-gray-900/50 py-10 border-t border-gray-100 dark:border-gray-800">
        <div className="mx-auto max-w-3xl px-4">
          <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed text-center">
            {guide.seoText}
          </p>
        </div>
      </section>

      {/* FAQ */}
      {guide.faqs.length > 0 && (
        <section className="bg-white dark:bg-gray-950 py-12 border-t border-gray-100 dark:border-gray-800">
          <div className="mx-auto max-w-3xl px-4">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white text-center mb-8">
              Frequently Asked Questions
            </h2>
            <div className="space-y-4">
              {guide.faqs.map((faq, i) => (
                <details key={i} className="group rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50">
                  <summary className="flex items-center justify-between px-5 py-4 cursor-pointer text-sm font-medium text-gray-900 dark:text-white">
                    {faq.q}
                    <svg className="w-4 h-4 text-gray-400 group-open:rotate-180 transition-transform shrink-0 ml-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m6 9 6 6 6-6"/></svg>
                  </summary>
                  <div className="px-5 pb-4">
                    <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{faq.a}</p>
                  </div>
                </details>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Related tools */}
      {related.length > 0 && (
        <section className="bg-gray-50 dark:bg-gray-900/50 border-t border-gray-100 dark:border-gray-800 py-12">
          <div className="mx-auto max-w-5xl px-4">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-6">
              More {CATEGORIES[tool.category].label} Tools
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {related.map((r) => (
                <Link
                  key={r.slug}
                  href={`/${r.category}/${r.slug}`}
                  className="group flex flex-col items-center gap-2 p-4 rounded-xl bg-white dark:bg-gray-900/50 border border-gray-100 dark:border-gray-800 hover:shadow-md hover:border-indigo-200 dark:hover:border-indigo-700 hover:-translate-y-0.5 transition-all duration-200 text-center"
                >
                  <span className="text-2xl group-hover:scale-110 transition-transform">{r.icon}</span>
                  <span className="text-xs font-medium text-gray-700 dark:text-gray-300">{r.name}</span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
