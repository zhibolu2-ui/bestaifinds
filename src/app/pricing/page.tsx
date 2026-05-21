"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import Link from "next/link";

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
  "Unlimited AI tool usage",
  "No daily limits",
  "Ad-free experience",
  "Priority processing",
  "Up to 200MB per file",
  "Early access to new tools",
];

const BIZ_FEATURES = [
  "Everything in Pro",
  "Batch processing",
  "API access",
  "Priority support",
  "Custom branding",
  "Up to 500MB per file",
];

const FAQ = [
  {
    q: "Which tools are free?",
    a: "All browser-based tools (PDF merge, split, compress, image convert, resize, file convert, etc.) are completely free with no limits. AI-powered tools have daily free limits.",
  },
  {
    q: "What happens when I reach my daily limit?",
    a: "You'll see a friendly upgrade prompt. You can either wait until tomorrow for your free credits to reset, or upgrade for unlimited access.",
  },
  {
    q: "Can I cancel anytime?",
    a: "Absolutely. Cancel your subscription at any time. You'll keep access until the end of your billing period.",
  },
  {
    q: "Do you offer refunds?",
    a: "Yes, we offer a 7-day money-back guarantee if you're not satisfied.",
  },
];

export default function PricingPage() {
  const { data: session } = useSession();
  const [loading, setLoading] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [billing, setBilling] = useState<"monthly" | "yearly">("monthly");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("success") === "true") setSuccess(true);
  }, []);

  const handleSubscribe = async (plan: "pro" | "business") => {
    if (!session?.user) {
      alert("Please sign in first to subscribe.");
      return;
    }
    setLoading(plan);
    try {
      const res = await fetch("/api/lemonsqueezy/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan, billing }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert(data.error || "Failed to create checkout session");
      }
    } catch {
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(null);
    }
  };

  const userPlan = (session?.user as Record<string, unknown>)?.plan as string || "free";
  const proPrice = billing === "monthly" ? 9.90 : 6.90;
  const bizPrice = billing === "monthly" ? 19.90 : 13.90;

  return (
    <div className="bg-[#f7f7f8] dark:bg-[#16181c]">
      {success && (
        <div className="bg-green-500 text-white text-center py-3 text-sm font-medium">
          Payment successful! Your plan has been upgraded. Welcome aboard!
        </div>
      )}

      <section className="py-16">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Simple, Transparent Pricing
          </h1>
          <p className="text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto mb-8">
            Most tools are free forever. Upgrade only when you need unlimited AI features.
          </p>

          {/* Billing toggle */}
          <div className="inline-flex items-center bg-gray-100 dark:bg-gray-800 rounded-full p-1">
            <button
              onClick={() => setBilling("monthly")}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
                billing === "monthly"
                  ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm"
                  : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBilling("yearly")}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
                billing === "yearly"
                  ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm"
                  : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
              }`}
            >
              Yearly
              <span className="ml-1.5 text-xs text-green-500 font-semibold">Save 30%</span>
            </button>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 -mt-4 pb-16">
        <div className="grid md:grid-cols-3 gap-6">
          {/* Free */}
          <div className="rounded-2xl bg-white dark:bg-[#1e2024] border border-gray-200 dark:border-gray-800 p-8">
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
              {userPlan === "free" ? "Current Plan" : "Get Started"}
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

          {/* Pro */}
          <div className="relative rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white p-8 shadow-xl ring-2 ring-indigo-400">
            <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-semibold bg-yellow-400 text-gray-900">
              Most Popular
            </span>

            <h3 className="text-xl font-bold mb-1">Pro</h3>
            <div className="flex items-baseline gap-1 mb-1">
              <span className="text-4xl font-extrabold">${proPrice.toFixed(2)}</span>
              <span className="text-sm text-indigo-200">/month</span>
            </div>
            <p className="text-sm text-indigo-200 mb-6">
              {billing === "yearly" ? `Billed $${(proPrice * 12).toFixed(2)}/year` : "Unlimited AI access"}
            </p>

            <button
              onClick={() => handleSubscribe("pro")}
              disabled={loading === "pro" || userPlan === "pro"}
              className="block w-full text-center py-3 rounded-xl bg-white text-indigo-600 font-semibold text-sm hover:bg-gray-50 transition-colors shadow-md disabled:opacity-50"
            >
              {loading === "pro" ? "Redirecting..." : userPlan === "pro" ? "Current Plan" : "Subscribe Now"}
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

          {/* Business */}
          <div className="relative rounded-2xl bg-white dark:bg-[#1e2024] border border-gray-200 dark:border-gray-800 p-8">
            <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">
              Best for Teams
            </span>

            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">Business</h3>
            <div className="flex items-baseline gap-1 mb-1">
              <span className="text-4xl font-extrabold text-gray-900 dark:text-white">${bizPrice.toFixed(2)}</span>
              <span className="text-sm text-gray-500">/month</span>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
              {billing === "yearly" ? `Billed $${(bizPrice * 12).toFixed(2)}/year` : "Pro + advanced features"}
            </p>

            <button
              onClick={() => handleSubscribe("business")}
              disabled={loading === "business" || userPlan === "business"}
              className="block w-full text-center py-3 rounded-xl bg-indigo-500 text-white font-semibold text-sm hover:bg-indigo-600 transition-colors shadow-md disabled:opacity-50"
            >
              {loading === "business" ? "Redirecting..." : userPlan === "business" ? "Current Plan" : "Subscribe Now"}
            </button>

            <ul className="mt-6 space-y-3">
              {BIZ_FEATURES.map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300">
                  <svg className="w-4 h-4 mt-0.5 shrink-0 text-green-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>
                  {f}
                </li>
              ))}
            </ul>
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
            <div key={q} className="bg-white dark:bg-[#1e2024] rounded-xl p-6 border border-gray-200 dark:border-gray-800">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">{q}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{a}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
