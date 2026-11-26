// Painel de texto 3D (uma placa com linhas de texto desenhadas num canvas).
//
// Serve para um experimento montável mostrar valores DENTRO do mundo 3D
// (contadores, tempo simulado…), sem depender do HUD de quem o hospeda.
// Só importa three: pode ser usado por qualquer scene.ts.

import * as THREE from 'three';

export interface TextPanel {
  mesh: THREE.Mesh;
  setLines(lines: string[]): void;
  dispose(): void;
}

export function createTextPanel(width: number, height: number, px = 1024): TextPanel {
  const canvas = document.createElement('canvas');
  canvas.width = px;
  canvas.height = Math.round(px * (height / width));
  const ctx = canvas.getContext('2d')!;
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  const geometry = new THREE.PlaneGeometry(width, height);
  const material = new THREE.MeshBasicMaterial({ map: texture, transparent: true, side: THREE.DoubleSide });
  const mesh = new THREE.Mesh(geometry, material);
  let last = '';

  return {
    mesh,
    setLines(lines) {
      const key = lines.join('\n');
      if (key === last) return; // só redesenha quando o texto muda
      last = key;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = 'rgba(20, 20, 42, 0.88)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      // Fonte: a maior que cabe na altura (uma linha por faixa) e na largura.
      let size = Math.min(Math.floor(canvas.height / (lines.length + 0.6)), 72);
      do {
        ctx.font = `${size}px Inter, system-ui, sans-serif`;
        size -= 2;
      } while (size > 12 && Math.max(...lines.map((l) => ctx.measureText(l).width)) > canvas.width - 48);
      ctx.fillStyle = '#e0e0f0';
      ctx.textBaseline = 'middle';
      lines.forEach((line, i) => ctx.fillText(line, 24, ((i + 0.5) * canvas.height) / lines.length));
      texture.needsUpdate = true;
    },
    dispose() {
      geometry.dispose();
      material.dispose();
      texture.dispose();
    },
  };
}
