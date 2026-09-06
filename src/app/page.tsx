"use client";

import { useState, useEffect } from "react";

export default function Home() {
  const [title, setTitle] = useState(
    "Next.js 14에서 @vercel/og로 세련된 OG 이미지 생성하기"
  );
  const [tag, setTag] = useState("TUTORIAL");
  const [debouncedTitle, setDebouncedTitle] = useState(title);
  const [debouncedTag, setDebouncedTag] = useState(tag);
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
    }, 300);

    return () => clearTimeout(handler);
  }, [title, tag]);

  const ogPath = `/api/og?title=${encodeURIComponent(
    debouncedTitle || "Default Title"
  )}&tag=${encodeURIComponent(debouncedTag || "TAG")}`;

  const fullOgUrl = `${origin}${ogPath}`;

  // 요구된 메타 태그 HTML 코드
  const metaTagSnippet = `<meta property="og:image" content="${fullOgUrl}" />`;

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage((prev) => (prev === message ? null : prev));
    }, 2500);
  };

  // HTML 메타 태그 복사
  const handleCopyHtml = async () => {
    try {
      await navigator.clipboard.writeText(metaTagSnippet);
      setHtmlCopied(true);
      showToast("HTML 메타 태그가 클립보드에 복사되었습니다!");
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
      showToast("이미지 URL이 클립보드에 복사되었습니다!");
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
      const safeTitle = (debouncedTitle || "og-image")
        .replace(/[^a-zA-Z0-9가-힣\s-_]/g, "")
        .trim()
        .slice(0, 30);
      link.download = `${safeTitle || "og-image"}.png`;

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
      title: "Next.js 14 & @vercel/og로 소셜 미리보기 완성하기",
      tag: "FRONTEND",
    },
    {
      title: "Edge Runtime에서 동적으로 렌더링하는 OG 이미지",
      tag: "TUTORIAL",
    },
    {
      title: "2026년 프론트엔드 개발 트렌드 총정리",
      tag: "INSIGHT",
    },
  ];

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-start p-6 md:p-12 relative overflow-hidden">
      {/* 배경 글로우 효과 */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[400px] bg-blue-600/10 blur-[120px] rounded-full pointer-events-none -z-10" />

      {/* 상단 헤더 */}
      <div className="w-full max-w-5xl mb-10 text-center md:text-left">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold uppercase tracking-wider mb-3">
          <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
          Realtime Preview & Export
        </div>
        <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
          OG Image Generator
        </h1>
        <p className="mt-2 text-slate-400 text-sm md:text-base max-w-xl">
          실시간으로 텍스트를 입력해 1200×630 Open Graph 이미지를 생성하고, HTML 메타 태그 복사 및 PNG 이미지 저장을 한 번에 진행하세요.
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
              속성 설정
            </h2>
            <span className="text-xs text-slate-500">실시간 연동 중</span>
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
                  }}
                  className="text-xs px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 border border-slate-700 text-slate-300 transition-all hover:text-white"
                >
                  {preset.tag}
                </button>
              ))}
            </div>
          </div>

          {/* 엔드포인트 URL 정보 */}
          <div className="pt-4 border-t border-slate-800/80 space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>이미지 엔드포인트 URL</span>
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
                  미리보기 (1200 × 630 px)
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
                alt={`OG Image for ${title}`}
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
                  HTML 메타 태그 & 내보내기
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
              💡 웹사이트의 <code className="text-slate-400">&lt;head&gt;</code> 태그 내에 위 코드를 붙여넣으면 Facebook, Twitter, 카카오톡, 슬랙 등에서 풍부한 미리보기가 표시됩니다.
            </p>
          </div>
        </div>
      </div>

      {/* 플로팅 토스트 알림 */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl bg-slate-900/95 border border-blue-500/40 text-slate-100 shadow-2xl backdrop-blur-md animate-in fade-in slide-in-from-bottom-3 duration-200">
          <svg
            className="w-5 h-5 text-blue-400 shrink-0"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span className="text-xs font-medium">{toastMessage}</span>
        </div>
      )}
    </main>
  );
}
