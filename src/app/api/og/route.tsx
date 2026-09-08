import { ImageResponse } from '@vercel/og';
import { NextRequest } from 'next/server';
import { ThemeId } from '@/types';
import { THEMES, PRO_THEME_IDS } from '@/lib/constants';

export const runtime = 'edge';

// Pretendard Bold 폰트 바이너리 안전 로드 및 인메모리 캐싱
let cachedFont: ArrayBuffer | null = null;
let fontFetchPromise: Promise<ArrayBuffer | null> | null = null;

async function getPretendardFont(): Promise<ArrayBuffer | null> {
  if (cachedFont) return cachedFont;
  if (!fontFetchPromise) {
    fontFetchPromise = fetch(
      'https://cdn.jsdelivr.net/gh/orioncactus/pretendard/packages/pretendard/dist/web/static/woff/Pretendard-Bold.woff'
    )
      .then(async (res) => {
        if (!res.ok) {
          console.warn(`Font fetch returned status ${res.status}: ${res.statusText}`);
          return null;
        }
        cachedFont = await res.arrayBuffer();
        return cachedFont;
      })
      .catch((err) => {
        console.warn('Font network error, falling back to system sans-serif:', err);
        return null;
      });
  }
  return fontFetchPromise;
}

// Lemon Squeezy 라이선스 키 검증 함수
async function validateLicenseKey(key: string | null): Promise<boolean> {
  if (!key) return false;

  // 로컬/개발 환경용 마스터 키 검증 (선택적 fallback)
  if (process.env.PRO_LICENSE_KEY && key === process.env.PRO_LICENSE_KEY) {
    return true;
  }

  try {
    const formData = new FormData();
    formData.append('license_key', key);

    const response = await fetch(
      'https://api.lemonsqueezy.com/v1/licenses/validate',
      {
        method: 'POST',
        headers: {
          Accept: 'application/json',
        },
        body: formData,
        next: { revalidate: 3600 },
      }
    );

    if (!response.ok) {
      return false;
    }

    const data = await response.json();
    return Boolean(data && data.valid === true);
  } catch {
    return false;
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // 1. 입력값 길이 제한 및 방어 (DoS / 메모리 고갈 방지)
    const rawTitle = searchParams.get('title') || 'Default Title';
    const rawTag = searchParams.get('tag') || 'Next.js';
    const rawDescription = searchParams.get('description') || '';
    const rawTheme = searchParams.get('theme') || 'dark';
    const rawKey = searchParams.get('key') || searchParams.get('licenseKey');

    // title: 최대 100자, description: 최대 200자, tag: 최대 30자
    const title = rawTitle.slice(0, 100).trim() || 'Default Title';
    const tag = rawTag.slice(0, 30).trim() || 'Next.js';
    const description = rawDescription.slice(0, 200).trim();
    const requestedTheme = rawTheme.slice(0, 20).toLowerCase();
    const userKey = rawKey ? rawKey.slice(0, 120).trim() : null;

    // 공식 TinyOG 자체 소셜 카드인 경우 워터마크 없이 프로 렌더링
    const isOfficialSiteCard =
      title.toLowerCase().includes('dynamic social cards with one url') &&
      tag.toUpperCase() === 'DEVELOPER TOOL';

    // Lemon Squeezy 공식 API를 통한 라이선스 키 검증
    const isPro = isOfficialSiteCard || (await validateLicenseKey(userKey));

    // 요청된 테마 유효성 검사 (PRO 테마도 데모 렌더링을 허용하여 미리보기 정상 출력)
    const activeTheme: ThemeId = THEMES.some((t) => t.id === requestedTheme)
      ? (requestedTheme as ThemeId)
      : 'dark';

    // 프리미엄 테마 검사 (gradient, terminal)
    const isPremiumTheme = PRO_THEME_IDS.includes(activeTheme);

    // 폰트 바이너리를 안전하게 획득 (실패 시 null)
    const fontData = await getPretendardFont();

    // 테마별 렌더링 JSX
    const renderContent = () => {
      switch (activeTheme) {
        case 'gradient':
          return (
            <div
              style={{
                height: '100%',
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                backgroundImage:
                  'linear-gradient(135deg, #4f46e5 0%, #7c3aed 50%, #db2777 100%)',
                padding: '60px 80px',
                fontFamily: '"Pretendard", sans-serif',
              }}
            >
              {/* 상단 태그 */}
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                    border: '1px solid rgba(255, 255, 255, 0.35)',
                    color: '#ffffff',
                    padding: '8px 24px',
                    borderRadius: '9999px',
                    fontSize: 22,
                    fontWeight: 700,
                    letterSpacing: '0.05em',
                    textTransform: 'uppercase',
                    wordBreak: 'keep-all',
                  }}
                >
                  {tag}
                </div>
              </div>

              {/* 중앙 타이틀 & 설명 */}
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  flex: 1,
                  padding: '24px 0',
                }}
              >
                <h1
                  style={{
                    fontSize: description ? 54 : 64,
                    fontWeight: 700,
                    color: '#ffffff',
                    lineHeight: 1.25,
                    margin: 0,
                    letterSpacing: '-0.02em',
                    wordBreak: 'keep-all',
                    display: '-webkit-box',
                    WebkitLineClamp: description ? 2 : 3,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                  }}
                >
                  {title}
                </h1>
                {description ? (
                  <p
                    style={{
                      fontSize: 26,
                      fontWeight: 500,
                      color: 'rgba(255, 255, 255, 0.85)',
                      lineHeight: 1.4,
                      margin: '16px 0 0 0',
                      wordBreak: 'keep-all',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                    }}
                  >
                    {description}
                  </p>
                ) : null}
              </div>

              {/* 하단 워터마크 (isPro가 false일 때만 노출) */}
              {!isPro && (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    borderTop: '1px solid rgba(255, 255, 255, 0.25)',
                    paddingTop: '24px',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      color: 'rgba(255, 255, 255, 0.9)',
                      fontSize: 20,
                      fontWeight: 700,
                      gap: '10px',
                    }}
                  >
                    <div
                      style={{
                        width: 10,
                        height: 10,
                        borderRadius: '50%',
                        backgroundColor: '#ffffff',
                      }}
                    />
                    <span>Generated by TinyOG (PRO Theme Demo)</span>
                  </div>
                </div>
              )}
            </div>
          );

        case 'minimal':
          return (
            <div
              style={{
                height: '100%',
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                backgroundColor: '#fafafa',
                padding: '60px 80px',
                border: '16px solid #f1f5f9',
                fontFamily: '"Pretendard", sans-serif',
              }}
            >
              {/* 상단 태그 */}
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    backgroundColor: '#f1f5f9',
                    border: '1px solid #cbd5e1',
                    color: '#0f172a',
                    padding: '8px 24px',
                    borderRadius: '9999px',
                    fontSize: 22,
                    fontWeight: 700,
                    letterSpacing: '0.05em',
                    textTransform: 'uppercase',
                    wordBreak: 'keep-all',
                  }}
                >
                  {tag}
                </div>
              </div>

              {/* 중앙 타이틀 & 설명 */}
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  flex: 1,
                  padding: '24px 0',
                }}
              >
                <h1
                  style={{
                    fontSize: description ? 54 : 64,
                    fontWeight: 700,
                    color: '#0f172a',
                    lineHeight: 1.25,
                    margin: 0,
                    letterSpacing: '-0.02em',
                    wordBreak: 'keep-all',
                    display: '-webkit-box',
                    WebkitLineClamp: description ? 2 : 3,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                  }}
                >
                  {title}
                </h1>
                {description ? (
                  <p
                    style={{
                      fontSize: 26,
                      fontWeight: 500,
                      color: '#64748b',
                      lineHeight: 1.4,
                      margin: '16px 0 0 0',
                      wordBreak: 'keep-all',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                    }}
                  >
                    {description}
                  </p>
                ) : null}
              </div>

              {/* 하단 워터마크 (isPro가 false일 때만 노출) */}
              {!isPro && (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    borderTop: '1px solid #e2e8f0',
                    paddingTop: '24px',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      color: '#64748b',
                      fontSize: 20,
                      fontWeight: 700,
                      gap: '10px',
                    }}
                  >
                    <div
                      style={{
                        width: 10,
                        height: 10,
                        borderRadius: '50%',
                        backgroundColor: '#0f172a',
                      }}
                    />
                    <span>Generated by TinyOG</span>
                  </div>
                </div>
              )}
            </div>
          );

        case 'terminal':
          return (
            <div
              style={{
                height: '100%',
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                backgroundColor: '#18181b',
                padding: '40px 60px',
                fontFamily: '"Pretendard", sans-serif',
              }}
            >
              {/* 터미널 윈도우 프레임 */}
              <div
                style={{
                  height: '100%',
                  width: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  backgroundColor: '#09090b',
                  borderRadius: '16px',
                  border: '1px solid #27272a',
                  padding: '30px 48px',
                }}
              >
                {/* 상단 신호등 원형 도트 3개 + 태그 */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    borderBottom: '1px solid #27272a',
                    paddingBottom: '20px',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div
                      style={{
                        width: 14,
                        height: 14,
                        borderRadius: '50%',
                        backgroundColor: '#ef4444',
                      }}
                    />
                    <div
                      style={{
                        width: 14,
                        height: 14,
                        borderRadius: '50%',
                        backgroundColor: '#eab308',
                      }}
                    />
                    <div
                      style={{
                        width: 14,
                        height: 14,
                        borderRadius: '50%',
                        backgroundColor: '#22c55e',
                      }}
                    />
                  </div>

                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      backgroundColor: 'rgba(34, 197, 94, 0.15)',
                      border: '1px solid rgba(34, 197, 94, 0.3)',
                      color: '#4ade80',
                      padding: '4px 18px',
                      borderRadius: '9999px',
                      fontSize: 18,
                      fontWeight: 700,
                      letterSpacing: '0.05em',
                      textTransform: 'uppercase',
                      wordBreak: 'keep-all',
                    }}
                  >
                    $ {tag}
                  </div>
                </div>

                {/* 중앙 터미널 프롬프트 & 타이틀 & 설명 */}
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    flex: 1,
                    padding: '24px 0',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '16px',
                      width: '100%',
                    }}
                  >
                    <span
                      style={{
                        color: '#22c55e',
                        fontSize: description ? 44 : 52,
                        fontWeight: 700,
                        lineHeight: 1.25,
                      }}
                    >
                      ❯
                    </span>
                    <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                      <h1
                        style={{
                          fontSize: description ? 48 : 58,
                          fontWeight: 700,
                          color: '#f4f4f5',
                          lineHeight: 1.25,
                          margin: 0,
                          letterSpacing: '-0.02em',
                          wordBreak: 'keep-all',
                          display: '-webkit-box',
                          WebkitLineClamp: description ? 2 : 3,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                        }}
                      >
                        {title}
                      </h1>
                      {description ? (
                        <p
                          style={{
                            fontSize: 24,
                            fontWeight: 500,
                            color: '#a1a1aa',
                            lineHeight: 1.4,
                            margin: '12px 0 0 0',
                            wordBreak: 'keep-all',
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                          }}
                        >
                          # {description}
                        </p>
                      ) : null}
                    </div>
                  </div>
                </div>

                {/* 하단 워터마크 (isPro가 false일 때만 노출) */}
                {!isPro && (
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      borderTop: '1px solid #27272a',
                      paddingTop: '20px',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        color: '#71717a',
                        fontSize: 18,
                        fontWeight: 700,
                        gap: '10px',
                      }}
                    >
                      <div
                        style={{
                          width: 8,
                          height: 8,
                          borderRadius: '50%',
                          backgroundColor: '#22c55e',
                        }}
                      />
                      <span>bash — Generated by TinyOG (PRO Theme Demo)</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );

        case 'notion':
          return (
            <div
              style={{
                height: '100%',
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                backgroundColor: '#fbfbfa',
                padding: '60px 80px',
                border: '16px solid #f1f0eb',
                fontFamily: '"Pretendard", sans-serif',
              }}
            >
              {/* 상단 태그 */}
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    backgroundColor: '#f1f1ef',
                    border: '1px solid #e3e2de',
                    color: '#37352f',
                    padding: '8px 22px',
                    borderRadius: '6px',
                    fontSize: 20,
                    fontWeight: 700,
                    letterSpacing: '0.04em',
                    textTransform: 'uppercase',
                    wordBreak: 'keep-all',
                    gap: '8px',
                  }}
                >
                  <div
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: '2px',
                      backgroundColor: '#787774',
                    }}
                  />
                  <span>{tag}</span>
                </div>
              </div>

              {/* 중앙 타이틀 & 설명 */}
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  flex: 1,
                  padding: '24px 0',
                }}
              >
                <h1
                  style={{
                    fontSize: description ? 54 : 64,
                    fontWeight: 700,
                    color: '#37352f',
                    lineHeight: 1.25,
                    margin: 0,
                    letterSpacing: '-0.02em',
                    wordBreak: 'keep-all',
                    display: '-webkit-box',
                    WebkitLineClamp: description ? 2 : 3,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                  }}
                >
                  {title}
                </h1>
                {description ? (
                  <p
                    style={{
                      fontSize: 26,
                      fontWeight: 500,
                      color: '#787774',
                      lineHeight: 1.4,
                      margin: '16px 0 0 0',
                      wordBreak: 'keep-all',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                    }}
                  >
                    {description}
                  </p>
                ) : null}
              </div>

              {/* 하단 워터마크 (isPro가 false일 때만 노출) */}
              {!isPro && (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    borderTop: '1px solid #e3e2de',
                    paddingTop: '24px',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      color: '#787774',
                      fontSize: 20,
                      fontWeight: 700,
                      gap: '10px',
                    }}
                  >
                    <div
                      style={{
                        width: 10,
                        height: 10,
                        borderRadius: '2px',
                        backgroundColor: '#37352f',
                      }}
                    />
                    <span>Generated by TinyOG (PRO Theme Demo)</span>
                  </div>
                </div>
              )}
            </div>
          );

        case 'bento':
          return (
            <div
              style={{
                height: '100%',
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                backgroundColor: '#09090b',
                backgroundImage:
                  'radial-gradient(circle at 90% 10%, rgba(99, 102, 241, 0.15) 0%, transparent 45%), radial-gradient(circle at 10% 90%, rgba(168, 85, 247, 0.12) 0%, transparent 45%)',
                padding: '40px 50px',
                fontFamily: '"Pretendard", sans-serif',
              }}
            >
              {/* Bento Inner Glass Card */}
              <div
                style={{
                  height: '100%',
                  width: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  backgroundColor: 'rgba(255, 255, 255, 0.03)',
                  borderRadius: '24px',
                  border: '1px solid rgba(255, 255, 255, 0.09)',
                  padding: '40px 50px',
                }}
              >
                {/* 상단 태그 */}
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      backgroundColor: 'rgba(255, 255, 255, 0.06)',
                      border: '1px solid rgba(255, 255, 255, 0.14)',
                      color: '#e4e4e7',
                      padding: '8px 22px',
                      borderRadius: '9999px',
                      fontSize: 20,
                      fontWeight: 700,
                      letterSpacing: '0.05em',
                      textTransform: 'uppercase',
                      wordBreak: 'keep-all',
                      gap: '8px',
                    }}
                  >
                    <div
                      style={{
                        width: 8,
                        height: 8,
                        borderRadius: '50%',
                        backgroundColor: '#818cf8',
                      }}
                    />
                    <span>{tag}</span>
                  </div>
                </div>

                {/* 중앙 타이틀 & 설명 */}
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    flex: 1,
                    padding: '24px 0',
                  }}
                >
                  <h1
                    style={{
                      fontSize: description ? 52 : 62,
                      fontWeight: 700,
                      color: '#fafafa',
                      lineHeight: 1.25,
                      margin: 0,
                      letterSpacing: '-0.02em',
                      wordBreak: 'keep-all',
                      display: '-webkit-box',
                      WebkitLineClamp: description ? 2 : 3,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                    }}
                  >
                    {title}
                  </h1>
                  {description ? (
                    <p
                      style={{
                        fontSize: 26,
                        fontWeight: 500,
                        color: '#a1a1aa',
                        lineHeight: 1.4,
                        margin: '16px 0 0 0',
                        wordBreak: 'keep-all',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                      }}
                    >
                      {description}
                    </p>
                  ) : null}
                </div>

                {/* 하단 워터마크 (isPro가 false일 때만 노출) */}
                {!isPro && (
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                      paddingTop: '20px',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        color: '#71717a',
                        fontSize: 18,
                        fontWeight: 700,
                        gap: '10px',
                      }}
                    >
                      <div
                        style={{
                          width: 8,
                          height: 8,
                          borderRadius: '50%',
                          backgroundColor: '#818cf8',
                        }}
                      />
                      <span>Generated by TinyOG (PRO Theme Demo)</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );

        case 'cyberpunk':
          return (
            <div
              style={{
                height: '100%',
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                backgroundColor: '#07020d',
                backgroundImage:
                  'radial-gradient(circle at 85% 15%, rgba(0, 242, 254, 0.16) 0%, transparent 45%), radial-gradient(circle at 15% 85%, rgba(254, 1, 154, 0.16) 0%, transparent 45%)',
                padding: '60px 80px',
                border: '6px solid #00f2fe',
                fontFamily: '"Pretendard", sans-serif',
              }}
            >
              {/* 상단 태그 */}
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    backgroundColor: 'rgba(0, 242, 254, 0.12)',
                    border: '1px solid #00f2fe',
                    color: '#00f2fe',
                    padding: '8px 22px',
                    borderRadius: '4px',
                    fontSize: 20,
                    fontWeight: 700,
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    wordBreak: 'keep-all',
                    gap: '8px',
                  }}
                >
                  <div
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: '0px',
                      backgroundColor: '#fe019a',
                    }}
                  />
                  <span>// {tag}</span>
                </div>
              </div>

              {/* 중앙 타이틀 & 설명 */}
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  flex: 1,
                  padding: '24px 0',
                }}
              >
                <h1
                  style={{
                    fontSize: description ? 54 : 64,
                    fontWeight: 700,
                    color: '#ffffff',
                    lineHeight: 1.25,
                    margin: 0,
                    letterSpacing: '-0.02em',
                    wordBreak: 'keep-all',
                    display: '-webkit-box',
                    WebkitLineClamp: description ? 2 : 3,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                  }}
                >
                  {title}
                </h1>
                {description ? (
                  <p
                    style={{
                      fontSize: 26,
                      fontWeight: 600,
                      color: '#fe019a',
                      lineHeight: 1.4,
                      margin: '16px 0 0 0',
                      wordBreak: 'keep-all',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                    }}
                  >
                    {description}
                  </p>
                ) : null}
              </div>

              {/* 하단 워터마크 (isPro가 false일 때만 노출) */}
              {!isPro && (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    borderTop: '1px solid rgba(0, 242, 254, 0.3)',
                    paddingTop: '24px',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      color: '#00f2fe',
                      fontSize: 20,
                      fontWeight: 700,
                      gap: '10px',
                    }}
                  >
                    <div
                      style={{
                        width: 10,
                        height: 10,
                        borderRadius: '0px',
                        backgroundColor: '#fe019a',
                      }}
                    />
                    <span>SYSTEM // Generated by TinyOG (PRO Theme Demo)</span>
                  </div>
                </div>
              )}
            </div>
          );

        case 'sunset':
          return (
            <div
              style={{
                height: '100%',
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                backgroundImage:
                  'linear-gradient(135deg, #ea580c 0%, #c026d3 50%, #4338ca 100%)',
                padding: '60px 80px',
                fontFamily: '"Pretendard", sans-serif',
              }}
            >
              {/* 상단 태그 */}
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                    border: '1px solid rgba(255, 255, 255, 0.4)',
                    color: '#ffffff',
                    padding: '8px 24px',
                    borderRadius: '9999px',
                    fontSize: 22,
                    fontWeight: 700,
                    letterSpacing: '0.05em',
                    textTransform: 'uppercase',
                    wordBreak: 'keep-all',
                    gap: '8px',
                  }}
                >
                  <div
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      backgroundColor: '#fbbf24',
                    }}
                  />
                  <span>{tag}</span>
                </div>
              </div>

              {/* 중앙 타이틀 & 설명 */}
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  flex: 1,
                  padding: '24px 0',
                }}
              >
                <h1
                  style={{
                    fontSize: description ? 54 : 64,
                    fontWeight: 700,
                    color: '#ffffff',
                    lineHeight: 1.25,
                    margin: 0,
                    letterSpacing: '-0.02em',
                    wordBreak: 'keep-all',
                    display: '-webkit-box',
                    WebkitLineClamp: description ? 2 : 3,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                  }}
                >
                  {title}
                </h1>
                {description ? (
                  <p
                    style={{
                      fontSize: 26,
                      fontWeight: 500,
                      color: 'rgba(255, 255, 255, 0.9)',
                      lineHeight: 1.4,
                      margin: '16px 0 0 0',
                      wordBreak: 'keep-all',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                    }}
                  >
                    {description}
                  </p>
                ) : null}
              </div>

              {/* 하단 워터마크 (isPro가 false일 때만 노출) */}
              {!isPro && (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    borderTop: '1px solid rgba(255, 255, 255, 0.25)',
                    paddingTop: '24px',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      color: 'rgba(255, 255, 255, 0.9)',
                      fontSize: 20,
                      fontWeight: 700,
                      gap: '10px',
                    }}
                  >
                    <div
                      style={{
                        width: 10,
                        height: 10,
                        borderRadius: '50%',
                        backgroundColor: '#fbbf24',
                      }}
                    />
                    <span>Generated by TinyOG (PRO Theme Demo)</span>
                  </div>
                </div>
              )}
            </div>
          );

        case 'dark':
        default:
          return (
            <div
              style={{
                height: '100%',
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                backgroundColor: '#0f172a',
                backgroundImage:
                  'radial-gradient(circle at 25px 25px, rgba(255, 255, 255, 0.05) 2%, transparent 0%), radial-gradient(circle at 75px 75px, rgba(255, 255, 255, 0.05) 2%, transparent 0%)',
                backgroundSize: '100px 100px',
                padding: '60px 80px',
                fontFamily: '"Pretendard", sans-serif',
              }}
            >
              {/* 상단 태그 */}
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    backgroundColor: 'rgba(37, 99, 235, 0.15)',
                    border: '1px solid rgba(59, 130, 246, 0.4)',
                    color: '#60a5fa',
                    padding: '8px 24px',
                    borderRadius: '9999px',
                    fontSize: 22,
                    fontWeight: 700,
                    letterSpacing: '0.05em',
                    textTransform: 'uppercase',
                    wordBreak: 'keep-all',
                  }}
                >
                  {tag}
                </div>
              </div>

              {/* 중앙 타이틀 & 설명 */}
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  flex: 1,
                  padding: '24px 0',
                }}
              >
                <h1
                  style={{
                    fontSize: description ? 54 : 64,
                    fontWeight: 700,
                    color: '#f8fafc',
                    lineHeight: 1.25,
                    margin: 0,
                    letterSpacing: '-0.02em',
                    wordBreak: 'keep-all',
                    display: '-webkit-box',
                    WebkitLineClamp: description ? 2 : 3,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                  }}
                >
                  {title}
                </h1>
                {description ? (
                  <p
                    style={{
                      fontSize: 26,
                      fontWeight: 500,
                      color: '#94a3b8',
                      lineHeight: 1.4,
                      margin: '16px 0 0 0',
                      wordBreak: 'keep-all',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                    }}
                  >
                    {description}
                  </p>
                ) : null}
              </div>

              {/* 하단 워터마크 (isPro가 false일 때만 노출) */}
              {!isPro && (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    borderTop: '1px solid rgba(255, 255, 255, 0.1)',
                    paddingTop: '24px',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      color: '#94a3b8',
                      fontSize: 20,
                      fontWeight: 700,
                      gap: '10px',
                    }}
                  >
                    <div
                      style={{
                        width: 10,
                        height: 10,
                        borderRadius: '50%',
                        backgroundColor: '#38bdf8',
                      }}
                    />
                    <span>Generated by TinyOG</span>
                  </div>
                </div>
              )}
            </div>
          );
      }
    };

    return new ImageResponse(renderContent(), {
      width: 1200,
      height: 630,
      headers: {
        'Cache-Control':
          'public, max-age=86400, s-maxage=31536000, stale-while-revalidate=86400',
      },
      fonts: fontData
        ? [
            {
              name: 'Pretendard',
              data: fontData,
              style: 'normal',
              weight: 700,
            },
          ]
        : undefined,
    });
  } catch (error: unknown) {
    console.error('TinyOG Edge API Generation Error:', error);

    // 예외 발생 시 크롤러/클라이언트에게 500 에러 대신 안전한 Fallback 이미지 반환
    try {
      return new ImageResponse(
        (
          <div
            style={{
              height: '100%',
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              backgroundColor: '#0f172a',
              padding: '60px 80px',
              fontFamily: 'sans-serif',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  backgroundColor: 'rgba(37, 99, 235, 0.2)',
                  border: '1px solid rgba(59, 130, 246, 0.4)',
                  color: '#60a5fa',
                  padding: '8px 24px',
                  borderRadius: '9999px',
                  fontSize: 22,
                  fontWeight: 700,
                  letterSpacing: '0.05em',
                  textTransform: 'uppercase',
                }}
              >
                TinyOG
              </div>
            </div>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                flex: 1,
                padding: '24px 0',
              }}
            >
              <h1
                style={{
                  fontSize: 56,
                  fontWeight: 700,
                  color: '#f8fafc',
                  lineHeight: 1.3,
                  margin: 0,
                  wordBreak: 'keep-all',
                }}
              >
                Social Card Preview
              </h1>
            </div>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                borderTop: '1px solid rgba(255, 255, 255, 0.1)',
                paddingTop: '24px',
              }}
            >
              <span
                style={{
                  color: '#94a3b8',
                  fontSize: 20,
                  fontWeight: 700,
                }}
              >
                tinyog.cloud
              </span>
            </div>
          </div>
        ),
        {
          width: 1200,
          height: 630,
          headers: {
            'Cache-Control': 'no-store, must-revalidate',
          },
        }
      );
    } catch {
      return new Response('Failed to generate image', {
        status: 500,
        headers: { 'Content-Type': 'text/plain' },
      });
    }
  }
}
