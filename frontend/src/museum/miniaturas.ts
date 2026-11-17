// Miniaturas dos pedestais das alas (uma por sala), como os pedestais do hall
// do ECOS, só que animadas e feitas por código (sem modelos 3D para baixar).
// Cada uma cabe num cubo de ~0,6 m em cima de um pedestal de 1 m.

import * as THREE from 'three';
import type { Tracker } from './builders';
import type { Centerpiece } from './levels';

const std = (t: Tracker, color: number, extra: THREE.MeshStandardMaterialParameters = {}) =>
  t.track(new THREE.MeshStandardMaterial({ color, roughness: 0.5, ...extra }));
const sphere = (t: Tracker, r: number) => t.track(new THREE.SphereGeometry(r, 18, 12));
const DARK = 0x3a3a55;

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

const dalton: Centerpiece = (group, t) => {
  const atom = new THREE.Mesh(sphere(t, 0.13), std(t, 0x8e8e9a));
  atom.position.y = 0.2;
  group.add(atom);
  return (dt) => { atom.rotation.y += dt; };
};

const thomson: Centerpiece = (group, t) => {
  const atom = new THREE.Group();
  atom.position.y = 0.22;
  atom.add(new THREE.Mesh(sphere(t, 0.15), std(t, 0xff8fab, { transparent: true, opacity: 0.4, depthWrite: false })));
  const eGeo = sphere(t, 0.018);
  const eMat = std(t, 0x3498db, { emissive: 0x1f6fb2, emissiveIntensity: 0.5 });
  [[0.06, 0.05, 0.02], [-0.07, 0, 0.05], [0, -0.07, -0.04], [0.04, -0.02, 0.08], [-0.03, 0.08, -0.05], [0.07, 0.02, -0.07]].forEach((p) => {
    const e = new THREE.Mesh(eGeo, eMat);
    e.position.set(p[0], p[1], p[2]);
    atom.add(e);
  });
  group.add(atom);
  return (dt) => { atom.rotation.y += dt * 0.6; };
};

const rutherford: Centerpiece = (group, t) => {
  const foil = new THREE.Mesh(t.track(new THREE.BoxGeometry(0.004, 0.18, 0.18)), std(t, 0xd4af37, { metalness: 0.9, roughness: 0.25 }));
  foil.position.y = 0.2;
  const source = new THREE.Mesh(t.track(new THREE.BoxGeometry(0.06, 0.06, 0.06)), std(t, 0x555566));
  source.position.set(-0.25, 0.2, 0);
  const pGeo = sphere(t, 0.01);
  const pMat = t.track(new THREE.MeshBasicMaterial({ color: 0xff5e3a }));
  const parts = Array.from({ length: 6 }, (_, i) => {
    const m = new THREE.Mesh(pGeo, pMat);
    group.add(m);
    return { m, s: i / 6, bend: i === 2 ? 0.8 : i === 5 ? 2.6 : 0 };
  });
  group.add(foil, source);
  return (dt) => {
    parts.forEach((p) => {
      p.s = (p.s + dt * 0.35) % 1;
      const x = -0.22 + 0.5 * p.s;
      if (x < 0 || !p.bend) p.m.position.set(x, 0.2, 0);
      else p.m.position.set(Math.cos(p.bend) * x, 0.2 + Math.sin(p.bend) * x, 0); // desviada ou voltando
    });
  };
};

const bohr: Centerpiece = (group, t) => {
  const atom = new THREE.Group();
  atom.position.y = 0.22;
  atom.add(new THREE.Mesh(sphere(t, 0.035), std(t, 0xe74c3c)));
  const ringMat = t.track(new THREE.MeshBasicMaterial({ color: 0x8888aa }));
  const eGeo = sphere(t, 0.012);
  const eMat = std(t, 0x3498db, { emissive: 0x3498db, emissiveIntensity: 0.6 });
  const shells = [0.09, 0.16].map((r, i) => {
    const ring = new THREE.Mesh(t.track(new THREE.TorusGeometry(r, 0.002, 6, 48)), ringMat);
    ring.rotation.x = Math.PI / 2;
    const spin = new THREE.Group();
    const count = i === 0 ? 2 : 4;
    for (let k = 0; k < count; k++) {
      const e = new THREE.Mesh(eGeo, eMat);
      const a = (k / count) * Math.PI * 2;
      e.position.set(Math.cos(a) * r, 0, Math.sin(a) * r);
      spin.add(e);
    }
    atom.add(ring, spin);
    return { spin, speed: 1.5 / (i + 1) ** 3 * 4 };
  });
  group.add(atom);
  return (dt) => shells.forEach((s) => { s.spin.rotation.y += dt * s.speed; });
};

const geometry: Centerpiece = (group, t) => {
  const mol = new THREE.Group();
  mol.position.y = 0.22;
  mol.add(new THREE.Mesh(sphere(t, 0.04), std(t, 0x333333)));
  const hMat = std(t, 0xf0f0f0);
  const bondMat = std(t, 0x999999);
  const L = 0.13;
  [[1, 1, 1], [1, -1, -1], [-1, 1, -1], [-1, -1, 1]].forEach(([x, y, z]) => {
    const dir = new THREE.Vector3(x, y, z).normalize();
    const h = new THREE.Mesh(sphere(t, 0.025), hMat);
    h.position.copy(dir.clone().multiplyScalar(L));
    const bond = new THREE.Mesh(t.track(new THREE.CylinderGeometry(0.006, 0.006, L, 6)), bondMat);
    bond.position.copy(dir.clone().multiplyScalar(L / 2));
    bond.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir);
    mol.add(h, bond);
  });
  group.add(mol);
  return (dt) => { mol.rotation.y += dt * 0.7; mol.rotation.x += dt * 0.2; };
};

// id da porta → miniatura
export const MINIATURAS: Record<string, Centerpiece> = {
  'simple-pendulum': pendulum,
  'projectile-room': projectile,
  'kepler-room': kepler,
  'conical-pendulum': conical,
  'waves-room': waves,
  'foucault-pendulum': foucault,
  'dalton-model': dalton,
  'thomson-model': thomson,
  'rutherford-model': rutherford,
  'bohr-model': bohr,
  'molecular-geometry': geometry,
};
