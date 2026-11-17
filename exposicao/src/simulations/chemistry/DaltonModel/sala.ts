// Sala do modelo de Dalton (protótipo da ala "Museu dos Modelos Atômicos").
// O átomo maciço flutua sobre um pedestal, com a reação na frente dele.

import type { InteractiveRoom } from '../../../museum/interactiveRoom';
import { daltonModel, type DaltonConfig, type DaltonReaction } from './scene';

export const sala: InteractiveRoom<DaltonConfig> = {
  experiment: daltonModel,
  room: { width: 8, depth: 8, wallHeight: 4.5, place: [0, 2.0, -1.5], pedestal: { radius: 0.6, height: 1.0 }, inspect: { distance: 4 }, infoAt: [2, 1.9, 0.3] },
  controls: [
    {
      id: 'reaction',
      label: 'Reação',
      kind: 'select',
      options: [
        { value: 'agua', label: 'Formação da água' },
        { value: 'gas_carbonico', label: 'Formação do gás carbônico' },
      ],
      default: 'agua',
    },
  ],
  toConfig: (v) => ({ reaction: String(v.reaction) as DaltonReaction }),
};
