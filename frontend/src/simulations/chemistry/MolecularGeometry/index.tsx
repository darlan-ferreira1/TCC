import { useEffect, useRef, useState } from 'react';
import { createMolScene, type MolScene } from './scene';
import { MOLECULES, type MoleculeDefinition } from './physics';

interface Props { onBack: () => void; }

export default function MolecularGeometrySimulation({ onBack }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sceneRef  = useRef<MolScene | null>(null);

  const [selectedId, setSelectedId] = useState(MOLECULES[0].id);
  const mol = MOLECULES.find((m) => m.id === selectedId) ?? MOLECULES[0];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    sceneRef.current = createMolScene(canvas, { molecule: MOLECULES[0] });
    return () => { sceneRef.current?.dispose(); sceneRef.current = null; };
  }, []);

  function handleSelect(mol: MoleculeDefinition) {
    setSelectedId(mol.id);
    sceneRef.current?.update({ molecule: mol });
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

        {/* Overlay: fórmula + geometria */}
        <div style={{ position: 'absolute', top: 16, left: 20, pointerEvents: 'none' }}>
          <span style={{ fontSize: 42, fontWeight: 700, color: '#3498db', lineHeight: 1 }}>
            {mol.formula}
          </span>
          <div style={{ fontSize: 14, color: '#aaa', marginTop: 4 }}>
            {mol.name} · {mol.geometryName}
          </div>
        </div>
      </div>

      {/* Painel de controles */}
      <div style={{
        padding: '16px 24px', background: '#111130', borderTop: '1px solid #222244',
        display: 'flex', flexWrap: 'wrap', gap: 24, alignItems: 'flex-start',
      }}>
        {/* Seletor de molécula */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <label style={{ fontSize: 12, color: '#888', letterSpacing: 1 }}>MOLÉCULA</label>
          <select
            value={selectedId}
            onChange={(e) => {
              const found = MOLECULES.find((m) => m.id === e.target.value);
              if (found) handleSelect(found);
            }}
            style={{
              background: '#1a1a3a', color: '#e0e0f0',
              border: '1px solid #333366', borderRadius: 6,
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

        {/* Info da geometria */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4, fontSize: 13 }}>
          <div>
            <span style={{ color: '#888', fontSize: 11, letterSpacing: 1 }}>GEOMETRIA</span>
            <div style={{ color: '#3498db', fontWeight: 600, marginTop: 2 }}>{mol.geometryName}</div>
          </div>
          <div>
            <span style={{ color: '#888', fontSize: 11, letterSpacing: 1 }}>ÂNGULO DE LIGAÇÃO</span>
            <div style={{ color: '#e0e0f0', fontWeight: 600, marginTop: 2 }}>{mol.bondAngleDeg}°</div>
          </div>
          <div>
            <span style={{ color: '#888', fontSize: 11, letterSpacing: 1 }}>PARES SOLITÁRIOS</span>
            <div style={{ color: '#e0e0f0', fontWeight: 600, marginTop: 2 }}>{mol.lonePairs}</div>
          </div>
        </div>

        {/* Nota explicativa */}
        <div style={{
          flex: 1, minWidth: 220, fontSize: 12, color: '#666',
          lineHeight: 1.6, padding: '4px 0',
          borderLeft: '1px solid #222244', paddingLeft: 20,
        }}>
          {mol.note}
        </div>

        {/* Legenda CPK */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 12, marginLeft: 'auto' }}>
          <span style={{ color: '#888', fontSize: 11, letterSpacing: 1 }}>LEGENDA</span>
          {[mol.centerAtom, mol.ligandAtom].map((atom) => (
            <div key={atom.element} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{
                width: 12, height: 12, borderRadius: '50%',
                background: `#${atom.color.toString(16).padStart(6, '0')}`,
              }} />
              <span style={{ color: '#aaa' }}>{atom.element}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
