// Contrato de experimento "montável" (ver ARQUITETURA.md, seção 22).
//
// Um experimento montável NÃO cria renderer, câmera, luzes globais, laço de
// animação nem interface. Ele só:
//   - monta seus objetos 3D dentro de um grupo (`root`) que recebe;
//   - avança no tempo quando o hospedeiro chama `tick(dt)`;
//   - reage a novos parâmetros em `update(config)`;
//   - libera o que criou em `dispose()`.
//
// Quem fornece o resto é o HOSPEDEIRO:
//   - hostInPage (core/hostInPage.ts) → a página do experimento (canvas próprio,
//     OrbitControls, sliders HTML do index.tsx);
//   - a sala do museu (museum/levels.ts) → o mundo 3D do Museu Virtual.
//
// Os métodos são declarados com sintaxe de método (e não como propriedades com
// tipo função) de propósito: assim um MountableExperiment<ConfigDoPendulo> pode
// ser guardado numa lista genérica MountableExperiment<unknown>.

import type * as THREE from 'three';

export interface MountContext {
  // Grupo onde o experimento coloca seus objetos. O hospedeiro decide onde o
  // grupo fica e em que escala; o experimento trabalha nas próprias unidades.
  root: THREE.Group;
}

export interface MountedExperiment<Config> {
  update(config: Config): void;
  tick(dt: number): void; // dt em segundos, já limitado pelo hospedeiro
  dispose(): void;        // libera só o que o experimento montou
}

export interface MountableExperiment<Config, Mounted extends MountedExperiment<Config> = MountedExperiment<Config>> {
  mount(ctx: MountContext, config: Config): Mounted;
}
