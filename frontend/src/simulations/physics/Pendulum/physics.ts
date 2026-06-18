// Pêndulo simples — matemática pura, sem dependência do Three.js.
//
// Equação de movimento: θ'' = -(g/L)·sin(θ)
//
// Integração por Euler semi-implícito:
//   1. ω_new = ω + dt · α(θ)      ← velocidade angular atualizada com aceleração atual
//   2. θ_new = θ + dt · ω_new     ← posição atualizada com a NOVA velocidade (não a antiga)
//
// Usar ω_new em vez de ω na etapa 2 é o que caracteriza o método semi-implícito:
// ele conserva energia muito melhor que o Euler explícito para osciladores.

export interface PendulumState {
  theta: number; // ângulo em relação à vertical (rad) — positivo = direita
  omega: number; // velocidade angular (rad/s)
}

export interface PendulumConfig {
  L: number; // comprimento da haste (m)
  g: number; // aceleração gravitacional (m/s²)
}

export function stepPendulum(
  state: PendulumState,
  config: PendulumConfig,
  dt: number,
): PendulumState {
  const omega = state.omega + dt * (-(config.g / config.L) * Math.sin(state.theta));
  const theta = state.theta + dt * omega;
  return { theta, omega };
}

// Período pela aproximação de pequenos ângulos: T = 2π√(L/g)
export function period(config: PendulumConfig): number {
  return 2 * Math.PI * Math.sqrt(config.L / config.g);
}
