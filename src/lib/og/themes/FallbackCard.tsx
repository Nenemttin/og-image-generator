export function FallbackCard() {
  return (
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
  );
}
