// Construção 3D compartilhada pelo salão (hall.ts) e pelas salas (room.ts):
// chão, paredes, portas e placas, sempre a partir de uma MuseumLayout.

import * as THREE from 'three';
import {
  WALL_HEIGHT, DOOR_WIDTH, DOOR_HEIGHT,
  type MuseumLayout, type Vec2,
} from './layout';

const WALL_THICKNESS = 0.2;

type Disposable = THREE.BufferGeometry | THREE.Material | THREE.Texture;

// Guarda tudo o que foi criado para liberar de uma vez no fim.
export class Tracker {
  private items: Disposable[] = [];
  track<T extends Disposable>(x: T): T {
    this.items.push(x);
    return x;
  }
  dispose() {
    this.items.forEach((d) => d.dispose());
    this.items = [];
  }
}

export function textTexture(
  t: Tracker,
  text: string,
  color: number,
  opts: { w: number; h: number; maxFont: number; bar: boolean },
): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = opts.w;
  canvas.height = opts.h;
  const ctx = canvas.getContext('2d')!;
  ctx.fillStyle = '#14142a';
  ctx.fillRect(0, 0, opts.w, opts.h);
  const hex = `#${color.toString(16).padStart(6, '0')}`;
  if (opts.bar) {
    ctx.fillStyle = hex;
    ctx.fillRect(0, opts.h - 10, opts.w, 10);
  }
  // Diminui a fonte até o texto caber na largura
  let size = opts.maxFont;
  do {
    ctx.font = `bold ${size}px Inter, system-ui, sans-serif`;
    size -= 2;
  } while (ctx.measureText(text).width > opts.w - 40 && size > 12);
  ctx.fillStyle = opts.bar ? '#e0e0f0' : hex;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, opts.w / 2, opts.h / 2 - (opts.bar ? 4 : 0));
  const tex = t.track(new THREE.CanvasTexture(canvas));
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  return tex;
}

// Coloca um objeto rente à parede, `inset` metros para dentro da sala.
function placeOnWall(obj: THREE.Object3D, p: { x: number; z: number; rotationY: number }, normal: Vec2, y: number, inset: number) {
  obj.position.set(p.x + normal.x * inset, y, p.z + normal.z * inset);
  obj.rotation.y = p.rotationY;
}

export interface Shell {
  doorMaterials: Map<string, THREE.MeshStandardMaterial>;
}

// Chão + paredes + placas + portas da planta, adicionados em `group`.
export function buildShell(group: THREE.Group, layout: MuseumLayout, t: Tracker, wallHeight = WALL_HEIGHT): Shell {
  // ── Chão ──
  const floor = new THREE.Mesh(
    t.track(new THREE.PlaneGeometry(layout.width, layout.depth)),
    t.track(new THREE.MeshStandardMaterial({ color: 0x2b2b40, roughness: 0.9 })),
  );
  floor.rotation.x = -Math.PI / 2;
  group.add(floor);

  const gridSize = Math.max(layout.width, layout.depth);
  const grid = new THREE.GridHelper(gridSize, Math.round(gridSize), 0x44446a, 0x35355a);
  grid.position.y = 0.005;
  t.track(grid.geometry);
  t.track(grid.material as THREE.Material);
  group.add(grid);

  // ── Paredes ──
  const wallMat = t.track(new THREE.MeshStandardMaterial({ color: 0xe6e4ef, roughness: 0.85 }));
  const halfW = layout.width / 2;
  const halfD = layout.depth / 2;
  const walls: Array<[number, number, number, number]> = [
    // [largura em X, profundidade em Z, centro x, centro z]
    [WALL_THICKNESS, layout.depth, -halfW - WALL_THICKNESS / 2, 0],
    [WALL_THICKNESS, layout.depth,  halfW + WALL_THICKNESS / 2, 0],
    [layout.width + 2 * WALL_THICKNESS, WALL_THICKNESS, 0, -halfD - WALL_THICKNESS / 2],
    [layout.width + 2 * WALL_THICKNESS, WALL_THICKNESS, 0,  halfD + WALL_THICKNESS / 2],
  ];
  for (const [sx, sz, cx, cz] of walls) {
    const wall = new THREE.Mesh(t.track(new THREE.BoxGeometry(sx, wallHeight, sz)), wallMat);
    wall.position.set(cx, wallHeight / 2, cz);
    group.add(wall);
  }

  // ── Placas (uma por parede com categoria / nome do experimento) ──
  for (const sign of layout.signs) {
    const mesh = new THREE.Mesh(
      t.track(new THREE.PlaneGeometry(4.2, 0.7)),
      t.track(new THREE.MeshBasicMaterial({ map: textTexture(t, sign.text, sign.color, { w: 1024, h: 170, maxFont: 110, bar: false }) })),
    );
    placeOnWall(mesh, sign, sign.normal, wallHeight - 0.55, 0.02);
    group.add(mesh);
  }

  // ── Portas ──
  const frameMat = t.track(new THREE.MeshStandardMaterial({ color: 0x3a3a55, roughness: 0.6 }));
  const sideGeo = t.track(new THREE.BoxGeometry(0.12, DOOR_HEIGHT + 0.12, 0.16));
  const lintelGeo = t.track(new THREE.BoxGeometry(DOOR_WIDTH + 0.24, 0.12, 0.16));
  const panelGeo = t.track(new THREE.BoxGeometry(DOOR_WIDTH, DOOR_HEIGHT, 0.06));
  const knobGeo = t.track(new THREE.SphereGeometry(0.05, 12, 8));
  const labelGeo = t.track(new THREE.PlaneGeometry(2.2, 0.42));
  const doorMaterials = new Map<string, THREE.MeshStandardMaterial>();

  for (const door of layout.doors) {
    const doorGroup = new THREE.Group();
    placeOnWall(doorGroup, door, door.normal, 0, 0);
    group.add(doorGroup);

    const mat = t.track(new THREE.MeshStandardMaterial({
      color: door.color, roughness: 0.5, emissive: door.color, emissiveIntensity: 0,
    }));
    doorMaterials.set(door.id, mat);

    // Folha da porta (coordenadas locais: +Z aponta para dentro da sala)
    const panel = new THREE.Mesh(panelGeo, mat);
    panel.position.set(0, DOOR_HEIGHT / 2, 0.04);
    doorGroup.add(panel);

    // Batentes e verga
    for (const sx of [-1, 1]) {
      const post = new THREE.Mesh(sideGeo, frameMat);
      post.position.set(sx * (DOOR_WIDTH / 2 + 0.06), (DOOR_HEIGHT + 0.12) / 2, 0.08);
      doorGroup.add(post);
    }
    const lintel = new THREE.Mesh(lintelGeo, frameMat);
    lintel.position.set(0, DOOR_HEIGHT + 0.06, 0.08);
    doorGroup.add(lintel);

    // Maçaneta
    const knob = new THREE.Mesh(knobGeo, frameMat);
    knob.position.set(DOOR_WIDTH / 2 - 0.2, 1.0, 0.1);
    doorGroup.add(knob);

    // Plaquinha com o nome acima da porta
    const label = new THREE.Mesh(
      labelGeo,
      t.track(new THREE.MeshBasicMaterial({ map: textTexture(t, door.title, door.color, { w: 1024, h: 196, maxFont: 76, bar: true }) })),
    );
    label.position.set(0, DOOR_HEIGHT + 0.45, 0.03);
    doorGroup.add(label);
  }

  return { doorMaterials };
}

export function buildPedestal(group: THREE.Group, t: Tracker, x: number, z: number, radius: number, height: number) {
  const mat = t.track(new THREE.MeshStandardMaterial({ color: 0x3a3a55, roughness: 0.6 }));
  const base = new THREE.Mesh(t.track(new THREE.CylinderGeometry(radius, radius * 1.1, height, 32)), mat);
  base.position.set(x, height / 2, z);
  group.add(base);
}
