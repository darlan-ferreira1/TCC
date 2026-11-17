// Tabela dos 20 primeiros elementos — fonte ÚNICA para todas as variantes do
// Modelo de Bohr (página, VR, AR e sala interativa do Museu Virtual).
// Antes estava copiada em BohrModel/index.tsx, xrBhorModel/scene.ts e
// arBohrModel/scene.ts (débito D3 do ARQUITETURA.md).
//
// Formato: [símbolo, nome, prótons (Z), nêutrons, distribuição eletrônica]

export type ElementRow = [string, string, number, number, number[]];

export const ELEMENTS: ElementRow[] = [
  ['H',  'Hidrogênio',  1,  0,  [1]],
  ['He', 'Hélio',       2,  2,  [2]],
  ['Li', 'Lítio',       3,  4,  [2, 1]],
  ['Be', 'Berílio',     4,  5,  [2, 2]],
  ['B',  'Boro',        5,  6,  [2, 3]],
  ['C',  'Carbono',     6,  6,  [2, 4]],
  ['N',  'Nitrogênio',  7,  7,  [2, 5]],
  ['O',  'Oxigênio',    8,  8,  [2, 6]],
  ['F',  'Flúor',       9,  10, [2, 7]],
  ['Ne', 'Neônio',      10, 10, [2, 8]],
  ['Na', 'Sódio',       11, 12, [2, 8, 1]],
  ['Mg', 'Magnésio',    12, 12, [2, 8, 2]],
  ['Al', 'Alumínio',    13, 14, [2, 8, 3]],
  ['Si', 'Silício',     14, 14, [2, 8, 4]],
  ['P',  'Fósforo',     15, 16, [2, 8, 5]],
  ['S',  'Enxofre',     16, 16, [2, 8, 6]],
  ['Cl', 'Cloro',       17, 18, [2, 8, 7]],
  ['Ar', 'Argônio',     18, 22, [2, 8, 8]],
  ['K',  'Potássio',    19, 20, [2, 8, 8, 1]],
  ['Ca', 'Cálcio',      20, 20, [2, 8, 8, 2]],
];
