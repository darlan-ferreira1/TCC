import { useEffect, useRef, useState } from 'react';
import { createPendulumScene, type PendulumScene } from './scene';
import { period } from './physics';

const DEG = Math.PI / 180;

const DEFAULTS = { L: 1.5, g: 9.8, theta0Deg: 45 };

interface Props { onBack: () => void; }

export default function PendulumSimulation({ onBack }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sceneRef  = useRef<PendulumScene | null>(null);

  const [L,         setL        ] = useState(DEFAULTS.L);
  const [g,         setG        ] = useState(DEFAULTS.g);
  const [theta0Deg, setTheta0Deg] = useState(DEFAULTS.theta0Deg);

  const T = period({ L, g });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    sceneRef.current = createPendulumScene(canvas, {
      L: DEFAULTS.L,
      g: DEFAULTS.g,
      theta0: DEFAULTS.theta0Deg * DEG,
    });
    return () => { sceneRef.current?.dispose(); sceneRef.current = null; };
  }, []);

  function push(newL: number, newG: number, newDeg: number) {
    sceneRef.current?.update({ L: newL, g: newG, theta0: newDeg * DEG });
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: '#0a0a1a', color: '#e0e0f0', fontFamily: 'Inter, sans-serif' }}>
      <div style={{ flex: 1, position: 'relative', minHeight: 0 }}>
        <canvas ref={canvasRef} style={{ width: '100%', height: '100%', display: 'block' }} />

        <button
          onClick={onBack}
          style={{
            position: 'absolute', top: 16, right: 20,
            background: 'rgba(17,17,48,0.8)', border: '1px solid #333366',
            borderRadius: 8, color: '#aaa', fontSize: 13, padding: '6px 14px',
            cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6,
            backdropFilter: 'blur(4px)',
          }}
        >
          ← Voltar
        </button>

        <div style={{ position: 'absolute', top: 16, left: 20, pointerEvents: 'none' }}>
          <span style={{ fontSize: 32, fontWeight: 700, color: '#9b59b6', lineHeight: 1 }}>Pêndulo</span>
          <div style={{ fontSize: 14, color: '#aaa', marginTop: 2 }}>
            T = 2π√(L/g) ≈ <strong style={{ color: '#e0e0f0' }}>{T.toFixed(3)} s</strong>
          </div>
        </div>
      </div>

      <div style={{
        padding: '16px 24px', background: '#111130', borderTop: '1px solid #222244',
        display: 'flex', flexWrap: 'wrap', gap: 24, alignItems: 'flex-end',
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <label style={{ fontSize: 12, color: '#888', letterSpacing: 1 }}>
            COMPRIMENTO L: {L.toFixed(1)} m
          </label>
          <input
            type="range" min={0.5} max={3.0} step={0.1} value={L}
            onChange={(e) => { const v = Number(e.target.value); setL(v); push(v, g, theta0Deg); }}
            style={{ width: 140, cursor: 'pointer' }}
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <label style={{ fontSize: 12, color: '#888', letterSpacing: 1 }}>
            GRAVIDADE g: {g.toFixed(1)} m/s²
          </label>
          <input
            type="range" min={1.0} max={20.0} step={0.5} value={g}
            onChange={(e) => { const v = Number(e.target.value); setG(v); push(L, v, theta0Deg); }}
            style={{ width: 140, cursor: 'pointer' }}
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <label style={{ fontSize: 12, color: '#888', letterSpacing: 1 }}>
            ÂNGULO INICIAL θ₀: {theta0Deg}°
          </label>
          <input
            type="range" min={-170} max={170} step={5} value={theta0Deg}
            onChange={(e) => { const v = Number(e.target.value); setTheta0Deg(v); push(L, g, v); }}
            style={{ width: 140, cursor: 'pointer' }}
          />
        </div>

        <div style={{ marginLeft: 'auto', textAlign: 'right', fontSize: 13, color: '#aaa' }}>
          <div>
            Período: <span style={{ color: '#9b59b6', fontWeight: 600 }}>{T.toFixed(3)} s</span>
          </div>
          <div style={{ fontSize: 11, marginTop: 4, color: '#555' }}>
            aproximação de pequenos ângulos
          </div>
        </div>
      </div>
    </div>
  );
}
