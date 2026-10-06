// Modelo de Bohr em realidade aumentada. Ver ar/definition.ts e README.md.
//
// Conteúdo: o mesmo `bohrModel` montável da página e do Museu Virtual.
// Controles: os mesmos da sala interativa (elemento + velocidade).
// Tamanho inicial: escala 0,04 → camada 1 com 8 cm e camada 2 com 32 cm de
// raio, flutuando 35 cm acima da superfície — cabe numa mesa. A pinça vai de
// 20% a 500% desse tamanho.

import type { ARDefinition } from '../../../ar/definition';
import { bohrModel, type BohrSceneConfig } from '../BohrModel/scene';
import { sala } from '../BohrModel/sala';

export const ar: ARDefinition<BohrSceneConfig> = {
  experiment: bohrModel,
  controls: sala.controls,
  toConfig: sala.toConfig,
  scale: 0.04,
  lift: 0.35,
  previewDistance: 1.4,
};
