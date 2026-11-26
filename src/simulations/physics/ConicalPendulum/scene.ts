// Pêndulo cônico — experimento MONTÁVEL (ver core/mountable.ts).
// Protótipo para a ala "Museu da Mecânica" do Museu Virtual.
//
// Hierarquia (origem = ponto de suspensão):
//   spin  — gira em Y pelo ângulo φ(t) = ω·t
//     tilt — inclinado em Z pelo ângulo θ do fio
//       rod (fio) e mass, pendurados em −Y
//   cone  — cone translúcido que o fio descreve
//   path  — círculo da trajetória da massa
//   panel — placa com raio, período e velocidade

import * as THREE from 'three';
import type { MountableExperiment, MountedExperiment } from '../../../core/mountable';
import { createTextPanel } from '../../../core/textPanel';
import { conicalInfo, type ConicalConfig } from './physics';
import { ghostMaterial } from '../../../core/marcadores';

const fmt = (x: number, d = 2) => x.toFixed(d).replace('.', ',');

export const conicalPendulum: MountableExperiment<ConicalConfig, MountedExperiment<ConicalConfig>> = {
  mount({ root }, config) {
    const pivotGeo = new THREE.SphereGeometry(0.07, 12, 8);
    const pivotMat = new THREE.MeshStandardMaterial({ color: 0x888888, metalness: 0.8, roughness: 0.35 });
    const pivot = new THREE.Mesh(pivotGeo, pivotMat);
    root.add(pivot);

    const spin = new THREE.Group();
    const tilt = new THREE.Group();
    spin.add(tilt);
    root.add(spin);

    const rodMat = new THREE.MeshStandardMaterial({ color: 0x95a5a6, metalness: 0.7, roughness: 0.3 });
    const massGeo = new THREE.SphereGeometry(0.18, 20, 14);
    const massMat = new THREE.MeshStandardMaterial({ color: 0xe67e22, metalness: 0.2, roughness: 0.25 });
    const mass = new THREE.Mesh(massGeo, massMat);
    tilt.add(mass);

    const coneMat = new THREE.MeshBasicMaterial({ color: 0xe67e22, transparent: true, opacity: 0.08, side: THREE.DoubleSide, depthWrite: false });
    const pathMat = new THREE.LineBasicMaterial({ color: 0xf5c16c });

    // Fantasma da resposta: halo verde que gira com o período escolhido.
    const ghostSpin = new THREE.Group();
    const ghostGeo = new THREE.SphereGeometry(0.3, 20, 14);
    const ghostMat = ghostMaterial(0.4);
    const ghost = new THREE.Mesh(ghostGeo, ghostMat);
    ghostSpin.add(ghost);
    root.add(ghostSpin);

    let rod: THREE.Mesh | null = null;
    let cone: THREE.Mesh | null = null;
    let path: THREE.LineLoop | null = null;

    const panel = createTextPanel(1.6, 0.6);
    panel.mesh.position.set(-3.6, -1.6, 0); // na parede da esquerda, fora do alcance da massa
    panel.mesh.rotation.y = Math.PI / 2;
    root.add(panel.mesh);

    let cfg = config;
    let info = conicalInfo(cfg);
    let elapsed = 0;

    function build() {
      info = conicalInfo(cfg);
      if (rod) { tilt.remove(rod); rod.geometry.dispose(); }
      if (cone) { root.remove(cone); cone.geometry.dispose(); }
      if (path) { root.remove(path); path.geometry.dispose(); }

      rod = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, cfg.L, 8), rodMat);
      rod.position.y = -cfg.L / 2;
      tilt.add(rod);
      mass.position.y = -cfg.L;
      tilt.rotation.z = cfg.theta;
      ghost.position.set(cfg.L * Math.sin(cfg.theta), -cfg.L * Math.cos(cfg.theta), 0);
      ghostSpin.visible = (cfg.fantasmaT ?? 0) > 0;
      ghostSpin.rotation.y = 0;

      cone = new THREE.Mesh(new THREE.ConeGeometry(info.r, info.h, 48, 1, true), coneMat);
      cone.position.y = -info.h / 2;
      root.add(cone);

      const pts = Array.from({ length: 96 }, (_, i) => {
        const a = (i / 96) * Math.PI * 2;
        return new THREE.Vector3(info.r * Math.cos(a), -info.h, info.r * Math.sin(a));
      });
      path = new THREE.LineLoop(new THREE.BufferGeometry().setFromPoints(pts), pathMat);
      root.add(path);

      panel.setLines([
        'Pêndulo cônico',
        `L = ${fmt(cfg.L)} m · θ = ${Math.round(cfg.theta * 180 / Math.PI)}° · g = ${fmt(cfg.g, 1)} m/s²`,
        `raio = ${fmt(info.r)} m · voltas: ${Math.floor(elapsed / info.period)}`,
      ]);
    }
    build();

    return {
      tick(dt) {
        elapsed += dt;
        spin.rotation.y = -info.omega * elapsed;
        if (cfg.fantasmaT) ghostSpin.rotation.y = -((2 * Math.PI) / cfg.fantasmaT) * elapsed;
        panel.setLines([
          'Pêndulo cônico',
          `L = ${fmt(cfg.L)} m · θ = ${Math.round(cfg.theta * 180 / Math.PI)}° · g = ${fmt(cfg.g, 1)} m/s²`,
          `raio = ${fmt(info.r)} m · voltas: ${Math.floor(elapsed / info.period)}`,
        ]);
      },
      update(next) {
        cfg = next;
        elapsed = 0;
        build();
      },
      dispose() {
        root.remove(pivot, spin, panel.mesh, ghostSpin);
        ghostGeo.dispose();
        ghostMat.dispose();
        if (cone) root.remove(cone);
        if (path) root.remove(path);
        rod?.geometry.dispose();
        cone?.geometry.dispose();
        path?.geometry.dispose();
        [pivotGeo, massGeo].forEach((g) => g.dispose());
        [pivotMat, rodMat, massMat, coneMat, pathMat].forEach((m) => m.dispose());
        panel.dispose();
      },
    };
  },
};
