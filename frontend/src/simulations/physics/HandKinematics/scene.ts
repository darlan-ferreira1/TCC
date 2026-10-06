// Cena do "Você é o móvel": gráficos x(t) e v(t) ao vivo, desenhados em
// <canvas> 2D (este experimento não precisa de 3D).
//
// A cena NÃO sabe de onde vem a posição: recebe `readPosition()`, que devolve
// metros (ou null quando não há mão/mouse). Quem converte a mão da webcam (ou
// o mouse) em metros é o index.tsx — a mesma separação entre entrada e
// experimento usada na Dissecação e no Museu Virtual.
//
// Desafios (máquina de estados):
//   idle → countdown (3 s) → recording (duração do desafio) → done (gráfico
//   congelado mostrando o alvo tracejado × o movimento do aluno, com a nota).

import { createKinematics, scoreChallenge, type Challenge, type KinematicPoint, type Sample } from './physics';

export type ChallengeStatus =
  | { phase: 'idle' }
  | { phase: 'countdown'; challenge: Challenge; remaining: number }
  | { phase: 'recording'; challenge: Challenge; elapsed: number }
  | { phase: 'done'; challenge: Challenge; score: number; rms: number };

export interface KinematicsSceneOptions {
  readPosition: () => number | null;
  colors: { bg: string; grid: string; axis: string; text: string; x: string; v: string; target: string };
}

export interface KinematicsScene {
  startChallenge(challenge: Challenge): void;
  cancelChallenge(): void;
  clear(): void;
  onStatus: ((s: ChallengeStatus) => void) | null;
  onReading: ((p: KinematicPoint | null) => void) | null;
  dispose(): void;
}

const WINDOW_S = 8;         // largura do gráfico em segundos
const COUNTDOWN_S = 3;
const MIN_X_RANGE = 0.3;    // m
const MIN_V_RANGE = 0.4;    // m/s

export function createKinematicsScene(canvas: HTMLCanvasElement, opts: KinematicsSceneOptions): KinematicsScene {
  const ctx = canvas.getContext('2d')!;
  const kin = createKinematics();
  const c = opts.colors;

  let status: ChallengeStatus = { phase: 'idle' };
  let phaseStart = 0;        // s (relógio da cena) em que a fase atual começou
  let x0 = 0;                // posição no início da gravação (desafio mede deslocamento)
  let recorded: Sample[] = [];
  let frozenAt: number | null = null; // quando o resultado está na tela, o gráfico para

  const api: KinematicsScene = {
    startChallenge(challenge) {
      recorded = [];
      frozenAt = null;
      kin.clear();
      phaseStart = now();
      setStatus({ phase: 'countdown', challenge, remaining: COUNTDOWN_S });
    },
    cancelChallenge() {
      frozenAt = null;
      setStatus({ phase: 'idle' });
    },
    clear() {
      kin.clear();
      recorded = [];
      frozenAt = null;
      setStatus({ phase: 'idle' });
    },
    onStatus: null,
    onReading: null,
    dispose() {
      cancelAnimationFrame(raf);
      ro.disconnect();
    },
  };

  function setStatus(s: ChallengeStatus) {
    status = s;
    api.onStatus?.(s);
  }

  const t0 = performance.now();
  function now() { return (performance.now() - t0) / 1000; }

  // ── Resize (canvas nítido em telas de alta densidade) ──
  let W = 0, H = 0;
  function resize() {
    const dpr = Math.min(window.devicePixelRatio, 2);
    W = canvas.clientWidth;
    H = canvas.clientHeight;
    canvas.width = Math.round(W * dpr);
    canvas.height = Math.round(H * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  const ro = new ResizeObserver(resize);
  ro.observe(canvas);
  resize();

  // ── Laço ──
  let raf = 0;
  let frame = 0;
  function loop() {
    raf = requestAnimationFrame(loop);
    const t = now();

    // Entrada → histórico (a não ser que o resultado esteja congelado na tela)
    const x = opts.readPosition();
    let point: KinematicPoint | null = null;
    if (x !== null && frozenAt === null) point = kin.push(t, x);
    if (++frame % 6 === 0) api.onReading?.(point ?? (x === null ? null : kin.last() ?? null));

    // Máquina de estados do desafio
    if (status.phase === 'countdown') {
      const remaining = COUNTDOWN_S - (t - phaseStart);
      if (remaining <= 0) {
        phaseStart = t;
        x0 = kin.last()?.x ?? 0;
        recorded = [];
        setStatus({ phase: 'recording', challenge: status.challenge, elapsed: 0 });
      } else if (Math.ceil(remaining) !== Math.ceil(status.remaining)) {
        setStatus({ ...status, remaining });
      }
    } else if (status.phase === 'recording') {
      const elapsed = t - phaseStart;
      if (point) recorded.push({ t: elapsed, x: point.x - x0 });
      if (elapsed >= status.challenge.duration) {
        const { score, rms } = scoreChallenge(recorded, status.challenge);
        frozenAt = t;
        setStatus({ phase: 'done', challenge: status.challenge, score, rms });
      }
    }

    draw(frozenAt ?? t);
  }
  raf = requestAnimationFrame(loop);

  // ── Desenho ──
  function draw(tEnd: number) {
    ctx.fillStyle = c.bg;
    ctx.fillRect(0, 0, W, H);
    const pad = { l: 64, r: 16, t: 14, b: 26 };
    const gap = 28;
    const plotH = (H - pad.t - pad.b - gap) / 2;
    const tStart = tEnd - WINDOW_S;
    const hist = kin.history().filter((p) => p.t >= tStart);

    // Alvo do desafio, em tempo absoluto da cena
    const ch = status.phase === 'idle' ? null : status.challenge;
    const recStart = status.phase === 'recording' || status.phase === 'done' ? phaseStart : null;
    const target = ch && recStart !== null
      ? (t: number) => (t < recStart || t > recStart + ch.duration ? null : x0 + ch.target(t - recStart))
      : null;
    const targetV = ch && recStart !== null
      ? (t: number) => {
          if (t < recStart || t > recStart + ch.duration) return null;
          const h = 0.01, tt = t - recStart;
          return (ch.target(tt + h) - ch.target(tt - h)) / (2 * h);
        }
      : null;

    const xRange = Math.max(MIN_X_RANGE, ...hist.map((p) => Math.abs(p.x) * 1.15));
    const vRange = Math.max(MIN_V_RANGE, ...hist.map((p) => Math.abs(p.v) * 1.15));

    plot(pad.t, 'Posição x (m)', xRange, hist.map((p) => [p.t, p.x]), c.x, target);
    plot(pad.t + plotH + gap, 'Velocidade v (m/s)', vRange, hist.map((p) => [p.t, p.v]), c.v, targetV);

    function plot(
      top: number, label: string, range: number, pts: number[][], color: string,
      targetFn: ((t: number) => number | null) | null,
    ) {
      const left = pad.l, right = W - pad.r, bottom = top + plotH;
      const px = (t: number) => left + ((t - tStart) / WINDOW_S) * (right - left);
      const py = (v: number) => top + plotH / 2 - (v / range) * (plotH / 2);

      // grade e eixos
      ctx.strokeStyle = c.grid;
      ctx.lineWidth = 1;
      ctx.beginPath();
      for (let s = Math.ceil(tStart); s <= tEnd; s++) { ctx.moveTo(px(s), top); ctx.lineTo(px(s), bottom); }
      for (const f of [-1, -0.5, 0.5, 1]) { ctx.moveTo(left, py(f * range)); ctx.lineTo(right, py(f * range)); }
      ctx.stroke();
      ctx.strokeStyle = c.axis;
      ctx.beginPath();
      ctx.moveTo(left, py(0)); ctx.lineTo(right, py(0));
      ctx.moveTo(left, top); ctx.lineTo(left, bottom);
      ctx.stroke();

      ctx.fillStyle = c.text;
      ctx.font = '12px Inter, system-ui, sans-serif';
      ctx.textAlign = 'right';
      ctx.textBaseline = 'middle';
      for (const f of [-1, 0, 1]) ctx.fillText((f * range).toFixed(2), left - 6, py(f * range));
      ctx.textAlign = 'left';
      ctx.textBaseline = 'top';
      ctx.font = '600 12px Inter, system-ui, sans-serif';
      ctx.fillText(label, left + 6, top + 2);

      // alvo tracejado
      if (targetFn) {
        ctx.strokeStyle = c.target;
        ctx.setLineDash([6, 5]);
        ctx.lineWidth = 2;
        ctx.beginPath();
        let started = false;
        for (let i = 0; i <= 200; i++) {
          const t = tStart + (i / 200) * WINDOW_S;
          const v = targetFn(t);
          if (v === null) { started = false; continue; }
          if (!started) { ctx.moveTo(px(t), py(v)); started = true; } else ctx.lineTo(px(t), py(v));
        }
        ctx.stroke();
        ctx.setLineDash([]);
      }

      // dados
      ctx.strokeStyle = color;
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      pts.forEach(([t, v], i) => (i ? ctx.lineTo(px(t), py(v)) : ctx.moveTo(px(t), py(v))));
      ctx.stroke();
    }

    // rótulo do eixo do tempo
    ctx.fillStyle = c.text;
    ctx.font = '12px Inter, system-ui, sans-serif';
    ctx.textAlign = 'right';
    ctx.textBaseline = 'bottom';
    ctx.fillText('tempo (últimos 8 s) →', W - pad.r, H - 4);
  }

  return api;
}
