// Overlay de exercícios interativos. Aparece sobre a cena 3D quando o aluno
// entra pela porta do "espaço de exercícios" dentro de uma sala.

import { useEffect, useState } from 'react';
import type { Exercicio } from './exercicios';

interface Props {
  exercicios: Exercicio[];
  onSetControl: (id: string, value: number) => void;
  onClose: () => void;
}

interface Result {
  correct: boolean;
  messages: string[];
}

const overlay: React.CSSProperties = {
  position: 'fixed', inset: 0,
  background: 'rgba(5,5,15,0.82)',
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  zIndex: 300,
};

const card: React.CSSProperties = {
  background: 'var(--bg-surface)',
  border: '1px solid var(--border)',
  borderRadius: 12,
  padding: '28px 32px',
  maxWidth: 540,
  width: '90vw',
  maxHeight: '90vh',
  overflowY: 'auto',
  position: 'relative',
  color: 'var(--text)',
  fontFamily: "'Inter', system-ui, sans-serif",
};

const closeBtn: React.CSSProperties = {
  position: 'absolute', top: 12, right: 14,
  background: 'none', border: 'none',
  color: 'var(--text-muted)', fontSize: 20, cursor: 'pointer',
};

const dot = (active: boolean): React.CSSProperties => ({
  width: 10, height: 10, borderRadius: '50%',
  background: active ? 'var(--primary)' : 'var(--border)',
  display: 'inline-block', margin: '0 4px',
  cursor: 'pointer',
});

const label: React.CSSProperties = {
  display: 'block', marginBottom: 6,
  fontSize: 14, color: 'var(--text-muted)',
};

const inputStyle: React.CSSProperties = {
  background: 'var(--bg-surface2)',
  border: '1px solid var(--border)',
  borderRadius: 6, padding: '7px 10px',
  color: 'var(--text)', fontSize: 15,
  width: 120, marginRight: 8,
};

const unitStyle: React.CSSProperties = {
  fontSize: 13, color: 'var(--text-muted)',
};

const btnPrimary: React.CSSProperties = {
  background: 'var(--primary)', color: 'var(--primary-fg)',
  border: 'none', borderRadius: 7,
  padding: '9px 22px', fontSize: 15, cursor: 'pointer',
  marginTop: 16,
};

const btnSecondary: React.CSSProperties = {
  background: 'var(--bg-surface2)', color: 'var(--text)',
  border: '1px solid var(--border)', borderRadius: 7,
  padding: '9px 22px', fontSize: 15, cursor: 'pointer',
  marginTop: 16, marginLeft: 10,
};

export default function ExerciseOverlay({ exercicios, onSetControl, onClose }: Props) {
  const [current, setCurrent] = useState(0);
  const [inputs, setInputs] = useState<Record<string, string>>({});
  const [result, setResult] = useState<Result | null>(null);
  const [showHint, setShowHint] = useState(false);

  const ex = exercicios[current];

  // Esc fecha o overlay sem propagar para os handlers do jogo (que pausariam).
  // Space = ação principal (Verificar / Próximo), igual ao "E" do FPS.
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.code === 'Escape') {
        e.stopImmediatePropagation();
        onClose();
      }
      if (e.code === 'Space' && !(e.target instanceof HTMLInputElement)) {
        e.preventDefault();
        e.stopImmediatePropagation();
        // aciona o botão primário: verificar ou próximo
        document.getElementById('ex-primary-btn')?.click();
      }
    }
    document.addEventListener('keydown', onKey, true); // capture phase: dispara antes dos handlers do jogo
    return () => document.removeEventListener('keydown', onKey, true);
  }, [onClose]);

  useEffect(() => {
    setInputs({});
    setResult(null);
    setShowHint(false);
    if (ex.preControls) {
      for (const [id, val] of Object.entries(ex.preControls)) {
        onSetControl(id, val);
      }
    }
  }, [current]); // eslint-disable-line react-hooks/exhaustive-deps

  function verify() {
    const answers: Record<string, number> = {};
    for (const inp of ex.inputs) {
      const v = parseFloat((inputs[inp.id] ?? '').replace(',', '.'));
      if (isNaN(v)) {
        setResult({ correct: false, messages: ['Preencha todos os campos com números.'] });
        return;
      }
      answers[inp.id] = v;
    }

    const messages: string[] = [];
    let allCorrect = true;

    for (const inp of ex.inputs) {
      const val = answers[inp.id];
      const corr = ex.gabarito[inp.id];
      const tol = ex.tolerancia[inp.id];
      const ok = Math.abs(val - corr) <= tol;
      if (!ok) allCorrect = false;
      messages.push(`${inp.label}: ${ok ? '✓ correto' : `✗ esperado ≈ ${corr.toFixed(2)} ${inp.unit}`}`);
    }

    if (ex.applyControls) {
      for (const [id, val] of Object.entries(ex.applyControls(answers))) {
        onSetControl(id, val);
      }
    }

    setResult({ correct: allCorrect, messages });
  }

  function next() {
    if (current < exercicios.length - 1) setCurrent(current + 1);
    else onClose();
  }

  if (exercicios.length === 0) {
    return (
      <div style={overlay}>
        <div style={card}>
          <button style={closeBtn} onClick={onClose}>✕</button>
          <p style={{ color: 'var(--text-muted)' }}>Nenhum exercício disponível para esta sala.</p>
        </div>
      </div>
    );
  }

  return (
    <div style={overlay}>
      <div style={card}>
        <button style={closeBtn} onClick={onClose} title="Fechar">✕</button>

        {/* Título e navegação */}
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 11, letterSpacing: 1, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 6 }}>
            Espaço de exercícios
          </div>
          <h2 style={{ fontSize: 18, marginBottom: 8 }}>{ex.titulo}</h2>
          {exercicios.length > 1 && (
            <div>
              {exercicios.map((_, i) => (
                <span
                  key={i}
                  style={dot(i === current)}
                  onClick={() => { if (!result) setCurrent(i); }}
                />
              ))}
            </div>
          )}
        </div>

        {/* Enunciado */}
        <p style={{ fontSize: 15, lineHeight: 1.55, marginBottom: 10 }}>{ex.enunciado}</p>
        <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 20 }}>{ex.dado}</p>

        {/* Campos de entrada */}
        {!result && (
          <div>
            {ex.inputs.map((inp) => (
              <div key={inp.id} style={{ marginBottom: 14 }}>
                <label style={label}>{inp.label}</label>
                <input
                  type="number"
                  style={inputStyle}
                  placeholder="0,00"
                  value={inputs[inp.id] ?? ''}
                  onChange={(e) => setInputs({ ...inputs, [inp.id]: e.target.value })}
                  onKeyDown={(e) => { if (e.key === 'Enter') verify(); }}
                />
                <span style={unitStyle}>{inp.unit}</span>
              </div>
            ))}

            {/* Dica */}
            {showHint && (
              <div style={{ background: 'var(--bg-surface2)', border: '1px solid var(--border)', borderRadius: 7, padding: '10px 14px', marginBottom: 14, fontSize: 14 }}>
                💡 {ex.dica}
              </div>
            )}

            <div>
              <button id="ex-primary-btn" style={btnPrimary} onClick={verify}>Verificar</button>
              <button style={btnSecondary} onClick={() => setShowHint(!showHint)}>
                {showHint ? 'Ocultar dica' : 'Dica'}
              </button>
            </div>
          </div>
        )}

        {/* Resultado */}
        {result && (
          <div>
            <div
              style={{
                borderRadius: 8, padding: '14px 18px', marginBottom: 16,
                background: result.correct ? 'rgba(39,174,96,0.15)' : 'rgba(192,57,43,0.15)',
                border: `1px solid ${result.correct ? '#27ae60' : '#c0392b'}`,
              }}
            >
              <div style={{ fontWeight: 600, marginBottom: 8, fontSize: 16 }}>
                {result.correct ? '✓ Resposta correta!' : '✗ Resposta incorreta'}
              </div>
              {result.messages.map((m, i) => (
                <div key={i} style={{ fontSize: 14, marginBottom: 3 }}>{m}</div>
              ))}
              {!result.correct && ex.applyControls && (
                <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 10 }}>
                  A cena agora mostra o resultado com a sua resposta. Compare com o esperado.
                </div>
              )}
            </div>

            <div style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 14 }}>
              💡 {ex.dica}
            </div>

            <div>
              <button id="ex-primary-btn" style={btnPrimary} onClick={next}>
                {current < exercicios.length - 1 ? 'Próximo exercício →' : 'Fechar'}
              </button>
              <button style={btnSecondary} onClick={() => setResult(null)}>
                Tentar novamente
              </button>
            </div>
          </div>
        )}
        {/* Dica de teclado */}
        <div style={{ marginTop: 20, paddingTop: 12, borderTop: '1px solid var(--border)', fontSize: 12, color: 'var(--text-faint)', display: 'flex', gap: 16 }}>
          <span><kbd style={{ background: 'var(--bg-surface2)', border: '1px solid var(--border)', borderRadius: 3, padding: '1px 5px' }}>Space</kbd> ação principal</span>
          <span><kbd style={{ background: 'var(--bg-surface2)', border: '1px solid var(--border)', borderRadius: 3, padding: '1px 5px' }}>Esc</kbd> fechar</span>
        </div>
      </div>
    </div>
  );
}
