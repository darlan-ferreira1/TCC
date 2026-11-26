import type { InfoContent } from './info';
import type { ControlValue, ControlValues } from '../core/controls';

// Campos comuns aos dois tipos de questão.
interface ExercicioBase {
  id: string;
  titulo: string;
  enunciado: InfoContent;
  feedbackCorreto: string;
  preControls?: Record<string, ControlValue>;
  lockedControls?: string[];
  dica?: string;
}

// Tipo "ajustar": o estudante mexe nos controles liberados até acertar.
export interface ExercicioAjustar extends ExercicioBase {
  tipo?: 'ajustar';
  isCorrect: (values: ControlValues) => boolean;
  // Tempo mínimo com isCorrect() = true antes de disparar sucesso (ms). Padrão: 1200.
  minHoldMs?: number;
}

// Uma alternativa: ao ser escolhida, `valores` é aplicado na cena (a resposta
// do estudante vira a entrada da simulação). Errada → a cena mostra o erro.
export interface Alternativa {
  texto: string;
  valores: ControlValues;
  correta?: boolean;
  feedbackErro?: string; // dica específica do erro típico desta alternativa
}

// Tipo "alternativas": sem teclado (bom no celular); 3 ou 4 botões.
export interface ExercicioAlternativas extends ExercicioBase {
  tipo: 'alternativas';
  alternativas: Alternativa[];
}

export type ExercicioInterativo = ExercicioAjustar | ExercicioAlternativas;

const period = (L: number, g: number) => 2 * Math.PI * Math.sqrt(L / g);

export const EXERCICIOS_INTERATIVOS: Record<string, ExercicioInterativo[]> = {
  'simple-pendulum': [
    {
      id: 'pendulo-q1',
      tipo: 'alternativas',
      titulo: "Q1 — Período de um pêndulo de 2,5 m",
      enunciado: {
        title: "Exercício 1 · Pêndulo",
        pages: [{
          heading: "Pêndulo de 2,5 m",
          text: "Um pêndulo simples tem L = 2,5 m e g = 10 m/s².\n\nQual é o período para pequenos ângulos? Use T = 2π√(L/g).\n\nA esfera verde (fantasma) se move com o valor que você escolher: se a resposta estiver certa, ela acompanha o objeto real.",
        }],
      },
      alternativas: [
        { texto: "0,5 s", valores: { fantasmaT: 0.5 }, feedbackErro: "Faltou o 2π: √(L/g) sozinho não é o período." },
        { texto: "1,57 s", valores: { fantasmaT: 1.571 }, feedbackErro: "Faltou a raiz: 2π·(L/g) não é 2π√(L/g)." },
        { texto: "3,14 s", valores: { fantasmaT: 3.1416 }, correta: true },
        { texto: "12,6 s", valores: { fantasmaT: 12.566 }, feedbackErro: "A fração está invertida: é √(L/g), não √(g/L)." },
      ],
      feedbackCorreto: "T = 2π√(2,5/10) = 2π·0,5 = π ≈ 3,14 s: o fantasma acompanha o pêndulo!",
      preControls: { L: 2.5, g: 10, theta0: 15 },
      lockedControls: ['L', 'g', 'theta0', 'fantasmaT'],
      dica: "T = 2π√(L/g) = 2π√(2,5/10) = 2π · 0,5",
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
      tipo: 'alternativas',
      titulo: "Q7 — Alcance do lançamento (20 m/s, 30°)",
      enunciado: {
        title: "Exercício 1 · Lançamento",
        pages: [{
          heading: "Qual é o alcance?",
          text: "Uma bola é lançada a v₀ = 20 m/s, θ = 30°, g = 10 m/s².\n\nQual é o alcance?\n\nAo escolher, uma bandeira verde é fincada no alcance escolhido e a bola é lançada.",
        }],
      },
      alternativas: [
        { texto: "17,3 m", valores: { bandeira: 17.32 }, feedbackErro: "Esse é o caminho só até o ponto mais alto (1 s). O voo inteiro dura 2 s." },
        { texto: "20 m", valores: { bandeira: 20 }, feedbackErro: "A componente horizontal usa cos 30°, não sen 30°." },
        { texto: "34,6 m", valores: { bandeira: 34.64 }, correta: true },
        { texto: "40 m", valores: { bandeira: 40 }, feedbackErro: "R = v₀²/g só vale a 45°. Falta o sen(2θ)." },
      ],
      feedbackCorreto: "R = v₀x · T = 17,3 · 2 ≈ 34,6 m: a bola caiu na bandeira!",
      preControls: { v0: 20, angle: 30, bandeira: -1 },
      lockedControls: ['v0', 'angle', 'bandeira'],
      dica: "v₀y = 20·sen30° = 10 m/s → T = 2v₀y/g = 2 s\nv₀x = 20·cos30° ≈ 17,3 m/s → R = v₀x·T",
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
      tipo: 'alternativas',
      titulo: 'Q9a — Outro ângulo, mesmo alcance',
      enunciado: {
        title: 'Exercício 3 · Lançamento',
        pages: [{
          heading: 'Mesmo alcance, outro ângulo',
          text: 'Com v₀ = 20 m/s e θ = 30°, a bola cai a ≈ 34,6 m.\n\nQual OUTRO ângulo faz a bola cair no mesmo lugar?\n\nA bandeira verde marca esse ponto. Escolha uma alternativa: o canhão é apontado no ângulo escolhido.',
        }],
      },
      alternativas: [
        { texto: '15°', valores: { angle: 15 }, feedbackErro: 'Metade de 30° não dá o mesmo alcance: veja onde a bola caiu.' },
        { texto: '45°', valores: { angle: 45 }, feedbackErro: '45° dá o MAIOR alcance (40 m), não o mesmo.' },
        { texto: '60°', valores: { angle: 60 }, correta: true },
        { texto: '75°', valores: { angle: 75 }, feedbackErro: '75° é complementar de 15°, não de 30°.' },
      ],
      feedbackCorreto: '60° e 30° são complementares: sen(2·60°) = sen(2·30°), mesmo alcance!',
      preControls: { v0: 20, angle: 30, bandeira: 34.64 },
      lockedControls: ['v0', 'angle', 'bandeira'],
      dica: 'R = v₀²·sen(2θ)/g. Procure θ com sen(2θ) = sen(60°).',
    },
    {
      id: 'lancamento-q9b',
      tipo: 'alternativas',
      titulo: "Q9b — Altura máxima a 60°",
      enunciado: {
        title: "Exercício 4 · Lançamento",
        pages: [{
          heading: "Mesmo alcance, mais alto",
          text: "A 60°, a bola cai no mesmo lugar que a 30°, mas sobe mais.\n\nCom v₀ = 20 m/s e θ = 60°, qual é a altura máxima?\n\nAo escolher, uma faixa verde é colocada nessa altura e a bola é lançada.",
        }],
      },
      alternativas: [
        { texto: "5 m", valores: { faixa: 5 }, feedbackErro: "Essa é a altura a 30°. A 60°, v₀y é maior." },
        { texto: "10 m", valores: { faixa: 10 }, feedbackErro: "Confira v₀y = 20·sen60° ≈ 17,3 m/s." },
        { texto: "15 m", valores: { faixa: 15 }, correta: true },
        { texto: "20 m", valores: { faixa: 20 }, feedbackErro: "v₀²/2g é a altura de um lançamento vertical. Falta o sen60°." },
      ],
      feedbackCorreto: "H = (20·sen60°)²/(2·10) = 15 m: a bola tocou a faixa! (a 30° eram só 5 m)",
      preControls: { v0: 20, angle: 60, faixa: -1 },
      lockedControls: ['v0', 'angle', 'faixa'],
      dica: "v₀y = 20·sen60° ≈ 17,3 m/s\nH = v₀y²/(2g)",
    },
  ],
  'kepler-room': [
    {
      id: 'kepler-q10',
      tipo: 'alternativas',
      titulo: "Q10 — Período do Planeta X a 4 UA",
      enunciado: {
        title: "Exercício 1 · Kepler",
        pages: [{
          heading: "Planeta X a 4 UA",
          text: "O Planeta X está a 4 UA do Sol. Pela 3ª lei, T² = a³ (T em anos, a em UA).\n\nQual é o período do Planeta X?\n\nO planeta verde (fantasma) anda na mesma órbita com o período que você escolher: se estiver certo, ele acompanha o Planeta X.",
        }],
      },
      alternativas: [
        { texto: "4 anos", valores: { fantasmaT: 4 }, feedbackErro: "T não é igual a a: a 3ª lei é T² = a³." },
        { texto: "8 anos", valores: { fantasmaT: 8 }, correta: true },
        { texto: "16 anos", valores: { fantasmaT: 16 }, feedbackErro: "Isso é a², não √(a³)." },
        { texto: "64 anos", valores: { fantasmaT: 64 }, feedbackErro: "64 é T². Falta tirar a raiz." },
      ],
      feedbackCorreto: "T² = 4³ = 64 → T = 8 anos: o fantasma acompanha o Planeta X!",
      preControls: { planetX: 4, yearsPerSecond: 0.5 },
      lockedControls: ['planetX', 'yearsPerSecond', 'fantasmaT'],
      dica: "T² = a³ = 4³ = 64",
    },
    {
      id: 'kepler-q11',
      tipo: 'alternativas',
      titulo: "Q11 — Órbita de Marte (1,52 UA)",
      enunciado: {
        title: "Exercício 2 · Kepler",
        pages: [{
          heading: "Na órbita de Marte",
          text: "O Planeta X foi colocado na órbita de Marte, a 1,52 UA do Sol.\n\nQual é o período? (T² = a³)\n\nO planeta verde (fantasma) anda na mesma órbita com o período que você escolher: se estiver certo, ele acompanha o Planeta X.",
        }],
      },
      alternativas: [
        { texto: "1,52 anos", valores: { fantasmaT: 1.52 }, feedbackErro: "T não é igual a a: a 3ª lei é T² = a³." },
        { texto: "1,87 anos", valores: { fantasmaT: 1.874 }, correta: true },
        { texto: "2,31 anos", valores: { fantasmaT: 2.31 }, feedbackErro: "Isso é a², não √(a³)." },
        { texto: "3,51 anos", valores: { fantasmaT: 3.512 }, feedbackErro: "3,51 é T². Falta tirar a raiz." },
      ],
      feedbackCorreto: "T = √(1,52³) ≈ 1,87 anos: Marte leva quase 2 anos para dar uma volta!",
      preControls: { planetX: 1.52, yearsPerSecond: 0.5 },
      lockedControls: ['planetX', 'yearsPerSecond', 'fantasmaT'],
      dica: "T² = 1,52³ ≈ 3,51",
    },
  ],
  'waves-room': [
    {
      id: 'ondas-q12',
      tipo: 'alternativas',
      titulo: "Q12 — Velocidade da onda (λ = 2 m, f = 0,5 Hz)",
      enunciado: {
        title: "Exercício 1 · Ondas",
        pages: [{
          heading: "Velocidade da onda",
          text: "Uma onda tem λ = 2 m e f = 0,5 Hz.\n\nQual é a velocidade da onda?\n\nO ponto verde sai junto da crista vermelha com a velocidade que você escolher: se estiver certa, os dois andam juntos.",
        }],
      },
      alternativas: [
        { texto: "0,25 m/s", valores: { fantasmaV: 0.25 }, feedbackErro: "Isso é f/λ. A velocidade é λ·f." },
        { texto: "1 m/s", valores: { fantasmaV: 1 }, correta: true },
        { texto: "2 m/s", valores: { fantasmaV: 2 }, feedbackErro: "Esse é só o λ. Falta multiplicar pela frequência." },
        { texto: "4 m/s", valores: { fantasmaV: 4 }, feedbackErro: "Isso é λ/f. A velocidade é λ·f." },
      ],
      feedbackCorreto: "v = λ·f = 2 · 0,5 = 1 m/s: o ponto verde acompanha a crista!",
      preControls: { wavelength: 2, frequency: 0.5, amplitude: 0.4 },
      lockedControls: ['wavelength', 'frequency', 'amplitude', 'fantasmaV'],
      dica: "v = λ · f",
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
      tipo: 'alternativas',
      titulo: "C1 — Período com L = 1 m e θ = 60°",
      enunciado: {
        title: "Exercício 1 · Pêndulo cônico",
        pages: [{
          heading: "Período do pêndulo cônico",
          text: "O pêndulo cônico tem L = 1 m e θ = 60°. Use T = 2π√(L·cosθ/g).\n\nQual é o período?\n\nA esfera verde (fantasma) se move com o valor que você escolher: se a resposta estiver certa, ela acompanha o objeto real.",
        }],
      },
      alternativas: [
        { texto: "0,70 s", valores: { fantasmaT: 0.702 }, feedbackErro: "Use 2π, não π." },
        { texto: "1,40 s", valores: { fantasmaT: 1.405 }, correta: true },
        { texto: "1,85 s", valores: { fantasmaT: 1.849 }, feedbackErro: "A fórmula usa cos θ (a altura do cone), não sen θ." },
        { texto: "1,99 s", valores: { fantasmaT: 1.987 }, feedbackErro: "Esse é o período do pêndulo simples: faltou o cos θ." },
      ],
      feedbackCorreto: "T = 2π√(cos60°/10) ≈ 1,40 s: o fantasma acompanha a massa!",
      preControls: { L: 1, theta: 60, g: 10 },
      lockedControls: ['L', 'theta', 'g', 'fantasmaT'],
      dica: "T = 2π√(1·cos60°/10) = 2π√0,05",
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
        title: 'Exercício 4 · Pêndulo cônico',
        pages: [{
          heading: 'Cônico ou simples?',
          text: 'Com L = 1 m, o pêndulo simples tem período T = 2π√(L/g) ≈ 2 s.\n\nDiminua θ até o período do pêndulo cônico ficar praticamente igual ao do simples (diferença menor que 2%).',
        }],
      },
      isCorrect: (v) => Number(v.theta) <= 10,
      feedbackCorreto: 'Com θ pequeno, cos θ ≈ 1: o cônico vira um pêndulo simples (T ≈ 2 s)!',
      preControls: { L: 1, g: 10, theta: 50 },
      lockedControls: ['L', 'g'],
      dica: 'T_cônico = 2π√(L·cosθ/g). Quando cos θ ≈ 1, T_cônico ≈ T_simples. cos 10° ≈ 0,985.',
    },
  ],
  'foucault-pendulum': [
    {
      id: 'foucault-f1',
      tipo: 'alternativas',
      titulo: "F1 — Período do pêndulo (L = 6 m)",
      enunciado: {
        title: "Exercício 1 · Foucault",
        pages: [{
          heading: "Período da oscilação",
          text: "O pêndulo desta sala tem L = 6 m e g = 10 m/s².\n\nQual é o período de uma oscilação? Use T = 2π√(L/g).\n\nA esfera verde (fantasma) oscila com o período que você escolher: se estiver certo, ela acompanha a massa.",
        }],
      },
      alternativas: [
        { texto: "0,77 s", valores: { fantasmaT: 0.775 }, feedbackErro: "Faltou o 2π." },
        { texto: "3,77 s", valores: { fantasmaT: 3.77 }, feedbackErro: "Faltou a raiz: 2π·(L/g) não é 2π√(L/g)." },
        { texto: "4,87 s", valores: { fantasmaT: 4.867 }, correta: true },
        { texto: "8,11 s", valores: { fantasmaT: 8.112 }, feedbackErro: "A fração está invertida: é √(L/g)." },
      ],
      feedbackCorreto: "T = 2π√(6/10) ≈ 4,87 s: o fantasma acompanha a massa!",
      preControls: { place: "paris", timeScale: 600 },
      lockedControls: ['place', 'timeScale', 'fantasmaT'],
      dica: "T = 2π√(6/10)",
    },
    {
      id: 'foucault-f2',
      tipo: 'alternativas',
      titulo: 'F2 — Onde o plano não gira?',
      enunciado: {
        title: 'Exercício 2 · Foucault',
        pages: [{
          heading: 'A Terra que gira',
          text: 'O plano de oscilação é fixo no espaço: é a Terra que gira por baixo dele.\n\nEm qual destes lugares o plano NÃO gira?\n\nEscolha uma alternativa: a sala é levada para o lugar escolhido.',
        }],
      },
      alternativas: [
        { texto: 'Polo Norte', valores: { place: 'polo_norte' }, feedbackErro: 'No polo o plano gira mais rápido: uma volta em 24 h.' },
        { texto: 'Paris', valores: { place: 'paris' }, feedbackErro: 'Em Paris o plano gira (≈ 32 h por volta).' },
        { texto: 'Equador', valores: { place: 'equador' }, correta: true },
        { texto: 'Quixadá', valores: { place: 'quixada' }, feedbackErro: 'Quixadá está perto do equador, mas não nele: o plano gira bem devagar.' },
      ],
      feedbackCorreto: 'No equador, sen(0°) = 0: o plano nunca gira!',
      preControls: { place: 'paris', timeScale: 7200 },
      lockedControls: ['place', 'timeScale'],
      dica: 'T = 24 h / sen(latitude). O que acontece quando a latitude é 0°?',
    },
    {
      id: 'foucault-f3a',
      tipo: 'alternativas',
      titulo: "F3 — Polo Norte: tempo de uma volta",
      enunciado: {
        title: "Exercício 3 · Foucault",
        pages: [{
          heading: "No Polo Norte",
          text: "No Polo Norte (latitude 90°), quanto tempo o plano de oscilação leva para dar uma volta completa?\n\nUse T = 24 h / sen(latitude). O tempo está acelerado.\n\nAo escolher, uma linha verde gira no disco com o tempo de volta (e o sentido) escolhido: se estiver certo, ela acompanha o rastro da massa.",
        }],
      },
      alternativas: [
        { texto: "12 h", valores: { fantasmaH: 12 }, feedbackErro: "sen 90° = 1: o tempo não diminui." },
        { texto: "24 h", valores: { fantasmaH: 24 }, correta: true },
        { texto: "48 h", valores: { fantasmaH: 48 }, feedbackErro: "sen 90° = 1: o tempo não dobra." },
        { texto: "Nunca gira", valores: { fantasmaH: 1000000000.0 }, feedbackErro: "Quem não gira é o equador. No polo o giro é o mais rápido." },
      ],
      feedbackCorreto: "T = 24 h / sen 90° = 24 h: no polo, uma volta por dia!",
      preControls: { place: "polo_norte", timeScale: 7200 },
      lockedControls: ['place', 'timeScale', 'fantasmaH'],
      dica: "T = 24 / sen(90°) = 24 / 1",
    },
    {
      id: 'foucault-f4',
      tipo: 'alternativas',
      titulo: "F4 — Paris: tempo de uma volta",
      enunciado: {
        title: "Exercício 4 · Foucault",
        pages: [{
          heading: "Em Paris (49° N)",
          text: "Em Paris (latitude 49° N), quanto tempo o plano leva para dar uma volta?\n\nUse T = 24 h / sen(latitude), com sen 49° ≈ 0,755.\n\nAo escolher, uma linha verde gira no disco com o tempo de volta (e o sentido) escolhido: se estiver certo, ela acompanha o rastro da massa.",
        }],
      },
      alternativas: [
        { texto: "18 h", valores: { fantasmaH: 18.11 }, feedbackErro: "Você multiplicou: é 24 h DIVIDIDO por sen(latitude)." },
        { texto: "24 h", valores: { fantasmaH: 24 }, feedbackErro: "Isso só vale no polo. Em Paris a latitude importa." },
        { texto: "32 h", valores: { fantasmaH: 31.8 }, correta: true },
        { texto: "37 h", valores: { fantasmaH: 36.58 }, feedbackErro: "A fórmula usa sen(latitude), não cos." },
      ],
      feedbackCorreto: "T = 24 / sen49° ≈ 32 h: a linha acompanha o rastro!",
      preControls: { place: "paris", timeScale: 7200 },
      lockedControls: ['place', 'timeScale', 'fantasmaH'],
      dica: "T = 24 / 0,755",
    },
    {
      id: 'foucault-f5',
      tipo: 'alternativas',
      titulo: "F5 — Quixadá: tempo e sentido",
      enunciado: {
        title: "Exercício 5 · Foucault",
        pages: [{
          heading: "Em Quixadá (5° S)",
          text: "Em Quixadá (latitude 5° S), quanto tempo o plano leva para dar uma volta, e em que sentido, comparado com Paris?\n\nsen 5° ≈ 0,087.\n\nAo escolher, uma linha verde gira no disco com o tempo de volta (e o sentido) escolhido: se estiver certo, ela acompanha o rastro da massa.",
        }],
      },
      alternativas: [
        { texto: "≈ 24 h, mesmo sentido de Paris", valores: { fantasmaH: 24.09 }, feedbackErro: "A fórmula usa sen(latitude), não cos. E no hemisfério sul o sentido muda." },
        { texto: "≈ 276 h, mesmo sentido de Paris", valores: { fantasmaH: 275.4 }, feedbackErro: "O tempo está certo, mas no hemisfério sul o sentido é o inverso." },
        { texto: "≈ 276 h, sentido inverso ao de Paris", valores: { fantasmaH: -275.4 }, correta: true },
        { texto: "Nunca gira", valores: { fantasmaH: 1000000000.0 }, feedbackErro: "Quixadá está perto do equador, mas não nele: o plano gira, só que bem devagar." },
      ],
      feedbackCorreto: "T = 24 / sen5° ≈ 276 h (11,5 dias), no sentido inverso ao de Paris!",
      preControls: { place: "quixada", timeScale: 14400 },
      lockedControls: ['place', 'timeScale', 'fantasmaH'],
      dica: "T = 24 / 0,087 ≈ 276 h. No hemisfério sul, o plano gira no sentido anti-horário.",
    },
  ],
};
