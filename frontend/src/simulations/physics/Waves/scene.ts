// Setup Three.js da simulação de onda.
//
// Geometria:
//   PlaneGeometry(10, 6, 240, 30) — plano bem subdividido no eixo X (direção de propagação).
//   O plano é rotacionado −π/2 em X para ficar horizontal (XZ world).
//   Relação local → world com essa rotação: local(x, y, z) → world(x, z, −y).
//   Portanto: world_y = local_z.
//
// A cada frame, para cada vértice i:
//   x_world = positions.getX(i)   (inalterado pela rotação em X)
//   positions.setZ(i, waveDisplacement(x_world, t, params))
//   → world_y = deslocamento da onda ✓
//
// 240 segmentos em X / largura 10 = vértice a cada 0.042 m →
// ~24 pontos por λ no mínimo (λ_min = 1 m), suficiente para curvas suaves.

import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { waveDisplacement, type WaveParams } from './physics';

export interface WaveSceneConfig extends WaveParams {}

export interface WaveScene {
  update(config: WaveSceneConfig): void;
  dispose(): void;
}

const PLANE_W    = 10;  // extensão em X (direção de propagação)
const PLANE_H    = 6;   // extensão em Z (profundidade da cena)
const SEGS_X     = 240; // segmentos ao longo de X
const SEGS_Z     = 30;  // segmentos ao longo de Z (profundidade)

export function createWaveScene(
  canvas: HTMLCanvasElement,
  config: WaveSceneConfig,
  bgColor = 0x0a0a1a,
): WaveScene {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(bgColor);

  const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 100);
  camera.position.set(0, 5, 7);
  camera.lookAt(0, 0, 0);

  const controls = new OrbitControls(camera, canvas);
  controls.target.set(0, 0, 0);
  controls.enableDamping = true;
  controls.dampingFactor = 0.06;

  scene.add(new THREE.AmbientLight(0xffffff, 0.4));
  const dir = new THREE.DirectionalLight(0xffffff, 1.4);
  dir.position.set(3, 10, 4);
  scene.add(dir);
  // Luz suave vinda de baixo para iluminar a face inferior das cristas
  const fill = new THREE.DirectionalLight(0x4488aa, 0.4);
  fill.position.set(-3, -5, -2);
  scene.add(fill);

  // Superfície da onda
  const geo = new THREE.PlaneGeometry(PLANE_W, PLANE_H, SEGS_X, SEGS_Z);
  const mat = new THREE.MeshPhongMaterial({
    color:    new THREE.Color(0x0077aa),
    specular: new THREE.Color(0x88ddff),
    shininess: 120,
    side: THREE.DoubleSide,
  });
  const mesh = new THREE.Mesh(geo, mat);
  mesh.rotation.x = -Math.PI / 2; // plano horizontal: Z local → Y world
  scene.add(mesh);

  const positions = geo.attributes.position as THREE.BufferAttribute;

  let params: WaveParams = { ...config };
  let t = 0;

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

  function animate(ts: number) {
    raf = requestAnimationFrame(animate);
    const dt = Math.min((ts - last) / 1000, 0.05);
    last = ts;
    t += dt;

    // Desloca cada vértice em Z local (= Y world após rotação)
    for (let i = 0; i < positions.count; i++) {
      const x = positions.getX(i); // x local = x world
      positions.setZ(i, waveDisplacement(x, t, params));
    }
    positions.needsUpdate = true;
    geo.computeVertexNormals(); // recalcula normais para iluminação correta

    controls.update();
    renderer.render(scene, camera);
  }
  raf = requestAnimationFrame(animate);

  return {
    update(cfg: WaveSceneConfig) {
      params = { ...cfg };
    },
    dispose() {
      cancelAnimationFrame(raf);
      ro.disconnect();
      controls.dispose();
      geo.dispose();
      mat.dispose();
      renderer.dispose();
    },
  };
}
