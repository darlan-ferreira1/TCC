// Matemática dos gestos de toque do AR — pura, sem Three.js nem React.
//
// Dois dedos na tela formam um segmento A→B. Comparando o segmento no início
// do gesto com o segmento atual:
//   - a razão entre os comprimentos é o fator de ESCALA (pinça);
//   - a diferença entre os ângulos é a ROTAÇÃO (girar com dois dedos).
// Os dois gestos são extraídos do mesmo movimento, então o usuário pode
// redimensionar e girar ao mesmo tempo, como nos apps de AR comerciais.

export interface Point { x: number; y: number; }

export interface TwoFingerTransform {
  scale: number;    // fator multiplicativo (1 = sem mudança)
  rotation: number; // radianos, sentido horário na tela (Y da tela cresce para baixo)
}

const MIN_DISTANCE = 1; // px — evita divisão por zero com os dedos colados

export function twoFingerTransform(a0: Point, b0: Point, a1: Point, b1: Point): TwoFingerTransform {
  const d0 = Math.max(Math.hypot(b0.x - a0.x, b0.y - a0.y), MIN_DISTANCE);
  const d1 = Math.max(Math.hypot(b1.x - a1.x, b1.y - a1.y), MIN_DISTANCE);
  const ang0 = Math.atan2(b0.y - a0.y, b0.x - a0.x);
  const ang1 = Math.atan2(b1.y - a1.y, b1.x - a1.x);
  return { scale: d1 / d0, rotation: normalizeAngle(ang1 - ang0) };
}

// Leva o ângulo para (-π, π], para um giro pequeno nunca virar "quase uma volta".
export function normalizeAngle(a: number): number {
  let r = a % (2 * Math.PI);
  if (r <= -Math.PI) r += 2 * Math.PI;
  if (r > Math.PI) r -= 2 * Math.PI;
  return r;
}

export function clamp(v: number, min: number, max: number): number {
  return Math.min(Math.max(v, min), max);
}

// Coordenadas de tela (px) → coordenadas normalizadas do dispositivo (NDC, -1..1),
// que é o que o Raycaster do Three.js espera.
export function toNdc(p: Point, width: number, height: number): Point {
  return { x: (p.x / width) * 2 - 1, y: -(p.y / height) * 2 + 1 };
}
