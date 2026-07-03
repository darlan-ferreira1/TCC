import { useEffect, useRef, useState } from 'react';
import { createMolScene, type MolScene } from './scene';
import { MOLECULES, type MoleculeDefinition } from './physics';

interface Props { onBack: () => void; theme: 'dark' | 'light'; }

export default function MolecularGeometrySimulation({ onBack, theme }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sceneRef  = useRef<MolScene | null>(null);

  const [selectedId, setSelectedId] = useState(MOLECULES[0].id);
  const mol = MOLECULES.find((m) => m.id === selectedId) ?? MOLECULES[0];

  const dark = theme === 'dark';
  const c = {
    bg:          dark ? '#0a0a1a'             : '#f0f0f8',
    text:        dark ? '#e0e0f0'             : '#1a1a2e',
    muted:       dark ? '#aaa'                : '#555',
    label:       dark ? '#888'                : '#666',
    faint:       dark ? '#666'                : '#999',
    panelBg:     dark ? '#111130'             : '#e0e0ef',
    panelBorder: dark ? '#222244'             : '#c0c0d8',
    btnBg:       dark ? 'rgba(17,17,48,0.8)' : 'rgba(240,240,250,0.85)',
    btnBorder:   dark ? '#333366'             : '#9999cc',
    inputBg:     dark ? '#1a1a3a'             : '#f8f8ff',
    inputBorder: dark ? '#333366'             : '#9999cc',
    sceneBg:     dark ? 0x0a0a1a             : 0xf0f0f8,
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    sceneRef.current = createMolScene(canvas, { molecule: mol }, c.sceneBg);
    return () => { sceneRef.current?.dispose(); sceneRef.current = null; };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [theme]);

  function handleSelect(mol: MoleculeDefinition) {
    setSelectedId(mol.id);
    sceneRef.current?.update({ molecule: mol });
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
          <span style={{ fontSize: 42, fontWeight: 700, color: '#3498db', lineHeight: 1 }}>
            {mol.formula}
          </span>
          <div style={{ fontSize: 14, color: c.muted, marginTop: 4 }}>
            {mol.name} · {mol.geometryName}
          </div>
        </div>
      </div>

      <div style={{
        padding: '16px 24px', background: c.panelBg, borderTop: `1px solid ${c.panelBorder}`,
        display: 'flex', flexWrap: 'wrap', gap: 24, alignItems: 'flex-start',
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <label style={{ fontSize: 12, color: c.label, letterSpacing: 1 }}>MOLÉCULA</label>
          <select
            value={selectedId}
            onChange={(e) => {
              const found = MOLECULES.find((m) => m.id === e.target.value);
              if (found) handleSelect(found);
            }}
            style={{
              background: c.inputBg, color: c.text,
              border: `1px solid ${c.inputBorder}`, borderRadius: 6,
              padding: '6px 10px', fontSize: 14, cursor: 'pointer',
            }}
          >
            {MOLECULES.map((m) => (
              <option key={m.id} value={m.id}>
                {m.formula} — {m.name}
              </option>
            ))}
          </select>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 4, fontSize: 13 }}>
          <div>
            <span style={{ color: c.label, fontSize: 11, letterSpacing: 1 }}>GEOMETRIA</span>
            <div style={{ color: '#3498db', fontWeight: 600, marginTop: 2 }}>{mol.geometryName}</div>
          </div>
          <div>
            <span style={{ color: c.label, fontSize: 11, letterSpacing: 1 }}>ÂNGULO DE LIGAÇÃO</span>
            <div style={{ color: c.text, fontWeight: 600, marginTop: 2 }}>{mol.bondAngleDeg}°</div>
          </div>
          <div>
            <span style={{ color: c.label, fontSize: 11, letterSpacing: 1 }}>PARES SOLITÁRIOS</span>
            <div style={{ color: c.text, fontWeight: 600, marginTop: 2 }}>{mol.lonePairs}</div>
          </div>
        </div>

        <div style={{
          flex: 1, minWidth: 220, fontSize: 12, color: c.faint,
          lineHeight: 1.6, padding: '4px 0',
          borderLeft: `1px solid ${c.panelBorder}`, paddingLeft: 20,
        }}>
          {mol.note}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 12, marginLeft: 'auto' }}>
          <span style={{ color: c.label, fontSize: 11, letterSpacing: 1 }}>LEGENDA</span>
          {[mol.centerAtom, mol.ligandAtom].map((atom) => (
            <div key={atom.element} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{
                width: 12, height: 12, borderRadius: '50%',
                background: `#${atom.color.toString(16).padStart(6, '0')}`,
              }} />
              <span style={{ color: c.muted }}>{atom.element}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
