// Sala das Leis de Kepler (Museu da Mecânica, protótipo do TCC).
// O sistema fica a 0,9 m do chão, abaixo dos olhos: o visitante anda entre as
// órbitas e olha de cima. Júpiter (5,2 UA) fica a 6 m do Sol.

import type { InteractiveRoom } from '../../../museum/interactiveRoom';
import { keplerRoom, type KeplerConfig } from './scene';

export const sala: InteractiveRoom<KeplerConfig> = {
  experiment: keplerRoom,
  room: { width: 15, depth: 15, wallHeight: 4.5, place: [0, 0.9, -0.5], obstacleRadius: 0.5, inspect: { distance: 10 }, exerciseDoor: true },
  controls: [
    { id: 'planetX', label: 'Distância do Planeta X ao Sol', kind: 'range', min: 0.5, max: 5, step: 0.1, unit: 'UA', default: 4 },
    { id: 'yearsPerSecond', label: 'Velocidade do tempo', kind: 'range', min: 0.1, max: 3, step: 0.1, unit: 'anos/s', default: 0.5 },
  ],
  toConfig: (v) => ({ planetX: Number(v.planetX), yearsPerSecond: Number(v.yearsPerSecond) }),
};
