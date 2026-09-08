// Pretendard Bold 폰트 바이너리 안전 로드 및 모듈 스코프 인메모리 캐싱
let cachedFont: ArrayBuffer | null = null;
let fontFetchPromise: Promise<ArrayBuffer | null> | null = null;

const FONT_URL =
  'https://cdn.jsdelivr.net/gh/orioncactus/pretendard/packages/pretendard/dist/web/static/woff/Pretendard-Bold.woff';

/**
 * Loads the Pretendard-Bold woff font with module-scoped in-memory caching.
 * If fetching fails temporarily, the promise is reset to allow future retries.
 */
export async function getPretendardFont(): Promise<ArrayBuffer | null> {
  if (cachedFont) return cachedFont;

  if (!fontFetchPromise) {
    fontFetchPromise = fetch(FONT_URL)
      .then(async (res) => {
        if (!res.ok) {
          console.warn(`Font fetch returned status ${res.status}: ${res.statusText}`);
          fontFetchPromise = null; // Reset on failure to allow retry
          return null;
        }
        cachedFont = await res.arrayBuffer();
        return cachedFont;
      })
      .catch((err) => {
        console.warn('Font network error, falling back to system sans-serif:', err);
        fontFetchPromise = null; // Reset on failure to allow retry
        return null;
      });
  }

  return fontFetchPromise;
}
