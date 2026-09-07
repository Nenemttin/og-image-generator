"use client";

import { useState, useEffect } from "react";

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
    desc: "클래식 네이비 다크 & 도트 패턴",
    previewClass: "bg-slate-900 border-slate-700",
    badge: "bg-blue-500/20 text-blue-400 border-blue-500/30",
    isPro: false,
  },
  {
    id: "gradient",
    name: "Gradient",
    desc: "트렌디한 인디고-퍼플 그라디언트",
    previewClass:
      "bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 border-purple-400/40",
    badge: "bg-white/25 text-white border-white/40",
    isPro: true,
  },
  {
    id: "minimal",
    name: "Minimal",
    desc: "깔끔한 화이트 & 차콜 텍스트",
    previewClass: "bg-slate-100 border-slate-300",
    badge: "bg-slate-200 text-slate-800 border-slate-300",
    isPro: false,
  },
  {
    id: "terminal",
    name: "Terminal",
    desc: "맥 터미널 콘솔 & 신호등 버튼",
    previewClass: "bg-zinc-900 border-zinc-700",
    badge: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
    isPro: true,
  },
];

export default function Home() {
  const [title, setTitle] = useState(
    "Next.js 14에서 @vercel/og로 세련된 OG 이미지 생성하기"
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

  // 클라이언트 환경에서 현재 origin 획득
  useEffect(() => {
    if (typeof window !== "undefined") {
      setOrigin(window.location.origin);
    }
  }, []);

  // 디바운스 처리 (타이핑 시 불필요한 과도 요청 방지)
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

  // 테마 변경 시 로딩 표시 및 PRO 테마 넛지
  const handleThemeChange = (newTheme: "dark" | "gradient" | "minimal" | "terminal") => {
    setIsLoading(true);
    setTheme(newTheme);

    if (!hasKey && (newTheme === "gradient" || newTheme === "terminal")) {
      showToast("🔒 이 테마는 PRO 전용입니다. 평생 이용권으로 해금해보세요!");
    }
  };

  const keyParam = debouncedKey.trim()
    ? `&key=${encodeURIComponent(debouncedKey.trim())}`
    : "";

  const ogPath = `/api/og?title=${encodeURIComponent(
    debouncedTitle || "Default Title"
  )}&tag=${encodeURIComponent(debouncedTag || "TAG")}&theme=${theme}${keyParam}`;

  const fullOgUrl = `${origin}${ogPath}`;

  // 요구된 메타 태그 HTML 코드
  const metaTagSnippet = `<meta property="og:image" content="${fullOgUrl}" />`;

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage((prev) => (prev === message ? null : prev));
    }, 2800);
  };

  // HTML 메타 태그 복사
  const handleCopyHtml = async () => {
    try {
      await navigator.clipboard.writeText(metaTagSnippet);
      setHtmlCopied(true);
      showToast("TinyOG 메타 태그가 클립보드에 복사되었습니다!");
      setTimeout(() => setHtmlCopied(false), 2000);
    } catch {
      showToast("복사에 실패했습니다.");
    }
  };

  // 이미지 URL 복사
  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(fullOgUrl);
      setUrlCopied(true);
      showToast("TinyOG 이미지 URL이 클립보드에 복사되었습니다!");
      setTimeout(() => setUrlCopied(false), 2000);
    } catch {
      showToast("복사에 실패했습니다.");
    }
  };

  // PNG 이미지 다운로드
  const handleDownload = async () => {
    try {
      setIsDownloading(true);
      const response = await fetch(ogPath);
      if (!response.ok) throw new Error("이미지 다운로드 실패");

      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;

      // 파일명 안전 처리
      const safeTitle = (debouncedTitle || "thumbnail")
        .replace(/[^a-zA-Z0-9가-힣\s-_]/g, "")
        .trim()
        .slice(0, 30);
      link.download = `tinyog-${safeTitle || "thumbnail"}-${theme}.png`;

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);

      showToast("PNG 이미지가 성공적으로 다운로드되었습니다!");
    } catch (error) {
      console.error(error);
      showToast("이미지 다운로드 중 오류가 발생했습니다.");
    } finally {
      setIsDownloading(false);
    }
  };

  const presets = [
    {
      title: "TinyOG: 링크 하나로 끝나는 초경량 동적 썸네일",
      tag: "RELEASE",
      theme: "dark" as const,
    },
    {
      title: "Zero-config Open Graph Image Generation at the Edge",
      tag: "PERF",
      theme: "gradient" as const,
    },
    {
      title: "클린 코드를 지향하는 프론트엔드 개발 가이드",
      tag: "MINIMAL",
      theme: "minimal" as const,
    },
    {
      title: "git commit -m 'Release TinyOG v1.0 with Edge Runtime'",
      tag: "CLI",
      theme: "terminal" as const,
    },
  ];

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-start p-6 md:p-12 relative overflow-hidden">
      {/* 배경 글로우 효과 */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[400px] bg-blue-600/10 blur-[120px] rounded-full pointer-events-none -z-10" />

      {/* 상단 네비게이션 헤더 */}
      <header className="w-full max-w-5xl mb-12 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-800/80">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold uppercase tracking-wider mb-2">
            <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
            Ultra-Fast OG Maker
          </div>

          {/* 로고 & 뱃지 */}
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

        {/* 상단 우측 PRO 구매 버튼 (Lemon Squeezy 결제 링크) */}
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
            평생 무제한 워터마크 제거 &amp; PRO 테마 언락
          </span>
        </div>
      </header>

      {/* 메인 서브 카피 */}
      <div className="w-full max-w-5xl mb-8">
        <p className="text-slate-300 text-base md:text-xl font-semibold">
          TinyOG — 링크 하나로 끝나는 초경량 동적 소셜 썸네일
        </p>
        <p className="mt-1 text-slate-400 text-xs md:text-sm max-w-2xl">
          블로거와 개발자를 위한 Zero-config 오픈그래프 카드 자동 생성기입니다. 실시간 미리보기로 확인하고 HTML 메타 태그 또는 이미지를 바로 내보내세요.
        </p>
      </div>

      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* 입력 컨트롤 패널 */}
        <div className="lg:col-span-5 bg-slate-900/80 border border-slate-800 backdrop-blur-xl rounded-2xl p-6 shadow-2xl flex flex-col gap-6">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
            <h2 className="text-lg font-semibold text-slate-200 flex items-center gap-2">
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
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
              속성 &amp; 테마 설정
            </h2>
            <span className="text-xs text-slate-500">실시간 연동 중</span>
          </div>

          {/* 디자인 테마 선택 */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-medium text-slate-300 uppercase tracking-wider">
                디자인 테마 선택
              </label>
              {!hasKey && (
                <span className="text-[11px] text-amber-400/90 flex items-center gap-1 font-medium">
                  🔒 PRO 테마 잠김
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

                      {/* PRO 테마 뱃지 */}
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

            {/* Pro 테마 선택 시 넛지 배너 */}
            {!hasKey && (theme === "gradient" || theme === "terminal") && (
              <div className="mt-3 p-3.5 bg-gradient-to-r from-purple-950/40 via-indigo-950/40 to-slate-900 border border-purple-500/40 rounded-xl flex flex-col gap-2.5 animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="flex items-start gap-2">
                  <span className="text-base shrink-0">🔒</span>
                  <div className="text-xs text-purple-200 leading-relaxed">
                    <strong className="text-white font-semibold">
                      선택하신 {theme.toUpperCase()} 테마는 PRO 전용입니다.
                    </strong>
                    <p className="text-purple-300/80 text-[11px] mt-0.5">
                      워터마크 제거와 함께 평생 이용권을 구매해보세요.
                    </p>
                  </div>
                </div>
                <a
                  href={CHECKOUT_URL}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-2 px-3 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold text-xs text-center shadow-md shadow-purple-600/30 transition-all active:scale-[0.98] flex items-center justify-center gap-1.5"
                >
                  <span>평생 이용권 구매하기 ($29)</span>
                  <span>→</span>
                </a>
              </div>
            )}
          </div>

          {/* 라이선스 키 입력 필드 */}
          <div className="space-y-2 pt-2 border-t border-slate-800/80">
            <div className="flex items-center justify-between">
              <label
                htmlFor="key-input"
                className="block text-xs font-medium text-slate-300 uppercase tracking-wider flex items-center gap-1.5"
              >
                <span>🔑 라이선스 키 (License Key)</span>
                <span className="text-[10px] text-slate-500 font-normal lowercase">
                  (선택 사항)
                </span>
              </label>
              {hasKey && (
                <span className="text-[11px] text-emerald-400 font-medium flex items-center gap-1">
                  ✓ 키 적용됨
                </span>
              )}
            </div>
            <input
              id="key-input"
              type="password"
              value={licenseKey}
              onChange={(e) => setLicenseKey(e.target.value)}
              placeholder="Lemon Squeezy 라이선스 키를 입력하세요..."
              className="w-full px-4 py-3 bg-slate-950 border border-slate-700/80 rounded-xl text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all font-mono"
            />

            {/* 키 미소유자 결제 링크 안내 */}
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

            {/* 안내 문구 */}
            {!hasKey ? (
              <div className="mt-2 p-3 bg-blue-950/30 border border-blue-500/20 rounded-xl text-[11px] text-blue-300/90 leading-relaxed flex items-start gap-2">
                <span className="text-base shrink-0">💡</span>
                <span>
                  라이선스 키를 입력하면 <strong>워터마크가 제거</strong>되고{" "}
                  <strong>PRO 테마(Gradient, Terminal)</strong>가 해금됩니다.
                </span>
              </div>
            ) : (
              <div className="mt-2 p-3 bg-emerald-950/30 border border-emerald-500/20 rounded-xl text-[11px] text-emerald-300/90 leading-relaxed flex items-start gap-2">
                <span className="text-base shrink-0">✨</span>
                <span>
                  TinyOG PRO 모드가 활성화되었습니다. 워터마크가 숨겨지고 모든 테마를 자유롭게 생성할 수 있습니다.
                </span>
              </div>
            )}
          </div>

          {/* 태그 입력 */}
          <div className="space-y-2">
            <label
              htmlFor="tag-input"
              className="block text-xs font-medium text-slate-300 uppercase tracking-wider"
            >
              태그 (Tag)
            </label>
            <input
              id="tag-input"
              type="text"
              value={tag}
              onChange={(e) => setTag(e.target.value)}
              placeholder="예: TUTORIAL, NEWS, DEV"
              className="w-full px-4 py-3 bg-slate-950 border border-slate-700/80 rounded-xl text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
            />
          </div>

          {/* 제목 입력 */}
          <div className="space-y-2">
            <label
              htmlFor="title-input"
              className="block text-xs font-medium text-slate-300 uppercase tracking-wider"
            >
              제목 (Title)
            </label>
            <textarea
              id="title-input"
              rows={4}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="OG 이미지에 들어갈 제목을 입력하세요..."
              className="w-full px-4 py-3 bg-slate-950 border border-slate-700/80 rounded-xl text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all resize-none leading-relaxed"
            />
          </div>

          {/* 추천 프리셋 */}
          <div className="space-y-2 pt-2">
            <label className="block text-xs font-medium text-slate-400">
              샘플 프리셋 적용하기
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
                  <span className="text-[10px] text-slate-500">({preset.theme})</span>
                </button>
              ))}
            </div>
          </div>

          {/* 엔드포인트 URL 정보 */}
          <div className="pt-4 border-t border-slate-800/80 space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>TinyOG 엔드포인트 URL</span>
              <button
                type="button"
                onClick={handleCopyUrl}
                className="text-blue-400 hover:text-blue-300 font-medium transition-colors"
              >
                {urlCopied ? "✓ URL 복사됨!" : "URL 복사"}
              </button>
            </div>
            <div className="p-3 bg-slate-950/90 border border-slate-800 rounded-xl font-mono text-xs text-slate-400 truncate select-all">
              {ogPath}
            </div>
          </div>
        </div>

        {/* 실시간 미리보기 및 메타 태그 복사 영역 */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          {/* 이미지 미리보기 카드 */}
          <div className="bg-slate-900/80 border border-slate-800 backdrop-blur-xl rounded-2xl p-6 shadow-2xl flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-red-500/80 inline-block" />
                <span className="w-3 h-3 rounded-full bg-yellow-500/80 inline-block" />
                <span className="w-3 h-3 rounded-full bg-green-500/80 inline-block" />
                <span className="ml-2 text-xs font-medium text-slate-400">
                  TinyOG 미리보기 (1200 × 630 px) —{" "}
                  <span className="text-blue-400 font-semibold uppercase">
                    {theme} 테마
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
                    렌더링 중...
                  </span>
                )}
                <a
                  href={ogPath}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-all flex items-center gap-1"
                >
                  새 탭
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

            {/* 이미지 프레임 (1200:630 종횡비) */}
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

          {/* 메타 태그 코드 박스 및 액션 버튼 카드 */}
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
                <h3 className="text-sm font-semibold text-slate-200">
                  HTML 메타 태그 &amp; 내보내기
                </h3>
              </div>

              {/* 액션 버튼 그룹 */}
              <div className="flex items-center gap-2">
                {/* HTML 복사하기 버튼 */}
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
                      복사됨!
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
                      HTML 복사하기
                    </>
                  )}
                </button>

                {/* 이미지 다운로드 버튼 */}
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
                      저장 중...
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
                      이미지 다운로드
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* HTML 코드 박스 */}
            <div className="relative group">
              <pre className="p-4 bg-slate-950/90 border border-slate-800 rounded-xl font-mono text-xs text-blue-300 select-all overflow-x-auto whitespace-pre-wrap break-all leading-relaxed shadow-inner">
                {metaTagSnippet}
              </pre>
            </div>

            <p className="text-[11px] text-slate-500">
              💡 TinyOG 메타 태그를 웹사이트의 <code className="text-slate-400">&lt;head&gt;</code> 태그 내에 붙여넣으면 소셜 미디어(X, 카카오톡, 슬랙 등)에서 풍부한 미리보기가 표시됩니다.
            </p>
          </div>
        </div>
      </div>

      {/* 푸터 영역 (Lemon Squeezy 심사 요건) */}
      <footer className="w-full max-w-5xl mt-16 pt-8 border-t border-slate-800/80 text-center flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
          <span className="font-semibold text-slate-300">TinyOG</span>
          <span>•</span>
          <span>Lifetime Pass</span>
          <span>•</span>
          <span>One-time payment $29</span>
          <span>•</span>
          <span className="text-emerald-400 font-medium">14-day refund guarantee</span>
        </div>
        <div className="flex flex-wrap items-center justify-center sm:justify-end gap-3 text-slate-400 text-[11px]">
          <a
            href={CHECKOUT_URL}
            target="_blank"
            rel="noreferrer"
            className="text-purple-400 hover:text-purple-300 font-medium transition-colors"
          >
            Buy Lifetime Pass ($29)
          </a>
          <span>•</span>
          <a
            href="mailto:support@tinyog.com"
            className="hover:text-slate-200 transition-colors"
          >
            Support: support@tinyog.com
          </a>
        </div>
      </footer>

      {/* 플로팅 토스트 알림 */}
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
