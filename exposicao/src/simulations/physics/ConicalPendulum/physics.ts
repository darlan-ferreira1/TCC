// Pêndulo cônico — domínio puro (sem three nem react).
//
// A massa gira num círculo horizontal e o fio (comprimento L) faz o ângulo θ
// com a vertical. Na vertical, T·cos θ = m·g; na horizontal, T·sen θ = m·v²/r.
// Daí saem:
//   r = L·sen θ           (raio do círculo)
//   h = L·cos θ           (altura do cone)
//   ω = √(g / h)          (velocidade angular)
//   período = 2π √(L·cos θ / g)
//   v = ω·r

export interface ConicalConfig {
  L: number;     // m
  theta: number; // rad, ângulo do fio com a vertical (0 < θ < 90°)
  g: number;     // m/s²
}

export interface ConicalInfo {
  r: number;
  h: number;
  omega: number;  // rad/s
  period: number; // s
  speed: number;  // m/s
}

export function conicalInfo({ L, theta, g }: ConicalConfig): ConicalInfo {
  const r = L * Math.sin(theta);
  const h = L * Math.cos(theta);
  const omega = Math.sqrt(g / h);
  return { r, h, omega, period: (2 * Math.PI) / omega, speed: omega * r };
}
