// Geometria Molecular em realidade aumentada. Ver ar/definition.ts e README.md.
//
// Variante NOVA (06/10/2026): a Geometria Molecular não tinha AR. Ganhou sem
// nenhuma linha nova de cena — só esta definição — porque já era montável.
// Conteúdo: o mesmo `molecularGeometry` da página e do Museu Virtual.
// Controles: os mesmos da sala interativa (seleção da molécula).
// Tamanho inicial: escala 0,08 → a maior molécula (SF₆/PCl₅) com ~34 cm de
// diâmetro, centro 20 cm acima da superfície.

import type { ARDefinition } from '../../../ar/definition';
import { molecularGeometry, type MolSceneConfig } from '../MolecularGeometry/scene';
import { sala } from '../MolecularGeometry/sala';

export const ar: ARDefinition<MolSceneConfig> = {
  experiment: molecularGeometry,
  controls: sala.controls,
  toConfig: sala.toConfig,
  scale: 0.08,
  lift: 0.2,
  previewDistance: 0.8,
};
