"use client";

import { ThemeId } from "@/types";

interface PreviewFrameProps {
  theme: ThemeId;
  ogPath: string;
  displayedImgUrl: string;
  isImageLoading: boolean;
  isDemoMode: boolean;
  title: string;
}

export function PreviewFrame({
  theme,
  ogPath,
  displayedImgUrl,
  isImageLoading,
  isDemoMode,
  title,
}: PreviewFrameProps) {
  const effectiveTitle = title.trim() || "Your Dynamic Title Goes Here";

  return (
    <div className="bg-[#121215] border border-[#27272a] rounded-xl p-5 sm:p-6 flex flex-col gap-4">
      {/* macOS Window Title Bar */}
      <div className="flex items-center justify-between border-b border-[#27272a] pb-3">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-[#ff5f56] inline-block" />
          <span className="w-3 h-3 rounded-full bg-[#ffbd2e] inline-block" />
          <span className="w-3 h-3 rounded-full bg-[#27c93f] inline-block" />
          <span className="ml-2 font-mono text-[11px] text-zinc-400 flex items-center gap-2">
            <span className="text-zinc-200">tinyog-preview.png</span>
            <span>•</span>
            <span>1200 × 630</span>
          </span>
        </div>

        {/* Status / Live Indicator */}
        <div className="flex items-center gap-2">
          {isImageLoading ? (
            <span className="text-[11px] text-zinc-400 flex items-center gap-1.5 font-mono">
              <svg
                className="animate-spin h-3 w-3 text-zinc-400"
                viewBox="0 0 24 24"
                fill="none"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8H4z"
                />
              </svg>
              Rendering...
            </span>
          ) : isDemoMode ? (
            <span className="text-[10px] px-2 py-0.5 rounded bg-zinc-800 border border-zinc-700 text-zinc-300 font-mono uppercase tracking-wider">
              PRO Demo Mode
            </span>
          ) : (
            <span className="text-[11px] text-zinc-400 flex items-center gap-1.5 font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              Ready
            </span>
          )}

          <a
            href={ogPath}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs px-2.5 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white transition-colors border border-zinc-700/80 font-mono"
            title="Open raw image in new tab"
          >
            Raw Image
          </a>
        </div>
      </div>

      {/* Exact 1200:630 Aspect Ratio Frame with Smooth Crossfade */}
      <div className="relative w-full aspect-[1200/630] rounded-lg overflow-hidden bg-[#09090b] border border-[#27272a] flex items-center justify-center">
        {displayedImgUrl ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={displayedImgUrl}
            alt={`TinyOG Preview for ${effectiveTitle}`}
            className={`w-full h-full object-cover transition-opacity duration-150 ${
              isImageLoading ? "opacity-75" : "opacity-100"
            }`}
          />
        ) : (
          <div className="flex items-center gap-2 text-zinc-500 text-xs font-mono">
            <span>Rendering card...</span>
          </div>
        )}

        {/* Subdued Top Progress Bar */}
        {isImageLoading && (
          <div className="absolute top-0 left-0 right-0 h-0.5 bg-zinc-300 animate-pulse" />
        )}

        {/* Floating Pro Preview Badge */}
        {isDemoMode && (
          <div className="absolute top-3 right-3 px-2.5 py-1 rounded bg-zinc-950/90 backdrop-blur-md border border-zinc-700 text-zinc-300 text-[10px] font-mono uppercase tracking-wider flex items-center gap-1.5 shadow-md pointer-events-none">
            <span className="w-1.5 h-1.5 rounded-full bg-zinc-400" />
            <span>PRO Demo</span>
          </div>
        )}
      </div>

      {/* Dimensions and specs info */}
      <div className="flex items-center justify-between text-[11px] text-zinc-500 font-mono pt-1">
        <span>1200 × 630 px • Edge Rendered</span>
        <span className="uppercase text-zinc-400">
          Theme: {theme}
        </span>
      </div>
    </div>
  );
}
