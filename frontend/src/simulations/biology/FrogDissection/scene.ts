// Dissecação guiada por gestos — sapo estilizado em Three.js.
//
// Estrutura:
//   frogGroup
//     ├── body, head, eyes, legs   — pele (skinMat), sempre visíveis
//     ├── pivotLeft/pivotRight     — "portas" da pele dorsal, giram em torno
//     │     └── flapLeft/flapRight   do eixo Z do grupo (a costura fica em x=0)
//     ├── incisionTarget            — hitbox invisível: alvo do gesto que abre
//     └── organs[]                  — só ficam visíveis com a pele aberta
//
// Interação (uma única máquina de estados, alimentada por updatePinch a cada
// frame, venha o gesto do MediaPipe ou do fallback de mouse):
//   1. Pele fechada  + pinça sobre a incisão → abre (animação de dobradiça).
//   2. Pele aberta   + pinça sobre um órgão  → agarra e arrasta (segue o raio
//      da câmera projetado num plano na profundidade do órgão).
//   3. Solta a pinça longe do corpo (x > EXTRACT_X) → órgão "extraído",
//      encaixa na bandeja; solta antes disso → volta pro lugar de origem.

import * as THREE from 'three';
import type { PinchState } from './gestures';

export interface OrganDef {
  id: string;
  name: string;
  color: number;
}

export const ORGAN_DEFS: OrganDef[] = [
  { id: 'heart', name: 'Coração', color: 0xe74c3c },
  { id: 'lungs', name: 'Pulmões', color: 0xf2a6c1 },
  { id: 'liver', name: 'Fígado', color: 0x8a3b2e },
  { id: 'stomach', name: 'Estômago', color: 0xe8c468 },
  { id: 'intestines', name: 'Intestino', color: 0xd99a8a },
];

const OPEN_ANGLE = 1.9; // ~109°
const EXTRACT_X = 1.55; // além disso, soltar = extrair
const ORGAN_HOMES: Record<string, [number, number, number]> = {
  heart: [0, 0.14, 0.35],
  lungs: [0.24, 0.1, 0.2],
  liver: [-0.18, -0.02, -0.05],
  stomach: [0.12, -0.05, -0.3],
  intestines: [-0.05, -0.08, -0.55],
};

export interface DissectionScene {
  onExtract: ((id: string) => void) | null;
  onOpenChange: ((open: boolean) => void) | null;
  updatePinch(input: PinchState): void;
  reset(): void;
  dispose(): void;
}

export function createDissectionScene(container: HTMLDivElement): DissectionScene {
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.setClearColor(0x000000, 0);
  renderer.domElement.style.position = 'absolute';
  renderer.domElement.style.inset = '0';
  container.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 100);
  camera.position.set(0, 2.6, 3.0);
  camera.lookAt(0, 0.3, 0);

  scene.add(new THREE.HemisphereLight(0xffffff, 0x224422, 1.1));
  const dirLight = new THREE.DirectionalLight(0xffffff, 0.9);
  dirLight.position.set(2, 4, 3);
  scene.add(dirLight);

  const disposables: Array<THREE.BufferGeometry | THREE.Material> = [];
  function track<T extends THREE.BufferGeometry | THREE.Material>(x: T): T {
    disposables.push(x);
    return x;
  }

  // ── Bandeja ──
  const tray = new THREE.Mesh(
    track(new THREE.BoxGeometry(4.4, 0.06, 2.4)),
    track(new THREE.MeshPhongMaterial({ color: 0x0d1f13 })),
  );
  tray.position.y = -0.03;
  scene.add(tray);

  // ── Corpo do sapo ──
  const frogGroup = new THREE.Group();
  frogGroup.position.y = 0.3;
  scene.add(frogGroup);

  const skinMat = track(new THREE.MeshPhongMaterial({ color: 0x3f7a3a, shininess: 20 }));

  const body = new THREE.Mesh(track(new THREE.SphereGeometry(0.55, 24, 16)), skinMat);
  body.scale.set(1.15, 0.55, 1.65);
  frogGroup.add(body);

  const head = new THREE.Mesh(track(new THREE.SphereGeometry(0.32, 20, 14)), skinMat);
  head.scale.set(1.05, 0.75, 0.9);
  head.position.set(0, 0.08, 0.95);
  frogGroup.add(head);

  const eyeMat = track(new THREE.MeshPhongMaterial({ color: 0x111111 }));
  const eyeGeo = track(new THREE.SphereGeometry(0.07, 10, 8));
  for (const x of [-0.16, 0.16]) {
    const eye = new THREE.Mesh(eyeGeo, eyeMat);
    eye.position.set(x, 0.28, 1.05);
    frogGroup.add(eye);
  }

  function addLeg(x: number, z: number, len: number, thick: number, tiltZ: number) {
    const leg = new THREE.Mesh(track(new THREE.CapsuleGeometry(thick, len, 4, 8)), skinMat);
    leg.position.set(x, -0.15, z);
    leg.rotation.z = tiltZ;
    frogGroup.add(leg);
  }
  addLeg(0.55, 0.55, 0.35, 0.09, -0.9);
  addLeg(-0.55, 0.55, 0.35, 0.09, 0.9);
  addLeg(0.68, -0.6, 0.55, 0.12, -1.0);
  addLeg(-0.68, -0.6, 0.55, 0.12, 1.0);

  // ── "Portas" de pele dorsal ──
  const flapRight = new THREE.Mesh(
    track(new THREE.SphereGeometry(0.56, 20, 12, -Math.PI / 2, Math.PI, 0, Math.PI / 2)),
    skinMat,
  );
  const flapLeft = new THREE.Mesh(
    track(new THREE.SphereGeometry(0.56, 20, 12, Math.PI / 2, Math.PI, 0, Math.PI / 2)),
    skinMat,
  );
  flapRight.scale.set(1.16, 0.56, 1.55);
  flapLeft.scale.set(1.16, 0.56, 1.55);
  flapRight.position.set(0, 0.02, -0.1);
  flapLeft.position.set(0, 0.02, -0.1);

  const pivotRight = new THREE.Group();
  const pivotLeft = new THREE.Group();
  pivotRight.add(flapRight);
  pivotLeft.add(flapLeft);
  frogGroup.add(pivotRight, pivotLeft);

  // ── Alvo da incisão (invisível, mas "raycastável") ──
  const incisionTarget = new THREE.Mesh(
    track(new THREE.BoxGeometry(0.18, 0.12, 1.5)),
    track(new THREE.MeshBasicMaterial({ transparent: true, opacity: 0, depthWrite: false })),
  );
  incisionTarget.position.set(0, 0.28, -0.1);
  frogGroup.add(incisionTarget);

  // ── Órgãos ──
  interface Organ {
    id: string;
    mesh: THREE.Mesh;
    home: THREE.Vector3;
    trayPos: THREE.Vector3;
    extracted: boolean;
  }

  function makeOrganGeometry(id: string): THREE.BufferGeometry {
    switch (id) {
      case 'heart':
        return new THREE.SphereGeometry(0.11, 14, 10);
      case 'lungs':
        return new THREE.SphereGeometry(0.14, 14, 10);
      case 'liver':
        return new THREE.IcosahedronGeometry(0.19, 0);
      case 'stomach':
        return new THREE.CapsuleGeometry(0.09, 0.18, 4, 8);
      default: {
        const pts: THREE.Vector3[] = [];
        for (let i = 0; i < 8; i++) {
          pts.push(new THREE.Vector3(Math.sin(i * 1.4) * 0.12, Math.cos(i * 2.1) * 0.05, i * 0.045 - 0.15));
        }
        return new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 32, 0.05, 8, false);
      }
    }
  }

  const organs: Organ[] = ORGAN_DEFS.map((def, i) => {
    const geo = track(makeOrganGeometry(def.id));
    const mat = track(new THREE.MeshPhongMaterial({ color: def.color, shininess: 40 }));
    const mesh = new THREE.Mesh(geo, mat);
    const [hx, hy, hz] = ORGAN_HOMES[def.id];
    mesh.position.set(hx, hy, hz);
    mesh.visible = false;
    frogGroup.add(mesh);
    return {
      id: def.id,
      mesh,
      home: new THREE.Vector3(hx, hy, hz),
      trayPos: new THREE.Vector3(EXTRACT_X, 0.12, -0.9 + i * 0.45),
      extracted: false,
    };
  });

  // ── Cursor de pinça ──
  const cursorMatIdle = track(new THREE.MeshBasicMaterial({ color: 0x2ecc71 }));
  const cursorMatPinch = track(new THREE.MeshBasicMaterial({ color: 0xf1c40f }));
  const cursor = new THREE.Mesh(track(new THREE.TorusGeometry(0.06, 0.015, 8, 20)), cursorMatIdle);
  cursor.visible = false;
  scene.add(cursor);

  // ── Estado de interação ──
  let flapsOpen = false;
  let flapProgress = 0;
  let draggedOrgan: Organ | null = null;
  let wasPinching = false;

  const raycaster = new THREE.Raycaster();
  const ndc = new THREE.Vector2();
  const workPlane = new THREE.Plane();
  const hitPoint = new THREE.Vector3();

  const api: DissectionScene = {
    onExtract: null,
    onOpenChange: null,
    updatePinch(input) {
      if (!input.tracking) {
        cursor.visible = false;
        if (draggedOrgan) releaseDrag();
        wasPinching = false;
        return;
      }

      cursor.visible = true;
      ndc.set(input.x, input.y);
      raycaster.setFromCamera(ndc, camera);

      const depthZ = draggedOrgan ? draggedOrgan.mesh.getWorldPosition(hitPoint).z : frogGroup.position.z;
      workPlane.setComponents(0, 0, 1, -depthZ);
      const hit = raycaster.ray.intersectPlane(workPlane, hitPoint);
      if (hit) cursor.position.copy(hit);
      cursor.material = input.pinching ? cursorMatPinch : cursorMatIdle;

      if (input.pinching && !wasPinching) {
        if (!flapsOpen) {
          if (raycaster.intersectObject(incisionTarget).length > 0) {
            flapsOpen = true;
            api.onOpenChange?.(true);
          }
        } else {
          const targets = organs.filter((o) => !o.extracted).map((o) => o.mesh);
          const found = raycaster.intersectObjects(targets)[0];
          if (found) draggedOrgan = organs.find((o) => o.mesh === found.object) ?? null;
        }
      } else if (input.pinching && draggedOrgan && hit) {
        draggedOrgan.mesh.position.copy(frogGroup.worldToLocal(hit.clone()));
      } else if (!input.pinching && wasPinching && draggedOrgan) {
        releaseDrag();
      }

      wasPinching = input.pinching;
    },
    reset() {
      flapsOpen = false;
      draggedOrgan = null;
      wasPinching = false;
      organs.forEach((o) => {
        o.extracted = false;
        o.mesh.visible = false;
        o.mesh.position.copy(o.home);
      });
      api.onOpenChange?.(false);
    },
    dispose() {
      renderer.setAnimationLoop(null);
      ro.disconnect();
      disposables.forEach((d) => d.dispose());
      renderer.dispose();
      renderer.domElement.remove();
    },
  };

  function releaseDrag() {
    const organ = draggedOrgan;
    draggedOrgan = null;
    if (!organ) return;
    const worldX = organ.mesh.getWorldPosition(new THREE.Vector3()).x;
    if (worldX > EXTRACT_X - 0.5) {
      organ.extracted = true;
      organ.mesh.position.copy(frogGroup.worldToLocal(organ.trayPos.clone()));
      api.onExtract?.(organ.id);
    } else {
      organ.mesh.position.copy(organ.home);
    }
  }

  // ── Resize ──
  const ro = new ResizeObserver(() => {
    renderer.setSize(container.clientWidth, container.clientHeight);
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
  });
  ro.observe(container);

  // ── Loop ──
  let last = 0;
  renderer.setAnimationLoop((t: number) => {
    const dt = Math.min((t - last) / 1000, 0.05);
    last = t;

    const target = flapsOpen ? 1 : 0;
    flapProgress += (target - flapProgress) * Math.min(dt * 4, 1);
    pivotRight.rotation.z = -OPEN_ANGLE * flapProgress;
    pivotLeft.rotation.z = OPEN_ANGLE * flapProgress;

    if (flapProgress > 0.35) {
      organs.forEach((o) => { o.mesh.visible = true; });
    }

    renderer.render(scene, camera);
  });

  return api;
}
