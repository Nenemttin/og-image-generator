import { ImageResponse } from '@vercel/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

// Pretendard Bold 폰트 바이너리 로드
const fontPromise = fetch(
  'https://cdn.jsdelivr.net/gh/orioncactus/pretendard/packages/pretendard/dist/web/static/woff/Pretendard-Bold.woff'
).then((res) => {
  if (!res.ok) {
    throw new Error(`Failed to fetch font: ${res.statusText}`);
  }
  return res.arrayBuffer();
});

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

    const title = searchParams.get('title') || 'Default Title';
    const tag = searchParams.get('tag') || 'Next.js';
    const requestedTheme = (searchParams.get('theme') || 'dark').toLowerCase();
    const userKey = searchParams.get('key');

    // Lemon Squeezy 공식 API를 통한 라이선스 키 검증
    const isPro = await validateLicenseKey(userKey);

    // 프리미엄 테마 검사 (gradient, terminal)
    const isPremiumTheme = requestedTheme === 'gradient' || requestedTheme === 'terminal';

    // 무료 유저는 프리미엄 테마 요청 시 기본 dark 테마로 강제 대체
    const activeTheme = !isPro && isPremiumTheme ? 'dark' : requestedTheme;

    // 폰트 바이너리를 ArrayBuffer로 획득
    const fontData = await fontPromise;

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

              {/* 중앙 타이틀 */}
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
                    fontSize: 64,
                    fontWeight: 700,
                    color: '#ffffff',
                    lineHeight: 1.3,
                    margin: 0,
                    letterSpacing: '-0.02em',
                    wordBreak: 'keep-all',
                    display: '-webkit-box',
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                  }}
                >
                  {title}
                </h1>
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
                    <span>Generated by TinyOG</span>
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

              {/* 중앙 타이틀 */}
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
                    fontSize: 64,
                    fontWeight: 700,
                    color: '#0f172a',
                    lineHeight: 1.3,
                    margin: 0,
                    letterSpacing: '-0.02em',
                    wordBreak: 'keep-all',
                    display: '-webkit-box',
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                  }}
                >
                  {title}
                </h1>
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

                {/* 중앙 터미널 프롬프트 & 타이틀 */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
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
                        fontSize: 52,
                        fontWeight: 700,
                        lineHeight: 1.3,
                      }}
                    >
                      ❯
                    </span>
                    <h1
                      style={{
                        fontSize: 58,
                        fontWeight: 700,
                        color: '#f4f4f5',
                        lineHeight: 1.3,
                        margin: 0,
                        letterSpacing: '-0.02em',
                        wordBreak: 'keep-all',
                        display: '-webkit-box',
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                      }}
                    >
                      {title}
                    </h1>
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
                      <span>bash — Generated by TinyOG</span>
                    </div>
                  </div>
                )}
              </div>
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

              {/* 중앙 타이틀 */}
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
                    fontSize: 64,
                    fontWeight: 700,
                    color: '#f8fafc',
                    lineHeight: 1.3,
                    margin: 0,
                    letterSpacing: '-0.02em',
                    wordBreak: 'keep-all',
                    display: '-webkit-box',
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                  }}
                >
                  {title}
                </h1>
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
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
      fonts: [
        {
          name: 'Pretendard',
          data: fontData,
          style: 'normal',
          weight: 700,
        },
      ],
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return new Response(`Failed to generate the image: ${message}`, {
      status: 500,
    });
  }
}
