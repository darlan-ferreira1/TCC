// Onda plana progressiva — matemática pura, sem dependência do Three.js.
//
// Equação: y(x, t) = A · sin(kx − ωt)
//   k = 2π/λ  — número de onda (rad/m): quantos ciclos completos por metro
//   ω = 2πf   — frequência angular (rad/s): taxa de oscilação temporal
//
// A função retorna o deslocamento transversal y de um ponto x no instante t.
// O sinal negativo em ωt faz a onda se propagar no sentido +x com o tempo.

export interface WaveParams {
  A:      number; // amplitude (m)
  lambda: number; // comprimento de onda λ (m)
  f:      number; // frequência (Hz)
}

export function waveDisplacement(x: number, t: number, p: WaveParams): number {
  const k     = (2 * Math.PI) / p.lambda;
  const omega = 2 * Math.PI * p.f;
  return p.A * Math.sin(k * x - omega * t);
}

// Grandezas derivadas — usadas no painel de info do index.tsx
export function waveInfo(p: WaveParams) {
  return {
    k:     (2 * Math.PI) / p.lambda,            // número de onda (rad/m)
    omega: 2 * Math.PI * p.f,                   // freq. angular (rad/s)
    v:     p.lambda * p.f,                       // velocidade de fase (m/s)
    T:     1 / p.f,                              // período (s)
  };
}
