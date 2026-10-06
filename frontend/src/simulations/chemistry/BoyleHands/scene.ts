// Cena da Lei de Boyle: <canvas> 2D transparente por cima da webcam.
//
//   - O recipiente é desenhado ENTRE as mãos do aluno: as paredes laterais
//     seguem as mãos na tela; a altura é fixa.
//   - As partículas do gás (physics.ts) batem nas paredes; a pressão medida
//     sobe quando as mãos se aproximam.
//   - No canto, o gráfico P × V vai ganhando pontos e desenha a isoterma
//     teórica (hipérbole P = N·T/V) para comparação.
//
// Como no "Você é o móvel", a cena não sabe de onde vêm as paredes: recebe
// `readWalls()` em pixels da tela (mãos via MediaPipe, ou mouse).

import {
  createGas, stepGas, pressureFromImpulse, idealPressure, temperatureOf, ema,
  MIN_WIDTH, MAX_WIDTH, type Gas,
} from './physics';

export interface BoyleReading {
  volume: number;       // A = W·H (u.a.)
  pressure: number;     // medida, média móvel (u.a.)
  ideal: number;        // N·T/A (u.a.)
  temperature: number;  // medida (u.a.)
  product: number;      // P·V medido
}

export interface BoyleSceneOptions {
  readWalls: () => { left: number; right: number } | null; // px na tela
  particles: number;
  temperature: number;
}

export interface BoyleScene {
  setTemperature(t: number): void;
  clearGraph(): void;
  onReading: ((r: BoyleReading) => void) | null;
  dispose(): void;
}

const HEIGHT_UNITS = 1;       // altura do recipiente (u.a.)
const BOX_HEIGHT_FRAC = 0.42; // altura do recipiente na tela (fração da altura do canvas)
const SUBSTEPS = 4;
const PRESSURE_TAU = 0.4;     // s
const SAMPLE_EVERY = 0.3;     // s entre pontos do gráfico P × V
const MAX_POINTS = 160;

export function createBoyleScene(canvas: HTMLCanvasElement, opts: BoyleSceneOptions): BoyleScene {
  const ctx = canvas.getContext('2d')!;
  let targetT = opts.temperature;
  const gas: Gas = createGas(opts.particles, 1.5, HEIGHT_UNITS, targetT);
  let pressure = idealPressure(gas.n, targetT, gas.width * gas.height);
  let points: { v: number; p: number }[] = [];
  let sinceSample = 0;
  let walls: { left: number; right: number } | null = null;

  const api: BoyleScene = {
    setTemperature(t) { targetT = t; },
    clearGraph() { points = []; },
    onReading: null,
    dispose() { cancelAnimationFrame(raf); ro.disconnect(); },
  };

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

  let raf = 0, last = 0, frame = 0;
  function loop(ts: number) {
    raf = requestAnimationFrame(loop);
    const dt = last ? Math.min((ts - last) / 1000, 0.05) : 0;
    last = ts;
    if (dt === 0) return;

    // Paredes na tela → largura do recipiente em unidades do gás
    const boxH = H * BOX_HEIGHT_FRAC;
    const read = opts.readWalls();
    if (read) walls = read;
    const center = walls ? (walls.left + walls.right) / 2 : W / 2;
    const targetWidth = walls ? Math.abs(walls.right - walls.left) / boxH * HEIGHT_UNITS : gas.width;

    // Física: a parede vai até a nova largura em pequenos passos
    let impulse = 0;
    const start = gas.width;
    for (let s = 1; s <= SUBSTEPS; s++) {
      impulse += stepGas(gas, dt / SUBSTEPS, start + (targetWidth - start) * (s / SUBSTEPS), targetT);
    }
    pressure = ema(pressure, pressureFromImpulse(impulse, gas, dt), dt, PRESSURE_TAU);

    const volume = gas.width * gas.height;
    sinceSample += dt;
    if (sinceSample >= SAMPLE_EVERY) {
      sinceSample = 0;
      points.push({ v: volume, p: pressure });
      if (points.length > MAX_POINTS) points.shift();
    }
    if (++frame % 6 === 0) {
      api.onReading?.({
        volume, pressure, ideal: idealPressure(gas.n, targetT, volume),
        temperature: temperatureOf(gas), product: pressure * volume,
      });
    }

    draw(center, boxH);
  }
  raf = requestAnimationFrame(loop);

  function draw(center: number, boxH: number) {
    ctx.clearRect(0, 0, W, H);
    const boxW = (gas.width / HEIGHT_UNITS) * boxH;
    const left = center - boxW / 2;
    const top = H * 0.45 - boxH / 2;
    const unit = boxH / HEIGHT_UNITS; // px por unidade do gás

    // interior do recipiente
    ctx.fillStyle = 'rgba(52, 152, 219, 0.12)';
    ctx.fillRect(left, top, boxW, boxH);

    // partículas
    ctx.fillStyle = '#5dade2';
    for (let i = 0; i < gas.n; i++) {
      ctx.beginPath();
      ctx.arc(left + gas.x[i] * unit, top + gas.y[i] * unit, 3.2, 0, Math.PI * 2);
      ctx.fill();
    }

    // paredes: fixas finas (chão/teto), móveis grossas (seguem as mãos)
    ctx.strokeStyle = 'rgba(224, 224, 240, 0.85)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(left, top); ctx.lineTo(left + boxW, top);
    ctx.moveTo(left, top + boxH); ctx.lineTo(left + boxW, top + boxH);
    ctx.stroke();
    ctx.strokeStyle = '#f39c12';
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.moveTo(left, top - 8); ctx.lineTo(left, top + boxH + 8);
    ctx.moveTo(left + boxW, top - 8); ctx.lineTo(left + boxW, top + boxH + 8);
    ctx.stroke();

    drawGraph();
  }

  // Gráfico P × V com a isoterma teórica
  function drawGraph() {
    const gw = Math.min(260, W * 0.42), gh = Math.min(180, H * 0.32);
    const gx = 12, gy = H - gh - 12;
    const pad = { l: 40, b: 26, t: 22, r: 10 };
    const vMin = MIN_WIDTH * HEIGHT_UNITS, vMax = MAX_WIDTH * HEIGHT_UNITS;
    const pMax = idealPressure(gas.n, targetT, 0.5);
    const X = (v: number) => gx + pad.l + ((v - vMin) / (vMax - vMin)) * (gw - pad.l - pad.r);
    const Y = (p: number) => gy + gh - pad.b - Math.min(p / pMax, 1.05) * (gh - pad.t - pad.b);

    ctx.fillStyle = 'rgba(10, 10, 26, 0.78)';
    ctx.fillRect(gx, gy, gw, gh);
    ctx.strokeStyle = 'rgba(224, 224, 240, 0.5)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(X(vMin), gy + pad.t); ctx.lineTo(X(vMin), Y(0)); ctx.lineTo(X(vMax), Y(0));
    ctx.stroke();

    ctx.fillStyle = '#e0e0f0';
    ctx.font = '600 12px Inter, system-ui, sans-serif';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    ctx.fillText('Pressão × Volume', gx + 8, gy + 5);
    ctx.font = '11px Inter, system-ui, sans-serif';
    ctx.fillStyle = '#9a9ac0';
    ctx.textAlign = 'right';
    ctx.textBaseline = 'bottom';
    ctx.fillText('V →', gx + gw - pad.r, gy + gh - 4);
    ctx.textAlign = 'left';
    ctx.fillText('P ↑', gx + 6, gy + pad.t + 14);

    // isoterma teórica P = N·T/V (tracejada)
    ctx.strokeStyle = '#f39c12';
    ctx.setLineDash([5, 4]);
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    for (let i = 0; i <= 60; i++) {
      const v = vMin + (i / 60) * (vMax - vMin);
      const p = idealPressure(gas.n, targetT, v);
      if (i) ctx.lineTo(X(v), Y(p)); else ctx.moveTo(X(v), Y(p));
    }
    ctx.stroke();
    ctx.setLineDash([]);

    // pontos medidos
    points.forEach((pt, i) => {
      ctx.fillStyle = `rgba(93, 173, 226, ${0.3 + 0.7 * (i / points.length)})`;
      ctx.beginPath();
      ctx.arc(X(pt.v), Y(pt.p), 2.6, 0, Math.PI * 2);
      ctx.fill();
    });
  }

  return api;
}
