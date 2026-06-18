// Setup Three.js do pêndulo simples.
//
// Estrutura visual:
//   pivotMesh  — esfera pequena fixa na origem (ponto de suspensão)
//   pivotGroup — grupo que gira em torno de Z pelo ângulo θ
//     ├── rod  — CylinderGeometry de comprimento L, centralizado em (0, -L/2, 0)
//     └── mass — SphereGeometry fixada em (0, -L, 0)
//
// A cada frame o loop chama stepPendulum (physics.ts) e aplica:
//   pivotGroup.rotation.z = -θ
// (negativo porque rotação Z positiva no Three.js vai para a esquerda quando visto de +Z)
//
// Quando L muda, a geometria da haste é reconstruída;
// quando g ou θ₀ mudam, só o estado físico é reiniciado.

import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { stepPendulum, type PendulumState, type PendulumConfig } from './physics';

export interface PendulumSceneConfig {
  L: number;      // comprimento (m / unidades da cena)
  g: number;      // gravidade (m/s²)
  theta0: number; // ângulo inicial (rad)
}

export interface PendulumScene {
  update(config: PendulumSceneConfig): void;
  dispose(): void;
}

export function createPendulumScene(
  canvas: HTMLCanvasElement,
  config: PendulumSceneConfig,
): PendulumScene {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x0a0a1a);

  const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
  camera.position.set(0, -0.5, 8);

  const controls = new OrbitControls(camera, canvas);
  controls.target.set(0, -1.5, 0);
  controls.enableDamping = true;
  controls.dampingFactor = 0.06;
  camera.lookAt(controls.target);

  scene.add(new THREE.AmbientLight(0xffffff, 0.5));
  const dir = new THREE.DirectionalLight(0xffffff, 1.2);
  dir.position.set(3, 5, 5);
  scene.add(dir);

  // Pivô fixo — marcador visual na origem
  const pivotMesh = new THREE.Mesh(
    new THREE.SphereGeometry(0.07, 12, 8),
    new THREE.MeshPhongMaterial({ color: 0x888888 }),
  );
  scene.add(pivotMesh);

  // Grupo que gira pelo ângulo θ
  const pivotGroup = new THREE.Group();
  scene.add(pivotGroup);

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

  // Estado físico interno — atualizado a cada frame
  let state: PendulumState = { theta: config.theta0, omega: 0 };
  let physConfig: PendulumConfig = { L: config.L, g: config.g };

  pivotGroup.rotation.z = -state.theta;

  function handleResize() {
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }
  const ro = new ResizeObserver(handleResize);
  ro.observe(canvas);
  handleResize();

  let raf = 0;
  let last = 0;

  function animate(t: number) {
    raf = requestAnimationFrame(animate);
    // dt limitado a 20 ms para evitar instabilidade numérica após troca de aba
    const dt = Math.min((t - last) / 1000, 0.02);
    last = t;
    state = stepPendulum(state, physConfig, dt);
    pivotGroup.rotation.z = -state.theta;
    controls.update();
    renderer.render(scene, camera);
  }
  raf = requestAnimationFrame(animate);

  return {
    update(cfg: PendulumSceneConfig) {
      physConfig = { L: cfg.L, g: cfg.g };
      buildRod(cfg.L);
      state = { theta: cfg.theta0, omega: 0 };
      pivotGroup.rotation.z = -state.theta;
    },
    dispose() {
      cancelAnimationFrame(raf);
      ro.disconnect();
      controls.dispose();
      rodGeo?.dispose();
      massGeo.dispose();
      (pivotMesh.material as THREE.Material).dispose();
      pivotMesh.geometry.dispose();
      rodMat.dispose();
      massMat.dispose();
      renderer.dispose();
    },
  };
}
