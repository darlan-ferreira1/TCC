// Construção 3D compartilhada pelo salão (hall.ts) e pelas salas (room.ts):
// chão, paredes, portas e placas, sempre a partir de uma MuseumLayout.

import * as THREE from 'three';
import {
  WALL_HEIGHT, DOOR_WIDTH, DOOR_HEIGHT,
  type MuseumLayout, type Vec2,
} from './layout';

const WALL_THICKNESS = 0.2;

// Fundo e texto dos quadros, placas e enunciados (tom de lousa, combina com a madeira).
const BOARD_BG = '#22262e';
const BOARD_TEXT = '#d9dde6';

type Disposable = { dispose(): void };

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
  ctx.fillStyle = BOARD_BG;
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
  ctx.fillStyle = opts.bar ? '#f3ead8' : hex;
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

// ── Materiais procedurais (desenhados por código, sem imagens externas) ──

// Piso de tacos de madeira: faixas de tons quentes com veios finos.
function woodFloorTexture(t: Tracker, width: number, depth: number): THREE.CanvasTexture {
  const S = 512;
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = S;
  const ctx = canvas.getContext('2d')!;
  const tones = ['#9a7250', '#916a49', '#a07854', '#8d6646', '#97704e', '#936c4b'];
  const rows = 16;           // 16 tábuas por ladrilho de textura (4 m) → 25 cm cada
  const h = S / rows;
  const plank = S / 3;       // comprimento da tábua: 1/3 do ladrilho (≈ 1,3 m)
  let seed = 7;
  const rand = () => { seed = (seed * 16807) % 2147483647; return seed / 2147483647; };
  ctx.fillStyle = tones[0];
  ctx.fillRect(0, 0, S, S);
  for (let r = 0; r < rows; r++) {
    // Cada fileira tem as emendas deslocadas, como num assoalho de verdade.
    // As tábuas cobrem a fileira inteira e "dão a volta" (a textura se repete).
    const offset = rand() * plank;
    for (let x0 = offset - plank; x0 < S; x0 += plank) {
      ctx.fillStyle = tones[Math.floor(rand() * tones.length)];
      ctx.fillRect(x0, r * h, plank, h);
      // Veios
      ctx.strokeStyle = 'rgba(70, 45, 25, 0.16)';
      ctx.lineWidth = 1;
      for (let v = 0; v < 3; v++) {
        const y = r * h + 3 + rand() * (h - 6);
        ctx.beginPath();
        ctx.moveTo(x0, y);
        ctx.bezierCurveTo(x0 + plank * 0.3, y + rand() * 3 - 1.5, x0 + plank * 0.7, y + rand() * 3 - 1.5, x0 + plank, y);
        ctx.stroke();
      }
      // Emenda entre tábuas
      ctx.fillStyle = 'rgba(50, 32, 18, 0.45)';
      ctx.fillRect(x0, r * h, 1.5, h);
    }
    ctx.fillStyle = 'rgba(50, 32, 18, 0.45)';
    ctx.fillRect(0, r * h, S, 1.5);
  }
  const tex = t.track(new THREE.CanvasTexture(canvas));
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(width / 4, depth / 4); // um ladrilho de textura = 4 m
  tex.anisotropy = 8;
  return tex;
}

// O que se vê através do vidro da porta: um corredor curto em perspectiva,
// com a saída iluminada na cor da sala. Desenhado em canvas (sem imagem
// externa); é isso que faz o vidro parecer transparente.
function doorGlowTexture(t: Tracker, color: number): THREE.CanvasTexture {
  const W = 256, H = 416; // mesma proporção da porta (1,6 × 2,6 m)
  const canvas = document.createElement('canvas');
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d')!;
  const c = new THREE.Color(color);
  const hex = (k: THREE.Color) => `#${k.getHexString()}`;
  const shade = (f: number) => hex(c.clone().multiplyScalar(f));
  const tint = (f: number) => hex(c.clone().lerp(new THREE.Color(0xfff6e6), f));
  // Abertura do fundo (ponto de fuga um pouco abaixo do centro)
  const bx0 = W * 0.3, bx1 = W * 0.7, by0 = H * 0.28, by1 = H * 0.72;
  // Paredes laterais, teto e chão do corredor
  const face = (pts: number[][], fill: string) => {
    ctx.beginPath();
    ctx.moveTo(pts[0][0], pts[0][1]);
    pts.slice(1).forEach(([x, y]) => ctx.lineTo(x, y));
    ctx.closePath();
    ctx.fillStyle = fill;
    ctx.fill();
  };
  face([[0, 0], [bx0, by0], [bx0, by1], [0, H]], shade(0.55));
  face([[W, 0], [bx1, by0], [bx1, by1], [W, H]], shade(0.55));
  face([[0, 0], [W, 0], [bx1, by0], [bx0, by0]], shade(0.4));
  face([[0, H], [W, H], [bx1, by1], [bx0, by1]], shade(0.7));
  // Saída iluminada no fundo
  const g = ctx.createRadialGradient(W / 2, (by0 + by1) / 2, 4, W / 2, (by0 + by1) / 2, (bx1 - bx0));
  g.addColorStop(0, '#fffaf0');
  g.addColorStop(0.6, tint(0.6));
  g.addColorStop(1, tint(0.25));
  ctx.fillStyle = g;
  ctx.fillRect(bx0, by0, bx1 - bx0, by1 - by0);
  // Luz da saída "escorrendo" pelo chão do corredor
  const floorGlow = ctx.createLinearGradient(0, by1, 0, H);
  floorGlow.addColorStop(0, 'rgba(255, 246, 230, 0.45)');
  floorGlow.addColorStop(1, 'rgba(255, 246, 230, 0)');
  face([[0, H], [W, H], [bx1, by1], [bx0, by1]], 'rgba(0,0,0,0)');
  ctx.fillStyle = floorGlow;
  ctx.fill();
  const tex = t.track(new THREE.CanvasTexture(canvas));
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

// Marca um objeto que não deve projetar sombra (paredes, teto, chão).
const noCast = (o: THREE.Object3D) => { o.userData.noCastShadow = true; return o; };

// Chão + paredes + teto + placas + portas da planta, adicionados em `group`.
export function buildShell(group: THREE.Group, layout: MuseumLayout, t: Tracker, wallHeight = WALL_HEIGHT): Shell {
  // ── Chão de madeira ──
  const floor = new THREE.Mesh(
    t.track(new THREE.PlaneGeometry(layout.width, layout.depth)),
    t.track(new THREE.MeshStandardMaterial({ map: woodFloorTexture(t, layout.width, layout.depth), roughness: 0.45, metalness: 0 })),
  );
  floor.rotation.x = -Math.PI / 2;
  noCast(floor);
  group.add(floor);

  // ── Paredes (tom creme, como no ECOS) ──
  const wallMat = t.track(new THREE.MeshStandardMaterial({ color: 0xeee5d6, roughness: 0.9 }));
  const trimMat = t.track(new THREE.MeshStandardMaterial({ color: 0x5a4332, roughness: 0.5 }));
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
    noCast(wall);
    group.add(wall);
    // Rodapé e moldura do teto (madeira escura), um pouco mais grossos que a parede.
    for (const [h, y] of [[0.14, 0.07], [0.12, wallHeight - 0.06]] as const) {
      const trim = new THREE.Mesh(t.track(new THREE.BoxGeometry(sx + 0.06, h, sz + 0.06)), trimMat);
      trim.position.set(cx, y, cz);
      noCast(trim);
      group.add(trim);
    }
  }

  // ── Teto com luminárias ──
  const ceiling = new THREE.Mesh(
    t.track(new THREE.PlaneGeometry(layout.width + 0.5, layout.depth + 0.5)),
    t.track(new THREE.MeshStandardMaterial({ color: 0xf6f0e6, roughness: 0.95, emissive: 0xf0e4d0, emissiveIntensity: 0.3 })),
  );
  ceiling.rotation.x = Math.PI / 2;
  ceiling.position.y = wallHeight;
  noCast(ceiling);
  group.add(ceiling);

  const lampGeo = t.track(new THREE.PlaneGeometry(1.4, 1.4));
  const lampMat = t.track(new THREE.MeshBasicMaterial({ color: 0xfff6e6 }));
  const nx = Math.max(1, Math.round(layout.width / 4));
  const nz = Math.max(1, Math.round(layout.depth / 4));
  for (let i = 0; i < nx; i++) {
    for (let k = 0; k < nz; k++) {
      const lamp = new THREE.Mesh(lampGeo, lampMat);
      lamp.rotation.x = Math.PI / 2;
      lamp.position.set(-halfW + (i + 0.5) * (layout.width / nx), wallHeight - 0.01, -halfD + (k + 0.5) * (layout.depth / nz));
      noCast(lamp);
      group.add(lamp);
    }
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

  // ── Portas: vidro colorido com uma "passagem" iluminada atrás ──
  const frameMat = t.track(new THREE.MeshStandardMaterial({ color: 0x4a3526, roughness: 0.45 }));
  const brassMat = t.track(new THREE.MeshStandardMaterial({ color: 0xd4a94f, roughness: 0.25, metalness: 0.9 }));
  const sideGeo = t.track(new THREE.BoxGeometry(0.12, DOOR_HEIGHT + 0.12, 0.16));
  const lintelGeo = t.track(new THREE.BoxGeometry(DOOR_WIDTH + 0.24, 0.12, 0.16));
  const panelGeo = t.track(new THREE.BoxGeometry(DOOR_WIDTH, DOOR_HEIGHT, 0.04));
  const glowGeo = t.track(new THREE.PlaneGeometry(DOOR_WIDTH, DOOR_HEIGHT));
  const handleGeo = t.track(new THREE.CylinderGeometry(0.02, 0.02, 0.5, 10));
  const labelGeo = t.track(new THREE.PlaneGeometry(2.2, 0.42));
  const doorMaterials = new Map<string, THREE.MeshStandardMaterial>();

  for (const door of layout.doors) {
    const doorGroup = new THREE.Group();
    placeOnWall(doorGroup, door, door.normal, 0, 0);
    group.add(doorGroup);

    // Fundo luminoso (não recebe luz: brilha sozinho)
    const glow = new THREE.Mesh(glowGeo, t.track(new THREE.MeshBasicMaterial({ map: doorGlowTexture(t, door.color) })));
    glow.position.set(0, DOOR_HEIGHT / 2, 0.005);
    noCast(glow);
    doorGroup.add(glow);

    // Vidro semitransparente na cor da porta. O brilho (emissive) acende
    // quando o visitante chega perto (scene.ts → setCurrentDoor).
    const mat = t.track(new THREE.MeshPhysicalMaterial({
      color: door.color, roughness: 0.1, metalness: 0, transparent: true, opacity: 0.22,
      emissive: door.color, emissiveIntensity: 0, depthWrite: false,
    }));
    doorMaterials.set(door.id, mat);

    // Folha da porta (coordenadas locais: +Z aponta para dentro da sala)
    const panel = new THREE.Mesh(panelGeo, mat);
    panel.position.set(0, DOOR_HEIGHT / 2, 0.05);
    noCast(panel);
    doorGroup.add(panel);

    // Batentes e verga
    for (const sx of [-1, 1]) {
      const post = new THREE.Mesh(sideGeo, frameMat);
      post.position.set(sx * (DOOR_WIDTH / 2 + 0.06), (DOOR_HEIGHT + 0.12) / 2, 0.08);
      noCast(post);
      doorGroup.add(post);
    }
    const lintel = new THREE.Mesh(lintelGeo, frameMat);
    lintel.position.set(0, DOOR_HEIGHT + 0.06, 0.08);
    noCast(lintel);
    doorGroup.add(lintel);

    // Puxador vertical de latão
    const handle = new THREE.Mesh(handleGeo, brassMat);
    handle.position.set(DOOR_WIDTH / 2 - 0.18, 1.05, 0.12);
    doorGroup.add(handle);

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

// Luz de galeria: um spot quente vindo do teto, apontado para (x, y, z).
// Não projeta sombra (seria caro com vários spots); a sombra vem do sol.
export function addSpotlight(group: THREE.Group, t: Tracker, x: number, y: number, z: number, ceilingY: number, intensity = 30) {
  const spot = t.track(new THREE.SpotLight(0xffe2b8, intensity, 0, Math.PI / 7, 0.6, 2));
  spot.position.set(x, ceilingY - 0.1, z);
  spot.target.position.set(x, y, z);
  group.add(spot, spot.target);
}

// Liga sombras em tudo que foi montado no grupo: todo mesh iluminado recebe
// sombra; projeta sombra quem não é parede/teto/chão nem transparente.
export function enableShadows(group: THREE.Object3D) {
  group.traverse((o) => {
    const mesh = o as THREE.Mesh;
    if (!mesh.isMesh) return;
    const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
    const lit = mats.every((m) => !(m as THREE.MeshBasicMaterial).isMeshBasicMaterial);
    const opaque = mats.every((m) => !m.transparent);
    mesh.receiveShadow = lit;
    mesh.castShadow = lit && opaque && !mesh.userData.noCastShadow;
  });
}

// Quebra `text` em linhas que cabem em `maxWidth` pixels (canvas 2D).
// Preserva quebras de linha explícitas (`\n`) e ignora linhas que não caberiam
// no espaço vertical (evita estouro de canvas).
function wrapText(ctx: CanvasRenderingContext2D, text: string, maxWidth: number, maxLines: number): string[] {
  const out: string[] = [];
  for (const para of text.split('\n')) {
    if (out.length >= maxLines) break;
    if (para.trim() === '') { out.push(''); continue; }
    const words = para.split(' ');
    let cur = '';
    for (const w of words) {
      if (out.length >= maxLines) break;
      const test = cur ? `${cur} ${w}` : w;
      if (ctx.measureText(test).width > maxWidth) {
        if (cur) out.push(cur);
        cur = w;
      } else {
        cur = test;
      }
    }
    if (cur && out.length < maxLines) out.push(cur);
  }
  return out;
}

// Placa retangular com título e texto multilinha, para a parede do fundo das
// salas de exercício. Já retorna o mesh posicionado em (0, 0, 0); quem chama
// define a posição final.
export function buildEnunciadoPanel(t: Tracker, heading: string, text: string, color: number): THREE.Mesh {
  const W = 1024, H = 512;
  const canvas = document.createElement('canvas');
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d')!;
  const hex = `#${color.toString(16).padStart(6, '0')}`;

  // Fundo escuro + borda colorida
  ctx.fillStyle = BOARD_BG;
  ctx.fillRect(0, 0, W, H);
  ctx.strokeStyle = hex;
  ctx.lineWidth = 8;
  ctx.strokeRect(4, 4, W - 8, H - 8);
  // Barra colorida no topo
  ctx.fillStyle = hex;
  ctx.fillRect(0, 0, W, 16);

  // Título em branco, fonte grande
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 54px Inter, system-ui, sans-serif';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';
  ctx.fillText(heading, 42, 28, W - 84);

  // Separador
  ctx.fillStyle = hex;
  ctx.fillRect(42, 96, W - 84, 3);

  // Corpo do texto (multilinha)
  ctx.fillStyle = BOARD_TEXT;
  ctx.font = '34px Inter, system-ui, sans-serif';
  const lines = wrapText(ctx, text, W - 84, 9);
  lines.forEach((line, i) => {
    ctx.fillText(line, 42, 112 + i * 46);
  });

  const tex = t.track(new THREE.CanvasTexture(canvas));
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  return new THREE.Mesh(
    t.track(new THREE.PlaneGeometry(3.2, 1.6)),
    t.track(new THREE.MeshBasicMaterial({ map: tex })),
  );
}

export function buildPedestal(group: THREE.Group, t: Tracker, x: number, z: number, radius: number, height: number) {
  // Pedestal claro, acetinado, com base de madeira escura.
  const mat = t.track(new THREE.MeshStandardMaterial({ color: 0xeae4d8, roughness: 0.35 }));
  const base = new THREE.Mesh(t.track(new THREE.CylinderGeometry(radius, radius * 1.1, height, 32)), mat);
  base.position.set(x, height / 2, z);
  group.add(base);
  const plinth = new THREE.Mesh(
    t.track(new THREE.CylinderGeometry(radius * 1.18, radius * 1.18, 0.06, 32)),
    t.track(new THREE.MeshStandardMaterial({ color: 0x4a3526, roughness: 0.45 })),
  );
  plinth.position.set(x, 0.03, z);
  group.add(plinth);
}

// ── Ícone "i" e quadros (textos informativos, ver info.ts) ──

// Ícone "i" redondo que sempre fica de frente para a câmera (Sprite).
export function buildInfoIcon(t: Tracker, color = 0x3498db): THREE.Sprite {
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = 128;
  const ctx = canvas.getContext('2d')!;
  ctx.fillStyle = `#${color.toString(16).padStart(6, '0')}`;
  ctx.beginPath();
  ctx.arc(64, 64, 58, 0, Math.PI * 2);
  ctx.fill();
  ctx.lineWidth = 6;
  ctx.strokeStyle = '#ffffff';
  ctx.stroke();
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 84px Georgia, serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('i', 64, 70);
  const tex = t.track(new THREE.CanvasTexture(canvas));
  tex.colorSpace = THREE.SRGBColorSpace;
  const sprite = new THREE.Sprite(t.track(new THREE.SpriteMaterial({ map: tex, depthTest: true })));
  sprite.scale.setScalar(0.28);
  return sprite;
}

// Quadro num cavalete: placa com o título e a dica "clique para ler".
export function buildEasel(t: Tracker, title: string, color: number): THREE.Group {
  const g = new THREE.Group();
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 360;
  const ctx = canvas.getContext('2d')!;
  ctx.fillStyle = BOARD_BG;
  ctx.fillRect(0, 0, 512, 360);
  const hex = `#${color.toString(16).padStart(6, '0')}`;
  ctx.strokeStyle = hex;
  ctx.lineWidth = 14;
  ctx.strokeRect(7, 7, 498, 346);
  ctx.fillStyle = hex;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = 'bold 64px Inter, system-ui, sans-serif';
  ctx.fillText(title, 256, 150);
  ctx.fillStyle = BOARD_TEXT;
  ctx.font = '30px Inter, system-ui, sans-serif';
  ctx.fillText('mire e aperte para ler', 256, 250);
  const tex = t.track(new THREE.CanvasTexture(canvas));
  tex.colorSpace = THREE.SRGBColorSpace;
  const board = new THREE.Mesh(
    t.track(new THREE.PlaneGeometry(1.3, 0.92)),
    t.track(new THREE.MeshBasicMaterial({ map: tex, side: THREE.DoubleSide })),
  );
  board.position.y = 1.55;
  g.add(board);
  const legMat = t.track(new THREE.MeshStandardMaterial({ color: 0x6b4a32, roughness: 0.5 }));
  const legGeo = t.track(new THREE.CylinderGeometry(0.025, 0.025, 1.6, 8));
  for (const x of [-0.45, 0.45]) {
    const leg = new THREE.Mesh(legGeo, legMat);
    leg.position.set(x, 0.8, -0.03);
    g.add(leg);
  }
  return g;
}
