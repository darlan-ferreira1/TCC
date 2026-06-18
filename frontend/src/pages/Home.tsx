import { simulations, type SimulationMeta } from '../simulations/registry';

const CATEGORY_COLORS: Record<string, string> = {
  Química: '#3498db',
  Física:  '#9b59b6',
  Biologia:'#2ecc71',
};

interface Props {
  onNavigate: (id: string) => void;
}

export default function Home({ onNavigate }: Props) {
  const categories = [...new Set(simulations.map((s) => s.category))];

  return (
    <div style={{
      minHeight: '100vh',
      background: '#0a0a1a',
      color: '#e0e0f0',
      fontFamily: 'Inter, sans-serif',
      padding: '48px 32px',
    }}>
      <header style={{ maxWidth: 900, margin: '0 auto 48px' }}>
        <h1 style={{ fontSize: 36, fontWeight: 700, color: '#fff', marginBottom: 8 }}>
          Simulações Científicas 3D
        </h1>
        <p style={{ color: '#888', fontSize: 16 }}>
          Experimentos interativos com física real — explore, ajuste parâmetros e observe em tempo real.
        </p>
      </header>

      <main style={{ maxWidth: 900, margin: '0 auto' }}>
        {categories.map((category) => (
          <section key={category} style={{ marginBottom: 40 }}>
            <h2 style={{
              fontSize: 13,
              fontWeight: 600,
              letterSpacing: 2,
              color: CATEGORY_COLORS[category] ?? '#aaa',
              textTransform: 'uppercase',
              marginBottom: 16,
              borderBottom: `1px solid #1a1a3a`,
              paddingBottom: 8,
            }}>
              {category}
            </h2>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
              gap: 16,
            }}>
              {simulations
                .filter((s) => s.category === category)
                .map((sim) => (
                  <SimulationCard
                    key={sim.id}
                    sim={sim}
                    accentColor={CATEGORY_COLORS[category] ?? '#aaa'}
                    onNavigate={onNavigate}
                  />
                ))}
            </div>
          </section>
        ))}
      </main>
    </div>
  );
}

function SimulationCard({
  sim,
  accentColor,
  onNavigate,
}: {
  sim: SimulationMeta;
  accentColor: string;
  onNavigate: (id: string) => void;
}) {
  return (
    <button
      onClick={() => sim.available && onNavigate(sim.id)}
      disabled={!sim.available}
      style={{
        background: '#111130',
        border: `1px solid ${sim.available ? '#222244' : '#1a1a2e'}`,
        borderRadius: 12,
        padding: '20px 20px 16px',
        textAlign: 'left',
        cursor: sim.available ? 'pointer' : 'default',
        opacity: sim.available ? 1 : 0.5,
        transition: 'border-color 0.2s, transform 0.15s',
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
      }}
      onMouseEnter={(e) => {
        if (!sim.available) return;
        (e.currentTarget as HTMLButtonElement).style.borderColor = accentColor;
        (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-2px)';
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLButtonElement).style.borderColor = '#222244';
        (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(0)';
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <span style={{
          fontSize: 11,
          fontWeight: 600,
          letterSpacing: 1,
          color: accentColor,
          textTransform: 'uppercase',
        }}>
          {sim.category}
        </span>
        {!sim.available && (
          <span style={{
            fontSize: 10,
            fontWeight: 600,
            letterSpacing: 0.5,
            color: '#555',
            background: '#1a1a2e',
            border: '1px solid #222',
            borderRadius: 4,
            padding: '2px 6px',
          }}>
            EM BREVE
          </span>
        )}
      </div>

      <h3 style={{ fontSize: 17, fontWeight: 600, color: '#e0e0f0', margin: 0 }}>
        {sim.title}
      </h3>

      <p style={{ fontSize: 13, color: '#666', margin: 0, lineHeight: 1.5 }}>
        {sim.description}
      </p>

      {sim.available && (
        <span style={{
          marginTop: 4,
          fontSize: 12,
          color: accentColor,
          fontWeight: 500,
        }}>
          Abrir simulação →
        </span>
      )}
    </button>
  );
}
