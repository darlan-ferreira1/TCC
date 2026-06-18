// Geometria molecular — VSEPR (Valence Shell Electron Pair Repulsion).
//
// `computeLigandPositions` recebe o tipo de geometria e o ângulo de ligação
// e devolve os vetores 3D (posições dos ligantes a distância bondLength do centro).
//
// Para cada geometria, a derivação matemática das posições:
//
// ANGULAR (ex: H₂O, 104,5°):
//   Bissetriz ao longo de +Y. Cada ligante a ±half do eixo Y no plano XY.
//   half = bondAngleDeg/2  →  dir = (±sin(half), cos(half), 0)
//
// PIRAMIDAL TRIGONAL (ex: NH₃, 107°):
//   Ligantes distribuídos 120° no plano XZ, afastados do eixo +Y pelo ângulo θ.
//   Condição: v1·v2 = cos(107°) com v1 e v2 a 120° de separação azimutal.
//   Resolvendo: sin²(θ) = 2(1 − cos(a))/3  →  derivação da fórmula abaixo.
//
// TETRAÉDRICA (109,47°):
//   Vértices do tetraedro regular: (±1, ±1, ±1)/√3 escolhidos de modo que
//   os sinais tenham sempre produto negativo entre qualquer par.
//
// Os demais tipos têm ângulos fixos pela geometria (octaédrica = 90° sempre, etc.).

export type GeometryType =
  | 'linear'
  | 'angular'
  | 'trigonal-planar'
  | 'trigonal-pyramidal'
  | 'tetrahedral'
  | 'trigonal-bipyramidal'
  | 'octahedral';

export interface Vec3 { x: number; y: number; z: number; }

export interface AtomDef {
  element: string;
  color:   number; // CPK hex
  radius:  number; // raio visual da esfera na cena
}

export interface MoleculeDefinition {
  id:           string;
  name:         string;
  formula:      string;
  centerAtom:   AtomDef;
  ligandAtom:   AtomDef;
  geometry:     GeometryType;
  geometryName: string;      // nome por extenso em português
  bondLength:   number;      // distância centro–ligante (unidades da cena)
  bondAngleDeg: number;      // ângulo de ligação principal (graus)
  lonePairs:    number;      // pares solitários no átomo central (contexto VSEPR)
  note:         string;      // detalhe extra exibido no painel
}

export function computeLigandPositions(
  geometry:     GeometryType,
  bondAngleDeg: number,
  bondLength:   number,
): Vec3[] {
  const a = bondAngleDeg * (Math.PI / 180);
  const L = bondLength;
  const r3 = Math.sqrt(3);

  switch (geometry) {
    case 'linear':
      return [
        { x:  L, y: 0, z: 0 },
        { x: -L, y: 0, z: 0 },
      ];

    case 'angular': {
      // Bissetriz ao longo de +Y; cada ligante a ±half da bissetriz no plano XY
      const half = a / 2;
      const s = Math.sin(half), c = Math.cos(half);
      return [
        { x:  L * s, y: L * c, z: 0 },
        { x: -L * s, y: L * c, z: 0 },
      ];
    }

    case 'trigonal-planar':
      return [0, 1, 2].map((i) => {
        const phi = (i * 2 * Math.PI) / 3;
        return { x: L * Math.cos(phi), y: 0, z: L * Math.sin(phi) };
      });

    case 'trigonal-pyramidal': {
      // Derivação: sin²θ = 2(1 − cos a)/3, onde θ é o ângulo entre cada
      // direção de ligação e o eixo −Y (pirâmide aponta para baixo).
      const sinT = Math.sqrt((2 * (1 - Math.cos(a))) / 3);
      const cosT = Math.sqrt(Math.max(0, 1 - sinT * sinT));
      return [0, 1, 2].map((i) => {
        const phi = (i * 2 * Math.PI) / 3;
        return {
          x:  L * sinT * Math.cos(phi),
          y: -L * cosT,
          z:  L * sinT * Math.sin(phi),
        };
      });
    }

    case 'tetrahedral': {
      // Vértices alternados do cubo unitário, normalizados por 1/√3
      const s = L / Math.sqrt(3);
      return [
        { x:  s, y:  s, z:  s },
        { x:  s, y: -s, z: -s },
        { x: -s, y:  s, z: -s },
        { x: -s, y: -s, z:  s },
      ];
    }

    case 'trigonal-bipyramidal':
      // 3 equatoriais (120° no plano XZ) + 2 axiais (±Y)
      return [
        { x:  L,           y: 0, z: 0          },
        { x: -L / 2,       y: 0, z:  L * r3 / 2 },
        { x: -L / 2,       y: 0, z: -L * r3 / 2 },
        { x:  0,           y:  L, z: 0          },
        { x:  0,           y: -L, z: 0          },
      ];

    case 'octahedral':
      return [
        { x:  L, y: 0, z: 0 }, { x: -L, y: 0,  z:  0 },
        { x: 0,  y: L, z: 0 }, { x:  0, y: -L, z:  0 },
        { x: 0,  y: 0, z: L }, { x:  0, y:  0, z: -L },
      ];
  }
}

// Cores CPK (convenção internacional) aproximadas para visualização em fundo escuro
const CPK: Record<string, AtomDef> = {
  H:  { element: 'H',  color: 0xdddddd, radius: 0.22 },
  C:  { element: 'C',  color: 0x555555, radius: 0.42 },
  N:  { element: 'N',  color: 0x3060f0, radius: 0.40 },
  O:  { element: 'O',  color: 0xe84040, radius: 0.38 },
  F:  { element: 'F',  color: 0x80d020, radius: 0.32 },
  S:  { element: 'S',  color: 0xe8d020, radius: 0.48 },
  P:  { element: 'P',  color: 0xf06000, radius: 0.46 },
  Cl: { element: 'Cl', color: 0x20d040, radius: 0.46 },
  B:  { element: 'B',  color: 0xffa070, radius: 0.38 },
};

export const MOLECULES: MoleculeDefinition[] = [
  {
    id: 'h2o', name: 'Água', formula: 'H₂O',
    centerAtom: CPK.O, ligandAtom: CPK.H,
    geometry: 'angular', geometryName: 'Angular',
    bondLength: 1.3, bondAngleDeg: 104.5, lonePairs: 2,
    note: '2 pares solitários comprimem o ângulo abaixo dos 109,5° do tetraedro ideal',
  },
  {
    id: 'ch4', name: 'Metano', formula: 'CH₄',
    centerAtom: CPK.C, ligandAtom: CPK.H,
    geometry: 'tetrahedral', geometryName: 'Tetraédrica',
    bondLength: 1.5, bondAngleDeg: 109.5, lonePairs: 0,
    note: '4 ligantes, sem pares solitários — ângulos perfeitos do tetraedro regular',
  },
  {
    id: 'co2', name: 'Dióxido de Carbono', formula: 'CO₂',
    centerAtom: CPK.C, ligandAtom: CPK.O,
    geometry: 'linear', geometryName: 'Linear',
    bondLength: 1.5, bondAngleDeg: 180, lonePairs: 0,
    note: 'Ligações duplas C=O; sem pares solitários no carbono → geometria linear',
  },
  {
    id: 'nh3', name: 'Amônia', formula: 'NH₃',
    centerAtom: CPK.N, ligandAtom: CPK.H,
    geometry: 'trigonal-pyramidal', geometryName: 'Piramidal Trigonal',
    bondLength: 1.35, bondAngleDeg: 107, lonePairs: 1,
    note: '1 par solitário comprime levemente o ângulo abaixo do tetrahedral (109,5°)',
  },
  {
    id: 'bf3', name: 'Trifluoreto de Boro', formula: 'BF₃',
    centerAtom: CPK.B, ligandAtom: CPK.F,
    geometry: 'trigonal-planar', geometryName: 'Planar Trigonal',
    bondLength: 1.4, bondAngleDeg: 120, lonePairs: 0,
    note: 'Molécula plana — B é deficiente em elétrons (somente 6 e⁻ na camada de valência)',
  },
  {
    id: 'pcl5', name: 'Pentacloreto de Fósforo', formula: 'PCl₅',
    centerAtom: CPK.P, ligandAtom: CPK.Cl,
    geometry: 'trigonal-bipyramidal', geometryName: 'Bipiramidal Trigonal',
    bondLength: 1.6, bondAngleDeg: 90, lonePairs: 0,
    note: 'Ângulos equatoriais 120°, axial-equatorial 90° — dois tipos de ligação não equivalentes',
  },
  {
    id: 'sf6', name: 'Hexafluoreto de Enxofre', formula: 'SF₆',
    centerAtom: CPK.S, ligandAtom: CPK.F,
    geometry: 'octahedral', geometryName: 'Octaédrica',
    bondLength: 1.5, bondAngleDeg: 90, lonePairs: 0,
    note: 'Todos os 6 ângulos de 90° — geometria de mais alta simetria (Oh)',
  },
];
