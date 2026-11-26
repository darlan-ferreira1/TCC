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
import { addSpotlight, buildEasel, buildEnunciadoPanel, buildInfoIcon, buildPedestal, buildShell, enableShadows, Tracker } from './builders';
import type { InfoContent, RoomContent } from './info';
import { computeLayout, computeRoomLayout, computeWingLayout, EXHIBIT_RADIUS, WALL_HEIGHT, type DoorEntry, type MuseumLayout, type Obstacle } from './layout';

export interface Level {
  group: THREE.Group;
  layout: MuseumLayout;
  doorMaterials: Map<string, THREE.MeshStandardMaterial>;
  interactions: RoomInteraction[];
  tick(dt: number): void;
  setControls(values: ControlValues): void;
  dispose(): void;
  // Só nas salas: o experimento e para onde olhar no modo "inspecionar".
  inspect?: { root: THREE.Group; target: THREE.Vector3; distance: number };
}

export type OpenInfo = (content: InfoContent) => void;

const INFO_REACH = 5; // m — distância máxima para ler um "i" ou quadro

// Interação de "apertar para ler": a mira sobre `obj` abre o pop-up.
function infoInteraction(obj: THREE.Object3D, content: InfoContent, openInfo: OpenInfo, radius: number): RoomInteraction {
  const p = new THREE.Vector3();
  return {
    prompt: `ler: ${content.title}`,
    hold: false,
    isTarget(ray) {
      obj.getWorldPosition(p);
      return ray.distanceToPoint(p) < radius && ray.origin.distanceTo(p) < INFO_REACH;
    },
    press() { openInfo(content); },
    drag() { /* nada */ },
    release() { /* nada */ },
  };
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
  addSpotlight(group, t, pedestal.x, 1.2, pedestal.z, WALL_HEIGHT, 40);
  enableShadows(group);

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

// Peça decorativa no pedestal central de uma ala: monta os objetos em `group`
// (já posicionado no topo do pedestal) e devolve a animação.
export type Centerpiece = (group: THREE.Group, t: Tracker) => (dt: number) => void;

// Ala temática: um salão menor, com as portas das salas de um tema e a porta
// de volta ao salão principal. Mesma interface Level do salão e das salas.
export interface WingExtras {
  miniatures?: Record<string, Centerpiece>;    // id da porta → miniatura no pedestal
  content?: Record<string, RoomContent>;       // id da porta → textos
  openInfo?: OpenInfo;
  noExit?: boolean;
}

export function buildWing(entries: DoorEntry[], title: string, color: number, centerpiece?: Centerpiece, extras: WingExtras = {}): Level {
  const t = new Tracker();
  const layout = computeWingLayout(entries, title, color, extras.noExit);
  const group = new THREE.Group();
  const { doorMaterials } = buildShell(group, layout, t);
  const interactions: RoomInteraction[] = [];
  const animations: ((dt: number) => void)[] = [];

  // Pedestais ao lado das portas: miniatura da sala + "i" com o resumo.
  for (const ex of layout.exhibits ?? []) {
    const h = 1.0;
    buildPedestal(group, t, ex.x, ex.z, EXHIBIT_RADIUS, h);
    addSpotlight(group, t, ex.x, h, ex.z, WALL_HEIGHT, 18);
    const mini = extras.miniatures?.[ex.doorId];
    if (mini) {
      const top = new THREE.Group();
      top.position.set(ex.x, h, ex.z);
      top.rotation.y = Math.atan2(ex.normal.x, ex.normal.z);
      group.add(top);
      animations.push(mini(top, t));
    }
    const resumo = extras.content?.[ex.doorId]?.resumo;
    if (resumo && extras.openInfo) {
      const icon = buildInfoIcon(t, color);
      icon.position.set(ex.x + ex.normal.x * 0.35, 0.75, ex.z + ex.normal.z * 0.35);
      group.add(icon);
      interactions.push(infoInteraction(icon, resumo, extras.openInfo, 0.3));
    }
  }

  const [pedestal] = layout.obstacles;
  buildPedestal(group, t, pedestal.x, pedestal.z, pedestal.r, 1.0);
  const top = new THREE.Group();
  top.position.set(pedestal.x, 1.0, pedestal.z);
  group.add(top);
  const animate = centerpiece?.(top, t);
  addSpotlight(group, t, pedestal.x, 1.4, pedestal.z, WALL_HEIGHT, 40);
  enableShadows(group);

  return {
    group,
    layout,
    doorMaterials,
    interactions,
    tick(dt) {
      animate?.(dt);
      animations.forEach((a) => a(dt));
    },
    setControls() { /* a ala não tem controles */ },
    dispose() { t.dispose(); },
  };
}

export function buildRoom(
  def: InteractiveRoom, title: string, color: number, values: ControlValues,
  exitTitle?: string, content?: RoomContent, openInfo?: OpenInfo,
): Level {
  const t = new Tracker();
  const spec = def.room;
  const [px, py, pz] = spec.place;

  const obstacles: Obstacle[] = [];
  const blockRadius = spec.pedestal?.radius ?? spec.obstacleRadius;
  if (blockRadius) obstacles.push({ x: px, z: pz, r: blockRadius });

  // Quadros (Teoria, História…) em cavaletes dos dois lados de quem entra,
  // virados para o ponto de entrada.
  const easelSpots = [-1, 1].map((side) => ({ x: side * Math.min(2.6, spec.width / 2 - 1), z: spec.depth / 2 - 3 }));
  const quadros = content && openInfo ? content.quadros.slice(0, easelSpots.length) : [];
  quadros.forEach((_, i) => obstacles.push({ ...easelSpots[i], r: 0.45 }));

  const layout = computeRoomLayout({ width: spec.width, depth: spec.depth, obstacles }, title, color, exitTitle, spec.exerciseDoor, spec.nextExerciseDoor, spec.prevExerciseDoor);
  const group = new THREE.Group();
  const { doorMaterials } = buildShell(group, layout, t, spec.wallHeight);
  if (spec.pedestal) buildPedestal(group, t, px, pz, spec.pedestal.radius, spec.pedestal.height);

  // O experimento é montado num grupo próprio, posicionado e escalado pela sala.
  const root = new THREE.Group();
  root.position.set(px, py, pz);
  root.scale.setScalar(spec.scale ?? 1);
  group.add(root);

  const mounted = def.experiment.mount({ root }, def.toConfig(values));
  const interactions = [...(def.interactions?.(mounted, root) ?? [])];

  const entry = { x: 0, z: spec.depth / 2 - 2 }; // onde o visitante aparece
  quadros.forEach((q, i) => {
    const spot = easelSpots[i];
    const easel = buildEasel(t, q.title, color);
    easel.position.set(spot.x, 0, spot.z);
    easel.rotation.y = Math.atan2(entry.x - spot.x, entry.z - spot.z);
    group.add(easel);
    interactions.push(infoInteraction(easel.children[0], q, openInfo!, 0.6));
  });

  if (content && openInfo) {
    const [ix, iy, iz] = spec.infoAt ?? [px + 1.5, 1.6, pz + 2];
    const icon = buildInfoIcon(t, color);
    icon.position.set(ix, iy, iz);
    group.add(icon);
    interactions.push(infoInteraction(icon, content.observar, openInfo, 0.3));
  }

  if (def.enunciado) {
    const panel = buildEnunciadoPanel(t, def.enunciado.heading, def.enunciado.text, color);
    panel.position.set(0, 2.3, -spec.depth / 2 + 0.04);
    group.add(panel);
  }

  const [tx, ty, tz] = spec.inspect?.target ?? spec.place;
  // Spot de galeria sobre o experimento (mira no pedestal ou no centro do fenômeno).
  const spotY = Math.min(ty, 1.2);
  const ceilingY = spec.wallHeight ?? WALL_HEIGHT;
  // Intensidade cresce com o quadrado da distância: salas altas (Foucault) recebem a mesma luz.
  addSpotlight(group, t, tx, spotY, tz, ceilingY, 5 * (ceilingY - spotY) ** 2);
  enableShadows(group);

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
    inspect: { root, target: new THREE.Vector3(tx, ty, tz), distance: spec.inspect?.distance ?? 5 },
  };
}
