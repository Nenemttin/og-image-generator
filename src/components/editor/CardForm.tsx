"use client";

import { LicenseVerificationStatus, PresetItem } from "@/types";
import { PRESETS } from "@/config/constants";
import { CheckoutButton } from "@/components/ui/CheckoutButton";

interface CardFormProps {
  title: string;
  tag: string;
  licenseKey: string;
  licenseStatus: LicenseVerificationStatus;
  onTitleChange: (title: string) => void;
  onTagChange: (tag: string) => void;
  onLicenseKeyChange: (key: string) => void;
  onPresetSelect: (preset: PresetItem) => void;
  fullOgUrl: string;
  urlCopied: boolean;
  onCopyUrl: () => void;
}

export function CardForm({
  title,
  tag,
  licenseKey,
  licenseStatus,
  onTitleChange,
  onTagChange,
  onLicenseKeyChange,
  onPresetSelect,
  fullOgUrl,
  urlCopied,
  onCopyUrl,
}: CardFormProps) {
  return (
    <>
      {/* License Key Field */}
      <div className="space-y-1.5 pt-2 border-t border-[#27272a]">
        <div className="flex items-center justify-between">
          <label
            htmlFor="key-input"
            className="block text-[11px] font-semibold text-zinc-400 uppercase tracking-wider font-mono"
          >
            LICENSE KEY
          </label>

          {licenseStatus === "verifying" && (
            <span className="text-[10px] text-zinc-400 font-mono flex items-center gap-1">
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
              Checking...
            </span>
          )}
          {licenseStatus === "valid" && (
            <span className="text-[10px] text-emerald-400 font-mono font-medium">
              ✓ Verified Pro
            </span>
          )}
          {licenseStatus === "invalid" && (
            <span className="text-[10px] text-rose-400 font-mono font-medium">
              ✕ Invalid Key
            </span>
          )}
          {licenseStatus === "idle" && (
            <span className="text-[10px] text-zinc-600 font-mono">
              Optional
            </span>
          )}
        </div>

        <div className="relative">
          <input
            id="key-input"
            type="password"
            value={licenseKey}
            onChange={(e) => onLicenseKeyChange(e.target.value)}
            placeholder="Paste Lemon Squeezy license key..."
            className={`w-full px-3.5 py-2 bg-[#09090b] border rounded-lg text-zinc-100 placeholder-zinc-600 text-xs font-mono transition-colors focus:outline-none ${
              licenseStatus === "valid"
                ? "border-emerald-500/70 bg-emerald-950/10 text-emerald-200"
                : licenseStatus === "invalid"
                ? "border-rose-500/70 bg-rose-950/10 text-rose-200"
                : "border-[#27272a] focus:border-zinc-500"
            }`}
          />

          {licenseKey && (
            <button
              type="button"
              onClick={() => onLicenseKeyChange("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 text-xs p-1 cursor-pointer"
              title="Clear key"
            >
              ✕
            </button>
          )}
        </div>

        {licenseStatus === "valid" ? (
          <p className="text-[11px] text-emerald-400 font-mono">
            ✓ PRO Active. Watermarks removed from exported cards.
          </p>
        ) : licenseStatus === "invalid" ? (
          <p className="text-[11px] text-rose-400 font-mono flex items-center justify-between">
            <span>✕ Invalid key.</span>
            <CheckoutButton
              source="card_form_invalid_key"
              className="underline hover:text-rose-300 font-sans font-medium"
            >
              Buy Lifetime Pass ($29) →
            </CheckoutButton>
          </p>
        ) : (
          <p className="text-[11px] text-zinc-500">
            Enter your license key to remove watermarks and unlock commercial exports.
          </p>
        )}
      </div>

      {/* TAG Input */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <label
            htmlFor="tag-input"
            className="block text-[11px] font-semibold text-zinc-400 uppercase tracking-wider font-mono"
          >
            TAG / CATEGORY
          </label>
          <span className="text-[10px] text-zinc-600 font-mono">
            {tag.length}/30
          </span>
        </div>
        <input
          id="tag-input"
          type="text"
          maxLength={30}
          value={tag}
          onChange={(e) => onTagChange(e.target.value)}
          placeholder="e.g. TUTORIAL, RELEASE, NEXT.JS"
          className="w-full px-3.5 py-2 bg-[#09090b] border border-[#27272a] rounded-lg text-zinc-100 placeholder-zinc-600 text-xs focus:outline-none focus:border-zinc-500 transition-colors font-mono"
        />
      </div>

      {/* TITLE Input */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <label
            htmlFor="title-input"
            className="block text-[11px] font-semibold text-zinc-400 uppercase tracking-wider font-mono"
          >
            TITLE
          </label>
          <span className="text-[10px] text-zinc-600 font-mono">
            {title.length}/100
          </span>
        </div>
        <textarea
          id="title-input"
          rows={3}
          maxLength={100}
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
          placeholder="Enter your card headline..."
          className="w-full px-3.5 py-2.5 bg-[#09090b] border border-[#27272a] rounded-lg text-zinc-100 placeholder-zinc-600 text-xs sm:text-sm focus:outline-none focus:border-zinc-500 transition-colors resize-none leading-relaxed"
        />
      </div>

      {/* Presets */}
      <div className="space-y-2 pt-2 border-t border-[#27272a]">
        <label className="block text-[11px] font-semibold text-zinc-500 uppercase tracking-wider font-mono">
          PRESETS
        </label>
        <div className="flex flex-wrap gap-1.5">
          {PRESETS.map((preset, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => onPresetSelect(preset)}
              className="text-[11px] px-2.5 py-1 rounded bg-zinc-950 border border-[#27272a] hover:bg-zinc-800 hover:border-zinc-700 text-zinc-300 hover:text-white transition-colors duration-150 flex items-center gap-1.5 cursor-pointer font-mono"
            >
              <span>{preset.tag}</span>
              <span className="text-zinc-600 uppercase">
                ({preset.theme})
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Direct Endpoint URL Box */}
      <div className="pt-3 border-t border-[#27272a] space-y-1.5">
        <div className="flex items-center justify-between text-xs text-zinc-400">
          <span className="font-mono text-[11px] text-zinc-400">Direct Image Endpoint</span>
          <button
            type="button"
            onClick={onCopyUrl}
            className="text-[11px] text-zinc-300 hover:text-white font-mono transition-colors cursor-pointer"
          >
            {urlCopied ? (
              <span className="text-emerald-400">✓ Copied</span>
            ) : (
              <span>Copy URL</span>
            )}
          </button>
        </div>
        <div className="p-2.5 bg-[#09090b] border border-[#27272a] rounded-lg font-mono text-[11px] text-zinc-400 truncate select-all">
          {fullOgUrl}
        </div>
      </div>
    </>
  );
}
