"use client";

import { CheckoutButton } from "@/components/ui/CheckoutButton";

interface HeaderProps {
  isProVerified: boolean;
}

export function Header({ isProVerified }: HeaderProps) {
  return (
    <header className="w-full max-w-6xl mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-[#27272a]">
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-400 text-[11px] font-mono uppercase tracking-wider">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            EDGE OG ENGINE
          </span>
          <span className="text-[10px] px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-400 font-mono font-medium">
            v1.1
          </span>
        </div>

        {/* Logo & Status Badges */}
        <div className="flex items-center gap-3">
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-[#fafafa]">
            TinyOG
          </h1>

          {isProVerified ? (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-zinc-900 border border-emerald-500/50 text-emerald-400 text-[11px] font-mono tracking-wide uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              LIFETIME PASS ACTIVE
            </span>
          ) : (
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-400 font-mono tracking-wider uppercase">
              BETA
            </span>
          )}
        </div>
      </div>

      {/* Top Right Checkout CTA */}
      <div className="flex flex-col sm:items-end gap-1.5 w-full sm:w-auto">
        {!isProVerified ? (
          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <span className="hidden sm:inline-flex text-[10px] px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-400 font-mono font-semibold uppercase tracking-wider">
              LTD 50% OFF
            </span>
            <CheckoutButton
              source="header"
              className="w-full sm:w-auto px-4 py-2 rounded-lg bg-white hover:bg-[#e4e4e7] text-black font-semibold text-xs transition-colors duration-150 flex items-center justify-center gap-1.5 active:scale-95 shadow-sm"
            >
              <span>Get Lifetime Pass ($29)</span>
              <span>→</span>
            </CheckoutButton>
          </div>
        ) : (
          <div className="flex items-center gap-2 text-xs text-emerald-400 font-mono px-3 py-1 rounded bg-zinc-900 border border-emerald-500/30">
            <span>✓ Verified Customer</span>
            <span>•</span>
            <span className="text-zinc-400 font-sans">Commercial License</span>
          </div>
        )}
        <span className="text-[11px] text-zinc-500 text-left sm:text-right flex items-center gap-1 font-mono">
          <span>✓</span> 14-day refund guarantee • No recurring fees
        </span>
      </div>
    </header>
  );
}
