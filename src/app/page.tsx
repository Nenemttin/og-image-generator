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
  glowClass: string;
  badge: string;
  isPro?: boolean;
};

const THEMES: ThemeOption[] = [
  {
    id: "dark",
    name: "Dark",
    desc: "Classic navy & dot matrix grid",
    previewClass: "bg-slate-900 border-slate-700",
    glowClass: "shadow-[0_20px_60px_-15px_rgba(59,130,246,0.3)]",
    badge: "bg-blue-500/20 text-blue-400 border-blue-500/30",
    isPro: false,
  },
  {
    id: "gradient",
    name: "Gradient",
    desc: "Trendy indigo-purple tech mesh",
    previewClass:
      "bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 border-purple-400/40",
    glowClass: "shadow-[0_25px_70px_-15px_rgba(147,51,234,0.4)]",
    badge: "bg-white/25 text-white border-white/40",
    isPro: true,
  },
  {
    id: "minimal",
    name: "Minimal",
    desc: "Editorial white & subtle typography",
    previewClass: "bg-slate-100 border-slate-300",
    glowClass: "shadow-[0_20px_60px_-15px_rgba(255,255,255,0.12)]",
    badge: "bg-slate-200 text-slate-800 border-slate-300",
    isPro: false,
  },
  {
    id: "terminal",
    name: "Terminal",
    desc: "macOS console with command prompt",
    previewClass: "bg-zinc-900 border-zinc-700",
    glowClass: "shadow-[0_25px_70px_-15px_rgba(34,197,94,0.25)]",
    badge: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
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

  // Micro-interaction action button states
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
        // localStorage not available
      }
    }
  }, []);

  // Debounce text inputs (300ms)
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
          showToast("✨ PRO License Verified! Watermark removed.");
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

  // Current calculated endpoint URL
  const effectiveTitle = debouncedTitle.trim() || "Your Dynamic Title Goes Here";
  const effectiveTag = debouncedTag.trim() || "ARTICLE";
  const keyParam = debouncedKey.trim()
    ? `&key=${encodeURIComponent(debouncedKey.trim())}`
    : "";

  const ogPath = `/api/og?title=${encodeURIComponent(
    effectiveTitle
  )}&tag=${encodeURIComponent(effectiveTag)}&theme=${theme}${keyParam}`;

  // Prioritize production domain tinyog.cloud for export snippets
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

  // Toast notification helper
  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage((prev) => (prev === message ? null : prev));
    }, 2800);
  };

  // Theme selection handler
  const handleThemeChange = (
    newTheme: "dark" | "gradient" | "minimal" | "terminal"
  ) => {
    setTheme(newTheme);
    if (!isProVerified && (newTheme === "gradient" || newTheme === "terminal")) {
      showToast("🔒 Showing PRO Theme Demo. Demo watermark included.");
    }
  };

  // Copy HTML Meta Tag
  const handleCopyHtml = async () => {
    try {
      await navigator.clipboard.writeText(metaTagSnippet);
      setHtmlCopied(true);
      showToast("✓ HTML Meta Tag copied to clipboard!");
      setTimeout(() => setHtmlCopied(false), 2200);
    } catch {
      showToast("Failed to copy to clipboard.");
    }
  };

  // Copy Image URL
  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(fullOgUrl);
      setUrlCopied(true);
      showToast("✓ Image URL copied to clipboard!");
      setTimeout(() => setUrlCopied(false), 2200);
    } catch {
      showToast("Failed to copy image URL.");
    }
  };

  // Download rendered PNG image
  const handleDownload = async () => {
    try {
      setIsDownloading(true);
      const response = await fetch(ogPath);
      if (!response.ok) throw new Error("Download failed");

      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;

      const safeTitle = (debouncedTitle || "thumbnail")
        .replace(/[^a-zA-Z0-9\s-_]/g, "")
        .trim()
        .slice(0, 30);
      link.download = `tinyog-${safeTitle || "social-card"}-${theme}.png`;

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);

      setDownloadSuccess(true);
      showToast("✓ PNG image downloaded successfully!");
      setTimeout(() => setDownloadSuccess(false), 2500);
    } catch (error) {
      console.error(error);
      showToast("Failed to download image.");
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

  const activeThemeConfig =
    THEMES.find((t) => t.id === theme) || THEMES[0];
  const isCurrentThemePro =
    theme === "gradient" || theme === "terminal";
  const isDemoMode = isCurrentThemePro && !isProVerified;

  return (
    <main className="min-h-screen bg-[#070b14] text-slate-100 flex flex-col items-center justify-start p-4 sm:p-6 md:p-12 relative overflow-hidden font-sans selection:bg-purple-500/30 selection:text-purple-200">
      {/* Background ambient lighting */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[450px] bg-gradient-to-b from-indigo-600/15 via-purple-600/10 to-transparent blur-[140px] rounded-full pointer-events-none -z-10" />
      <div className="absolute top-[20%] right-0 w-[500px] h-[500px] bg-blue-600/10 blur-[150px] rounded-full pointer-events-none -z-10" />

      {/* Top Navigation Header */}
      <header className="w-full max-w-6xl mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-800/80">
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[11px] font-bold uppercase tracking-wider">
              <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
              EDGE OG ENGINE
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-md bg-slate-800/80 border border-slate-700 text-slate-300 font-mono font-semibold">
              v1.0
            </span>
          </div>

          {/* Logo & Status Badges */}
          <div className="flex items-center gap-3">
            <h1 className="text-3xl md:text-4xl font-black tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
              TinyOG
            </h1>

            {isProVerified ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-emerald-500/20 to-teal-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold tracking-wider shadow-sm uppercase animate-in fade-in">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                LIFETIME PASS ACTIVE
              </span>
            ) : (
              <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-gradient-to-r from-purple-500/20 to-indigo-500/20 border border-purple-400/30 text-purple-300 font-bold tracking-wider shadow-sm uppercase">
                PRO DEMO AVAILABLE
              </span>
            )}
          </div>
        </div>

        {/* Top Right Checkout CTA */}
        <div className="flex flex-col sm:items-end gap-1.5 w-full sm:w-auto">
          {!isProVerified ? (
            <div className="flex items-center gap-2.5 w-full sm:w-auto">
              <span className="hidden sm:inline-flex text-[10px] px-2.5 py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 font-bold uppercase tracking-wider animate-pulse">
                ⚡ LTD 50% OFF
              </span>
              <a
                href={CHECKOUT_URL}
                target="_blank"
                rel="noreferrer"
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-600 hover:from-indigo-400 hover:via-purple-500 hover:to-pink-500 text-white font-bold text-xs md:text-sm shadow-xl shadow-purple-600/30 border border-purple-400/40 transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2 group"
              >
                <svg
                  className="w-4 h-4 text-purple-200 group-hover:rotate-12 transition-transform"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
                <span>Get Lifetime Pass ($29)</span>
                <span className="transition-transform group-hover:translate-x-1">
                  →
                </span>
              </a>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-xs text-emerald-400 font-semibold px-3 py-1.5 rounded-xl bg-emerald-950/40 border border-emerald-500/30">
              <span>✓ Verified Customer</span>
              <span>•</span>
              <span className="text-slate-300 font-normal">Commercial License</span>
            </div>
          )}
          <span className="text-[11px] text-slate-400 text-left sm:text-right flex items-center gap-1">
            <span className="text-emerald-400 font-medium">✓</span> Zero recurring fees • 14-day money-back guarantee
          </span>
        </div>
      </header>

      {/* Main Headline */}
      <div className="w-full max-w-6xl mb-8">
        <h2 className="text-xl md:text-2xl lg:text-3xl font-extrabold tracking-tight text-white leading-snug">
          Lightning-fast Dynamic Social Cards with One URL
        </h2>
        <p className="mt-1.5 text-slate-400 text-sm md:text-base max-w-3xl leading-relaxed">
          Zero-config Open Graph card generator for developers and bloggers. Preview in real-time, test all themes, and drop edge-cached dynamic URLs straight into your HTML meta tags.
        </p>
      </div>

      {/* Main App Grid */}
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Side: Editor & Settings Panel (5 cols) */}
        <div className="lg:col-span-5 bg-slate-900/90 border border-slate-800/80 backdrop-blur-2xl rounded-2xl p-6 shadow-2xl flex flex-col gap-6">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
            <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
              <span className="text-blue-400">⚙️</span> Settings &amp; Themes
            </h3>
            <div className="flex items-center gap-1.5 text-xs text-slate-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Live Edge Sync</span>
            </div>
          </div>

          {/* Theme Selection Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                Select Theme
              </label>
              {isProVerified ? (
                <span className="text-[11px] text-emerald-400 font-medium flex items-center gap-1">
                  ✓ All Themes Unlocked
                </span>
              ) : (
                <span className="text-[11px] text-purple-400 font-medium flex items-center gap-1">
                  ✨ 2 PRO Themes Available
                </span>
              )}
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              {THEMES.map((t) => {
                const isSelected = theme === t.id;
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => handleThemeChange(t.id)}
                    className={`relative p-3.5 rounded-xl border text-left transition-all duration-200 flex flex-col gap-2 group cursor-pointer ${
                      isSelected
                        ? "bg-slate-800/90 border-blue-500 ring-2 ring-blue-500/30 shadow-lg"
                        : "bg-slate-950/60 border-slate-800 hover:bg-slate-800/40 hover:border-slate-700 text-slate-400"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span
                          className={`w-3.5 h-3.5 rounded-full border shadow-sm transition-transform group-hover:scale-110 ${t.previewClass}`}
                        />
                        <span
                          className={`text-xs font-bold tracking-tight ${
                            isSelected ? "text-white" : "text-slate-300"
                          }`}
                        >
                          {t.name}
                        </span>
                      </div>

                      {t.isPro && (
                        <span
                          className={`text-[10px] px-1.5 py-0.5 rounded font-extrabold uppercase tracking-tight ${
                            isProVerified
                              ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                              : "bg-purple-500/20 text-purple-300 border border-purple-500/30"
                          }`}
                        >
                          PRO
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] text-slate-400 line-clamp-1 leading-snug">
                      {t.desc}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Seamless Non-Intrusive Paywall Card for Pro Themes */}
            {isDemoMode && (
              <div className="mt-4 p-4 rounded-xl bg-gradient-to-br from-purple-950/50 via-slate-900 to-slate-950 border border-purple-500/40 shadow-xl flex flex-col gap-3 animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold tracking-wider px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/40 uppercase">
                    ✨ LIFETIME PASS
                  </span>
                  <span className="text-xs font-bold text-white font-mono">
                    $29 <span className="line-through text-slate-500 font-normal">$59</span>
                  </span>
                </div>

                <div>
                  <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                    Unlock {theme.toUpperCase()} for Commercial Use
                  </h4>
                  <ul className="mt-2 space-y-1 text-[11px] text-slate-300">
                    <li className="flex items-center gap-1.5">
                      <span className="text-emerald-400 font-bold">✓</span>
                      <span>Permanently remove all demo watermarks</span>
                    </li>
                    <li className="flex items-center gap-1.5">
                      <span className="text-emerald-400 font-bold">✓</span>
                      <span>Access to Gradient, Terminal &amp; future PRO styles</span>
                    </li>
                    <li className="flex items-center gap-1.5">
                      <span className="text-emerald-400 font-bold">✓</span>
                      <span>Unlimited production Edge API requests</span>
                    </li>
                  </ul>
                </div>

                <a
                  href={CHECKOUT_URL}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-600 hover:from-purple-500 hover:via-indigo-500 hover:to-pink-500 text-white font-bold text-xs text-center shadow-lg shadow-purple-600/30 transition-all hover:shadow-purple-600/50 active:scale-[0.98] flex items-center justify-center gap-1.5 group"
                >
                  <span>Get Lifetime Pass ($29)</span>
                  <span className="transition-transform group-hover:translate-x-1">→</span>
                </a>
              </div>
            )}
          </div>

          {/* License Key Field with Real-Time Validation Feedback */}
          <div className="space-y-2 pt-2 border-t border-slate-800/80">
            <div className="flex items-center justify-between">
              <label
                htmlFor="key-input"
                className="block text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5"
              >
                <span>🔑 LICENSE KEY</span>
              </label>

              {licenseStatus === "verifying" && (
                <span className="text-[11px] text-blue-400 font-medium flex items-center gap-1">
                  <svg
                    className="animate-spin h-3 w-3 text-blue-400"
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
                  Verifying...
                </span>
              )}
              {licenseStatus === "valid" && (
                <span className="text-[11px] text-emerald-400 font-bold flex items-center gap-1">
                  ✓ Verified Pro
                </span>
              )}
              {licenseStatus === "invalid" && (
                <span className="text-[11px] text-rose-400 font-bold flex items-center gap-1">
                  ✕ Invalid Key
                </span>
              )}
              {licenseStatus === "idle" && (
                <span className="text-[11px] text-slate-500 font-medium">
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
                className={`w-full px-4 py-2.5 bg-slate-950 border rounded-xl text-slate-100 placeholder-slate-600 text-xs md:text-sm font-mono transition-all duration-200 focus:outline-none ${
                  licenseStatus === "valid"
                    ? "border-emerald-500/80 ring-2 ring-emerald-500/20 bg-emerald-950/10 text-emerald-200"
                    : licenseStatus === "invalid"
                    ? "border-rose-500/80 ring-2 ring-rose-500/20 bg-rose-950/10 text-rose-200"
                    : licenseStatus === "verifying"
                    ? "border-blue-500/80 ring-2 ring-blue-500/20 bg-slate-950"
                    : "border-slate-800 focus:border-purple-500/80 focus:ring-2 focus:ring-purple-500/20"
                }`}
              />

              {licenseKey && (
                <button
                  type="button"
                  onClick={() => setLicenseKey("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 text-xs px-1 py-0.5 rounded cursor-pointer"
                  title="Clear key"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Helper status text */}
            {licenseStatus === "valid" ? (
              <p className="text-[11px] text-emerald-400 px-1 font-medium flex items-center gap-1">
                <span>✨ PRO Active. Watermarks removed from all exported cards.</span>
              </p>
            ) : licenseStatus === "invalid" ? (
              <p className="text-[11px] text-rose-400 px-1 font-medium flex items-center justify-between">
                <span>✕ Invalid key. Please check your purchase receipt.</span>
                <a
                  href={CHECKOUT_URL}
                  target="_blank"
                  rel="noreferrer"
                  className="underline hover:text-rose-300 font-semibold"
                >
                  Buy License ($29) →
                </a>
              </p>
            ) : (
              <p className="text-[11px] text-slate-500 px-1 leading-normal">
                Enter your license key to remove watermarks and unlock commercial exports.
              </p>
            )}
          </div>

          {/* TAG Input */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label
                htmlFor="tag-input"
                className="block text-xs font-bold text-slate-300 uppercase tracking-wider"
              >
                TAG / BADGE
              </label>
              <span className="text-[10px] text-slate-500 font-mono">
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
              className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-600 text-xs md:text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all font-mono"
            />
          </div>

          {/* TITLE Input */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label
                htmlFor="title-input"
                className="block text-xs font-bold text-slate-300 uppercase tracking-wider"
              >
                TITLE
              </label>
              <span className="text-[10px] text-slate-500 font-mono">
                {title.length}/100
              </span>
            </div>
            <textarea
              id="title-input"
              rows={3}
              maxLength={100}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter your Open Graph card title..."
              className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-600 text-xs md:text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all resize-none leading-relaxed"
            />
          </div>

          {/* Presets */}
          <div className="space-y-2 pt-2 border-t border-slate-800/80">
            <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              QUICK PRESETS
            </label>
            <div className="flex flex-wrap gap-2">
              {presets.map((preset, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setTitle(preset.title);
                    setTag(preset.tag);
                    setTheme(preset.theme);
                  }}
                  className="text-xs px-3 py-1.5 rounded-lg bg-slate-950/80 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white transition-all duration-150 flex items-center gap-1.5 cursor-pointer active:scale-95"
                >
                  <span className="font-semibold">{preset.tag}</span>
                  <span className="text-[10px] text-slate-500 uppercase font-mono">
                    • {preset.theme}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Direct Endpoint URL Box */}
          <div className="pt-4 border-t border-slate-800/80 space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="font-semibold text-slate-300">Direct Image Endpoint</span>
              <button
                type="button"
                onClick={handleCopyUrl}
                className="text-blue-400 hover:text-blue-300 font-semibold transition-colors cursor-pointer flex items-center gap-1"
              >
                {urlCopied ? (
                  <span className="text-emerald-400">✓ URL Copied!</span>
                ) : (
                  <span>Copy URL</span>
                )}
              </button>
            </div>
            <div className="p-3 bg-slate-950/90 border border-slate-800 rounded-xl font-mono text-[11px] text-slate-400 truncate select-all">
              {fullOgUrl}
            </div>
          </div>
        </div>

        {/* Right Side: Real-time Preview & Export Panel (7 cols) */}
        <div className="lg:col-span-7 flex flex-col gap-6 lg:sticky lg:top-8">
          {/* Main Preview Container with macOS Window Frame */}
          <div
            className={`bg-slate-900/90 border border-slate-800/80 backdrop-blur-2xl rounded-2xl p-5 md:p-6 transition-all duration-300 flex flex-col gap-4 ${activeThemeConfig.glowClass}`}
          >
            {/* macOS Window Title Bar */}
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-[#ff5f56] inline-block shadow-sm" />
                <span className="w-3 h-3 rounded-full bg-[#ffbd2e] inline-block shadow-sm" />
                <span className="w-3 h-3 rounded-full bg-[#27c93f] inline-block shadow-sm" />
                <span className="ml-2 font-mono text-[11px] text-slate-400 flex items-center gap-2">
                  <span className="font-semibold text-slate-200">tinyog-preview.png</span>
                  <span>•</span>
                  <span>1200 × 630</span>
                </span>
              </div>

              {/* Status / Live Indicator */}
              <div className="flex items-center gap-2">
                {isImageLoading ? (
                  <span className="text-[11px] text-blue-400 flex items-center gap-1.5 font-medium animate-pulse">
                    <svg
                      className="animate-spin h-3.5 w-3.5 text-blue-400"
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
                    Rendering Edge Card...
                  </span>
                ) : isDemoMode ? (
                  <span className="text-[11px] px-2 py-0.5 rounded-full bg-purple-500/20 border border-purple-500/30 text-purple-300 font-bold uppercase tracking-wider flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse" />
                    PRO Demo Mode
                  </span>
                ) : (
                  <span className="text-[11px] text-emerald-400 flex items-center gap-1.5 font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    Ready
                  </span>
                )}

                <a
                  href={ogPath}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition-all flex items-center gap-1 font-medium cursor-pointer"
                  title="Open high-resolution PNG in new tab"
                >
                  <span>Raw Image</span>
                  <svg
                    className="w-3 h-3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                    />
                  </svg>
                </a>
              </div>
            </div>

            {/* Exact 1200:630 Aspect Ratio Frame with Smooth Crossfade */}
            <div className="relative w-full aspect-[1200/630] rounded-xl overflow-hidden bg-slate-950 border border-slate-800/90 shadow-2xl flex items-center justify-center group">
              {/* Active Image */}
              {displayedImgUrl ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={displayedImgUrl}
                  alt={`TinyOG Preview for ${effectiveTitle}`}
                  className={`w-full h-full object-cover transition-opacity duration-200 ${
                    isImageLoading ? "opacity-75" : "opacity-100"
                  }`}
                />
              ) : (
                <div className="flex items-center gap-2 text-slate-500 text-xs">
                  <span>Generating social card...</span>
                </div>
              )}

              {/* Subdued Top Progress Bar while rendering */}
              {isImageLoading && (
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 animate-pulse" />
              )}

              {/* Floating Pro Preview Badge */}
              {isDemoMode && (
                <div className="absolute top-3 right-3 px-3 py-1.5 rounded-full bg-slate-950/85 backdrop-blur-xl border border-purple-500/50 text-purple-200 text-xs font-bold flex items-center gap-1.5 shadow-2xl pointer-events-none">
                  <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
                  <span>✨ PRO Demo Preview</span>
                </div>
              )}
            </div>

            {/* Dimensions and specs info */}
            <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
              <span>Standard Open Graph 1200×630px • High-DPI Edge Rendered</span>
              <span className="font-mono text-slate-400 uppercase font-semibold">
                Theme: {theme}
              </span>
            </div>
          </div>

          {/* HTML Meta Tag Export Card */}
          <div className="bg-slate-900/90 border border-slate-800/80 backdrop-blur-2xl rounded-2xl p-5 md:p-6 shadow-2xl flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-3">
              <div className="flex items-center gap-2">
                <svg
                  className="w-5 h-5 text-blue-400"
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
                <h3 className="text-sm font-bold text-slate-200">
                  HTML Meta Tag &amp; Export
                </h3>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                {/* Copy Meta Tag Button */}
                <button
                  type="button"
                  onClick={handleCopyHtml}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 flex items-center gap-1.5 active:scale-95 cursor-pointer shadow-lg ${
                    htmlCopied
                      ? "bg-emerald-600 text-white shadow-emerald-600/30"
                      : "bg-blue-600 hover:bg-blue-500 text-white shadow-blue-600/25"
                  }`}
                >
                  {htmlCopied ? (
                    <>
                      <svg
                        className="w-4 h-4 text-white"
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
                      <span>Copied to Clipboard!</span>
                    </>
                  ) : (
                    <>
                      <svg
                        className="w-4 h-4 text-white"
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
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 flex items-center gap-1.5 border active:scale-95 cursor-pointer disabled:opacity-50 ${
                    downloadSuccess
                      ? "bg-emerald-950/60 border-emerald-500/50 text-emerald-300"
                      : "bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-200 hover:text-white"
                  }`}
                >
                  {isDownloading ? (
                    <>
                      <svg
                        className="animate-spin h-4 w-4 text-slate-300"
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
                      <span>Saving PNG...</span>
                    </>
                  ) : downloadSuccess ? (
                    <>
                      <svg
                        className="w-4 h-4 text-emerald-400"
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
                      <span>Downloaded!</span>
                    </>
                  ) : (
                    <>
                      <svg
                        className="w-4 h-4 text-emerald-400"
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
            <div className="relative group">
              <pre className="p-4 bg-slate-950/90 border border-slate-800 rounded-xl font-mono text-xs text-blue-300 select-all overflow-x-auto whitespace-pre-wrap break-all leading-relaxed shadow-inner">
                {metaTagSnippet}
              </pre>
            </div>

            <p className="text-[11px] text-slate-500 leading-relaxed">
              💡 Paste this tag into your website&apos;s <code className="text-slate-400 font-mono">&lt;head&gt;</code> section to render rich cards across X (Twitter), LinkedIn, Discord, and Slack.
            </p>

            {/* Pro Preview Notice */}
            {isDemoMode && (
              <div className="p-3.5 bg-purple-950/25 border border-purple-500/30 rounded-xl text-xs text-purple-300 flex items-start gap-2.5">
                <span className="text-base shrink-0">ℹ️</span>
                <div className="leading-relaxed">
                  Currently rendering in <strong>PRO Demo Mode</strong> (includes demo watermark). To remove watermarks for commercial production websites, activate your{" "}
                  <a
                    href={CHECKOUT_URL}
                    target="_blank"
                    rel="noreferrer"
                    className="text-white underline hover:text-purple-200 font-bold"
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
      <footer className="w-full max-w-6xl mt-20 pt-8 border-t border-slate-800/80 flex flex-col gap-5 text-xs text-slate-500">
        {/* Top footer row: Service & Guarantee specs */}
        <div className="flex flex-wrap items-center justify-between gap-3 text-slate-400 text-xs">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="font-bold text-slate-200">TinyOG</span>
            <span>•</span>
            <span>Lifetime Pass</span>
            <span>•</span>
            <span>One-time payment $29</span>
            <span>•</span>
            <span className="text-emerald-400 font-semibold flex items-center gap-1">
              ✓ 14-day money-back guarantee
            </span>
          </div>

          <div className="flex items-center gap-4">
            {!isProVerified && (
              <>
                <a
                  href={CHECKOUT_URL}
                  target="_blank"
                  rel="noreferrer"
                  className="text-purple-400 hover:text-purple-300 font-semibold transition-colors"
                >
                  Buy Lifetime Pass ($29) →
                </a>
                <span>•</span>
              </>
            )}
            <a
              href="mailto:support@tinyog.cloud"
              className="hover:text-slate-300 transition-colors"
            >
              support@tinyog.cloud
            </a>
          </div>
        </div>

        {/* Bottom footer row: Legal links & Copyright */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-slate-850 text-[11px] text-slate-500">
          <p>© 2026 TinyOG (tinyog.cloud). All rights reserved. • Built for indie hackers and bloggers.</p>

          <div className="flex items-center gap-4 text-slate-400">
            <Link
              href="/terms"
              className="hover:text-white transition-colors underline-offset-2 hover:underline"
            >
              Terms of Service
            </Link>
            <span>•</span>
            <Link
              href="/privacy"
              className="hover:text-white transition-colors underline-offset-2 hover:underline"
            >
              Privacy Policy
            </Link>
            <span>•</span>
            <Link
              href="/refund"
              className="hover:text-white transition-colors underline-offset-2 hover:underline"
            >
              Refund Policy
            </Link>
          </div>
        </div>
      </footer>

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl bg-slate-900/95 border border-purple-500/40 text-slate-100 shadow-2xl backdrop-blur-md animate-in fade-in slide-in-from-bottom-3 duration-200">
          <svg
            className="w-4 h-4 text-purple-400 shrink-0"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M13 10V3L4 14h7v7l9-11h-7z"
            />
          </svg>
          <span className="text-xs font-semibold">{toastMessage}</span>
        </div>
      )}
    </main>
  );
}
