// Detecção do gesto de pinça para a Dissecação.
//
// O rastreamento das mãos em si mora em core/handTracking.ts (compartilhado
// com outros experimentos de webcam); aqui fica só a regra específica desta
// simulação: transformar os pontos da mão num PinchState.
//
// Detecta o gesto de pinça (polegar + indicador) e expõe a posição do "ponto
// de pinça" já convertida para coordenadas normalizadas de câmera (NDC, -1..1)
// e espelhada horizontalmente — o vídeo é exibido em modo selfie, então o
// gesto precisa bater com o que o usuário vê na tela, não com o frame cru.
//
// Histerese (PINCH_ENTER < PINCH_EXIT): evita que a pinça "trepide" entre
// aberta/fechada quando a distância dos dedos está bem na borda do limiar.

import {
  createHandLandmarkTracker, mirrorX, INDEX_TIP, MIDDLE_MCP, THUMB_TIP, WRIST,
} from '../../../core/handTracking';

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
  const tracker = await createHandLandmarkTracker(1);
  let wasPinching = false;

  return {
    detect(video, timestampMs) {
      const hand = tracker.detect(video, timestampMs)[0];

      if (!hand) {
        wasPinching = false;
        return { tracking: false, pinching: false, x: 0, y: 0 };
      }

      const thumb = hand[THUMB_TIP];
      const index = hand[INDEX_TIP];
      const wrist = hand[WRIST];
      const midMcp = hand[MIDDLE_MCP];

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
        x: mirrorX(midX) * 2 - 1,
        y: -(midY * 2 - 1),
      };
    },
    dispose() {
      tracker.dispose();
    },
  };
}
