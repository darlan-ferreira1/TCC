// Setup Three.js do sistema solar.
//
// Estrutura da cena:
//   - Sol: SphereGeometry com MeshBasicMaterial (não responde a luzes — emite luz própria)
//     + halo (esfera maior semi-transparente para efeito de brilho)
//     + PointLight no centro que ilumina os planetas com falloff realista
//   - Planetas: SphereGeometry com MeshPhongMaterial (iluminados pelo Sol)
//     + Saturno tem anel (RingGeometry filho da esfera, rotacionado −π/2 em X)
//   - Órbitas: LineLoop por planeta (círculos no plano XZ)
//   - Estrelas de fundo: Points com posições aleatórias em esfera grande
//
// O loop de animação acumula `t` (tempo simulado) com dt * speedFactor.
// `planetPosition(t, p)` de physics.ts devolve (x, 0, z) para cada planeta.
// Os mesh.position são atualizados diretamente a cada frame.
//
// `onTimeUpdate` é chamado a cada 10 frames para o React exibir o tempo atual.

import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { planetPosition, PLANETS } from './physics';

export interface SolarSystemConfig {
  speedFactor: number; // multiplicador de tempo (1 = 1 ano/s real ÷ algum fator)
}

export interface SolarSystemScene {
  update(config: SolarSystemConfig): void;
  getTime(): number; // tempo simulado em "anos terrestres"
  dispose(): void;
}

// Aparência visual de cada planeta (índice alinhado com PLANETS)
const VISUALS = [
  { radius: 0.16, color: 0xb5b5b5 },                                              // Mercúrio
  { radius: 0.24, color: 0xe8cda0 },                                              // Vênus
  { radius: 0.25, color: 0x4a90d9 },                                              // Terra
  { radius: 0.20, color: 0xc1440e },                                              // Marte
  { radius: 0.60, color: 0xc88b3a },                                              // Júpiter
  { radius: 0.50, color: 0xe4d191, ring: { inner: 0.70, outer: 1.20, color: 0xc8b97a } }, // Saturno
  { radius: 0.33, color: 0x7de8e8 },                                              // Urano
  { radius: 0.31, color: 0x4b70dd },                                              // Netuno
];

export function createSolarSystemScene(
  canvas: HTMLCanvasElement,
  config: SolarSystemConfig,
  onTimeUpdate?: (t: number) => void,
  bgColor = 0x020408,
): SolarSystemScene {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(bgColor);

  const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 600);
  camera.position.set(8, 28, 42);

  const controls = new OrbitControls(camera, canvas);
  controls.target.set(0, 0, 0);
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;
  camera.lookAt(0, 0, 0);
  controls.update();

  // Luz ambiente mínima para não apagar o lado noturno completamente
  scene.add(new THREE.AmbientLight(0x111122, 1.0));

  // Sol como fonte de luz pontual com falloff
  const sunLight = new THREE.PointLight(0xffdd88, 3.0, 120, 1.5);
  scene.add(sunLight);

  // --- Sol ---
  const sunGeo  = new THREE.SphereGeometry(1.2, 32, 24);
  const sunMat  = new THREE.MeshBasicMaterial({ color: 0xffdd44 });
  const sunMesh = new THREE.Mesh(sunGeo, sunMat);
  scene.add(sunMesh);

  // Halo do Sol (glow suave)
  const haloGeo  = new THREE.SphereGeometry(1.7, 32, 24);
  const haloMat  = new THREE.MeshBasicMaterial({ color: 0xff9900, transparent: true, opacity: 0.12 });
  scene.add(new THREE.Mesh(haloGeo, haloMat));

  // --- Estrelas de fundo ---
  const STAR_COUNT = 2000;
  const starPos = new Float32Array(STAR_COUNT * 3);
  for (let i = 0; i < STAR_COUNT; i++) {
    const theta = Math.random() * 2 * Math.PI;
    const phi   = Math.acos(2 * Math.random() - 1);
    const r     = 180 + Math.random() * 80;
    starPos[i * 3]     = r * Math.sin(phi) * Math.cos(theta);
    starPos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
    starPos[i * 3 + 2] = r * Math.cos(phi);
  }
  const starGeo = new THREE.BufferGeometry();
  starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
  scene.add(new THREE.Points(starGeo, new THREE.PointsMaterial({ color: 0xffffff, size: 0.3 })));

  // Material compartilhado das órbitas
  const orbitMat = new THREE.LineBasicMaterial({ color: 0x1a1a3a, transparent: true, opacity: 0.6 });

  // Cria um círculo no plano XZ como guia de órbita
  function makeOrbitRing(r: number): THREE.LineLoop {
    const N   = 128;
    const pts = Array.from({ length: N }, (_, i) => {
      const a = (i / N) * 2 * Math.PI;
      return new THREE.Vector3(r * Math.cos(a), 0, r * Math.sin(a));
    });
    return new THREE.LineLoop(new THREE.BufferGeometry().setFromPoints(pts), orbitMat);
  }

  // --- Planetas ---
  const planetMeshes: THREE.Mesh[] = [];

  PLANETS.forEach((planet, i) => {
    const vis = VISUALS[i];

    scene.add(makeOrbitRing(planet.orbitalRadius));

    const mat  = new THREE.MeshPhongMaterial({ color: vis.color, shininess: 40 });
    const mesh = new THREE.Mesh(new THREE.SphereGeometry(vis.radius, 20, 16), mat);
    scene.add(mesh);
    planetMeshes.push(mesh);

    // Anel de Saturno (índice 5)
    if ('ring' in vis && vis.ring) {
      const ringGeo = new THREE.RingGeometry(vis.ring.inner, vis.ring.outer, 64);
      const ringMat = new THREE.MeshBasicMaterial({
        color: vis.ring.color,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.85,
      });
      const ring     = new THREE.Mesh(ringGeo, ringMat);
      ring.rotation.x = -Math.PI / 2; // RingGeometry fica em XY; rotaciona pro plano XZ
      mesh.add(ring);
    }
  });

  // --- Estado da simulação ---
  let simTime     = 0;
  let speedFactor = config.speedFactor;
  let frameCount  = 0;

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

  let raf  = 0;
  let last = 0;

  function animate(ts: number) {
    raf = requestAnimationFrame(animate);
    const dt = Math.min((ts - last) / 1000, 0.05);
    last = ts;

    simTime += dt * speedFactor;

    // Atualiza posição de cada planeta
    PLANETS.forEach((planet, i) => {
      const pos = planetPosition(simTime, planet);
      planetMeshes[i].position.set(pos.x, pos.y, pos.z);
    });

    // Notifica React sobre o tempo a cada 10 frames (evita re-renders excessivos)
    if (onTimeUpdate && ++frameCount % 10 === 0) {
      onTimeUpdate(simTime);
    }

    controls.update();
    renderer.render(scene, camera);
  }
  raf = requestAnimationFrame(animate);

  return {
    update(cfg: SolarSystemConfig) {
      speedFactor = cfg.speedFactor;
    },
    getTime() {
      return simTime;
    },
    dispose() {
      cancelAnimationFrame(raf);
      ro.disconnect();
      controls.dispose();
      scene.traverse((obj) => {
        const m = obj as THREE.Mesh | THREE.Line | THREE.Points;
        if (m.geometry) m.geometry.dispose();
        if (m.material) {
          if (Array.isArray(m.material)) m.material.forEach((mat) => mat.dispose());
          else (m.material as THREE.Material).dispose();
        }
      });
      renderer.dispose();
    },
  };
}
