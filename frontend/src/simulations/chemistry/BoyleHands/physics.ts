// Lei de Boyle com as mãos — gás ideal 2D de partículas. Matemática pura.
//
// MODELO (teoria cinética)
//   N partículas de massa m = 1 num recipiente retangular de largura W
//   (controlada pelas mãos) e altura H fixa. As partículas não colidem entre
//   si (gás ideal) e batem elasticamente nas paredes.
//
// PRESSÃO = efeito das colisões nas paredes
//   Cada batida numa parede transfere o impulso 2·m·|v⊥|. Somando os impulsos
//   num intervalo Δt e dividindo pelo perímetro (em 2D, "pressão" é força por
//   comprimento):
//     P = Σ impulsos / (perímetro · Δt)
//   O valor medido oscila; mostramos a média móvel exponencial.
//
// TEMPERATURA = energia cinética média
//   Em 2D (com k_B = 1):  T = ⟨vx² + vy²⟩ / 2
//   Quando a mão empurra a parede, a parede em movimento dá energia às
//   partículas e o gás esquentaria (compressão adiabática). A Lei de Boyle vale
//   para temperatura CONSTANTE, então um termostato (Berendsen) reajusta
//   suavemente as velocidades para a temperatura escolhida — como um gás que
//   troca calor com o ambiente.
//
// RESULTADO ESPERADO (equação de estado do gás ideal 2D)
//     P · A = N · T      →  com T constante, P · V = constante  (Lei de Boyle)
//   (A = W·H é a "área" do recipiente 2D, o análogo do volume.)

export interface Gas {
  n: number;
  x: Float64Array; y: Float64Array;
  vx: Float64Array; vy: Float64Array;
  width: number;   // W (u.a.)
  height: number;  // H (u.a.)
}

const THERMOSTAT_TAU = 0.15; // s — rapidez com que o termostato puxa para T
export const MIN_WIDTH = 0.25;
export const MAX_WIDTH = 3;

// Velocidades com distribuição gaussiana (Box–Muller) na temperatura T.
function gaussian(rng: () => number): number {
  const u = Math.max(rng(), 1e-12), v = rng();
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
}

export function createGas(n: number, width: number, height: number, temperature: number, rng = Math.random): Gas {
  const g: Gas = {
    n, width, height,
    x: new Float64Array(n), y: new Float64Array(n),
    vx: new Float64Array(n), vy: new Float64Array(n),
  };
  const sigma = Math.sqrt(temperature); // em 2D, cada componente tem variância T
  for (let i = 0; i < n; i++) {
    g.x[i] = rng() * width;
    g.y[i] = rng() * height;
    g.vx[i] = gaussian(rng) * sigma;
    g.vy[i] = gaussian(rng) * sigma;
  }
  return g;
}

export function temperatureOf(g: Gas): number {
  let sum = 0;
  for (let i = 0; i < g.n; i++) sum += g.vx[i] ** 2 + g.vy[i] ** 2;
  return sum / (2 * g.n);
}

// Avança dt segundos com a parede direita indo de g.width para newWidth.
// Devolve a soma dos impulsos nas quatro paredes durante o passo.
export function stepGas(g: Gas, dt: number, newWidth: number, targetT: number | null): number {
  const w = Math.min(Math.max(newWidth, MIN_WIDTH), MAX_WIDTH);
  const wallV = (w - g.width) / dt; // velocidade da parede móvel
  g.width = w;
  let impulse = 0;

  for (let i = 0; i < g.n; i++) {
    g.x[i] += g.vx[i] * dt;
    g.y[i] += g.vy[i] * dt;

    // parede esquerda (fixa, x = 0)
    if (g.x[i] < 0) {
      g.x[i] = -g.x[i];
      impulse += 2 * Math.abs(g.vx[i]);
      g.vx[i] = Math.abs(g.vx[i]);
    }
    // parede direita (móvel, x = W): reflexão no referencial da parede
    if (g.x[i] > w) {
      const rel = g.vx[i] - wallV;
      if (rel > 0) {
        impulse += 2 * rel;
        g.vx[i] = wallV - rel;
      }
      g.x[i] = Math.min(2 * w - g.x[i], w);
      if (g.x[i] < 0) g.x[i] = w * 0.5; // parede andou mais que o recipiente: reposiciona
    }
    // chão e teto (fixos)
    if (g.y[i] < 0) { g.y[i] = -g.y[i]; impulse += 2 * Math.abs(g.vy[i]); g.vy[i] = Math.abs(g.vy[i]); }
    if (g.y[i] > g.height) {
      g.y[i] = 2 * g.height - g.y[i];
      impulse += 2 * Math.abs(g.vy[i]);
      g.vy[i] = -Math.abs(g.vy[i]);
    }
  }

  // Termostato de Berendsen: λ² = 1 + (dt/τ)(T_alvo/T − 1)
  if (targetT !== null) {
    const T = temperatureOf(g);
    if (T > 0) {
      const lambda = Math.sqrt(Math.max(0, 1 + (dt / THERMOSTAT_TAU) * (targetT / T - 1)));
      for (let i = 0; i < g.n; i++) { g.vx[i] *= lambda; g.vy[i] *= lambda; }
    }
  }
  return impulse;
}

// Pressão instantânea a partir dos impulsos de um passo.
export function pressureFromImpulse(impulse: number, g: Gas, dt: number): number {
  return impulse / (2 * (g.width + g.height) * dt);
}

// Valor teórico do gás ideal 2D: P = N·T / A.
export function idealPressure(n: number, temperature: number, area: number): number {
  return (n * temperature) / area;
}

// Média móvel exponencial com constante de tempo tau.
export function ema(previous: number, value: number, dt: number, tau: number): number {
  const k = 1 - Math.exp(-dt / tau);
  return previous + k * (value - previous);
}
