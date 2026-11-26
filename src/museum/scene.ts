// Cena Three.js do Museu Virtual — museu em primeira pessoa.
//
// O mundo tem "fases" (levels.ts): o salão principal e as salas interativas.
// Toda a planta de cada fase vem de layout.ts; aqui ficam o jogador, a entrada,
// a troca de fase e o laço.
//
// Controles (desktop):
//   - Clique na tela → PointerLockControls trava o mouse (o mouse gira a visão).
//   - WASD / setas → anda; Shift → corre.
//   - E (ou clique) → interage com o objeto na mira (ex.: segurar a massa do
//     pêndulo) ou, se não houver, entra na porta próxima.
//   - Esc → o navegador destrava o mouse (comportamento padrão do Pointer Lock).
//   - Tab (dentro de uma sala) → tratado no index.tsx: abre o HUD de ajustes.
//
// Controles (celular): TouchControls.tsx chama setTouchMove (joystick) e
// touchLook (arrastar); os botões do index.tsx chamam enterNearest e
// interactPress/interactRelease. Teclado e joystick viram o mesmo vetor
// (frente, lado) no loop — a cena não se importa com a origem da entrada.
//
// Controles (controle de videogame, core/gamepad.ts): analógico esquerdo anda,
// direito olha, A = E, RT ou clicar o analógico esquerdo = correr, Start = HUD
// de ajustes (dentro de uma sala), Select = pausa. O controle é mais uma fonte
// do mesmo vetor de movimento e do mesmo giro de câmera do toque. Com o HUD
// aberto, D-pad ou analógico esquerdo navegam (onGamepadHud) e B ou Start
// fecham. Com o controle desligado (setGamepadMode('off')), A ou Start só
// pedem para começar (onGamepadAction('resume')).
//
// Portas:
//   - porta com sala interativa (sala.ts) → transição (tela escurece) e troca de
//     fase dentro da MESMA cena e do MESMO renderer;
//   - porta sem sala → onEnter(id): o React abre a página do experimento;
//   - porta de ala temática (config.wings, ver alas.ts) → um salão menor com as
//     salas de um tema. Pilha de fases: salão → ala → sala; cada porta de
//     saída volta um nível.
//
// O loop usa renderer.setAnimationLoop (e não requestAnimationFrame) para que a
// mesma cena possa ganhar uma sessão WebXR nas próximas etapas sem mudar o loop.

import * as THREE from 'three';
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import type { InfoContent, RoomContent } from './info';
import type { ControlDef, ControlValue, ControlValues } from '../core/controls';
import { defaultValues } from '../core/controls';
import { createDirectionRepeat, createGamepadReader, frameDirection, type GamepadDirection } from '../core/gamepad';
import type { InteractiveRoom, RoomInteraction } from './interactiveRoom';
import { buildHall, buildRoom, buildWing, type Centerpiece, type Level } from './levels';
import {
  spawnPoint, constrainPosition, nearestDoor,
  EXIT_DOOR_ID, EXERCISE_DOOR_ID, NEXT_EXERCISE_DOOR_ID, PREV_EXERCISE_DOOR_ID, EYE_HEIGHT,
  type DoorEntry, type DoorPlacement,
} from './layout';

export interface MuseumSceneConfig {
  entries: DoorEntry[];
  rooms: Record<string, InteractiveRoom>; // id do experimento → sala interativa
  wings?: Record<string, WingDef>;        // id da porta do salão → ala temática
  content?: Record<string, RoomContent>;  // id da porta → textos ("i", quadros)
  miniatures?: Record<string, Centerpiece>; // id da porta → miniatura no pedestal da ala
  // Mapeia id do experimento → lista de { id, title } das salas de exercício, em ordem.
  exerciseMap?: Record<string, Array<{ id: string; title: string }>>;
  spawnDoorId?: string;            // porta na frente da qual o jogador aparece
  background: number;
}

// Ala temática (museu dentro do museu): uma porta do salão principal leva a um
// salão menor com as portas das salas de um tema. As salas da ala usam o mesmo
// `rooms` acima; portas sem sala abrem a página do experimento, como no salão.
export interface WingDef {
  entries: DoorEntry[];
  centerpiece?: Centerpiece;
  noExit?: boolean;
}

export interface WingInfo {
  id: string;
  title: string;
}

export interface RoomInfo {
  id: string;
  title: string;
  controls: ControlDef[];
  values: ControlValues;
}

export type GamepadMode = 'off' | 'play' | 'hud';

export interface MuseumScene {
  // Precisa ser chamado dentro de um evento de clique (exigência do Pointer Lock).
  lock(): void;
  unlock(): void;
  // Entrada por toque (celular): vetor do joystick em [-1, 1] (x = lado,
  // y = frente) e arrasto para olhar (em pixels).
  setTouchMove(x: number, y: number): void;
  touchLook(dx: number, dy: number): void;
  // Botões de toque: entrar na porta próxima / segurar e soltar o objeto na mira.
  enterNearest(): void;
  interactPress(): void;
  // Modo "inspecionar" (só numa sala): câmera orbital em volta do experimento.
  setInspect(on: boolean): void;
  interactRelease(): void;
  // HUD de ajustes da sala atual (camada A da sala interativa).
  setControl(id: string, value: ControlValue): void;
  // Controle de videogame: 'play' move a cena, 'hud' navega nos ajustes e
  // 'off' só espera A ou Start para disparar onGamepadAction('resume').
  setGamepadMode(mode: GamepadMode): void;

  onLockChange: ((locked: boolean) => void) | null;
  // P apertado: pausa de verdade (o React mostra o menu de instruções).
  // Um destravamento sem onPause antes (ex.: Esc do navegador) não abre o menu.
  onPause: (() => void) | null;
  // resume = começar/voltar a jogar; menu = abrir o HUD (só numa sala);
  // pause = pausar (Select ou controle desconectado).
  onGamepadAction: ((action: 'resume' | 'menu' | 'pause') => void) | null;
  onGamepadHud: ((direction: GamepadDirection) => void) | null; // navegar no HUD
  onNearDoorChange: ((door: DoorPlacement | null) => void) | null;
  onEnter: ((doorId: string) => void) | null;          // abrir a PÁGINA do experimento
  onRoomChange: ((room: RoomInfo | null) => void) | null; // entrou/saiu de uma sala
  onWingChange: ((wing: WingInfo | null) => void) | null; // entrou/saiu de uma ala
  onInteractionChange: ((prompt: string | null, hold: boolean) => void) | null;
  onInfo: ((content: InfoContent) => void) | null;       // abrir o pop-up de texto
  onInspectChange: ((inspecting: boolean) => void) | null;
  // Navega para a próxima sala de exercício (ou fecha a sala se for a última).
  goToNextExercise(): void;
  // Libera (false) ou trava (true) a porta "Próxima questão".
  setNextExerciseLocked(locked: boolean): void;
  // Volta para a fase anterior (sala → ala → salão), igual ao ESC.
  goBack(): void;
  // Abre uma ala sem transição (usado para começar diretamente na ala da Mecânica).
  openWingById(id: string): void;
  dispose(): void;
}

const WALK_SPEED = 4;   // m/s
const RUN_SPEED  = 7;
const FADE_TIME  = 0.35; // s para escurecer (e o mesmo para clarear)

const KEY_FORWARD = ['KeyW', 'ArrowUp'];
const KEY_BACK    = ['KeyS', 'ArrowDown'];
const KEY_LEFT    = ['KeyA', 'ArrowLeft'];
const KEY_RIGHT   = ['KeyD', 'ArrowRight'];
const KEY_RUN     = ['ShiftLeft', 'ShiftRight'];

const PAD_LOOK_SPEED = 2.5; // rad/s com o analógico direito no máximo

export function createMuseumScene(container: HTMLDivElement, config: MuseumSceneConfig): MuseumScene {
  // ── Renderer ──
  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.domElement.style.display = 'block';
  // Visual (ver devRelatorios.md): tone mapping "de cinema" (ACES) deixa as
  // cores e o contraste mais naturais; as sombras suaves fazem os objetos
  // "pousarem" no chão em vez de flutuarem.
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  container.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(config.background);
  scene.fog = new THREE.Fog(config.background, 30, 70);

  // Mapa de ambiente gerado por código (RoomEnvironment, sem arquivo externo):
  // é o "reflexo" que os materiais PBR (MeshStandardMaterial) usam. Sem ele,
  // metal e verniz ficam chapados.
  const pmrem = new THREE.PMREMGenerator(renderer);
  const roomEnv = new RoomEnvironment();
  const envMap = pmrem.fromScene(roomEnv, 0.04).texture;
  scene.environment = envMap;
  scene.environmentIntensity = 0.45;

  const camera = new THREE.PerspectiveCamera(70, container.clientWidth / container.clientHeight, 0.05, 100);
  scene.add(camera); // necessário para o véu de transição (filho da câmera) ser desenhado

  const controls = new PointerLockControls(camera, renderer.domElement);

  // ── Luzes (valem para o salão e para todas as salas) ──
  // Luz quente, como numa galeria: céu creme e reflexo do chão de madeira.
  scene.add(new THREE.HemisphereLight(0xfff3e0, 0x8a6f52, 1.1));
  const sun = new THREE.DirectionalLight(0xfff1dd, 1.6);
  sun.position.set(4, 12, 6);
  sun.castShadow = true;
  sun.shadow.mapSize.set(2048, 2048);
  sun.shadow.camera.left = -16;
  sun.shadow.camera.right = 16;
  sun.shadow.camera.top = 16;
  sun.shadow.camera.bottom = -16;
  sun.shadow.camera.near = 1;
  sun.shadow.camera.far = 40;
  sun.shadow.bias = -0.0005;
  sun.shadow.normalBias = 0.02;
  scene.add(sun);

  // ── Véu de transição: plano preto colado na frente da câmera ──
  const veilGeo = new THREE.PlaneGeometry(4, 4);
  const veilMat = new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0, depthTest: false, depthWrite: false });
  const veil = new THREE.Mesh(veilGeo, veilMat);
  veil.position.z = -0.2;
  veil.renderOrder = 999;
  veil.visible = false;
  camera.add(veil);

  // ── Fases ──
  const hall = buildHall(config.entries);
  scene.add(hall.group);
  let level: Level = hall;
  let room: { level: Level; door: DoorPlacement; def: InteractiveRoom; values: ControlValues } | null = null;
  let wing: { level: Level; door: DoorPlacement } | null = null;

  // Mapa reverso: id da sala de exercício → { experimentId, index }.
  const exerciseRoomInfo: Record<string, { experimentId: string; index: number }> = {};
  for (const [expId, entries] of Object.entries(config.exerciseMap ?? {})) {
    entries.forEach((e, i) => { exerciseRoomInfo[e.id] = { experimentId: expId, index: i }; });
  }

  function placePlayer(doorId?: string) {
    const spawn = spawnPoint(level.layout, doorId);
    camera.position.set(spawn.x, EYE_HEIGHT, spawn.z);
    camera.lookAt(spawn.lookX, EYE_HEIGHT, spawn.lookZ);
  }
  placePlayer(config.spawnDoorId);

  // ── Estado de entrada ──
  const pressed = new Set<string>();
  const anyPressed = (codes: string[]) => codes.some((c) => pressed.has(c));
  const touchMove = { x: 0, y: 0 };
  let currentDoor: DoorPlacement | null = null;
  let hovered: RoomInteraction | null = null;
  let nextExerciseLocked = false;
  let active: RoomInteraction | null = null; // interação sendo segurada
  let shownPrompt: string | null = null;
  let fade: { phase: 'out' | 'in'; t: number; action?: () => void } | null = null;

  const raycaster = new THREE.Raycaster();
  const screenCenter = new THREE.Vector2(0, 0);
  function aimRay(): THREE.Ray {
    raycaster.setFromCamera(screenCenter, camera);
    return raycaster.ray;
  }

  // Olhar por toque: mesma convenção do PointerLockControls (Euler 'YXZ':
  // primeiro gira em Y = olhar para os lados, depois em X = olhar para cima/baixo).
  const look = new THREE.Euler(0, 0, 0, 'YXZ');
  const TOUCH_LOOK_SPEED = 0.005; // rad por pixel arrastado
  const MAX_PITCH = Math.PI / 2 - 0.05;

  // Gira a visão: yaw > 0 vira para a esquerda, pitch > 0 olha para cima.
  // Usado pelo toque e pelo analógico direito.
  function rotateLook(yaw: number, pitch: number) {
    look.setFromQuaternion(camera.quaternion);
    look.y += yaw;
    look.x = Math.min(Math.max(look.x + pitch, -MAX_PITCH), MAX_PITCH);
    camera.quaternion.setFromEuler(look);
  }

  const gamepad = createGamepadReader();
  const hudRepeat = createDirectionRepeat();
  let gamepadMode: GamepadMode = 'off';
  let gamepadWasConnected = false;

  const api: MuseumScene = {
    lock() { controls.lock(); },
    unlock() { controls.unlock(); },
    setTouchMove(x, y) {
      touchMove.x = x;
      touchMove.y = y;
    },
    touchLook(dx, dy) {
      rotateLook(-dx * TOUCH_LOOK_SPEED, -dy * TOUCH_LOOK_SPEED);
    },
    setGamepadMode(mode) {
      gamepadMode = mode;
      if (mode !== 'play') interactRelease();
    },
    enterNearest() {
      if (currentDoor) goThroughDoor(currentDoor);
    },
    interactPress,
    interactRelease,
    setControl(id, value) {
      if (!room) return;
      room.values = { ...room.values, [id]: value };
      room.level.setControls(room.values);
    },
    onLockChange: null,
    onPause: null,
    onGamepadAction: null,
    onGamepadHud: null,
    onNearDoorChange: null,
    onEnter: null,
    onRoomChange: null,
    onWingChange: null,
    onInteractionChange: null,
    onInfo: null,
    onInspectChange: null,
    goToNextExercise() { if (!fade && room) navigateNextExercise(); },
    setNextExerciseLocked(locked) { nextExerciseLocked = locked; },
    goBack,
    openWingById(id) {
      const entry = config.entries.find((e) => e.id === id);
      if (!entry || !config.wings?.[id]) return;
      const fake: DoorPlacement = { ...entry, wall: 'far', x: 0, z: 0, rotationY: 0, normal: { x: 0, z: 1 } };
      openWing(fake);
    },
    setInspect,
    dispose,
  };

  // ── Portas e troca de fase ──

  function setCurrentDoor(door: DoorPlacement | null) {
    if (door === currentDoor) return;
    const oldMat = currentDoor && level.doorMaterials.get(currentDoor.id);
    if (oldMat) oldMat.emissiveIntensity = 0;
    const newMat = door && level.doorMaterials.get(door.id);
    if (newMat) newMat.emissiveIntensity = 0.45;
    currentDoor = door;
    api.onNearDoorChange?.(door);
  }

  function transition(action: () => void) {
    if (fade) return;
    interactRelease();
    fade = { phase: 'out', t: 0, action };
    veil.visible = true;
  }

  function navigateNextExercise() {
    const info = room ? exerciseRoomInfo[room.door.id] : null;
    if (!info) { transition(closeRoom); return; }
    const exEntries = config.exerciseMap?.[info.experimentId] ?? [];
    const nextEntry = exEntries[info.index + 1];
    if (nextEntry) {
      transition(() => openRoom({
        id: nextEntry.id, title: nextEntry.title, category: 'Exercício', color: 0x27ae60,
        wall: 'right', x: 0, z: 0, rotationY: -Math.PI / 2, normal: { x: -1, z: 0 },
      }));
    } else {
      transition(closeRoom);
    }
  }

  function navigatePrevExercise() {
    const info = room ? exerciseRoomInfo[room.door.id] : null;
    if (!info) { transition(closeRoom); return; }
    const exEntries = config.exerciseMap?.[info.experimentId] ?? [];
    const prevEntry = exEntries[info.index - 1];
    if (prevEntry) {
      transition(() => openRoom({
        id: prevEntry.id, title: prevEntry.title, category: 'Exercício', color: 0x27ae60,
        wall: 'right', x: 0, z: 0, rotationY: -Math.PI / 2, normal: { x: -1, z: 0 },
      }));
    } else {
      transition(closeRoom);
    }
  }

  function goThroughDoor(door: DoorPlacement) {
    if (fade) return;
    if (room && door.id === EXERCISE_DOOR_ID) {
      const exEntries = config.exerciseMap?.[room.door.id] ?? [];
      if (exEntries.length) {
        const first = exEntries[0];
        transition(() => openRoom({
          id: first.id, title: first.title, category: 'Exercício', color: 0x27ae60,
          wall: 'right', x: 0, z: 0, rotationY: -Math.PI / 2, normal: { x: -1, z: 0 },
        }));
      }
    } else if (room && door.id === NEXT_EXERCISE_DOOR_ID) {
      if (!nextExerciseLocked) navigateNextExercise();
    } else if (room && door.id === PREV_EXERCISE_DOOR_ID) {
      navigatePrevExercise();
    } else if (room && door.id === EXIT_DOOR_ID) {
      transition(closeRoom);
    } else if (!room && wing && door.id === EXIT_DOOR_ID) {
      transition(closeWing);
    } else if (!room && !wing && config.wings?.[door.id]) {
      transition(() => openWing(door));
    } else if (!room && config.rooms[door.id]) {
      transition(() => openRoom(door));
    } else if (!room) {
      // Sem sala interativa: abre a página do experimento.
      pressed.clear();
      touchMove.x = touchMove.y = 0;
      controls.unlock();
      api.onEnter?.(door.id);
    }
  }

  function switchLevel(next: Level) {
    setCurrentDoor(null);
    hovered = null;
    level.group.visible = false;
    level = next;
    level.group.visible = true;
  }

  function openRoom(door: DoorPlacement) {
    const def = config.rooms[door.id];
    if (!def) return;
    // Troca de sala sem passar pela ala (ex.: questão → próxima questão).
    if (room) {
      setInspect(false);
      const old = room;
      room = null;
      scene.remove(old.level.group);
      old.level.dispose();
    }
    const defaults = defaultValues(def.controls);
    const values = def.preControls ? { ...defaults, ...def.preControls } : defaults;
    const exitTitle = wing ? `Voltar ao ${wing.door.title}` : undefined;
    const roomLevel = buildRoom(def, door.title, door.color, values, exitTitle, config.content?.[door.id], openInfo);
    scene.add(roomLevel.group);
    room = { level: roomLevel, door, def, values };
    // Salas de exercício sempre começam travadas: o estudante precisa responder para avançar.
    nextExerciseLocked = exerciseRoomInfo[door.id] !== undefined;
    switchLevel(roomLevel);
    placePlayer();
    api.onRoomChange?.({ id: door.id, title: door.title, controls: def.controls, values });
  }

  function closeRoom() {
    if (!room) return;
    setInspect(false);
    const { level: roomLevel, door } = room;
    room = null;
    switchLevel(wing?.level ?? hall);
    scene.remove(roomLevel.group);
    roomLevel.dispose();
    placePlayer(door.id); // reaparece na frente da porta da sala
    api.onRoomChange?.(null);
  }

  function openWing(door: DoorPlacement) {
    const def = config.wings![door.id];
    const wingLevel = buildWing(def.entries, door.title, door.color, def.centerpiece, {
      miniatures: config.miniatures, content: config.content, openInfo, noExit: def.noExit,
    });
    scene.add(wingLevel.group);
    wing = { level: wingLevel, door };
    switchLevel(wingLevel);
    placePlayer();
    api.onWingChange?.({ id: door.id, title: door.title });
  }

  function closeWing() {
    if (!wing) return;
    const { level: wingLevel, door } = wing;
    wing = null;
    switchLevel(hall);
    scene.remove(wingLevel.group);
    wingLevel.dispose();
    placePlayer(door.id);
    api.onWingChange?.(null);
  }

  // ── Modo "inspecionar" ──
  // Como o visualizador orbital do ECOS, mas sem trocar de página: a mesma
  // câmera ganha um OrbitControls em volta do experimento, e o resto da sala
  // (paredes, portas, quadros) some até o estudante sair do modo.
  let inspecting: { orbit: OrbitControls; pos: THREE.Vector3; quat: THREE.Quaternion; hidden: THREE.Object3D[] } | null = null;

  function setInspect(on: boolean) {
    if (on && !inspecting && room?.level.inspect && !fade) {
      const { root: expRoot, target, distance } = room.level.inspect;
      interactRelease();
      pressed.clear();
      touchMove.x = touchMove.y = 0;
      controls.unlock();
      const hidden = room.level.group.children.filter((c) => c !== expRoot && c.visible);
      hidden.forEach((c) => { c.visible = false; });
      const pos = camera.position.clone();
      const quat = camera.quaternion.clone();
      camera.position.set(target.x, target.y + distance * 0.25, target.z + distance);
      const orbit = new OrbitControls(camera, renderer.domElement);
      orbit.target.copy(target);
      orbit.enableDamping = true;
      orbit.minDistance = distance * 0.3;
      orbit.maxDistance = distance * 2.5;
      orbit.update();
      inspecting = { orbit, pos, quat, hidden };
      api.onInspectChange?.(true);
    } else if (!on && inspecting) {
      inspecting.orbit.dispose();
      inspecting.hidden.forEach((c) => { c.visible = true; });
      camera.position.copy(inspecting.pos);
      camera.quaternion.copy(inspecting.quat);
      inspecting = null;
      api.onInspectChange?.(false);
    }
  }

  // ── Interações diretas (camada B) ──

  function openInfo(content: InfoContent) {
    pressed.clear();
    touchMove.x = touchMove.y = 0;
    api.onInfo?.(content);
  }

  function interactPress() {
    if (fade || active || !hovered) return;
    if (hovered.hold === false) { // só apertar (ex.: ler um "i")
      hovered.press(aimRay());
      return;
    }
    active = hovered;
    active.press(aimRay());
  }

  function interactRelease() {
    if (!active) return;
    active.release();
    active = null;
  }

  // Ação principal (E ou clique): interação na mira tem prioridade sobre a porta.
  function primaryDown() {
    if (hovered) interactPress();
    else if (currentDoor) goThroughDoor(currentDoor);
  }

  function goBack() {
    if (fade) return;
    if (room) transition(closeRoom);
    else if (wing) transition(closeWing);
  }

  function onKeyDown(e: KeyboardEvent) {
    pressed.add(e.code);
    if (e.code === 'KeyE' && !e.repeat && controls.isLocked) primaryDown();
    if (e.code === 'KeyI' && !e.repeat && controls.isLocked && room) setInspect(true);
    // Esc não muda de sala: sem teleporte, o estudante volta andando pelas
    // portas. Esc só fecha pop-ups e o HUD de ajustes (tratado no index.tsx).
    // P pausa (solta o mouse e mostra a tela de instruções).
    if (e.code === 'KeyP' && !e.repeat && controls.isLocked && !inspecting) {
      api.onPause?.();
      controls.unlock();
    }
  }
  function onKeyUp(e: KeyboardEvent) {
    pressed.delete(e.code);
    if (e.code === 'KeyE') interactRelease();
  }
  function onMouseDown() { if (controls.isLocked) primaryDown(); }
  function onMouseUp() { interactRelease(); }
  function onLock()   { api.onLockChange?.(true); }
  function onUnlock() {
    pressed.clear();
    interactRelease();
    api.onLockChange?.(false);
  }

  document.addEventListener('keydown', onKeyDown);
  document.addEventListener('keyup', onKeyUp);
  renderer.domElement.addEventListener('mousedown', onMouseDown);
  document.addEventListener('mouseup', onMouseUp);
  controls.addEventListener('lock', onLock);
  controls.addEventListener('unlock', onUnlock);

  // ── Resize ──
  const ro = new ResizeObserver(() => {
    renderer.setSize(container.clientWidth, container.clientHeight);
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
  });
  ro.observe(container);

  // ── Loop ──
  let last = 0;
  renderer.setAnimationLoop((t: number) => {
    const dt = last ? Math.min((t - last) / 1000, 0.05) : 0;
    last = t;

    // Transição entre fases: escurece → troca → clareia.
    if (fade) {
      fade.t += dt;
      const k = Math.min(fade.t / FADE_TIME, 1);
      veilMat.opacity = fade.phase === 'out' ? k : 1 - k;
      if (k >= 1) {
        if (fade.phase === 'out') {
          fade.action?.();
          fade = { phase: 'in', t: 0 };
        } else {
          fade = null;
          veil.visible = false;
        }
      }
    }

    if (inspecting) {
      // Controle: B sai da inspeção; enquanto isso a câmera gira sozinha.
      const padNow = gamepad.poll();
      inspecting.orbit.autoRotate = padNow.connected && gamepadMode !== 'off';
      if (padNow.justPressed('b') || padNow.justPressed('y')) setInspect(false);
      inspecting?.orbit.update(dt);
      level.tick(dt);
      renderer.render(scene, camera);
      return;
    }

    // Três fontes de entrada para o mesmo movimento: teclado (com o mouse
    // travado), joystick de toque e controle de videogame. Todas viram um
    // vetor (frente, lado).
    let forward: number;
    let strafe: number;
    let speed = WALK_SPEED;
    if (controls.isLocked) {
      forward = (anyPressed(KEY_FORWARD) ? 1 : 0) - (anyPressed(KEY_BACK) ? 1 : 0);
      strafe  = (anyPressed(KEY_RIGHT) ? 1 : 0) - (anyPressed(KEY_LEFT) ? 1 : 0);
      if (anyPressed(KEY_RUN)) speed = RUN_SPEED;
    } else {
      forward = touchMove.y;
      strafe  = touchMove.x;
    }

    const pad = gamepad.poll();
    if (gamepadWasConnected && !pad.connected && gamepadMode !== 'off') api.onGamepadAction?.('pause');
    gamepadWasConnected = pad.connected;
    const hudDirection = hudRepeat(gamepadMode === 'hud' ? frameDirection(pad) : null, dt);
    if (hudDirection) api.onGamepadHud?.(hudDirection);
    if (gamepadMode === 'hud') {
      if (pad.justPressed('b') || pad.justPressed('start')) api.onGamepadAction?.('resume');
    } else if (pad.connected && gamepadMode === 'play') {
      forward += pad.move.y;
      strafe  += pad.move.x;
      if (pad.pressed('rt') || pad.pressed('leftStick')) speed = RUN_SPEED;
      if ((pad.look.x || pad.look.y) && !fade) {
        rotateLook(-pad.look.x * PAD_LOOK_SPEED * dt, pad.look.y * PAD_LOOK_SPEED * dt);
      }
      if (pad.justPressed('a')) primaryDown();
      if (pad.justReleased('a')) interactRelease();
      if (pad.justPressed('start') && room) api.onGamepadAction?.('menu');
      if (pad.justPressed('select')) api.onGamepadAction?.('pause');
      if (pad.justPressed('y') && room) setInspect(true);
    } else if (pad.justPressed('a') || pad.justPressed('start')) {
      api.onGamepadAction?.('resume');
    }
    if ((forward || strafe) && !fade) {
      // Limita o vetor a comprimento 1: andar na diagonal não fica mais rápido,
      // e o joystick continua analógico (empurrar pouco = andar devagar).
      const len = Math.max(1, Math.hypot(forward, strafe));
      const step = speed * dt / len;
      controls.moveForward(forward * step);
      controls.moveRight(strafe * step);
      const p = constrainPosition({ x: camera.position.x, z: camera.position.z }, level.layout);
      camera.position.x = p.x;
      camera.position.z = p.z;
    }

    level.tick(dt);

    // Interações: segurando → arrasta; senão, descobre o que está na mira.
    if (!fade) {
      const ray = aimRay();
      if (active) active.drag(ray);
      else hovered = level.interactions.find((i) => i.isTarget(ray)) ?? null;
    }
    const current = active ?? hovered;
    const prompt = current?.prompt ?? null;
    if (prompt !== shownPrompt) {
      shownPrompt = prompt;
      api.onInteractionChange?.(prompt, current?.hold !== false);
    }

    setCurrentDoor(fade ? null : nearestDoor({ x: camera.position.x, z: camera.position.z }, level.layout));

    renderer.render(scene, camera);
  });

  function dispose() {
    renderer.setAnimationLoop(null);
    inspecting?.orbit.dispose();
    ro.disconnect();
    gamepad.dispose();
    document.removeEventListener('keydown', onKeyDown);
    document.removeEventListener('keyup', onKeyUp);
    renderer.domElement.removeEventListener('mousedown', onMouseDown);
    document.removeEventListener('mouseup', onMouseUp);
    controls.removeEventListener('lock', onLock);
    controls.removeEventListener('unlock', onUnlock);
    controls.unlock();
    controls.dispose();
    if (room) room.level.dispose();
    if (wing) wing.level.dispose();
    hall.dispose();
    veilGeo.dispose();
    veilMat.dispose();
    envMap.dispose();
    roomEnv.dispose();
    pmrem.dispose();
    if (import.meta.env.DEV) delete (window as unknown as Record<string, unknown>).__expoDebug;
    renderer.dispose();
    renderer.domElement.remove();
  }

  // Só no `npm run dev` (some no build): atalho para testes automáticos e
  // prints, ex. no console: __expoDebug.enter('simple-pendulum').
  if (import.meta.env.DEV) {
    (window as unknown as Record<string, unknown>).__expoDebug = {
      camera,
      doors: () => level.layout.doors.map((d) => d.id),
      enter(id: string) {
        const d = level.layout.doors.find((x) => x.id === id);
        if (d) goThroughDoor(d);
      },
    };
  }

  return api;
}
