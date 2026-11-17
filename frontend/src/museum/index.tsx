import { useEffect, useRef, useState } from 'react';
import { createMuseumScene, type MuseumScene, type RoomInfo, type WingInfo } from './scene';
import { WINGS, WING_DOORS, WING_ROOMS, WINGS_CATEGORY } from './alas';
import { CONTEUDO } from './conteudo';
import { MINIATURAS } from './miniaturas';
import type { InfoContent } from './info';
import InfoPopup from './InfoPopup';
import { EXIT_DOOR_ID, type DoorEntry, type DoorPlacement } from './layout';
import type { InteractiveRoom } from './interactiveRoom';
import { stepControl, type ControlValue } from '../core/controls';
import type { GamepadDirection } from '../core/gamepad';
import { simulations } from '../simulations/registry';
import TouchControls from './TouchControls';
import ControlsHud from '../components/ControlsHud/ControlsHud';

// As portas são geradas a partir do registro: todo experimento disponível ganha
// uma porta, sem nenhuma configuração extra.
const CATEGORY_COLOR: Record<string, number> = {
  Física:   0x9b59b6,
  Química:  0x3498db,
  Biologia: 0x2ecc71,
};

// Salas interativas: qualquer pasta de experimento com um `sala.ts` ganha uma
// sala interativa. Basta o arquivo existir — nenhuma lista para manter.
const SALAS = import.meta.glob<InteractiveRoom>('../simulations/**/sala.ts', { eager: true, import: 'sala' });

const ROOMS: Record<string, InteractiveRoom> = {};
for (const s of simulations) {
  const sala = s.folder ? SALAS[`../simulations/${s.folder}/sala.ts`] : undefined;
  if (sala) ROOMS[s.id] = sala;
}

// Só experimentos com sala interativa ganham porta: o museu é o lugar das
// salas interativas. Os demais continuam acessíveis pela Galeria.
const DOOR_ENTRIES: DoorEntry[] = simulations
  .filter((s) => s.available && s.id in ROOMS)
  .map((s) => ({
    id: s.id,
    title: s.title,
    category: s.category,
    color: CATEGORY_COLOR[s.category] ?? 0x888888,
  }));

// Alas temáticas (protótipo, ver alas.ts): as portas delas ficam numa parede
// própria do salão, e as salas novas entram na mesma tabela de salas.
const HALL_ENTRIES: DoorEntry[] = [...DOOR_ENTRIES, ...WING_DOORS];
const ALL_ROOMS: Record<string, InteractiveRoom> = { ...ROOMS, ...WING_ROOMS };

// Guarda por qual porta o aluno saiu, para ele reaparecer na frente dela ao
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
  ['Esc', 'pausar'],
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

function doorPrompt(door: DoorPlacement): string {
  if (door.id === EXIT_DOOR_ID) return door.title;
  if (door.category === WINGS_CATEGORY) return `Entrar no ${door.title}`;
  if (!(door.id in ALL_ROOMS)) return `Abrir o experimento ${door.title}`;
  return `Entrar na sala ${door.title}`;
}

interface Props {
  theme: 'dark' | 'light';
  onEnter: (experimentId: string) => void;
  onBack: () => void;
}

export default function VirtualMuseum({ theme, onEnter, onBack }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef     = useRef<MuseumScene | null>(null);
  const [locked, setLocked]     = useState(false);
  // No celular não existe Pointer Lock: "jogando" = o aluno tocou em Começar.
  // Ao voltar de um experimento, já recomeça direto (sem a tela de instruções).
  const [touchPlaying, setTouchPlaying] = useState(IS_TOUCH && lastDoorId !== undefined);
  // Com controle de videogame: "jogando" = o aluno apertou A ou Start.
  const [padPlaying, setPadPlaying] = useState(false);
  const [nearDoor, setNearDoor] = useState<DoorPlacement | null>(null);
  const [interaction, setInteraction] = useState<string | null>(null);
  const [interactionHold, setInteractionHold] = useState(true);
  const [info, setInfo] = useState<InfoContent | null>(null); // pop-up de texto aberto
  const [infoPage, setInfoPage] = useState(0);
  const [inspecting, setInspecting] = useState(false);
  const [room, setRoom] = useState<RoomInfo | null>(null);
  const [wing, setWing] = useState<WingInfo | null>(null);
  const wingRef = useRef<WingInfo | null>(null);
  const [hudOpen, setHudOpen] = useState(false);
  const [padFocus, setPadFocus] = useState(0); // linha do HUD selecionada pelo controle
  const padHudInput = useRef<((direction: GamepadDirection) => void) | null>(null);
  const playing = locked || touchPlaying || padPlaying;

  function pauseTouch() {
    sceneRef.current?.setTouchMove(0, 0);
    setTouchPlaying(false);
  }

  function changeControl(id: string, value: ControlValue) {
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
      rooms: ALL_ROOMS,
      wings: WINGS,
      content: CONTEUDO,
      miniatures: MINIATURAS,
      spawnDoorId: lastDoorId,
      background: theme === 'dark' ? 0x0a0a1a : 0xcfd6e6,
    });
    s.onLockChange = setLocked;
    s.onGamepadAction = (action) => {
      if (action === 'resume') {
        setHudOpen(false);
        setInfo(null);
        setPadPlaying(true);
      } else if (action === 'menu') {
        setPadFocus(0);
        setHudOpen(true);
        s.unlock(); // no desktop, solta o mouse para usar o HUD
      } else {
        setPadPlaying(false);
        setTouchPlaying(false);
        s.setTouchMove(0, 0);
        s.unlock();
      }
    };
    s.onGamepadHud = (direction) => padHudInput.current?.(direction);
    s.onNearDoorChange = setNearDoor;
    s.onInteractionChange = (prompt, hold) => {
      setInteraction(prompt);
      setInteractionHold(hold);
    };
    s.onInfo = (content) => {
      setInfo(content);
      setInfoPage(0);
      s.unlock(); // solta o mouse para clicar nas setas
    };
    s.onInspectChange = setInspecting;
    s.onRoomChange = (r) => {
      setRoom(r);
      setHudOpen(false);
      // Dentro de uma ala, a porta "de volta" no salão é a da ala.
      if (r) lastDoorId = wingRef.current?.id ?? r.id;
    };
    s.onWingChange = (w) => {
      wingRef.current = w;
      setWing(w);
      if (w) lastDoorId = w.id;
    };
    s.onEnter = (id) => {
      lastDoorId = wingRef.current?.id ?? id;
      onEnter(id);
    };
    sceneRef.current = s;
    return () => { s.dispose(); sceneRef.current = null; };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [theme]);

  // Com o HUD aberto, o controle navega nele; fora dele, só move a cena
  // enquanto se está jogando com o controle.
  useEffect(() => {
    sceneRef.current?.setGamepadMode((room && hudOpen) || info ? 'hud' : padPlaying ? 'play' : 'off');
  }, [room, padPlaying, hudOpen, info, theme]);

  // ↑ ↓ escolhe o parâmetro; ← → altera o valor dele.
  useEffect(() => {
    padHudInput.current = (direction) => {
      if (info) { // pop-up de texto: ← → passam as páginas
        if (direction === 'left' || direction === 'right') turnPage(direction === 'right' ? 1 : -1);
        return;
      }
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
  // Esc com o HUD aberto volta para a tela de pausa.
  useEffect(() => {
    if (IS_TOUCH) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.code === 'Tab' && room && locked) {
        e.preventDefault();
        setHudOpen(true);
        sceneRef.current?.unlock();
      } else if (e.code === 'Escape' && hudOpen) {
        setHudOpen(false);
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [room, locked, hudOpen]);

  function turnPage(step: number) {
    if (!info) return;
    setInfoPage((p) => Math.min(Math.max(p + step, 0), info.pages.length - 1));
  }

  // Fecha o pop-up de texto. No desktop, volta a travar o mouse (dentro do clique).
  function closeInfo() {
    setInfo(null);
    if (!IS_TOUCH && !padPlaying) sceneRef.current?.lock();
  }

  function exitInspect() {
    sceneRef.current?.setInspect(false);
    if (!IS_TOUCH && !padPlaying) sceneRef.current?.lock();
  }

  // Teclado com o pop-up aberto: ← → passam as páginas, Esc fecha.
  // No modo inspecionar, Esc volta para a sala.
  useEffect(() => {
    if (!info && !inspecting) return;
    const onKey = (e: KeyboardEvent) => {
      if (info && (e.code === 'ArrowRight' || e.code === 'KeyD')) turnPage(1);
      else if (info && (e.code === 'ArrowLeft' || e.code === 'KeyA')) turnPage(-1);
      else if (e.code === 'Escape') {
        if (info) setInfo(null);
        else sceneRef.current?.setInspect(false);
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  });

  const showHud = room && hudOpen;
  const showGameUi = playing && !showHud && !info && !inspecting;

  return (
    <div style={{ position: 'relative', height: '100vh', overflow: 'hidden', background: 'var(--bg)', fontFamily: 'Inter, sans-serif' }}>
      <div ref={containerRef} style={{ position: 'absolute', inset: 0 }} />

      {/* Controles de toque (celular) */}
      {touchPlaying && !showHud && (
        <>
          <TouchControls
            onMove={(x, y) => sceneRef.current?.setTouchMove(x, y)}
            onLook={(dx, dy) => sceneRef.current?.touchLook(dx, dy)}
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
            {room && (
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
        }}>
          <div style={{ fontSize: 11, letterSpacing: '0.12em', opacity: 0.7, textTransform: 'uppercase' }}>Ala</div>
          <div style={{ fontSize: 17, fontWeight: 700 }}>{wing.title}</div>
        </div>
      )}

      {/* Mira no centro da tela */}
      {showGameUi && (
        <div style={{
          position: 'absolute', top: '50%', left: '50%', width: 6, height: 6,
          margin: '-3px 0 0 -3px', borderRadius: '50%',
          background: interaction ? '#f1c40f' : 'rgba(255,255,255,0.85)',
          boxShadow: '0 0 4px rgba(0,0,0,0.6)', pointerEvents: 'none',
        }} />
      )}

      {/* Aviso de ação: interação na mira tem prioridade sobre a porta.
          No desktop é só um aviso (tecla E); no celular é um botão. */}
      {showGameUi && (interaction || nearDoor) && (
        <button
          {...(interaction
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
            border: `1px solid ${interaction ? '#f1c40f' : `#${nearDoor!.color.toString(16).padStart(6, '0')}`}`,
            borderRadius: 10, padding: touchPlaying ? '12px 20px' : '10px 18px', color: '#e0e0f0', fontSize: 15,
            display: 'flex', alignItems: 'center', gap: 10, whiteSpace: 'nowrap',
            maxWidth: 'calc(100vw - 32px)', overflow: 'hidden', textOverflow: 'ellipsis',
            pointerEvents: touchPlaying ? 'auto' : 'none', cursor: 'pointer', fontFamily: 'inherit',
            touchAction: 'none', userSelect: 'none',
          }}
        >
          {!touchPlaying && <kbd style={kbdStyle}>{padPlaying ? 'A' : 'E'}</kbd>}
          <span>
            {interaction
              ? (interactionHold
                  ? (touchPlaying ? `Segure aqui para ${interaction}` : `Segure para ${interaction}`)
                  : (touchPlaying ? `Toque para ${interaction}` : interaction))
              : (touchPlaying ? 'Toque: ' : '') + doorPrompt(nearDoor!)}
          </span>
        </button>
      )}

      {/* Pop-up de texto ("i", quadros, pedestais) */}
      {info && (
        <InfoPopup
          content={info}
          page={infoPage}
          compact={IS_TOUCH}
          hint={padPlaying ? 'Controle: ← → passa as páginas, B fecha.' : IS_TOUCH ? undefined : '← → passam as páginas · Esc fecha'}
          onPage={(p) => setInfoPage(Math.min(Math.max(p, 0), info.pages.length - 1))}
          onClose={closeInfo}
        />
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
        />
      )}

      {/* Tela de instruções (aparece enquanto não está "jogando") */}
      {!playing && !showHud && !info && !inspecting && (
        <div style={{
          position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: 'rgba(5,5,15,0.55)', padding: 24,
        }}>
          <div style={{
            background: 'var(--bg-surface)', color: 'var(--text)', border: '1px solid var(--border)',
            borderRadius: 16, padding: '28px 32px', maxWidth: 440, width: '100%', textAlign: 'center',
          }}>
            <div style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.6rem', fontWeight: 700, color: 'var(--accent-fisica)' }}>
              Museu CLARA<span style={{ color: 'var(--text-muted)', fontStyle: 'italic', fontWeight: 400 }}>.js</span>
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: 14, margin: '10px 0 20px', lineHeight: 1.6 }}>
              Cada porta leva à sala interativa de um experimento. As paredes são organizadas por área do conhecimento.
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

            <div>
              <button
                onClick={onBack}
                style={{
                  marginTop: 16, background: 'none', border: 'none', color: 'var(--text-muted)',
                  fontSize: 13, cursor: 'pointer', textDecoration: 'underline',
                }}
              >
                ← Voltar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
