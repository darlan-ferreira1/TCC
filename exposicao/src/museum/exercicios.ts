// Exercícios interativos por sala. Cada `Exercicio` define o enunciado, as
// entradas esperadas do aluno, o gabarito e quais controles da simulação mudar
// antes (preControls) ou depois (applyControls) que o aluno responde.

export interface ExInput {
  id: string;
  label: string;
  unit: string;
}

export interface Exercicio {
  id: string;
  titulo: string;
  enunciado: string;
  dado: string;
  inputs: ExInput[];
  gabarito: Record<string, number>;
  tolerancia: Record<string, number>;
  dica: string;
  // Controles da simulação fixados antes de mostrar o exercício.
  preControls?: Record<string, number>;
  // Controles a aplicar com a resposta do aluno (undefined = não altera).
  applyControls?: (ans: Record<string, number>) => Record<string, number>;
}

export const EXERCICIOS: Record<string, Exercicio[]> = {
  'simple-pendulum': [
    {
      id: 'pendulo-q1',
      titulo: 'Q1 — Período do pêndulo',
      enunciado: 'Um pêndulo simples tem comprimento L = 2,5 m. Qual é o período de oscilação?',
      dado: 'Dados: L = 2,5 m, g = 10 m/s²',
      inputs: [{ id: 'T', label: 'Período T', unit: 's' }],
      gabarito: { T: Math.PI },
      tolerancia: { T: 0.15 },
      dica: 'T = 2π √(L / g)',
      preControls: { L: 2.5, g: 10 },
      applyControls: () => ({ L: 2.5 }),
    },
    {
      id: 'pendulo-q2',
      titulo: 'Q2 — Comprimento para período dado',
      enunciado: 'Qual deve ser o comprimento L para que o pêndulo oscile com período T = 2 s?',
      dado: 'Dados: T = 2 s, g = 10 m/s², use π² ≈ 10',
      inputs: [{ id: 'L', label: 'Comprimento L', unit: 'm' }],
      gabarito: { L: 1.0 },
      tolerancia: { L: 0.05 },
      dica: 'T = 2π √(L/g)  →  L = g T² / (4π²)',
      applyControls: (ans) => ({ L: ans.L }),
    },
  ],

  'projectile-room': [
    {
      id: 'lancamento-q7',
      titulo: 'Q7 — Tempo de voo, altura máxima e alcance',
      enunciado:
        'Uma bola é lançada com velocidade inicial v₀ = 20 m/s a 30° da horizontal. ' +
        'Calcule o tempo de voo, a altura máxima e o alcance horizontal.',
      dado: 'Dados: v₀ = 20 m/s, θ = 30°, g = 10 m/s²',
      inputs: [
        { id: 't', label: 'Tempo de voo', unit: 's' },
        { id: 'H', label: 'Altura máxima', unit: 'm' },
        { id: 'R', label: 'Alcance horizontal', unit: 'm' },
      ],
      gabarito: { t: 2.0, H: 5.0, R: 20 * Math.sqrt(3) },
      tolerancia: { t: 0.2, H: 0.5, R: 1.5 },
      dica: 'Decompõe: v₀y = v₀ sen θ, v₀x = v₀ cos θ. Tempo de subida = v₀y / g.',
      preControls: { v0: 20, angle: 30 },
    },
  ],

  'kepler-room': [
    {
      id: 'kepler-q10',
      titulo: 'Q10 — Período pela 3ª lei de Kepler',
      enunciado:
        'Um planeta X está a 4 UA do Sol. Pela Terceira Lei de Kepler (T² = a³), ' +
        'qual é o período desse planeta em anos terrestres?',
      dado: 'Dados: a = 4 UA (a Terra tem a = 1 UA, T = 1 ano)',
      inputs: [{ id: 'T', label: 'Período T', unit: 'anos' }],
      gabarito: { T: 8.0 },
      tolerancia: { T: 0.3 },
      dica: 'T² = a³  →  T = √(4³) = √64',
      preControls: { planetX: 4 },
    },
  ],

  'waves-room': [
    {
      id: 'ondas-q12',
      titulo: 'Q12 — Velocidade e período de uma onda',
      enunciado:
        'Uma onda se propaga em uma corda com comprimento de onda λ = 4 m e ' +
        'frequência f = 0,5 Hz. Calcule a velocidade de propagação e o período.',
      dado: 'Dados: λ = 4 m, f = 0,5 Hz',
      inputs: [
        { id: 'v', label: 'Velocidade v', unit: 'm/s' },
        { id: 'T', label: 'Período T', unit: 's' },
      ],
      gabarito: { v: 2.0, T: 2.0 },
      tolerancia: { v: 0.15, T: 0.15 },
      dica: 'v = f · λ    e    T = 1/f',
      preControls: { wavelength: 4, frequency: 0.5 },
    },
  ],

  'conical-pendulum': [
    {
      id: 'conico-c1',
      titulo: 'C1 — Período do pêndulo cônico',
      enunciado:
        'Um pêndulo cônico tem fio de comprimento L = 1 m e gira com ângulo ' +
        'θ = 60° em relação à vertical. Qual é o período da volta completa?',
      dado: 'Dados: L = 1 m, θ = 60°, g = 10 m/s²',
      inputs: [{ id: 'tau', label: 'Período τ', unit: 's' }],
      gabarito: { tau: 2 * Math.PI * Math.sqrt((1 * Math.cos(Math.PI / 3)) / 10) },
      tolerancia: { tau: 0.1 },
      dica: 'τ = 2π √(L cos θ / g)',
      preControls: { L: 1, theta: 60, g: 10 },
      applyControls: () => ({ L: 1, theta: 60, g: 10 }),
    },
  ],
};
