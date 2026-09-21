// Rastreamento de mão via MediaPipe Tasks Vision.
//
// Detecta o gesto de pinça (polegar + indicador) e expõe a posição do "ponto
// de pinça" já convertida para coordenadas normalizadas de câmera (NDC, -1..1)
// e espelhada horizontalmente — o vídeo é exibido em modo selfie, então o
// gesto precisa bater com o que o usuário vê na tela, não com o frame cru.
//
// Histerese (PINCH_ENTER < PINCH_EXIT): evita que a pinça "trepide" entre
// aberta/fechada quando a distância dos dedos está bem na borda do limiar.

import { FilesetResolver, HandLandmarker } from '@mediapipe/tasks-vision';

const WASM_BASE = 'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@1.0.1/wasm';
const MODEL_URL = 'https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task';

const PINCH_ENTER = 0.35;
const PINCH_EXIT = 0.45;

export interface PinchState {
  tracking: boolean; // uma mão foi detectada neste frame (ou o mouse assumiu o controle)
  pinching: boolean; // gesto de pinça ativo
  x: number; // posição do ponto de pinça em NDC [-1, 1]
  y: number;
}

export interface HandTracker {
  detect(video: HTMLVideoElement, timestampMs: number): PinchState;
  dispose(): void;
}

export async function createHandTracker(): Promise<HandTracker> {
  const fileset = await FilesetResolver.forVisionTasks(WASM_BASE);
  const landmarker = await HandLandmarker.createFromOptions(fileset, {
    baseOptions: { modelAssetPath: MODEL_URL, delegate: 'GPU' },
    runningMode: 'VIDEO',
    numHands: 1,
  });

  let wasPinching = false;

  return {
    detect(video, timestampMs) {
      const result = landmarker.detectForVideo(video, timestampMs);
      const hand = result.landmarks[0];

      if (!hand) {
        wasPinching = false;
        return { tracking: false, pinching: false, x: 0, y: 0 };
      }

      const thumb = hand[4];
      const index = hand[8];
      const wrist = hand[0];
      const midMcp = hand[9];

      const pinchDist = Math.hypot(thumb.x - index.x, thumb.y - index.y);
      const handScale = Math.hypot(wrist.x - midMcp.x, wrist.y - midMcp.y) || 1;
      const ratio = pinchDist / handScale;

      const pinching = wasPinching ? ratio < PINCH_EXIT : ratio < PINCH_ENTER;
      wasPinching = pinching;

      const midX = (thumb.x + index.x) / 2;
      const midY = (thumb.y + index.y) / 2;

      return {
        tracking: true,
        pinching,
        x: (1 - midX) * 2 - 1,
        y: -(midY * 2 - 1),
      };
    },
    dispose() {
      landmarker.close();
    },
  };
}
