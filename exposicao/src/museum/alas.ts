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
import { sala as daltonRoom } from '../simulations/chemistry/DaltonModel/sala';
import { sala as thomsonRoom } from '../simulations/chemistry/ThomsonModel/sala';
import { sala as rutherfordRoom } from '../simulations/chemistry/RutherfordModel/sala';

export const WINGS_CATEGORY = 'Alas temáticas';

const MECHANICS_COLOR = 0xe67e22;
const ATOMS_COLOR = 0x1abc9c;

// Salas que só existem nas alas (id da porta → sala interativa).
export const WING_ROOMS: Record<string, InteractiveRoom> = {
  'conical-pendulum': conicalRoom as InteractiveRoom,
  'foucault-pendulum': foucaultRoom as InteractiveRoom,
  'projectile-room': projectileRoom as InteractiveRoom,
  'kepler-room': keplerRoom as InteractiveRoom,
  'waves-room': wavesRoom as InteractiveRoom,
  'dalton-model': daltonRoom as InteractiveRoom,
  'thomson-model': thomsonRoom as InteractiveRoom,
  'rutherford-model': rutherfordRoom as InteractiveRoom,
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

// Museu dos Modelos Atômicos: núcleo com três órbitas (o "símbolo do átomo").
const atomPiece: Centerpiece = (group, t) => {
  const atom = new THREE.Group();
  atom.position.y = 0.75;
  const nucleus = new THREE.Mesh(
    t.track(new THREE.SphereGeometry(0.1, 20, 14)),
    t.track(new THREE.MeshStandardMaterial({ color: 0xe74c3c, emissive: 0xe74c3c, emissiveIntensity: 0.3 })),
  );
  atom.add(nucleus);
  const ringGeo = t.track(new THREE.TorusGeometry(0.45, 0.008, 8, 64));
  const ringMat = t.track(new THREE.MeshBasicMaterial({ color: ATOMS_COLOR }));
  const eGeo = t.track(new THREE.SphereGeometry(0.035, 12, 8));
  const eMat = t.track(new THREE.MeshStandardMaterial({ color: 0x3498db, emissive: 0x3498db, emissiveIntensity: 0.6 }));
  const orbits: THREE.Group[] = [];
  [0, Math.PI / 3, -Math.PI / 3].forEach((angle) => {
    const orbit = new THREE.Group();
    orbit.rotation.set(Math.PI / 2, angle, 0);
    orbit.add(new THREE.Mesh(ringGeo, ringMat));
    const e = new THREE.Mesh(eGeo, eMat);
    e.position.x = 0.45;
    const spinner = new THREE.Group();
    spinner.add(e);
    orbit.add(spinner);
    orbits.push(spinner);
    atom.add(orbit);
  });
  group.add(atom);
  return (dt) => {
    atom.rotation.y += dt * 0.4;
    orbits.forEach((s, i) => { s.rotation.z += dt * (1.5 + i * 0.4); });
  };
};

// ── Alas ──

export const WINGS: Record<string, WingDef & { title: string; color: number }> = {
  'ala-mecanica': {
    title: 'Ala da Mecânica',
    color: MECHANICS_COLOR,
    centerpiece: mechanicsPiece,
    // Ordem das portas: parede da esquerda → fundo → direita.
    entries: [
      door('simple-pendulum', 'Pêndulo de Galileu', MECHANICS_COLOR),
      door('projectile-room', 'Lançamento de projéteis', MECHANICS_COLOR),
      door('kepler-room', 'Leis de Kepler', MECHANICS_COLOR),
      door('conical-pendulum', 'Pêndulo cônico', MECHANICS_COLOR),
      door('waves-room', 'Ondas', MECHANICS_COLOR),
      door('foucault-pendulum', 'Pêndulo de Foucault', MECHANICS_COLOR),
    ],
  },
  'ala-atomos': {
    title: 'Ala dos Modelos Atômicos',
    color: ATOMS_COLOR,
    centerpiece: atomPiece,
    // Linha do tempo: Dalton (1808) → Thomson (1904) → Rutherford (1911) → Bohr (1913) → VSEPR
    entries: [
      door('dalton-model', 'Dalton (1808)', ATOMS_COLOR),
      door('thomson-model', 'Thomson (1904)', ATOMS_COLOR),
      door('rutherford-model', 'Rutherford (1911)', ATOMS_COLOR),
      door('bohr-model', 'Bohr (1913)', ATOMS_COLOR),
      door('molecular-geometry', 'Geometria molecular', ATOMS_COLOR),
    ],
  },
};

// Portas das alas no salão principal (todas na mesma parede).
export const WING_DOORS: DoorEntry[] = Object.entries(WINGS).map(([id, w]) => ({
  id, title: w.title, category: WINGS_CATEGORY, color: w.color,
}));
