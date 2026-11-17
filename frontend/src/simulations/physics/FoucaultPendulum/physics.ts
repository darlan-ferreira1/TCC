// Pêndulo de Foucault — domínio puro (sem three nem react).
//
// O pêndulo oscila como um pêndulo simples (período 2π√(L/g)), mas o plano de
// oscilação gira em relação ao chão porque a Terra gira por baixo dele.
// Velocidade de giro do plano: Ω·sen(latitude), com Ω = 1 volta / 24 h
// (valor usado no ensino médio; o dia sideral tem 23 h 56 min).
//   - hemisfério norte: horário, visto de cima;
//   - hemisfério sul: anti-horário;
//   - equador: não gira.

const DEG = Math.PI / 180;
export const DAY_SECONDS = 24 * 3600;

// rad/s; positivo = anti-horário visto de cima (mesmo sentido de rotation.y no three)
export function planeRate(latitudeDeg: number): number {
  return -((2 * Math.PI) / DAY_SECONDS) * Math.sin(latitudeDeg * DEG);
}

// Horas para o plano dar uma volta completa (Infinity no equador).
export function turnHours(latitudeDeg: number): number {
  const s = Math.abs(Math.sin(latitudeDeg * DEG));
  return s < 1e-9 ? Infinity : 24 / s;
}

export function swingPeriod(L: number, g: number): number {
  return 2 * Math.PI * Math.sqrt(L / g);
}
