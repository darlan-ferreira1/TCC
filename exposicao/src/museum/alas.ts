// Alas temáticas do Museu Virtual (PROTÓTIPO).
//
// Cada ala é um "museu dentro do museu": uma porta do salão principal leva a
// um salão menor com as salas de um tema, em ordem. As portas da ala usam o
// mesmo mecanismo do salão. Todas as portas das alas levam a salas DENTRO do
// museu (nenhuma abre a página do experimento no site).
//
// As salas novas não estão no registry.ts: existem só dentro das alas. Elas
// são o protótipo do TCC (museu + lista de exercícios interativa), que depois
// vai virar um projeto separado do CLARA.js.

import * as THREE from 'three';
import type { InteractiveRoom } from './interactiveRoom';
import type { DoorEntry } from './layout';
import type { Centerpiece } from './levels';
import type { WingDef } from './scene';
import { sala as conicalRoom } from '../simulations/physics/ConicalPendulum/sala';
import { sala as foucaultRoom } from '../simulations/physics/FoucaultPendulum/sala';
import { sala as projectileRoom } from '../simulations/physics/ProjectileRoom/sala';
import { sala as keplerRoom } from '../simulations/physics/KeplerRoom/sala';
import { sala as wavesRoom } from '../simulations/physics/WavesRoom/sala';
export const WINGS_CATEGORY = 'Alas temáticas';

const MECHANICS_COLOR = 0xe67e22;

// Salas que só existem nas alas (id da porta → sala interativa).
export const WING_ROOMS: Record<string, InteractiveRoom> = {
  'conical-pendulum': conicalRoom as InteractiveRoom,
  'foucault-pendulum': foucaultRoom as InteractiveRoom,
  'projectile-room': projectileRoom as InteractiveRoom,
  'kepler-room': keplerRoom as InteractiveRoom,
  'waves-room': wavesRoom as InteractiveRoom,
};

const door = (id: string, title: string, color: number): DoorEntry => ({ id, title, category: '', color });

// ── Peças do pedestal central ──

// Museu da Mecânica: um pequeno pêndulo cônico girando.
const mechanicsPiece: Centerpiece = (group, t) => {
  const mat = t.track(new THREE.MeshStandardMaterial({ color: 0x3a3a55, roughness: 0.6 }));
  const post = new THREE.Mesh(t.track(new THREE.CylinderGeometry(0.03, 0.03, 1.1, 8)), mat);
  post.position.y = 0.55;
  const arm = new THREE.Mesh(t.track(new THREE.BoxGeometry(0.04, 0.04, 0.04)), mat);
  arm.position.y = 1.1;
  const spin = new THREE.Group();
  spin.position.y = 1.1;
  const tilt = new THREE.Group();
  tilt.rotation.z = 0.6;
  const wire = new THREE.Mesh(t.track(new THREE.CylinderGeometry(0.008, 0.008, 0.7, 6)), mat);
  wire.position.y = -0.35;
  const ball = new THREE.Mesh(
    t.track(new THREE.SphereGeometry(0.09, 20, 14)),
    t.track(new THREE.MeshStandardMaterial({ color: MECHANICS_COLOR, metalness: 0.4, roughness: 0.3 })),
  );
  ball.position.y = -0.7;
  tilt.add(wire, ball);
  spin.add(tilt);
  group.add(post, arm, spin);
  return (dt) => { spin.rotation.y += dt * 2.5; };
};

// ── Alas ──

export const WINGS: Record<string, WingDef & { title: string; color: number }> = {
  'ala-mecanica': {
    title: 'Ala da Mecânica',
    color: MECHANICS_COLOR,
    centerpiece: mechanicsPiece,
    noExit: true, // sem salão principal: esta ala é o nível de entrada
    entries: [
      door('simple-pendulum', 'Pêndulo de Galileu', MECHANICS_COLOR),
      door('projectile-room', 'Lançamento de projéteis', MECHANICS_COLOR),
      door('kepler-room', 'Leis de Kepler', MECHANICS_COLOR),
      door('conical-pendulum', 'Pêndulo cônico', MECHANICS_COLOR),
      door('waves-room', 'Ondas', MECHANICS_COLOR),
      door('foucault-pendulum', 'Pêndulo de Foucault', MECHANICS_COLOR),
    ],
  },
};

// Portas das alas no salão principal (todas na mesma parede).
export const WING_DOORS: DoorEntry[] = Object.entries(WINGS).map(([id, w]) => ({
  id, title: w.title, category: WINGS_CATEGORY, color: w.color,
}));
