// "Fases" do Museu Virtual: o salão principal e as salas interativas.
//
// As duas implementam a mesma interface `Level`, então scene.ts trata as duas
// do mesmo jeito (movimento, colisão, portas, interações). Trocar de fase =
// esconder/descartar o grupo de uma e mostrar o da outra, no MESMO renderer e
// na MESMA cena — por isso uma futura sessão VR não é interrompida (opção 2 do
// ARQUITETURA.md, seção 22: troca de fase com transição).

import * as THREE from 'three';
import type { ControlValues } from '../core/controls';
import type { InteractiveRoom, RoomInteraction } from './interactiveRoom';
import { buildPedestal, buildShell, Tracker } from './builders';
import { computeLayout, computeRoomLayout, type DoorEntry, type MuseumLayout, type Obstacle } from './layout';

export interface Level {
  group: THREE.Group;
  layout: MuseumLayout;
  doorMaterials: Map<string, THREE.MeshStandardMaterial>;
  interactions: RoomInteraction[];
  tick(dt: number): void;
  setControls(values: ControlValues): void;
  dispose(): void;
}

export function buildHall(entries: DoorEntry[]): Level {
  const t = new Tracker();
  const layout = computeLayout(entries);
  const group = new THREE.Group();
  const { doorMaterials } = buildShell(group, layout, t);

  // Pedestal central com uma peça girando
  const [pedestal] = layout.obstacles;
  buildPedestal(group, t, pedestal.x, pedestal.z, pedestal.r, 1.0);
  const sculpture = new THREE.Mesh(
    t.track(new THREE.TorusKnotGeometry(0.35, 0.11, 128, 16)),
    t.track(new THREE.MeshStandardMaterial({ color: 0x9b59b6, emissive: 0x9b59b6, emissiveIntensity: 0.35, metalness: 0.3, roughness: 0.3 })),
  );
  sculpture.position.set(pedestal.x, 1.65, pedestal.z);
  group.add(sculpture);

  return {
    group,
    layout,
    doorMaterials,
    interactions: [],
    tick(dt) {
      sculpture.rotation.y += dt * 0.6;
      sculpture.rotation.x += dt * 0.25;
    },
    setControls() { /* o salão não tem controles */ },
    dispose() { t.dispose(); },
  };
}

export function buildRoom(def: InteractiveRoom, title: string, color: number, values: ControlValues): Level {
  const t = new Tracker();
  const spec = def.room;
  const [px, py, pz] = spec.place;

  const obstacles: Obstacle[] = [];
  const blockRadius = spec.pedestal?.radius ?? spec.obstacleRadius;
  if (blockRadius) obstacles.push({ x: px, z: pz, r: blockRadius });

  const layout = computeRoomLayout({ width: spec.width, depth: spec.depth, obstacles }, title, color);
  const group = new THREE.Group();
  const { doorMaterials } = buildShell(group, layout, t, spec.wallHeight);
  if (spec.pedestal) buildPedestal(group, t, px, pz, spec.pedestal.radius, spec.pedestal.height);

  // O experimento é montado num grupo próprio, posicionado e escalado pela sala.
  const root = new THREE.Group();
  root.position.set(px, py, pz);
  root.scale.setScalar(spec.scale ?? 1);
  group.add(root);

  const mounted = def.experiment.mount({ root }, def.toConfig(values));
  const interactions = def.interactions?.(mounted, root) ?? [];

  return {
    group,
    layout,
    doorMaterials,
    interactions,
    tick(dt) {
      mounted.tick(dt);
      if (spec.spin) root.rotation.y += spec.spin * dt;
    },
    setControls(v) { mounted.update(def.toConfig(v)); },
    dispose() {
      mounted.dispose();
      t.dispose();
    },
  };
}
