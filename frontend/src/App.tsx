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
import FrogDissectionSimulation    from './simulations/biology/FrogDissection/index';
import PendulumSimulation          from './simulations/physics/Pendulum/index';
import WavesSimulation             from './simulations/physics/Waves/index';
import ProjectileSimulation        from './simulations/physics/Projectile/index';
import SolarSystemSimulation       from './simulations/physics/SolarSystem/index';

type Theme = 'dark' | 'light';

const PAGES = [
  'select',
  'home',
  'immersive',
  'sobre',
  'bohr-model',
  'xr-bohr-model',
  'ar-bohr-model',
  'molecular-geometry',
  'dna-helix',
  'xr-dna-helix',
  'ar-dna-helix',
  'frog-dissection',
  'simple-pendulum',
  'mechanical-waves',
  'projectile-motion',
  'planetary-motion',
] as const;

type Page = (typeof PAGES)[number];

// Roteamento por hash: cada página tem uma URL própria (#/home, #/simple-pendulum…),
// então o histórico do navegador (botão voltar/avançar) e links diretos funcionam.
// Usa hash em vez de caminhos (/home) porque o GitHub Pages não reescreve rotas
// desconhecidas para o index.html — um F5 em /TCC/home daria 404.
function isPage(id: string): id is Page {
  return (PAGES as readonly string[]).includes(id);
}

function pageFromHash(): Page {
  const id = window.location.hash.replace(/^#\/?/, '');
  return isPage(id) ? id : 'select';
}

function hashFor(page: Page): string {
  return page === 'select' ? '#/' : `#/${page}`;
}

// Marca as entradas de histórico criadas pela própria aplicação. Assim o botão
// "Voltar" do site sabe se pode simplesmente desfazer a última navegação
// (history.back) ou se o usuário chegou por link direto e não há para onde voltar.
const IN_APP = { clara: true };

export default function App() {
  const [theme, setTheme] = useState<Theme>('dark');
  const [page,  setPage ] = useState<Page>(pageFromHash);

  useEffect(() => {
    document.documentElement.classList.toggle('light', theme === 'light');
  }, [theme]);

  // Voltar/avançar do navegador (e edição manual da URL) disparam popstate:
  // basta reler o hash para descobrir a página.
  useEffect(() => {
    const onPopState = () => setPage(pageFromHash());
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  function navigate(to: Page) {
    if (to === page) return;
    window.history.pushState(IN_APP, '', hashFor(to));
    setPage(to);
  }

  // Botão "Voltar" do site: se a página anterior também é da aplicação, volta no
  // histórico (mantendo-o coerente com o botão do navegador); senão, substitui a
  // entrada atual pelo destino padrão sem criar uma nova.
  function goBack(fallback: Page) {
    if ((window.history.state as typeof IN_APP | null)?.clara) {
      window.history.back();
    } else {
      window.history.replaceState(null, '', hashFor(fallback));
      setPage(fallback);
    }
  }

  const toggleTheme = () => setTheme((t) => (t === 'dark' ? 'light' : 'dark'));
  const goHome      = () => goBack('home');

  if (page === 'select')
    return (
      <ModeSelect
        theme={theme}
        onToggleTheme={toggleTheme}
        onSelect={(mode) => navigate(mode === 'normal' ? 'home' : 'immersive')}
      />
    );

  if (page === 'immersive')
    return <Placeholder title="Modo Imersivo" onBack={() => goBack('select')} />;

  if (page === 'sobre')
    return <Placeholder title="Sobre" onBack={goHome} />;

  if (page === 'bohr-model')         return <BohrModelSimulation         onBack={goHome} theme={theme} />;
  if (page === 'xr-bohr-model')     return <XRBohrModelSimulation       onBack={goHome} />;
  if (page === 'ar-bohr-model')     return <ARBohrModelSimulation       onBack={goHome} />;
  if (page === 'xr-dna-helix')      return <XRDnaHelixSimulation        onBack={goHome} />;
  if (page === 'ar-dna-helix')      return <ARDnaHelixSimulation        onBack={goHome} />;
  if (page === 'frog-dissection')   return <FrogDissectionSimulation    onBack={goHome} />;
  if (page === 'molecular-geometry') return <MolecularGeometrySimulation onBack={goHome} theme={theme} />;
  if (page === 'dna-helix')          return <DnaHelixSimulation          onBack={goHome} theme={theme} />;
  if (page === 'simple-pendulum')    return <PendulumSimulation          onBack={goHome} theme={theme} />;
  if (page === 'mechanical-waves')   return <WavesSimulation             onBack={goHome} theme={theme} />;
  if (page === 'projectile-motion')  return <ProjectileSimulation        onBack={goHome} theme={theme} />;
  if (page === 'planetary-motion')   return <SolarSystemSimulation       onBack={goHome} theme={theme} />;

  return (
    <Home
      onNavigate={(id) => { if (isPage(id)) navigate(id); }}
      onGoImmersive={() => navigate('immersive')}
      onGoSobre={() => navigate('sobre')}
      theme={theme}
      onToggleTheme={toggleTheme}
    />
  );
}
