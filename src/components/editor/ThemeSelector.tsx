"use client";

import { ThemeId } from "@/types";
import { THEMES, CHECKOUT_URL } from "@/lib/constants";

interface ThemeSelectorProps {
  currentTheme: ThemeId;
  onThemeChange: (theme: ThemeId) => void;
  isProVerified: boolean;
  isDemoMode: boolean;
}

export function ThemeSelector({
  currentTheme,
  onThemeChange,
  isProVerified,
  isDemoMode,
}: ThemeSelectorProps) {
  return (
    <div className="space-y-2.5">
      <div className="flex items-center justify-between">
        <label className="block text-[11px] font-semibold text-zinc-400 uppercase tracking-wider font-mono">
          Select Theme
        </label>
        {isProVerified ? (
          <span className="text-[10px] text-emerald-400 font-mono">
            ✓ Pro Active
          </span>
        ) : (
          <span className="text-[10px] text-zinc-500 font-mono">
            2 Free • 2 Pro
          </span>
        )}
      </div>

      <div className="grid grid-cols-2 gap-2">
        {THEMES.map((t) => {
          const isSelected = currentTheme === t.id;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => onThemeChange(t.id)}
              className={`relative p-3 rounded-lg border text-left transition-colors duration-150 flex flex-col gap-1.5 cursor-pointer ${
                isSelected
                  ? "bg-zinc-800/90 border-zinc-400 text-zinc-100"
                  : "bg-zinc-950/60 border-[#27272a] hover:bg-zinc-800/40 hover:border-zinc-700 text-zinc-400"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span
                    className={`w-3 h-3 rounded-full border border-zinc-700 ${t.previewClass}`}
                  />
                  <span
                    className={`text-xs font-semibold ${
                      isSelected ? "text-white" : "text-zinc-300"
                    }`}
                  >
                    {t.name}
                  </span>
                </div>

                {t.isPro && (
                  <span className="text-[9px] px-1.5 py-0.2 rounded font-mono font-bold uppercase bg-zinc-800 text-zinc-300 border border-zinc-700">
                    PRO
                  </span>
                )}
              </div>
              <span className="text-[10px] text-zinc-500 line-clamp-1">
                {t.desc}
              </span>
            </button>
          );
        })}
      </div>

      {/* Mono Minimalist Unlock PRO Banner */}
      {isDemoMode && (
        <div className="mt-3 p-3.5 rounded-lg bg-zinc-900/60 border border-[#27272a] flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono font-bold tracking-wider px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 border border-zinc-700 uppercase">
              PRO THEME
            </span>
            <span className="text-xs font-mono font-bold text-zinc-200">
              $29 <span className="line-through text-zinc-600 font-normal">$59</span>
            </span>
          </div>

          <div className="space-y-1">
            <p className="text-xs font-medium text-zinc-200">
              Unlock {currentTheme.toUpperCase()} for production use:
            </p>
            <ul className="text-[11px] text-zinc-400 space-y-1 pt-0.5">
              <li className="flex items-center gap-1.5">
                <span className="text-zinc-300">✓</span>
                <span>Remove demo watermarks permanently</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="text-zinc-300">✓</span>
                <span>Full access to Gradient &amp; Terminal themes</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="text-zinc-300">✓</span>
                <span>Unlimited Edge API requests worldwide</span>
              </li>
            </ul>
          </div>

          <a
            href={CHECKOUT_URL}
            target="_blank"
            rel="noreferrer"
            className="w-full py-2 px-3 rounded-lg bg-white hover:bg-[#e4e4e7] text-black font-semibold text-xs text-center transition-colors duration-150 flex items-center justify-center gap-1.5 shadow-sm active:scale-[0.98]"
          >
            <span>Get Lifetime Pass ($29)</span>
            <span>→</span>
          </a>
        </div>
      )}
    </div>
  );
}
