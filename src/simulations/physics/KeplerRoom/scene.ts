// Leis de Kepler — sala do "Museu da Mecânica" (protótipo do TCC).
//
// Diferente do Sistema Solar do site (raios comprimidos), aqui os raios são
// proporcionais aos reais (em UA) e o período sai da 3ª Lei: T² = a³
// (T em anos, a em UA). Assim a lei vale de verdade dentro da sala.
//
// Além dos planetas reais (Mercúrio a Júpiter) há um "Planeta X" cuja
// distância o estudante escolhe: ele calcula o período e confere contando quantas
// voltas a Terra dá enquanto o Planeta X dá uma (exercícios 10 e 11).

import * as THREE from 'three';
import type { MountableExperiment, MountedExperiment } from '../../../core/mountable';
import { createTextPanel } from '../../../core/textPanel';
import { ghostMaterial } from '../../../core/marcadores';

export interface KeplerConfig {
  planetX: number;      // UA
  yearsPerSecond: number;
  // Marcador da resposta: período escolhido para o Planeta X (anos). Um
  // planeta "fantasma" anda na mesma órbita com esse período; se estiver
  // certo, ele acompanha o Planeta X. 0 = desligado.
  fantasmaT?: number;
}

const AU = 1.15; // metros de sala por UA

const PLANETS: { name: string; a: number; color: number; size: number }[] = [
  { name: 'Mercúrio', a: 0.39, color: 0xb0a090, size: 0.06 },
  { name: 'Vênus', a: 0.72, color: 0xe8c07a, size: 0.09 },
  { name: 'Terra', a: 1.0, color: 0x3d85c6, size: 0.1 },
  { name: 'Marte', a: 1.52, color: 0xc1440e, size: 0.08 },
  { name: 'Júpiter', a: 5.2, color: 0xd8a66e, size: 0.25 },
];

const period = (a: number) => Math.pow(a, 1.5); // anos (3ª Lei de Kepler)
const fmt = (x: number, d = 1) => x.toFixed(d).replace('.', ',');

export const keplerRoom: MountableExperiment<KeplerConfig, MountedExperiment<KeplerConfig>> = {
  mount({ root }, config) {
    let cfg = config;

    const sunGeo = new THREE.SphereGeometry(0.3, 32, 20);
    const sunMat = new THREE.MeshBasicMaterial({ color: 0xffcc33 });
    const sun = new THREE.Mesh(sunGeo, sunMat);
    const sunLight = new THREE.PointLight(0xffeeaa, 2, 7.5, 1); // luz do fenômeno: o Sol ilumina os planetas
    root.add(sun, sunLight);

    const ringMat = new THREE.LineBasicMaterial({ color: 0x55557a });
    const xRingMat = new THREE.LineBasicMaterial({ color: 0xe67e22 });
    const planetGeo = new THREE.SphereGeometry(1, 24, 16);
    const geos: THREE.BufferGeometry[] = [];
    const mats: THREE.Material[] = [];

    function ring(a: number, mat: THREE.LineBasicMaterial) {
      const pts = Array.from({ length: 128 }, (_, i) => {
        const ang = (i / 128) * Math.PI * 2;
        return new THREE.Vector3(Math.cos(ang) * a * AU, 0, Math.sin(ang) * a * AU);
      });
      const g = new THREE.BufferGeometry().setFromPoints(pts);
      geos.push(g);
      return new THREE.LineLoop(g, mat);
    }

    const bodies = PLANETS.map((p) => {
      const mat = new THREE.MeshStandardMaterial({ color: p.color, roughness: 0.7 });
      mats.push(mat);
      const mesh = new THREE.Mesh(planetGeo, mat);
      mesh.scale.setScalar(p.size);
      root.add(mesh, ring(p.a, ringMat));
      return { ...p, mesh, phase: Math.random() * Math.PI * 2 };
    });

    const xMat = new THREE.MeshStandardMaterial({ color: 0xe67e22, emissive: 0xe67e22, emissiveIntensity: 0.4 });
    const planetX = new THREE.Mesh(planetGeo, xMat);
    planetX.scale.setScalar(0.14);
    root.add(planetX);
    let xRing: THREE.LineLoop | null = null;

    const ghostMat = ghostMaterial(0.45);
    const ghost = new THREE.Mesh(planetGeo, ghostMat);
    ghost.scale.setScalar(0.24);
    root.add(ghost);

    const panel = createTextPanel(2.4, 0.8);
    panel.mesh.position.set(4.2, 0.9, 2.8); // à direita de quem entra, virado para ele
    panel.mesh.rotation.y = -0.8;
    root.add(panel.mesh);

    let years = 0;

    function build() {
      if (xRing) root.remove(xRing);
      xRing = ring(cfg.planetX, xRingMat);
      root.add(xRing);
      years = 0;
    }
    build();

    const place = (mesh: THREE.Object3D, a: number, phase: number) => {
      const ang = phase + (2 * Math.PI * years) / period(a);
      mesh.position.set(Math.cos(ang) * a * AU, 0, -Math.sin(ang) * a * AU);
    };

    return {
      tick(dt) {
        years += dt * cfg.yearsPerSecond;
        bodies.forEach((b) => place(b.mesh, b.a, b.phase));
        place(planetX, cfg.planetX, 0);
        ghost.visible = (cfg.fantasmaT ?? 0) > 0;
        if (ghost.visible) {
          const ang = (2 * Math.PI * years) / cfg.fantasmaT!;
          ghost.position.set(Math.cos(ang) * cfg.planetX * AU, 0, -Math.sin(ang) * cfg.planetX * AU);
        }
        panel.setLines([
          `Planeta X a ${fmt(cfg.planetX)} UA do Sol`,
          `Anos terrestres passados: ${fmt(years)} (voltas da Terra: ${Math.floor(years)})`,
          `Voltas completas do Planeta X: ${Math.floor(years / period(cfg.planetX))}`,
        ]);
      },
      update(next) {
        cfg = next;
        build();
      },
      dispose() {
        root.clear();
        [sunGeo, planetGeo, ...geos].forEach((g) => g.dispose());
        [sunMat, ringMat, xRingMat, xMat, ghostMat, ...mats].forEach((m) => m.dispose());
        sunLight.dispose();
        panel.dispose();
      },
    };
  },
};
