import { useEffect, useRef, useState } from 'react';
import { createPendulumScene, type PendulumScene } from './scene';
import { period } from './physics';

const DEG = Math.PI / 180;

const DEFAULTS = { L: 1.5, g: 9.8, theta0Deg: 45 };

interface Props { onBack: () => void; theme: 'dark' | 'light'; }

export default function PendulumSimulation({ onBack, theme }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sceneRef  = useRef<PendulumScene | null>(null);

  const [L,         setL        ] = useState(DEFAULTS.L);
  const [g,         setG        ] = useState(DEFAULTS.g);
  const [theta0Deg, setTheta0Deg] = useState(DEFAULTS.theta0Deg);

  const T = period({ L, g });

  const dark = theme === 'dark';
  const c = {
    bg:          dark ? '#0a0a1a'              : '#f0f0f8',
    text:        dark ? '#e0e0f0'              : '#1a1a2e',
    muted:       dark ? '#aaa'                 : '#555',
    faint:       dark ? '#555'                 : '#999',
    label:       dark ? '#888'                 : '#666',
    panelBg:     dark ? '#111130'              : '#e0e0ef',
    panelBorder: dark ? '#222244'              : '#c0c0d8',
    btnBg:       dark ? 'rgba(17,17,48,0.8)'  : 'rgba(240,240,250,0.85)',
    btnBorder:   dark ? '#333366'              : '#9999cc',
    sceneBg:     dark ? 0x0a0a1a              : 0xf0f0f8,
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    sceneRef.current = createPendulumScene(
      canvas,
      { L: DEFAULTS.L, g: DEFAULTS.g, theta0: DEFAULTS.theta0Deg * DEG },
      c.sceneBg,
    );
    return () => { sceneRef.current?.dispose(); sceneRef.current = null; };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [theme]);

  function push(newL: number, newG: number, newDeg: number) {
    sceneRef.current?.update({ L: newL, g: newG, theta0: newDeg * DEG });
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: c.bg, color: c.text, fontFamily: 'Inter, sans-serif' }}>
      <div style={{ flex: 1, position: 'relative', minHeight: 0 }}>
        <canvas ref={canvasRef} style={{ width: '100%', height: '100%', display: 'block' }} />

        <button
          onClick={onBack}
          style={{
            position: 'absolute', top: 16, right: 20,
            background: c.btnBg, border: `1px solid ${c.btnBorder}`,
            borderRadius: 8, color: c.muted, fontSize: 13, padding: '6px 14px',
            cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6,
            backdropFilter: 'blur(4px)',
          }}
        >
          ← Voltar
        </button>

        <div style={{ position: 'absolute', top: 16, left: 20, pointerEvents: 'none' }}>
          <span style={{ fontSize: 32, fontWeight: 700, color: '#9b59b6', lineHeight: 1 }}>Pêndulo</span>
          <div style={{ fontSize: 14, color: c.muted, marginTop: 2 }}>
            T = 2π√(L/g) ≈ <strong style={{ color: c.text }}>{T.toFixed(3)} s</strong>
          </div>
        </div>
      </div>

      <div style={{
        padding: '16px 24px', background: c.panelBg, borderTop: `1px solid ${c.panelBorder}`,
        display: 'flex', flexWrap: 'wrap', gap: 24, alignItems: 'flex-end',
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <label style={{ fontSize: 12, color: c.label, letterSpacing: 1 }}>
            COMPRIMENTO L: {L.toFixed(1)} m
          </label>
          <input
            type="range" min={0.5} max={3.0} step={0.1} value={L}
            onChange={(e) => { const v = Number(e.target.value); setL(v); push(v, g, theta0Deg); }}
            style={{ width: 140, cursor: 'pointer' }}
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <label style={{ fontSize: 12, color: c.label, letterSpacing: 1 }}>
            GRAVIDADE g: {g.toFixed(1)} m/s²
          </label>
          <input
            type="range" min={1.0} max={20.0} step={0.5} value={g}
            onChange={(e) => { const v = Number(e.target.value); setG(v); push(L, v, theta0Deg); }}
            style={{ width: 140, cursor: 'pointer' }}
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <label style={{ fontSize: 12, color: c.label, letterSpacing: 1 }}>
            ÂNGULO INICIAL θ₀: {theta0Deg}°
          </label>
          <input
            type="range" min={-170} max={170} step={5} value={theta0Deg}
            onChange={(e) => { const v = Number(e.target.value); setTheta0Deg(v); push(L, g, v); }}
            style={{ width: 140, cursor: 'pointer' }}
          />
        </div>

        <div style={{ marginLeft: 'auto', textAlign: 'right', fontSize: 13, color: c.muted }}>
          <div>
            Período: <span style={{ color: '#9b59b6', fontWeight: 600 }}>{T.toFixed(3)} s</span>
          </div>
          <div style={{ fontSize: 11, marginTop: 4, color: c.faint }}>
            aproximação de pequenos ângulos
          </div>
        </div>
      </div>
    </div>
  );
}
