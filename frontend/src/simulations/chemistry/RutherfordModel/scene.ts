// Experimento de Rutherford (folha de ouro) — experimento MONTÁVEL.
// Protótipo para a ala "Museu dos Modelos Atômicos" do Museu Virtual.
//
// Uma fonte dispara partículas alfa em +X contra uma folha de ouro (em x = 0).
// Ao cruzar a folha, cada partícula sorteia o destino (physics.ts). Uma tela
// circular em volta registra onde elas chegam, e o painel conta quantas
// passaram, desviaram e voltaram (exercício 5 da lista).

import * as THREE from 'three';
import type { MountableExperiment, MountedExperiment } from '../../../core/mountable';
import { createTextPanel } from '../../../core/textPanel';
import { DEFAULT_ODDS, scatter, type AlphaFate } from './physics';

export interface RutherfordConfig {
  rate: number;  // partículas por segundo
  speed: number; // m/s
}

const MAX_PARTICLES = 400;
const SOURCE_X = -2.6;
const SCREEN_RADIUS = 2.2;

interface Particle {
  pos: THREE.Vector3;
  vel: THREE.Vector3;
  crossed: boolean;
  alive: boolean;
}

export const rutherfordModel: MountableExperiment<RutherfordConfig, MountedExperiment<RutherfordConfig>> = {
  mount({ root }, config) {
    let cfg = config;

    // Fonte (caixa de chumbo) e folha de ouro
    const sourceGeo = new THREE.BoxGeometry(0.5, 0.5, 0.5);
    const sourceMat = new THREE.MeshStandardMaterial({ color: 0x555566, roughness: 0.7 });
    const source = new THREE.Mesh(sourceGeo, sourceMat);
    source.position.x = SOURCE_X - 0.25;
    const foilGeo = new THREE.BoxGeometry(0.01, 1, 1);
    const foilMat = new THREE.MeshStandardMaterial({ color: 0xd4af37, metalness: 0.9, roughness: 0.25, transparent: true, opacity: 0.85 });
    const foil = new THREE.Mesh(foilGeo, foilMat);

    // Tela detectora: cilindro aberto em volta da folha (sem a parte da fonte)
    const screenGeo = new THREE.CylinderGeometry(SCREEN_RADIUS, SCREEN_RADIUS, 1.4, 64, 1, true, Math.PI * 0.08, Math.PI * 1.84);
    const screenMat = new THREE.MeshStandardMaterial({ color: 0x2ecc71, transparent: true, opacity: 0.12, side: THREE.DoubleSide, depthWrite: false });
    const screen = new THREE.Mesh(screenGeo, screenMat);
    screen.rotation.y = Math.PI; // abertura voltada para a fonte (−X)
    root.add(source, foil, screen);

    // Partículas: uma InstancedMesh só
    const pGeo = new THREE.SphereGeometry(0.035, 8, 6);
    const pMat = new THREE.MeshBasicMaterial({ color: 0xff5e3a });
    const particlesMesh = new THREE.InstancedMesh(pGeo, pMat, MAX_PARTICLES);
    particlesMesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    root.add(particlesMesh);
    const particles: Particle[] = Array.from({ length: MAX_PARTICLES }, () => ({
      pos: new THREE.Vector3(), vel: new THREE.Vector3(), crossed: false, alive: false,
    }));

    // Marcas na tela: pontos que ficam onde as partículas chegaram
    const HITS = 600;
    const hitPos = new Float32Array(HITS * 3);
    const hitGeo = new THREE.BufferGeometry();
    hitGeo.setAttribute('position', new THREE.BufferAttribute(hitPos, 3));
    const hitMat = new THREE.PointsMaterial({ color: 0xb6ff9e, size: 0.05 });
    const hits = new THREE.Points(hitGeo, hitMat);
    root.add(hits);
    let hitCount = 0;

    const panel = createTextPanel(2.2, 0.8);
    panel.mesh.position.set(3.1, 0.5, 1.2); // ao lado da tela, virado para o visitante
    panel.mesh.rotation.y = -0.7;
    root.add(panel.mesh);

    const counts: Record<AlphaFate, number> = { straight: 0, deflected: 0, back: 0 };
    let fired = 0;
    let spawnDebt = 0;
    const m = new THREE.Matrix4();
    const hidden = new THREE.Matrix4().makeScale(0, 0, 0);

    function resetCounts() {
      counts.straight = counts.deflected = counts.back = 0;
      fired = 0;
      hitCount = 0;
      hitGeo.setDrawRange(0, 0);
      particles.forEach((p) => { p.alive = false; });
    }
    resetCounts();

    function pct(n: number) {
      const done = counts.straight + counts.deflected + counts.back;
      return done ? `${((100 * n) / done).toFixed(1).replace('.', ',')}%` : '—';
    }

    function updatePanel() {
      panel.setLines([
        `Rutherford (1911) · partículas disparadas: ${fired}`,
        `Passaram quase reto: ${counts.straight} (${pct(counts.straight)})`,
        `Desviaram: ${counts.deflected} (${pct(counts.deflected)}) · Voltaram: ${counts.back} (${pct(counts.back)})`,
        'Proporções exageradas para dar para ver',
      ]);
    }

    let panelTimer = 0;
    return {
      tick(dt) {
        // dispara novas partículas
        spawnDebt += cfg.rate * dt;
        while (spawnDebt >= 1) {
          spawnDebt -= 1;
          const p = particles.find((q) => !q.alive);
          if (!p) break;
          p.alive = true;
          p.crossed = false;
          p.pos.set(SOURCE_X, (Math.random() - 0.5) * 0.12, (Math.random() - 0.5) * 0.12);
          p.vel.set(cfg.speed, 0, 0);
          fired++;
        }

        particles.forEach((p, i) => {
          if (p.alive) {
            const wasBefore = p.pos.x < 0;
            p.pos.addScaledVector(p.vel, dt);
            if (!p.crossed && wasBefore && p.pos.x >= 0) {
              p.crossed = true;
              const { fate, dir } = scatter(DEFAULT_ODDS);
              counts[fate]++;
              p.pos.x = 0;
              p.vel.set(dir[0], dir[1], dir[2]).multiplyScalar(cfg.speed);
            }
            // chegou na tela (ou saiu do alcance): marca e some
            const horizontal = Math.hypot(p.pos.x, p.pos.z);
            if (p.crossed && (horizontal >= SCREEN_RADIUS || Math.abs(p.pos.y) > 0.7)) {
              if (horizontal >= SCREEN_RADIUS && hitCount < HITS) {
                hitPos.set([p.pos.x, p.pos.y, p.pos.z], hitCount * 3);
                hitCount++;
                hitGeo.attributes.position.needsUpdate = true;
                hitGeo.setDrawRange(0, hitCount);
              }
              p.alive = false;
            }
          }
          if (p.alive) {
            m.makeTranslation(p.pos.x, p.pos.y, p.pos.z);
            particlesMesh.setMatrixAt(i, m);
          } else {
            particlesMesh.setMatrixAt(i, hidden);
          }
        });
        particlesMesh.instanceMatrix.needsUpdate = true;

        panelTimer += dt;
        if (panelTimer > 0.25) {
          panelTimer = 0;
          updatePanel();
        }
      },
      update(next) {
        cfg = next;
        resetCounts();
        updatePanel();
      },
      dispose() {
        root.remove(source, foil, screen, particlesMesh, hits, panel.mesh);
        [sourceGeo, foilGeo, screenGeo, pGeo, hitGeo].forEach((g) => g.dispose());
        [sourceMat, foilMat, screenMat, pMat, hitMat].forEach((mt) => mt.dispose());
        particlesMesh.dispose();
        panel.dispose();
      },
    };
  },
};
