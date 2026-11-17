// Dupla hélice parametrizada por seno/cosseno.
//
// Strand 1: ângulo = i * angularStep
// Strand 2: ângulo = i * angularStep + π  (defasagem de 180°)
//
// Geometria baseada no DNA-B real:
//   - 10 pares de base por volta completa  → angularStep = 2π/10 = 36°/bp
//   - subida de 0.34 unidades por par de base (escala da cena)
//   - raio de 1.5 unidades (distância do eixo ao núcleotídeo)
//
// A posição y é centralizada para que a hélice fique no meio da cena.

export interface Vec3 {
  x: number;
  y: number;
  z: number;
}

export interface DnaGeometry {
  strand1: Vec3[]; // posições dos nucleotídeos da fita 1
  strand2: Vec3[]; // posições dos nucleotídeos da fita 2 (defasados em π)
}

const RADIUS       = 1.5;
const RISE_PER_BP  = 0.34; // rise por par de base (unidades da cena)
const BP_PER_TURN  = 10;   // pares de base por volta completa (DNA-B real)

export function computeDnaHelix(basePairs: number): DnaGeometry {
  const angularStep = (2 * Math.PI) / BP_PER_TURN;
  const totalHeight = basePairs * RISE_PER_BP;
  const yOffset = -totalHeight / 2; // centraliza verticalmente

  const strand1: Vec3[] = [];
  const strand2: Vec3[] = [];

  for (let i = 0; i < basePairs; i++) {
    const angle = i * angularStep;
    const y = yOffset + i * RISE_PER_BP;

    strand1.push({
      x: RADIUS * Math.cos(angle),
      y,
      z: RADIUS * Math.sin(angle),
    });

    // Fita 2 defasada em 180° no mesmo plano XZ
    strand2.push({
      x: RADIUS * Math.cos(angle + Math.PI),
      y,
      z: RADIUS * Math.sin(angle + Math.PI),
    });
  }

  return { strand1, strand2 };
}
