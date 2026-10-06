// Planta do museu — matemática pura, sem dependência do Three.js nem do React.
//
// Recebe a lista de experimentos e devolve onde fica cada porta, o tamanho da
// sala, as placas de categoria e o ponto de nascimento do jogador. Também traz
// as regras de movimento (colisão com paredes e obstáculos) e a detecção da
// porta mais próxima. É o "physics.ts" do Museu Virtual.
//
// Sistema de coordenadas (metros, visto de cima):
//
//               parede "far" (z = −D/2)
//          ┌──────────────────────────────┐
//          │  [porta] [porta] [porta]     │
//  parede  │                              │  parede
//  "left"  │            (pedestal)        │  "right"
//  x=−W/2  │                              │  x=+W/2
//          │              ▲ jogador       │
//          └──────────────────────────────┘
//               parede "near" (z = +D/2)
//
// Cada categoria (Física, Química, Biologia…) ocupa uma parede, na ordem
// left → far → right → near. Uma nova entrada no registry.ts vira uma nova
// porta sem nenhuma mudança aqui: a sala cresce para caber as portas.

export interface DoorEntry {
  id: string;
  title: string;
  category: string;
  color: number; // cor da categoria (hex)
}

export type Wall = 'left' | 'far' | 'right' | 'near';

export interface Vec2 { x: number; z: number; }

export interface DoorPlacement extends DoorEntry {
  wall: Wall;
  x: number;         // centro da porta, na superfície da parede
  z: number;
  rotationY: number; // rotação para a face da porta apontar para dentro da sala
  normal: Vec2;      // vetor unitário apontando para dentro da sala
}

export interface WallSign {
  text: string;
  color: number;
  x: number;
  z: number;
  rotationY: number;
  normal: Vec2;
}

export interface Obstacle extends Vec2 { r: number; }

export interface MuseumLayout {
  width: number;  // extensão em X
  depth: number;  // extensão em Z
  doors: DoorPlacement[];
  signs: WallSign[];
  obstacles: Obstacle[];
}

export interface SpawnPoint extends Vec2 {
  lookX: number;
  lookZ: number;
}

export const EYE_HEIGHT    = 1.6;  // altura dos olhos (m)
export const WALL_HEIGHT   = 4.2;
export const DOOR_WIDTH    = 1.6;
export const DOOR_HEIGHT   = 2.6;
export const DOOR_SPACING  = 3.6;  // distância entre centros de portas vizinhas
export const PLAYER_RADIUS = 0.35; // "corpo" do jogador para colisão
export const ENTER_DISTANCE = 1.8; // a partir desta distância a porta pode ser aberta

const WALL_MARGIN    = 3;   // espaço livre nas pontas de cada parede
const MIN_WALL_DOORS = 2;   // a sala nunca fica mais estreita que 2 portas
const PEDESTAL: Obstacle = { x: 0, z: 0, r: 0.8 };
const WALL_ORDER: Wall[] = ['left', 'far', 'right', 'near'];

// Rotação e normal de cada parede. Um plano do Three.js nasce olhando para +Z;
// girar em Y faz a face apontar para dentro da sala.
const WALL_GEOMETRY: Record<Wall, { rotationY: number; normal: Vec2 }> = {
  left:  { rotationY:  Math.PI / 2, normal: { x:  1, z:  0 } },
  far:   { rotationY:  0,           normal: { x:  0, z:  1 } },
  right: { rotationY: -Math.PI / 2, normal: { x: -1, z:  0 } },
  near:  { rotationY:  Math.PI,     normal: { x:  0, z: -1 } },
};

function wallLength(doorCount: number): number {
  return Math.max(doorCount, MIN_WALL_DOORS) * DOOR_SPACING + 2 * WALL_MARGIN;
}

// Ponto da parede `wall` deslocado `t` metros ao longo dela (t = 0 é o meio).
// O sentido de `t` é da esquerda para a direita de quem olha para a parede.
function pointOnWall(wall: Wall, t: number, width: number, depth: number): Vec2 {
  switch (wall) {
    case 'left':  return { x: -width / 2, z: -t };
    case 'far':   return { x: t,          z: -depth / 2 };
    case 'right': return { x: width / 2,  z: t };
    case 'near':  return { x: -t,         z: depth / 2 };
  }
}

export function computeLayout(entries: DoorEntry[]): MuseumLayout {
  // Agrupa por categoria preservando a ordem do registry.
  const groups = new Map<string, DoorEntry[]>();
  for (const e of entries) {
    if (!groups.has(e.category)) groups.set(e.category, []);
    groups.get(e.category)!.push(e);
  }
  const categories = [...groups.keys()].slice(0, WALL_ORDER.length);
  const countOn = (wall: Wall) => {
    const cat = categories[WALL_ORDER.indexOf(wall)];
    return cat ? groups.get(cat)!.length : 0;
  };

  const width = Math.max(wallLength(countOn('far')), wallLength(countOn('near')));
  const depth = Math.max(wallLength(countOn('left')), wallLength(countOn('right')));

  const doors: DoorPlacement[] = [];
  const signs: WallSign[] = [];

  categories.forEach((category, i) => {
    const wall = WALL_ORDER[i];
    const list = groups.get(category)!;
    const { rotationY, normal } = WALL_GEOMETRY[wall];

    list.forEach((entry, j) => {
      const t = (j - (list.length - 1) / 2) * DOOR_SPACING;
      doors.push({ ...entry, wall, ...pointOnWall(wall, t, width, depth), rotationY, normal });
    });

    signs.push({ text: category, color: list[0].color, ...pointOnWall(wall, 0, width, depth), rotationY, normal });
  });

  return { width, depth, doors, signs, obstacles: [PEDESTAL] };
}

// Onde o jogador aparece. Sem porta: perto da parede "near", olhando para o
// fundo da sala. Com porta (voltando de um experimento): na frente dela,
// olhando para dentro da sala, como quem acabou de sair por ela.
export function spawnPoint(layout: MuseumLayout, doorId?: string): SpawnPoint {
  const door = doorId ? layout.doors.find((d) => d.id === doorId) : undefined;
  if (door) {
    const x = door.x + door.normal.x * 2.2;
    const z = door.z + door.normal.z * 2.2;
    return { x, z, lookX: x + door.normal.x, lookZ: z + door.normal.z };
  }
  const z = layout.depth / 2 - 2;
  return { x: 0, z, lookX: 0, lookZ: -layout.depth / 2 };
}

// Colisão: mantém o círculo do jogador dentro da sala e fora dos obstáculos.
export function constrainPosition(p: Vec2, layout: MuseumLayout, radius = PLAYER_RADIUS): Vec2 {
  let x = Math.min(Math.max(p.x, -layout.width / 2 + radius), layout.width / 2 - radius);
  let z = Math.min(Math.max(p.z, -layout.depth / 2 + radius), layout.depth / 2 - radius);

  for (const o of layout.obstacles) {
    const dx = x - o.x;
    const dz = z - o.z;
    const dist = Math.hypot(dx, dz);
    const minDist = o.r + radius;
    if (dist < minDist && dist > 1e-6) {
      // empurra para fora, na direção radial
      x = o.x + (dx / dist) * minDist;
      z = o.z + (dz / dist) * minDist;
    }
  }
  return { x, z };
}

export function nearestDoor(p: Vec2, layout: MuseumLayout, maxDistance = ENTER_DISTANCE): DoorPlacement | null {
  let best: DoorPlacement | null = null;
  let bestDist = maxDistance;
  for (const d of layout.doors) {
    const dist = Math.hypot(p.x - d.x, p.z - d.z);
    if (dist < bestDist) {
      best = d;
      bestDist = dist;
    }
  }
  return best;
}

// ── Salas interativas (sala interativa) ──
//
// Uma sala é uma planta pequena com uma única porta — a de saída, no meio da
// parede "near" — e uma placa com o nome do experimento na parede do fundo.
// Reaproveita os mesmos tipos e regras do salão (spawnPoint, constrainPosition,
// nearestDoor), então colisão e portas funcionam igual nos dois lugares.

export const EXIT_DOOR_ID = 'exit';

export function computeRoomLayout(
  spec: { width: number; depth: number; obstacles: Obstacle[] },
  title: string,
  color: number,
): MuseumLayout {
  const { width, depth } = spec;
  const exit: DoorPlacement = {
    id: EXIT_DOOR_ID,
    title: 'Voltar ao museu',
    category: '',
    color: 0x8888aa,
    wall: 'near',
    ...pointOnWall('near', 0, width, depth),
    ...WALL_GEOMETRY.near,
  };
  const sign: WallSign = { text: title, color, ...pointOnWall('far', 0, width, depth), ...WALL_GEOMETRY.far };
  return { width, depth, doors: [exit], signs: [sign], obstacles: spec.obstacles };
}
