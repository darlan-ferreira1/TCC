import { useEffect, useRef, useState } from 'react';
import { createDnaScene, type DnaScene, type DnaSceneConfig } from './scene';

const DEFAULT_BASE_PAIRS = 20;
const DEFAULT_SPEED = 0.15; // voltas por segundo

interface Props {
  onBack: () => void;
}

export default function DnaHelixSimulation({ onBack }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sceneRef = useRef<DnaScene | null>(null);
  const [basePairs, setBasePairs] = useState(DEFAULT_BASE_PAIRS);
  const [speed, setSpeed] = useState(DEFAULT_SPEED);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    sceneRef.current = createDnaScene(canvas, {
      basePairs: DEFAULT_BASE_PAIRS,
      rotationSpeed: DEFAULT_SPEED,
    });
    return () => {
      sceneRef.current?.dispose();
      sceneRef.current = null;
    };
  }, []);

  function handleBasePairsChange(value: number) {
    setBasePairs(value);
    sceneRef.current?.update({ basePairs: value, rotationSpeed: speed });
  }

  function handleSpeedChange(value: number) {
    setSpeed(value);
    sceneRef.current?.update({ basePairs, rotationSpeed: value });
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: '#0a0a1a', color: '#e0e0f0', fontFamily: 'Inter, sans-serif' }}>
      <div style={{ flex: 1, position: 'relative', minHeight: 0 }}>
        <canvas ref={canvasRef} style={{ width: '100%', height: '100%', display: 'block' }} />

        <button
          onClick={onBack}
          style={{
            position: 'absolute', top: 16, right: 20,
            background: 'rgba(17,17,48,0.8)',
            border: '1px solid #333366',
            borderRadius: 8,
            color: '#aaa',
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
          <div style={{ fontSize: 14, color: '#aaa', marginTop: 2 }}>
            Dupla Hélice · {basePairs} pares de base
          </div>
        </div>
      </div>

      <div style={{
        padding: '16px 24px',
        background: '#111130',
        borderTop: '1px solid #222244',
        display: 'flex',
        flexWrap: 'wrap',
        gap: 20,
        alignItems: 'flex-end',
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <label style={{ fontSize: 12, color: '#888', letterSpacing: 1 }}>
            PARES DE BASE: {basePairs}
          </label>
          <input
            type="range" min={4} max={40} step={1} value={basePairs}
            onChange={(e) => handleBasePairsChange(Number(e.target.value))}
            style={{ width: 160, cursor: 'pointer' }}
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <label style={{ fontSize: 12, color: '#888', letterSpacing: 1 }}>
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
              <span style={{ color: '#aaa' }}>{label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
