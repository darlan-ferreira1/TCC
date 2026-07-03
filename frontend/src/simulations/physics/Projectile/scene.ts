// Setup Three.js do lançamento de projétil.
//
// Estados da simulação:
//   idle    → projétil na origem, preview da trajetória visível, marcadores ocultos
//   flying  → projétil se move, rastro cresce, preview oculto
//   landed  → projétil no ponto de queda, rastro completo, marcadores (R e H) visíveis
//
// Rastro: BufferGeometry pré-alocado (MAX_TRAIL pontos). A cada frame em estado
// "flying" adiciona a posição atual ao buffer e incrementa o drawRange.
//
// Marcadores visuais (só aparecem ao pousar):
//   - Linha laranja no chão: alcance R
//   - Esfera laranja em (R, 0)
//   - Linha verde vertical em x = R/2: altura máxima H
//   - Esfera verde em (R/2, H)
//   - Linha verde horizontal de (0, H) a (R/2, H)
//
// A câmera se reposiciona a cada rebuild para enquadrar a trajetória inteira.

import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { projectilePos, projectileInfo, trajectoryPoints, type ProjectileParams } from './physics';

export interface ProjectileSceneConfig extends ProjectileParams {}

export interface ProjectileScene {
  update(config: ProjectileSceneConfig): void;
  launch(): void; // idle → flying | flying/landed → idle
  dispose(): void;
}

type SimState = 'idle' | 'flying' | 'landed';

const MAX_TRAIL = 500;

export function createProjectileScene(
  canvas: HTMLCanvasElement,
  config: ProjectileSceneConfig,
  bgColor = 0x0a0a1a,
): ProjectileScene {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(bgColor);

  const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 2000);

  const controls = new OrbitControls(camera, canvas);
  controls.enableDamping = true;
  controls.dampingFactor = 0.06;

  scene.add(new THREE.AmbientLight(0xffffff, 0.5));
  const dir = new THREE.DirectionalLight(0xffffff, 1.2);
  dir.position.set(5, 20, 10);
  scene.add(dir);

  // --- Materiais ---
  const projMat     = new THREE.MeshPhongMaterial({ color: 0xe74c3c, shininess: 80 });
  const trailMat    = new THREE.LineBasicMaterial({ color: 0xe74c3c, transparent: true, opacity: 0.6 });
  const previewMat  = new THREE.LineBasicMaterial({ color: 0x333366, transparent: true, opacity: 0.7 });
  const rangeMat    = new THREE.LineBasicMaterial({ color: 0xf39c12 });
  const heightMat   = new THREE.LineBasicMaterial({ color: 0x2ecc71 });
  const rMarkerMat  = new THREE.MeshPhongMaterial({ color: 0xf39c12 });
  const hMarkerMat  = new THREE.MeshPhongMaterial({ color: 0x2ecc71 });
  const groundMat   = new THREE.MeshPhongMaterial({ color: 0x0d1a0d, side: THREE.DoubleSide });

  // --- Projétil ---
  const projGeo  = new THREE.SphereGeometry(0.5, 16, 12);
  const projMesh = new THREE.Mesh(projGeo, projMat);
  scene.add(projMesh);

  // --- Rastro (trail) ---
  const trailArr  = new Float32Array(MAX_TRAIL * 3);
  const trailAttr = new THREE.BufferAttribute(trailArr, 3);
  const trailGeo  = new THREE.BufferGeometry();
  trailGeo.setAttribute('position', trailAttr);
  trailGeo.setDrawRange(0, 0);
  scene.add(new THREE.Line(trailGeo, trailMat));

  // --- Grupos de objetos reconstruídos ---
  const groundGroup   = new THREE.Group();
  const previewGroup  = new THREE.Group();
  const markersGroup  = new THREE.Group();
  scene.add(groundGroup, previewGroup, markersGroup);

  // Estado da simulação
  let params: ProjectileParams = { ...config };
  let simState: SimState = 'idle';
  let simTime = 0;
  let trailCount = 0;

  // --- Helpers de construção ---

  function clearGroup(g: THREE.Group) {
    for (const child of [...g.children]) {
      (child as THREE.Mesh | THREE.Line).geometry.dispose();
      g.remove(child);
    }
  }

  function makeLine(pts: THREE.Vector3[], mat: THREE.LineBasicMaterial): THREE.Line {
    const geo = new THREE.BufferGeometry().setFromPoints(pts);
    return new THREE.Line(geo, mat);
  }

  function buildGround(range: number) {
    clearGroup(groundGroup);
    const size = Math.max(range * 1.4, 20);
    const cx   = range / 2;

    const planeGeo = new THREE.PlaneGeometry(size, size * 0.5);
    const plane = new THREE.Mesh(planeGeo, groundMat);
    plane.rotation.x = -Math.PI / 2;
    plane.position.set(cx, -0.02, 0);
    groundGroup.add(plane);

    const divs = Math.max(5, Math.ceil(size / 5));
    const grid = new THREE.GridHelper(size, divs, 0x1a2a1a, 0x111a11);
    grid.position.set(cx, 0, 0);
    groundGroup.add(grid);
  }

  function buildPreview() {
    clearGroup(previewGroup);
    const pts = trajectoryPoints(params, 100).map(
      (p) => new THREE.Vector3(p.x, p.y, 0),
    );
    previewGroup.add(makeLine(pts, previewMat));
  }

  function buildMarkers(range: number, maxH: number, xH: number) {
    clearGroup(markersGroup);

    // Linha laranja no chão: de (0,0) até (R,0)
    markersGroup.add(makeLine([
      new THREE.Vector3(0, 0.05, 0),
      new THREE.Vector3(range, 0.05, 0),
    ], rangeMat));

    // Esfera laranja em (R, 0) — ponto de queda
    const rSphere = new THREE.Mesh(new THREE.SphereGeometry(0.4, 12, 8), rMarkerMat);
    rSphere.position.set(range, 0, 0);
    markersGroup.add(rSphere);

    // Linha verde vertical em x = R/2: de (xH,0) a (xH,H)
    markersGroup.add(makeLine([
      new THREE.Vector3(xH, 0, 0),
      new THREE.Vector3(xH, maxH, 0),
    ], heightMat));

    // Linha verde horizontal de (0,H) a (xH,H)
    markersGroup.add(makeLine([
      new THREE.Vector3(0, maxH, 0),
      new THREE.Vector3(xH, maxH, 0),
    ], heightMat));

    // Esfera verde em (xH, H) — ponto de altura máxima
    const hSphere = new THREE.Mesh(new THREE.SphereGeometry(0.4, 12, 8), hMarkerMat);
    hSphere.position.set(xH, maxH, 0);
    markersGroup.add(hSphere);

    markersGroup.visible = false;
  }

  function frameCamera(range: number, maxH: number) {
    const cx   = range / 2;
    const cy   = maxH / 2;
    const dist = Math.max(range * 0.9, maxH * 3, 15);
    camera.position.set(cx, Math.max(cy, 2), dist);
    controls.target.set(cx, Math.max(cy * 0.5, 1), 0);
    controls.update();
  }

  function rebuild() {
    const info = projectileInfo(params);
    buildGround(info.range);
    buildPreview();
    buildMarkers(info.range, info.maxHeight, info.xAtMaxHeight);
    frameCamera(info.range, info.maxHeight);
    // Reset state
    simState  = 'idle';
    simTime   = 0;
    trailCount = 0;
    trailGeo.setDrawRange(0, 0);
    projMesh.position.set(0, 0, 0);
    previewGroup.visible  = true;
    markersGroup.visible  = false;
  }

  rebuild();

  // --- Resize ---
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

  // --- Loop de animação ---
  let raf = 0;
  let last = 0;

  function animate(ts: number) {
    raf = requestAnimationFrame(animate);
    const dt = Math.min((ts - last) / 1000, 0.05);
    last = ts;

    if (simState === 'flying') {
      simTime += dt;
      const { x, y } = projectilePos(simTime, params);

      const info = projectileInfo(params);

      if (y <= 0 && simTime > info.flightTime * 0.05) {
        // Pousou
        projMesh.position.set(info.range, 0, 0);
        markersGroup.visible = true;
        simState = 'landed';
      } else {
        projMesh.position.set(x, Math.max(y, 0), 0);

        // Adiciona ponto ao rastro
        if (trailCount < MAX_TRAIL) {
          trailArr[trailCount * 3]     = x;
          trailArr[trailCount * 3 + 1] = Math.max(y, 0);
          trailArr[trailCount * 3 + 2] = 0;
          trailCount++;
          trailGeo.setDrawRange(0, trailCount);
          trailAttr.needsUpdate = true;
        }
      }
    }

    controls.update();
    renderer.render(scene, camera);
  }
  raf = requestAnimationFrame(animate);

  return {
    update(cfg: ProjectileSceneConfig) {
      params = { ...cfg };
      rebuild();
    },
    launch() {
      if (simState === 'idle') {
        simState = 'flying';
        simTime  = 0;
        trailCount = 0;
        trailGeo.setDrawRange(0, 0);
        projMesh.position.set(0, 0, 0);
        previewGroup.visible = false;
        markersGroup.visible = false;
      } else {
        rebuild(); // flying ou landed → volta pro idle
      }
    },
    dispose() {
      cancelAnimationFrame(raf);
      ro.disconnect();
      controls.dispose();
      projGeo.dispose();
      trailGeo.dispose();
      clearGroup(groundGroup);
      clearGroup(previewGroup);
      clearGroup(markersGroup);
      [projMat, trailMat, previewMat, rangeMat, heightMat,
        rMarkerMat, hMarkerMat, groundMat].forEach((m) => m.dispose());
      renderer.dispose();
    },
  };
}
