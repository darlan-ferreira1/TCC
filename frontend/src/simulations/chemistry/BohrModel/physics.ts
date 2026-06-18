// Modelo atômico de Bohr
//
// Cada camada n (1-indexed) tem raio proporcional a n² (em unidades arbitrárias de cena):
//   r_n = BASE_RADIUS * n²
//
// Velocidade angular de cada camada segue a lei de Bohr:
//   ω_n = ω₁ / n³
// Elétrons da camada 1 são os mais rápidos; camadas externas giram mais devagar.
//
// Posição do elétron i na camada n no instante t:
//   x = r_n * cos(ω_n * t + φᵢ)
//   y = 0                          (órbita no plano XZ — inclinação vem da cena)
//   z = r_n * sin(ω_n * t + φᵢ)
//
// φᵢ = fase inicial = (2π / count) * i  (elétrons igualmente espaçados)

export interface ElectronState {
  x: number;
  z: number;
  shellIndex: number; // 0-indexed
}

export interface BohrPhysicsConfig {
  // Distribuição eletrônica por camada (ex: [2, 8, 1] = sódio)
  shells: number[];
  // Raio base da primeira camada (unidades de cena)
  baseRadius: number;
  // Velocidade angular da camada 1 (rad/s simulado)
  baseOmega: number;
}

export function shellRadius(shellIndex: number, baseRadius: number): number {
  const n = shellIndex + 1; // camadas são 1-indexed na física
  return baseRadius * n * n;
}

export function shellOmega(shellIndex: number, baseOmega: number): number {
  const n = shellIndex + 1;
  return baseOmega / (n * n * n);
}

// Calcula o ângulo inicial de cada elétron na camada (fase uniforme)
export function initialPhases(count: number): number[] {
  return Array.from({ length: count }, (_, i) => (2 * Math.PI * i) / count);
}

// Calcula posição XZ de todos os elétrons em função do tempo
export function computeElectronPositions(
  config: BohrPhysicsConfig,
  t: number
): ElectronState[] {
  const result: ElectronState[] = [];

  config.shells.forEach((count, shellIndex) => {
    const r = shellRadius(shellIndex, config.baseRadius);
    const omega = shellOmega(shellIndex, config.baseOmega);
    const phases = initialPhases(count);

    for (let i = 0; i < count; i++) {
      const angle = omega * t + phases[i];
      result.push({
        x: r * Math.cos(angle),
        z: r * Math.sin(angle),
        shellIndex,
      });
    }
  });

  return result;
}
