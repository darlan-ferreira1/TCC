// Setup Three.js da hélice de DNA.
//
// Estrutura visual:
//   - Dois tubos (TubeGeometry sobre CatmullRomCurve3) para as fitas backbone.
//   - Esferas (SphereGeometry) em cada posição de nucleotídeo.
//   - Cilindros (CylinderGeometry) ligando strand1[i] ↔ strand2[i] — os "degraus".
//     Alternando 2 cores para representar os pares A-T e G-C.
//   - Um único Group (dnaGroup) gira no eixo Y a cada frame, produzindo a rotação lenta.
//
// Atualização de parâmetros: destrói e reconstrói a geometria do dnaGroup,
// reutilizando materiais e a geometria da esfera.

import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { computeDnaHelix } from './physics';

export interface DnaSceneConfig {
  basePairs: number;
  rotationSpeed: number; // voltas por segundo no eixo Y
}

export interface DnaScene {
  update(config: DnaSceneConfig): void;
  dispose(): void;
}

export function createDnaScene(
  canvas: HTMLCanvasElement,
  config: DnaSceneConfig,
  bgColor = 0x0a0a1a,
): DnaScene {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(bgColor);

  const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 200);
  camera.position.set(0, 0, 14);

  const controls = new OrbitControls(camera, canvas);
  controls.enableDamping = true;
  controls.dampingFactor = 0.06;

  scene.add(new THREE.AmbientLight(0xffffff, 0.5));
  const dir = new THREE.DirectionalLight(0xffffff, 1.2);
  dir.position.set(5, 10, 8);
  scene.add(dir);

  const dnaGroup = new THREE.Group();
  scene.add(dnaGroup);

  // Materiais reutilizados entre rebuilds
  const mat = {
    strand1: new THREE.MeshPhongMaterial({ color: 0xe74c3c, shininess: 80 }), // vermelho
    strand2: new THREE.MeshPhongMaterial({ color: 0x3498db, shininess: 80 }), // azul
    rungA:   new THREE.MeshPhongMaterial({ color: 0xf39c12, shininess: 60 }), // laranja — par A-T
    rungB:   new THREE.MeshPhongMaterial({ color: 0x2ecc71, shininess: 60 }), // verde   — par G-C
  };

  // Geometria da esfera compartilhada (não é descartada no rebuild)
  const sphereGeo = new THREE.SphereGeometry(0.13, 12, 8);

  // Geometrias descartáveis geradas a cada rebuild (tubos e cilindros)
  let disposables: THREE.BufferGeometry[] = [];

  let currentSpeed = config.rotationSpeed;

  function cylinder(a: THREE.Vector3, b: THREE.Vector3, r: number, m: THREE.Material): THREE.Mesh {
    const geo = new THREE.CylinderGeometry(r, r, a.distanceTo(b), 8, 1);
    disposables.push(geo);
    const mesh = new THREE.Mesh(geo, m);
    mesh.position.copy(a).lerp(b, 0.5);
    mesh.quaternion.setFromUnitVectors(
      new THREE.Vector3(0, 1, 0),
      b.clone().sub(a).normalize(),
    );
    return mesh;
  }

  function buildGeometry(basePairs: number) {
    // Remove meshes anteriores e descarta suas geometrias
    while (dnaGroup.children.length) dnaGroup.remove(dnaGroup.children[0]);
    disposables.forEach((g) => g.dispose());
    disposables = [];

    const { strand1, strand2 } = computeDnaHelix(basePairs);

    const pts1 = strand1.map((p) => new THREE.Vector3(p.x, p.y, p.z));
    const pts2 = strand2.map((p) => new THREE.Vector3(p.x, p.y, p.z));

    // --- Tubos backbone ---
    if (basePairs >= 2) {
      const tubeGeo1 = new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts1), basePairs * 3, 0.07, 8, false);
      const tubeGeo2 = new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts2), basePairs * 3, 0.07, 8, false);
      disposables.push(tubeGeo1, tubeGeo2);
      dnaGroup.add(new THREE.Mesh(tubeGeo1, mat.strand1));
      dnaGroup.add(new THREE.Mesh(tubeGeo2, mat.strand2));
    }

    // --- Esferas nos nucleotídeos + cilindros dos degraus ---
    for (let i = 0; i < basePairs; i++) {
      const a = pts1[i];
      const b = pts2[i];

      const s1 = new THREE.Mesh(sphereGeo, mat.strand1);
      s1.position.copy(a);
      dnaGroup.add(s1);

      const s2 = new THREE.Mesh(sphereGeo, mat.strand2);
      s2.position.copy(b);
      dnaGroup.add(s2);

      // Degrau alternando A-T (laranja) e G-C (verde)
      dnaGroup.add(cylinder(a, b, 0.05, i % 2 === 0 ? mat.rungA : mat.rungB));
    }
  }

  buildGeometry(config.basePairs);

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
    const dt = Math.min((t - last) / 1000, 0.05);
    last = t;
    dnaGroup.rotation.y += currentSpeed * dt * Math.PI * 2;
    controls.update();
    renderer.render(scene, camera);
  }
  raf = requestAnimationFrame(animate);

  return {
    update(cfg: DnaSceneConfig) {
      currentSpeed = cfg.rotationSpeed;
      buildGeometry(cfg.basePairs);
    },
    dispose() {
      cancelAnimationFrame(raf);
      ro.disconnect();
      controls.dispose();
      sphereGeo.dispose();
      disposables.forEach((g) => g.dispose());
      Object.values(mat).forEach((m) => m.dispose());
      renderer.dispose();
    },
  };
}
