// Sala interativa da Geometria Molecular (sala do Museu Virtual).
// Ver museum/interactiveRoom.ts.
//
// Sala: 8 × 8 m. A molécula fica sobre um pedestal, na escala 0,5 (a maior,
// SF₆/PCl₅, ocupa ~2 m de diâmetro), girando devagar para o aluno ver todos os
// ângulos sem precisar dar a volta — mas ele pode dar a volta.
//
// Camada A (HUD): seleção da molécula (as 7 do physics.ts).
// Camada B: nenhuma (a molécula é estática).

import type { InteractiveRoom } from '../../../museum/interactiveRoom';
import { MOLECULES } from './physics';
import { molecularGeometry, type MolSceneConfig } from './scene';

export const sala: InteractiveRoom<MolSceneConfig> = {
  experiment: molecularGeometry,
  room: {
    width: 8,
    depth: 8,
    place: [0, 2.0, -1],
    scale: 0.5,
    spin: 0.4,
    pedestal: { radius: 1.0, height: 0.8 },
  },
  controls: [
    {
      id: 'molecule',
      label: 'Molécula',
      kind: 'select',
      options: MOLECULES.map((m) => ({ value: m.id, label: `${m.formula} — ${m.name} (${m.geometryName})` })),
      default: MOLECULES[0].id,
    },
  ],
  toConfig: (v) => ({ molecule: MOLECULES.find((m) => m.id === v.molecule) ?? MOLECULES[0] }),
};
