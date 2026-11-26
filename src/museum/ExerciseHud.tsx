import type { ExercicioInterativo } from './exerciciosInterativos';

interface Props {
  exercicio: ExercicioInterativo;
  qNum: number;    // 1-based, ex.: 1
  qTotal: number;  // total de questões do experimento
  completed: boolean;
  successToast: string | null;
  onDica: () => void;
  onNext: () => void;   // "Próxima →" ou "Concluído ✓" (após completar)
  onClose: () => void;  // "Sair" (descarta o HUD sem navegar)
}

export default function ExerciseHud({
  exercicio, qNum, qTotal, completed, successToast,
  onDica, onNext, onClose,
}: Props) {
  const isLast = qNum === qTotal;

  return (
    <>
      <div style={{
        position: 'absolute',
        top: 0, left: 0, right: 0,
        height: 48,
        background: 'rgba(10,10,26,0.9)',
        borderBottom: '1px solid rgba(255,255,255,0.12)',
        display: 'flex', alignItems: 'center', gap: 10,
        padding: '0 14px',
        fontFamily: 'Inter, sans-serif',
        zIndex: 25,
        boxSizing: 'border-box',
      }}>
        {/* Badge Q{n}/{total} */}
        <span style={{
          flexShrink: 0,
          fontSize: 11, fontWeight: 700, letterSpacing: '0.08em',
          color: completed ? '#7dff9e' : '#e0e0f0',
          background: 'rgba(255,255,255,0.08)',
          borderRadius: 4, padding: '2px 7px',
          border: `1px solid ${completed ? '#27ae60' : 'rgba(255,255,255,0.15)'}`,
        }}>
          Q{qNum}/{qTotal}
        </span>

        {/* Título */}
        <span style={{
          flex: 1,
          fontSize: 13, color: '#e0e0f0', fontWeight: 600,
          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
        }}>
          {exercicio.titulo}
        </span>

        {/* Botões */}
        <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
          {exercicio.dica && <Btn onClick={onDica}>Dica</Btn>}
          {completed
            ? <Btn primary onClick={onNext}>
                {isLast ? 'Concluído ✓' : 'Próxima →'}
              </Btn>
            : <Btn onClick={onClose}>Sair</Btn>
          }
        </div>
      </div>

      {/* Toast de sucesso */}
      {successToast && (
        <div style={{
          position: 'absolute', top: 56, left: '50%', transform: 'translateX(-50%)',
          background: '#0f2f0f', border: '1px solid #27ae60', borderRadius: 10,
          padding: '10px 18px', color: '#7dff9e', fontSize: 14, fontWeight: 600,
          zIndex: 25, maxWidth: 'calc(100vw - 32px)', textAlign: 'center',
          boxShadow: '0 4px 20px rgba(0,0,0,0.5)', pointerEvents: 'none',
          whiteSpace: 'pre-wrap',
        }}>
          ✓ {successToast}
        </div>
      )}
    </>
  );
}

function Btn({ children, onClick, primary }: { children: React.ReactNode; onClick: () => void; primary?: boolean }) {
  return (
    <button
      onClick={onClick}
      style={{
        background: primary ? 'var(--primary)' : 'rgba(255,255,255,0.1)',
        color: primary ? 'var(--primary-fg)' : '#e0e0f0',
        border: primary ? 'none' : '1px solid rgba(255,255,255,0.2)',
        borderRadius: 6, padding: '4px 10px', fontSize: 12, fontWeight: 600,
        cursor: 'pointer', whiteSpace: 'nowrap', fontFamily: 'inherit',
      }}
    >
      {children}
    </button>
  );
}
