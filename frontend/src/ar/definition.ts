// Como um experimento montável aparece em realidade aumentada.
//
// Cada experimento com AR tem um `ar.ts` na pasta da sua variante AR
// (ex.: chemistry/arBohrModel/ar.ts) exportando `ar: ARDefinition`. O arquivo
// só declara números de apresentação (tamanho em metros, altura acima da
// superfície); o conteúdo vem do `mount` do scene.ts e os controles vêm da
// sala interativa (sala.ts), sem duplicar nada.

import type { ControlDef, ControlValues } from '../core/controls';
import type { MountableExperiment, MountedExperiment } from '../core/mountable';

export interface ARDefinition<Config = unknown, Mounted extends MountedExperiment<Config> = MountedExperiment<Config>> {
  experiment: MountableExperiment<Config, Mounted>;
  controls: ControlDef[];
  toConfig(values: ControlValues): Config;
  scale: number;           // unidades do experimento → metros, no tamanho inicial
  lift: number;            // m — altura da origem do experimento acima da superfície
  previewDistance: number; // m — distância da câmera na prévia (fora da sessão AR)
}
