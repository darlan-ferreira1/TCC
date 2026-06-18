// Sistema Solar — cinemática de órbitas circulares.
//
// Cada planeta é parametrizado por raio orbital e período (relativos, não em escala real).
// A posição em função do tempo é dada por:
//   x(t) = r · cos(ωt + φ₀)
//   z(t) = r · sin(ωt + φ₀)    ← órbita no plano XZ (Y = 0)
//   ω    = 2π / T
//
// Os períodos entre si mantêm proporção real (ex: Júpiter ≈ 11.86× a Terra),
// mas os raios orbitais são comprimidos para caber na cena.
//
// TODO: substituir por gravitação newtoniana real.
//   Para cada planeta: F = G·M·m/r² aplicada como aceleração
//   e integrada por Euler semi-implícito a cada frame.
//   Estado necessário: posição (x, z) + velocidade (vx, vz).
//   Condição inicial: velocidade circular v = √(GM/r) tangente à órbita.

export interface PlanetParams {
  name:          string;
  orbitalRadius: number; // unidades da cena (escala comprimida)
  orbitalPeriod: number; // em "anos terrestres" relativos
  phase:         number; // ângulo inicial (rad) — dispersa os planetas
}

export interface PlanetPosition {
  x: number;
  y: number; // sempre 0 (órbita plana)
  z: number;
}

export function planetPosition(t: number, p: PlanetParams): PlanetPosition {
  const omega = (2 * Math.PI) / p.orbitalPeriod;
  const angle = omega * t + p.phase;
  return {
    x: p.orbitalRadius * Math.cos(angle),
    y: 0,
    z: p.orbitalRadius * Math.sin(angle),
  };
}

// Períodos reais relativos à Terra; raios orbitais comprimidos para visualização
export const PLANETS: PlanetParams[] = [
  { name: 'Mercúrio', orbitalRadius:  2.5, orbitalPeriod:  0.24,  phase: 0.5  },
  { name: 'Vênus',    orbitalRadius:  3.8, orbitalPeriod:  0.62,  phase: 1.2  },
  { name: 'Terra',    orbitalRadius:  5.2, orbitalPeriod:  1.00,  phase: 2.0  },
  { name: 'Marte',    orbitalRadius:  6.8, orbitalPeriod:  1.88,  phase: 3.5  },
  { name: 'Júpiter',  orbitalRadius: 10.0, orbitalPeriod: 11.86,  phase: 0.8  },
  { name: 'Saturno',  orbitalRadius: 13.0, orbitalPeriod: 29.46,  phase: 4.2  },
  { name: 'Urano',    orbitalRadius: 16.0, orbitalPeriod: 84.01,  phase: 1.7  },
  { name: 'Netuno',   orbitalRadius: 19.0, orbitalPeriod: 164.80, phase: 5.1  },
];
