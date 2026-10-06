// Sala interativa do Pêndulo (sala do Museu Virtual). Ver museum/interactiveRoom.ts.
//
// Sala: 8 × 9 m, pé-direito 4,8 m. O pivô fica a 3,8 m do chão, então com o
// fio mais longo (3 m) a massa passa a 0,8 m do chão — na altura do jogador.
//
// Camada A (HUD): comprimento, gravidade e ângulo inicial — os mesmos 3
//   parâmetros dos sliders da página.
// Camada B (interação direta): mirar na massa e segurar E (ou o botão, no
//   celular) para pegá-la; arrastar define o ângulo; soltar larga o pêndulo a
//   partir do repouso. É a forma mais natural de "definir θ₀".

import * as THREE from 'three';
import type { InteractiveRoom } from '../../../museum/interactiveRoom';
import { pendulum, type MountedPendulum, type PendulumSceneConfig } from './scene';

const DEG = Math.PI / 180;
const MAX_ANGLE = 170 * DEG;
const GRAB_RADIUS = 0.35;   // m — tolerância da mira em volta da massa
const GRAB_DISTANCE = 6;    // m — alcance máximo da mão

export const sala: InteractiveRoom<PendulumSceneConfig, MountedPendulum> = {
  experiment: pendulum,
  room: {
    width: 8,
    depth: 9,
    wallHeight: 4.8,
    place: [0, 3.8, -1.5],
  },
  controls: [
    { id: 'L', label: 'Comprimento L', kind: 'range', min: 0.5, max: 3, step: 0.1, unit: 'm', default: 1.5 },
    { id: 'g', label: 'Gravidade g', kind: 'range', min: 1, max: 20, step: 0.5, unit: 'm/s²', default: 9.8 },
    { id: 'theta0', label: 'Ângulo inicial θ₀', kind: 'range', min: -170, max: 170, step: 5, unit: '°', default: 45 },
  ],
  toConfig: (v) => ({ L: Number(v.L), g: Number(v.g), theta0: Number(v.theta0) * DEG }),

  interactions(mounted, root) {
    const bobWorld = new THREE.Vector3();
    const pivotWorld = new THREE.Vector3();
    const plane = new THREE.Plane();
    const hit = new THREE.Vector3();

    // Converte o ponto onde a mira cruza o plano de oscilação em ângulo θ.
    function angleFromRay(ray: THREE.Ray): number | null {
      root.getWorldPosition(pivotWorld);
      plane.set(new THREE.Vector3(0, 0, 1), -pivotWorld.z); // plano z = z do pivô
      if (!ray.intersectPlane(plane, hit)) return null;
      const local = root.worldToLocal(hit.clone());
      const theta = Math.atan2(local.x, -local.y); // 0 = pendurado na vertical
      return Math.max(-MAX_ANGLE, Math.min(MAX_ANGLE, theta));
    }

    return [{
      prompt: 'pegar a massa',
      isTarget(ray) {
        mounted.bob.getWorldPosition(bobWorld);
        return ray.distanceToPoint(bobWorld) < GRAB_RADIUS && ray.origin.distanceTo(bobWorld) < GRAB_DISTANCE;
      },
      press(ray) {
        const theta = angleFromRay(ray);
        mounted.grab(theta ?? 0);
      },
      drag(ray) {
        const theta = angleFromRay(ray);
        if (theta !== null) mounted.grab(theta);
      },
      release() {
        mounted.release();
      },
    }];
  },
};
