// Sala das Ondas (Museu da Mecânica, protótipo do TCC).
// A corda de 10 m fica a 1,5 m do chão, atravessando a sala na frente do visitante.

import type { InteractiveRoom } from '../../../museum/interactiveRoom';
import { wavesRoom, type WavesConfig } from './scene';
import { marcadorControl } from '../../../core/marcadores';

export const sala: InteractiveRoom<WavesConfig> = {
  experiment: wavesRoom,
  room: { width: 13, depth: 9, wallHeight: 4.5, place: [0, 1.5, -1.5], inspect: { distance: 8 }, exerciseDoor: true },
  controls: [
    { id: 'wavelength', label: 'Comprimento de onda λ', kind: 'range', min: 0.5, max: 4, step: 0.1, unit: 'm', default: 2 },
    { id: 'frequency', label: 'Frequência f', kind: 'range', min: 0.1, max: 2, step: 0.1, unit: 'Hz', default: 0.5 },
    { id: 'amplitude', label: 'Amplitude', kind: 'range', min: 0.1, max: 0.8, step: 0.05, unit: 'm', default: 0.4 },
    marcadorControl('fantasmaV', 'Velocidade escolhida (ponto verde)'),
  ],
  toConfig: (v) => ({ amplitude: Number(v.amplitude), wavelength: Number(v.wavelength), frequency: Number(v.frequency), fantasmaV: Number(v.fantasmaV ?? 0) }),
};
