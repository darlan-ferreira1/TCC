export interface SimulationMeta {
  id: string;
  title: string;
  description: string;
  category: 'Química' | 'Física' | 'Biologia';
  available: boolean;
  thumbnail?: string; // caminho relativo a /public, ex: '/thumbnails/bohr-model.png'
}

export const simulations: SimulationMeta[] = [
  {
    id: 'bohr-model',
    title: 'Modelo de Bohr',
    description: 'Visualize a estrutura atômica dos primeiros 20 elementos com elétrons orbitando o núcleo em tempo real.',
    category: 'Química',
    available: true,
  },
  {
    id: 'xr-bohr-model',
    title: 'Modelo de Bohr — WebXR',
    description: 'Mergulhe dentro do átomo em realidade virtual. Elétrons orbitam ao seu redor em escala real. Requer headset VR.',
    category: 'Química',
    available: true,
  },
  {
    id: 'ar-bohr-model',
    title: 'Modelo de Bohr — AR',
    description: 'Veja o átomo projetado no mundo real pela câmera do seu celular. Aproxime-se e caminhe pelos orbitais eletrônicos.',
    category: 'Química',
    available: true,
  },
  {
    id: 'molecular-geometry',
    title: 'Geometria Molecular',
    description: 'Visualize as geometrias VSEPR em 3D: angular, tetraédrica, piramidal, octaédrica e mais.',
    category: 'Química',
    available: true,
  },
  {
    id: 'simple-pendulum',
    title: 'Pêndulo Simples',
    description: 'Simule o movimento oscilatório de um pêndulo com física real, ajustando comprimento e gravidade.',
    category: 'Física',
    available: true,
  },
  {
    id: 'projectile-motion',
    title: 'Lançamento de Projétil',
    description: 'Visualize a trajetória parabólica com controle de ângulo e velocidade inicial.',
    category: 'Física',
    available: true,
  },
  {
    id: 'planetary-motion',
    title: 'Sistema Solar',
    description: 'Todos os 8 planetas em órbita com períodos reais relativos. Sol ilumina com falloff gravitacional.',
    category: 'Física',
    available: true,
  },
  {
    id: 'mechanical-waves',
    title: 'Ondas Mecânicas',
    description: 'Visualize propagação, reflexão e interferência de ondas em diferentes meios.',
    category: 'Física',
    available: true,
  },
  {
    id: 'dna-helix',
    title: 'Dupla Hélice de DNA',
    description: 'Visualize a estrutura tridimensional da dupla hélice com pares de bases A-T e G-C em rotação contínua.',
    category: 'Biologia',
    available: true,
  },
  {
    id: 'xr-dna-helix',
    title: 'Dupla Hélice de DNA — WebXR',
    description: 'Explore a hélice de DNA em escala humana em realidade virtual. A estrutura tem mais de 10 metros de altura. Requer headset VR.',
    category: 'Biologia',
    available: true,
  },
  {
    id: 'ar-dna-helix',
    title: 'Dupla Hélice de DNA — AR',
    description: 'Projete uma hélice de DNA de 1,4 m de altura no ambiente ao redor pela câmera do celular. Caminhe ao redor da estrutura.',
    category: 'Biologia',
    available: true,
  },
  {
    id: 'frog-dissection',
    title: 'Dissecação Guiada por Gestos',
    description: 'Abra e dissecte um sapo virtual usando gestos de pinça capturados pela webcam via MediaPipe — sem controle, sem mouse.',
    category: 'Biologia',
    available: true,
  },
  {
    id: 'cell-division',
    title: 'Divisão Celular',
    description: 'Acompanhe as fases da mitose e meiose com animação 3D dos cromossomos e fuso mitótico.',
    category: 'Biologia',
    available: false,
  },
  {
    id: 'dna-replication',
    title: 'Replicação do DNA',
    description: 'Visualize o processo de duplicação da dupla hélice com as enzimas envolvidas em tempo real.',
    category: 'Biologia',
    available: false,
  },
  {
    id: 'action-potential',
    title: 'Potencial de Ação',
    description: 'Simule a propagação do impulso nervoso ao longo do axônio com controle de limiar de disparo.',
    category: 'Biologia',
    available: false,
  },
];
