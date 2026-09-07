"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";

const CHECKOUT_URL =
  "https://tinyog.lemonsqueezy.com/checkout/buy/50754932-62b6-4a13-af8c-5855c124da1e";

type ThemeOption = {
  id: "dark" | "gradient" | "minimal" | "terminal";
  name: "Dark" | "Gradient" | "Minimal" | "Terminal";
  desc: string;
  previewClass: string;
  isPro?: boolean;
};

const THEMES: ThemeOption[] = [
  {
    id: "dark",
    name: "Dark",
    desc: "Classic navy & matrix grid",
    previewClass: "bg-zinc-900 border-zinc-700",
    isPro: false,
  },
  {
    id: "gradient",
    name: "Gradient",
    desc: "Vibrant tech mesh gradient",
    previewClass: "bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 border-zinc-600",
    isPro: true,
  },
  {
    id: "minimal",
    name: "Minimal",
    desc: "Clean editorial white typography",
    previewClass: "bg-zinc-100 border-zinc-300",
    isPro: false,
  },
  {
    id: "terminal",
    name: "Terminal",
    desc: "macOS developer console",
    previewClass: "bg-zinc-950 border-zinc-700",
    isPro: true,
  },
];

type LicenseVerificationStatus = "idle" | "verifying" | "valid" | "invalid";

export default function Home() {
  const [title, setTitle] = useState(
    "How to Generate Dynamic Open Graph Images at the Edge"
  );
  const [tag, setTag] = useState("TUTORIAL");
  const [theme, setTheme] = useState<"dark" | "gradient" | "minimal" | "terminal">(
    "dark"
  );
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

  // Action button feedback states
  const [htmlCopied, setHtmlCopied] = useState(false);
  const [urlCopied, setUrlCopied] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
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
  const keyParam = debouncedKey.trim()
    ? `&key=${encodeURIComponent(debouncedKey.trim())}`
    : "";

  const ogPath = `/api/og?title=${encodeURIComponent(
    effectiveTitle
  )}&tag=${encodeURIComponent(effectiveTag)}&theme=${theme}${keyParam}`;

  const exportOrigin =
    origin && !origin.includes("localhost") ? origin : "https://tinyog.cloud";

  const fullOgUrl = `${exportOrigin}${ogPath}`;
  const metaTagSnippet = `<meta property="og:image" content="${fullOgUrl}" />`;

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

  const handleThemeChange = (
    newTheme: "dark" | "gradient" | "minimal" | "terminal"
  ) => {
    setTheme(newTheme);
    if (!isProVerified && (newTheme === "gradient" || newTheme === "terminal")) {
      showToast("Showing PRO Theme Demo (Watermarked)");
    }
  };

  const handleCopyHtml = async () => {
    try {
      await navigator.clipboard.writeText(metaTagSnippet);
      setHtmlCopied(true);
      showToast("HTML Meta Tag copied to clipboard");
      setTimeout(() => setHtmlCopied(false), 2000);
    } catch {
      showToast("Failed to copy to clipboard");
    }
  };

  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(fullOgUrl);
      setUrlCopied(true);
      showToast("Image URL copied to clipboard");
      setTimeout(() => setUrlCopied(false), 2000);
    } catch {
      showToast("Failed to copy image URL");
    }
  };

  const handleDownload = async () => {
    try {
      setIsDownloading(true);
      const response = await fetch(ogPath);
      if (!response.ok) throw new Error("Download failed");

      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;

      const safeTitle = (debouncedTitle || "social-card")
        .replace(/[^a-zA-Z0-9\s-_]/g, "")
        .trim()
        .slice(0, 30);
      link.download = `tinyog-${safeTitle || "social-card"}-${theme}.png`;

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);

      setDownloadSuccess(true);
      showToast("PNG image downloaded successfully");
      setTimeout(() => setDownloadSuccess(false), 2500);
    } catch (error) {
      console.error(error);
      showToast("Failed to download image");
    } finally {
      setIsDownloading(false);
    }
  };

  const presets = [
    {
      title: "Building High-Performance Web Apps with Next.js 15",
      tag: "FRONTEND",
      theme: "dark" as const,
    },
    {
      title: "Zero-Config Open Graph Image Generation at the Edge",
      tag: "VERCEL / OG",
      theme: "gradient" as const,
    },
    {
      title: "Clean Code Architecture for Modern Engineering Teams",
      tag: "GUIDE",
      theme: "minimal" as const,
    },
    {
      title: "git commit -m 'Ship TinyOG v1.0 to Production'",
      tag: "CLI",
      theme: "terminal" as const,
    },
  ];

  const isCurrentThemePro = theme === "gradient" || theme === "terminal";
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

          {/* Theme Selection Section */}
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
                const isSelected = theme === t.id;
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => handleThemeChange(t.id)}
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
                    Unlock {theme.toUpperCase()} for production use:
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
                onChange={(e) => setLicenseKey(e.target.value)}
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
                  onClick={() => setLicenseKey("")}
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
                <a
                  href={CHECKOUT_URL}
                  target="_blank"
                  rel="noreferrer"
                  className="underline hover:text-rose-300 font-sans font-medium"
                >
                  Buy Lifetime Pass ($29) →
                </a>
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
              onChange={(e) => setTag(e.target.value)}
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
              onChange={(e) => setTitle(e.target.value)}
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
              {presets.map((preset, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setTitle(preset.title);
                    setTag(preset.tag);
                    setTheme(preset.theme);
                  }}
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
                onClick={handleCopyUrl}
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
        </div>

        {/* Right Side: Real-time Preview & Export Panel (7 cols) */}
        <div className="lg:col-span-7 flex flex-col gap-6 lg:sticky lg:top-8">
          {/* Main Preview Container with macOS Window Frame */}
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

          {/* HTML Meta Tag Export Card */}
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
                  onClick={handleCopyHtml}
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
