// "Você é o móvel" — cinemática a partir da posição da mão. Matemática pura.
//
// 1. CALIBRAÇÃO (pixels → metros)
//    A câmera só "vê" pixels. Para falar em metros, usamos a própria mão como
//    régua: a palma (punho → base do dedo médio) de um adulto mede ~9,5 cm.
//      metros por pixel = 0,095 m / (tamanho da palma em pixels)
//    Usa-se a MEDIANA de várias medidas (robusta a quadros ruins). A conversão
//    vale enquanto a mão se move de lado, à mesma distância da câmera.
//
// 2. VELOCIDADE A PARTIR DE POSIÇÕES RUIDOSAS
//    A posição detectada "treme" alguns milímetros a cada quadro. Derivar com
//    v = Δx/Δt entre dois quadros vizinhos amplificaria esse ruído. Em vez
//    disso, a velocidade é a INCLINAÇÃO da reta de mínimos quadrados ajustada
//    às posições dos últimos 0,25 s:
//      v = Σ(tᵢ − t̄)(xᵢ − x̄) / Σ(tᵢ − t̄)²
//    É a definição de velocidade média aplicada a uma janela curta — o mesmo
//    que o aluno faz ao traçar a reta tangente num gráfico x(t).
//
// 3. DESAFIOS
//    Cada desafio é uma função-alvo x(t) (deslocamento a partir de onde a mão
//    estava no início). A nota compara o movimento gravado com o alvo pelo
//    erro quadrático médio (RMS).

export interface Sample { t: number; x: number; }      // t em s, x em m
export interface KinematicPoint extends Sample { v: number; } // v em m/s

export const PALM_REFERENCE_M = 0.095;
const VELOCITY_WINDOW_S = 0.25;
const HISTORY_S = 12;

export function median(values: number[]): number {
  if (!values.length) return NaN;
  const s = [...values].sort((a, b) => a - b);
  const mid = Math.floor(s.length / 2);
  return s.length % 2 ? s[mid] : (s[mid - 1] + s[mid]) / 2;
}

export function metersPerPixel(palmSpansPx: number[], reference = PALM_REFERENCE_M): number {
  return reference / median(palmSpansPx);
}

// Inclinação da reta de mínimos quadrados x(t) — a velocidade média na janela.
export function slope(samples: Sample[]): number {
  const n = samples.length;
  if (n < 2) return 0;
  let tm = 0, xm = 0;
  for (const s of samples) { tm += s.t; xm += s.x; }
  tm /= n; xm /= n;
  let num = 0, den = 0;
  for (const s of samples) {
    num += (s.t - tm) * (s.x - xm);
    den += (s.t - tm) ** 2;
  }
  return den > 0 ? num / den : 0;
}

// Histórico de posições com velocidade calculada a cada amostra.
export function createKinematics() {
  let points: KinematicPoint[] = [];
  return {
    push(t: number, x: number): KinematicPoint {
      const recent = points.filter((p) => p.t >= t - VELOCITY_WINDOW_S);
      const v = slope([...recent, { t, x }]);
      const p = { t, x, v };
      points.push(p);
      // descarta o que já saiu da janela do gráfico
      const cutoff = t - HISTORY_S;
      if (points[0]?.t < cutoff) points = points.filter((q) => q.t >= cutoff);
      return p;
    },
    history(): readonly KinematicPoint[] { return points; },
    last(): KinematicPoint | undefined { return points[points.length - 1]; },
    clear() { points = []; },
  };
}
export type Kinematics = ReturnType<typeof createKinematics>;

// ── Desafios ──

export interface Challenge {
  id: string;
  title: string;
  goal: string;         // instrução para o aluno
  concept: string;      // o que o desafio ensina
  duration: number;     // s
  target(t: number): number; // deslocamento-alvo (m) no instante t
}

export const CHALLENGES: Challenge[] = [
  {
    id: 'repouso',
    title: 'Repouso',
    goal: 'Mantenha a mão parada por 4 segundos.',
    concept: 'Repouso: x(t) é uma reta horizontal e a velocidade é zero.',
    duration: 4,
    target: () => 0,
  },
  {
    id: 'mu',
    title: 'Movimento uniforme',
    goal: 'Mova a mão para a direita com velocidade constante de 8 cm/s (comece pelo lado esquerdo).',
    concept: 'MU: x(t) é uma reta inclinada; v(t) é constante. A inclinação da reta é a velocidade.',
    duration: 4,
    target: (t) => 0.08 * t,
  },
  {
    id: 'ida-volta',
    title: 'Ida e volta',
    goal: 'Vá 20 cm para a direita em 2,5 s e volte ao ponto inicial em mais 2,5 s.',
    concept: 'Na volta a velocidade fica negativa: o sinal de v indica o sentido do movimento.',
    duration: 5,
    target: (t) => (t <= 2.5 ? 0.08 * t : 0.2 - 0.08 * (t - 2.5)),
  },
  {
    id: 'muv',
    title: 'Acelerando',
    goal: 'Parta do repouso e acelere para a direita, cada vez mais rápido (a = 4 cm/s²).',
    concept: 'MUV: x(t) é uma parábola e v(t) é uma reta inclinada. A inclinação de v(t) é a aceleração.',
    duration: 4,
    target: (t) => 0.5 * 0.04 * t * t,
  },
];

// Erro RMS que leva a nota a 0. Acompanha o tamanho do movimento pedido
// (metade da maior amplitude do alvo), com mínimo de 3 cm: errar 5 cm num
// movimento de 32 cm é diferente de errar 5 cm quando o pedido é ficar parado.
const MIN_TOLERANCE_M = 0.03;
export function scoreTolerance(challenge: Challenge): number {
  let amplitude = 0;
  for (let i = 0; i <= 40; i++) amplitude = Math.max(amplitude, Math.abs(challenge.target((i / 40) * challenge.duration)));
  return Math.max(MIN_TOLERANCE_M, amplitude / 2);
}

// Interpola linearmente o deslocamento gravado no instante t.
function displacementAt(rec: Sample[], t: number): number {
  if (t <= rec[0].t) return rec[0].x;
  for (let i = 1; i < rec.length; i++) {
    if (rec[i].t >= t) {
      const a = rec[i - 1], b = rec[i];
      const k = (t - a.t) / (b.t - a.t || 1);
      return a.x + k * (b.x - a.x);
    }
  }
  return rec[rec.length - 1].x;
}

// Nota de 0 a 100. `recorded` usa t relativo ao início do desafio e x relativo
// à posição inicial (deslocamento).
export function scoreChallenge(recorded: Sample[], challenge: Challenge): { score: number; rms: number } {
  if (recorded.length < 2) return { score: 0, rms: Infinity };
  const steps = 40;
  let sq = 0;
  for (let i = 0; i <= steps; i++) {
    const t = (i / steps) * challenge.duration;
    sq += (displacementAt(recorded, t) - challenge.target(t)) ** 2;
  }
  const rms = Math.sqrt(sq / (steps + 1));
  return { score: Math.round(Math.max(0, 1 - rms / scoreTolerance(challenge)) * 100), rms };
}
