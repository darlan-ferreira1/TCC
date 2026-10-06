// Dupla Hélice de DNA em realidade aumentada. Ver ar/definition.ts e README.md.
//
// Conteúdo: o mesmo `dnaHelix` montável da página e do Museu Virtual.
// Controles: os mesmos da sala interativa (pares de base + rotação).
// Tamanho inicial: escala 0,08 → com 20 pares a hélice tem ~54 cm de altura e
// ~24 cm de diâmetro; o centro fica 30 cm acima da superfície, então ela
// "nasce" apoiada na mesa/chão. A pinça vai de 20% a 500%.

import type { ARDefinition } from '../../../ar/definition';
import { dnaHelix, type DnaSceneConfig } from '../DnaHelix/scene';
import { sala } from '../DnaHelix/sala';

export const ar: ARDefinition<DnaSceneConfig> = {
  experiment: dnaHelix,
  controls: sala.controls,
  toConfig: sala.toConfig,
  scale: 0.08,
  lift: 0.3,
  previewDistance: 1.3,
};
