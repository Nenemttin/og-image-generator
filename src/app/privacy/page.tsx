import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy — TinyOG",
  description: "Privacy Policy for TinyOG - Dynamic Open Graph Image Generator at tinyog.cloud",
};

export default function PrivacyPage() {
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
            Privacy &amp; Data Security
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-[#fafafa]">
            Privacy Policy
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
          <section className="flex flex-col gap-2">
            <h2 className="text-base font-bold text-zinc-100">1. Introduction</h2>
            <p>
              At TinyOG, accessible from{" "}
              <a
                href="https://tinyog.cloud"
                className="text-zinc-200 hover:underline font-medium"
              >
                https://tinyog.cloud
              </a>
              , we strongly value your privacy. We are committed to transparency and collecting only the minimal information necessary to deliver our edge-rendered social card generation service.
            </p>
          </section>

          <section className="flex flex-col gap-2">
            <h2 className="text-base font-bold text-zinc-100">2. Information We Collect</h2>
            <p>
              <strong className="text-zinc-200">Account-Free Architecture:</strong> TinyOG does not require an account or password to create or generate social cards.
            </p>
            <p>
              <strong className="text-zinc-200">Payment Data:</strong> All financial transactions are processed directly by our merchant of record, <strong className="text-zinc-200">Lemon Squeezy</strong>. We never view, collect, or store your credit card numbers, billing addresses, or banking credentials.
            </p>
            <p>
              <strong className="text-zinc-200">License Verification:</strong> When you provide a license key, we query the Lemon Squeezy validation API securely via encrypted HTTPS to determine your Pro status.
            </p>
            <p>
              <strong className="text-zinc-200">URL Parameters:</strong> The titles, tags, and theme preferences you pass in query strings are ephemeral and processed in-memory at the edge solely to generate the rendered PNG binary.
            </p>
          </section>

          <section className="flex flex-col gap-2">
            <h2 className="text-base font-bold text-zinc-100">3. Cookies &amp; Local Storage</h2>
            <p>
              We do not use tracking cookies or advertising pixels. Your browser may use local storage strictly to remember your active inputs and license key for your convenience while using the web studio.
            </p>
          </section>

          <section className="flex flex-col gap-2">
            <h2 className="text-base font-bold text-zinc-100">4. Third-Party Service Providers</h2>
            <p>We work with trusted infrastructure providers:</p>
            <ul className="list-disc pl-5 space-y-1 text-zinc-400">
              <li>
                <strong className="text-zinc-200">Lemon Squeezy:</strong> Payment processing, tax remittance, and license key issuance.
              </li>
              <li>
                <strong className="text-zinc-200">Vercel:</strong> Edge network hosting and CDN caching for sub-second image delivery.
              </li>
            </ul>
          </section>

          <section className="flex flex-col gap-2">
            <h2 className="text-base font-bold text-zinc-100">5. Data Retention &amp; Security</h2>
            <p>
              We employ industry-standard encryption (TLS/HTTPS) across all network calls. Because we do not store customer databases of generated text or personal identifiers, there is zero risk of personal profile leakage.
            </p>
          </section>

          <section className="flex flex-col gap-2">
            <h2 className="text-base font-bold text-zinc-100">6. Your Rights (GDPR / CCPA)</h2>
            <p>
              Under global data protection laws (such as GDPR and CCPA), you have the right to request access, correction, or deletion of any billing records held by our payment processor. To exercise these rights, please reach out directly to{" "}
              <a
                href="mailto:support@tinyog.cloud"
                className="text-zinc-200 hover:text-white underline font-medium"
              >
                support@tinyog.cloud
              </a>
              .
            </p>
          </section>

          <section className="flex flex-col gap-2 border-t border-[#27272a] pt-6">
            <h2 className="text-base font-bold text-zinc-100">7. Contact Us</h2>
            <p>
              If you have any questions or concerns regarding this Privacy Policy, please contact our privacy team at:{" "}
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
