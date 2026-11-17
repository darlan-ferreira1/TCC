// Modelo atômico de Thomson (1904), o "pudim de passas" — experimento MONTÁVEL.
// Protótipo para a ala "Museu dos Modelos Atômicos" do Museu Virtual.
//
// Uma esfera de carga positiva espalhada (translúcida) com os elétrons
// incrustados, como passas num pudim. O átomo é neutro: a carga positiva da
// esfera é igual ao número de elétrons (exercício 4 da lista).

import * as THREE from 'three';
import type { MountableExperiment, MountedExperiment } from '../../../core/mountable';
import { createTextPanel } from '../../../core/textPanel';

export interface ThomsonConfig {
  electrons: number;
}

const RADIUS = 1;

// Pontos bem espalhados dentro da esfera (espiral de Fibonacci em 2 cascas).
function positions(n: number): THREE.Vector3[] {
  const golden = Math.PI * (3 - Math.sqrt(5));
  return Array.from({ length: n }, (_, i) => {
    const y = n === 1 ? 0 : 1 - (2 * i) / (n - 1);
    const r = Math.sqrt(1 - y * y);
    const shell = i % 2 === 0 ? 0.65 : 0.38;
    return new THREE.Vector3(Math.cos(golden * i) * r, y, Math.sin(golden * i) * r).multiplyScalar(RADIUS * shell);
  });
}

export const thomsonModel: MountableExperiment<ThomsonConfig, MountedExperiment<ThomsonConfig>> = {
  mount({ root }, config) {
    const atom = new THREE.Group();
    root.add(atom);

    const puddingGeo = new THREE.SphereGeometry(RADIUS, 48, 32);
    const puddingMat = new THREE.MeshStandardMaterial({
      color: 0xff8fab, transparent: true, opacity: 0.35, roughness: 0.4, depthWrite: false,
    });
    atom.add(new THREE.Mesh(puddingGeo, puddingMat));

    const eGeo = new THREE.SphereGeometry(0.08, 16, 12);
    const eMat = new THREE.MeshStandardMaterial({ color: 0x3498db, emissive: 0x1f6fb2, emissiveIntensity: 0.5 });
    const minusMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const minusGeo = new THREE.BoxGeometry(0.09, 0.02, 0.02);
    let electrons: { mesh: THREE.Group; base: THREE.Vector3; seed: number }[] = [];

    const panel = createTextPanel(1.8, 0.55);
    panel.mesh.position.set(2.0, -0.3, 0.6); // ao lado do átomo, virado para o visitante
    panel.mesh.rotation.y = -0.6;
    root.add(panel.mesh);

    function build(cfg: ThomsonConfig) {
      electrons.forEach((e) => atom.remove(e.mesh));
      electrons = positions(cfg.electrons).map((base, i) => {
        const mesh = new THREE.Group();
        mesh.add(new THREE.Mesh(eGeo, eMat));
        const minus = new THREE.Mesh(minusGeo, minusMat); // sinal de "−"
        minus.position.z = 0.085;
        mesh.add(minus);
        mesh.position.copy(base);
        atom.add(mesh);
        return { mesh, base, seed: i * 1.7 };
      });
      panel.setLines([
        'Thomson (1904): "pudim de passas"',
        `Elétrons: ${cfg.electrons} (−${cfg.electrons}) · carga positiva: +${cfg.electrons} · total: 0`,
      ]);
    }
    build(config);

    let t = 0;
    return {
      tick(dt) {
        t += dt;
        atom.rotation.y += dt * 0.25;
        // os elétrons tremem um pouco em volta da posição fixa
        electrons.forEach(({ mesh, base, seed }) => {
          mesh.position.set(
            base.x + 0.02 * Math.sin(3 * t + seed),
            base.y + 0.02 * Math.sin(2.3 * t + seed * 2),
            base.z + 0.02 * Math.cos(2.7 * t + seed),
          );
        });
      },
      update(cfg) { build(cfg); },
      dispose() {
        root.remove(atom, panel.mesh);
        [puddingGeo, eGeo, minusGeo].forEach((g) => g.dispose());
        [puddingMat, eMat, minusMat].forEach((m) => m.dispose());
        panel.dispose();
      },
    };
  },
};
