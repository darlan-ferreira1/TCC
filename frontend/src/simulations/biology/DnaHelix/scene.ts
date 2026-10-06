// Cena da hélice de DNA — experimento MONTÁVEL (ver core/mountable.ts e
// ARQUITETURA.md, seção 22).
//
// Estrutura visual (dentro de `root`):
//   - Dois tubos (TubeGeometry sobre CatmullRomCurve3) para as fitas backbone.
//   - Esferas (SphereGeometry) em cada posição de nucleotídeo.
//   - Cilindros (CylinderGeometry) ligando strand1[i] ↔ strand2[i] — os "degraus".
//     Alternando 2 cores para representar os pares A-T e G-C.
//   - Um único Group (dnaGroup) gira no eixo Y a cada tick, produzindo a rotação lenta.
//
// Atualização de parâmetros: destrói e reconstrói a geometria do dnaGroup,
// reutilizando materiais e a geometria da esfera.

import * as THREE from 'three';
import { hostInPage } from '../../../core/hostInPage';
import type { MountableExperiment } from '../../../core/mountable';
import { computeDnaHelix } from './physics';

export interface DnaSceneConfig {
  basePairs: number;
  rotationSpeed: number; // voltas por segundo no eixo Y
}

export const dnaHelix: MountableExperiment<DnaSceneConfig> = {
  mount({ root }, config) {
    const dnaGroup = new THREE.Group();
    root.add(dnaGroup);

    // Materiais reutilizados entre rebuilds
    const mat = {
      strand1: new THREE.MeshPhongMaterial({ color: 0xe74c3c, shininess: 80 }), // vermelho
      strand2: new THREE.MeshPhongMaterial({ color: 0x3498db, shininess: 80 }), // azul
      rungA:   new THREE.MeshPhongMaterial({ color: 0xf39c12, shininess: 60 }), // laranja — par A-T
      rungB:   new THREE.MeshPhongMaterial({ color: 0x2ecc71, shininess: 60 }), // verde   — par G-C
    };

    // Geometria da esfera compartilhada (não é descartada no rebuild)
    const sphereGeo = new THREE.SphereGeometry(0.13, 12, 8);

    // Geometrias descartáveis geradas a cada rebuild (tubos e cilindros)
    let disposables: THREE.BufferGeometry[] = [];

    let currentSpeed = config.rotationSpeed;

    function cylinder(a: THREE.Vector3, b: THREE.Vector3, r: number, m: THREE.Material): THREE.Mesh {
      const geo = new THREE.CylinderGeometry(r, r, a.distanceTo(b), 8, 1);
      disposables.push(geo);
      const mesh = new THREE.Mesh(geo, m);
      mesh.position.copy(a).lerp(b, 0.5);
      mesh.quaternion.setFromUnitVectors(
        new THREE.Vector3(0, 1, 0),
        b.clone().sub(a).normalize(),
      );
      return mesh;
    }

    function buildGeometry(basePairs: number) {
      // Remove meshes anteriores e descarta suas geometrias
      while (dnaGroup.children.length) dnaGroup.remove(dnaGroup.children[0]);
      disposables.forEach((g) => g.dispose());
      disposables = [];

      const { strand1, strand2 } = computeDnaHelix(basePairs);

      const pts1 = strand1.map((p) => new THREE.Vector3(p.x, p.y, p.z));
      const pts2 = strand2.map((p) => new THREE.Vector3(p.x, p.y, p.z));

      // --- Tubos backbone ---
      if (basePairs >= 2) {
        const tubeGeo1 = new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts1), basePairs * 3, 0.07, 8, false);
        const tubeGeo2 = new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts2), basePairs * 3, 0.07, 8, false);
        disposables.push(tubeGeo1, tubeGeo2);
        dnaGroup.add(new THREE.Mesh(tubeGeo1, mat.strand1));
        dnaGroup.add(new THREE.Mesh(tubeGeo2, mat.strand2));
      }

      // --- Esferas nos nucleotídeos + cilindros dos degraus ---
      for (let i = 0; i < basePairs; i++) {
        const a = pts1[i];
        const b = pts2[i];

        const s1 = new THREE.Mesh(sphereGeo, mat.strand1);
        s1.position.copy(a);
        dnaGroup.add(s1);

        const s2 = new THREE.Mesh(sphereGeo, mat.strand2);
        s2.position.copy(b);
        dnaGroup.add(s2);

        // Degrau alternando A-T (laranja) e G-C (verde)
        dnaGroup.add(cylinder(a, b, 0.05, i % 2 === 0 ? mat.rungA : mat.rungB));
      }
    }

    buildGeometry(config.basePairs);

    return {
      tick(dt) {
        dnaGroup.rotation.y += currentSpeed * dt * Math.PI * 2;
      },
      update(cfg) {
        currentSpeed = cfg.rotationSpeed;
        buildGeometry(cfg.basePairs);
      },
      dispose() {
        root.remove(dnaGroup);
        sphereGeo.dispose();
        disposables.forEach((g) => g.dispose());
        Object.values(mat).forEach((m) => m.dispose());
      },
    };
  },
};

// ── Hospedeiro "página" (mesma assinatura de antes da migração) ──

export interface DnaScene {
  update(config: DnaSceneConfig): void;
  dispose(): void;
}

export function createDnaScene(
  canvas: HTMLCanvasElement,
  config: DnaSceneConfig,
  bgColor = 0x0a0a1a,
): DnaScene {
  return hostInPage(canvas, dnaHelix, config, {
    background: bgColor,
    camera: { position: [0, 0, 14], fov: 45, far: 200 },
    // Luzes padrão do hostInPage (ambiente 0,5 + direcional 1,2 em (5, 10, 8))
    // são exatamente as que esta cena usava.
  });
}
