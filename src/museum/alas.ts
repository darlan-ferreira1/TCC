// Alas temáticas do Museu Virtual (PROTÓTIPO).
//
// Cada ala é um "museu dentro do museu": uma porta do salão principal leva a
// um salão menor com as salas de um tema, em ordem. As portas da ala usam o
// mesmo mecanismo do salão. Todas as portas das alas levam a salas DENTRO do
// museu (nenhuma abre a página do experimento no site).
//
// As salas novas não estão no registry.ts: existem só dentro das alas. Elas
// são o protótipo do TCC (museu + lista de exercícios interativa), que depois
// vai virar um projeto separado do CLARA.js.

import * as THREE from 'three';
import type { InteractiveRoom } from './interactiveRoom';
import { computeWingLayout, type DoorEntry } from './layout';
import { BOAS_VINDAS } from './conteudo';
import type { Centerpiece } from './levels';
import type { WingDef } from './scene';
import { sala as pendulumRoom } from '../simulations/physics/Pendulum/sala';
import { sala as conicalRoom } from '../simulations/physics/ConicalPendulum/sala';
import { sala as foucaultRoom } from '../simulations/physics/FoucaultPendulum/sala';
import { sala as projectileRoom } from '../simulations/physics/ProjectileRoom/sala';
import { sala as keplerRoom } from '../simulations/physics/KeplerRoom/sala';
import { sala as wavesRoom } from '../simulations/physics/WavesRoom/sala';
export const WINGS_CATEGORY = 'Alas temáticas';

const MECHANICS_COLOR = 0xe67e22;

// Salas que só existem nas alas (id da porta → sala interativa).
export const WING_ROOMS: Record<string, InteractiveRoom> = {
  'simple-pendulum': pendulumRoom as InteractiveRoom,
  'conical-pendulum': conicalRoom as InteractiveRoom,
  'foucault-pendulum': foucaultRoom as InteractiveRoom,
  'projectile-room': projectileRoom as InteractiveRoom,
  'kepler-room': keplerRoom as InteractiveRoom,
  'waves-room': wavesRoom as InteractiveRoom,
};

const door = (id: string, title: string, color: number): DoorEntry => ({ id, title, category: '', color });

// ── Peça do pedestal central: a planta da exposição ──
//
// Uma "mesa" com a planta vista de cima, desenhada em canvas a partir da
// planta REAL do salão (computeWingLayout) e do tamanho real de cada sala
// (sala.ts). O topo do desenho é a parede do fundo, então quem chega pela
// entrada lê a planta na mesma orientação em que vê o salão.

const MAP_SIZE = 1.35;       // m, lado da planta em cima do pedestal
// Planta esquemática: todas as salas com o mesmo tamanho (em escala real o
// Lançamento, com 22 m, cobriria as vizinhas).
const ROOM_ALONG = 3.3;      // m, ao longo da parede
const ROOM_AWAY = 2.9;       // m, para fora da parede

function drawPlan(): HTMLCanvasElement {
  const wingDef = WINGS[WING_ID];
  const plan = computeWingLayout(wingDef.entries, '', 0, true);
  const S = 1024;
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = S;
  const ctx = canvas.getContext('2d')!;

  // Retângulos das salas: do lado de fora de cada porta, afastados da parede.
  const rooms = plan.doors.map((d) => {
    const along = ROOM_ALONG;
    const away = ROOM_AWAY;
    const gap = 0.7;
    // `normal` aponta para dentro do salão; a sala fica do outro lado.
    const cx = d.x - d.normal.x * (gap + away / 2);
    const cz = d.z - d.normal.z * (gap + away / 2);
    const horizontal = Math.abs(d.normal.z) > 0.5; // porta na parede do fundo
    const w = horizontal ? along : away;
    const h = horizontal ? away : along;
    return { d, cx, cz, w, h };
  });

  // Enquadramento: tudo cabe no canvas com margem (e espaço para o título).
  let minX = -plan.width / 2, maxX = plan.width / 2, minZ = -plan.depth / 2, maxZ = plan.depth / 2;
  for (const r of rooms) {
    minX = Math.min(minX, r.cx - r.w / 2); maxX = Math.max(maxX, r.cx + r.w / 2);
    minZ = Math.min(minZ, r.cz - r.h / 2); maxZ = Math.max(maxZ, r.cz + r.h / 2);
  }
  const top = 120, margin = 50;
  const k = Math.min((S - 2 * margin) / (maxX - minX), (S - top - margin) / (maxZ - minZ));
  const ox = (S - (maxX - minX) * k) / 2 - minX * k;
  const oz = top + (S - top - margin - (maxZ - minZ) * k) / 2 - minZ * k;
  const X = (x: number) => ox + x * k;
  const Z = (z: number) => oz + z * k;
  const hex = (c: number) => `#${c.toString(16).padStart(6, '0')}`;

  // Papel e título
  ctx.fillStyle = '#f4ecdc';
  ctx.fillRect(0, 0, S, S);
  ctx.strokeStyle = '#5a4332';
  ctx.lineWidth = 10;
  ctx.strokeRect(5, 5, S - 10, S - 10);
  ctx.fillStyle = '#3b2a1e';
  ctx.font = 'bold 54px Inter, system-ui, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('Planta da exposição', S / 2, 62);

  // Corredores (da porta até a sala)
  for (const r of rooms) {
    ctx.strokeStyle = '#b9a58c';
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.moveTo(X(r.d.x), Z(r.d.z));
    ctx.lineTo(X(r.cx), Z(r.cz));
    ctx.stroke();
  }
  // Salas
  for (const r of rooms) {
    const x = X(r.cx - r.w / 2), y = Z(r.cz - r.h / 2), w = r.w * k, h = r.h * k;
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(x, y, w, h);
    ctx.fillStyle = hex(r.d.color) + '40';
    ctx.fillRect(x, y, w, h);
    ctx.strokeStyle = hex(r.d.color);
    ctx.lineWidth = 5;
    ctx.strokeRect(x, y, w, h);
    // Nome: quebra em até 2 linhas e diminui a fonte até caber.
    const words = r.d.title.split(' ');
    const half = Math.ceil(words.length / 2);
    const lines = words.length > 2 ? [words.slice(0, half).join(' '), words.slice(half).join(' ')] : [r.d.title];
    let size = 40;
    do {
      ctx.font = `bold ${size}px Inter, system-ui, sans-serif`;
      size -= 2;
    } while (Math.max(...lines.map((l) => ctx.measureText(l).width)) > w - 12 && size > 14);
    ctx.fillStyle = '#3b2a1e';
    lines.forEach((l, i) => ctx.fillText(l, X(r.cx), Z(r.cz) + (i - (lines.length - 1) / 2) * (size + 6)));
  }

  // Salão
  ctx.fillStyle = '#e8d9bf';
  ctx.fillRect(X(-plan.width / 2), Z(-plan.depth / 2), plan.width * k, plan.depth * k);
  ctx.strokeStyle = '#5a4332';
  ctx.lineWidth = 8;
  ctx.strokeRect(X(-plan.width / 2), Z(-plan.depth / 2), plan.width * k, plan.depth * k);
  ctx.fillStyle = '#7a6450';
  ctx.font = 'bold 28px Inter, system-ui, sans-serif';
  ctx.fillText('Salão', X(0), Z(-plan.depth / 2) + 36);

  // Portas (aberturas coloridas na parede)
  for (const d of plan.doors) {
    const tg = { x: d.normal.z, z: -d.normal.x };
    ctx.strokeStyle = hex(d.color);
    ctx.lineWidth = 14;
    ctx.beginPath();
    ctx.moveTo(X(d.x - tg.x * 0.8), Z(d.z - tg.z * 0.8));
    ctx.lineTo(X(d.x + tg.x * 0.8), Z(d.z + tg.z * 0.8));
    ctx.stroke();
  }
  ctx.fillStyle = '#7a6450';
  ctx.font = 'bold 26px Inter, system-ui, sans-serif';
  ctx.fillText('entrada', X(0), Z(plan.depth / 2) - 26);

  // Pedestais das miniaturas
  ctx.fillStyle = '#b9a58c';
  for (const e of plan.exhibits ?? []) {
    ctx.beginPath();
    ctx.arc(X(e.x), Z(e.z), 9, 0, Math.PI * 2);
    ctx.fill();
  }

  // Você está aqui (o pedestal central)
  ctx.fillStyle = '#c0392b';
  ctx.beginPath();
  ctx.arc(X(0), Z(0), 20, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 5;
  ctx.stroke();
  ctx.fillStyle = '#c0392b';
  ctx.font = 'bold 30px Inter, system-ui, sans-serif';
  ctx.fillText('Você está aqui', X(0), Z(0) + 46);
  return canvas;
}

const planPiece: Centerpiece = (group, t) => {
  // Mesa levemente inclinada para quem chega pela entrada.
  const table = new THREE.Group();
  // Inclinação pequena e mesa acima do pedestal (senão a borda de perto
  // afunda no tampo).
  table.position.y = 0.3;
  table.rotation.x = -Math.PI / 2 + 0.25;
  group.add(table);
  const board = new THREE.Mesh(
    t.track(new THREE.BoxGeometry(MAP_SIZE + 0.1, MAP_SIZE + 0.1, 0.05)),
    t.track(new THREE.MeshStandardMaterial({ color: 0x4a3526, roughness: 0.45 })),
  );
  board.position.z = -0.03;
  const tex = t.track(new THREE.CanvasTexture(drawPlan()));
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  const map = new THREE.Mesh(
    t.track(new THREE.PlaneGeometry(MAP_SIZE, MAP_SIZE)),
    // Sem iluminação (MeshBasic): o spot de cima desbotava as cores e o texto.
    t.track(new THREE.MeshBasicMaterial({ map: tex })),
  );
  table.add(board, map);
  return () => { /* planta parada */ };
};

// ── O salão (antes "Ala da Mecânica") ──
// A exposição é pequena: um único salão com as 6 salas. O id interno
// 'ala-mecanica' ficou por compatibilidade; o visitante não vê a palavra "ala".

const WING_ID = 'ala-mecanica';

export const WINGS: Record<string, WingDef & { title: string; color: number }> = {
  [WING_ID]: {
    title: 'Salão principal',
    placa: 'Mecânica Clássica',
    color: MECHANICS_COLOR,
    centerpiece: planPiece,
    boasVindas: BOAS_VINDAS,
    noExit: true, // o salão é o nível de entrada
    entries: [
      door('simple-pendulum', 'Pêndulo de Galileu', MECHANICS_COLOR),
      door('projectile-room', 'Lançamento de projéteis', MECHANICS_COLOR),
      door('kepler-room', 'Leis de Kepler', MECHANICS_COLOR),
      door('conical-pendulum', 'Pêndulo cônico', MECHANICS_COLOR),
      door('waves-room', 'Ondas', MECHANICS_COLOR),
      door('foucault-pendulum', 'Pêndulo de Foucault', MECHANICS_COLOR),
    ],
  },
};

// Portas das alas no salão principal (todas na mesma parede).
export const WING_DOORS: DoorEntry[] = Object.entries(WINGS).map(([id, w]) => ({
  id, title: w.title, category: WINGS_CATEGORY, color: w.color,
}));
