// Lançamento de projéteis — sala do "Museu da Mecânica" (protótipo do TCC).
//
// Visto de lado, como no livro: o canhão fica à esquerda e a bola voa em +X.
// A bola é lançada sozinha, pousa, fica 2 s marcada e é lançada de novo.
// Depois do pouso aparecem as marcas do alcance (R) e da altura máxima (H) e o
// painel mostra os valores medidos (exercícios 7 a 9 da lista).
//
// Unidades: as contas são em metros "reais" e a cena é desenhada em escala
// (`SCALE` metros de sala por metro real), senão 40 m não cabem na sala.

import * as THREE from 'three';
import type { MountableExperiment, MountedExperiment } from '../../../core/mountable';
import { createTextPanel, type TextPanel } from '../../../core/textPanel';

export interface ProjectileConfig {
  v0: number;    // m/s
  angle: number; // graus
  g: number;     // m/s²
}

const SCALE = 0.45;
const RULER_MAX = 40; // m reais
const WAIT_AFTER_LANDING = 2.5; // s

const fmt = (x: number, d = 1) => x.toFixed(d).replace('.', ',');

function info({ v0, angle, g }: ProjectileConfig) {
  const a = (angle * Math.PI) / 180;
  const vx = v0 * Math.cos(a);
  const vy = v0 * Math.sin(a);
  const time = (2 * vy) / g;
  return { vx, vy, time, range: vx * time, height: (vy * vy) / (2 * g) };
}

export const projectileRoom: MountableExperiment<ProjectileConfig, MountedExperiment<ProjectileConfig>> = {
  mount({ root }, config) {
    let cfg = config;
    let k = info(cfg);

    // Chão de referência: régua com marcas a cada 5 m
    const rulerMat = new THREE.MeshBasicMaterial({ color: 0xdddddd });
    const rulerGeo = new THREE.BoxGeometry(RULER_MAX * SCALE, 0.01, 0.05);
    const ruler = new THREE.Mesh(rulerGeo, rulerMat);
    ruler.position.set((RULER_MAX * SCALE) / 2, 0.005, 0.4);
    root.add(ruler);
    const tickGeo = new THREE.BoxGeometry(0.03, 0.01, 0.25);
    const labels: TextPanel[] = [];
    for (let m = 0; m <= RULER_MAX; m += 5) {
      const tick = new THREE.Mesh(tickGeo, rulerMat);
      tick.position.set(m * SCALE, 0.006, 0.4);
      root.add(tick);
      const label = createTextPanel(0.6, 0.25, 256);
      label.setLines([`${m} m`]);
      label.mesh.position.set(m * SCALE, 0.15, 0.7);
      label.mesh.rotation.x = -0.6;
      root.add(label.mesh);
      labels.push(label);
    }

    // Canhão (gira em Z pelo ângulo)
    const cannonGroup = new THREE.Group();
    root.add(cannonGroup);
    const baseGeo = new THREE.CylinderGeometry(0.25, 0.3, 0.2, 24);
    const darkMat = new THREE.MeshStandardMaterial({ color: 0x3a3a55, roughness: 0.6 });
    const base = new THREE.Mesh(baseGeo, darkMat);
    base.position.y = 0.1;
    root.add(base);
    const barrelGeo = new THREE.CylinderGeometry(0.08, 0.1, 0.7, 16);
    const barrel = new THREE.Mesh(barrelGeo, darkMat);
    barrel.rotation.z = -Math.PI / 2; // deitado em +X
    barrel.position.x = 0.3;
    cannonGroup.add(barrel);
    cannonGroup.position.y = 0.2;

    // Bola, curva prevista (tracejada) e rastro
    const ballGeo = new THREE.SphereGeometry(0.12, 20, 14);
    const ballMat = new THREE.MeshStandardMaterial({ color: 0xe67e22, roughness: 0.4 });
    const ball = new THREE.Mesh(ballGeo, ballMat);
    root.add(ball);

    const previewMat = new THREE.LineDashedMaterial({ color: 0x8888aa, dashSize: 0.15, gapSize: 0.1 });
    let preview: THREE.Line | null = null;
    const trailMat = new THREE.LineBasicMaterial({ color: 0xf5c16c });
    const trailPos = new Float32Array(600 * 3);
    const trailGeo = new THREE.BufferGeometry();
    trailGeo.setAttribute('position', new THREE.BufferAttribute(trailPos, 3));
    const trail = new THREE.Line(trailGeo, trailMat);
    root.add(trail);
    let trailCount = 0;

    // Marcas de R e H (aparecem depois do pouso)
    const markMat = new THREE.MeshBasicMaterial({ color: 0x2ecc71 });
    const rMarkGeo = new THREE.CylinderGeometry(0.04, 0.04, 0.6, 8);
    const rMark = new THREE.Mesh(rMarkGeo, markMat);
    const hLineGeo = new THREE.BufferGeometry();
    const hLine = new THREE.Line(hLineGeo, new THREE.LineDashedMaterial({ color: 0x2ecc71, dashSize: 0.1, gapSize: 0.08 }));
    root.add(rMark, hLine);

    const panel = createTextPanel(4.5, 1.3);
    panel.mesh.position.set(9.5, 4.9, -3.4); // no alto, no meio da parede do fundo
    root.add(panel.mesh);

    let t = 0;
    let landedFor = -1; // < 0 = em voo

    const pos = (time: number) => new THREE.Vector3(k.vx * time * SCALE, 0.2 + (k.vy * time - 0.5 * cfg.g * time * time) * SCALE, 0);

    function build() {
      k = info(cfg);
      cannonGroup.rotation.z = (cfg.angle * Math.PI) / 180;
      if (preview) { root.remove(preview); preview.geometry.dispose(); }
      const pts = Array.from({ length: 101 }, (_, i) => pos((k.time * i) / 100));
      preview = new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), previewMat);
      preview.computeLineDistances();
      root.add(preview);
      relaunch();
    }

    function relaunch() {
      t = 0;
      landedFor = -1;
      trailCount = 0;
      trailGeo.setDrawRange(0, 0);
      rMark.visible = false;
      hLine.visible = false;
      setPanel(false);
    }

    function setPanel(landed: boolean) {
      panel.setLines([
        `v₀ = ${fmt(cfg.v0)} m/s · ângulo = ${cfg.angle}° · g = ${fmt(cfg.g)} m/s²`,
        landed ? `Alcance medido: ${fmt(k.range)} m` : 'Alcance: em voo…',
        landed ? `Altura máxima: ${fmt(k.height)} m · Tempo de voo: ${fmt(k.time, 2)} s` : `Tempo: ${fmt(t, 2)} s`,
      ]);
    }

    build();

    return {
      tick(dt) {
        if (landedFor >= 0) {
          landedFor += dt;
          if (landedFor > WAIT_AFTER_LANDING) relaunch();
          return;
        }
        t = Math.min(t + dt, k.time);
        ball.position.copy(pos(t));
        if (trailCount < 600) {
          trailPos.set([ball.position.x, ball.position.y, ball.position.z], trailCount * 3);
          trailCount++;
          trailGeo.attributes.position.needsUpdate = true;
          trailGeo.setDrawRange(0, trailCount);
        }
        if (t >= k.time) {
          landedFor = 0;
          rMark.position.set(k.range * SCALE, 0.3, 0);
          rMark.visible = true;
          const top = pos(k.time / 2);
          hLineGeo.setFromPoints([new THREE.Vector3(top.x, 0, 0), top]);
          hLine.computeLineDistances();
          hLine.visible = true;
          setPanel(true);
        } else {
          setPanel(false);
        }
      },
      update(next) {
        cfg = next;
        build();
      },
      dispose() {
        root.clear();
        [rulerGeo, tickGeo, baseGeo, barrelGeo, ballGeo, trailGeo, rMarkGeo, hLineGeo].forEach((g) => g.dispose());
        preview?.geometry.dispose();
        [rulerMat, darkMat, ballMat, previewMat, trailMat, markMat, hLine.material as THREE.Material].forEach((m) => m.dispose());
        labels.forEach((l) => l.dispose());
        panel.dispose();
      },
    };
  },
};
