// Sala do modelo de Thomson (protótipo da ala "Museu dos Modelos Atômicos").
// O "pudim" tem 2 m de diâmetro e flutua sobre um pedestal.

import type { InteractiveRoom } from '../../../museum/interactiveRoom';
import { thomsonModel, type ThomsonConfig } from './scene';

export const sala: InteractiveRoom<ThomsonConfig> = {
  experiment: thomsonModel,
  room: { width: 8, depth: 8, wallHeight: 4.5, place: [0, 2.2, -1.5], pedestal: { radius: 0.6, height: 1.0 }, inspect: { distance: 4 }, infoAt: [-1.8, 1.7, 0.3] },
  controls: [
    { id: 'electrons', label: 'Número de elétrons', kind: 'range', min: 1, max: 12, step: 1, default: 6 },
  ],
  toConfig: (v) => ({ electrons: Number(v.electrons) }),
};
