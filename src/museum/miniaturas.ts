// Miniaturas dos pedestais das alas (uma por sala), como os pedestais do hall
// do ECOS, só que animadas e feitas por código (sem modelos 3D para baixar).
// Cada uma cabe num cubo de ~0,6 m em cima de um pedestal de 1 m.

import * as THREE from 'three';
import type { Tracker } from './builders';
import type { Centerpiece } from './levels';

const std = (t: Tracker, color: number, extra: THREE.MeshStandardMaterialParameters = {}) =>
  t.track(new THREE.MeshStandardMaterial({ color, roughness: 0.5, ...extra }));
const sphere = (t: Tracker, r: number) => t.track(new THREE.SphereGeometry(r, 18, 12));
const DARK = 0x3d342c; // bronze escuro (combina com a madeira)

// Pórtico com um fio pendurado: devolve o grupo que balança.
function gallows(group: THREE.Group, t: Tracker, height: number, color: number): THREE.Group {
  const mat = std(t, DARK);
  const post = new THREE.Mesh(t.track(new THREE.CylinderGeometry(0.015, 0.015, height, 6)), mat);
  post.position.set(-0.18, height / 2, 0);
  const arm = new THREE.Mesh(t.track(new THREE.BoxGeometry(0.22, 0.02, 0.02)), mat);
  arm.position.set(-0.08, height, 0);
  const swing = new THREE.Group();
  swing.position.set(0, height, 0);
  const wire = new THREE.Mesh(t.track(new THREE.CylinderGeometry(0.004, 0.004, height * 0.75, 4)), mat);
  wire.position.y = -height * 0.375;
  const bob = new THREE.Mesh(sphere(t, 0.04), std(t, color, { metalness: 0.4 }));
  bob.position.y = -height * 0.75;
  swing.add(wire, bob);
  group.add(post, arm, swing);
  return swing;
}

const pendulum: Centerpiece = (group, t) => {
  const swing = gallows(group, t, 0.5, 0xe74c3c);
  let time = 0;
  return (dt) => { time += dt; swing.rotation.z = 0.6 * Math.cos(time * 3); };
};

const conical: Centerpiece = (group, t) => {
  const swing = gallows(group, t, 0.5, 0xe67e22);
  swing.rotation.z = 0.5;
  const spin = new THREE.Group();
  spin.position.copy(swing.position);
  swing.position.set(0, 0, 0);
  spin.add(swing);
  group.add(spin);
  return (dt) => { spin.rotation.y += dt * 2.5; };
};

const foucault: Centerpiece = (group, t) => {
  const swing = gallows(group, t, 0.55, 0xc9a227);
  const plane = new THREE.Group();
  plane.position.copy(swing.position);
  swing.position.set(0, 0, 0);
  plane.add(swing);
  group.add(plane);
  const pinGeo = t.track(new THREE.CylinderGeometry(0.006, 0.006, 0.04, 4));
  const pinMat = std(t, 0xdddddd);
  for (let i = 0; i < 16; i++) {
    const a = (i / 16) * Math.PI * 2;
    const pin = new THREE.Mesh(pinGeo, pinMat);
    pin.position.set(0.17 * Math.cos(a), 0.02, 0.17 * Math.sin(a));
    group.add(pin);
  }
  let time = 0;
  return (dt) => {
    time += dt;
    swing.rotation.z = 0.35 * Math.cos(time * 3);
    plane.rotation.y -= dt * 0.3; // o plano gira devagar
  };
};

const projectile: Centerpiece = (group, t) => {
  const barrel = new THREE.Mesh(t.track(new THREE.CylinderGeometry(0.02, 0.025, 0.12, 10)), std(t, DARK));
  barrel.position.set(-0.22, 0.04, 0);
  barrel.rotation.z = -Math.PI / 2 + 0.6;
  const ball = new THREE.Mesh(sphere(t, 0.025), std(t, 0xe67e22));
  const pts = Array.from({ length: 30 }, (_, i) => {
    const s = i / 29;
    return new THREE.Vector3(-0.22 + 0.44 * s, 0.04 + 0.32 * s * (1 - s) * 4 * 0.6, 0);
  });
  const arc = new THREE.Line(t.track(new THREE.BufferGeometry().setFromPoints(pts)), t.track(new THREE.LineBasicMaterial({ color: 0xf5c16c })));
  group.add(barrel, ball, arc);
  let s = 0;
  return (dt) => {
    s = (s + dt * 0.6) % 1;
    ball.position.set(-0.22 + 0.44 * s, 0.04 + 0.32 * s * (1 - s) * 4 * 0.6, 0);
  };
};

const kepler: Centerpiece = (group, t) => {
  const sun = new THREE.Mesh(sphere(t, 0.05), t.track(new THREE.MeshBasicMaterial({ color: 0xffcc33 })));
  sun.position.y = 0.25;
  group.add(sun);
  const planets = [[0.12, 0x3d85c6], [0.2, 0xc1440e], [0.28, 0xd8a66e]].map(([a, color]) => {
    const p = new THREE.Mesh(sphere(t, 0.02), std(t, color));
    group.add(p);
    return { a, mesh: p, phase: Math.random() * 6 };
  });
  let years = 0;
  return (dt) => {
    years += dt * 0.6;
    planets.forEach(({ a, mesh, phase }) => {
      const ang = phase + (2 * Math.PI * years) / Math.pow(a / 0.12, 1.5);
      mesh.position.set(Math.cos(ang) * a, 0.25, Math.sin(ang) * a);
    });
  };
};

const waves: Centerpiece = (group, t) => {
  const n = 24;
  const beadGeo = sphere(t, 0.012);
  const beadMat = std(t, 0x5dade2);
  const beads = Array.from({ length: n }, () => {
    const b = new THREE.Mesh(beadGeo, beadMat);
    group.add(b);
    return b;
  });
  let time = 0;
  return (dt) => {
    time += dt;
    beads.forEach((b, i) => {
      const x = -0.25 + (0.5 * i) / (n - 1);
      b.position.set(x, 0.25 + 0.06 * Math.sin(x * 25 - time * 4), 0);
    });
  };
};

// id da porta → miniatura
export const MINIATURAS: Record<string, Centerpiece> = {
  'simple-pendulum': pendulum,
  'projectile-room': projectile,
  'kepler-room': kepler,
  'conical-pendulum': conical,
  'waves-room': waves,
  'foucault-pendulum': foucault,
};
