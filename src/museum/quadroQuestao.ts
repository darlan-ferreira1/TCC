// Os dois quadros de uma sala de questão, um de cada lado de quem entra (como
// Teoria e História nas salas normais). A parede atrás do fenômeno fica livre.
//
//   esquerda: ENUNCIADO, legível de longe; mirar e apertar E abre o painel
//             flutuante com o texto maior.
//   direita:  RESPOSTA. Começa como "Iniciar questão". Depois de iniciar:
//             - tipo "alternativas": os botões A–D (mirar e apertar E, ou as
//               teclas 1–4) e o botão Dica;
//             - tipo "ajustar": como responder (painel de ajustes) e o botão Dica.
//
// Tudo é mirado com o centro da tela, como o resto da exposição: o mouse
// nunca é solto, então o estudante continua andando com a questão aberta.

import * as THREE from 'three';
import type { InfoContent } from './info';
import type { InteractiveRoom, RoomInteraction } from './interactiveRoom';
import type { Tracker } from './builders';
import { BOARD_FONT, hitRegion, inRect, wrapText, type Rect } from './quadro3d';

export interface ExerciseHooks {
  onStart: () => void;
  onAlternative: (index: number) => void;
}

const GREEN = '#27ae60';
const YELLOW = '#f1c40f';
const RED = '#c0392b';
const BG = '#22262e';
const LETRAS = ['A', 'B', 'C', 'D', 'E', 'F'];
const REACH = 6; // m

// Quadro em pé: tábua (plano) sobre dois pés de madeira.
function stand(t: Tracker, board: THREE.Mesh, w: number, h: number, centerY: number): THREE.Group {
  const g = new THREE.Group();
  board.position.y = centerY;
  const frame = new THREE.Mesh(
    t.track(new THREE.BoxGeometry(w + 0.08, h + 0.08, 0.04)),
    t.track(new THREE.MeshStandardMaterial({ color: 0x4a3526, roughness: 0.45 })),
  );
  frame.position.set(0, centerY, -0.025);
  const legMat = t.track(new THREE.MeshStandardMaterial({ color: 0x6b4a32, roughness: 0.5 }));
  const legH = centerY - h / 2;
  const legGeo = t.track(new THREE.CylinderGeometry(0.03, 0.03, legH, 8));
  for (const x of [-w / 2 + 0.12, w / 2 - 0.12]) {
    const leg = new THREE.Mesh(legGeo, legMat);
    leg.position.set(x, legH / 2, -0.04);
    g.add(leg);
  }
  g.add(frame, board);
  return g;
}

function canvasBoard(t: Tracker, cw: number, ch: number, w: number, h: number) {
  const canvas = document.createElement('canvas');
  canvas.width = cw;
  canvas.height = ch;
  const ctx = canvas.getContext('2d')!;
  const tex = t.track(new THREE.CanvasTexture(canvas));
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  const mesh = new THREE.Mesh(t.track(new THREE.PlaneGeometry(w, h)), t.track(new THREE.MeshBasicMaterial({ map: tex })));
  return { ctx, tex, mesh };
}

export interface QuestionBoards {
  interactions: RoomInteraction[];
  // tentadas = alternativas erradas já escolhidas; certa = índice da certa
  // (só usado para pintá-la de verde depois do acerto).
  setState(tentadas: number[], acertou: boolean, certa?: number): void;
  tick(dt: number): void;
}

export function buildQuestionBoards(
  group: THREE.Group, t: Tracker, def: InteractiveRoom,
  spots: { x: number; z: number }[], lookAt: { x: number; z: number },
  openInfo: (c: InfoContent, accent?: number) => void, hooks: ExerciseHooks,
): QuestionBoards {
  const { heading, text } = def.enunciado!;
  const enunciadoInfo: InfoContent = { title: 'Questão', pages: [{ heading, text }] };
  const dicaInfo: InfoContent | null = def.dica ? { title: 'Dica', pages: [{ heading, text: def.dica }] } : null;
  const alternativas = def.alternativas ?? null;

  const place = (g: THREE.Group, spot: { x: number; z: number }) => {
    g.position.set(spot.x, 0, spot.z);
    g.rotation.y = Math.atan2(lookAt.x - spot.x, lookAt.z - spot.z);
    group.add(g);
  };

  // ── Quadro do enunciado (esquerda) ──
  const EW = 1.7, EH = 1.05, ECW = 1024, ECH = 632;
  const en = canvasBoard(t, ECW, ECH, EW, EH);
  {
    const c = en.ctx;
    c.fillStyle = BG;
    c.fillRect(0, 0, ECW, ECH);
    c.strokeStyle = GREEN;
    c.lineWidth = 10;
    c.strokeRect(5, 5, ECW - 10, ECH - 10);
    c.textAlign = 'left';
    c.textBaseline = 'top';
    c.fillStyle = GREEN;
    c.font = `bold 30px ${BOARD_FONT}`;
    c.fillText('ENUNCIADO', 40, 30);
    c.fillStyle = '#ffffff';
    c.font = `bold 46px ${BOARD_FONT}`;
    c.fillText(heading, 40, 70, ECW - 80);
    c.fillStyle = '#d9dde6';
    c.font = `32px ${BOARD_FONT}`;
    wrapText(c, text, ECW - 80, 11).forEach((l, i) => c.fillText(l, 40, 140 + i * 42));
    en.tex.needsUpdate = true;
  }
  place(stand(t, en.mesh, EW, EH, 1.5), spots[0]);

  // ── Quadro da resposta (direita) ──
  const RW = 1.4, RH = 1.5, RCW = 1024, RCH = 1097;
  const rb = canvasBoard(t, RCW, RCH, RW, RH);
  place(stand(t, rb.mesh, RW, RH, 1.45), spots[1]);

  let started = false;
  let tentadas: number[] = [];
  let acertou = false;
  // 'resto' = a mira está no quadro, mas fora de um botão (ou numa alternativa
  // já tentada): o quadro "segura" o E para ele não atravessar uma porta próxima.
  let hover: number | 'dica' | 'start' | 'resto' | null = null;
  let pulse = 0;
  let sinceDraw = 0;

  const ROW_Y0 = 150, ROW_H = 150, ROW_GAP = 22;
  const rowRect = (i: number): Rect => ({ x: 40, y: ROW_Y0 + i * (ROW_H + ROW_GAP), w: RCW - 80, h: ROW_H });
  const DICA: Rect = { x: RCW / 2 - 180, y: RCH - 160, w: 360, h: 110 };

  function roundBox(r: Rect, fill: string, stroke: string, lw: number) {
    const c = rb.ctx;
    c.fillStyle = fill;
    c.beginPath();
    c.roundRect(r.x, r.y, r.w, r.h, 18);
    c.fill();
    c.strokeStyle = stroke;
    c.lineWidth = lw;
    c.stroke();
  }

  function draw() {
    const c = rb.ctx;
    c.fillStyle = BG;
    c.fillRect(0, 0, RCW, RCH);
    c.textBaseline = 'middle';
    if (!started) {
      // Borda pulsante para chamar a atenção
      c.strokeStyle = GREEN;
      c.lineWidth = 12 + 8 * (0.5 + 0.5 * Math.sin(pulse * 4));
      c.strokeRect(10, 10, RCW - 20, RCH - 20);
      c.textAlign = 'center';
      c.fillStyle = GREEN;
      c.beginPath();
      c.arc(RCW / 2, 360, 130, 0, Math.PI * 2);
      c.fill();
      c.fillStyle = '#ffffff';
      c.font = `bold 170px Georgia, serif`;
      c.fillText('▶', RCW / 2 + 12, 370);
      c.font = `bold 84px ${BOARD_FONT}`;
      c.fillText('Iniciar questão', RCW / 2, 610);
      c.fillStyle = '#c8cdd8';
      c.font = `40px ${BOARD_FONT}`;
      c.fillText('mire aqui e aperte E', RCW / 2, 710);
      c.fillText('(o enunciado está no quadro ao lado)', RCW / 2, 770);
      rb.tex.needsUpdate = true;
      return;
    }
    c.strokeStyle = acertou ? GREEN : '#4b5160';
    c.lineWidth = 10;
    c.strokeRect(5, 5, RCW - 10, RCH - 10);
    c.textAlign = 'center';
    c.fillStyle = acertou ? GREEN : '#ffffff';
    c.font = `bold 56px ${BOARD_FONT}`;
    c.fillText(acertou ? '✓ Resposta certa!' : alternativas ? 'Escolha uma alternativa' : 'Ajuste o valor', RCW / 2, 80);

    if (alternativas) {
      alternativas.forEach((texto, i) => {
        const r = rowRect(i);
        const errada = tentadas.includes(i);
        const certa = acertou && i === certaIndex;
        const on = hover === i && !errada && !acertou;
        roundBox(r,
          certa ? 'rgba(39,174,96,0.35)' : errada ? 'rgba(192,57,43,0.22)' : on ? 'rgba(241,196,15,0.18)' : 'rgba(255,255,255,0.07)',
          certa ? GREEN : errada ? RED : on ? YELLOW : 'rgba(255,255,255,0.25)', on || certa || errada ? 7 : 3);
        // Letra
        roundBox({ x: r.x + 18, y: r.y + 30, w: 90, h: 90 }, 'rgba(255,255,255,0.14)', 'transparent', 0);
        c.textAlign = 'center';
        c.fillStyle = '#ffffff';
        c.font = `bold 52px ${BOARD_FONT}`;
        c.fillText(LETRAS[i], r.x + 63, r.y + 77);
        // Texto (até 2 linhas)
        c.textAlign = 'left';
        c.fillStyle = errada ? 'rgba(217,221,230,0.45)' : '#f3ead8';
        c.font = `bold 46px ${BOARD_FONT}`;
        const lines = wrapText(c, texto, r.w - 160, 2);
        lines.forEach((l, k) => {
          const y = r.y + r.h / 2 + (k - (lines.length - 1) / 2) * 52;
          c.fillText(l, r.x + 135, y);
          if (errada) c.fillRect(r.x + 135, y, c.measureText(l).width, 4);
        });
      });
    } else {
      c.textAlign = 'left';
      c.fillStyle = '#d9dde6';
      c.font = `42px ${BOARD_FONT}`;
      const msg = acertou
        ? 'A cena mostra o valor certo. A porta "Próxima questão" foi liberada.'
        : 'Abra os ajustes (Tab no teclado, ⚙ no celular, Start no controle) e mude o valor até a cena mostrar a resposta que você calculou.\n\nOs valores travados são os dados do problema.';
      wrapText(c, msg, RCW - 120, 12).forEach((l, i) => c.fillText(l, 60, 200 + i * 56));
    }

    if (dicaInfo) {
      const on = hover === 'dica';
      roundBox(DICA, on ? YELLOW : 'rgba(241,196,15,0.15)', YELLOW, 5);
      c.textAlign = 'center';
      c.fillStyle = on ? '#22262e' : YELLOW;
      c.font = `bold 52px ${BOARD_FONT}`;
      c.fillText('? Dica', DICA.x + DICA.w / 2, DICA.y + DICA.h / 2 + 2);
    }
    rb.tex.needsUpdate = true;
  }
  let certaIndex = -1;
  draw();

  function setHover(h: typeof hover) {
    if (h !== hover) { hover = h; draw(); }
  }

  const answer: RoomInteraction = {
    hold: false,
    get prompt() {
      if (hover === 'start') return 'iniciar a questão';
      if (hover === 'dica') return 'ver a dica';
      if (typeof hover === 'number' && alternativas) return `responder ${LETRAS[hover]}) ${alternativas[hover]}`;
      if (acertou) return 'questão respondida: siga pela porta "Próxima questão"';
      return alternativas ? 'mire numa alternativa' : 'ajuste o valor no painel (Tab)';
    },
    isTarget(ray) {
      const p = hitRegion(ray, rb.mesh, { w: RW, h: RH }, { w: RCW, h: RCH }, REACH);
      if (!p) { setHover(null); return false; }
      if (!started) { setHover('start'); return true; }
      if (dicaInfo && inRect(p, DICA)) { setHover('dica'); return true; }
      if (alternativas && !acertou) {
        const i = alternativas.findIndex((_, k) => inRect(p, rowRect(k)));
        if (i >= 0 && !tentadas.includes(i)) { setHover(i); return true; }
      }
      setHover('resto');
      return true;
    },
    press() {
      if (hover === 'start') {
        started = true;
        hover = null;
        draw();
        hooks.onStart();
        openInfo(enunciadoInfo, 0x27ae60);
      } else if (hover === 'dica' && dicaInfo) {
        openInfo(dicaInfo, 0xf1c40f);
      } else if (typeof hover === 'number') {
        const i = hover;
        hover = null;
        hooks.onAlternative(i);
      }
    },
    drag() { /* nada */ },
    release() { /* nada */ },
  };

  const enunciado: RoomInteraction = {
    hold: false,
    prompt: 'ler o enunciado',
    isTarget: (ray) => hitRegion(ray, en.mesh, { w: EW, h: EH }, { w: ECW, h: ECH }, REACH) !== null,
    press() { openInfo(enunciadoInfo, 0x27ae60); },
    drag() { /* nada */ },
    release() { /* nada */ },
  };

  return {
    interactions: [answer, enunciado],
    setState(novasTentadas, novoAcertou, certa) {
      certaIndex = certa ?? -1;
      tentadas = novasTentadas;
      acertou = novoAcertou;
      draw();
    },
    tick(dt) {
      if (started) return;
      // Borda pulsante: redesenha só ~10 vezes por segundo (canvas é caro).
      pulse += dt;
      sinceDraw += dt;
      if (sinceDraw > 0.1) { sinceDraw = 0; draw(); }
    },
  };
}
