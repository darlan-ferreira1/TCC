// Controles de toque do Museu Virtual (celular/tablet).
//
//   - Área de olhar: ocupa a tela toda; arrastar o dedo gira a câmera.
//   - Joystick virtual: canto inferior esquerdo; o deslocamento do botão
//     central em relação à base vira um vetor analógico em [-1, 1].
//
// Cada controle usa Pointer Events com setPointerCapture: o dedo continua
// "preso" ao controle mesmo saindo da área dele, e dois dedos (um no joystick,
// outro olhando) funcionam ao mesmo tempo porque cada um tem seu pointerId.

import { useRef, useState, type PointerEvent } from 'react';

const BASE_SIZE = 120; // diâmetro da base do joystick (px)
const KNOB_SIZE = 52;
const MAX_OFFSET = (BASE_SIZE - KNOB_SIZE) / 2; // quanto o botão pode se afastar do centro
const DEAD_ZONE = 0.12; // ignora toques muito pequenos (dedo apoiado)

interface Props {
  onMove: (x: number, y: number) => void;  // x = lado (+ direita), y = frente (+ para frente)
  onLook: (dx: number, dy: number) => void;
}

export default function TouchControls({ onMove, onLook }: Props) {
  return (
    <>
      <LookArea onLook={onLook} />
      <Joystick onMove={onMove} />
    </>
  );
}

function LookArea({ onLook }: Pick<Props, 'onLook'>) {
  const last = useRef<{ id: number; x: number; y: number } | null>(null);

  function down(e: PointerEvent<HTMLDivElement>) {
    if (last.current) return; // um dedo por vez olhando
    e.currentTarget.setPointerCapture(e.pointerId);
    last.current = { id: e.pointerId, x: e.clientX, y: e.clientY };
  }
  function move(e: PointerEvent<HTMLDivElement>) {
    const l = last.current;
    if (!l || l.id !== e.pointerId) return;
    onLook(e.clientX - l.x, e.clientY - l.y);
    last.current = { id: l.id, x: e.clientX, y: e.clientY };
  }
  function up(e: PointerEvent<HTMLDivElement>) {
    if (last.current?.id === e.pointerId) last.current = null;
  }

  return (
    <div
      onPointerDown={down}
      onPointerMove={move}
      onPointerUp={up}
      onPointerCancel={up}
      style={{ position: 'absolute', inset: 0, touchAction: 'none' }}
    />
  );
}

function Joystick({ onMove }: Pick<Props, 'onMove'>) {
  const baseRef = useRef<HTMLDivElement>(null);
  const pointerId = useRef<number | null>(null);
  const [knob, setKnob] = useState({ x: 0, y: 0 });

  function update(e: PointerEvent<HTMLDivElement>) {
    const rect = baseRef.current!.getBoundingClientRect();
    let dx = e.clientX - (rect.left + rect.width / 2);
    let dy = e.clientY - (rect.top + rect.height / 2);
    const dist = Math.hypot(dx, dy);
    if (dist > MAX_OFFSET) {
      dx = (dx / dist) * MAX_OFFSET;
      dy = (dy / dist) * MAX_OFFSET;
    }
    setKnob({ x: dx, y: dy });
    const nx = dx / MAX_OFFSET;
    const ny = -dy / MAX_OFFSET; // tela: Y cresce para baixo; "frente" é para cima
    if (Math.hypot(nx, ny) < DEAD_ZONE) onMove(0, 0);
    else onMove(nx, ny);
  }

  function down(e: PointerEvent<HTMLDivElement>) {
    if (pointerId.current !== null) return;
    e.stopPropagation();
    e.currentTarget.setPointerCapture(e.pointerId);
    pointerId.current = e.pointerId;
    update(e);
  }
  function move(e: PointerEvent<HTMLDivElement>) {
    if (pointerId.current === e.pointerId) update(e);
  }
  function up(e: PointerEvent<HTMLDivElement>) {
    if (pointerId.current !== e.pointerId) return;
    pointerId.current = null;
    setKnob({ x: 0, y: 0 });
    onMove(0, 0);
  }

  return (
    <div
      ref={baseRef}
      onPointerDown={down}
      onPointerMove={move}
      onPointerUp={up}
      onPointerCancel={up}
      style={{
        position: 'absolute',
        left: 'calc(28px + env(safe-area-inset-left, 0px))',
        bottom: 'calc(36px + env(safe-area-inset-bottom, 0px))',
        width: BASE_SIZE, height: BASE_SIZE, borderRadius: '50%',
        background: 'rgba(255,255,255,0.08)', border: '2px solid rgba(255,255,255,0.25)',
        touchAction: 'none',
      }}
    >
      <div style={{
        position: 'absolute',
        left: BASE_SIZE / 2 - KNOB_SIZE / 2 - 2 + knob.x,
        top: BASE_SIZE / 2 - KNOB_SIZE / 2 - 2 + knob.y,
        width: KNOB_SIZE, height: KNOB_SIZE, borderRadius: '50%',
        background: 'rgba(255,255,255,0.35)', border: '2px solid rgba(255,255,255,0.6)',
        pointerEvents: 'none',
      }} />
    </div>
  );
}
