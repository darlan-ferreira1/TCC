// Pop-up de texto do Museu Virtual (ícones "i", quadros e pedestais).
// O texto vem em páginas: setas ◀ ▶ (ou ← →, ou o D-pad do controle) passam
// as páginas sem sair do museu.

import type { InfoContent } from './info';

interface Props {
  content: InfoContent;
  page: number;
  compact: boolean; // celular: ocupa a largura toda, embaixo
  hint?: string;
  onPage: (page: number) => void;
  onClose: () => void;
}

const arrowStyle = {
  width: 40, height: 40, borderRadius: 8, border: '1px solid var(--border)',
  background: 'var(--bg)', color: 'var(--text)', fontSize: 16, cursor: 'pointer',
} as const;

export default function InfoPopup({ content, page, compact, hint, onPage, onClose }: Props) {
  const total = content.pages.length;
  const current = content.pages[Math.min(page, total - 1)];
  return (
    <div
      role="dialog"
      aria-label={content.title}
      style={{
        position: 'absolute', zIndex: 25,
        ...(compact
          ? { left: 0, right: 0, bottom: 0, borderRadius: '16px 16px 0 0', paddingBottom: 'calc(16px + env(safe-area-inset-bottom, 0px))' }
          : { left: '50%', top: '50%', transform: 'translate(-50%, -50%)', width: 'min(560px, calc(100vw - 32px))', borderRadius: 14 }),
        background: 'var(--bg-surface)', color: 'var(--text)', border: '1px solid var(--border)',
        boxShadow: '0 12px 40px rgba(0,0,0,0.45)', padding: '18px 22px',
        display: 'flex', flexDirection: 'column', gap: 12, fontFamily: 'Inter, sans-serif',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 11, letterSpacing: '0.12em', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
            {content.title}
          </div>
          {current.heading && <div style={{ fontSize: 18, fontWeight: 700, marginTop: 2 }}>{current.heading}</div>}
        </div>
        <button onClick={onClose} aria-label="Fechar" style={{ ...arrowStyle, width: 34, height: 34 }}>✕</button>
      </div>

      <p style={{ margin: 0, fontSize: 15, lineHeight: 1.6, minHeight: compact ? 0 : 110, whiteSpace: 'pre-line' }}>
        {current.text}
      </p>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <button onClick={() => onPage(page - 1)} disabled={page === 0} aria-label="Página anterior"
          style={{ ...arrowStyle, opacity: page === 0 ? 0.35 : 1 }}>◀</button>
        <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>{page + 1} / {total}</span>
        <button onClick={() => onPage(page + 1)} disabled={page >= total - 1} aria-label="Próxima página"
          style={{ ...arrowStyle, opacity: page >= total - 1 ? 0.35 : 1 }}>▶</button>
      </div>
      {hint && <div style={{ fontSize: 12, color: 'var(--text-muted)', textAlign: 'center' }}>{hint}</div>}
    </div>
  );
}
