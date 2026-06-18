// Setup Three.js da geometria molecular VSEPR.
//
// Estrutura de cada molécula:
//   - Átomo central: SphereGeometry na origem, cor CPK
//   - Ligantes:      SphereGeometry em cada posição de computeLigandPositions()
//   - Ligações:      CylinderGeometry do centro ao centro de cada ligante
//                    orientado por quaternion (eixo Y padrão → direção do ligante)
//
// Toda a geometria fica num único `moleculeGroup`. Ao trocar de molécula,
// o grupo é limpo (geometrias e materiais descartados) e reconstruído.
// Os materiais de átomos são criados por instância e descartados no rebuild.
// O material de ligações é compartilhado (mesma cor cinza para todas).

import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { computeLigandPositions, type MoleculeDefinition } from './physics';

export interface MolSceneConfig {
  molecule: MoleculeDefinition;
}

export interface MolScene {
  update(config: MolSceneConfig): void;
  dispose(): void;
}

export function createMolScene(canvas: HTMLCanvasElement, config: MolSceneConfig): MolScene {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x0a0a1a);

  const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 100);
  camera.position.set(0, 1.5, 7);

  const controls = new OrbitControls(camera, canvas);
  controls.target.set(0, 0, 0);
  controls.enableDamping = true;
  controls.dampingFactor = 0.06;
  controls.minDistance = 2;
  controls.maxDistance = 20;
  camera.lookAt(0, 0, 0);
  controls.update();

  scene.add(new THREE.AmbientLight(0xffffff, 0.4));
  const dir1 = new THREE.DirectionalLight(0xffffff, 1.2);
  dir1.position.set(4, 6, 5);
  scene.add(dir1);
  const dir2 = new THREE.DirectionalLight(0x8899bb, 0.4); // preenchimento azulado
  dir2.position.set(-4, -3, -4);
  scene.add(dir2);

  // Material compartilhado das ligações
  const bondMat = new THREE.MeshPhongMaterial({ color: 0x888888, shininess: 40 });

  const moleculeGroup = new THREE.Group();
  scene.add(moleculeGroup);

  // Materiais de átomos criados por rebuild (descartados na limpeza)
  let atomMaterials: THREE.MeshPhongMaterial[] = [];

  function clearMolecule() {
    while (moleculeGroup.children.length) {
      const child = moleculeGroup.children[0] as THREE.Mesh;
      child.geometry.dispose();
      moleculeGroup.remove(child);
    }
    atomMaterials.forEach((m) => m.dispose());
    atomMaterials = [];
  }

  function makeAtom(pos: THREE.Vector3, radius: number, color: number): THREE.Mesh {
    const mat = new THREE.MeshPhongMaterial({ color, shininess: 80 });
    atomMaterials.push(mat);
    const mesh = new THREE.Mesh(new THREE.SphereGeometry(radius, 24, 18), mat);
    mesh.position.copy(pos);
    return mesh;
  }

  function makeBond(to: THREE.Vector3): THREE.Mesh {
    const len = to.length();
    const geo = new THREE.CylinderGeometry(0.07, 0.07, len, 8, 1);
    const mesh = new THREE.Mesh(geo, bondMat);
    mesh.position.copy(to).multiplyScalar(0.5); // midpoint
    mesh.quaternion.setFromUnitVectors(
      new THREE.Vector3(0, 1, 0),
      to.clone().normalize(),
    );
    return mesh;
  }

  function buildMolecule(mol: MoleculeDefinition) {
    clearMolecule();

    // Átomo central
    moleculeGroup.add(makeAtom(new THREE.Vector3(0, 0, 0), mol.centerAtom.radius, mol.centerAtom.color));

    // Ligantes e ligações
    const positions = computeLigandPositions(mol.geometry, mol.bondAngleDeg, mol.bondLength);
    positions.forEach((p) => {
      const ligandPos = new THREE.Vector3(p.x, p.y, p.z);
      moleculeGroup.add(makeBond(ligandPos));
      moleculeGroup.add(makeAtom(ligandPos, mol.ligandAtom.radius, mol.ligandAtom.color));
    });
  }

  buildMolecule(config.molecule);

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
    last = ts;
    controls.update();
    renderer.render(scene, camera);
  }
  raf = requestAnimationFrame(animate);

  return {
    update(cfg: MolSceneConfig) {
      buildMolecule(cfg.molecule);
    },
    dispose() {
      cancelAnimationFrame(raf);
      ro.disconnect();
      controls.dispose();
      clearMolecule();
      bondMat.dispose();
      scene.traverse((obj) => {
        const m = obj as THREE.Mesh;
        if (m.geometry) m.geometry.dispose();
      });
      renderer.dispose();
    },
  };
}
