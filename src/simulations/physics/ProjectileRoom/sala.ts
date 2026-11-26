// Sala do Lançamento de projéteis (Museu da Mecânica, protótipo do TCC).
// Sala larga (22 m) e funda (16 m) para ver a trajetória inteira de lado; o canhão fica perto da
// parede da esquerda e a régua no chão vai até 40 m (desenhada em escala).

import type { InteractiveRoom } from '../../../museum/interactiveRoom';
import { projectileRoom, type ProjectileConfig } from './scene';
import { marcadorControl } from '../../../core/marcadores';

export const sala: InteractiveRoom<ProjectileConfig> = {
  experiment: projectileRoom,
  room: { width: 22, depth: 16, wallHeight: 6, place: [-9.5, 0, -4], inspect: { target: [-1, 2, -4], distance: 14 }, infoAt: [-1.5, 1.6, 2], exerciseDoor: true },
  controls: [
    { id: 'v0', label: 'Velocidade inicial v₀', kind: 'range', min: 5, max: 20, step: 1, unit: 'm/s', default: 20 },
    { id: 'angle', label: 'Ângulo de lançamento', kind: 'range', min: 5, max: 85, step: 5, unit: '°', default: 30 },
    marcadorControl('bandeira', 'Alcance escolhido (bandeira)'),
    marcadorControl('faixa', 'Altura escolhida (faixa)'),
  ],
  // g fica fixo em 10 m/s² (o da lista): com g menor o alcance não cabe na sala.
  toConfig: (v) => ({ v0: Number(v.v0), angle: Number(v.angle), g: 10, bandeira: Number(v.bandeira ?? 0), faixa: Number(v.faixa ?? 0) }),
};
