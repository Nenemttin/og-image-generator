"use client";

import { useState } from "react";

interface FaqItem {
  question: string;
  answer: string;
}

const FAQ_ITEMS: FaqItem[] = [
  {
    question: "How does the $29 Lifetime Pass work?",
    answer:
      "Pay once, use forever. You get instant access to all 6 PRO themes, watermark-free rendering, and lifetime updates across unlimited personal and commercial domains.",
  },
  {
    question: "Are there any usage limits or domain restrictions?",
    answer:
      "No arbitrary caps. TinyOG runs entirely on stateless Edge functions and leverages Vercel's global CDN caching. You can generate unlimited cards across as many websites or client projects as you own.",
  },
  {
    question: "How does watermark removal work in production?",
    answer:
      "Once you enter your license key, your generated <meta> tag URL includes a unique API key parameter. Our Edge renderer automatically detects it and serves the clean, unbranded card instantly.",
  },
  {
    question: "Can I test PRO themes before buying?",
    answer:
      "Yes! You can preview all 8 themes (including PRO) and customize title, tags, and colors in real-time. PRO cards simply display a subtle demo watermark until you unlock a license.",
  },
  {
    question: "What is the refund policy?",
    answer:
      "We offer a no-questions-asked 14-day refund policy handled securely via Lemon Squeezy if TinyOG doesn't fit your workflow.",
  },
];

export function FaqSection() {
  // First item open by default for immediate conversion clarity
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleIndex = (index: number) => {
    setOpenIndex((current) => (current === index ? null : index));
  };

  return (
    <section className="w-full max-w-4xl mt-20 pt-10 border-t border-[#27272a] flex flex-col items-center">
      {/* Section Header */}
      <div className="text-center space-y-2 mb-10">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-400 text-[11px] font-mono uppercase tracking-wider mb-1">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          FAQ
        </div>
        <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight text-[#fafafa]">
          Frequently Asked Questions
        </h2>
        <p className="text-xs sm:text-sm text-zinc-400 max-w-xl mx-auto leading-relaxed">
          Everything you need to know about the TinyOG Lifetime Pass and edge rendering architecture.
        </p>
      </div>

      {/* Accordion List */}
      <div className="w-full flex flex-col gap-3">
        {FAQ_ITEMS.map((item, idx) => {
          const isOpen = openIndex === idx;

          return (
            <div
              key={idx}
              className={`rounded-xl border transition-colors duration-150 overflow-hidden ${
                isOpen
                  ? "bg-[#121215] border-zinc-700"
                  : "bg-[#121215]/60 border-[#27272a] hover:border-zinc-700 hover:bg-[#121215]"
              }`}
            >
              <button
                type="button"
                onClick={() => toggleIndex(idx)}
                className="w-full px-5 py-4 sm:px-6 sm:py-4.5 flex items-center justify-between text-left gap-4 cursor-pointer select-none"
                aria-expanded={isOpen}
              >
                <span className="text-xs sm:text-sm font-semibold text-zinc-200 tracking-tight">
                  {item.question}
                </span>

                <span
                  className={`w-5 h-5 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center shrink-0 text-zinc-400 transition-transform duration-200 ${
                    isOpen ? "rotate-180 text-zinc-200" : ""
                  }`}
                >
                  <svg
                    className="w-3 h-3"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2.5"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </span>
              </button>

              {isOpen && (
                <div className="px-5 pb-4 sm:px-6 sm:pb-5 pt-0 text-xs sm:text-sm text-zinc-400 leading-relaxed border-t border-[#27272a]/60 animate-in fade-in-50 duration-150">
                  <p className="pt-3">{item.answer}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Bottom Helper / Contact Text */}
      <div className="mt-8 text-center text-xs text-zinc-500 font-mono">
        <span>Have more questions? Reach out at </span>
        <a
          href="mailto:support@tinyog.cloud"
          className="text-zinc-300 hover:text-white underline font-medium transition-colors"
        >
          support@tinyog.cloud
        </a>
      </div>
    </section>
  );
}
