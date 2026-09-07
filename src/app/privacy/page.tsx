import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy — TinyOG",
  description: "Privacy Policy for TinyOG - Dynamic Open Graph Image Generator",
};

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-start p-6 md:p-12 relative overflow-hidden font-sans">
      {/* Background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[350px] bg-purple-600/10 blur-[120px] rounded-full pointer-events-none -z-10" />

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
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-semibold uppercase tracking-wider mb-3">
            Privacy &amp; Data Security
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white">
            Privacy Policy
          </h1>
          <p className="text-xs text-slate-400 mt-2">
            Last updated: September 7, 2026
          </p>
        </header>

        {/* Content */}
        <div className="flex flex-col gap-6 text-slate-300 text-sm leading-relaxed">
          <section className="flex flex-col gap-2">
            <h2 className="text-lg font-bold text-white">1. Introduction</h2>
            <p>
              At TinyOG, we strongly value your privacy. We are committed to transparency and collecting only the minimal information necessary to deliver our edge-rendered social card generation service.
            </p>
          </section>

          <section className="flex flex-col gap-2">
            <h2 className="text-lg font-bold text-white">2. Information We Collect</h2>
            <p>
              <strong>Account-Free Architecture:</strong> TinyOG does not require an account or password to create or generate social cards.
            </p>
            <p>
              <strong>Payment Data:</strong> All financial transactions are processed directly by our merchant of record, <strong>Lemon Squeezy</strong>. We never view, collect, or store your credit card numbers, billing addresses, or banking credentials.
            </p>
            <p>
              <strong>License Verification:</strong> When you provide a license key, we query the Lemon Squeezy validation API securely via encrypted HTTPS to determine your Pro status.
            </p>
            <p>
              <strong>URL Parameters:</strong> The titles, tags, and theme preferences you pass in query strings are ephemeral and processed in-memory at the edge solely to generate the rendered PNG binary.
            </p>
          </section>

          <section className="flex flex-col gap-2">
            <h2 className="text-lg font-bold text-white">3. Cookies &amp; Local Storage</h2>
            <p>
              We do not use tracking cookies or advertising pixels. Your browser may use local state memory strictly to remember your active inputs and license key for your convenience while using the web studio.
            </p>
          </section>

          <section className="flex flex-col gap-2">
            <h2 className="text-lg font-bold text-white">4. Third-Party Service Providers</h2>
            <p>We work with trusted infrastructure providers:</p>
            <ul className="list-disc pl-5 space-y-1 text-slate-400">
              <li>
                <strong>Lemon Squeezy:</strong> Payment processing, tax remittance, and license key issuance.
              </li>
              <li>
                <strong>Vercel:</strong> Edge network hosting and CDN caching for sub-second image delivery.
              </li>
            </ul>
          </section>

          <section className="flex flex-col gap-2">
            <h2 className="text-lg font-bold text-white">5. Data Retention &amp; Security</h2>
            <p>
              We employ industry-standard encryption (TLS/HTTPS) across all network calls. Because we do not store customer databases of generated text or personal identifiers, there is zero risk of personal profile leakage.
            </p>
          </section>

          <section className="flex flex-col gap-2">
            <h2 className="text-lg font-bold text-white">6. Your Rights (GDPR / CCPA)</h2>
            <p>
              Under global data protection laws (such as GDPR and CCPA), you have the right to request access, correction, or deletion of any billing records held by our payment processor. To exercise these rights, please reach out directly to support@tinyog.com.
            </p>
          </section>

          <section className="flex flex-col gap-2 border-t border-slate-800/80 pt-6">
            <h2 className="text-lg font-bold text-white">7. Contact Us</h2>
            <p>
              If you have any questions or concerns regarding this Privacy Policy, please contact our privacy team at:{" "}
              <a
                href="mailto:support@tinyog.com"
                className="text-purple-400 hover:text-purple-300 underline font-medium"
              >
                support@tinyog.com
              </a>
            </p>
          </section>
        </div>

        {/* Footer info */}
        <footer className="mt-8 pt-6 border-t border-slate-800/80 text-xs text-slate-500 flex items-center justify-between">
          <span>© 2026 TinyOG. All rights reserved.</span>
          <Link href="/" className="text-slate-400 hover:text-white transition-colors">
            Return to Generator
          </Link>
        </footer>
      </div>
    </main>
  );
}
