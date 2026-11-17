// Modelo atômico de Dalton (1808) — experimento MONTÁVEL (ver core/mountable.ts).
// Protótipo para a ala "Museu dos Modelos Atômicos" do Museu Virtual.
//
// Para Dalton, o átomo é uma esfera maciça e indivisível, e cada elemento tem
// o seu tipo de átomo. Numa reação, os átomos não são criados nem destruídos:
// só se rearranjam (por isso a massa se conserva — exercício 1 da lista).
//
// No centro, uma esfera maciça grande. Ao lado, os "reagentes" e o "produto"
// da reação escolhida, montados com bolinhas; o painel conta os átomos dos
// dois lados.

import * as THREE from 'three';
import type { MountableExperiment, MountedExperiment } from '../../../core/mountable';
import { createTextPanel } from '../../../core/textPanel';

export type DaltonReaction = 'agua' | 'gas_carbonico';

export interface DaltonConfig {
  reaction: DaltonReaction;
}

// Cores e tamanhos dos átomos (raio relativo, só visual).
const ATOMS = {
  H: { color: 0xf0f0f0, r: 0.12 },
  O: { color: 0xe74c3c, r: 0.18 },
  C: { color: 0x333333, r: 0.18 },
} as const;
type Symbol = keyof typeof ATOMS;
type Molecule = { atom: Symbol; at: [number, number, number] }[];

const H2: Molecule = [{ atom: 'H', at: [-0.12, 0, 0] }, { atom: 'H', at: [0.12, 0, 0] }];
const O2: Molecule = [{ atom: 'O', at: [-0.18, 0, 0] }, { atom: 'O', at: [0.18, 0, 0] }];
const C1: Molecule = [{ atom: 'C', at: [0, 0, 0] }];
const H2O: Molecule = [{ atom: 'O', at: [0, 0, 0] }, { atom: 'H', at: [-0.22, -0.14, 0] }, { atom: 'H', at: [0.22, -0.14, 0] }];
const CO2: Molecule = [{ atom: 'C', at: [0, 0, 0] }, { atom: 'O', at: [-0.34, 0, 0] }, { atom: 'O', at: [0.34, 0, 0] }];

const REACTIONS: Record<DaltonReaction, { title: string; left: Molecule[]; right: Molecule[] }> = {
  agua: { title: '2 H₂ + O₂ → 2 H₂O', left: [H2, H2, O2], right: [H2O, H2O] },
  gas_carbonico: { title: 'C + O₂ → CO₂', left: [C1, O2], right: [CO2] },
};

function count(ms: Molecule[]): string {
  const c: Record<string, number> = {};
  ms.flat().forEach(({ atom }) => { c[atom] = (c[atom] ?? 0) + 1; });
  return Object.entries(c).map(([a, n]) => `${n} ${a}`).join(' + ');
}

export const daltonModel: MountableExperiment<DaltonConfig, MountedExperiment<DaltonConfig>> = {
  mount({ root }, config) {
    const bigGeo = new THREE.SphereGeometry(0.7, 48, 32);
    const bigMat = new THREE.MeshStandardMaterial({ color: 0x8e8e9a, roughness: 0.55, metalness: 0.1 });
    const big = new THREE.Mesh(bigGeo, bigMat);
    root.add(big);

    const sphereGeo = new THREE.SphereGeometry(1, 24, 16);
    const mats = Object.fromEntries(
      Object.entries(ATOMS).map(([k, v]) => [k, new THREE.MeshStandardMaterial({ color: v.color, roughness: 0.5 })]),
    ) as Record<Symbol, THREE.MeshStandardMaterial>;

    const reaction = new THREE.Group();
    reaction.position.set(0, -0.6, 1.4);
    root.add(reaction);

    const arrowMat = new THREE.MeshBasicMaterial({ color: 0xf1c40f });
    const arrowGeo = new THREE.ConeGeometry(0.08, 0.25, 16);
    const arrow = new THREE.Mesh(arrowGeo, arrowMat);
    arrow.rotation.z = -Math.PI / 2;

    const panel = createTextPanel(1.8, 0.55);
    panel.mesh.position.set(0, -1.2, 2.0); // abaixo da reação, virado para o visitante
    panel.mesh.rotation.x = -0.5;
    root.add(panel.mesh);

    const spinning: THREE.Group[] = [];

    function buildMolecule(m: Molecule): THREE.Group {
      const g = new THREE.Group();
      for (const { atom, at } of m) {
        const s = new THREE.Mesh(sphereGeo, mats[atom]);
        s.scale.setScalar(ATOMS[atom].r);
        s.position.set(...at);
        g.add(s);
      }
      spinning.push(g);
      return g;
    }

    function build(cfg: DaltonConfig) {
      reaction.clear();
      spinning.length = 0;
      const r = REACTIONS[cfg.reaction];
      const place = (ms: Molecule[], x0: number, x1: number) => ms.forEach((m, i) => {
        const g = buildMolecule(m);
        g.position.x = ms.length === 1 ? (x0 + x1) / 2 : x0 + ((x1 - x0) * i) / (ms.length - 1);
        reaction.add(g);
      });
      place(r.left, -2.2, -0.7);
      place(r.right, 0.7, 2.2);
      reaction.add(arrow);
      panel.setLines([
        `Dalton (1808): ${r.title}`,
        `Antes: ${count(r.left)} · Depois: ${count(r.right)}`,
      ]);
    }
    build(config);

    return {
      tick(dt) {
        big.rotation.y += dt * 0.3;
        spinning.forEach((g) => { g.rotation.y += dt * 0.8; });
      },
      update(cfg) { build(cfg); },
      dispose() {
        root.remove(big, reaction, panel.mesh);
        [bigGeo, sphereGeo, arrowGeo].forEach((g) => g.dispose());
        [bigMat, arrowMat, ...Object.values(mats)].forEach((m) => m.dispose());
        panel.dispose();
      },
    };
  },
};
