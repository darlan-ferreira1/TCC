import { useState } from 'react';
import ModeSelect from './pages/ModeSelect';
import Home from './pages/Home';
import BohrModelSimulation         from './simulations/chemistry/BohrModel/index';
import MolecularGeometrySimulation from './simulations/chemistry/MolecularGeometry/index';
import DnaHelixSimulation          from './simulations/biology/DnaHelix/index';
import PendulumSimulation          from './simulations/physics/Pendulum/index';
import WavesSimulation             from './simulations/physics/Waves/index';
import ProjectileSimulation        from './simulations/physics/Projectile/index';
import SolarSystemSimulation       from './simulations/physics/SolarSystem/index';

type Mode = 'select' | 'normal' | 'immersive';

type Page =
  | 'home'
  | 'bohr-model'
  | 'molecular-geometry'
  | 'dna-helix'
  | 'simple-pendulum'
  | 'mechanical-waves'
  | 'projectile-motion'
  | 'planetary-motion';

export default function App() {
  const [mode, setMode] = useState<Mode>('select');
  const [page, setPage] = useState<Page>('home');

  if (mode === 'select') return <ModeSelect onSelect={setMode} />;

  if (mode === 'immersive') {
    return (
      <div style={{
        height: '100vh',
        background: '#0a0a1a',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'Inter, sans-serif',
        color: '#e0e0f0',
        fontSize: 32,
        flexDirection: 'column',
        gap: 24,
      }}>
        Hello, world!
        <button
          onClick={() => setMode('select')}
          style={{
            background: 'transparent',
            border: '1px solid #333366',
            borderRadius: 8,
            color: '#555',
            fontSize: 13,
            padding: '6px 16px',
            cursor: 'pointer',
          }}
        >
          ← Voltar
        </button>
      </div>
    );
  }

  const goHome = () => setPage('home');

  if (page === 'bohr-model')        return <BohrModelSimulation         onBack={goHome} />;
  if (page === 'molecular-geometry') return <MolecularGeometrySimulation onBack={goHome} />;
  if (page === 'dna-helix')         return <DnaHelixSimulation          onBack={goHome} />;
  if (page === 'simple-pendulum')   return <PendulumSimulation          onBack={goHome} />;
  if (page === 'mechanical-waves')  return <WavesSimulation             onBack={goHome} />;
  if (page === 'projectile-motion') return <ProjectileSimulation        onBack={goHome} />;
  if (page === 'planetary-motion')  return <SolarSystemSimulation       onBack={goHome} />;

  return <Home onNavigate={(id) => setPage(id as Page)} />;
}
