import { useEffect, useRef, useState } from 'react';
import { createARDnaScene, type ARDnaScene } from './scene';

const MIN_BP = 6;
const MAX_BP = 30;

interface Props {
  onBack: () => void;
}

export default function ARDnaHelixSimulation({ onBack }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const arBtnRef     = useRef<HTMLDivElement>(null);
  const sceneRef     = useRef<ARDnaScene | null>(null);
  const [basePairs, setBasePairs] = useState(16);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const s = createARDnaScene(container);
    sceneRef.current = s;

    const btn = s.arButton as HTMLElement;
    btn.style.position  = 'relative';
    btn.style.left      = 'unset';
    btn.style.bottom    = 'unset';
    btn.style.right     = 'unset';
    btn.style.transform = 'none';
    arBtnRef.current?.appendChild(btn);

    s.onBasePairsChange = (n) => setBasePairs(n);

    return () => {
      s.dispose();
      sceneRef.current = null;
    };
  }, []);

  function handleBPChange(n: number) {
    setBasePairs(n);
    sceneRef.current?.setBasePairs(n);
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: '#020d06', color: '#e0e0f0', fontFamily: 'Inter, sans-serif' }}>

      <div ref={containerRef} style={{ flex: 1, position: 'relative', minHeight: 0 }}>

        <button
          onClick={onBack}
          style={{
            position: 'absolute', top: 16, right: 20,
            background: 'rgba(2,13,6,0.75)', border: '1px solid #1a3322',
            borderRadius: 8, color: '#aaa', fontSize: 13,
            padding: '6px 14px', cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: 6,
            backdropFilter: 'blur(4px)', zIndex: 10,
          }}
        >
          ← Voltar
        </button>

        {/* Badge AR */}
        <div style={{
          position: 'absolute', top: 16, left: '50%', transform: 'translateX(-50%)',
          background: 'rgba(46,204,113,0.15)', border: '1px solid #2ecc71',
          borderRadius: 6, padding: '4px 12px', fontSize: 11,
          letterSpacing: '0.15em', color: '#2ecc71', zIndex: 10,
          fontFamily: "'JetBrains Mono', monospace",
        }}>
          WebXR AR · Dupla Hélice de DNA
        </div>

        {/* Info */}
        <div style={{ position: 'absolute', top: 16, left: 20, pointerEvents: 'none', zIndex: 10 }}>
          <span style={{ fontSize: 36, fontWeight: 700, color: '#2ecc71', lineHeight: 1 }}>DNA</span>
          <div style={{ fontSize: 14, color: '#aaa', marginTop: 4 }}>
            Dupla Hélice · {basePairs} pares de base
          </div>
        </div>

        {/* Dica */}
        <div style={{
          position: 'absolute', bottom: 16, left: '50%', transform: 'translateX(-50%)',
          background: 'rgba(2,13,6,0.75)', border: '1px solid #1a3322',
          borderRadius: 8, padding: '8px 18px', fontSize: 12, color: '#446644',
          backdropFilter: 'blur(4px)', zIndex: 10, textAlign: 'center',
          pointerEvents: 'none', whiteSpace: 'nowrap',
        }}>
          A hélice aparece 1,5 m à sua frente · Caminhe ao redor para explorar
        </div>
      </div>

      {/* Painel de controles */}
      <div style={{
        padding: '14px 24px', background: '#040f06',
        borderTop: '1px solid #0d2212',
        display: 'flex', flexWrap: 'wrap', gap: 20, alignItems: 'center',
      }}>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <label style={{ fontSize: 11, color: '#335533', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
            Pares de Base: {basePairs}
          </label>
          <input
            type="range" min={MIN_BP} max={MAX_BP} step={2} value={basePairs}
            onChange={(e) => handleBPChange(Number(e.target.value))}
            style={{ width: 180, cursor: 'pointer' }}
          />
        </div>

        <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
          {[
            { color: '#e74c3c', label: 'Fita 1'  },
            { color: '#3498db', label: 'Fita 2'  },
            { color: '#f39c12', label: 'Par A-T' },
            { color: '#2ecc71', label: 'Par G-C' },
          ].map(({ color, label }) => (
            <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13 }}>
              <div style={{ width: 10, height: 10, borderRadius: '50%', background: color }} />
              <span style={{ color: '#446644' }}>{label}</span>
            </div>
          ))}
        </div>

        <div ref={arBtnRef} style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center' }} />
      </div>
    </div>
  );
}
