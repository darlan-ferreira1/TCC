// Sala do experimento de Rutherford (protótipo da ala "Museu dos Modelos Atômicos").
// A folha de ouro fica a 1,3 m do chão, no centro de uma tela detectora de
// 2,2 m de raio; o visitante assiste de fora da tela.

import type { InteractiveRoom } from '../../../museum/interactiveRoom';
import { rutherfordModel, type RutherfordConfig } from './scene';

export const sala: InteractiveRoom<RutherfordConfig> = {
  experiment: rutherfordModel,
  room: { width: 10, depth: 10, wallHeight: 4.5, place: [0, 1.3, -1.5], obstacleRadius: 2.4, inspect: { distance: 6 } },
  controls: [
    { id: 'rate', label: 'Partículas por segundo', kind: 'range', min: 5, max: 80, step: 5, default: 25 },
    { id: 'speed', label: 'Velocidade (visual)', kind: 'range', min: 0.5, max: 4, step: 0.25, unit: 'm/s', default: 1.5 },
  ],
  toConfig: (v) => ({ rate: Number(v.rate), speed: Number(v.speed) }),
};
