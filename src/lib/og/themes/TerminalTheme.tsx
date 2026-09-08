import { OgThemeProps } from '../types';

export function TerminalTheme({ title, tag, description, isPro }: OgThemeProps) {
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
}
