"use client";

import { useSession, signOut } from "next-auth/react";
import { useState } from "react";
import Link from "next/link";
import { redirect } from "next/navigation";

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

type TabKey = "billings" | "favourites";

export default function AccountPage() {
  const { data: session, status } = useSession();
  const [activeTab, setActiveTab] = useState<TabKey>("billings");

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f7f7f8] dark:bg-[#16181c]">
        <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!session?.user) {
    redirect("/signin");
  }

  const user = session.user as { name?: string | null; email?: string | null; image?: string | null; plan?: string };
  const plan = user.plan || "free";
  const initial = (user.name?.[0] || user.email?.[0] || "U").toUpperCase();

  const planLabel: Record<string, string> = { free: "Free", pro: "Pro", business: "Business" };

  const tabs: { key: TabKey; label: string }[] = [
    { key: "billings", label: "Billings" },
    { key: "favourites", label: "Favourite Tools" },
  ];

  return (
    <div className="min-h-screen bg-[#f7f7f8] dark:bg-[#16181c]">
      <div className="mx-auto max-w-5xl px-4 py-10">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">Account Settings</h1>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Left sidebar */}
          <div className="w-full md:w-64 shrink-0">
            <div className="bg-white dark:bg-[#1e2024] rounded-2xl border border-gray-200 dark:border-gray-800 p-6">
              <div className="flex flex-col items-center text-center mb-6">
                <div className="w-20 h-20 rounded-full bg-indigo-500 flex items-center justify-center text-white text-2xl font-bold overflow-hidden mb-3">
                  {user.image ? (
                    <img src={user.image} alt="" className="w-full h-full object-cover" />
                  ) : (
                    initial
                  )}
                </div>
                <button className="text-sm text-indigo-500 hover:text-indigo-600 font-medium">
                  Upload Photo
                </button>
              </div>

              <div className="space-y-3 text-sm border-t border-gray-100 dark:border-gray-800 pt-4">
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400">Name</span>
                  <span className="text-gray-900 dark:text-white font-medium">{user.name || "—"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400">Email</span>
                  <span className="text-gray-900 dark:text-white font-medium text-xs truncate max-w-[140px]">{user.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400">Current Plan</span>
                  <span className={`font-semibold ${plan === "free" ? "text-gray-600 dark:text-gray-300" : "text-indigo-500"}`}>
                    {planLabel[plan] || plan}
                  </span>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-gray-100 dark:border-gray-800 space-y-2">
                <Link
                  href="/account"
                  className="block w-full text-center py-2 rounded-lg text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  Edit
                </Link>
                <button
                  onClick={() => {
                    if (confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
                      alert("Please contact support@bestaifinds.com to delete your account.");
                    }
                  }}
                  className="block w-full text-center py-2 rounded-lg text-sm text-red-500 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors font-medium"
                >
                  Delete Account
                </button>
                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="block w-full text-center py-2.5 rounded-lg text-sm text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors font-medium"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>

          {/* Main content */}
          <div className="flex-1 min-w-0">
            {/* Tabs */}
            <div className="flex gap-1 border-b border-gray-200 dark:border-gray-800 mb-6">
              {tabs.map(({ key, label }) => (
                <button
                  key={key}
                  onClick={() => setActiveTab(key)}
                  className={`px-5 py-3 text-sm font-medium transition-colors relative ${
                    activeTab === key
                      ? "text-indigo-600 dark:text-indigo-400"
                      : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                  }`}
                >
                  {label}
                  {activeTab === key && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-500 rounded-full" />
                  )}
                </button>
              ))}
            </div>

            {/* Billings tab */}
            {activeTab === "billings" && (
              <div>
                <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Billing Information</h2>

                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                  {/* Free Plan */}
                  <div className={`rounded-xl border p-5 ${plan === "free" ? "border-indigo-400 bg-indigo-50 dark:bg-indigo-900/20" : "border-gray-200 dark:border-gray-800 bg-white dark:bg-[#1e2024]"}`}>
                    <h3 className="font-bold text-gray-900 dark:text-white mb-1">Free Plan</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">Free tools for everyone</p>
                    <p className={`text-lg font-extrabold mb-4 ${plan === "free" ? "text-indigo-600 dark:text-indigo-400" : "text-gray-900 dark:text-white"}`}>FREE</p>
                    {plan === "free" ? (
                      <span className="inline-block px-4 py-2 rounded-lg bg-indigo-500 text-white text-sm font-semibold">Current Plan</span>
                    ) : (
                      <span className="inline-block px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-500 text-sm">—</span>
                    )}
                  </div>

                  {/* Pro Plan */}
                  <div className={`rounded-xl border p-5 ${plan === "pro" ? "border-indigo-400 bg-indigo-50 dark:bg-indigo-900/20" : "border-gray-200 dark:border-gray-800 bg-white dark:bg-[#1e2024]"}`}>
                    <h3 className="font-bold text-gray-900 dark:text-white mb-1">Pro</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">Unlimited AI access</p>
                    <p className="text-lg font-extrabold text-gray-900 dark:text-white mb-4">$9.99<span className="text-sm font-normal text-gray-500">/month</span></p>
                    {plan === "pro" ? (
                      <span className="inline-block px-4 py-2 rounded-lg bg-indigo-500 text-white text-sm font-semibold">Current Plan</span>
                    ) : (
                      <Link href="/pricing" className="inline-block px-4 py-2 rounded-lg bg-indigo-500 text-white text-sm font-semibold hover:bg-indigo-600 transition-colors">
                        Upgrade Plan
                      </Link>
                    )}
                    <ul className="mt-4 space-y-1.5">
                      {PRO_FEATURES.slice(0, 3).map((f) => (
                        <li key={f} className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1.5">
                          <svg className="w-3 h-3 text-green-500 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
                          {f}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Business Plan */}
                  <div className={`rounded-xl border p-5 ${plan === "business" ? "border-indigo-400 bg-indigo-50 dark:bg-indigo-900/20" : "border-gray-200 dark:border-gray-800 bg-white dark:bg-[#1e2024]"}`}>
                    <h3 className="font-bold text-gray-900 dark:text-white mb-1">Business</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">Pro + advanced features</p>
                    <p className="text-lg font-extrabold text-gray-900 dark:text-white mb-4">$20.00<span className="text-sm font-normal text-gray-500">/month</span></p>
                    {plan === "business" ? (
                      <span className="inline-block px-4 py-2 rounded-lg bg-indigo-500 text-white text-sm font-semibold">Current Plan</span>
                    ) : (
                      <Link href="/pricing" className="inline-block px-4 py-2 rounded-lg bg-indigo-500 text-white text-sm font-semibold hover:bg-indigo-600 transition-colors">
                        Upgrade Plan
                      </Link>
                    )}
                    <ul className="mt-4 space-y-1.5">
                      {BIZ_FEATURES.slice(0, 3).map((f) => (
                        <li key={f} className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1.5">
                          <svg className="w-3 h-3 text-green-500 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
                          {f}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Billing History */}
                <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Billing History</h2>
                <div className="bg-white dark:bg-[#1e2024] rounded-xl border border-gray-200 dark:border-gray-800 p-6">
                  <p className="text-sm text-gray-400 text-center py-4">No billing history yet.</p>
                </div>
              </div>
            )}

            {/* Favourite Tools tab */}
            {activeTab === "favourites" && (
              <div>
                <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Favourite Tools</h2>
                <div className="bg-white dark:bg-[#1e2024] rounded-xl border border-gray-200 dark:border-gray-800 p-8 text-center">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                    <svg className="w-8 h-8 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M19 21l-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>
                  </div>
                  <p className="text-gray-500 dark:text-gray-400 text-sm mb-2">No favourite tools yet</p>
                  <p className="text-gray-400 dark:text-gray-500 text-xs mb-4">Browse tools and click the bookmark icon to save your favourites here.</p>
                  <Link href="/" className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-indigo-500 text-white text-sm font-medium hover:bg-indigo-600 transition-colors">
                    Browse Tools
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
