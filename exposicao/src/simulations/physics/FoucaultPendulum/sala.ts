// Sala do Pêndulo de Foucault (protótipo da ala "Museu da Mecânica").
//
// O original (Paris, 1851) tinha 67 m de fio; aqui o fio tem 6 m para caber na
// sala (pé-direito 8 m). A massa oscila sobre um disco cercado de pinos e
// deixa um rastro no chão. O visitante escolhe o lugar da Terra e acelera o
// tempo para ver o plano girar (exercícios F2 a F5 da lista).
//
// O painel mostra o tempo simulado e o giro do plano, mas não o tempo de uma
// volta: é isso que o aluno calcula com 24 h / sen(latitude) e confere.

import type { InteractiveRoom } from '../../../museum/interactiveRoom';
import { foucaultPendulum, type FoucaultConfig } from './scene';

const L = 6;
const PLACES: Record<string, { label: string; latitude: number }> = {
  polo_norte: { label: 'Polo Norte (90° N)', latitude: 90 },
  paris:      { label: 'Paris (49° N)', latitude: 49 },
  equador:    { label: 'Equador (0°)', latitude: 0 },
  quixada:    { label: 'Quixadá (5° S)', latitude: -5 },
  polo_sul:   { label: 'Polo Sul (90° S)', latitude: -90 },
};

export const sala: InteractiveRoom<FoucaultConfig> = {
  experiment: foucaultPendulum,
  room: {
    width: 11,
    depth: 11,
    wallHeight: 8,
    place: [0, L + 1.3, -0.5],
    obstacleRadius: 2.3, // o visitante não entra no disco
    inspect: { target: [0, 2.5, -0.5], distance: 10 },
    infoAt: [2.8, 1.6, 1.8],
  },
  controls: [
    {
      id: 'place',
      label: 'Lugar da Terra',
      kind: 'select',
      options: Object.entries(PLACES).map(([value, p]) => ({ value, label: p.label })),
      default: 'paris',
    },
    { id: 'timeScale', label: 'Aceleração do tempo', kind: 'range', min: 600, max: 14400, step: 600, unit: '×', default: 3600 },
  ],
  toConfig(v) {
    const place = PLACES[String(v.place)] ?? PLACES.paris;
    return {
      L,
      g: 10,
      amplitude: (14 * Math.PI) / 180,
      latitude: place.latitude,
      place: place.label,
      timeScale: Number(v.timeScale),
      floorDrop: L + 1.3,
    };
  },
};
