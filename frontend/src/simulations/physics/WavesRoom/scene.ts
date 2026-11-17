// Ondas — sala do "Museu da Mecânica" (protótipo do TCC).
//
// Uma corda de contas esticada ao longo de X com uma onda transversal
// y = A·sen(k·x − ω·t), com k = 2π/λ e ω = 2π·f. Uma conta vermelha marca uma
// crista que anda com a onda, e o chão tem marcas a cada 0,5 m: o aluno mede
// quanto a crista anda num período e confere v = λ·f (exercícios 12 e 13).
// O painel mostra λ, f e o período, mas não a velocidade.

import * as THREE from 'three';
import type { MountableExperiment, MountedExperiment } from '../../../core/mountable';
import { createTextPanel, type TextPanel } from '../../../core/textPanel';

export interface WavesConfig {
  amplitude: number;  // m
  wavelength: number; // m
  frequency: number;  // Hz
}

const LENGTH = 10; // m de corda
const BEADS = 160;
const fmt = (x: number, d = 2) => x.toFixed(d).replace('.', ',');

export const wavesRoom: MountableExperiment<WavesConfig, MountedExperiment<WavesConfig>> = {
  mount({ root }, config) {
    let cfg = config;

    const beadGeo = new THREE.SphereGeometry(0.045, 10, 8);
    const beadMat = new THREE.MeshStandardMaterial({ color: 0x5dade2, roughness: 0.4 });
    const beads = new THREE.InstancedMesh(beadGeo, beadMat, BEADS);
    root.add(beads);

    const linePos = new Float32Array(BEADS * 3);
    const lineGeo = new THREE.BufferGeometry();
    lineGeo.setAttribute('position', new THREE.BufferAttribute(linePos, 3));
    const lineMat = new THREE.LineBasicMaterial({ color: 0x2e86c1 });
    root.add(new THREE.Line(lineGeo, lineMat));

    const crestGeo = new THREE.SphereGeometry(0.09, 16, 12);
    const crestMat = new THREE.MeshStandardMaterial({ color: 0xe74c3c, emissive: 0xe74c3c, emissiveIntensity: 0.4 });
    const crest = new THREE.Mesh(crestGeo, crestMat);
    root.add(crest);

    // Postes nas pontas e marcas no chão a cada 0,5 m
    const postGeo = new THREE.CylinderGeometry(0.05, 0.05, 1.6, 10);
    const postMat = new THREE.MeshStandardMaterial({ color: 0x3a3a55 });
    for (const x of [-LENGTH / 2, LENGTH / 2]) {
      const post = new THREE.Mesh(postGeo, postMat);
      post.position.set(x, -0.7, 0);
      root.add(post);
    }
    const markGeo = new THREE.BoxGeometry(0.02, 0.01, 0.4);
    const markMat = new THREE.MeshBasicMaterial({ color: 0xdddddd });
    const labels: TextPanel[] = [];
    for (let i = 0; i <= LENGTH * 2; i++) {
      const x = -LENGTH / 2 + i * 0.5;
      const mark = new THREE.Mesh(markGeo, markMat);
      mark.position.set(x, -1.49, 0.6);
      mark.scale.z = i % 2 === 0 ? 1.6 : 1;
      root.add(mark);
      if (i % 2 === 0) {
        const label = createTextPanel(0.5, 0.22, 256);
        label.setLines([`${i / 2} m`]);
        label.mesh.position.set(x, -1.35, 1.0);
        label.mesh.rotation.x = -0.7;
        root.add(label.mesh);
        labels.push(label);
      }
    }

    const panel = createTextPanel(2.6, 0.8);
    panel.mesh.position.set(-5.0, 0.4, 2.4); // à esquerda, virado para o visitante
    panel.mesh.rotation.y = 0.8;
    root.add(panel.mesh);

    let t = 0;
    const m = new THREE.Matrix4();

    function setPanel() {
      panel.setLines([
        `Comprimento de onda λ = ${fmt(cfg.wavelength)} m · frequência f = ${fmt(cfg.frequency, 1)} Hz`,
        `Período T = ${fmt(1 / cfg.frequency)} s · amplitude = ${fmt(cfg.amplitude)} m`,
        'Quanto a crista vermelha anda em um período?',
      ]);
    }
    setPanel();

    return {
      tick(dt) {
        t += dt;
        const k = (2 * Math.PI) / cfg.wavelength;
        const w = 2 * Math.PI * cfg.frequency;
        for (let i = 0; i < BEADS; i++) {
          const x = -LENGTH / 2 + (LENGTH * i) / (BEADS - 1);
          const y = cfg.amplitude * Math.sin(k * (x + LENGTH / 2) - w * t);
          m.makeTranslation(x, y, 0);
          beads.setMatrixAt(i, m);
          linePos.set([x, y, 0], i * 3);
        }
        beads.instanceMatrix.needsUpdate = true;
        lineGeo.attributes.position.needsUpdate = true;
        // Crista: onde k·(x + L/2) − ω·t = π/2; anda a v = λ·f e recomeça na ponta.
        const v = cfg.wavelength * cfg.frequency;
        const travel = (cfg.wavelength / 4 + v * t) % LENGTH;
        crest.position.set(-LENGTH / 2 + travel, cfg.amplitude, 0);
      },
      update(next) {
        cfg = next;
        t = 0;
        setPanel();
      },
      dispose() {
        root.clear();
        [beadGeo, lineGeo, crestGeo, postGeo, markGeo].forEach((g) => g.dispose());
        [beadMat, lineMat, crestMat, postMat, markMat].forEach((mt) => mt.dispose());
        beads.dispose();
        labels.forEach((l) => l.dispose());
        panel.dispose();
      },
    };
  },
};
