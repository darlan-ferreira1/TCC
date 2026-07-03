import { useEffect, useRef, useState } from 'react';
import { createWaveScene, type WaveScene } from './scene';
import { waveInfo } from './physics';

const DEFAULTS = { A: 0.5, lambda: 2.0, f: 0.8 };

interface Props { onBack: () => void; theme: 'dark' | 'light'; }

export default function WavesSimulation({ onBack, theme }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sceneRef  = useRef<WaveScene | null>(null);

  const [A,      setA     ] = useState(DEFAULTS.A);
  const [lambda, setLambda] = useState(DEFAULTS.lambda);
  const [f,      setF     ] = useState(DEFAULTS.f);

  const info = waveInfo({ A, lambda, f });

  const dark = theme === 'dark';
  const c = {
    bg:          dark ? '#0a0a1a'             : '#f0f0f8',
    text:        dark ? '#e0e0f0'             : '#1a1a2e',
    muted:       dark ? '#aaa'                : '#555',
    label:       dark ? '#888'                : '#666',
    panelBg:     dark ? '#111130'             : '#e0e0ef',
    panelBorder: dark ? '#222244'             : '#c0c0d8',
    btnBg:       dark ? 'rgba(17,17,48,0.8)' : 'rgba(240,240,250,0.85)',
    btnBorder:   dark ? '#333366'             : '#9999cc',
    sceneBg:     dark ? 0x0a0a1a             : 0xf0f0f8,
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    sceneRef.current = createWaveScene(canvas, DEFAULTS, c.sceneBg);
    return () => { sceneRef.current?.dispose(); sceneRef.current = null; };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [theme]);

  function push(newA: number, newLambda: number, newF: number) {
    sceneRef.current?.update({ A: newA, lambda: newLambda, f: newF });
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
          <span style={{ fontSize: 32, fontWeight: 700, color: '#9b59b6', lineHeight: 1 }}>Onda</span>
          <div style={{ fontSize: 13, color: c.muted, marginTop: 4, lineHeight: 1.6 }}>
            <div>y = A · sin(kx − ωt)</div>
            <div>
              v = λf = <strong style={{ color: c.text }}>{info.v.toFixed(2)} m/s</strong>
              &nbsp;·&nbsp;
              T = 1/f = <strong style={{ color: c.text }}>{info.T.toFixed(2)} s</strong>
            </div>
          </div>
        </div>
      </div>

      <div style={{
        padding: '16px 24px', background: c.panelBg, borderTop: `1px solid ${c.panelBorder}`,
        display: 'flex', flexWrap: 'wrap', gap: 24, alignItems: 'flex-end',
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <label style={{ fontSize: 12, color: c.label, letterSpacing: 1 }}>
            AMPLITUDE A: {A.toFixed(1)} m
          </label>
          <input
            type="range" min={0.1} max={2.0} step={0.1} value={A}
            onChange={(e) => { const v = Number(e.target.value); setA(v); push(v, lambda, f); }}
            style={{ width: 140, cursor: 'pointer' }}
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <label style={{ fontSize: 12, color: c.label, letterSpacing: 1 }}>
            COMPRIMENTO DE ONDA λ: {lambda.toFixed(1)} m
          </label>
          <input
            type="range" min={1.0} max={5.0} step={0.1} value={lambda}
            onChange={(e) => { const v = Number(e.target.value); setLambda(v); push(A, v, f); }}
            style={{ width: 140, cursor: 'pointer' }}
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <label style={{ fontSize: 12, color: c.label, letterSpacing: 1 }}>
            FREQUÊNCIA f: {f.toFixed(1)} Hz
          </label>
          <input
            type="range" min={0.1} max={3.0} step={0.1} value={f}
            onChange={(e) => { const v = Number(e.target.value); setF(v); push(A, lambda, v); }}
            style={{ width: 140, cursor: 'pointer' }}
          />
        </div>

        <div style={{ marginLeft: 'auto', textAlign: 'right', fontSize: 13, color: c.muted, lineHeight: 1.8 }}>
          <div>k = 2π/λ = <span style={{ color: '#9b59b6', fontWeight: 600 }}>{info.k.toFixed(3)} rad/m</span></div>
          <div>ω = 2πf = <span style={{ color: '#9b59b6', fontWeight: 600 }}>{info.omega.toFixed(3)} rad/s</span></div>
          <div>v = λf = <span style={{ color: '#9b59b6', fontWeight: 600 }}>{info.v.toFixed(2)} m/s</span></div>
        </div>
      </div>
    </div>
  );
}
