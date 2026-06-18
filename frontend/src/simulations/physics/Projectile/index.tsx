import { useEffect, useRef, useState } from 'react';
import { createProjectileScene, type ProjectileScene } from './scene';
import { projectileInfo } from './physics';

const DEG = Math.PI / 180;

const DEFAULTS = { v0: 20, thetaDeg: 45, g: 9.8 };

interface Props { onBack: () => void; }

export default function ProjectileSimulation({ onBack }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sceneRef  = useRef<ProjectileScene | null>(null);

  const [v0,       setV0      ] = useState(DEFAULTS.v0);
  const [thetaDeg, setThetaDeg] = useState(DEFAULTS.thetaDeg);
  const [g,        setG       ] = useState(DEFAULTS.g);
  const [launched, setLaunched] = useState(false);

  const info = projectileInfo({ v0, theta: thetaDeg * DEG, g });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    sceneRef.current = createProjectileScene(canvas, {
      v0:    DEFAULTS.v0,
      theta: DEFAULTS.thetaDeg * DEG,
      g:     DEFAULTS.g,
    });
    return () => { sceneRef.current?.dispose(); sceneRef.current = null; };
  }, []);

  function pushUpdate(newV0: number, newDeg: number, newG: number) {
    sceneRef.current?.update({ v0: newV0, theta: newDeg * DEG, g: newG });
    setLaunched(false);
  }

  function handleLaunch() {
    sceneRef.current?.launch();
    setLaunched((prev) => !prev);
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

        {/* Info overlay */}
        <div style={{ position: 'absolute', top: 16, left: 20, pointerEvents: 'none' }}>
          <span style={{ fontSize: 32, fontWeight: 700, color: '#9b59b6', lineHeight: 1 }}>Projétil</span>
          <div style={{ fontSize: 13, color: '#aaa', marginTop: 4, lineHeight: 1.8 }}>
            <div>
              <span style={{ color: '#f39c12' }}>●</span>
              {' '}Alcance R = <strong style={{ color: '#e0e0f0' }}>{info.range.toFixed(1)} m</strong>
            </div>
            <div>
              <span style={{ color: '#2ecc71' }}>●</span>
              {' '}Altura máx. H = <strong style={{ color: '#e0e0f0' }}>{info.maxHeight.toFixed(1)} m</strong>
            </div>
            <div>Tempo de voo T = <strong style={{ color: '#e0e0f0' }}>{info.flightTime.toFixed(2)} s</strong></div>
          </div>
        </div>
      </div>

      <div style={{
        padding: '16px 24px', background: '#111130', borderTop: '1px solid #222244',
        display: 'flex', flexWrap: 'wrap', gap: 24, alignItems: 'flex-end',
      }}>
        {/* v₀ */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <label style={{ fontSize: 12, color: '#888', letterSpacing: 1 }}>
            VELOCIDADE INICIAL v₀: {v0} m/s
          </label>
          <input
            type="range" min={5} max={40} step={1} value={v0}
            onChange={(e) => { const v = Number(e.target.value); setV0(v); pushUpdate(v, thetaDeg, g); }}
            style={{ width: 140, cursor: 'pointer' }}
          />
        </div>

        {/* θ */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <label style={{ fontSize: 12, color: '#888', letterSpacing: 1 }}>
            ÂNGULO θ: {thetaDeg}°
          </label>
          <input
            type="range" min={5} max={85} step={1} value={thetaDeg}
            onChange={(e) => { const v = Number(e.target.value); setThetaDeg(v); pushUpdate(v0, v, g); }}
            style={{ width: 140, cursor: 'pointer' }}
          />
        </div>

        {/* g */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <label style={{ fontSize: 12, color: '#888', letterSpacing: 1 }}>
            GRAVIDADE g: {g.toFixed(1)} m/s²
          </label>
          <input
            type="range" min={1} max={20} step={0.5} value={g}
            onChange={(e) => { const v = Number(e.target.value); setG(v); pushUpdate(v0, thetaDeg, v); }}
            style={{ width: 140, cursor: 'pointer' }}
          />
        </div>

        {/* Botão disparar/resetar */}
        <div style={{ marginLeft: 'auto' }}>
          <button
            onClick={handleLaunch}
            style={{
              background: launched ? '#2c2c50' : '#9b59b6',
              border: `1px solid ${launched ? '#444466' : '#7d3c98'}`,
              borderRadius: 8,
              color: launched ? '#aaa' : '#fff',
              fontSize: 14,
              fontWeight: 600,
              padding: '10px 28px',
              cursor: 'pointer',
              letterSpacing: 0.5,
              transition: 'background 0.2s',
            }}
          >
            {launched ? 'Resetar' : 'Disparar'}
          </button>
        </div>
      </div>
    </div>
  );
}
