// Contrato da "sala interativa" de um experimento (Museu Virtual).
//
// Um experimento ganha uma sala interativa quando a pasta dele tem um `sala.ts`
// exportando `sala: InteractiveRoom`. O museu descobre esses arquivos sozinho
// (import.meta.glob em museum/index.tsx): a porta de quem tem `sala.ts`
// leva para a sala; a de quem não tem abre a página normal.
//
// O `sala.ts` NÃO recria o experimento — ele reaproveita o `mount` do
// scene.ts (contrato montável, core/mountable.ts) e declara só as regras do
// mundo 3D, em camadas (opção D do ARQUITETURA.md, seção 22):
//   - camada A (obrigatória): `controls` + `toConfig` → o HUD de ajustes é
//     gerado automaticamente a partir desses dados;
//   - camada B (opcional): `interactions` → interações diretas com objetos
//     do mundo (ex.: pegar a massa do pêndulo e soltar).

import type * as THREE from 'three';
import type { ControlDef, ControlValues } from '../core/controls';
import type { MountableExperiment, MountedExperiment } from '../core/mountable';

export interface RoomSpec {
  width: number;          // m (X)
  depth: number;          // m (Z)
  wallHeight?: number;    // m (padrão: WALL_HEIGHT do layout)
  place: [number, number, number]; // onde fica a origem do experimento na sala
  scale?: number;         // unidades do experimento → metros (padrão 1)
  spin?: number;          // giro automático do experimento em Y (rad/s)
  pedestal?: { radius: number; height: number }; // desenha pedestal e bloqueia a passagem
  obstacleRadius?: number; // só bloqueia a passagem (sem pedestal)
}

// Interação direta (camada B). O museu chama estes métodos com o raio que sai
// do centro da tela (a mira) — venha a entrada do mouse, do toque ou, no
// futuro, de um controle VR.
export interface RoomInteraction {
  prompt: string;                   // texto do aviso, ex.: "pegar a massa"
  isTarget(ray: THREE.Ray): boolean; // a mira está sobre o objeto?
  press(ray: THREE.Ray): void;      // começou a segurar
  drag(ray: THREE.Ray): void;       // segurando (chamado a cada frame)
  release(): void;                  // soltou
}

export interface InteractiveRoom<Config = unknown, Mounted extends MountedExperiment<Config> = MountedExperiment<Config>> {
  experiment: MountableExperiment<Config, Mounted>;
  room: RoomSpec;
  controls: ControlDef[];
  toConfig(values: ControlValues): Config;
  interactions?(mounted: Mounted, root: THREE.Group): RoomInteraction[];
}
