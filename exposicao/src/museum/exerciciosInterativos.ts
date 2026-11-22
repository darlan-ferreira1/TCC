import type { InfoContent } from './info';
import type { ControlValues } from '../core/controls';

export interface ExercicioInterativo {
  id: string;
  titulo: string;
  enunciado: InfoContent;
  isCorrect: (values: ControlValues) => boolean;
  feedbackCorreto: string;
  preControls?: Record<string, number>;
  lockedControls?: string[];
  dica?: string;
  // Tempo mínimo com isCorrect() = true antes de disparar sucesso (ms). Padrão: 1200.
  minHoldMs?: number;
}

const period = (L: number, g: number) => 2 * Math.PI * Math.sqrt(L / g);

export const EXERCICIOS_INTERATIVOS: Record<string, ExercicioInterativo[]> = {
  'simple-pendulum': [
    {
      id: 'pendulo-q1',
      titulo: 'Q1 — Período de um pêndulo de 2,5 m',
      enunciado: {
        title: 'Exercício 1 · Pêndulo',
        pages: [{
          heading: 'Pêndulo de 2,5 m',
          text: 'Um pêndulo simples tem comprimento L = 2,5 m e g = 10 m/s².\n\nQual é o período de oscilação para pequenos ângulos?\n\nObserve o pêndulo e confira com a fórmula:\nT = 2π√(L/g)',
        }],
      },
      isCorrect: () => true,
      feedbackCorreto: 'T = π ≈ 3,14 s — conferido na simulação!',
      preControls: { L: 2.5, g: 10, theta0: 15 },
      lockedControls: ['L', 'g', 'theta0'],
      dica: 'T = 2π√(L/g) = 2π√(2,5/10) = 2π · 0,5 = π ≈ 3,14 s',
      minHoldMs: 3000,
    },
    {
      id: 'pendulo-q2',
      titulo: 'Q2 — Comprimento para T = 2 s',
      enunciado: {
        title: 'Exercício 2 · Pêndulo',
        pages: [{
          heading: 'Ajuste o comprimento',
          text: 'Qual deve ser o comprimento L para que o período seja T = 2 s?\n\nA gravidade está fixada em g = 10 m/s².\n\nUse o controle L para ajustar o comprimento até o período bater com 2 s.',
        }],
      },
      isCorrect: (v) => Math.abs(period(Number(v.L), 10) - 2) <= 0.12,
      feedbackCorreto: 'L ≈ 1,0 m dá T = 2 s — correto!',
      preControls: { g: 10, theta0: 15 },
      lockedControls: ['g', 'theta0'],
      dica: 'T = 2π√(L/g) → 2 = 2π√(L/10)\nL = g·T²/(4π²) = 10·4/(4·10) = 1,0 m\n(usando π² ≈ 10)',
    },
    {
      id: 'pendulo-q4',
      titulo: 'Q4 — Comprimento multiplicado por 4',
      enunciado: {
        title: 'Exercício 3 · Pêndulo',
        pages: [{
          heading: 'Comprimento × 4',
          text: 'O pêndulo começa com L = 0,5 m.\n\nAjuste L para 2 m (quatro vezes maior) e observe o que acontece com o período.',
        }],
      },
      isCorrect: (v) => Number(v.L) >= 1.9,
      feedbackCorreto: 'Com L = 2 m, o período dobrou! T ∝ √L: quadruplicar L duplica T.',
      preControls: { L: 0.5, g: 10, theta0: 15 },
      lockedControls: ['g', 'theta0'],
      dica: 'Como T = 2π√(L/g), se L → 4L então T → √4·T = 2T. O período dobra.',
    },
    {
      id: 'pendulo-q5',
      titulo: 'Q5 — Pêndulo na Lua',
      enunciado: {
        title: 'Exercício 4 · Pêndulo',
        pages: [{
          heading: 'Pêndulo na Lua',
          text: 'Na Lua, g = 1,6 m/s². Com L = 1 m, qual é o período lá?\n\nAjuste a gravidade para o valor lunar e observe o novo período.',
        }],
      },
      isCorrect: (v) => Number(v.g) <= 1.7,
      feedbackCorreto: 'T ≈ 5 s na Lua — quase 2,5× mais lento que na Terra!',
      preControls: { L: 1.0, theta0: 15 },
      lockedControls: ['L', 'theta0'],
      dica: 'T = 2π√(L/g) = 2π√(1/1,6) ≈ 2π·0,79 ≈ 5,0 s',
    },
    {
      id: 'pendulo-q6',
      titulo: 'Q6 — Ângulos grandes',
      enunciado: {
        title: 'Exercício 5 · Pêndulo',
        pages: [{
          heading: 'Fórmula e ângulos grandes',
          text: 'A fórmula T = 2π√(L/g) só vale para ângulos pequenos (até ~15°).\n\nO pêndulo começa com θ = 60°. Mude θ para 10° e observe como o período muda.',
        }],
      },
      isCorrect: (v) => Math.abs(Number(v.theta0)) <= 12,
      feedbackCorreto: 'Com θ = 10°, o período corresponde à fórmula — a aproximação funciona!',
      preControls: { L: 1.5, g: 10, theta0: 60 },
      lockedControls: ['L', 'g'],
      dica: 'Para θ < 15°, T ≈ 2π√(L/g) é precisa.\nCom θ = 60°, o período real é ~5% maior.',
    },
  ],
};
