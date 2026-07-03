// Setup Three.js do modelo de Bohr:
//
// 1. Núcleo: cluster esférico de esferas menores (prótons = vermelho, nêutrons = cinza).
//    Cada partícula é posicionada aleatoriamente dentro de uma esfera de raio proporcional
//    ao raio nuclear real (∝ A^(1/3)), mas mantido pequeno na cena.
//
// 2. Órbitas: anéis circulares (LineLoop) no plano XZ para cada camada.
//    Cada camada tem uma inclinação leve diferente para visualização 3D.
//
// 3. Elétrons: esferas pequenas. Positions atualizadas a cada frame via physics.ts.
//
// O loop de animação acumula tempo real (delta * speedFactor) e repassa à física.

import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import {
  computeElectronPositions,
  shellRadius,
  type BohrPhysicsConfig,
} from "./physics";

export interface BohrSceneColors {
  proton: number;
  neutron: number;
  electron: number;
  orbit: number;
  background: number;
}

export interface BohrSceneConfig {
  protons: number;
  neutrons: number;
  shells: number[];
  colors?: Partial<BohrSceneColors>;
  speedFactor?: number; // multiplicador de velocidade da animação
}

const DEFAULT_COLORS: BohrSceneColors = {
  proton: 0xe74c3c,    // vermelho
  neutron: 0x95a5a6,   // cinza
  electron: 0x3498db,  // azul claro
  orbit: 0x444466,     // roxo escuro
  background: 0x0a0a1a, // azul muito escuro
};

const PHYSICS_CONFIG: Omit<BohrPhysicsConfig, "shells"> = {
  baseRadius: 2.0,
  baseOmega: 2.0, // rad/s na camada 1
};

export interface BohrScene {
  // Atualiza a distribuição eletrônica e reconstrói os objetos dinâmicos
  update(config: BohrSceneConfig): void;
  dispose(): void;
}

export function createBohrScene(
  canvas: HTMLCanvasElement,
  initialConfig: BohrSceneConfig,
  bgColor?: number,
): BohrScene {
  const colors: BohrSceneColors = { ...DEFAULT_COLORS, ...initialConfig.colors };

  // --- Renderer ---
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setClearColor(bgColor ?? colors.background);

  // --- Cena e câmera ---
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(50, canvas.clientWidth / canvas.clientHeight, 0.1, 200);
  camera.position.set(0, 8, 18);

  // --- OrbitControls ---
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.08;
  controls.minDistance = 3;
  controls.maxDistance = 60;

  // --- Iluminação ---
  scene.add(new THREE.AmbientLight(0xffffff, 0.4));
  const pointLight = new THREE.PointLight(0xffffff, 1.5, 80);
  pointLight.position.set(0, 0, 0);
  scene.add(pointLight);

  // --- Materiais (reutilizados) ---
  const protonMat = new THREE.MeshStandardMaterial({ color: colors.proton, roughness: 0.4, metalness: 0.2 });
  const neutronMat = new THREE.MeshStandardMaterial({ color: colors.neutron, roughness: 0.5, metalness: 0.1 });
  const electronMat = new THREE.MeshStandardMaterial({ color: colors.electron, roughness: 0.3, metalness: 0.3, emissive: colors.electron, emissiveIntensity: 0.3 });
  const orbitMat = new THREE.LineBasicMaterial({ color: colors.orbit, transparent: true, opacity: 0.5 });

  // --- Grupos dinâmicos ---
  const nucleusGroup = new THREE.Group();
  const electronsGroup = new THREE.Group();
  const orbitsGroup = new THREE.Group();
  scene.add(nucleusGroup, electronsGroup, orbitsGroup);

  let currentConfig = initialConfig;
  let simTime = 0;
  let animId = 0;

  // Geometrias pequenas compartilhadas
  const nucleonGeo = new THREE.SphereGeometry(0.22, 12, 12);
  const electronGeo = new THREE.SphereGeometry(0.18, 12, 12);

  function buildNucleus(protons: number, neutrons: number) {
    nucleusGroup.clear();
    const total = protons + neutrons;
    // Raio do cluster: proporcional a A^(1/3), escalado para a cena
    const clusterR = Math.max(0.3, 0.35 * Math.cbrt(total));

    // Semente determinística via posições espalhadas em volume esférico
    const rng = seededRng(protons * 100 + neutrons);
    const types = shuffle([
      ...Array(protons).fill("proton"),
      ...Array(neutrons).fill("neutron"),
    ], rng);

    for (const type of types) {
      // Amostragem uniforme em esfera (rejeição)
      let px = 0, py = 0, pz = 0;
      do {
        px = (rng() * 2 - 1) * clusterR;
        py = (rng() * 2 - 1) * clusterR;
        pz = (rng() * 2 - 1) * clusterR;
      } while (px * px + py * py + pz * pz > clusterR * clusterR);

      const mesh = new THREE.Mesh(nucleonGeo, type === "proton" ? protonMat : neutronMat);
      mesh.position.set(px, py, pz);
      nucleusGroup.add(mesh);
    }
  }

  function buildOrbitAndElectrons(shells: number[]) {
    electronsGroup.clear();
    orbitsGroup.clear();

    const ORBIT_SEGMENTS = 128;
    // Ângulo de inclinação de cada camada para efeito visual 3D
    const tiltAngles = [0, 15, 30, 45, 60, 75, 90].map((d) => (d * Math.PI) / 180);

    shells.forEach((count, shellIndex) => {
      if (count === 0) return;
      const r = shellRadius(shellIndex, PHYSICS_CONFIG.baseRadius);
      const tilt = tiltAngles[shellIndex % tiltAngles.length];

      // Anel da órbita
      const pts: THREE.Vector3[] = [];
      for (let i = 0; i <= ORBIT_SEGMENTS; i++) {
        const a = (2 * Math.PI * i) / ORBIT_SEGMENTS;
        pts.push(new THREE.Vector3(r * Math.cos(a), 0, r * Math.sin(a)));
      }
      const orbitGeo = new THREE.BufferGeometry().setFromPoints(pts);
      const orbitLine = new THREE.LineLoop(orbitGeo, orbitMat);
      orbitLine.rotation.x = tilt;
      orbitsGroup.add(orbitLine);

      // Elétrons desta camada
      for (let i = 0; i < count; i++) {
        const mesh = new THREE.Mesh(electronGeo, electronMat);
        // userData carrega a inclinação da camada para rotacionar a posição
        mesh.userData = { shellIndex, tilt };
        electronsGroup.add(mesh);
      }
    });
  }

  function updateElectronPositions(shells: number[], t: number) {
    const physCfg: BohrPhysicsConfig = { shells, ...PHYSICS_CONFIG };
    const states = computeElectronPositions(physCfg, t);

    const meshes = electronsGroup.children as THREE.Mesh[];
    states.forEach((state, i) => {
      if (!meshes[i]) return;
      const tilt = (meshes[i].userData as { tilt: number }).tilt;
      // Aplica a inclinação da órbita ao vetor posição no plano XZ
      // y' = x*0 + y*cos(tilt) - z*sin(tilt)  =>  rotação em X
      const x = state.x;
      const z = state.z;
      meshes[i].position.set(x, -z * Math.sin(tilt), z * Math.cos(tilt));
    });
  }

  function rebuild(cfg: BohrSceneConfig) {
    buildNucleus(cfg.protons, cfg.neutrons);
    buildOrbitAndElectrons(cfg.shells);
  }

  // Resize handler
  function onResize() {
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h, false);
  }
  const resizeObserver = new ResizeObserver(onResize);
  resizeObserver.observe(canvas);
  onResize();

  // Loop de animação
  const clock = new THREE.Clock();
  function animate() {
    animId = requestAnimationFrame(animate);
    const delta = clock.getDelta();
    simTime += delta * (currentConfig.speedFactor ?? 1.0);
    updateElectronPositions(currentConfig.shells, simTime);
    controls.update();
    renderer.render(scene, camera);
  }

  // Inicializa
  rebuild(initialConfig);
  animate();

  return {
    update(cfg: BohrSceneConfig) {
      currentConfig = cfg;
      rebuild(cfg);
    },
    dispose() {
      cancelAnimationFrame(animId);
      resizeObserver.disconnect();
      controls.dispose();
      renderer.dispose();
      protonMat.dispose();
      neutronMat.dispose();
      electronMat.dispose();
      orbitMat.dispose();
      nucleonGeo.dispose();
      electronGeo.dispose();
    },
  };
}

// --- Utilitários determinísticos ---

function seededRng(seed: number): () => number {
  // Xorshift32 simples para posicionamento reproduzível do núcleo
  let s = seed === 0 ? 1 : seed;
  return () => {
    s ^= s << 13;
    s ^= s >> 17;
    s ^= s << 5;
    return (s >>> 0) / 0xffffffff;
  };
}

function shuffle<T>(arr: T[], rng: () => number): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
