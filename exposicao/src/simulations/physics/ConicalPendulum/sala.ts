// Sala do Pêndulo cônico (protótipo da ala "Museu da Mecânica").
// O ponto de suspensão fica a 3,4 m do chão; com L = 3 m e θ pequeno a massa
// passa a 0,4 m do chão.
//
// O painel mostra o raio e conta as voltas, mas NÃO mostra o período: o aluno
// cronometra as voltas para conferir a conta (exercícios C1 e C3 da lista).

import type { InteractiveRoom } from '../../../museum/interactiveRoom';
import type { ConicalConfig } from './physics';
import { conicalPendulum } from './scene';

const DEG = Math.PI / 180;

export const sala: InteractiveRoom<ConicalConfig> = {
  experiment: conicalPendulum,
  room: { width: 9, depth: 9, wallHeight: 4.5, place: [0, 3.4, -1], inspect: { target: [0, 2.6, -1], distance: 5 }, infoAt: [2.6, 1.6, 0.3] },
  controls: [
    { id: 'L', label: 'Comprimento do fio L', kind: 'range', min: 0.5, max: 3, step: 0.1, unit: 'm', default: 2 },
    { id: 'theta', label: 'Ângulo com a vertical θ', kind: 'range', min: 5, max: 80, step: 1, unit: '°', default: 50 },
    { id: 'g', label: 'Gravidade g', kind: 'range', min: 1, max: 20, step: 0.1, unit: 'm/s²', default: 10 },
  ],
  toConfig: (v) => ({ L: Number(v.L), theta: Number(v.theta) * DEG, g: Number(v.g) }),
};
