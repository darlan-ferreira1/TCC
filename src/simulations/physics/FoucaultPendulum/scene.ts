// Pêndulo de Foucault — experimento MONTÁVEL (ver core/mountable.ts).
// Protótipo para a ala "Museu da Mecânica" do Museu Virtual.
//
// A oscilação anda em tempo real; o giro do plano anda acelerado
// (`timeScale` vezes), senão levaria horas para aparecer. A massa deixa um
// rastro no chão, como a areia do pêndulo original, e o painel mostra o tempo
// simulado e quanto o plano já girou.
//
// Origem = ponto de suspensão. O chão fica em y = −floorDrop.

import * as THREE from 'three';
import type { MountableExperiment, MountedExperiment } from '../../../core/mountable';
import { createTextPanel } from '../../../core/textPanel';
import { planeRate, turnHours } from './physics';

export interface FoucaultConfig {
  L: number;           // m
  g: number;           // m/s²
  amplitude: number;   // rad
  latitude: number;    // graus (+ norte, − sul)
  place: string;       // nome do lugar, para o painel
  timeScale: number;   // quantas vezes o giro do plano é acelerado
  floorDrop: number;   // m, do ponto de suspensão até o chão
}

const TRAIL_POINTS = 4000;
const TRAIL_EVERY = 1 / 30; // s entre amostras do rastro

const fmt = (x: number, d = 1) => x.toFixed(d).replace('.', ',');

export const foucaultPendulum: MountableExperiment<FoucaultConfig, MountedExperiment<FoucaultConfig>> = {
  mount({ root }, config) {
    let cfg = config;

    const plane = new THREE.Group(); // gira em Y: plano de oscilação
    const swing = new THREE.Group(); // gira em Z: ângulo da oscilação
    plane.add(swing);
    root.add(plane);

    const wireMat = new THREE.MeshPhongMaterial({ color: 0xaaaaaa });
    const bobGeo = new THREE.SphereGeometry(0.3, 24, 16);
    const bobMat = new THREE.MeshStandardMaterial({ color: 0xc9a227, metalness: 0.8, roughness: 0.3 });
    const bob = new THREE.Mesh(bobGeo, bobMat);
    swing.add(bob);
    let wire: THREE.Mesh | null = null;

    // Chão: disco com a linha norte–sul e o anel de pinos
    const floorGroup = new THREE.Group();
    root.add(floorGroup);
    const discMat = new THREE.MeshStandardMaterial({ color: 0x3b3b5c, roughness: 0.9 });
    const lineMat = new THREE.MeshBasicMaterial({ color: 0xe74c3c });
    const pinMat = new THREE.MeshStandardMaterial({ color: 0xdddddd });
    const floorGeos: THREE.BufferGeometry[] = [];

    // Rastro na "areia"
    const trailPos = new Float32Array(TRAIL_POINTS * 3);
    const trailGeo = new THREE.BufferGeometry();
    trailGeo.setAttribute('position', new THREE.BufferAttribute(trailPos, 3));
    const trailMat = new THREE.LineBasicMaterial({ color: 0xf5d76e });
    const trail = new THREE.Line(trailGeo, trailMat);
    root.add(trail);
    let trailCount = 0;
    let sinceSample = 0;

    const panel = createTextPanel(2.2, 0.8);
    root.add(panel.mesh);

    let phase = 0; // fase da oscilação (rad)
    let simSeconds = 0; // tempo simulado para o giro do plano

    function buildFloor() {
      floorGeos.forEach((g) => g.dispose());
      floorGeos.length = 0;
      floorGroup.clear();
      floorGroup.position.y = -cfg.floorDrop;
      const reach = cfg.L * Math.sin(cfg.amplitude) + 0.4;
      const discGeo = new THREE.CylinderGeometry(reach + 0.3, reach + 0.3, 0.04, 64);
      const lineGeo = new THREE.BoxGeometry(0.03, 0.01, 2 * (reach + 0.3));
      const pinGeo = new THREE.CylinderGeometry(0.03, 0.03, 0.25, 8);
      floorGeos.push(discGeo, lineGeo, pinGeo);
      const disc = new THREE.Mesh(discGeo, discMat);
      disc.position.y = 0.02;
      const line = new THREE.Mesh(lineGeo, lineMat); // linha norte–sul (eixo Z)
      line.position.y = 0.045;
      floorGroup.add(disc, line);
      for (let i = 0; i < 36; i++) {
        const a = (i / 36) * Math.PI * 2;
        const pin = new THREE.Mesh(pinGeo, pinMat);
        pin.position.set(reach * Math.cos(a), 0.165, reach * Math.sin(a));
        floorGroup.add(pin);
      }
      panel.mesh.position.set(0, -cfg.floorDrop + 2.4, -(reach + 1.2));
    }

    function build() {
      if (wire) { swing.remove(wire); wire.geometry.dispose(); }
      wire = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, cfg.L, 6), wireMat);
      wire.position.y = -cfg.L / 2;
      swing.add(wire);
      bob.position.y = -cfg.L;
      buildFloor();
      phase = 0;
      simSeconds = 0;
      plane.rotation.y = 0;
      trailCount = 0;
      trailGeo.setDrawRange(0, 0);
    }
    build();

    function updatePanel() {
      const turned = ((Math.abs(planeRate(cfg.latitude)) * simSeconds) * 180) / Math.PI;
      const hours = turnHours(cfg.latitude);
      const sense = cfg.latitude > 0 ? 'horário' : cfg.latitude < 0 ? 'anti-horário' : 'não gira';
      panel.setLines([
        `Pêndulo de Foucault · ${cfg.place}`,
        `Tempo simulado: ${fmt(simSeconds / 3600)} h`,
        `O plano já girou ${fmt(turned % 360, 0)}° (${sense})`,
        `Tempo acelerado ${Math.round(cfg.timeScale)}× · ${Number.isFinite(hours) ? 'confira: em quantas horas dá uma volta?' : 'no equador o plano fica parado'}`,
      ]);
    }
    updatePanel();

    return {
      tick(dt) {
        phase += Math.sqrt(cfg.g / cfg.L) * dt;
        simSeconds += dt * cfg.timeScale;
        swing.rotation.z = cfg.amplitude * Math.cos(phase);
        plane.rotation.y = planeRate(cfg.latitude) * simSeconds;

        sinceSample += dt;
        if (sinceSample >= TRAIL_EVERY) {
          sinceSample = 0;
          // posição da massa projetada no chão
          const a = swing.rotation.z;
          const d = cfg.L * Math.sin(a);
          const psi = plane.rotation.y;
          if (trailCount === TRAIL_POINTS) {
            trailPos.copyWithin(0, 3); // descarta o ponto mais antigo
            trailCount--;
          }
          const i = trailCount * 3;
          trailPos[i] = d * Math.cos(psi);
          trailPos[i + 1] = -cfg.floorDrop + 0.05;
          trailPos[i + 2] = -d * Math.sin(psi);
          trailCount++;
          trailGeo.attributes.position.needsUpdate = true;
          trailGeo.setDrawRange(0, trailCount);
          updatePanel();
        }
      },
      update(next) {
        cfg = next;
        build();
        updatePanel();
      },
      dispose() {
        root.remove(plane, floorGroup, trail, panel.mesh);
        wire?.geometry.dispose();
        floorGeos.forEach((g) => g.dispose());
        [bobGeo, trailGeo].forEach((g) => g.dispose());
        [wireMat, bobMat, discMat, lineMat, pinMat, trailMat].forEach((m) => m.dispose());
        panel.dispose();
      },
    };
  },
};
