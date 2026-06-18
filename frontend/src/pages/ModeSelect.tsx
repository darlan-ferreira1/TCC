interface Props {
  onSelect: (mode: 'normal' | 'immersive') => void;
}

export default function ModeSelect({ onSelect }: Props) {
  return (
    <div style={{
      minHeight: '100vh',
      background: '#0a0a1a',
      color: '#e0e0f0',
      fontFamily: 'Inter, sans-serif',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 48,
      padding: 32,
    }}>
      <div style={{ textAlign: 'center' }}>
        <h1 style={{ fontSize: 36, fontWeight: 700, color: '#fff', margin: 0 }}>
          Simulações Científicas 3D
        </h1>
        <p style={{ color: '#555', marginTop: 12, fontSize: 15 }}>
          Escolha como deseja explorar
        </p>
      </div>

      <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', justifyContent: 'center' }}>
        <ModeCard
          title="Modo Normal"
          description="Acesse a galeria de simulações e explore cada experimento individualmente com controles e painéis de parâmetros."
          accent="#3498db"
          icon="⚗️"
          onClick={() => onSelect('normal')}
        />
        <ModeCard
          title="Modo Imersivo"
          description="Experiência em tela cheia sem distrações, otimizada para uso em sala de aula ou apresentações."
          accent="#9b59b6"
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
        background: '#111130',
        border: `1px solid #222244`,
        borderRadius: 16,
        padding: '36px 32px',
        width: 280,
        textAlign: 'left',
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        gap: 16,
        transition: 'border-color 0.2s, transform 0.15s',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = accent;
        e.currentTarget.style.transform = 'translateY(-3px)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = '#222244';
        e.currentTarget.style.transform = 'translateY(0)';
      }}
    >
      <span style={{ fontSize: 36 }}>{icon}</span>
      <div>
        <div style={{ fontSize: 20, fontWeight: 700, color: '#fff', marginBottom: 8 }}>
          {title}
        </div>
        <div style={{ fontSize: 13, color: '#666', lineHeight: 1.6 }}>
          {description}
        </div>
      </div>
      <span style={{ fontSize: 13, color: accent, fontWeight: 500, marginTop: 4 }}>
        Entrar →
      </span>
    </button>
  );
}
