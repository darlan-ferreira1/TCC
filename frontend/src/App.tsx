import { useState, useEffect } from 'react';
import ModeSelect from './pages/ModeSelect';
import Home from './pages/Home';
import Placeholder from './pages/Placeholder';
import BohrModelSimulation         from './simulations/chemistry/BohrModel/index';
import XRBohrModelSimulation       from './simulations/chemistry/xrBhorModel/index';
import ARBohrModelSimulation       from './simulations/chemistry/arBohrModel/index';
import MolecularGeometrySimulation from './simulations/chemistry/MolecularGeometry/index';
import DnaHelixSimulation          from './simulations/biology/DnaHelix/index';
import XRDnaHelixSimulation        from './simulations/biology/xrDnaHelix/index';
import ARDnaHelixSimulation        from './simulations/biology/arDnaHelix/index';
import PendulumSimulation          from './simulations/physics/Pendulum/index';
import WavesSimulation             from './simulations/physics/Waves/index';
import ProjectileSimulation        from './simulations/physics/Projectile/index';
import SolarSystemSimulation       from './simulations/physics/SolarSystem/index';

type Theme = 'dark' | 'light';

type Page =
  | 'select'
  | 'home'
  | 'immersive'
  | 'sobre'
  | 'bohr-model'
  | 'xr-bohr-model'
  | 'ar-bohr-model'
  | 'molecular-geometry'
  | 'dna-helix'
  | 'xr-dna-helix'
  | 'ar-dna-helix'
  | 'simple-pendulum'
  | 'mechanical-waves'
  | 'projectile-motion'
  | 'planetary-motion';

export default function App() {
  const [theme, setTheme] = useState<Theme>('dark');
  const [page,  setPage ] = useState<Page>('select');

  useEffect(() => {
    document.documentElement.classList.toggle('light', theme === 'light');
  }, [theme]);

  const toggleTheme = () => setTheme((t) => (t === 'dark' ? 'light' : 'dark'));
  const goHome      = () => setPage('home');

  if (page === 'select')
    return (
      <ModeSelect
        theme={theme}
        onToggleTheme={toggleTheme}
        onSelect={(mode) => setPage(mode === 'normal' ? 'home' : 'immersive')}
      />
    );

  if (page === 'immersive')
    return <Placeholder title="Modo Imersivo" onBack={() => setPage('select')} />;

  if (page === 'sobre')
    return <Placeholder title="Sobre" onBack={goHome} />;

  if (page === 'bohr-model')         return <BohrModelSimulation         onBack={goHome} />;
  if (page === 'xr-bohr-model')     return <XRBohrModelSimulation       onBack={goHome} />;
  if (page === 'ar-bohr-model')     return <ARBohrModelSimulation       onBack={goHome} />;
  if (page === 'xr-dna-helix')      return <XRDnaHelixSimulation        onBack={goHome} />;
  if (page === 'ar-dna-helix')      return <ARDnaHelixSimulation        onBack={goHome} />;
  if (page === 'molecular-geometry') return <MolecularGeometrySimulation onBack={goHome} />;
  if (page === 'dna-helix')          return <DnaHelixSimulation          onBack={goHome} />;
  if (page === 'simple-pendulum')    return <PendulumSimulation          onBack={goHome} />;
  if (page === 'mechanical-waves')   return <WavesSimulation             onBack={goHome} />;
  if (page === 'projectile-motion')  return <ProjectileSimulation        onBack={goHome} />;
  if (page === 'planetary-motion')   return <SolarSystemSimulation       onBack={goHome} />;

  return (
    <Home
      onNavigate={(id) => setPage(id as Page)}
      onGoImmersive={() => setPage('immersive')}
      onGoSobre={() => setPage('sobre')}
      theme={theme}
      onToggleTheme={toggleTheme}
    />
  );
}
