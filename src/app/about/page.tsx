import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us — BestAIFinds",
  description: "Learn about BestAIFinds, the free online tool suite offering 70+ tools for PDF, image, video, AI writing, and file conversion.",
};

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-white dark:bg-gray-950">
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">About BestAIFinds</h1>

        <div className="prose prose-gray dark:prose-invert max-w-none space-y-6 text-gray-600 dark:text-gray-300 text-[15px] leading-relaxed">
          <section>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mt-8 mb-3">Our Mission</h2>
            <p>
              BestAIFinds is a free online tool suite designed to make everyday digital tasks simple, fast, and accessible to everyone.
              We believe powerful tools should be available without expensive subscriptions, complicated software installations, or mandatory sign-ups.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mt-8 mb-3">What We Offer</h2>
            <p>Our platform provides 70+ free online tools across five categories:</p>
            <ul className="list-disc pl-6 space-y-1 mt-2">
              <li><strong>PDF Tools</strong> — Merge, split, compress, convert, rotate, watermark, sign, and more</li>
              <li><strong>Image Tools</strong> — Resize, compress, crop, convert formats, remove backgrounds, and AI image generation</li>
              <li><strong>AI Writing Tools</strong> — Essay writer, grammar fixer, content improver, translator, and 10+ more</li>
              <li><strong>Video Tools</strong> — Compress, trim, convert formats, extract audio, create GIFs</li>
              <li><strong>File Tools</strong> — Convert between CSV, JSON, XML, Excel, generate QR codes, and more</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mt-8 mb-3">Privacy First</h2>
            <p>
              Many of our tools process your files entirely in your browser. This means your documents, images, and data
              never leave your device. For tools that require server processing (like video compression or AI features),
              files are processed and immediately deleted — we never store your content.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mt-8 mb-3">Free for Everyone</h2>
            <p>
              Browser-based tools (PDF editing, image processing, file conversion) are completely free with no daily limits.
              AI-powered tools have generous free daily limits, with an optional Pro subscription for unlimited access.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mt-8 mb-3">Contact Us</h2>
            <p>
              Have questions, feedback, or feature requests? We would love to hear from you.
            </p>
            <p className="mt-2">
              Email: <a href="mailto:zhibolu2@gmail.com" className="text-indigo-500 hover:text-indigo-600">zhibolu2@gmail.com</a>
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
