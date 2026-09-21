import { useEffect, useRef, useState } from 'react';
import { createDnaScene, type DnaScene } from './scene';

const DEFAULT_BASE_PAIRS = 20;
const DEFAULT_SPEED = 0.15; // voltas por segundo

interface Props {
  onBack: () => void;
  theme: 'dark' | 'light';
}

export default function DnaHelixSimulation({ onBack, theme }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sceneRef = useRef<DnaScene | null>(null);
  const [basePairs, setBasePairs] = useState(DEFAULT_BASE_PAIRS);
  const [speed, setSpeed] = useState(DEFAULT_SPEED);

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
    sceneRef.current = createDnaScene(
      canvas,
      { basePairs: DEFAULT_BASE_PAIRS, rotationSpeed: DEFAULT_SPEED },
      c.sceneBg,
    );
    return () => {
      sceneRef.current?.dispose();
      sceneRef.current = null;
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [theme]);

  function handleBasePairsChange(value: number) {
    setBasePairs(value);
    sceneRef.current?.update({ basePairs: value, rotationSpeed: speed });
  }

  function handleSpeedChange(value: number) {
    setSpeed(value);
    sceneRef.current?.update({ basePairs, rotationSpeed: value });
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: c.bg, color: c.text, fontFamily: 'Inter, sans-serif' }}>
      <div style={{ flex: 1, position: 'relative', minHeight: 0 }}>
        <canvas ref={canvasRef} style={{ width: '100%', height: '100%', display: 'block' }} />

        <button
          onClick={onBack}
          style={{
            position: 'absolute', top: 16, right: 20,
            background: c.btnBg,
            border: `1px solid ${c.btnBorder}`,
            borderRadius: 8,
            color: c.muted,
            fontSize: 13,
            padding: '6px 14px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            backdropFilter: 'blur(4px)',
          }}
        >
          ← Voltar
        </button>

        <div style={{ position: 'absolute', top: 16, left: 20, pointerEvents: 'none' }}>
          <span style={{ fontSize: 32, fontWeight: 700, color: '#2ecc71', lineHeight: 1 }}>DNA</span>
          <div style={{ fontSize: 14, color: c.muted, marginTop: 2 }}>
            Dupla Hélice · {basePairs} pares de base
          </div>
        </div>
      </div>

      <div style={{
        padding: '16px 24px',
        background: c.panelBg,
        borderTop: `1px solid ${c.panelBorder}`,
        display: 'flex',
        flexWrap: 'wrap',
        gap: 20,
        alignItems: 'flex-end',
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <label style={{ fontSize: 12, color: c.label, letterSpacing: 1 }}>
            PARES DE BASE: {basePairs}
          </label>
          <input
            type="range" min={4} max={40} step={1} value={basePairs}
            onChange={(e) => handleBasePairsChange(Number(e.target.value))}
            style={{ width: 160, cursor: 'pointer' }}
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <label style={{ fontSize: 12, color: c.label, letterSpacing: 1 }}>
            ROTAÇÃO: {speed.toFixed(2)} vol/s
          </label>
          <input
            type="range" min={0} max={0.5} step={0.01} value={speed}
            onChange={(e) => handleSpeedChange(Number(e.target.value))}
            style={{ width: 140, cursor: 'pointer' }}
          />
        </div>

        <div style={{ display: 'flex', gap: 16, marginLeft: 'auto', alignItems: 'center' }}>
          {[
            { color: '#e74c3c', label: 'Fita 1' },
            { color: '#3498db', label: 'Fita 2' },
            { color: '#f39c12', label: 'Par A-T' },
            { color: '#2ecc71', label: 'Par G-C' },
          ].map(({ color, label }) => (
            <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13 }}>
              <div style={{ width: 12, height: 12, borderRadius: '50%', background: color }} />
              <span style={{ color: c.muted }}>{label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
