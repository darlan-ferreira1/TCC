import type { InfoContent } from './info';
import type { ControlValue, ControlValues } from '../core/controls';

export interface ExercicioInterativo {
  id: string;
  titulo: string;
  enunciado: InfoContent;
  isCorrect: (values: ControlValues) => boolean;
  feedbackCorreto: string;
  preControls?: Record<string, ControlValue>;
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
  'projectile-room': [
    {
      id: 'lancamento-q7',
      titulo: 'Q7 — Dados do lançamento (20 m/s, 30°)',
      enunciado: {
        title: 'Exercício 1 · Lançamento',
        pages: [{
          heading: 'Calcule e confira',
          text: 'Uma bola é lançada a v₀ = 20 m/s, θ = 30°, g = 10 m/s².\n\nCalcule o tempo de voo, a altura máxima e o alcance. Depois observe a trajetória e confira.',
        }],
      },
      isCorrect: () => true,
      feedbackCorreto: 'T = 2 s, H = 5 m, R ≈ 34,6 m — conferido na simulação!',
      preControls: { v0: 20, angle: 30 },
      lockedControls: ['v0', 'angle'],
      dica: 'v₀y = 20·sin30° = 10 m/s\nT = 2v₀y/g = 2 s\nH = v₀y²/(2g) = 5 m\nv₀x = 20·cos30° ≈ 17,3 m/s\nR = v₀x·T ≈ 34,6 m',
      minHoldMs: 3000,
    },
    {
      id: 'lancamento-q8',
      titulo: 'Q8 — Ângulo de máximo alcance',
      enunciado: {
        title: 'Exercício 2 · Lançamento',
        pages: [{
          heading: 'Maior alcance',
          text: 'Com v₀ = 20 m/s, ajuste o ângulo θ para obter o maior alcance possível.\n\nQual ângulo maximiza R = v₀²·sin(2θ)/g?',
        }],
      },
      isCorrect: (v) => Math.abs(Number(v.angle) - 45) <= 5,
      feedbackCorreto: 'θ = 45° dá o maior alcance: R = v₀²/g = 40 m!',
      preControls: { v0: 20 },
      lockedControls: ['v0'],
      dica: 'R é máximo quando 2θ = 90°, ou seja, θ = 45°.',
    },
    {
      id: 'lancamento-q9a',
      titulo: 'Q9a — Lançamento a 30°',
      enunciado: {
        title: 'Exercício 3 · Lançamento',
        pages: [{
          heading: 'Compare 30° e 60°',
          text: 'Lançamento a 30°. Observe e anote o alcance.\n\nNa próxima questão você compara com 60°.',
        }],
      },
      isCorrect: () => true,
      feedbackCorreto: 'Anotou o alcance? Próxima questão: 60°.',
      preControls: { v0: 20, angle: 30 },
      lockedControls: ['v0', 'angle'],
      dica: 'R = v₀²·sin(60°)/g ≈ 34,6 m',
      minHoldMs: 2000,
    },
    {
      id: 'lancamento-q9b',
      titulo: 'Q9b — Lançamento a 60° (mesmo alcance, mais alto)',
      enunciado: {
        title: 'Exercício 4 · Lançamento',
        pages: [{
          heading: 'Compare com 30°',
          text: 'Agora observe o lançamento a 60°. Compare o alcance com o de 30°.\n\n30° e 60° são complementares: sin(2·30°) = sin(2·60°), então R é igual!\nMas qual sobe mais alto?',
        }],
      },
      isCorrect: () => true,
      feedbackCorreto: 'Mesmo alcance, maior altura! sin(60°) = sin(120°).',
      preControls: { v0: 20, angle: 60 },
      lockedControls: ['v0', 'angle'],
      dica: 'Com 60°: v₀y = 17,3 m/s → H = 15 m (3× maior). Mesmo R, maior H.',
      minHoldMs: 2000,
    },
  ],
  'kepler-room': [
    {
      id: 'kepler-q10',
      titulo: 'Q10 — Período do Planeta X a 4 UA',
      enunciado: {
        title: 'Exercício 1 · Kepler',
        pages: [{
          heading: '3ª Lei de Kepler',
          text: 'O Planeta X está a 4 UA do Sol. Pela 3ª Lei: T² = a³ (T em anos, a em UA).\n\nQual é o período? Observe: quantas vezes a Terra volta enquanto o Planeta X dá uma?',
        }],
      },
      isCorrect: () => true,
      feedbackCorreto: 'T = 8 anos — confirmado contando as voltas da Terra!',
      preControls: { planetX: 4, yearsPerSecond: 0.5 },
      lockedControls: ['planetX', 'yearsPerSecond'],
      dica: 'T² = 4³ = 64 → T = 8 anos.',
      minHoldMs: 5000,
    },
    {
      id: 'kepler-q11',
      titulo: 'Q11 — Órbita de Marte (1,52 UA)',
      enunciado: {
        title: 'Exercício 2 · Kepler',
        pages: [{
          heading: 'Período de Marte',
          text: 'Marte orbita a 1,52 UA. Posicione o Planeta X na mesma distância e calcule T.\n\nCompare: quantas vezes a Terra volta enquanto Marte dá uma?',
        }],
      },
      isCorrect: () => true,
      feedbackCorreto: 'T ≈ 1,87 anos — Marte leva quase 2 anos para completar uma órbita!',
      preControls: { planetX: 1.52, yearsPerSecond: 0.5 },
      lockedControls: ['planetX', 'yearsPerSecond'],
      dica: 'T² = 1,52³ ≈ 3,51 → T ≈ 1,87 anos.',
      minHoldMs: 5000,
    },
  ],
  'waves-room': [
    {
      id: 'ondas-q12',
      titulo: 'Q12 — Velocidade e período (λ=2m, f=1Hz)',
      enunciado: {
        title: 'Exercício 1 · Ondas',
        pages: [{
          heading: 'v = λ·f',
          text: 'Uma onda com λ = 2 m e f = 1 Hz. Qual é a velocidade e o período?\n\nObserve uma crista se mover e confira: v = λ·f e T = 1/f.',
        }],
      },
      isCorrect: () => true,
      feedbackCorreto: 'v = 2 m/s e T = 1 s — a crista percorre 2 m a cada segundo!',
      preControls: { wavelength: 2, frequency: 1, amplitude: 0.4 },
      lockedControls: ['wavelength', 'frequency', 'amplitude'],
      dica: 'v = 2·1 = 2 m/s; T = 1/1 = 1 s',
      minHoldMs: 4000,
    },
    {
      id: 'ondas-q13',
      titulo: 'Q13 — Ajuste λ para manter v=2 m/s',
      enunciado: {
        title: 'Exercício 2 · Ondas',
        pages: [{
          heading: 'Dobrar f, manter v',
          text: 'A frequência agora é f = 2 Hz. Para manter v = 2 m/s, qual deve ser o novo comprimento de onda?\n\nAjuste λ até a cena mostrar o resultado correto.',
        }],
      },
      isCorrect: (v) => Math.abs(Number(v.wavelength) - 1.0) <= 0.15,
      feedbackCorreto: 'λ = 1 m: v = 1·2 = 2 m/s. Dobrar f exige λ pela metade!',
      preControls: { frequency: 2, amplitude: 0.4, wavelength: 2 },
      lockedControls: ['frequency', 'amplitude'],
      dica: 'λ = v/f = 2/2 = 1 m',
    },
  ],
  'conical-pendulum': [
    {
      id: 'conico-c1',
      titulo: 'C1 — Período com L=1m, θ=60°',
      enunciado: {
        title: 'Exercício 1 · Pêndulo Cônico',
        pages: [{
          heading: 'Cronometre o período',
          text: 'O pêndulo cônico tem L = 1 m e θ = 60°. Qual é o período?\n\nCronometre 3 voltas e divida por 3. Use: T = 2π√(L·cosθ/g)',
        }],
      },
      isCorrect: () => true,
      feedbackCorreto: 'T ≈ 1,40 s — confirmado na simulação!',
      preControls: { L: 1, theta: 60, g: 10 },
      lockedControls: ['L', 'theta', 'g'],
      dica: 'T = 2π√(cos60°/10) = 2π√(0,05) ≈ 1,40 s',
      minHoldMs: 4200,
    },
    {
      id: 'conico-c3',
      titulo: 'C3 — Encontre θ para T=1 s',
      enunciado: {
        title: 'Exercício 2 · Pêndulo Cônico',
        pages: [{
          heading: 'Ajuste o ângulo',
          text: 'Com L = 1 m, qual deve ser θ para que o período seja T = 1 s?\n\nAjuste θ e cronometre até bater.',
        }],
      },
      isCorrect: (v) => {
        const th = Number(v.theta) * Math.PI / 180;
        return Math.abs(2 * Math.PI * Math.sqrt(Number(v.L) * Math.cos(th) / 10) - 1) <= 0.1;
      },
      feedbackCorreto: 'θ ≈ 75° dá T ≈ 1 s — correto!',
      preControls: { L: 1, g: 10, theta: 50 },
      lockedControls: ['L', 'g'],
      dica: 'cosθ = g/(L·(2π)²) ≈ 0,253 → θ ≈ 75°',
    },
    {
      id: 'conico-c4',
      titulo: 'C4 — Por que θ não pode chegar a 90°?',
      enunciado: {
        title: 'Exercício 3 · Pêndulo Cônico',
        pages: [{
          heading: 'O ângulo máximo',
          text: 'Tente aumentar θ ao máximo. Por que não pode chegar a 90°?\n\nObserve o que acontece com o período.',
        }],
      },
      isCorrect: (v) => Number(v.theta) >= 75,
      feedbackCorreto: 'Com θ→90°, v→∞ e a tração→∞. O ângulo tem um limite!',
      preControls: { L: 1, g: 10, theta: 50 },
      lockedControls: ['L', 'g'],
      dica: 'θ→90°: cosθ→0, T→0, v→∞. Fisicamente impossível.',
      minHoldMs: 2000,
    },
    {
      id: 'conico-c5',
      titulo: 'C5 — θ→0: cônico ≈ simples',
      enunciado: {
        title: 'Exercício 4 · Pêndulo Cônico',
        pages: [{
          heading: 'Limite para θ→0',
          text: 'Com θ = 5°, o pêndulo cônico deve ter período próximo ao do pêndulo simples.\n\nObserve e compare com T = 2π√(L/g) ≈ 2 s.',
        }],
      },
      isCorrect: () => true,
      feedbackCorreto: 'T ≈ 2 s — igual ao pêndulo simples! Quando θ→0, cosθ→1.',
      preControls: { L: 1, g: 10, theta: 5 },
      lockedControls: ['L', 'g'],
      dica: 'cos(5°) ≈ 0,996 ≈ 1 → T_cônico ≈ T_simples = 2π√(1/10) ≈ 2 s',
      minHoldMs: 3000,
    },
  ],
  'foucault-pendulum': [
    {
      id: 'foucault-f1',
      titulo: 'F1 — Período do pêndulo (L=6m)',
      enunciado: {
        title: 'Exercício 1 · Foucault',
        pages: [{
          heading: 'Período do pêndulo',
          text: 'O pêndulo desta sala tem L = 6 m. Qual é o período?\n\nCronometre as oscilações e confira com T = 2π√(L/g).',
        }],
      },
      isCorrect: () => true,
      feedbackCorreto: 'T ≈ 4,87 s — período de um pêndulo de 6 m!',
      preControls: { place: 'paris', timeScale: 600 },
      lockedControls: ['place', 'timeScale'],
      dica: 'T = 2π√(6/10) ≈ 4,87 s',
      minHoldMs: 5000,
    },
    {
      id: 'foucault-f2',
      titulo: 'F2 — Por que o plano gira?',
      enunciado: {
        title: 'Exercício 2 · Foucault',
        pages: [{
          heading: 'A Terra que gira',
          text: 'Em Paris, acelere o tempo e observe o plano girar.\n\nO pêndulo não recebe força lateral. Por que o plano parece girar?',
        }],
      },
      isCorrect: () => true,
      feedbackCorreto: 'O plano é fixo no espaço. É o chão que gira!',
      preControls: { place: 'paris', timeScale: 3600 },
      lockedControls: ['place', 'timeScale'],
      dica: 'O plano é fixo no espaço; a Terra (e você) gira por baixo dele.',
      minHoldMs: 4000,
    },
    {
      id: 'foucault-f3a',
      titulo: 'F3a — Polo Norte: 1 volta em 24 h',
      enunciado: {
        title: 'Exercício 3a · Foucault',
        pages: [{
          heading: 'No Polo Norte',
          text: 'No Polo Norte, o plano gira uma volta completa em 24 h.\n\nAcelere o tempo. T_Foucault = 24 h / sen(latitude). Latitude = 90°.',
        }],
      },
      isCorrect: () => true,
      feedbackCorreto: 'Uma volta em 24 h no polo!',
      preControls: { place: 'polo_norte', timeScale: 7200 },
      lockedControls: ['place', 'timeScale'],
      dica: 'T = 24 / sen(90°) = 24 / 1 = 24 h.',
      minHoldMs: 3000,
    },
    {
      id: 'foucault-f3b',
      titulo: 'F3b — Equador: plano não gira',
      enunciado: {
        title: 'Exercício 3b · Foucault',
        pages: [{
          heading: 'No Equador',
          text: 'No Equador (latitude = 0°), o plano não gira.\n\nObserve. T = 24 / sen(0°) = ?',
        }],
      },
      isCorrect: () => true,
      feedbackCorreto: 'T → ∞ no equador. O plano nunca gira!',
      preControls: { place: 'equador', timeScale: 7200 },
      lockedControls: ['place', 'timeScale'],
      dica: 'sen(0°) = 0 → T → ∞: nunca completa uma volta.',
      minHoldMs: 3000,
    },
    {
      id: 'foucault-f4',
      titulo: 'F4 — Paris: período ≈ 32 h',
      enunciado: {
        title: 'Exercício 4 · Foucault',
        pages: [{
          heading: 'Em Paris',
          text: 'Em Paris (lat. 49° N), quanto tempo o plano leva para girar uma volta?\n\nAcelere o tempo. T = 24 h / sen(49°).',
        }],
      },
      isCorrect: () => true,
      feedbackCorreto: 'T ≈ 32 h em Paris!',
      preControls: { place: 'paris', timeScale: 7200 },
      lockedControls: ['place', 'timeScale'],
      dica: 'T = 24 / sen(49°) ≈ 24 / 0,755 ≈ 32 h.',
      minHoldMs: 4000,
    },
    {
      id: 'foucault-f5',
      titulo: 'F5 — Quixadá: 276 h, sentido inverso',
      enunciado: {
        title: 'Exercício 5 · Foucault',
        pages: [{
          heading: 'Em Quixadá',
          text: 'Em Quixadá (lat. 5° S), calcule T e observe o sentido de rotação.\n\nCompare com Paris: mesmo sentido ou inverso?',
        }],
      },
      isCorrect: () => true,
      feedbackCorreto: 'T ≈ 276 h e sentido inverso ao de Paris!',
      preControls: { place: 'quixada', timeScale: 14400 },
      lockedControls: ['place', 'timeScale'],
      dica: 'T = 24 / sen(5°) ≈ 276 h ≈ 11,5 dias. No hemisfério sul, sentido invertido.',
      minHoldMs: 4000,
    },
  ],
};
