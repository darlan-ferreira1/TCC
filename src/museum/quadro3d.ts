// Quadros e painéis DENTRO da cena 3D (no lugar dos pop-ups por cima da tela).
//
// - `createFloatingPanel`: o painel de leitura que surge flutuando na frente do
//   visitante (enunciado, dica, Teoria, História, "i", boas-vindas). O
//   visitante continua andando; mira nas setas e aperta E para passar as
//   páginas, e fecha no ✕, com Espaço (ou B no controle) ou se afastando.
//   No celular dá para tocar direto nas setas/✕ do painel, ou usar os botões
//   ◀ ✕ ▶ ao lado do joystick (index.tsx).
// - `hitRegion`: descobre em que ponto de um quadro (plano) a mira está, para
//   quadros com vários botões (ex.: as alternativas).

import * as THREE from 'three';
import type { InfoContent } from './info';
import type { RoomInteraction } from './interactiveRoom';

export const BOARD_FONT = 'Inter, system-ui, sans-serif';

// Quebra `text` em linhas que cabem em `maxWidth` px; respeita os "\n".
export function wrapText(ctx: CanvasRenderingContext2D, text: string, maxWidth: number, maxLines: number): string[] {
  const out: string[] = [];
  for (const para of text.split('\n')) {
    if (out.length >= maxLines) break;
    if (para.trim() === '') { out.push(''); continue; }
    let cur = '';
    for (const w of para.split(' ')) {
      const test = cur ? `${cur} ${w}` : w;
      if (ctx.measureText(test).width > maxWidth && cur) {
        out.push(cur);
        cur = w;
        if (out.length >= maxLines) break;
      } else {
        cur = test;
      }
    }
    if (cur && out.length < maxLines) out.push(cur);
  }
  return out;
}

export interface Rect { x: number; y: number; w: number; h: number } // em px do canvas

// Ponto da mira sobre um quadro (PlaneGeometry largura × altura, centrado),
// convertido para px do canvas (origem no canto superior esquerdo).
// null = a mira não cruza o quadro ou ele está longe demais.
const _plane = new THREE.Plane();
const _normal = new THREE.Vector3();
const _pos = new THREE.Vector3();
const _hit = new THREE.Vector3();
const _q = new THREE.Quaternion();
export function hitRegion(
  ray: THREE.Ray, mesh: THREE.Object3D, size: { w: number; h: number }, canvas: { w: number; h: number }, reach: number,
): { x: number; y: number } | null {
  if (!mesh.visible || !mesh.parent?.visible) return null;
  mesh.getWorldPosition(_pos);
  mesh.getWorldQuaternion(_q);
  _normal.set(0, 0, 1).applyQuaternion(_q);
  _plane.setFromNormalAndCoplanarPoint(_normal, _pos);
  if (!ray.intersectPlane(_plane, _hit)) return null;
  if (ray.origin.distanceTo(_hit) > reach) return null;
  const local = mesh.worldToLocal(_hit.clone());
  if (Math.abs(local.x) > size.w / 2 || Math.abs(local.y) > size.h / 2) return null;
  return { x: (local.x / size.w + 0.5) * canvas.w, y: (0.5 - local.y / size.h) * canvas.h };
}

export const inRect = (p: { x: number; y: number }, r: Rect) => p.x >= r.x && p.x <= r.x + r.w && p.y >= r.y && p.y <= r.y + r.h;

// ── Painel flutuante de leitura ──

export const PANEL_W = 1.5;
const PW = PANEL_W, PH = 1.05;   // m
const CW = 1024, CH = 717;       // px (mesma proporção)
const CLOSE_DISTANCE = 7;        // m: longe disso, o painel fecha sozinho
const BTN_PREV: Rect = { x: 30, y: CH - 96, w: 150, h: 70 };
const BTN_NEXT: Rect = { x: CW - 180, y: CH - 96, w: 150, h: 70 };
const BTN_CLOSE: Rect = { x: CW - 96, y: 20, w: 76, h: 76 };

export interface FloatingPanel {
  group: THREE.Group;
  isOpen(): boolean;
  open(content: InfoContent, position: THREE.Vector3, lookAt: THREE.Vector3, accent?: number): void;
  close(): void;
  interaction: RoomInteraction;
  // Botões de fora (◀ ✕ ▶ do celular) e toque direto no painel.
  prev(): void;
  next(): void;
  tap(ray: THREE.Ray): boolean; // true = o toque caiu no painel
  // Avisa quando abre, troca de página ou fecha (null).
  onChange: ((state: { page: number; total: number } | null) => void) | null;
  tick(cameraPos: THREE.Vector3): void;
  dispose(): void;
}

export function createFloatingPanel(): FloatingPanel {
  const canvas = document.createElement('canvas');
  canvas.width = CW;
  canvas.height = CH;
  const ctx = canvas.getContext('2d')!;
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  const geo = new THREE.PlaneGeometry(PW, PH);
  // depthTest false + renderOrder alto: o painel é desenhado sempre por cima da
  // cena (não some atrás de um pedestal ou de uma mesa que fique na frente).
  const mat = new THREE.MeshBasicMaterial({ map: tex, transparent: true, side: THREE.DoubleSide, depthTest: false, depthWrite: false });
  const mesh = new THREE.Mesh(geo, mat);
  mesh.renderOrder = 10;
  const group = new THREE.Group();
  group.add(mesh);
  group.visible = false;

  let content: InfoContent | null = null;
  let page = 0;
  let accent = '#e67e22';
  let hover: 'prev' | 'next' | 'close' | 'body' | null = null;

  function draw() {
    if (!content) return;
    const p = content.pages[page];
    ctx.clearRect(0, 0, CW, CH);
    // Fundo arredondado translúcido
    ctx.fillStyle = 'rgba(28, 31, 38, 0.94)';
    ctx.beginPath();
    ctx.roundRect(4, 4, CW - 8, CH - 8, 28);
    ctx.fill();
    ctx.strokeStyle = accent;
    ctx.lineWidth = 6;
    ctx.stroke();
    // Título pequeno + cabeçalho
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    ctx.fillStyle = accent;
    ctx.font = `bold 30px ${BOARD_FONT}`;
    ctx.fillText(content.title.toUpperCase(), 44, 36, CW - 200);
    ctx.fillStyle = '#ffffff';
    ctx.font = `bold 48px ${BOARD_FONT}`;
    ctx.fillText(p.heading ?? content.title, 44, 82, CW - 160);
    ctx.fillStyle = accent;
    ctx.fillRect(44, 146, CW - 88, 3);
    // Texto
    ctx.fillStyle = '#e4e7ee';
    ctx.font = `34px ${BOARD_FONT}`;
    wrapText(ctx, p.text, CW - 88, 11).forEach((line, i) => ctx.fillText(line, 44, 168 + i * 44));
    // Botões
    const button = (r: Rect, label: string, active: boolean, on: boolean) => {
      ctx.globalAlpha = active ? 1 : 0.3;
      ctx.fillStyle = on ? '#f1c40f' : 'rgba(255,255,255,0.12)';
      ctx.beginPath();
      ctx.roundRect(r.x, r.y, r.w, r.h, 14);
      ctx.fill();
      ctx.fillStyle = on ? '#1c1f26' : '#ffffff';
      ctx.font = `bold 40px ${BOARD_FONT}`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(label, r.x + r.w / 2, r.y + r.h / 2 + 2);
      ctx.globalAlpha = 1;
      ctx.textAlign = 'left';
      ctx.textBaseline = 'top';
    };
    const n = content.pages.length;
    if (n > 1) {
      button(BTN_PREV, '◀', page > 0, hover === 'prev');
      button(BTN_NEXT, '▶', page < n - 1, hover === 'next');
      ctx.fillStyle = '#9aa1ad';
      ctx.font = `30px ${BOARD_FONT}`;
      ctx.textAlign = 'center';
      ctx.fillText(`${page + 1} / ${n}`, CW / 2, CH - 74);
      ctx.textAlign = 'left';
    }
    button(BTN_CLOSE, '✕', true, hover === 'close');
    tex.needsUpdate = true;
  }

  function setHover(h: typeof hover) {
    if (h !== hover) { hover = h; draw(); }
  }

  function notify() {
    api.onChange?.(content ? { page, total: content.pages.length } : null);
  }

  function close() {
    if (!content) return;
    content = null;
    group.visible = false;
    hover = null;
    notify();
  }

  function goTo(p: number) {
    if (!content) return;
    const n = Math.min(Math.max(p, 0), content.pages.length - 1);
    if (n === page) return;
    page = n;
    draw();
    notify();
  }

  const interaction: RoomInteraction = {
    hold: false,
    get prompt() {
      if (hover === 'close') return 'fechar';
      if (hover === 'prev') return 'página anterior';
      if (hover === 'next') return 'próxima página';
      const last = !content || page >= content.pages.length - 1;
      return last ? 'fechar' : 'próxima página';
    },
    isTarget(ray) {
      if (!content) return false;
      const p = hitRegion(ray, mesh, { w: PW, h: PH }, { w: CW, h: CH }, CLOSE_DISTANCE);
      if (!p) { setHover(null); return false; }
      const n = content.pages.length;
      setHover(inRect(p, BTN_CLOSE) ? 'close'
        : n > 1 && page > 0 && inRect(p, BTN_PREV) ? 'prev'
        : n > 1 && page < n - 1 && inRect(p, BTN_NEXT) ? 'next'
        : 'body');
      return true;
    },
    press() {
      if (!content) return;
      const last = page >= content.pages.length - 1;
      if (hover === 'close' || (hover === 'body' && last)) { close(); return; }
      goTo(hover === 'prev' ? page - 1 : page + 1);
    },
    drag() { /* nada */ },
    release() { /* nada */ },
  };

  const api: FloatingPanel = {
    group,
    isOpen: () => content !== null,
    open(c, position, lookAt, accentColor = 0xe67e22) {
      content = c;
      page = 0;
      hover = null;
      accent = `#${accentColor.toString(16).padStart(6, '0')}`;
      group.position.copy(position);
      group.lookAt(lookAt.x, position.y, lookAt.z);
      group.visible = true;
      draw();
      notify();
    },
    close,
    interaction,
    prev: () => goTo(page - 1),
    next: () => goTo(page + 1),
    tap(ray) {
      if (!interaction.isTarget(ray)) return false;
      interaction.press(ray);
      return true;
    },
    onChange: null,
    tick(cameraPos) {
      if (content && cameraPos.distanceTo(group.position) > CLOSE_DISTANCE) close();
    },
    dispose() {
      geo.dispose();
      mat.dispose();
      tex.dispose();
    },
  };
  return api;
}
