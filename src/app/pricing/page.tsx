import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Pricing – BestAIFinds Pro Plans",
  description: "Upgrade to BestAIFinds Pro for unlimited access, no ads, and faster processing.",
};

const FREE_FEATURES = [
  "All 80+ tools available",
  "PDF, Image & File tools unlimited",
  "Browser-based processing",
  "No registration required",
  "Up to 50MB per file",
];

const FREE_LIMITS = [
  "Contains ads",
  "AI Writing tools: 3 uses/day",
  "AI Image tools: 2 uses/day",
  "Server processing: 5 uses/day",
];

const PRO_FEATURES = [
  "All 240+ tools unlimited",
  "No ads whatsoever",
  "No daily usage limits",
  "Faster server processing",
  "Up to 200MB per file",
  "Priority customer support",
  "Batch processing",
  "API access (coming soon)",
  "Early access to new tools",
];

const FAQ = [
  {
    q: "Which tools are free?",
    a: "All browser-based tools (PDF merge, split, compress, image convert, resize, file convert, etc.) are completely free with no limits. AI-powered tools (writing, image generation, translations) have daily free limits.",
  },
  {
    q: "What happens when I reach my daily limit?",
    a: "You'll see a friendly upgrade prompt. Your work is saved — you can either wait until tomorrow for your free credits to reset, or upgrade to Pro for unlimited access.",
  },
  {
    q: "Are my files secure?",
    a: "Yes! Most tools process files directly in your browser — files never leave your device. For server-processed tools, files are automatically deleted within 1 hour.",
  },
  {
    q: "Can I cancel anytime?",
    a: "Absolutely. Cancel your Pro subscription at any time. You'll keep Pro access until the end of your billing period.",
  },
  {
    q: "Do you offer refunds?",
    a: "Yes, we offer a 7-day money-back guarantee if you're not satisfied with Pro.",
  },
];

export default function PricingPage() {
  return (
    <div className="bg-white dark:bg-gray-950">
      {/* Header */}
      <section className="bg-gradient-to-b from-indigo-50 to-white dark:from-gray-900 dark:to-gray-950 py-16">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Simple, Transparent Pricing
          </h1>
          <p className="text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
            Most tools are free forever. Upgrade to Pro only when you need unlimited AI features.
          </p>
        </div>
      </section>

      {/* Plans */}
      <section className="mx-auto max-w-5xl px-4 -mt-4 pb-16">
        <div className="grid md:grid-cols-3 gap-6">
          {/* Free */}
          <div className="rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-8">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">Free</h3>
            <div className="flex items-baseline gap-1 mb-1">
              <span className="text-4xl font-extrabold text-gray-900 dark:text-white">$0</span>
              <span className="text-sm text-gray-500">forever</span>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">All basic tools, free to use</p>

            <Link
              href="/"
              className="block w-full text-center py-3 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-semibold text-sm hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              Get Started
            </Link>

            <ul className="mt-6 space-y-3">
              {FREE_FEATURES.map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300">
                  <svg className="w-4 h-4 mt-0.5 shrink-0 text-green-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>
                  {f}
                </li>
              ))}
              {FREE_LIMITS.map((l) => (
                <li key={l} className="flex items-start gap-2 text-sm text-gray-400">
                  <svg className="w-4 h-4 mt-0.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14"/></svg>
                  {l}
                </li>
              ))}
            </ul>
          </div>

          {/* Pro Monthly */}
          <div className="relative rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white p-8 shadow-xl shadow-indigo-200 dark:shadow-indigo-900/30 ring-2 ring-indigo-400">
            <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-semibold bg-yellow-400 text-gray-900">
              Most Popular
            </span>

            <h3 className="text-xl font-bold mb-1">Pro Monthly</h3>
            <div className="flex items-baseline gap-1 mb-1">
              <span className="text-4xl font-extrabold">$9.99</span>
              <span className="text-sm text-indigo-200">/month</span>
            </div>
            <p className="text-sm text-indigo-200 mb-6">Unlimited access to everything</p>

            <button className="block w-full text-center py-3 rounded-xl bg-white text-indigo-600 font-semibold text-sm hover:bg-gray-50 transition-colors shadow-md">
              Subscribe Now
            </button>

            <ul className="mt-6 space-y-3">
              {PRO_FEATURES.map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm text-indigo-50">
                  <svg className="w-4 h-4 mt-0.5 shrink-0 text-green-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>
                  {f}
                </li>
              ))}
            </ul>
          </div>

          {/* Pro Annual */}
          <div className="relative rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-8">
            <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">
              Best Value – Save 30%
            </span>

            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">Pro Annual</h3>
            <div className="flex items-baseline gap-1 mb-1">
              <span className="text-4xl font-extrabold text-gray-900 dark:text-white">$6.99</span>
              <span className="text-sm text-gray-500">/month</span>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">Billed annually at $83.88/year</p>

            <button className="block w-full text-center py-3 rounded-xl bg-indigo-500 text-white font-semibold text-sm hover:bg-indigo-600 transition-colors shadow-md">
              Subscribe &amp; Save
            </button>

            <ul className="mt-6 space-y-3">
              {PRO_FEATURES.map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300">
                  <svg className="w-4 h-4 mt-0.5 shrink-0 text-green-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>
                  {f}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* How Free Works */}
      <section className="bg-gray-50 dark:bg-gray-900/50 border-y border-gray-100 dark:border-gray-800 py-16">
        <div className="mx-auto max-w-4xl px-4">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8 text-center">
            How the Free Plan Works
          </h2>
          <div className="grid sm:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800 text-center">
              <div className="text-3xl mb-3">1</div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Pick Any Tool</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Choose from 80+ free tools. No sign-up needed.</p>
            </div>
            <div className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800 text-center">
              <div className="text-3xl mb-3">2</div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Use Freely</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Browser tools are unlimited. AI tools have daily free credits.</p>
            </div>
            <div className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800 text-center">
              <div className="text-3xl mb-3">3</div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Upgrade If Needed</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Hit your daily limit? Upgrade to Pro for unlimited access.</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="mx-auto max-w-3xl px-4 py-16">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8 text-center">
          Frequently Asked Questions
        </h2>
        <div className="space-y-4">
          {FAQ.map(({ q, a }) => (
            <div key={q} className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">{q}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{a}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
