interface Props {
  onSelect: (mode: 'normal' | 'immersive') => void;
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
}

export default function ModeSelect({ onSelect, theme, onToggleTheme }: Props) {
  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--bg)',
      color: 'var(--text)',
      fontFamily: 'Inter, sans-serif',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 48,
      padding: 32,
      position: 'relative',
    }}>

      {/* Theme toggle — canto superior direito */}
      <button
        onClick={onToggleTheme}
        title={theme === 'dark' ? 'Tema claro' : 'Tema escuro'}
        style={{
          position: 'absolute',
          top: 20,
          right: 24,
          background: 'var(--bg-surface)',
          border: '1px solid var(--border)',
          borderRadius: 8,
          padding: '6px 12px',
          cursor: 'pointer',
          color: 'var(--text-muted)',
          fontSize: 18,
        }}
      >
        {theme === 'dark' ? '☀️' : '🌙'}
      </button>

      {/* Cabeçalho */}
      <div style={{ textAlign: 'center' }}>
        <span style={{
          fontFamily: "'Playfair Display', serif",
          fontWeight: 700,
          fontSize: '2.2rem',
          color: 'var(--accent-fisica)',
        }}>
          CLARA<span style={{ color: 'var(--text-muted)', fontWeight: 400, fontStyle: 'italic' }}>.js</span>
        </span>
        <p style={{ color: 'var(--text-muted)', marginTop: 12, fontSize: 15 }}>
          Como você quer explorar as simulações?
        </p>
      </div>

      {/* Cards de modo */}
      <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', justifyContent: 'center' }}>
        <ModeCard
          title="Modo Normal"
          description="Acesse a galeria de simulações e explore cada experimento individualmente com controles e painéis de parâmetros."
          accent="var(--accent-quimica)"
          icon="⚗️"
          onClick={() => onSelect('normal')}
        />
        <ModeCard
          title="Modo Imersivo"
          description="Experiência em tela cheia sem distrações, otimizada para uso em sala de aula ou apresentações."
          accent="var(--accent-fisica)"
          icon="🔭"
          onClick={() => onSelect('immersive')}
        />
      </div>
    </div>
  );
}

function ModeCard({
  title, description, accent, icon, onClick,
}: {
  title: string;
  description: string;
  accent: string;
  icon: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        background: 'var(--bg-surface)',
        border: '1px solid var(--border)',
        borderRadius: 16,
        padding: '36px 32px',
        width: 280,
        textAlign: 'left',
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        gap: 16,
        transition: 'border-color 0.2s, transform 0.15s, box-shadow 0.2s',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = accent;
        e.currentTarget.style.transform = 'translateY(-3px)';
        e.currentTarget.style.boxShadow = `0 8px 24px ${accent}33`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = 'var(--border)';
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
      <span style={{ fontSize: 36 }}>{icon}</span>
      <div>
        <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--text)', marginBottom: 8 }}>
          {title}
        </div>
        <div style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.6 }}>
          {description}
        </div>
      </div>
      <span style={{ fontSize: 13, color: accent, fontWeight: 500, marginTop: 4 }}>
        Entrar →
      </span>
    </button>
  );
}
