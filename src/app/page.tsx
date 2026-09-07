"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { ThemeId, LicenseVerificationStatus, PresetItem } from "@/types";
import { CHECKOUT_URL, PRO_THEME_IDS } from "@/lib/constants";
import {
  generateOgPath,
  generateFullOgUrl,
  generateMetaTagSnippet,
} from "@/lib/og-url";
import { useCopy } from "@/hooks/use-copy";
import { ThemeSelector } from "@/components/editor/ThemeSelector";
import { CardForm } from "@/components/editor/CardForm";
import { PreviewFrame } from "@/components/preview/PreviewFrame";
import { ExportPanel } from "@/components/export/ExportPanel";

export default function Home() {
  const [title, setTitle] = useState(
    "How to Generate Dynamic Open Graph Images at the Edge"
  );
  const [tag, setTag] = useState("TUTORIAL");
  const [theme, setTheme] = useState<ThemeId>("dark");
  const [licenseKey, setLicenseKey] = useState("");
  const [debouncedTitle, setDebouncedTitle] = useState(title);
  const [debouncedTag, setDebouncedTag] = useState(tag);
  const [debouncedKey, setDebouncedKey] = useState(licenseKey);

  // License verification state
  const [licenseStatus, setLicenseStatus] =
    useState<LicenseVerificationStatus>("idle");
  const [isProVerified, setIsProVerified] = useState(false);

  // Smooth flicker-free image loading states
  const [displayedImgUrl, setDisplayedImgUrl] = useState("");
  const [isImageLoading, setIsImageLoading] = useState(true);

  // Clipboard copy hooks
  const { copied: htmlCopied, copy: copyHtml } = useCopy(2000);
  const { copied: urlCopied, copy: copyUrl } = useCopy(2000);

  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [origin, setOrigin] = useState("https://tinyog.cloud");

  const verifyControllerRef = useRef<AbortController | null>(null);

  // Retrieve window origin and cached license key on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      setOrigin(window.location.origin);
      try {
        const savedKey = localStorage.getItem("tinyog_license_key");
        if (savedKey) {
          setLicenseKey(savedKey);
        }
      } catch {
        // localStorage unavailable
      }
    }
  }, []);

  // Debounce inputs (300ms)
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedTitle(title);
      setDebouncedTag(tag);
      setDebouncedKey(licenseKey);
    }, 300);

    return () => clearTimeout(handler);
  }, [title, tag, licenseKey]);

  // Real-time license verification against /api/license/verify
  useEffect(() => {
    const trimmed = debouncedKey.trim();
    if (!trimmed) {
      setLicenseStatus("idle");
      setIsProVerified(false);
      return;
    }

    if (verifyControllerRef.current) {
      verifyControllerRef.current.abort();
    }
    const controller = new AbortController();
    verifyControllerRef.current = controller;

    setLicenseStatus("verifying");

    fetch("/api/license/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ key: trimmed }),
      signal: controller.signal,
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.valid) {
          setLicenseStatus("valid");
          setIsProVerified(true);
          try {
            localStorage.setItem("tinyog_license_key", trimmed);
          } catch {
            // ignore
          }
          showToast("PRO License Active — Watermarks removed.");
        } else {
          setLicenseStatus("invalid");
          setIsProVerified(false);
        }
      })
      .catch((err) => {
        if (err.name !== "AbortError") {
          setLicenseStatus("invalid");
          setIsProVerified(false);
        }
      });

    return () => controller.abort();
  }, [debouncedKey]);

  const effectiveTitle = debouncedTitle.trim() || "Your Dynamic Title Goes Here";
  const effectiveTag = debouncedTag.trim() || "ARTICLE";

  const ogPath = generateOgPath({
    title: effectiveTitle,
    tag: effectiveTag,
    theme,
    licenseKey: debouncedKey,
  });

  const fullOgUrl = generateFullOgUrl(
    {
      title: effectiveTitle,
      tag: effectiveTag,
      theme,
      licenseKey: debouncedKey,
    },
    origin
  );

  const metaTagSnippet = generateMetaTagSnippet(fullOgUrl);

  // Flicker-free smooth image transition
  useEffect(() => {
    setIsImageLoading(true);
    const img = new Image();
    img.src = ogPath;
    img.onload = () => {
      setDisplayedImgUrl(ogPath);
      setIsImageLoading(false);
    };
    img.onerror = () => {
      setDisplayedImgUrl(ogPath);
      setIsImageLoading(false);
    };
  }, [ogPath]);

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage((prev) => (prev === message ? null : prev));
    }, 2800);
  };

  const handleThemeChange = (newTheme: ThemeId) => {
    setTheme(newTheme);
    if (!isProVerified && PRO_THEME_IDS.includes(newTheme)) {
      showToast("Showing PRO Theme Demo (Watermarked)");
    }
  };

  const handlePresetSelect = (preset: PresetItem) => {
    setTitle(preset.title);
    setTag(preset.tag);
    setTheme(preset.theme);
  };

  const handleCopyHtml = async () => {
    const success = await copyHtml(metaTagSnippet);
    if (success) {
      showToast("HTML Meta Tag copied to clipboard");
    } else {
      showToast("Failed to copy to clipboard");
    }
  };

  const handleCopyUrl = async () => {
    const success = await copyUrl(fullOgUrl);
    if (success) {
      showToast("Image URL copied to clipboard");
    } else {
      showToast("Failed to copy image URL");
    }
  };

  const isCurrentThemePro = PRO_THEME_IDS.includes(theme);
  const isDemoMode = isCurrentThemePro && !isProVerified;

  return (
    <main className="min-h-screen bg-[#09090b] text-[#f4f4f5] flex flex-col items-center justify-start p-4 sm:p-6 md:p-12 relative font-sans selection:bg-zinc-800 selection:text-zinc-100">
      {/* Top Navigation Header */}
      <header className="w-full max-w-6xl mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-[#27272a]">
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-400 text-[11px] font-mono uppercase tracking-wider">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              EDGE OG ENGINE
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-400 font-mono font-medium">
              v1.0
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
              <a
                href={CHECKOUT_URL}
                target="_blank"
                rel="noreferrer"
                className="w-full sm:w-auto px-4 py-2 rounded-lg bg-white hover:bg-[#e4e4e7] text-black font-semibold text-xs transition-colors duration-150 flex items-center justify-center gap-1.5 active:scale-95 shadow-sm"
              >
                <span>Get Lifetime Pass ($29)</span>
                <span>→</span>
              </a>
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

      {/* Main Headline */}
      <div className="w-full max-w-6xl mb-8">
        <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight text-[#fafafa] leading-snug">
          Lightning-fast Dynamic Social Cards with One URL
        </h2>
        <p className="mt-1 text-zinc-400 text-xs sm:text-sm max-w-2xl leading-relaxed">
          Zero-config Open Graph card generator for developers and bloggers. Preview in real-time, test all themes, and drop edge-cached URLs straight into your HTML meta tags.
        </p>
      </div>

      {/* Main App Grid */}
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Side: Editor & Settings Panel (5 cols) */}
        <div className="lg:col-span-5 bg-[#121215] border border-[#27272a] rounded-xl p-5 sm:p-6 flex flex-col gap-6">
          <div className="flex items-center justify-between border-b border-[#27272a] pb-3.5">
            <h3 className="text-xs font-bold text-zinc-300 uppercase tracking-wider flex items-center gap-2">
              Settings &amp; Themes
            </h3>
            <div className="flex items-center gap-1.5 text-xs text-zinc-400 font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span>Edge Sync</span>
            </div>
          </div>

          {/* Modular Theme Selector */}
          <ThemeSelector
            currentTheme={theme}
            onThemeChange={handleThemeChange}
            isProVerified={isProVerified}
            isDemoMode={isDemoMode}
          />

          {/* Modular Card Form & Presets */}
          <CardForm
            title={title}
            tag={tag}
            licenseKey={licenseKey}
            licenseStatus={licenseStatus}
            onTitleChange={setTitle}
            onTagChange={setTag}
            onLicenseKeyChange={setLicenseKey}
            onPresetSelect={handlePresetSelect}
            fullOgUrl={fullOgUrl}
            urlCopied={urlCopied}
            onCopyUrl={handleCopyUrl}
          />
        </div>

        {/* Right Side: Real-time Preview & Export Panel (7 cols) */}
        <div className="lg:col-span-7 flex flex-col gap-6 lg:sticky lg:top-8">
          {/* Modular Preview Container with macOS Window Frame */}
          <PreviewFrame
            theme={theme}
            ogPath={ogPath}
            displayedImgUrl={displayedImgUrl}
            isImageLoading={isImageLoading}
            isDemoMode={isDemoMode}
            title={effectiveTitle}
          />

          {/* Modular HTML Meta Tag Export Card */}
          <ExportPanel
            metaTagSnippet={metaTagSnippet}
            ogPath={ogPath}
            isDemoMode={isDemoMode}
            title={effectiveTitle}
            theme={theme}
            htmlCopied={htmlCopied}
            onCopyHtml={handleCopyHtml}
            onShowToast={showToast}
          />
        </div>
      </div>

      {/* Global Footer with Lemon Squeezy Compliance Links */}
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
                <a
                  href={CHECKOUT_URL}
                  target="_blank"
                  rel="noreferrer"
                  className="text-zinc-300 hover:text-white font-medium transition-colors"
                >
                  Buy Lifetime Pass ($29) →
                </a>
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

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-3.5 py-2.5 rounded-lg bg-zinc-900 border border-zinc-700 text-zinc-200 text-xs font-mono shadow-xl backdrop-blur-md animate-in fade-in slide-in-from-bottom-2 duration-150">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}
    </main>
  );
}
