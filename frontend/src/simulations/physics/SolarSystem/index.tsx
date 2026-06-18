import { useEffect, useRef, useState } from 'react';
import { createSolarSystemScene, type SolarSystemScene } from './scene';
import { PLANETS } from './physics';

const PLANET_COLORS = [
  '#b5b5b5', '#e8cda0', '#4a90d9', '#c1440e',
  '#c88b3a', '#e4d191', '#7de8e8', '#4b70dd',
];

const DEFAULT_SPEED = 1.5;

interface Props { onBack: () => void; }

export default function SolarSystemSimulation({ onBack }: Props) {
  const canvasRef     = useRef<HTMLCanvasElement>(null);
  const sceneRef      = useRef<SolarSystemScene | null>(null);
  const timeDisplayRef = useRef<HTMLSpanElement>(null);

  const [speed, setSpeed] = useState(DEFAULT_SPEED);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    sceneRef.current = createSolarSystemScene(
      canvas,
      { speedFactor: DEFAULT_SPEED },
      (t) => {
        // Atualiza o display de tempo diretamente no DOM para evitar re-renders
        if (timeDisplayRef.current) {
          timeDisplayRef.current.textContent = `${t.toFixed(1)} anos`;
        }
      },
    );
    return () => { sceneRef.current?.dispose(); sceneRef.current = null; };
  }, []);

  function handleSpeedChange(v: number) {
    setSpeed(v);
    sceneRef.current?.update({ speedFactor: v });
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: '#020408', color: '#e0e0f0', fontFamily: 'Inter, sans-serif' }}>
      <div style={{ flex: 1, position: 'relative', minHeight: 0 }}>
        <canvas ref={canvasRef} style={{ width: '100%', height: '100%', display: 'block' }} />

        <button
          onClick={onBack}
          style={{
            position: 'absolute', top: 16, right: 20,
            background: 'rgba(2,4,8,0.8)', border: '1px solid #1a1a3a',
            borderRadius: 8, color: '#aaa', fontSize: 13, padding: '6px 14px',
            cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6,
            backdropFilter: 'blur(4px)',
          }}
        >
          ← Voltar
        </button>

        <div style={{ position: 'absolute', top: 16, left: 20, pointerEvents: 'none' }}>
          <span style={{ fontSize: 32, fontWeight: 700, color: '#f39c12', lineHeight: 1 }}>Sistema Solar</span>
          <div style={{ fontSize: 13, color: '#888', marginTop: 4 }}>
            Tempo simulado: <span ref={timeDisplayRef} style={{ color: '#e0e0f0', fontWeight: 600 }}>0.0 anos</span>
          </div>
        </div>
      </div>

      <div style={{
        padding: '14px 24px', background: '#05080f', borderTop: '1px solid #111122',
        display: 'flex', flexWrap: 'wrap', gap: 24, alignItems: 'center',
      }}>
        {/* Slider de velocidade */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <label style={{ fontSize: 12, color: '#888', letterSpacing: 1 }}>
            VELOCIDADE DO TEMPO: {speed.toFixed(1)}×
          </label>
          <input
            type="range" min={0.1} max={10} step={0.1} value={speed}
            onChange={(e) => handleSpeedChange(Number(e.target.value))}
            style={{ width: 180, cursor: 'pointer' }}
          />
        </div>

        {/* Legenda dos planetas */}
        <div style={{
          display: 'flex', flexWrap: 'wrap', gap: '6px 16px',
          marginLeft: 'auto', alignItems: 'center',
        }}>
          {PLANETS.map((planet, i) => (
            <div key={planet.name} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12 }}>
              <div style={{ width: 10, height: 10, borderRadius: '50%', background: PLANET_COLORS[i], flexShrink: 0 }} />
              <span style={{ color: '#888' }}>{planet.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
