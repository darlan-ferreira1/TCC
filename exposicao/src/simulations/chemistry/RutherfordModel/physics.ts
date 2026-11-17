// Experimento de Rutherford (folha de ouro) — domínio puro (sem three nem react).
//
// Cada partícula alfa que chega à folha tem um destino sorteado:
//   - passa quase reto (a maioria): o átomo é quase todo vazio;
//   - é desviada (algumas): passou perto de um núcleo positivo;
//   - volta (raríssimas): bateu quase de frente num núcleo.
//
// ATENÇÃO: as proporções são EXAGERADAS para dar para ver. No experimento real
// (Geiger e Marsden, 1909) cerca de 1 em cada 8000 partículas voltava.

export type AlphaFate = 'straight' | 'deflected' | 'back';

export interface ScatterOdds {
  deflected: number; // probabilidade de desviar
  back: number;      // probabilidade de voltar
}

export const DEFAULT_ODDS: ScatterOdds = { deflected: 0.08, back: 0.01 };

// Sorteia o destino e devolve a nova direção (vetor unitário) de uma partícula
// que vinha em +X. `rand` é injetável para dar para testar.
export function scatter(odds: ScatterOdds, rand: () => number = Math.random): { fate: AlphaFate; dir: [number, number, number] } {
  const u = rand();
  const azimuth = rand() * Math.PI * 2;
  let polar: number; // ângulo com o eixo +X
  let fate: AlphaFate;
  if (u < odds.back) {
    fate = 'back';
    polar = Math.PI * (0.6 + 0.4 * rand()); // 108° a 180°
  } else if (u < odds.back + odds.deflected) {
    fate = 'deflected';
    polar = (Math.PI / 180) * (10 + 70 * rand()); // 10° a 80°
  } else {
    fate = 'straight';
    polar = (Math.PI / 180) * 2 * rand(); // até 2°
  }
  return {
    fate,
    dir: [Math.cos(polar), Math.sin(polar) * Math.cos(azimuth), Math.sin(polar) * Math.sin(azimuth)],
  };
}
