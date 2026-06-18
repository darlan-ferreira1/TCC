// Lançamento de projétil — cinemática pura, sem dependência do Three.js.
//
// Equações de movimento (sem resistência do ar):
//   x(t) = v₀·cos(θ)·t
//   y(t) = v₀·sin(θ)·t − ½·g·t²
//
// Grandezas analíticas (ângulo θ medido da horizontal):
//   Alcance:       R  = v₀²·sin(2θ)/g
//   Altura máxima: H  = (v₀·sinθ)²/(2g)   — atingida em x = R/2
//   Tempo de voo:  T  = 2·v₀·sinθ/g

export interface ProjectileParams {
  v0:    number; // velocidade inicial (m/s)
  theta: number; // ângulo de lançamento (rad)
  g:     number; // gravidade (m/s²)
}

export interface ProjectileInfo {
  range:       number; // alcance R (m)
  maxHeight:   number; // altura máxima H (m)
  flightTime:  number; // tempo de voo T (s)
  xAtMaxHeight: number; // x quando atinge H = R/2
}

export function projectilePos(t: number, p: ProjectileParams): { x: number; y: number } {
  const vx = p.v0 * Math.cos(p.theta);
  const vy = p.v0 * Math.sin(p.theta);
  return { x: vx * t, y: vy * t - 0.5 * p.g * t * t };
}

export function projectileInfo(p: ProjectileParams): ProjectileInfo {
  const sinT = Math.sin(p.theta);
  const range = (p.v0 * p.v0 * Math.sin(2 * p.theta)) / p.g;
  return {
    range,
    maxHeight:    (p.v0 * sinT) ** 2 / (2 * p.g),
    flightTime:   (2 * p.v0 * sinT) / p.g,
    xAtMaxHeight: range / 2,
  };
}

// Pontos da trajetória completa — usados pelo preview da curva na cena
export function trajectoryPoints(p: ProjectileParams, n = 100): { x: number; y: number }[] {
  const { flightTime } = projectileInfo(p);
  return Array.from({ length: n + 1 }, (_, i) =>
    projectilePos((i / n) * flightTime, p),
  );
}
