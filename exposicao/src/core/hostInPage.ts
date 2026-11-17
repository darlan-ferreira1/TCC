// Hospedeiro "página": dá a um experimento montável tudo o que, antes da
// seção 22 do ARQUITETURA.md, cada scene.ts criava sozinho e de forma repetida:
// renderer, cena, câmera, OrbitControls, iluminação, fundo, resize e laço.
//
// Os `create*Scene(canvas, ...)` dos experimentos migrados viraram uma chamada
// a esta função — com a MESMA assinatura de antes, então os index.tsx não mudam.

import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import type { MountableExperiment, MountedExperiment } from './mountable';

type Vec3 = [number, number, number];

export interface PageHostOptions {
  background: number;
  camera: { position: Vec3; target?: Vec3; fov?: number; near?: number; far?: number };
  orbit?: { damping?: number; minDistance?: number; maxDistance?: number };
  // Luzes da página. São do hospedeiro (no museu quem ilumina é a sala).
  lights?: (scene: THREE.Scene) => void;
}

export interface PageHost<Config> {
  update(config: Config): void;
  dispose(): void;
}

const MAX_DT = 0.05; // s — evita saltos ao voltar de uma aba em segundo plano

export function defaultLights(scene: THREE.Scene) {
  scene.add(new THREE.AmbientLight(0xffffff, 0.5));
  const dir = new THREE.DirectionalLight(0xffffff, 1.2);
  dir.position.set(5, 10, 8);
  scene.add(dir);
}

export function hostInPage<Config, Mounted extends MountedExperiment<Config>>(
  canvas: HTMLCanvasElement,
  experiment: MountableExperiment<Config, Mounted>,
  config: Config,
  options: PageHostOptions,
): PageHost<Config> & { mounted: Mounted } {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(options.background);

  const cam = options.camera;
  const camera = new THREE.PerspectiveCamera(cam.fov ?? 50, 1, cam.near ?? 0.1, cam.far ?? 200);
  camera.position.set(...cam.position);

  const controls = new OrbitControls(camera, canvas);
  controls.enableDamping = true;
  controls.dampingFactor = options.orbit?.damping ?? 0.06;
  if (options.orbit?.minDistance !== undefined) controls.minDistance = options.orbit.minDistance;
  if (options.orbit?.maxDistance !== undefined) controls.maxDistance = options.orbit.maxDistance;
  controls.target.set(...(cam.target ?? [0, 0, 0]));
  camera.lookAt(controls.target);
  controls.update();

  (options.lights ?? defaultLights)(scene);

  const root = new THREE.Group();
  scene.add(root);
  const mounted = experiment.mount({ root }, config);

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
    const dt = last ? Math.min((t - last) / 1000, MAX_DT) : 0;
    last = t;
    mounted.tick(dt);
    controls.update();
    renderer.render(scene, camera);
  }
  raf = requestAnimationFrame(animate);

  return {
    mounted,
    update(cfg) { mounted.update(cfg); },
    dispose() {
      cancelAnimationFrame(raf);
      ro.disconnect();
      controls.dispose();
      mounted.dispose();
      // Luzes e cena não têm recursos de GPU próprios além do renderer.
      renderer.dispose();
    },
  };
}
