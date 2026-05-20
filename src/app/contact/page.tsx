import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Get in touch with the BestAIFinds team.",
};

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-16">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">Contact Us</h1>
        <p className="text-gray-500 dark:text-gray-400">Have a question, suggestion, or issue? We&apos;d love to hear from you.</p>
      </div>

      <div className="space-y-6">
        <div className="bg-surface-alt dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700">
          <h2 className="font-semibold text-gray-900 dark:text-white mb-4">Get in Touch</h2>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
                <svg className="w-5 h-5 text-primary-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">Email</p>
                <a href="mailto:zhibolu2@gmail.com" className="text-sm text-primary-500 hover:text-primary-700">zhibolu2@gmail.com</a>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-surface-alt dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700">
          <h2 className="font-semibold text-gray-900 dark:text-white mb-4">FAQ</h2>
          <div className="space-y-4">
            {[
              { q: "Are all tools really free?", a: "Yes! Basic access to all 240+ tools is completely free. Pro plans remove ads and add unlimited usage." },
              { q: "Are my files safe?", a: "Absolutely. Most tools process files directly in your browser — they never leave your device. Server-processed files are deleted within 1 hour." },
              { q: "Can I cancel my Pro subscription?", a: "Yes, you can cancel anytime. Your access continues until the end of the billing period." },
              { q: "Do you support Chinese?", a: "Yes! All our AI writing tools support Chinese input and output." },
            ].map(({ q, a }) => (
              <div key={q}>
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-1">{q}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">{a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
