"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

const CHECKOUT_URL =
  "https://tinyog.lemonsqueezy.com/checkout/buy/50754932-62b6-4a13-af8c-5855c124da1e";

type ThemeOption = {
  id: "dark" | "gradient" | "minimal" | "terminal";
  name: "Dark" | "Gradient" | "Minimal" | "Terminal";
  desc: string;
  previewClass: string;
  badge: string;
  isPro?: boolean;
};

const THEMES: ThemeOption[] = [
  {
    id: "dark",
    name: "Dark",
    desc: "Classic navy dark & dot pattern",
    previewClass: "bg-slate-900 border-slate-700",
    badge: "bg-blue-500/20 text-blue-400 border-blue-500/30",
    isPro: false,
  },
  {
    id: "gradient",
    name: "Gradient",
    desc: "Trendy indigo-purple mesh",
    previewClass:
      "bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 border-purple-400/40",
    badge: "bg-white/25 text-white border-white/40",
    isPro: true,
  },
  {
    id: "minimal",
    name: "Minimal",
    desc: "Clean white & subtle gray typography",
    previewClass: "bg-slate-100 border-slate-300",
    badge: "bg-slate-200 text-slate-800 border-slate-300",
    isPro: false,
  },
  {
    id: "terminal",
    name: "Terminal",
    desc: "Developer console with traffic-light buttons",
    previewClass: "bg-zinc-900 border-zinc-700",
    badge: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
    isPro: true,
  },
];

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

  const [isLoading, setIsLoading] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [htmlCopied, setHtmlCopied] = useState(false);
  const [urlCopied, setUrlCopied] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [origin, setOrigin] = useState("https://example.com");

  // Retrieve window origin on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      setOrigin(window.location.origin);
    }
  }, []);

  // Debounce text inputs to avoid flooding requests
  useEffect(() => {
    setIsLoading(true);
    const handler = setTimeout(() => {
      setDebouncedTitle(title);
      setDebouncedTag(tag);
      setDebouncedKey(licenseKey);
    }, 300);

    return () => clearTimeout(handler);
  }, [title, tag, licenseKey]);

  const hasKey = Boolean(debouncedKey.trim());

  // Handle theme switch and prompt nudge for Pro themes
  const handleThemeChange = (newTheme: "dark" | "gradient" | "minimal" | "terminal") => {
    setIsLoading(true);
    setTheme(newTheme);

    if (!hasKey && (newTheme === "gradient" || newTheme === "terminal")) {
      showToast("🔒 This theme is PRO only. Unlock lifetime access!");
    }
  };

  const keyParam = debouncedKey.trim()
    ? `&key=${encodeURIComponent(debouncedKey.trim())}`
    : "";

  const ogPath = `/api/og?title=${encodeURIComponent(
    debouncedTitle || "Default Title"
  )}&tag=${encodeURIComponent(debouncedTag || "TAG")}&theme=${theme}${keyParam}`;

  const fullOgUrl = `${origin}${ogPath}`;

  // Generated HTML meta tag snippet
  const metaTagSnippet = `<meta property="og:image" content="${fullOgUrl}" />`;

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage((prev) => (prev === message ? null : prev));
    }, 2800);
  };

  // Copy HTML Meta Tag to clipboard
  const handleCopyHtml = async () => {
    try {
      await navigator.clipboard.writeText(metaTagSnippet);
      setHtmlCopied(true);
      showToast("Copied to clipboard!");
      setTimeout(() => setHtmlCopied(false), 2000);
    } catch {
      showToast("Failed to copy to clipboard.");
    }
  };

  // Copy Image URL to clipboard
  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(fullOgUrl);
      setUrlCopied(true);
      showToast("Image URL copied to clipboard!");
      setTimeout(() => setUrlCopied(false), 2000);
    } catch {
      showToast("Failed to copy image URL.");
    }
  };

  // Download rendered PNG image
  const handleDownload = async () => {
    try {
      setIsDownloading(true);
      const response = await fetch(ogPath);
      if (!response.ok) throw new Error("Image download failed");

      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;

      // Sanitize filename
      const safeTitle = (debouncedTitle || "thumbnail")
        .replace(/[^a-zA-Z0-9\s-_]/g, "")
        .trim()
        .slice(0, 30);
      link.download = `tinyog-${safeTitle || "thumbnail"}-${theme}.png`;

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);

      showToast("PNG image downloaded successfully!");
    } catch (error) {
      console.error(error);
      showToast("Failed to download image.");
    } finally {
      setIsDownloading(false);
    }
  };

  const presets = [
    {
      title: "Building High-Performance Web Apps with Next.js 14",
      tag: "FRONTEND",
      theme: "dark" as const,
    },
    {
      title: "Zero-Config Open Graph Image Generation at the Edge",
      tag: "VERCEL / OG",
      theme: "gradient" as const,
    },
    {
      title: "Clean Code Principles for Modern Frontend Teams",
      tag: "GUIDE",
      theme: "minimal" as const,
    },
    {
      title: "git commit -m 'Ship TinyOG v1.0 to Production'",
      tag: "CLI",
      theme: "terminal" as const,
    },
  ];

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-start p-6 md:p-12 relative overflow-hidden font-sans">
      {/* Background radial glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[400px] bg-blue-600/10 blur-[120px] rounded-full pointer-events-none -z-10" />

      {/* Top Navigation Header */}
      <header className="w-full max-w-5xl mb-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-800/80">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold uppercase tracking-wider mb-2">
            <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
            ULTRA-FAST OG MAKER
          </div>

          {/* Logo & Badges */}
          <div className="flex items-center gap-3">
            <h1 className="text-3xl md:text-5xl font-black tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
              TinyOG
            </h1>
            <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-gradient-to-r from-blue-500/20 to-indigo-500/20 border border-blue-400/30 text-blue-300 font-bold tracking-wider shadow-sm uppercase">
              BETA
            </span>
            {hasKey && (
              <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 font-bold tracking-wider shadow-sm uppercase">
                PRO ACTIVE
              </span>
            )}
          </div>
        </div>

        {/* Top Right Checkout CTA */}
        <div className="flex flex-col sm:items-end gap-1.5 w-full sm:w-auto">
          <div className="flex items-center gap-2">
            <span className="hidden sm:inline-flex text-[10px] px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 font-bold uppercase tracking-wider animate-pulse">
              ⚡ LTD 50% OFF
            </span>
            <a
              href={CHECKOUT_URL}
              target="_blank"
              rel="noreferrer"
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-600 hover:from-indigo-600 hover:via-purple-700 hover:to-pink-700 text-white font-bold text-xs md:text-sm shadow-xl shadow-purple-600/25 border border-purple-400/30 transition-all hover:shadow-purple-600/40 active:scale-95 flex items-center justify-center gap-2 group"
            >
              <svg
                className="w-4 h-4 text-purple-200 group-hover:scale-110 transition-transform"
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
              <span className="transition-transform group-hover:translate-x-0.5">
                →
              </span>
            </a>
          </div>
          <span className="text-[11px] text-slate-400 text-left sm:text-right">
            Lifetime watermark removal &amp; all PRO themes unlocked
          </span>
        </div>
      </header>

      {/* Main Headline & Subtitle */}
      <div className="w-full max-w-5xl mb-8">
        <h2 className="text-xl md:text-3xl font-extrabold tracking-tight text-white">
          TinyOG — Lightning-fast Dynamic Social Cards with One URL
        </h2>
        <p className="mt-2 text-slate-400 text-sm md:text-base max-w-3xl leading-relaxed">
          Zero-config Open Graph image generator for developers and bloggers. Preview in real-time and drop dynamic URLs straight into your HTML meta tags.
        </p>
      </div>

      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Settings & Inputs Panel */}
        <div className="lg:col-span-5 bg-slate-900/80 border border-slate-800 backdrop-blur-xl rounded-2xl p-6 shadow-2xl flex flex-col gap-6">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
            <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
              ⚙️ Settings &amp; Themes
            </h3>
            <span className="text-xs text-slate-500 font-medium">Live Preview Sync</span>
          </div>

          {/* Theme Selection */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                Select Theme
              </label>
              {!hasKey && (
                <span className="text-[11px] text-amber-400/90 flex items-center gap-1 font-medium">
                  🔒 PRO Themes Locked
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
                    className={`relative p-3 rounded-xl border text-left transition-all flex flex-col gap-1.5 ${
                      isSelected
                        ? "bg-slate-800 border-blue-500 ring-2 ring-blue-500/30 shadow-md"
                        : "bg-slate-950/60 border-slate-800 hover:bg-slate-800/50 hover:border-slate-700 text-slate-400"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span
                          className={`w-3.5 h-3.5 rounded-full border shadow-sm ${t.previewClass}`}
                        />
                        <span
                          className={`text-xs font-semibold ${
                            isSelected ? "text-white" : "text-slate-300"
                          }`}
                        >
                          {t.name}
                        </span>
                      </div>

                      {/* PRO Theme Badge */}
                      {t.isPro && (
                        <span
                          className={`text-[10px] px-1.5 py-0.5 rounded font-bold uppercase tracking-tight flex items-center gap-0.5 ${
                            hasKey
                              ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                              : "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                          }`}
                        >
                          {hasKey ? "PRO" : "🔒 PRO"}
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] text-slate-400 line-clamp-1">
                      {t.desc}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Pro Theme Nudge Banner */}
            {!hasKey && (theme === "gradient" || theme === "terminal") && (
              <div className="mt-3 p-3.5 bg-gradient-to-r from-purple-950/40 via-indigo-950/40 to-slate-900 border border-purple-500/40 rounded-xl flex flex-col gap-2.5 animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="flex items-start gap-2">
                  <span className="text-base shrink-0">🔒</span>
                  <div className="text-xs text-purple-200 leading-relaxed">
                    <strong className="text-white font-semibold">
                      The {theme.toUpperCase()} theme is a PRO feature.
                    </strong>
                    <p className="text-purple-300/80 text-[11px] mt-0.5">
                      Remove watermarks and unlock all premium styles with lifetime access.
                    </p>
                  </div>
                </div>
                <a
                  href={CHECKOUT_URL}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-2 px-3 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold text-xs text-center shadow-md shadow-purple-600/30 transition-all active:scale-[0.98] flex items-center justify-center gap-1.5"
                >
                  <span>Get Lifetime Pass ($29)</span>
                  <span>→</span>
                </a>
              </div>
            )}
          </div>

          {/* License Key Field */}
          <div className="space-y-2 pt-2 border-t border-slate-800/80">
            <div className="flex items-center justify-between">
              <label
                htmlFor="key-input"
                className="block text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5"
              >
                <span>🔑 LICENSE KEY (Optional)</span>
              </label>
              {hasKey && (
                <span className="text-[11px] text-emerald-400 font-medium flex items-center gap-1">
                  ✓ Key Verified
                </span>
              )}
            </div>
            <input
              id="key-input"
              type="password"
              value={licenseKey}
              onChange={(e) => setLicenseKey(e.target.value)}
              placeholder="Enter your Lemon Squeezy license key..."
              className="w-full px-4 py-3 bg-slate-950 border border-slate-700/80 rounded-xl text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all font-mono"
            />

            {/* License CTA Link */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-[11px] pt-1 px-1">
              <span className="text-slate-400">Don&apos;t have a key yet?</span>
              <a
                href={CHECKOUT_URL}
                target="_blank"
                rel="noreferrer"
                className="text-purple-400 hover:text-purple-300 font-semibold transition-colors inline-flex items-center gap-1 group"
              >
                <span>Get your Lifetime Pass ($29)</span>
                <span className="transition-transform group-hover:translate-x-0.5">
                  →
                </span>
              </a>
            </div>

            {/* Status Guide Banners */}
            {!hasKey ? (
              <div className="mt-2 p-3 bg-blue-950/30 border border-blue-500/20 rounded-xl text-[11px] text-blue-300/90 leading-relaxed flex items-start gap-2">
                <span className="text-base shrink-0">💡</span>
                <span>
                  Enter a license key to <strong>remove the watermark</strong> and{" "}
                  <strong>unlock all PRO themes (Gradient, Terminal)</strong>.
                </span>
              </div>
            ) : (
              <div className="mt-2 p-3 bg-emerald-950/30 border border-emerald-500/20 rounded-xl text-[11px] text-emerald-300/90 leading-relaxed flex items-start gap-2">
                <span className="text-base shrink-0">✨</span>
                <span>
                  TinyOG PRO Mode Active. Watermark is removed and all premium themes are unlocked.
                </span>
              </div>
            )}
          </div>

          {/* TAG Input */}
          <div className="space-y-2">
            <label
              htmlFor="tag-input"
              className="block text-xs font-bold text-slate-300 uppercase tracking-wider"
            >
              TAG
            </label>
            <input
              id="tag-input"
              type="text"
              value={tag}
              onChange={(e) => setTag(e.target.value)}
              placeholder="e.g. TUTORIAL, RELEASE, DEV"
              className="w-full px-4 py-3 bg-slate-950 border border-slate-700/80 rounded-xl text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
            />
          </div>

          {/* TITLE Input */}
          <div className="space-y-2">
            <label
              htmlFor="title-input"
              className="block text-xs font-bold text-slate-300 uppercase tracking-wider"
            >
              TITLE
            </label>
            <textarea
              id="title-input"
              rows={4}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter your Open Graph title here..."
              className="w-full px-4 py-3 bg-slate-950 border border-slate-700/80 rounded-xl text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all resize-none leading-relaxed"
            />
          </div>

          {/* Sample Presets */}
          <div className="space-y-2 pt-2">
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">
              TRY SAMPLE PRESETS
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
                    setIsLoading(true);
                  }}
                  className="text-xs px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 border border-slate-700 text-slate-300 transition-all hover:text-white flex items-center gap-1.5"
                >
                  <span>{preset.tag}</span>
                  <span className="text-[10px] text-slate-500 uppercase">
                    ({preset.theme})
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Endpoint URL Box */}
          <div className="pt-4 border-t border-slate-800/80 space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="font-medium">Direct Image Endpoint</span>
              <button
                type="button"
                onClick={handleCopyUrl}
                className="text-blue-400 hover:text-blue-300 font-medium transition-colors"
              >
                {urlCopied ? "✓ URL Copied!" : "Copy URL"}
              </button>
            </div>
            <div className="p-3 bg-slate-950/90 border border-slate-800 rounded-xl font-mono text-xs text-slate-400 truncate select-all">
              {ogPath}
            </div>
          </div>
        </div>

        {/* Real-time Preview & Export Panel */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          {/* Preview Card */}
          <div className="bg-slate-900/80 border border-slate-800 backdrop-blur-xl rounded-2xl p-6 shadow-2xl flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-red-500/80 inline-block" />
                <span className="w-3 h-3 rounded-full bg-yellow-500/80 inline-block" />
                <span className="w-3 h-3 rounded-full bg-green-500/80 inline-block" />
                <span className="ml-2 text-xs font-medium text-slate-400">
                  Preview (1200 × 630 px) —{" "}
                  <span className="text-blue-400 font-bold uppercase">
                    {theme} THEME
                  </span>
                </span>
              </div>
              <div className="flex items-center gap-2">
                {isLoading && (
                  <span className="text-xs text-blue-400 flex items-center gap-1.5">
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
                    Rendering...
                  </span>
                )}
                <a
                  href={ogPath}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-all flex items-center gap-1 font-medium"
                >
                  Open in New Tab
                  <svg
                    className="w-3.5 h-3.5"
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

            {/* Scaled Preview Frame (1200:630 Aspect Ratio) */}
            <div className="relative w-full aspect-[1200/630] rounded-xl overflow-hidden bg-slate-950 border border-slate-800 flex items-center justify-center group shadow-inner">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                key={ogPath}
                src={ogPath}
                alt={`TinyOG Preview for ${title}`}
                className="w-full h-full object-cover transition-opacity duration-300"
                onLoad={() => setIsLoading(false)}
              />
            </div>
          </div>

          {/* HTML Meta Tag Export Card */}
          <div className="bg-slate-900/80 border border-slate-800 backdrop-blur-xl rounded-2xl p-6 shadow-2xl flex flex-col gap-4">
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
                {/* Copy Meta Tag */}
                <button
                  type="button"
                  onClick={handleCopyHtml}
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-lg shadow-blue-600/20 transition-all flex items-center gap-1.5 active:scale-95"
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
                          strokeWidth="2"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      Copied!
                    </>
                  ) : (
                    <>
                      <svg
                        className="w-4 h-4"
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
                      Copy Meta Tag
                    </>
                  )}
                </button>

                {/* Download PNG Button */}
                <button
                  type="button"
                  onClick={handleDownload}
                  disabled={isDownloading}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 hover:text-white text-xs font-semibold transition-all flex items-center gap-1.5 disabled:opacity-50 active:scale-95"
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
                      Saving...
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
                      Download PNG
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
              💡 Paste this tag into your website&apos;s <code className="text-slate-400">&lt;head&gt;</code> section to render rich social preview cards across X (Twitter), LinkedIn, Discord, and Slack.
            </p>
          </div>
        </div>
      </div>

      {/* Global Footer with Lemon Squeezy Compliance Links */}
      <footer className="w-full max-w-5xl mt-20 pt-8 border-t border-slate-800/80 flex flex-col gap-5 text-xs text-slate-500">
        {/* Top footer row: Service & Guarantee specs */}
        <div className="flex flex-wrap items-center justify-between gap-3 text-slate-400 text-xs">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-bold text-slate-200">TinyOG</span>
            <span>•</span>
            <span>Lifetime Pass</span>
            <span>•</span>
            <span>One-time payment $29</span>
            <span>•</span>
            <span className="text-emerald-400 font-semibold">14-day money-back guarantee</span>
          </div>

          <div className="flex items-center gap-4">
            <a
              href={CHECKOUT_URL}
              target="_blank"
              rel="noreferrer"
              className="text-purple-400 hover:text-purple-300 font-medium transition-colors"
            >
              Buy Lifetime Pass ($29) →
            </a>
            <span>•</span>
            <a
              href="mailto:support@tinyog.com"
              className="hover:text-slate-300 transition-colors"
            >
              support@tinyog.com
            </a>
          </div>
        </div>

        {/* Bottom footer row: Legal links & Copyright */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-slate-850 text-[11px] text-slate-500">
          <p>© 2026 TinyOG. All rights reserved. • Built for indie hackers and bloggers.</p>

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
            className="w-5 h-5 text-purple-400 shrink-0"
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
          <span className="text-xs font-medium">{toastMessage}</span>
        </div>
      )}
    </main>
  );
}
