import { useEffect, useRef, useState } from 'react';
import { createMuseumScene, type MuseumScene, type RoomInfo, type WingInfo } from './scene';
import { WINGS, WING_DOORS, WING_ROOMS, WINGS_CATEGORY } from './alas';
import { CONTEUDO } from './conteudo';
import { MINIATURAS } from './miniaturas';
import { EXIT_DOOR_ID, EXERCISE_DOOR_ID, NEXT_EXERCISE_DOOR_ID, PREV_EXERCISE_DOOR_ID, type DoorEntry, type DoorPlacement } from './layout';
import ExerciseHud from './ExerciseHud';
import { EXERCICIOS_INTERATIVOS, type ExercicioInterativo } from './exerciciosInterativos';
import { buildAllExerciseRooms, buildExerciseMap } from './exerciseRooms';
import type { InteractiveRoom } from './interactiveRoom';
import { stepControl, type ControlValue } from '../core/controls';
import type { GamepadDirection } from '../core/gamepad';
import { HALL_DOORS } from './portas';
import TouchControls from './TouchControls';
import ControlsHud from '../components/ControlsHud/ControlsHud';

// Salas interativas: cada pasta de experimento com um `sala.ts` é carregada
// aqui. As portas do salão vêm de portas.ts (lista fixa); antes, no CLARA.js,
// vinham do registro de experimentos da Galeria.
const SALAS = import.meta.glob<InteractiveRoom>('../simulations/**/sala.ts', { eager: true, import: 'sala' });

const ROOMS: Record<string, InteractiveRoom> = {};
for (const d of HALL_DOORS) {
  const sala = SALAS[`../simulations/${d.folder}/sala.ts`];
  if (sala) ROOMS[d.id] = sala;
}

const DOOR_ENTRIES: DoorEntry[] = HALL_DOORS
  .filter((d) => d.id in ROOMS)
  .map(({ id, title, category, color }) => ({ id, title, category, color }));

// Alas temáticas (protótipo, ver alas.ts): as portas delas ficam numa parede
// própria do salão, e as salas novas entram na mesma tabela de salas.
const HALL_ENTRIES: DoorEntry[] = [...DOOR_ENTRIES, ...WING_DOORS];
const ALL_ROOMS: Record<string, InteractiveRoom> = { ...ROOMS, ...WING_ROOMS };

// Salas de exercício: geradas a partir de EXERCICIOS_INTERATIVOS + salas base.
const EXERCISE_ROOMS = buildAllExerciseRooms(ALL_ROOMS);
const EXERCISE_MAP   = buildExerciseMap(ALL_ROOMS);
const ALL_ROOMS_FINAL: Record<string, InteractiveRoom> = { ...ALL_ROOMS, ...EXERCISE_ROOMS };

// Busca qual exercício corresponde a um ID de sala de exercício.
function getExerciseForRoom(roomId: string): {
  ex: ExercicioInterativo; expId: string; index: number; total: number;
} | null {
  for (const [expId, exercises] of Object.entries(EXERCICIOS_INTERATIVOS)) {
    const idx = exercises.findIndex((e) => e.id === roomId);
    if (idx !== -1) return { ex: exercises[idx], expId, index: idx, total: exercises.length };
  }
  return null;
}

// Guarda por qual porta o estudante saiu, para ele reaparecer na frente dela ao
// voltar do experimento (o componente é desmontado durante o experimento,
// então isso fica fora do estado do React).
let lastDoorId: string | undefined;

// Dispositivo principal de toque (celular/tablet) → joystick em vez de WASD.
const IS_TOUCH = typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches;

const KEYBOARD_HELP = [
  ['W A S D', 'andar'],
  ['Mouse', 'olhar ao redor'],
  ['Shift', 'correr'],
  ['E', 'entrar na porta / segurar objeto / ler o "i"'],
  ['Tab', 'ajustes (dentro de uma sala)'],
  ['I', 'inspecionar o experimento (dentro de uma sala)'],
  ['Espaço', 'fechar textos, ajustes e a inspeção'],
  ['P', 'pausar'],
];

const TOUCH_HELP = [
  ['Joystick', 'andar (canto inferior esquerdo)'],
  ['Arrastar', 'olhar ao redor'],
  ['Tocar no aviso', 'entrar na porta / segurar objeto'],
  ['⚙', 'ajustes (dentro de uma sala)'],
  ['🔍', 'inspecionar o experimento'],
  ['❚❚', 'pausar'],
];

const GAMEPAD_HELP = 'Controle: analógico esquerdo anda, direito olha, A entra, segura ou lê o i, Start abre os ajustes, Y inspeciona, Select pausa. Aperte A para começar.';
const GAMEPAD_HUD_HINT = 'Controle: ↑ ↓ escolhe, ← → ajusta, B fecha.';

const kbdStyle = {
  border: '1px solid #666', borderRadius: 4, padding: '1px 7px',
  fontFamily: "'JetBrains Mono', monospace", fontSize: 13,
} as const;

const roundButton = {
  width: 40, height: 40, borderRadius: 8, border: '1px solid rgba(255,255,255,0.3)',
  background: 'rgba(10,10,26,0.6)', color: '#e0e0f0', fontSize: 16, cursor: 'pointer',
} as const;

// Botões ◀ ✕ ▶ do painel flutuante no celular (maiores, para o polegar).
const panelButton = { ...roundButton, width: 52, height: 52, borderRadius: 12, fontSize: 20, touchAction: 'manipulation' } as const;

function doorPrompt(door: DoorPlacement, nextLocked = false): string {
  if (door.id === EXIT_DOOR_ID) return door.title;
  if (door.id === EXERCISE_DOOR_ID) return 'Entrar no espaço de exercícios';
  if (door.id === NEXT_EXERCISE_DOOR_ID) return nextLocked ? 'Responda para avançar' : 'Próxima questão';
  if (door.id === PREV_EXERCISE_DOOR_ID) return 'Questão anterior';
  if (door.category === WINGS_CATEGORY) return `Entrar na ${door.title}`;
  if (!(door.id in ALL_ROOMS_FINAL)) return `Abrir o experimento ${door.title}`;
  return `Entrar na sala ${door.title}`;
}

interface Props {
  theme: 'dark' | 'light';
  // Opcionais: no CLARA.js abriam páginas de experimento e voltavam à tela
  // inicial. Na exposição, todas as portas levam a salas e não há tela anterior.
  onEnter?: (experimentId: string) => void;
  onBack?: () => void;
}

export default function VirtualMuseum({ theme, onEnter, onBack }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef     = useRef<MuseumScene | null>(null);
  const [locked, setLocked]     = useState(false);
  // Menu de instruções: aparece no início e quando o estudante pausa (P,
  // Select, ❚❚). Se o mouse for solto por outro motivo (Esc do navegador),
  // aparece só um aviso pequeno de "clique para continuar".
  const [menuOpen, setMenuOpen] = useState(true);
  // No celular não existe Pointer Lock: "jogando" = o estudante tocou em Começar.
  // Ao voltar de um experimento, já recomeça direto (sem a tela de instruções).
  const [touchPlaying, setTouchPlaying] = useState(IS_TOUCH && lastDoorId !== undefined);
  // Com controle de videogame: "jogando" = o estudante apertou A ou Start.
  const [padPlaying, setPadPlaying] = useState(false);
  const [nearDoor, setNearDoor] = useState<DoorPlacement | null>(null);
  const [interaction, setInteraction] = useState<string | null>(null);
  const [interactionHold, setInteractionHold] = useState(true);
  const [interactionFromPanel, setInteractionFromPanel] = useState(false); // a mira está no painel flutuante?
  const [panelState, setPanelState] = useState<{ page: number; total: number } | null>(null); // painel aberto (página)
  const [exerciseState, setExerciseState] = useState<{
    roomId: string;   // id da sala de exercício (ex.: 'pendulo-q1')
    expId: string;    // id do experimento base (ex.: 'simple-pendulum')
    exIndex: number;  // índice 0-based em EXERCICIOS_INTERATIVOS[expId]
    total: number;    // total de questões do experimento
    started: boolean; // o estudante já apertou o "i" verde de iniciar?
    completed: boolean;
    tentadas: number[];  // alternativas já escolhidas e erradas (tipo "alternativas")
    tentativas: number;  // quantas escolhas o estudante fez (anônimo, para a pesquisa)
  } | null>(null);
  const [erroToast, setErroToast] = useState<string | null>(null);
  const [successToast, setSuccessToast] = useState<string | null>(null);
  const exerciseStateRef = useRef<typeof exerciseState>(null);
  const roomValuesRef = useRef<Record<string, import('../core/controls').ControlValue>>({});
  const correctSinceRef = useRef<number | null>(null);
  const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [inspecting, setInspecting] = useState(false);
  const [room, setRoom] = useState<RoomInfo | null>(null);
  const [wing, setWing] = useState<WingInfo | null>(null);
  const wingRef = useRef<WingInfo | null>(null);
  const [hudOpen, setHudOpen] = useState(false);
  const [padFocus, setPadFocus] = useState(0); // linha do HUD selecionada pelo controle
  const padHudInput = useRef<((direction: GamepadDirection) => void) | null>(null);
  const chooseAltRef = useRef<((i: number) => void) | null>(null); // quadro 3D → escolher alternativa
  const playing = locked || touchPlaying || padPlaying || exerciseState !== null;

  function pauseTouch() {
    setMenuOpen(true);
    sceneRef.current?.setTouchMove(0, 0);
    setTouchPlaying(false);
  }

  const currentExercise: ExercicioInterativo | null = exerciseState
    ? (EXERCICIOS_INTERATIVOS[exerciseState.expId] ?? [])[exerciseState.exIndex] ?? null
    : null;
  // Questão ainda não iniciada: controles e verificação ficam parados.
  const exerciseWaiting = exerciseState !== null && !exerciseState.started;
  const lockedControlsSet = room?.id && ALL_ROOMS_FINAL[room.id]?.lockedControls
    ? new Set(ALL_ROOMS_FINAL[room.id]!.lockedControls!)
    : undefined;

  function changeControl(id: string, value: ControlValue) {
    if (exerciseWaiting || lockedControlsSet?.has(id)) return;
    setRoom((r) => (r ? { ...r, values: { ...r.values, [id]: value } } : r));
    sceneRef.current?.setControl(id, value);
  }

  // Fecha o HUD. No desktop, volta a travar o mouse (precisa ser dentro do clique).
  function closeHud() {
    setHudOpen(false);
    if (!IS_TOUCH) sceneRef.current?.lock();
  }

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const s = createMuseumScene(container, {
      entries: HALL_ENTRIES,
      rooms: ALL_ROOMS_FINAL,
      wings: WINGS,
      content: CONTEUDO,
      miniatures: MINIATURAS,
      exerciseMap: EXERCISE_MAP,
      spawnDoorId: lastDoorId,
      background: theme === 'dark' ? 0x0a0a1a : 0xcfd6e6,
    });
    s.onLockChange = (l) => { setLocked(l); if (l) setMenuOpen(false); };
    s.onPause = () => setMenuOpen(true);
    s.onGamepadAction = (action) => {
      if (action === 'resume') {
        setHudOpen(false);
        setPadPlaying(true);
      } else if (action === 'menu') {
        const ex = exerciseStateRef.current;
        if (ex && !ex.started) return; // questão não iniciada: sem painel de ajustes
        setPadFocus(0);
        setHudOpen(true);
        s.unlock(); // no desktop, solta o mouse para usar o HUD
      } else {
        setMenuOpen(true);
        setPadPlaying(false);
        setTouchPlaying(false);
        s.setTouchMove(0, 0);
        s.unlock();
      }
    };
    s.onGamepadHud = (direction) => padHudInput.current?.(direction);
    s.onNearDoorChange = setNearDoor;
    s.onInteractionChange = (prompt, hold, fromPanel) => {
      setInteraction(prompt);
      setInteractionHold(hold);
      setInteractionFromPanel(fromPanel);
    };
    s.onPanelChange = setPanelState;
    s.onInspectChange = setInspecting;
    s.onExerciseStart = () => setExerciseState((p) => (p ? { ...p, started: true } : p));
    // Alternativa escolhida no quadro 3D (mirar + E): mesma função das teclas 1–4.
    s.onAlternative = (i) => chooseAltRef.current?.(i);
    s.onRoomChange = (r) => {
      setRoom(r);
      setHudOpen(false);
      if (r) {
        lastDoorId = wingRef.current?.id ?? r.id;
        const exInfo = getExerciseForRoom(r.id);
        if (exInfo) {
          // A questão começa parada: o estudante anda até o quadro "Iniciar questão".
          setExerciseState({ roomId: r.id, expId: exInfo.expId, exIndex: exInfo.index, total: exInfo.total, started: false, completed: false, tentadas: [], tentativas: 0 });
          setErroToast(null);
        } else {
          setExerciseState(null);
        }
      } else {
        setExerciseState(null);
      }
    };
    s.onWingChange = (w) => {
      wingRef.current = w;
      setWing(w);
      if (w) lastDoorId = w.id;
    };
    s.onEnter = (id) => {
      lastDoorId = wingRef.current?.id ?? id;
      onEnter?.(id);
    };
    sceneRef.current = s;
    // Começa diretamente dentro da Ala da Mecânica (sem passar pelo salão vazio).
    s.openWingById('ala-mecanica');
    return () => { s.dispose(); sceneRef.current = null; };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [theme]);

  // Mantém refs em sincronia com o estado
  useEffect(() => { exerciseStateRef.current = exerciseState; }, [exerciseState]);
  useEffect(() => { roomValuesRef.current = room?.values ?? {}; }, [room?.values]);

  // Detecção de acerto: intervalo de 200ms que checa isCorrect do exercício atual.
  useEffect(() => {
    if (!exerciseState) return;
    correctSinceRef.current = null;
    const ex = (EXERCICIOS_INTERATIVOS[exerciseState.expId] ?? [])[exerciseState.exIndex];
    if (!ex || ex.tipo === 'alternativas') return; // alternativas: o acerto vem da escolha
    const id = setInterval(() => {
      const state = exerciseStateRef.current;
      if (!state || !state.started || state.completed) return;
      const holdMs = ex.minHoldMs ?? 1200;
      if (ex.isCorrect(roomValuesRef.current)) {
        if (!correctSinceRef.current) correctSinceRef.current = Date.now();
        else if (Date.now() - correctSinceRef.current >= holdMs) {
          correctSinceRef.current = null;
          setExerciseState(prev => prev ? { ...prev, completed: true } : prev);
          if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
          setSuccessToast(ex.feedbackCorreto);
          toastTimerRef.current = setTimeout(() => setSuccessToast(null), 3500);
        }
      } else {
        correctSinceRef.current = null;
      }
    }, 200);
    return () => { clearInterval(id); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [exerciseState?.expId, exerciseState?.exIndex]);

  // Libera a porta "Próxima questão" assim que o estudante completa o exercício.
  useEffect(() => {
    sceneRef.current?.setNextExerciseLocked(!exerciseState?.completed);
  }, [exerciseState?.completed]);

  // Limpa timer do toast ao desmontar
  useEffect(() => () => { if (toastTimerRef.current) clearTimeout(toastTimerRef.current); }, []);

  // Com o HUD aberto, o controle navega nele; fora dele, só move a cena
  // enquanto se está jogando com o controle.
  useEffect(() => {
    sceneRef.current?.setGamepadMode(room && hudOpen ? 'hud' : padPlaying ? 'play' : 'off');
  }, [room, padPlaying, hudOpen, theme]);

  // ↑ ↓ escolhe o parâmetro; ← → altera o valor dele.
  useEffect(() => {
    padHudInput.current = (direction) => {
      const count = room?.controls.length ?? 0;
      if (!room || count === 0) return;
      setPadPlaying(true);
      if (direction === 'up' || direction === 'down') {
        setPadFocus((i) => (i + (direction === 'down' ? 1 : -1) + count) % count);
      } else {
        const control = room.controls[Math.min(padFocus, count - 1)];
        changeControl(control.id, stepControl(control, room.values[control.id], direction === 'right' ? 1 : -1));
      }
    };
  });

  // Desktop: Tab abre o HUD de ajustes dentro de uma sala (solta o mouse);
  // Espaço com o HUD aberto fecha o HUD e volta a travar o mouse.
  // Esc não faz nada no app (o navegador ainda solta o mouse: não dá para impedir).
  useEffect(() => {
    if (IS_TOUCH) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.code === 'Tab' && room && locked) {
        e.preventDefault();
        if (exerciseWaiting) return; // questão não iniciada: sem painel de ajustes
        setHudOpen(true);
        sceneRef.current?.unlock();
      } else if (e.code === 'Space' && hudOpen) {
        e.preventDefault(); // senão o Espaço "clica" no controle focado do HUD
        closeHud();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [room, locked, hudOpen, exerciseWaiting]);


  // ── Questões de alternativas ──
  const alternativas = currentExercise?.tipo === 'alternativas' ? currentExercise.alternativas : null;
  const alternativasAtivas = !!alternativas && !!exerciseState?.started && !exerciseState.completed;

  function showToast(setter: (t: string | null) => void, text: string, ms: number) {
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    setSuccessToast(null);
    setErroToast(null);
    setter(text);
    toastTimerRef.current = setTimeout(() => setter(null), ms);
  }

  // Aplica a alternativa na cena (ignora os controles travados: quem muda é
  // a alternativa, não o estudante) e verifica se está certa.
  function chooseAlternative(i: number) {
    const st = exerciseStateRef.current;
    if (!alternativas || !st || !st.started || st.completed) return;
    const alt = alternativas[i];
    if (!alt || st.tentadas.includes(i)) return;
    setRoom((r) => (r ? { ...r, values: { ...r.values, ...alt.valores } } : r));
    for (const [id, v] of Object.entries(alt.valores)) sceneRef.current?.setControl(id, v);
    setExerciseState((p) => (p ? {
      ...p,
      tentativas: p.tentativas + 1,
      completed: !!alt.correta,
      tentadas: alt.correta ? p.tentadas : [...p.tentadas, i],
    } : p));
    if (alt.correta) {
      showToast(setSuccessToast, currentExercise!.feedbackCorreto, 4000);
    } else {
      showToast(setErroToast, `${alt.feedbackErro ?? 'Não é essa.'}\nVeja o resultado na cena e tente outra alternativa.`, 4500);
    }
  }

  // O quadro 3D chama a versão mais recente de chooseAlternative.
  useEffect(() => { chooseAltRef.current = chooseAlternative; });

  // Devolve ao quadro 3D o estado da questão (erradas, acertou, qual é a certa).
  useEffect(() => {
    if (!exerciseState) return;
    const certa = alternativas ? alternativas.findIndex((a) => a.correta) : undefined;
    sceneRef.current?.setAlternativesState(exerciseState.tentadas, exerciseState.completed, certa);
  }, [exerciseState, alternativas]);

  // Teclado: 1 a 4 escolhem (funciona andando, com o mouse travado).
  useEffect(() => {
    if (!alternativasAtivas) return;
    const onKey = (e: KeyboardEvent) => {
      const n = Number(e.key);
      if (Number.isInteger(n) && n >= 1 && n <= (alternativas?.length ?? 0)) chooseAlternative(n - 1);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  });

  function exitInspect() {
    sceneRef.current?.setInspect(false);
    if (!IS_TOUCH && !padPlaying) sceneRef.current?.lock();
  }

  // No modo inspecionar, Espaço volta para a sala. (O painel flutuante de
  // leitura é fechado com Espaço pela própria cena, em scene.ts.)
  useEffect(() => {
    if (!inspecting) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault();
        exitInspect();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  });

  const showHud = room && hudOpen;
  const showGameUi = playing && !showHud && !inspecting;
  // No celular, o painel flutuante tem os próprios botões (◀ ✕ ▶ ao lado do
  // joystick): o botão de ação do centro não mostra "Toque para próxima página".
  const actionInteraction = touchPlaying && interactionFromPanel ? null : interaction;
  // Só toque (sem controle de videogame): sem mira, sem "Toque para ler".
  const touchOnly = touchPlaying && !padPlaying;
  useEffect(() => { sceneRef.current?.setAimEnabled(!touchOnly); }, [touchOnly, theme]);

  return (
    <div className="expo-root" style={{ position: 'relative', overflow: 'hidden', background: 'var(--bg)', fontFamily: 'Inter, sans-serif' }}>
      <div ref={containerRef} style={{ position: 'absolute', inset: 0 }} />

      {/* Controles de toque (celular) */}
      {touchPlaying && !showHud && (
        <>
          <TouchControls
            onMove={(x, y) => sceneRef.current?.setTouchMove(x, y)}
            onLook={(dx, dy) => sceneRef.current?.touchLook(dx, dy)}
            onTap={(x, y) => sceneRef.current?.tapAt(x, y)}
            onGrab={(x, y) => sceneRef.current?.touchGrab(x, y) ?? false}
            onGrabMove={(x, y) => sceneRef.current?.touchDrag(x, y)}
            onGrabEnd={() => sceneRef.current?.interactRelease()}
          />
          <div style={{
            position: 'absolute', top: 'calc(12px + env(safe-area-inset-top, 0px))', right: 12,
            display: 'flex', gap: 8,
          }}>
            {room && (
              <button onClick={() => sceneRef.current?.setInspect(true)} aria-label="Inspecionar" style={roundButton}>
                🔍
              </button>
            )}
            {room && !exerciseWaiting && (
              <button onClick={() => { sceneRef.current?.setTouchMove(0, 0); setHudOpen(true); }} aria-label="Ajustes" style={roundButton}>
                ⚙
              </button>
            )}
            <button onClick={pauseTouch} aria-label="Pausar" style={roundButton}>❚❚</button>
          </div>
        </>
      )}

      {/* Nome da sala + dica do HUD */}
      {showGameUi && room && (
        <div style={{
          position: 'absolute', top: 'calc(14px + env(safe-area-inset-top, 0px))', left: 16,
          color: '#e0e0f0', textShadow: '0 1px 4px rgba(0,0,0,0.8)', pointerEvents: 'none',
          // Fundo escuro translúcido: o texto continua legível sobre as paredes claras.
          background: 'rgba(20,18,16,0.55)', padding: '8px 12px', borderRadius: 8,
        }}>
          <div style={{ fontSize: 11, letterSpacing: '0.12em', opacity: 0.7, textTransform: 'uppercase' }}>Sala</div>
          <div style={{ fontSize: 17, fontWeight: 700 }}>{room.title}</div>
          {(!IS_TOUCH || padPlaying) && (
            <div style={{ fontSize: 12, opacity: 0.8, marginTop: 4 }}>
              <kbd style={{ ...kbdStyle, fontSize: 11 }}>{padPlaying ? 'Start' : 'Tab'}</kbd> ajustes
              {' · '}
              <kbd style={{ ...kbdStyle, fontSize: 11 }}>{padPlaying ? 'Y' : 'I'}</kbd> inspecionar
            </div>
          )}
        </div>
      )}

      {/* Nome da ala (fora das salas) */}
      {showGameUi && !room && wing && (
        <div style={{
          position: 'absolute', top: 'calc(14px + env(safe-area-inset-top, 0px))', left: 16,
          color: '#e0e0f0', textShadow: '0 1px 4px rgba(0,0,0,0.8)', pointerEvents: 'none',
          // Fundo escuro translúcido: o texto continua legível sobre as paredes claras.
          background: 'rgba(20,18,16,0.55)', padding: '8px 12px', borderRadius: 8,
        }}>
          <div style={{ fontSize: 11, letterSpacing: '0.12em', opacity: 0.7, textTransform: 'uppercase' }}>Exposição</div>
          <div style={{ fontSize: 17, fontWeight: 700 }}>{wing.title}</div>
        </div>
      )}

      {/* Mira no centro da tela (não no celular: lá se toca direto nas coisas) */}
      {showGameUi && !touchOnly && (
        <div style={{
          position: 'absolute', top: '50%', left: '50%', width: 6, height: 6,
          margin: '-3px 0 0 -3px', borderRadius: '50%',
          background: interaction ? '#f1c40f' : 'rgba(255,255,255,0.85)',
          boxShadow: '0 0 4px rgba(0,0,0,0.6)', pointerEvents: 'none',
        }} />
      )}

      {/* Aviso de ação: interação na mira tem prioridade sobre a porta.
          No desktop é só um aviso (tecla E); no celular é um botão. */}
      {showGameUi && (actionInteraction || nearDoor) && (
        <button
          {...(actionInteraction
            ? {
                // segurar: aperta e mantém (pegar a massa do pêndulo, por ex.)
                onPointerDown: () => sceneRef.current?.interactPress(),
                onPointerUp: () => sceneRef.current?.interactRelease(),
                onPointerCancel: () => sceneRef.current?.interactRelease(),
                onPointerLeave: () => sceneRef.current?.interactRelease(),
              }
            : { onClick: () => sceneRef.current?.enterNearest() })}
          disabled={!touchPlaying}
          style={{
            position: 'absolute', left: '50%', transform: 'translateX(-50%)',
            bottom: touchPlaying ? 'calc(180px + env(safe-area-inset-bottom, 0px))' : 48,
            background: 'rgba(10,10,26,0.85)',
            border: `1px solid ${actionInteraction ? '#f1c40f' : `#${nearDoor!.color.toString(16).padStart(6, '0')}`}`,
            borderRadius: 10, padding: touchPlaying ? '12px 20px' : '10px 18px', color: '#e0e0f0', fontSize: 15,
            display: 'flex', alignItems: 'center', gap: 10, whiteSpace: 'nowrap',
            maxWidth: 'calc(100vw - 32px)', overflow: 'hidden', textOverflow: 'ellipsis',
            pointerEvents: touchPlaying ? 'auto' : 'none', cursor: 'pointer', fontFamily: 'inherit',
            touchAction: 'none', userSelect: 'none',
          }}
        >
          {!touchPlaying && <kbd style={kbdStyle}>{padPlaying ? 'A' : 'E'}</kbd>}
          <span>
            {actionInteraction
              ? (interactionHold
                  ? (touchPlaying ? `Segure aqui para ${actionInteraction}` : `Segure para ${actionInteraction}`)
                  : (touchPlaying ? `Toque para ${actionInteraction}` : actionInteraction))
              : (touchPlaying ? 'Toque: ' : '') + doorPrompt(nearDoor!, !exerciseState?.completed)}
          </span>
        </button>
      )}

      {/* Celular, painel flutuante aberto: ◀ ✕ ▶ ao lado do joystick
          (também dá para tocar direto nas setas e no ✕ do painel). */}
      {showGameUi && touchPlaying && panelState && (
        <div style={{
          position: 'absolute',
          left: 'calc(28px + 120px + 16px + env(safe-area-inset-left, 0px))',
          bottom: 'calc(36px + 34px + env(safe-area-inset-bottom, 0px))',
          display: 'flex', alignItems: 'center', gap: 8,
        }}>
          <button aria-label="Página anterior" onClick={() => sceneRef.current?.panelPrev()}
            disabled={panelState.page === 0}
            style={{ ...panelButton, opacity: panelState.page === 0 ? 0.35 : 1 }}>◀</button>
          <button aria-label="Fechar" onClick={() => sceneRef.current?.closePanel()}
            style={{ ...panelButton, borderColor: '#f1c40f' }}>✕</button>
          <button aria-label="Próxima página" onClick={() => sceneRef.current?.panelNext()}
            disabled={panelState.page >= panelState.total - 1}
            style={{ ...panelButton, opacity: panelState.page >= panelState.total - 1 ? 0.35 : 1 }}>▶</button>
        </div>
      )}

      {/* Exercícios interativos dentro da sala */}
      {exerciseState && currentExercise && (
        <ExerciseHud successToast={successToast} erroToast={erroToast} />
      )}

      {/* Modo inspecionar: barra com a dica e o botão de voltar */}
      {inspecting && (
        <div style={{
          position: 'absolute', left: '50%', transform: 'translateX(-50%)',
          bottom: 'calc(24px + env(safe-area-inset-bottom, 0px))', display: 'flex', alignItems: 'center', gap: 14,
          background: 'rgba(10,10,26,0.85)', border: '1px solid rgba(255,255,255,0.25)', borderRadius: 10,
          padding: '10px 16px', color: '#e0e0f0', fontSize: 14, maxWidth: 'calc(100vw - 32px)',
        }}>
          <span>
            {padPlaying
              ? 'Inspecionando (a câmera gira sozinha) · B volta'
              : IS_TOUCH ? 'Arraste para girar · pinça para zoom' : 'Arraste para girar · roda do mouse para zoom'}
          </span>
          <button onClick={exitInspect} style={{
            background: 'var(--primary)', color: 'var(--primary-fg)', border: 'none', borderRadius: 8,
            padding: '6px 14px', fontSize: 14, fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap',
          }}>
            Voltar à sala
          </button>
        </div>
      )}

      {/* HUD de ajustes da sala (camada A) */}
      {showHud && (
        <ControlsHud
          title={room.title}
          controls={room.controls}
          values={room.values}
          compact={IS_TOUCH}
          onChange={changeControl}
          onClose={closeHud}
          closeLabel="Voltar à sala"
          focusedId={padPlaying ? room.controls[Math.min(padFocus, room.controls.length - 1)]?.id : undefined}
          hint={padPlaying ? GAMEPAD_HUD_HINT : undefined}
          lockedControls={lockedControlsSet}
        />
      )}

      {/* Mouse solto sem pausa (ex.: Esc): só pede um clique para voltar a travar.
          O Pointer Lock só pode ser pedido dentro de um clique. */}
      {!playing && !menuOpen && !showHud && !inspecting && (
        <div
          onClick={() => (IS_TOUCH ? setTouchPlaying(true) : sceneRef.current?.lock())}
          style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
        >
          <div style={{
            background: 'var(--bg-surface)', color: 'var(--text)', border: '1px solid var(--border)',
            borderRadius: 10, padding: '10px 20px', fontSize: 14, fontWeight: 600,
          }}>
            Clique para continuar
          </div>
        </div>
      )}

      {/* Menu de instruções: no início e na pausa (P, Select, ❚❚) */}
      {!playing && menuOpen && !showHud && !inspecting && (
        <div style={{
          position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: 'rgba(5,5,15,0.55)', padding: 24,
        }}>
          <div style={{
            background: 'var(--bg-surface)', color: 'var(--text)', border: '1px solid var(--border)',
            borderRadius: 16, padding: '28px 32px', maxWidth: 440, width: '100%', textAlign: 'center',
          }}>
            <div style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.6rem', fontWeight: 700, color: 'var(--accent-fisica)' }}>
              Exposição Virtual Interativa
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: 14, margin: '10px 0 20px', lineHeight: 1.6 }}>
              Cada porta leva à sala de um fenômeno da Mecânica. No centro do salão ficam a planta da exposição e as boas-vindas.
            </p>

            <table style={{ margin: '0 auto 22px', fontSize: 14, borderSpacing: '12px 6px', textAlign: 'left' }}>
              <tbody>
                {(IS_TOUCH ? TOUCH_HELP : KEYBOARD_HELP).map(([key, action]) => (
                  <tr key={key}>
                    <td><kbd style={{
                      border: '1px solid var(--border-hover)', borderRadius: 4, padding: '1px 7px',
                      fontFamily: "'JetBrains Mono', monospace", fontSize: 12, whiteSpace: 'nowrap',
                    }}>{key}</kbd></td>
                    <td style={{ color: 'var(--text-muted)' }}>{action}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p style={{ color: 'var(--text-muted)', fontSize: 12, margin: '-10px 0 20px', lineHeight: 1.5 }}>
              {GAMEPAD_HELP}
            </p>
            <button
              // Pointer Lock só pode ser pedido dentro de um clique — por isso o
              // lock() é chamado aqui, no próprio handler.
              onClick={() => (IS_TOUCH ? setTouchPlaying(true) : sceneRef.current?.lock())}
              style={{
                background: 'var(--primary)', color: 'var(--primary-fg)', border: 'none',
                borderRadius: 8, padding: '10px 26px', fontSize: 15, fontWeight: 600, cursor: 'pointer',
              }}
            >
              {IS_TOUCH ? 'Toque para explorar' : 'Clique para explorar'}
            </button>

            {onBack && <div>
              <button
                onClick={onBack}
                style={{
                  marginTop: 16, background: 'none', border: 'none', color: 'var(--text-muted)',
                  fontSize: 13, cursor: 'pointer', textDecoration: 'underline',
                }}
              >
                ← Voltar
              </button>
            </div>}
          </div>
        </div>
      )}
    </div>
  );
}
