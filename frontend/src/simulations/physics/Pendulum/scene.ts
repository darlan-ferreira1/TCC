// Cena do pêndulo simples — experimento MONTÁVEL (ver core/mountable.ts e
// ARQUITETURA.md, seção 22).
//
// `pendulum.mount(root)` só cria os objetos do pêndulo dentro de `root`:
//   pivotMesh  — esfera pequena fixa na origem (ponto de suspensão)
//   pivotGroup — grupo que gira em torno de Z pelo ângulo θ
//     ├── rod  — CylinderGeometry de comprimento L, centralizado em (0, -L/2, 0)
//     └── mass — SphereGeometry fixada em (0, -L, 0)
//
// A cada `tick(dt)` chama stepPendulum (physics.ts) e aplica:
//   pivotGroup.rotation.z = -θ
// (negativo porque rotação Z positiva no Three.js vai para a esquerda quando visto de +Z)
//
// Quando L muda, a geometria da haste é reconstruída;
// quando g ou θ₀ mudam, só o estado físico é reiniciado.
//
// Quem cria renderer, câmera, luzes e laço é o hospedeiro:
//   - createPendulumScene (abaixo) → página, via hostInPage;
//   - Pendulum/sala.ts            → sala do Museu Virtual.

import * as THREE from 'three';
import { hostInPage } from '../../../core/hostInPage';
import type { MountableExperiment, MountedExperiment } from '../../../core/mountable';
import { stepPendulum, type PendulumState, type PendulumConfig } from './physics';

export interface PendulumSceneConfig {
  L: number;      // comprimento (m / unidades da cena)
  g: number;      // gravidade (m/s²)
  theta0: number; // ângulo inicial (rad)
}

const MAX_STEP = 0.02; // s — maior passo de integração aceito

// Extras usados pela sala interativa (pegar e soltar a massa com a mão).
export interface MountedPendulum extends MountedExperiment<PendulumSceneConfig> {
  bob: THREE.Object3D;
  grab(theta: number): void; // segura a massa no ângulo θ (a física pausa)
  release(): void;           // solta a partir do repouso
}

export const pendulum: MountableExperiment<PendulumSceneConfig, MountedPendulum> = {
  mount({ root }, config) {
    // Pivô fixo — marcador visual na origem
    const pivotGeo = new THREE.SphereGeometry(0.07, 12, 8);
    const pivotMat = new THREE.MeshPhongMaterial({ color: 0x888888 });
    const pivotMesh = new THREE.Mesh(pivotGeo, pivotMat);
    root.add(pivotMesh);

    // Grupo que gira pelo ângulo θ
    const pivotGroup = new THREE.Group();
    root.add(pivotGroup);

    const rodMat  = new THREE.MeshPhongMaterial({ color: 0x95a5a6, shininess: 50 });
    const massMat = new THREE.MeshPhongMaterial({ color: 0xe74c3c, shininess: 90 });

    // Massa (bob) — geometria fixa, apenas a posição Y muda com L
    const massGeo  = new THREE.SphereGeometry(0.18, 16, 12);
    const massMesh = new THREE.Mesh(massGeo, massMat);
    pivotGroup.add(massMesh);

    let rodMesh: THREE.Mesh | null = null;
    let rodGeo: THREE.CylinderGeometry | null = null;

    function buildRod(L: number) {
      if (rodMesh) pivotGroup.remove(rodMesh);
      rodGeo?.dispose();
      rodGeo = new THREE.CylinderGeometry(0.025, 0.025, L, 8, 1);
      rodMesh = new THREE.Mesh(rodGeo, rodMat);
      rodMesh.position.set(0, -L / 2, 0);
      pivotGroup.add(rodMesh);
      massMesh.position.set(0, -L, 0);
    }

    buildRod(config.L);

    // Estado físico interno — atualizado a cada tick
    let state: PendulumState = { theta: config.theta0, omega: 0 };
    let physConfig: PendulumConfig = { L: config.L, g: config.g };
    let held = false;

    pivotGroup.rotation.z = -state.theta;

    return {
      bob: massMesh,
      tick(dt) {
        if (held) return;
        // Subdivide passos grandes: o integrador perde precisão acima de ~20 ms.
        // Antes isso era garantido pelo teto de dt do laço próprio; agora o laço
        // é do hospedeiro, então a garantia mora aqui, junto da física.
        for (let remaining = dt; remaining > 0; remaining -= MAX_STEP) {
          state = stepPendulum(state, physConfig, Math.min(remaining, MAX_STEP));
        }
        pivotGroup.rotation.z = -state.theta;
      },
      update(cfg) {
        physConfig = { L: cfg.L, g: cfg.g };
        buildRod(cfg.L);
        state = { theta: cfg.theta0, omega: 0 };
        held = false;
        pivotGroup.rotation.z = -state.theta;
      },
      grab(theta) {
        held = true;
        state = { theta, omega: 0 };
        pivotGroup.rotation.z = -theta;
      },
      release() {
        held = false;
        state = { theta: state.theta, omega: 0 };
      },
      dispose() {
        root.remove(pivotMesh, pivotGroup);
        rodGeo?.dispose();
        massGeo.dispose();
        pivotGeo.dispose();
        pivotMat.dispose();
        rodMat.dispose();
        massMat.dispose();
      },
    };
  },
};

// ── Hospedeiro "página" (mesma assinatura de antes da migração) ──

export interface PendulumScene {
  update(config: PendulumSceneConfig): void;
  dispose(): void;
}

export function createPendulumScene(
  canvas: HTMLCanvasElement,
  config: PendulumSceneConfig,
  bgColor = 0x0a0a1a,
): PendulumScene {
  return hostInPage(canvas, pendulum, config, {
    background: bgColor,
    camera: { position: [0, -0.5, 8], target: [0, -1.5, 0], fov: 45, far: 100 },
    lights(scene) {
      scene.add(new THREE.AmbientLight(0xffffff, 0.5));
      const dir = new THREE.DirectionalLight(0xffffff, 1.2);
      dir.position.set(3, 5, 5);
      scene.add(dir);
    },
  });
}
