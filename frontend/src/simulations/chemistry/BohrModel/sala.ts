// Sala interativa do Modelo de Bohr (sala do Museu Virtual).
// Ver museum/interactiveRoom.ts.
//
// Sala: 10 × 10 m, pé-direito 5 m. O núcleo flutua a 2,3 m do chão (acima da
// cabeça) e a escala 0,1 deixa a camada 4 (K, Ca) com 3,2 m de raio: o aluno
// anda POR DENTRO das órbitas e vê os elétrons passarem ao seu redor — a
// mesma ideia da variante VR (xrBhorModel), agora também no desktop/celular.
//
// Camada A (HUD): elemento (H a Ca, tabela compartilhada em elements.ts) e
//   velocidade.
// Camada B: nenhuma.

import type { InteractiveRoom } from '../../../museum/interactiveRoom';
import { ELEMENTS } from './elements';
import { bohrModel, type BohrSceneConfig } from './scene';

export const sala: InteractiveRoom<BohrSceneConfig> = {
  experiment: bohrModel,
  room: {
    width: 10,
    depth: 10,
    wallHeight: 5,
    place: [0, 2.3, -0.5],
    scale: 0.1,
  },
  controls: [
    {
      id: 'element',
      label: 'Elemento',
      kind: 'select',
      options: ELEMENTS.map(([symbol, name, z]) => ({ value: symbol, label: `${symbol} — ${name} (Z=${z})` })),
      default: 'C',
    },
    { id: 'speed', label: 'Velocidade', kind: 'range', min: 0.1, max: 4, step: 0.1, unit: '×', default: 1 },
  ],
  toConfig(v) {
    const [, , protons, neutrons, shells] = ELEMENTS.find(([symbol]) => symbol === v.element) ?? ELEMENTS[5];
    return { protons, neutrons, shells, speedFactor: Number(v.speed) };
  },
};
