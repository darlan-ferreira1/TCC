import { useEffect, useRef, useState } from 'react';
import { createProjectileScene, type ProjectileScene } from './scene';
import { projectileInfo } from './physics';

const DEG = Math.PI / 180;

const DEFAULTS = { v0: 20, thetaDeg: 45, g: 9.8 };

interface Props { onBack: () => void; theme: 'dark' | 'light'; }

export default function ProjectileSimulation({ onBack, theme }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sceneRef  = useRef<ProjectileScene | null>(null);

  const [v0,       setV0      ] = useState(DEFAULTS.v0);
  const [thetaDeg, setThetaDeg] = useState(DEFAULTS.thetaDeg);
  const [g,        setG       ] = useState(DEFAULTS.g);
  const [launched, setLaunched] = useState(false);

  const info = projectileInfo({ v0, theta: thetaDeg * DEG, g });

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
    sceneRef.current = createProjectileScene(
      canvas,
      { v0: DEFAULTS.v0, theta: DEFAULTS.thetaDeg * DEG, g: DEFAULTS.g },
      c.sceneBg,
    );
    setLaunched(false);
    return () => { sceneRef.current?.dispose(); sceneRef.current = null; };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [theme]);

  function pushUpdate(newV0: number, newDeg: number, newG: number) {
    sceneRef.current?.update({ v0: newV0, theta: newDeg * DEG, g: newG });
    setLaunched(false);
  }

  function handleLaunch() {
    sceneRef.current?.launch();
    setLaunched((prev) => !prev);
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
          <span style={{ fontSize: 32, fontWeight: 700, color: '#9b59b6', lineHeight: 1 }}>Projétil</span>
          <div style={{ fontSize: 13, color: c.muted, marginTop: 4, lineHeight: 1.8 }}>
            <div>
              <span style={{ color: '#f39c12' }}>●</span>
              {' '}Alcance R = <strong style={{ color: c.text }}>{info.range.toFixed(1)} m</strong>
            </div>
            <div>
              <span style={{ color: '#2ecc71' }}>●</span>
              {' '}Altura máx. H = <strong style={{ color: c.text }}>{info.maxHeight.toFixed(1)} m</strong>
            </div>
            <div>Tempo de voo T = <strong style={{ color: c.text }}>{info.flightTime.toFixed(2)} s</strong></div>
          </div>
        </div>
      </div>

      <div style={{
        padding: '16px 24px', background: c.panelBg, borderTop: `1px solid ${c.panelBorder}`,
        display: 'flex', flexWrap: 'wrap', gap: 24, alignItems: 'flex-end',
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <label style={{ fontSize: 12, color: c.label, letterSpacing: 1 }}>
            VELOCIDADE INICIAL v₀: {v0} m/s
          </label>
          <input
            type="range" min={5} max={40} step={1} value={v0}
            onChange={(e) => { const v = Number(e.target.value); setV0(v); pushUpdate(v, thetaDeg, g); }}
            style={{ width: 140, cursor: 'pointer' }}
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <label style={{ fontSize: 12, color: c.label, letterSpacing: 1 }}>
            ÂNGULO θ: {thetaDeg}°
          </label>
          <input
            type="range" min={5} max={85} step={1} value={thetaDeg}
            onChange={(e) => { const v = Number(e.target.value); setThetaDeg(v); pushUpdate(v0, v, g); }}
            style={{ width: 140, cursor: 'pointer' }}
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <label style={{ fontSize: 12, color: c.label, letterSpacing: 1 }}>
            GRAVIDADE g: {g.toFixed(1)} m/s²
          </label>
          <input
            type="range" min={1} max={20} step={0.5} value={g}
            onChange={(e) => { const v = Number(e.target.value); setG(v); pushUpdate(v0, thetaDeg, v); }}
            style={{ width: 140, cursor: 'pointer' }}
          />
        </div>

        <div style={{ marginLeft: 'auto' }}>
          <button
            onClick={handleLaunch}
            style={{
              background: launched ? (dark ? '#2c2c50' : '#d0d0e8') : '#9b59b6',
              border: `1px solid ${launched ? (dark ? '#444466' : '#9999cc') : '#7d3c98'}`,
              borderRadius: 8,
              color: launched ? c.muted : '#fff',
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
