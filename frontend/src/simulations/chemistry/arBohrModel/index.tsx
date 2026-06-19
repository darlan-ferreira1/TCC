import { useEffect, useRef, useState } from 'react';
import { createARBohrScene, AR_ELEMENTS, type ARBohrScene } from './scene';

interface Props {
  onBack: () => void;
}

export default function ARBohrModelSimulation({ onBack }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const arBtnRef     = useRef<HTMLDivElement>(null);
  const sceneRef     = useRef<ARBohrScene | null>(null);
  const [elemIndex, setElemIndex] = useState(5);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const s = createARBohrScene(container);
    sceneRef.current = s;

    const btn = s.arButton as HTMLElement;
    btn.style.position  = 'relative';
    btn.style.left      = 'unset';
    btn.style.bottom    = 'unset';
    btn.style.right     = 'unset';
    btn.style.transform = 'none';
    arBtnRef.current?.appendChild(btn);

    s.onElementChange = (idx) => setElemIndex(idx);

    return () => {
      s.dispose();
      sceneRef.current = null;
    };
  }, []);

  function handleElementChange(idx: number) {
    setElemIndex(idx);
    sceneRef.current?.setElement(idx);
  }

  const [sym, name, Z, N] = AR_ELEMENTS[elemIndex];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: '#0a0a1a', color: '#e0e0f0', fontFamily: 'Inter, sans-serif' }}>

      {/* Canvas AR — ocupa todo o espaço disponível */}
      <div ref={containerRef} style={{ flex: 1, position: 'relative', minHeight: 0 }}>

        <button
          onClick={onBack}
          style={{
            position: 'absolute', top: 16, right: 20,
            background: 'rgba(5,5,20,0.75)', border: '1px solid #333366',
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
          background: 'rgba(52,152,219,0.15)', border: '1px solid #3498db',
          borderRadius: 6, padding: '4px 12px', fontSize: 11,
          letterSpacing: '0.15em', color: '#3498db', zIndex: 10,
          fontFamily: "'JetBrains Mono', monospace",
        }}>
          WebXR AR · Modelo de Bohr
        </div>

        {/* Elemento atual */}
        <div style={{ position: 'absolute', top: 16, left: 20, pointerEvents: 'none', zIndex: 10 }}>
          <span style={{ fontSize: 48, fontWeight: 700, color: '#3498db', lineHeight: 1 }}>{sym}</span>
          <div style={{ fontSize: 14, color: '#aaa', marginTop: 2 }}>
            {name} · Z={Z} · A={Z + N}
          </div>
        </div>

        {/* Dica AR */}
        <div style={{
          position: 'absolute', bottom: 16, left: '50%', transform: 'translateX(-50%)',
          background: 'rgba(5,5,20,0.75)', border: '1px solid #222244',
          borderRadius: 8, padding: '8px 18px', fontSize: 12, color: '#445566',
          backdropFilter: 'blur(4px)', zIndex: 10, textAlign: 'center',
          pointerEvents: 'none', whiteSpace: 'nowrap',
        }}>
          O átomo aparece 1,5 m à sua frente · Aproxime-se para explorar
        </div>
      </div>

      {/* Painel de controles */}
      <div style={{
        padding: '14px 24px', background: '#0a0a20',
        borderTop: '1px solid #1a1a44',
        display: 'flex', flexWrap: 'wrap', gap: 20, alignItems: 'center',
      }}>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <label style={{ fontSize: 11, color: '#446', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
            Elemento
          </label>
          <select
            value={elemIndex}
            onChange={(e) => handleElementChange(Number(e.target.value))}
            style={{
              background: '#111130', color: '#e0e0f0',
              border: '1px solid #2a2a55', borderRadius: 6,
              padding: '6px 10px', fontSize: 14, cursor: 'pointer',
            }}
          >
            {AR_ELEMENTS.map(([s, n, p], i) => (
              <option key={s} value={i}>{s} — {n} (Z={p})</option>
            ))}
          </select>
        </div>

        <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
          {[
            { color: '#e74c3c', label: 'Próton'  },
            { color: '#95a5a6', label: 'Nêutron' },
            { color: '#3498db', label: 'Elétron' },
          ].map(({ color, label }) => (
            <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13 }}>
              <div style={{ width: 10, height: 10, borderRadius: '50%', background: color }} />
              <span style={{ color: '#556' }}>{label}</span>
            </div>
          ))}
        </div>

        {/* Botão AR */}
        <div ref={arBtnRef} style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center' }} />
      </div>
    </div>
  );
}
