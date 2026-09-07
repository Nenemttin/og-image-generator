import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Refund Policy — TinyOG",
  description: "14-Day Money Back Guarantee and Refund Policy for TinyOG at tinyog.cloud",
};

export default function RefundPage() {
  return (
    <main className="min-h-screen bg-[#09090b] text-[#f4f4f5] flex flex-col items-center justify-start p-6 md:p-12 font-sans selection:bg-zinc-800 selection:text-zinc-100">
      <div className="w-full max-w-3xl flex flex-col gap-8">
        {/* Navigation */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-mono text-zinc-400 hover:text-white transition-colors w-fit"
        >
          <svg
            className="w-3.5 h-3.5"
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
        <header className="border-b border-[#27272a] pb-6">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-zinc-900 border border-zinc-800 text-zinc-400 text-[11px] font-mono uppercase tracking-wider mb-3">
            Buyer Protection
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-[#fafafa]">
            Refund Policy
          </h1>
          <p className="text-xs text-zinc-500 font-mono mt-2">
            Last updated: September 7, 2026 • Official Domain:{" "}
            <a
              href="https://tinyog.cloud"
              className="text-zinc-300 hover:underline"
            >
              https://tinyog.cloud
            </a>
          </p>
        </header>

        {/* Content */}
        <div className="flex flex-col gap-6 text-zinc-400 text-sm leading-relaxed">
          {/* Highlight Banner */}
          <div className="p-4 bg-zinc-900/60 border border-[#27272a] rounded-xl flex items-start gap-3">
            <span className="text-xl shrink-0 font-mono">🛡️</span>
            <div>
              <h3 className="text-sm font-bold text-zinc-200">
                14-Day 100% Money-Back Guarantee
              </h3>
              <p className="text-xs text-zinc-400 mt-1">
                We stand behind TinyOG. If it does not meet your workflow expectations within 14 days of purchase, you get a full refund — no questions asked.
              </p>
            </div>
          </div>

          <section className="flex flex-col gap-2">
            <h2 className="text-base font-bold text-zinc-100">1. Refund Eligibility</h2>
            <p>
              You are entitled to a full refund within <strong className="text-zinc-200">14 calendar days</strong> from the exact date and time of your purchase of the TinyOG Lifetime Pass.
            </p>
          </section>

          <section className="flex flex-col gap-2">
            <h2 className="text-base font-bold text-zinc-100">2. How to Request a Refund</h2>
            <p>
              To request your refund, simply send an email to{" "}
              <a
                href="mailto:support@tinyog.cloud"
                className="text-zinc-200 hover:text-white font-medium underline"
              >
                support@tinyog.cloud
              </a>{" "}
              or reply to your Lemon Squeezy purchase confirmation email with:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-zinc-400">
              <li>Your Lemon Squeezy Order Number or Receipt ID.</li>
              <li>The email address used at checkout.</li>
              <li>(Optional) A brief note on how we can improve.</li>
            </ul>
          </section>

          <section className="flex flex-col gap-2">
            <h2 className="text-base font-bold text-zinc-100">3. Processing Time</h2>
            <p>
              Once your request is received, we will process your refund through Lemon Squeezy within <strong className="text-zinc-200">24 to 48 business hours</strong>. Depending on your bank or card issuer, the credited funds will appear on your statement within 3 to 7 business days.
            </p>
          </section>

          <section className="flex flex-col gap-2">
            <h2 className="text-base font-bold text-zinc-100">4. License Revocation</h2>
            <p>
              Upon issuance of a refund, the associated TinyOG Pro license key will be deactivated and returned to the free tier (displaying the default watermark).
            </p>
          </section>

          <section className="flex flex-col gap-2 border-t border-[#27272a] pt-6">
            <h2 className="text-base font-bold text-zinc-100">5. Contact Support</h2>
            <p>
              Have questions about your order or need technical support before requesting a refund? We are always here to help:{" "}
              <a
                href="mailto:support@tinyog.cloud"
                className="text-zinc-200 hover:text-white underline font-medium"
              >
                support@tinyog.cloud
              </a>
            </p>
          </section>
        </div>

        {/* Footer info */}
        <footer className="mt-8 pt-6 border-t border-[#27272a] text-xs text-zinc-500 font-mono flex items-center justify-between">
          <span>© 2026 TinyOG (tinyog.cloud). All rights reserved.</span>
          <Link href="/" className="text-zinc-400 hover:text-white transition-colors">
            Return to Generator
          </Link>
        </footer>
      </div>
    </main>
  );
}
