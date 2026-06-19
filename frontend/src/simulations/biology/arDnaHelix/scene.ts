// Cena WebXR-AR da Dupla Hélice de DNA.
//
// Escala para AR:
//   RADIUS_AR = 0.4 m   (diâmetro da hélice = 80 cm)
//   RISE_AR   = 0.09 m/bp
//   16 bp padrão → altura total = 1.44 m (pouco mais que uma pessoa)
//
// Posicionamento:
//   dnaGroup em (0, 0, −1.5): 1.5 m à frente da câmera ao iniciar a sessão.
//   A hélice é centralizada verticalmente em y=0, então vai de −0.72 m a +0.72 m
//   (quase chão a cabeça do usuário médio).
//
// No modo desktop: fundo escuro + OrbitControls.
// Na sessão AR: fundo transparente + câmera real.
//
// Interação:
//   Gatilho direito → +2 pares de base.
//   Gatilho esquerdo → −2 pares de base.
//   Slider HTML também funciona durante a sessão AR.

import * as THREE from 'three';
import { ARButton } from 'three/examples/jsm/webxr/ARButton.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

const RADIUS_AR  = 0.40;
const RISE_AR    = 0.09;
const BP_PER_TURN = 10;
const MIN_BP     = 6;
const MAX_BP     = 30;
const DNA_POS    = new THREE.Vector3(0, 0, -1.5);

// Geometria da esfera e dimensões dos tubos em escala AR
const SPHERE_R = 0.055;
const TUBE_R   = 0.030;
const RUNG_R   = 0.020;

export interface ARDnaScene {
  arButton: HTMLElement;
  onBasePairsChange: ((n: number) => void) | null;
  setBasePairs(n: number): void;
  dispose(): void;
}

export function createARDnaScene(container: HTMLDivElement): ARDnaScene {
  // ── Renderer ──
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.setClearColor(0x020d06, 1);
  renderer.xr.enabled = true;
  container.appendChild(renderer.domElement);

  const arButton = ARButton.createButton(renderer);

  // ── Cena ──
  const scene  = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(70, container.clientWidth / container.clientHeight, 0.001, 100);
  camera.position.set(0, 1.6, 1.5);

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.target.copy(DNA_POS);
  controls.enableDamping = true;
  controls.dampingFactor = 0.08;

  renderer.xr.addEventListener('sessionstart', () => {
    renderer.setClearColor(0x000000, 0);
    controls.enabled = false;
  });
  renderer.xr.addEventListener('sessionend', () => {
    renderer.setClearColor(0x020d06, 1);
    controls.enabled = true;
  });

  // ── Iluminação ──
  scene.add(new THREE.HemisphereLight(0xffffff, 0x224422, 1.0));
  const dirLight = new THREE.DirectionalLight(0xffffff, 0.9);
  dirLight.position.set(2, 4, 3);
  scene.add(dirLight);

  // ── Materiais ──
  const mat = {
    strand1: new THREE.MeshPhongMaterial({ color: 0xe74c3c, shininess: 90 }),
    strand2: new THREE.MeshPhongMaterial({ color: 0x3498db, shininess: 90 }),
    rungA:   new THREE.MeshPhongMaterial({ color: 0xf39c12, shininess: 70 }),
    rungB:   new THREE.MeshPhongMaterial({ color: 0x2ecc71, shininess: 70 }),
  };

  const sphereGeo = new THREE.SphereGeometry(SPHERE_R, 14, 10);
  let disposables: THREE.BufferGeometry[] = [];

  // ── Grupo do DNA ──
  const dnaGroup = new THREE.Group();
  dnaGroup.position.copy(DNA_POS);
  scene.add(dnaGroup);

  // ── Controladores XR ──
  const ctrl0 = renderer.xr.getController(0);
  const ctrl1 = renderer.xr.getController(1);
  [ctrl0, ctrl1].forEach((ctrl) => {
    const geo = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(0, 0, -1),
    ]);
    ctrl.add(new THREE.Line(geo, new THREE.LineBasicMaterial({ color: 0x44ff88, opacity: 0.4, transparent: true })));
    scene.add(ctrl);
  });

  // ── Estado ──
  let currentBP = 16;

  const api: ARDnaScene = {
    arButton,
    onBasePairsChange: null,
    setBasePairs(n) { currentBP = clamp(n); rebuild(currentBP); },
    dispose,
  };

  function clamp(n: number) { return Math.max(MIN_BP, Math.min(MAX_BP, n)); }

  ctrl0.addEventListener('selectstart', () => { currentBP = clamp(currentBP + 2); rebuild(currentBP); });
  ctrl1.addEventListener('selectstart', () => { currentBP = clamp(currentBP - 2); rebuild(currentBP); });

  // ── Geometria da hélice ──
  function computeHelix(bp: number) {
    const angStep = (2 * Math.PI) / BP_PER_TURN;
    const totalH  = bp * RISE_AR;
    const yOffset = -totalH / 2; // centraliza verticalmente
    const s1: THREE.Vector3[] = [];
    const s2: THREE.Vector3[] = [];
    for (let i = 0; i < bp; i++) {
      const angle = i * angStep;
      const y     = yOffset + i * RISE_AR;
      s1.push(new THREE.Vector3(RADIUS_AR * Math.cos(angle),           y, RADIUS_AR * Math.sin(angle)));
      s2.push(new THREE.Vector3(RADIUS_AR * Math.cos(angle + Math.PI), y, RADIUS_AR * Math.sin(angle + Math.PI)));
    }
    return { s1, s2 };
  }

  function makeCylinder(a: THREE.Vector3, b: THREE.Vector3, m: THREE.Material): THREE.Mesh {
    const geo = new THREE.CylinderGeometry(RUNG_R, RUNG_R, a.distanceTo(b), 10, 1);
    disposables.push(geo);
    const mesh = new THREE.Mesh(geo, m);
    mesh.position.copy(a).lerp(b, 0.5);
    mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), b.clone().sub(a).normalize());
    return mesh;
  }

  function buildGeometry(bp: number) {
    while (dnaGroup.children.length) dnaGroup.remove(dnaGroup.children[0]);
    disposables.forEach((g) => g.dispose());
    disposables = [];

    const { s1, s2 } = computeHelix(bp);

    if (bp >= 2) {
      const tGeo1 = new THREE.TubeGeometry(new THREE.CatmullRomCurve3(s1), bp * 4, TUBE_R, 10, false);
      const tGeo2 = new THREE.TubeGeometry(new THREE.CatmullRomCurve3(s2), bp * 4, TUBE_R, 10, false);
      disposables.push(tGeo1, tGeo2);
      dnaGroup.add(new THREE.Mesh(tGeo1, mat.strand1));
      dnaGroup.add(new THREE.Mesh(tGeo2, mat.strand2));
    }

    for (let i = 0; i < bp; i++) {
      const a = s1[i], b = s2[i];
      const m1 = new THREE.Mesh(sphereGeo, mat.strand1); m1.position.copy(a); dnaGroup.add(m1);
      const m2 = new THREE.Mesh(sphereGeo, mat.strand2); m2.position.copy(b); dnaGroup.add(m2);
      dnaGroup.add(makeCylinder(a, b, i % 2 === 0 ? mat.rungA : mat.rungB));
    }
  }

  function rebuild(bp: number) {
    buildGeometry(bp);
    api.onBasePairsChange?.(bp);
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
  rebuild(currentBP);

  // ── Loop ──
  let last = 0;
  renderer.setAnimationLoop((t: number) => {
    const dt = Math.min((t - last) / 1000, 0.05);
    last = t;
    dnaGroup.rotation.y += 0.2 * dt * Math.PI * 2;
    controls.update();
    renderer.render(scene, camera);
  });

  function dispose() {
    renderer.setAnimationLoop(null);
    ro.disconnect();
    controls.dispose();
    sphereGeo.dispose();
    disposables.forEach((g) => g.dispose());
    Object.values(mat).forEach((m) => m.dispose());
    renderer.dispose();
    renderer.domElement.remove();
  }

  return api;
}
