interface Props {
  title: string;
  onBack: () => void;
}

export default function Placeholder({ title, onBack }: Props) {
  return (
    <div style={{
      height: '100vh',
      background: 'var(--bg)',
      color: 'var(--text)',
      fontFamily: 'Inter, sans-serif',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'column',
      gap: 24,
    }}>
      <span style={{ fontSize: 13, color: 'var(--text-muted)', letterSpacing: '0.15em', textTransform: 'uppercase' }}>
        {title}
      </span>
      <h1 style={{
        fontFamily: "'Playfair Display', serif",
        fontSize: 'clamp(2rem, 5vw, 3rem)',
        fontWeight: 700,
        color: 'var(--text)',
      }}>
        Hello, world!
      </h1>
      <button
        onClick={onBack}
        style={{
          background: 'var(--bg-surface)',
          border: '1px solid var(--border)',
          borderRadius: 8,
          color: 'var(--text-muted)',
          fontSize: 13,
          padding: '8px 18px',
          cursor: 'pointer',
          transition: 'border-color 0.15s, color 0.15s',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = 'var(--border-hover)';
          e.currentTarget.style.color = 'var(--text)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = 'var(--border)';
          e.currentTarget.style.color = 'var(--text-muted)';
        }}
      >
        ← Voltar
      </button>
    </div>
  );
}
