// Cena WebXR-AR do Modelo de Bohr.
//
// Escala para AR: baseRadius = 0.3 m → shell 1 fica a 30 cm do núcleo.
// Shell 2 = 1.2 m, shell 3 = 2.7 m (o usuário caminha pelo átomo).
//
// O átomo é fixado em (0, 1.2, −1.5) no espaço de referência AR:
//   − 1.5 m à frente de onde a câmera estava quando a sessão começou.
//   − 1.2 m de altura (nível dos olhos do usuário).
//
// No modo desktop (AR não disponível): fundo escuro + OrbitControls.
// Na sessão AR: fundo transparente (câmera real), OrbitControls desativados.
//
// Interação:
//   Gatilho direito → próximo elemento.
//   Gatilho esquerdo → elemento anterior.
//   Controles HTML permanecem visíveis na tela durante a sessão AR.

import * as THREE from 'three';
import { ARButton } from 'three/examples/jsm/webxr/ARButton.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { computeElectronPositions, shellRadius } from '../BohrModel/physics';

export const AR_ELEMENTS: [string, string, number, number, number[]][] = [
  ['H',  'Hidrogênio',  1,  0,  [1]],
  ['He', 'Hélio',       2,  2,  [2]],
  ['Li', 'Lítio',       3,  4,  [2, 1]],
  ['Be', 'Berílio',     4,  5,  [2, 2]],
  ['B',  'Boro',        5,  6,  [2, 3]],
  ['C',  'Carbono',     6,  6,  [2, 4]],
  ['N',  'Nitrogênio',  7,  7,  [2, 5]],
  ['O',  'Oxigênio',    8,  8,  [2, 6]],
  ['F',  'Flúor',       9,  10, [2, 7]],
  ['Ne', 'Neônio',      10, 10, [2, 8]],
  ['Na', 'Sódio',       11, 12, [2, 8, 1]],
  ['Mg', 'Magnésio',    12, 12, [2, 8, 2]],
  ['Al', 'Alumínio',    13, 14, [2, 8, 3]],
  ['Si', 'Silício',     14, 14, [2, 8, 4]],
  ['P',  'Fósforo',     15, 16, [2, 8, 5]],
  ['S',  'Enxofre',     16, 16, [2, 8, 6]],
  ['Cl', 'Cloro',       17, 18, [2, 8, 7]],
  ['Ar', 'Argônio',     18, 22, [2, 8, 8]],
  ['K',  'Potássio',    19, 20, [2, 8, 8, 1]],
  ['Ca', 'Cálcio',      20, 20, [2, 8, 8, 2]],
];

const BASE_RADIUS = 0.30; // metros por camada n=1
const BASE_OMEGA  = 0.7;
const ATOM_POS    = new THREE.Vector3(0, 1.2, -1.5);

export interface ARBohrScene {
  arButton: HTMLElement;
  onElementChange: ((index: number) => void) | null;
  setElement(index: number): void;
  dispose(): void;
}

export function createARBohrScene(container: HTMLDivElement): ARBohrScene {
  // ── Renderer com alpha para passthrough da câmera ──
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.setClearColor(0x0a0a1a, 1); // fundo escuro no preview desktop
  renderer.xr.enabled = true;
  container.appendChild(renderer.domElement);

  const arButton = ARButton.createButton(renderer);

  // ── Cena ──
  const scene  = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(70, container.clientWidth / container.clientHeight, 0.001, 100);
  camera.position.set(0, 1.6, 1.5);

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.target.copy(ATOM_POS);
  controls.enableDamping = true;
  controls.dampingFactor = 0.08;

  renderer.xr.addEventListener('sessionstart', () => {
    renderer.setClearColor(0x000000, 0); // fundo transparente → câmera real aparece
    controls.enabled = false;
  });
  renderer.xr.addEventListener('sessionend', () => {
    renderer.setClearColor(0x0a0a1a, 1);
    controls.enabled = true;
  });

  // ── Iluminação (neutra para combinar com ambiente real) ──
  scene.add(new THREE.HemisphereLight(0xffffff, 0x444444, 1.0));
  const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
  dirLight.position.set(1, 3, 2);
  scene.add(dirLight);

  // ── Materiais ──
  const protonMat   = new THREE.MeshStandardMaterial({ color: 0xe74c3c, roughness: 0.3, metalness: 0.4 });
  const neutronMat  = new THREE.MeshStandardMaterial({ color: 0x95a5a6, roughness: 0.5, metalness: 0.2 });
  const electronMat = new THREE.MeshStandardMaterial({
    color: 0x3498db, emissive: 0x1a4488, emissiveIntensity: 0.8,
    roughness: 0.2, metalness: 0.5,
  });
  const orbitMat = new THREE.LineBasicMaterial({ color: 0x4455aa, transparent: true, opacity: 0.6 });

  // ── Grupos ──
  const atomGroup      = new THREE.Group();
  atomGroup.position.copy(ATOM_POS);
  scene.add(atomGroup);
  const nucleusGroup   = new THREE.Group();
  const electronsGroup = new THREE.Group();
  const orbitsGroup    = new THREE.Group();
  atomGroup.add(nucleusGroup, electronsGroup, orbitsGroup);

  const nucleonGeo  = new THREE.SphereGeometry(0.022, 16, 12);
  const electronGeo = new THREE.SphereGeometry(0.018, 16, 12);
  let orbitDisposables: THREE.BufferGeometry[] = [];

  // ── Controladores XR (para quando houver) ──
  const ctrl0 = renderer.xr.getController(0);
  const ctrl1 = renderer.xr.getController(1);
  [ctrl0, ctrl1].forEach((ctrl) => {
    const geo = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(0, 0, -1),
    ]);
    ctrl.add(new THREE.Line(geo, new THREE.LineBasicMaterial({ color: 0x88aaff, opacity: 0.4, transparent: true })));
    scene.add(ctrl);
  });

  // ── Estado ──
  let elemIndex = 5; // Carbono
  let simTime   = 0;

  const api: ARBohrScene = {
    arButton,
    onElementChange: null,
    setElement(idx) { elemIndex = idx; applyElement(idx); },
    dispose,
  };

  ctrl0.addEventListener('selectstart', () => {
    elemIndex = (elemIndex + 1) % AR_ELEMENTS.length;
    applyElement(elemIndex);
  });
  ctrl1.addEventListener('selectstart', () => {
    elemIndex = (elemIndex - 1 + AR_ELEMENTS.length) % AR_ELEMENTS.length;
    applyElement(elemIndex);
  });

  function seededRng(seed: number) {
    let s = seed === 0 ? 1 : seed;
    return () => { s ^= s << 13; s ^= s >> 17; s ^= s << 5; return (s >>> 0) / 0xffffffff; };
  }

  function buildAtom(protons: number, neutrons: number, shells: number[]) {
    nucleusGroup.clear();
    electronsGroup.clear();
    orbitsGroup.clear();
    orbitDisposables.forEach((g) => g.dispose());
    orbitDisposables = [];

    const total    = protons + neutrons;
    const clusterR = Math.max(0.02, 0.028 * Math.cbrt(total));
    const rng      = seededRng(protons * 100 + neutrons);
    for (let i = 0; i < total; i++) {
      let px = 0, py = 0, pz = 0;
      do {
        px = (rng() * 2 - 1) * clusterR;
        py = (rng() * 2 - 1) * clusterR;
        pz = (rng() * 2 - 1) * clusterR;
      } while (px * px + py * py + pz * pz > clusterR * clusterR);
      const m = new THREE.Mesh(nucleonGeo, i < protons ? protonMat : neutronMat);
      m.position.set(px, py, pz);
      nucleusGroup.add(m);
    }

    const tiltAngles = [0, 15, 30, 45, 60, 75, 90].map((d) => (d * Math.PI) / 180);
    shells.forEach((count, si) => {
      if (count === 0) return;
      const r    = shellRadius(si, BASE_RADIUS);
      const tilt = tiltAngles[si % tiltAngles.length];
      const pts: THREE.Vector3[] = [];
      for (let i = 0; i <= 128; i++) {
        const a = (2 * Math.PI * i) / 128;
        pts.push(new THREE.Vector3(r * Math.cos(a), 0, r * Math.sin(a)));
      }
      const geo  = new THREE.BufferGeometry().setFromPoints(pts);
      orbitDisposables.push(geo);
      const ring = new THREE.LineLoop(geo, orbitMat);
      ring.rotation.x = tilt;
      orbitsGroup.add(ring);
      for (let i = 0; i < count; i++) {
        const m = new THREE.Mesh(electronGeo, electronMat);
        m.userData = { tilt };
        electronsGroup.add(m);
      }
    });
  }

  function updateElectrons(shells: number[], t: number) {
    const states = computeElectronPositions({ shells, baseRadius: BASE_RADIUS, baseOmega: BASE_OMEGA }, t);
    const meshes = electronsGroup.children as THREE.Mesh[];
    states.forEach((s, i) => {
      if (!meshes[i]) return;
      const { tilt } = meshes[i].userData as { tilt: number };
      meshes[i].position.set(s.x, -s.z * Math.sin(tilt), s.z * Math.cos(tilt));
    });
  }

  function applyElement(idx: number) {
    const [sym, name, p, n, shells] = AR_ELEMENTS[idx];
    buildAtom(p, n, shells);
    api.onElementChange?.(idx);
    void sym; void name; // usados no index.tsx via callback
  }

  // ── Resize ──
  const ro = new ResizeObserver(() => {
    if (renderer.xr.isPresenting) return;
    renderer.setSize(container.clientWidth, container.clientHeight);
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
  });
  ro.observe(container);

  // ── Init ──
  applyElement(elemIndex);

  // ── Loop ──
  const clock = new THREE.Clock();
  renderer.setAnimationLoop(() => {
    simTime += clock.getDelta();
    updateElectrons(AR_ELEMENTS[elemIndex][4], simTime);
    controls.update();
    renderer.render(scene, camera);
  });

  function dispose() {
    renderer.setAnimationLoop(null);
    ro.disconnect();
    controls.dispose();
    protonMat.dispose();
    neutronMat.dispose();
    electronMat.dispose();
    orbitMat.dispose();
    nucleonGeo.dispose();
    electronGeo.dispose();
    orbitDisposables.forEach((g) => g.dispose());
    renderer.dispose();
    renderer.domElement.remove();
  }

  return api;
}
