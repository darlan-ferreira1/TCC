// Hospedeiro "realidade aumentada" (hostInAR) — o terceiro hospedeiro do
// contrato montável, ao lado de hostInPage (página) e das salas do Museu
// Virtual. Ver ARQUITETURA.md, seção 23.
//
// Estados:
//   preview   → fora da sessão AR: fundo escuro + OrbitControls (prévia no navegador)
//   searching → sessão AR aberta, procurando uma superfície (hit-test sem resultado)
//   ready     → superfície encontrada: a retícula (anel) aparece; toque para posicionar
//   placed    → experimento fixado; gestos movem, redimensionam e giram
//
// Como funciona:
//   - hit-test (WebXR Hit Test Module): a cada quadro pergunta ao celular onde
//     um raio saindo do centro da tela encosta numa superfície real; o
//     resultado posiciona a retícula.
//   - toque na tela (evento `select` do WebXR) com a retícula visível →
//     o experimento é colocado ali.
//   - dom-overlay (WebXR DOM Overlay Module): o HTML da página (botões, painel
//     de ajustes, camada de gestos) continua visível e tocável durante a sessão.
//   - gestos (arrastar, pinça, girar) chegam pelo HTML, em pixels, e são
//     convertidos aqui: arrastar = raio da tela cruzando o plano horizontal da
//     superfície; pinça/giro = gestures.ts.
//
// Hierarquia:
//   scene
//    ├── reticle            (anel no chão/mesa)
//    └── anchor             (posição na superfície + giro em Y)
//         └── root          (escala do usuário; o experimento é montado aqui)

import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import type { MountedExperiment } from '../core/mountable';
import type { ARDefinition } from './definition';
import { clamp, toNdc, twoFingerTransform, type Point } from './gestures';

export type ARState = 'preview' | 'searching' | 'ready' | 'placed';

export interface ARHost<Config> {
  update(config: Config): void;
  startSession(overlay: HTMLElement): Promise<void>;
  endSession(): void;
  reposition(): void; // volta para a retícula
  dragStart(p: Point): void;
  dragMove(p: Point): void;
  dragEnd(): void;
  pinchStart(a: Point, b: Point): void;
  pinchMove(a: Point, b: Point): void;
  pinchEnd(): void;
  onStateChange: ((state: ARState) => void) | null;
  onScaleChange: ((relative: number) => void) | null; // 1 = tamanho inicial
  dispose(): void;
}

const MIN_SCALE = 0.2; // relativo ao tamanho inicial
const MAX_SCALE = 5;
const PREVIEW_BG = 0x0a0a1a;

export async function isARSupported(): Promise<boolean> {
  try {
    return (await navigator.xr?.isSessionSupported('immersive-ar')) ?? false;
  } catch {
    return false;
  }
}

export function hostInAR<Config, Mounted extends MountedExperiment<Config>>(
  container: HTMLElement,
  def: ARDefinition<Config, Mounted>,
  config: Config,
): ARHost<Config> {
  // ── Renderer (alpha: na sessão AR o fundo fica transparente e a câmera aparece) ──
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.setClearColor(PREVIEW_BG, 1);
  renderer.xr.enabled = true;
  renderer.domElement.style.display = 'block';
  container.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, container.clientWidth / container.clientHeight, 0.01, 50);
  const d = def.previewDistance;
  camera.position.set(0, d * 0.35, d);

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.08;
  controls.target.set(0, 0, 0);
  controls.update();

  // Iluminação neutra, para o objeto combinar com o ambiente real.
  scene.add(new THREE.HemisphereLight(0xffffff, 0x444444, 1.0));
  const dirLight = new THREE.DirectionalLight(0xffffff, 0.9);
  dirLight.position.set(1, 3, 2);
  scene.add(dirLight);

  // ── Retícula ──
  const reticleGeo = new THREE.RingGeometry(0.06, 0.08, 40).rotateX(-Math.PI / 2);
  const reticleMat = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.9 });
  const reticle = new THREE.Mesh(reticleGeo, reticleMat);
  reticle.matrixAutoUpdate = false;
  reticle.visible = false;
  scene.add(reticle);

  // ── Experimento ──
  const anchor = new THREE.Group();
  const root = new THREE.Group();
  anchor.add(root);
  scene.add(anchor);
  const mounted = def.experiment.mount({ root }, config);

  let userScale = 1;
  function applyScale() {
    root.scale.setScalar(def.scale * userScale);
    // Na sessão, a altura acima da superfície acompanha o tamanho do objeto.
    root.position.y = state === 'preview' ? 0 : def.lift * userScale;
  }

  let state: ARState = 'preview';
  const api: ARHost<Config> = {
    update(cfg) { mounted.update(cfg); },
    startSession,
    endSession() { renderer.xr.getSession()?.end(); },
    reposition() {
      if (state === 'placed') setState(reticle.visible ? 'ready' : 'searching');
    },
    dragStart, dragMove, dragEnd,
    pinchStart, pinchMove, pinchEnd,
    onStateChange: null,
    onScaleChange: null,
    dispose,
  };

  function setState(next: ARState) {
    state = next;
    anchor.visible = next === 'preview' || next === 'placed';
    applyScale();
    api.onStateChange?.(next);
  }

  function resetToPreview() {
    anchor.position.set(0, 0, 0);
    anchor.rotation.set(0, 0, 0);
    userScale = 1;
    api.onScaleChange?.(1);
    setState('preview');
  }
  resetToPreview();

  // ── Sessão AR ──
  let hitTestSource: XRHitTestSource | null = null;

  async function startSession(overlay: HTMLElement) {
    if (!navigator.xr) throw new Error('WebXR indisponível');
    const session = await navigator.xr.requestSession('immersive-ar', {
      requiredFeatures: ['hit-test'],
      optionalFeatures: ['dom-overlay'],
      domOverlay: { root: overlay },
    });
    renderer.xr.setReferenceSpaceType('local');
    await renderer.xr.setSession(session);
    const viewerSpace = await session.requestReferenceSpace('viewer');
    hitTestSource = (await session.requestHitTestSource?.({ space: viewerSpace })) ?? null;
    session.addEventListener('end', onSessionEnd);
    controls.enabled = false;
    renderer.setClearColor(0x000000, 0);
    setState('searching');
  }

  function onSessionEnd() {
    hitTestSource?.cancel();
    hitTestSource = null;
    reticle.visible = false;
    controls.enabled = true;
    renderer.setClearColor(PREVIEW_BG, 1);
    resetToPreview();
  }

  // Toque na tela durante a sessão = `select` do "controle" 0 do WebXR.
  const controller = renderer.xr.getController(0);
  scene.add(controller);
  controller.addEventListener('select', () => {
    if (state !== 'ready') return;
    anchor.position.setFromMatrixPosition(reticle.matrix);
    // Gira o objeto para ficar de frente para o usuário.
    const cam = xrCamera();
    const camPos = new THREE.Vector3().setFromMatrixPosition(cam.matrixWorld);
    anchor.rotation.set(0, Math.atan2(camPos.x - anchor.position.x, camPos.z - anchor.position.z), 0);
    setState('placed');
  });

  // Câmera "real" da sessão (a do celular), usada para converter toques em raios.
  function xrCamera(): THREE.PerspectiveCamera {
    const xrCam = renderer.xr.getCamera();
    const cam = (xrCam.cameras[0] ?? xrCam) as THREE.PerspectiveCamera;
    cam.projectionMatrixInverse.copy(cam.projectionMatrix).invert();
    return cam;
  }

  // ── Gestos ──
  const raycaster = new THREE.Raycaster();
  const surface = new THREE.Plane();
  const hit = new THREE.Vector3();
  const dragOffset = new THREE.Vector3();
  let dragging = false;
  let pinch: { a: Point; b: Point; scale: number; rotation: number } | null = null;

  // Ponto onde o raio que sai do dedo encosta no plano horizontal da superfície.
  function surfacePoint(p: Point): THREE.Vector3 | null {
    const ndc = toNdc(p, window.innerWidth, window.innerHeight);
    raycaster.setFromCamera(new THREE.Vector2(ndc.x, ndc.y), xrCamera());
    surface.set(new THREE.Vector3(0, 1, 0), -anchor.position.y);
    return raycaster.ray.intersectPlane(surface, hit);
  }

  function dragStart(p: Point) {
    if (state !== 'placed') return;
    const at = surfacePoint(p);
    if (!at) return;
    dragOffset.copy(anchor.position).sub(at);
    dragging = true;
  }
  function dragMove(p: Point) {
    if (!dragging) return;
    const at = surfacePoint(p);
    if (!at) return;
    anchor.position.x = at.x + dragOffset.x;
    anchor.position.z = at.z + dragOffset.z;
  }
  function dragEnd() { dragging = false; }

  function pinchStart(a: Point, b: Point) {
    if (state !== 'placed') return;
    dragging = false;
    pinch = { a, b, scale: userScale, rotation: anchor.rotation.y };
  }
  function pinchMove(a: Point, b: Point) {
    if (!pinch) return;
    const t = twoFingerTransform(pinch.a, pinch.b, a, b);
    userScale = clamp(pinch.scale * t.scale, MIN_SCALE, MAX_SCALE);
    // Girar os dedos no sentido horário (na tela) gira o objeto no sentido
    // horário visto de cima, que em Y é rotação negativa.
    anchor.rotation.y = pinch.rotation - t.rotation;
    applyScale();
    api.onScaleChange?.(userScale);
  }
  function pinchEnd() { pinch = null; }

  // ── Resize ──
  const ro = new ResizeObserver(() => {
    if (renderer.xr.isPresenting) return;
    renderer.setSize(container.clientWidth, container.clientHeight);
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
  });
  ro.observe(container);

  // ── Laço ──
  let last = 0;
  renderer.setAnimationLoop((t: number, frame?: XRFrame) => {
    const dt = last ? Math.min((t - last) / 1000, 0.05) : 0;
    last = t;

    if (frame && hitTestSource && state !== 'placed') {
      const refSpace = renderer.xr.getReferenceSpace();
      const results = frame.getHitTestResults(hitTestSource);
      const pose = refSpace && results.length ? results[0].getPose(refSpace) : undefined;
      if (pose) {
        reticle.visible = true;
        reticle.matrix.fromArray(pose.transform.matrix);
        if (state === 'searching') setState('ready');
      } else {
        reticle.visible = false;
        if (state === 'ready') setState('searching');
      }
    } else if (state === 'placed') {
      reticle.visible = false;
    }

    mounted.tick(dt);
    if (!renderer.xr.isPresenting) controls.update();
    renderer.render(scene, camera);
  });

  function dispose() {
    renderer.setAnimationLoop(null);
    renderer.xr.getSession()?.end();
    ro.disconnect();
    controls.dispose();
    mounted.dispose();
    reticleGeo.dispose();
    reticleMat.dispose();
    renderer.dispose();
    renderer.domElement.remove();
  }

  return api;
}
