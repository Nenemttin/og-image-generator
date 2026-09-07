"use client";

import { useState } from "react";
import { ThemeId } from "@/types";
import { CHECKOUT_URL } from "@/lib/constants";

interface ExportPanelProps {
  metaTagSnippet: string;
  ogPath: string;
  isDemoMode: boolean;
  title: string;
  theme: ThemeId;
  htmlCopied: boolean;
  onCopyHtml: () => void;
  onShowToast?: (message: string) => void;
}

export function ExportPanel({
  metaTagSnippet,
  ogPath,
  isDemoMode,
  title,
  theme,
  htmlCopied,
  onCopyHtml,
  onShowToast,
}: ExportPanelProps) {
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const handleDownload = async () => {
    try {
      setIsDownloading(true);
      const response = await fetch(ogPath);
      if (!response.ok) throw new Error("Download failed");

      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;

      const safeTitle = (title || "social-card")
        .replace(/[^a-zA-Z0-9\s-_]/g, "")
        .trim()
        .slice(0, 30);
      link.download = `tinyog-${safeTitle || "social-card"}-${theme}.png`;

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);

      setDownloadSuccess(true);
      onShowToast?.("PNG image downloaded successfully");
      setTimeout(() => setDownloadSuccess(false), 2500);
    } catch (error) {
      console.error(error);
      onShowToast?.("Failed to download image");
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="bg-[#121215] border border-[#27272a] rounded-xl p-5 sm:p-6 flex flex-col gap-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#27272a] pb-3">
        <div className="flex items-center gap-2">
          <svg
            className="w-4 h-4 text-zinc-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
            />
          </svg>
          <h3 className="text-xs font-bold text-zinc-300 uppercase tracking-wider font-mono">
            HTML Meta Tag &amp; Export
          </h3>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          {/* Copy Meta Tag Button */}
          <button
            type="button"
            onClick={onCopyHtml}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors duration-150 flex items-center gap-1.5 cursor-pointer ${
              htmlCopied
                ? "bg-emerald-600 text-white"
                : "bg-white hover:bg-[#e4e4e7] text-black"
            }`}
          >
            {htmlCopied ? (
              <>
                <svg
                  className="w-3.5 h-3.5 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2.5"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span>Copied!</span>
              </>
            ) : (
              <>
                <svg
                  className="w-3.5 h-3.5 text-black"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                  />
                </svg>
                <span>Copy Meta Tag</span>
              </>
            )}
          </button>

          {/* Download PNG Button */}
          <button
            type="button"
            onClick={handleDownload}
            disabled={isDownloading}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-colors duration-150 flex items-center gap-1.5 border border-[#27272a] bg-zinc-900 hover:bg-zinc-800 text-zinc-200 cursor-pointer disabled:opacity-50 ${
              downloadSuccess ? "border-emerald-500/50 text-emerald-300" : ""
            }`}
          >
            {isDownloading ? (
              <>
                <svg
                  className="animate-spin h-3.5 w-3.5 text-zinc-300"
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
                <span>Saving...</span>
              </>
            ) : downloadSuccess ? (
              <>
                <svg
                  className="w-3.5 h-3.5 text-emerald-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2.5"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span>Downloaded</span>
              </>
            ) : (
              <>
                <svg
                  className="w-3.5 h-3.5 text-zinc-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                  />
                </svg>
                <span>Download PNG</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Code Snippet Box */}
      <div className="relative">
        <pre className="p-3.5 bg-[#09090b] border border-[#27272a] rounded-lg font-mono text-xs text-zinc-300 select-all overflow-x-auto whitespace-pre-wrap break-all leading-relaxed">
          {metaTagSnippet}
        </pre>
      </div>

      <p className="text-[11px] text-zinc-500 leading-relaxed font-mono">
        Paste this tag into your <code className="text-zinc-400">&lt;head&gt;</code> section for instant rich previews on X, Discord, and LinkedIn.
      </p>

      {/* Pro Preview Notice */}
      {isDemoMode && (
        <div className="p-3 bg-zinc-900/40 border border-[#27272a] rounded-lg text-xs text-zinc-400 flex items-start gap-2">
          <span className="text-zinc-300 font-mono">ℹ</span>
          <div className="leading-relaxed text-[11px]">
            Rendering in <strong>PRO Demo Mode</strong> (includes demo watermark). To remove watermarks for commercial use, activate your{" "}
            <a
              href={CHECKOUT_URL}
              target="_blank"
              rel="noreferrer"
              className="text-white underline hover:text-zinc-300 font-semibold"
            >
              Lifetime Pass ($29) →
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
