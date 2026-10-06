// Sala interativa da Dupla Hélice de DNA (sala do Museu Virtual).
// Ver museum/interactiveRoom.ts.
//
// Sala: 8 × 8 m, pé-direito 5 m. Escala 0,3: com o máximo de 40 pares de base
// a hélice tem ~4,1 m de altura (centro a 2,4 m do chão) e ~1 m de diâmetro —
// uma "coluna" que o aluno pode rodear e olhar de baixo para cima.
//
// Camada A (HUD): pares de base e velocidade de rotação (os mesmos da página).
// Camada B: nenhuma.

import type { InteractiveRoom } from '../../../museum/interactiveRoom';
import { dnaHelix, type DnaSceneConfig } from './scene';

export const sala: InteractiveRoom<DnaSceneConfig> = {
  experiment: dnaHelix,
  room: {
    width: 8,
    depth: 8,
    wallHeight: 5,
    place: [0, 2.4, -1],
    scale: 0.3,
    obstacleRadius: 0.7, // não deixa atravessar a hélice
  },
  controls: [
    { id: 'basePairs', label: 'Pares de base', kind: 'range', min: 4, max: 40, step: 1, default: 20 },
    { id: 'rotationSpeed', label: 'Rotação', kind: 'range', min: 0, max: 0.5, step: 0.01, unit: 'voltas/s', default: 0.15 },
  ],
  toConfig: (v) => ({ basePairs: Number(v.basePairs), rotationSpeed: Number(v.rotationSpeed) }),
};
