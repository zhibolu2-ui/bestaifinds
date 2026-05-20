import { Metadata } from "next";
import Link from "next/link";
import ToolCard from "@/components/ToolCard";
import { getToolsByCategory, CATEGORIES } from "@/lib/tools";

export const metadata: Metadata = {
  title: "PDF Tools – Edit, Convert & Merge PDFs Free",
  description: CATEGORIES.pdf.description,
};

export default function PdfPage() {
  const tools = getToolsByCategory("pdf");

  return (
    <div className="min-h-[60vh]">
      <section className="bg-gradient-to-b from-red-50 to-white dark:from-gray-900 dark:to-gray-950 border-b border-gray-100 dark:border-gray-800">
        <div className="mx-auto max-w-5xl px-4 py-12">
          <div className="flex items-center gap-2 text-sm text-gray-400 dark:text-gray-500 mb-6">
            <Link href="/" className="hover:text-red-500 transition-colors">Home</Link>
            <span>/</span>
            <span className="text-gray-700 dark:text-gray-200 font-medium">PDF Tools</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center text-white text-2xl shrink-0">
              📄
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">{CATEGORIES.pdf.label} Tools</h1>
              <p className="text-gray-500 dark:text-gray-400 mt-1">{CATEGORIES.pdf.description}</p>
            </div>
          </div>
          <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">{tools.length} tools available</p>
        </div>
      </section>
      <section className="mx-auto max-w-5xl px-4 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {tools.map((t) => (
            <ToolCard key={t.slug} tool={t} />
          ))}
        </div>
      </section>
    </div>
  );
}
