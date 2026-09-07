import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Refund Policy — TinyOG",
  description: "14-Day Money Back Guarantee and Refund Policy for TinyOG at tinyog.cloud",
};

export default function RefundPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-start p-6 md:p-12 relative overflow-hidden font-sans">
      {/* Background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[350px] bg-emerald-600/10 blur-[120px] rounded-full pointer-events-none -z-10" />

      <div className="w-full max-w-3xl flex flex-col gap-8">
        {/* Navigation */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-semibold text-blue-400 hover:text-blue-300 transition-colors w-fit"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          Back to TinyOG
        </Link>

        {/* Header */}
        <header className="border-b border-slate-800 pb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-3">
            Buyer Protection
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white">
            Refund Policy
          </h1>
          <p className="text-xs text-slate-400 mt-2">
            Last updated: September 7, 2026 • Official Domain:{" "}
            <a
              href="https://tinyog.cloud"
              className="text-emerald-400 hover:underline"
            >
              https://tinyog.cloud
            </a>
          </p>
        </header>

        {/* Content */}
        <div className="flex flex-col gap-6 text-slate-300 text-sm leading-relaxed">
          {/* Highlight Banner */}
          <div className="p-4 bg-emerald-950/30 border border-emerald-500/30 rounded-2xl flex items-start gap-3">
            <span className="text-xl shrink-0">🛡️</span>
            <div>
              <h3 className="text-sm font-bold text-emerald-300">
                14-Day 100% Money-Back Guarantee
              </h3>
              <p className="text-xs text-emerald-400/90 mt-1">
                We believe in TinyOG. If it doesn&apos;t meet your expectations within 14 days of purchase, you get a full refund — no questions asked.
              </p>
            </div>
          </div>

          <section className="flex flex-col gap-2">
            <h2 className="text-lg font-bold text-white">1. Refund Eligibility</h2>
            <p>
              You are entitled to a full refund within <strong>14 calendar days</strong> from the exact date and time of your purchase of the TinyOG Lifetime Pass.
            </p>
          </section>

          <section className="flex flex-col gap-2">
            <h2 className="text-lg font-bold text-white">2. How to Request a Refund</h2>
            <p>
              To request your refund, simply send an email to{" "}
              <a
                href="mailto:support@tinyog.cloud"
                className="text-emerald-400 hover:text-emerald-300 font-semibold underline"
              >
                support@tinyog.cloud
              </a>{" "}
              or reply to your Lemon Squeezy purchase confirmation email with:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-slate-400">
              <li>Your Lemon Squeezy Order Number or Receipt ID.</li>
              <li>The email address used at checkout.</li>
              <li>(Optional) A brief note on how we can improve.</li>
            </ul>
          </section>

          <section className="flex flex-col gap-2">
            <h2 className="text-lg font-bold text-white">3. Processing Time</h2>
            <p>
              Once your request is received, we will process your refund through Lemon Squeezy within <strong>24 to 48 business hours</strong>. Depending on your bank or card issuer, the credited funds will appear on your statement within 3 to 7 business days.
            </p>
          </section>

          <section className="flex flex-col gap-2">
            <h2 className="text-lg font-bold text-white">4. License Revocation</h2>
            <p>
              Upon issuance of a refund, the associated TinyOG Pro license key will be deactivated and returned to the free tier (displaying the default watermark).
            </p>
          </section>

          <section className="flex flex-col gap-2 border-t border-slate-800/80 pt-6">
            <h2 className="text-lg font-bold text-white">5. Contact Support</h2>
            <p>
              Have questions about your order or need technical support before requesting a refund? We are always here to help:{" "}
              <a
                href="mailto:support@tinyog.cloud"
                className="text-emerald-400 hover:text-emerald-300 underline font-medium"
              >
                support@tinyog.cloud
              </a>
            </p>
          </section>
        </div>

        {/* Footer info */}
        <footer className="mt-8 pt-6 border-t border-slate-800/80 text-xs text-slate-500 flex items-center justify-between">
          <span>© 2026 TinyOG (tinyog.cloud). All rights reserved.</span>
          <Link href="/" className="text-slate-400 hover:text-white transition-colors">
            Return to Generator
          </Link>
        </footer>
      </div>
    </main>
  );
}
