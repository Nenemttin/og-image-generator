"use client";

import Link from "next/link";
import { CheckoutButton } from "@/components/ui/CheckoutButton";

interface FooterProps {
  isProVerified: boolean;
}

export function Footer({ isProVerified }: FooterProps) {
  return (
    <footer className="w-full max-w-6xl mt-20 pt-8 border-t border-[#27272a] flex flex-col gap-4 text-xs text-zinc-500">
      {/* Top footer row: Service & Guarantee specs */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-zinc-400 text-xs font-mono">
        <div className="flex flex-wrap items-center gap-2.5">
          <span className="font-bold text-zinc-200">TinyOG</span>
          <span>•</span>
          <span>Lifetime Pass</span>
          <span>•</span>
          <span>$29 One-time</span>
          <span>•</span>
          <span className="text-zinc-300">14-day refund guarantee</span>
        </div>

        <div className="flex items-center gap-4 font-sans">
          {!isProVerified && (
            <>
              <CheckoutButton
                source="footer"
                className="text-zinc-300 hover:text-white font-medium transition-colors"
              >
                Buy Lifetime Pass ($29) →
              </CheckoutButton>
              <span>•</span>
            </>
          )}
          <a
            href="mailto:support@tinyog.cloud"
            className="hover:text-zinc-300 transition-colors"
          >
            support@tinyog.cloud
          </a>
        </div>
      </div>

      {/* Bottom footer row: Legal links & Copyright */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-zinc-900 text-[11px] text-zinc-600 font-mono">
        <p>© 2026 TinyOG (tinyog.cloud). All rights reserved.</p>

        <div className="flex items-center gap-4 text-zinc-500">
          <Link
            href="/terms"
            className="hover:text-zinc-300 transition-colors"
          >
            Terms of Service
          </Link>
          <span>•</span>
          <Link
            href="/privacy"
            className="hover:text-zinc-300 transition-colors"
          >
            Privacy Policy
          </Link>
          <span>•</span>
          <Link
            href="/refund"
            className="hover:text-zinc-300 transition-colors"
          >
            Refund Policy
          </Link>
        </div>
      </div>
    </footer>
  );
}
