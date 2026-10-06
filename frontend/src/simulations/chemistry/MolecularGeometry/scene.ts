// Cena da geometria molecular VSEPR — experimento MONTÁVEL (ver
// core/mountable.ts e ARQUITETURA.md, seção 22).
//
// Estrutura de cada molécula (dentro de `root`):
//   - Átomo central: SphereGeometry na origem, cor CPK
//   - Ligantes:      SphereGeometry em cada posição de computeLigandPositions()
//   - Ligações:      CylinderGeometry do centro ao centro de cada ligante
//                    orientado por quaternion (eixo Y padrão → direção do ligante)
//
// Toda a geometria fica num único `moleculeGroup`. Ao trocar de molécula,
// o grupo é limpo (geometrias e materiais descartados) e reconstruído.
// Os materiais de átomos são criados por instância e descartados no rebuild.
// O material de ligações é compartilhado (mesma cor cinza para todas).
//
// A molécula é estática: `tick` não faz nada (quem gira é a câmera na página,
// ou o pedestal na sala do Museu Virtual).

import * as THREE from 'three';
import { hostInPage } from '../../../core/hostInPage';
import type { MountableExperiment } from '../../../core/mountable';
import { computeLigandPositions, type MoleculeDefinition } from './physics';

export interface MolSceneConfig {
  molecule: MoleculeDefinition;
}

export const molecularGeometry: MountableExperiment<MolSceneConfig> = {
  mount({ root }, config) {
    // Material compartilhado das ligações
    const bondMat = new THREE.MeshPhongMaterial({ color: 0x888888, shininess: 40 });

    const moleculeGroup = new THREE.Group();
    root.add(moleculeGroup);

    // Materiais de átomos criados por rebuild (descartados na limpeza)
    let atomMaterials: THREE.MeshPhongMaterial[] = [];

    function clearMolecule() {
      while (moleculeGroup.children.length) {
        const child = moleculeGroup.children[0] as THREE.Mesh;
        child.geometry.dispose();
        moleculeGroup.remove(child);
      }
      atomMaterials.forEach((m) => m.dispose());
      atomMaterials = [];
    }

    function makeAtom(pos: THREE.Vector3, radius: number, color: number): THREE.Mesh {
      const mat = new THREE.MeshPhongMaterial({ color, shininess: 80 });
      atomMaterials.push(mat);
      const mesh = new THREE.Mesh(new THREE.SphereGeometry(radius, 24, 18), mat);
      mesh.position.copy(pos);
      return mesh;
    }

    function makeBond(to: THREE.Vector3): THREE.Mesh {
      const len = to.length();
      const geo = new THREE.CylinderGeometry(0.07, 0.07, len, 8, 1);
      const mesh = new THREE.Mesh(geo, bondMat);
      mesh.position.copy(to).multiplyScalar(0.5); // midpoint
      mesh.quaternion.setFromUnitVectors(
        new THREE.Vector3(0, 1, 0),
        to.clone().normalize(),
      );
      return mesh;
    }

    function buildMolecule(mol: MoleculeDefinition) {
      clearMolecule();

      // Átomo central
      moleculeGroup.add(makeAtom(new THREE.Vector3(0, 0, 0), mol.centerAtom.radius, mol.centerAtom.color));

      // Ligantes e ligações
      const positions = computeLigandPositions(mol.geometry, mol.bondAngleDeg, mol.bondLength);
      positions.forEach((p) => {
        const ligandPos = new THREE.Vector3(p.x, p.y, p.z);
        moleculeGroup.add(makeBond(ligandPos));
        moleculeGroup.add(makeAtom(ligandPos, mol.ligandAtom.radius, mol.ligandAtom.color));
      });
    }

    buildMolecule(config.molecule);

    return {
      update(cfg) { buildMolecule(cfg.molecule); },
      tick() { /* estática */ },
      dispose() {
        clearMolecule();
        root.remove(moleculeGroup);
        bondMat.dispose();
      },
    };
  },
};

// ── Hospedeiro "página" (mesma assinatura de antes da migração) ──

export interface MolScene {
  update(config: MolSceneConfig): void;
  dispose(): void;
}

export function createMolScene(
  canvas: HTMLCanvasElement,
  config: MolSceneConfig,
  bgColor = 0x0a0a1a,
): MolScene {
  return hostInPage(canvas, molecularGeometry, config, {
    background: bgColor,
    camera: { position: [0, 1.5, 7], fov: 50, far: 100 },
    orbit: { minDistance: 2, maxDistance: 20 },
    lights(scene) {
      scene.add(new THREE.AmbientLight(0xffffff, 0.4));
      const dir1 = new THREE.DirectionalLight(0xffffff, 1.2);
      dir1.position.set(4, 6, 5);
      scene.add(dir1);
      const dir2 = new THREE.DirectionalLight(0x8899bb, 0.4); // preenchimento azulado
      dir2.position.set(-4, -3, -4);
      scene.add(dir2);
    },
  });
}
