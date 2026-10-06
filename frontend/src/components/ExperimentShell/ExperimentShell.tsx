// Moldura comum a todos os experimentos.
//
// Envolve o componente do experimento (que continua ocupando a tela inteira) e
// sobrepõe a ele, em posição fixa no canto superior direito:
//   [Teoria] [Como foi feito] [← Voltar]
//
// Os dois primeiros abrem um painel com o conteúdo em Markdown da pasta do
// experimento (ver `folder`/`theoryFolder` em registry.ts):
//   teoria.md  → aba "Teoria"          (texto para o aluno)
//   README.md  → aba "Como foi feito"  (documentação técnica)
//
// Desktop: painel lateral à direita, sem fundo escurecido — a simulação continua
// visível e interativa enquanto o aluno lê.
// Mobile (< 640 px): os botões viram só ícones e o painel vira uma "bottom sheet"
// com fundo escurecido (não há espaço para ler e interagir ao mesmo tempo).
// O layout responsivo fica em ExperimentShell.css.
//
// Os .md são carregados sob demanda (import.meta.glob sem `eager`): cada arquivo
// vira um chunk separado e só é baixado quando o aluno abre a aba.

import { useEffect, useState, type ReactNode } from 'react';
import { marked } from 'marked';
import type { SimulationMeta } from '../../simulations/registry';
import './ExperimentShell.css';

type Tab = 'theory' | 'howto';

const TAB_LABEL: Record<Tab, string> = {
  theory: 'Teoria',
  howto: 'Como foi feito',
};

const MARKDOWN_FILES = import.meta.glob('../../simulations/**/{teoria,README}.md', {
  query: '?raw',
  import: 'default',
}) as Record<string, () => Promise<string>>;

const htmlCache = new Map<string, string>();

function markdownPath(meta: SimulationMeta | undefined, tab: Tab): string | null {
  if (!meta?.folder) return null;
  const folder = tab === 'theory' ? (meta.theoryFolder ?? meta.folder) : meta.folder;
  const file = tab === 'theory' ? 'teoria.md' : 'README.md';
  return `../../simulations/${folder}/${file}`;
}

interface Props {
  meta: SimulationMeta | undefined;
  onBack: () => void;
  children: ReactNode;
}

export default function ExperimentShell({ meta, onBack, children }: Props) {
  const [openTab, setOpenTab] = useState<Tab | null>(null);

  function toggle(tab: Tab) {
    setOpenTab((current) => (current === tab ? null : tab));
  }

  useEffect(() => {
    if (!openTab) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpenTab(null); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [openTab]);

  return (
    <>
      {children}

      <div className="shell-toolbar">
        <ToolbarButton label="Teoria" active={openTab === 'theory'} onClick={() => toggle('theory')}>
          <BookIcon />
        </ToolbarButton>
        <ToolbarButton label="Como foi feito" active={openTab === 'howto'} onClick={() => toggle('howto')}>
          <CodeIcon />
        </ToolbarButton>
        <ToolbarButton label="Voltar" onClick={onBack}>
          <ArrowIcon />
        </ToolbarButton>
      </div>

      {openTab && (
        <>
          <div className="shell-backdrop" onClick={() => setOpenTab(null)} />
          <aside className="shell-panel" role="dialog" aria-label={TAB_LABEL[openTab]}>
            <header className="shell-panel-header">
              <div className="shell-tabs" role="tablist">
                {(Object.keys(TAB_LABEL) as Tab[]).map((tab) => (
                  <button
                    key={tab}
                    role="tab"
                    aria-selected={openTab === tab}
                    className="shell-tab"
                    onClick={() => setOpenTab(tab)}
                  >
                    {TAB_LABEL[tab]}
                  </button>
                ))}
              </div>
              <button className="shell-close" aria-label="Fechar" onClick={() => setOpenTab(null)}>✕</button>
            </header>
            <MarkdownContent key={openTab} path={markdownPath(meta, openTab)} />
          </aside>
        </>
      )}
    </>
  );
}

function MarkdownContent({ path }: { path: string | null }) {
  const loader = path ? MARKDOWN_FILES[path] : undefined;
  const [html, setHtml] = useState<string | null>(() => (path ? htmlCache.get(path) ?? null : null));
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (!path || !loader || htmlCache.has(path)) return;
    let cancelled = false;
    loader()
      .then((md) => {
        // Conteúdo vem dos .md do próprio repositório, então é confiável para
        // ser injetado como HTML.
        const rendered = marked.parse(md, { async: false });
        htmlCache.set(path, rendered);
        if (!cancelled) setHtml(rendered);
      })
      .catch(() => { if (!cancelled) setFailed(true); });
    return () => { cancelled = true; };
  }, [path, loader]);

  if (!loader || failed) {
    return <div className="shell-panel-body shell-empty">Conteúdo ainda não escrito para este experimento.</div>;
  }
  if (html === null) {
    return <div className="shell-panel-body shell-empty">Carregando…</div>;
  }
  return <div className="shell-panel-body shell-md" dangerouslySetInnerHTML={{ __html: html }} />;
}

function ToolbarButton({ label, active, onClick, children }: {
  label: string;
  active?: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      className={`shell-btn${active ? ' shell-btn-active' : ''}`}
      onClick={onClick}
      title={label}
      aria-label={label}
      aria-pressed={active}
    >
      {children}
      <span className="shell-btn-label">{label}</span>
    </button>
  );
}

const iconProps = {
  width: 16, height: 16, viewBox: '0 0 24 24', fill: 'none',
  stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const,
  'aria-hidden': true,
};

function BookIcon() {
  return (
    <svg {...iconProps}>
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20V3H6.5A2.5 2.5 0 0 0 4 5.5v14z" />
      <path d="M4 19.5A2.5 2.5 0 0 0 6.5 22H20v-5" />
    </svg>
  );
}

function CodeIcon() {
  return (
    <svg {...iconProps}>
      <path d="M16 18l6-6-6-6" />
      <path d="M8 6l-6 6 6 6" />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg {...iconProps}>
      <path d="M19 12H5" />
      <path d="M12 19l-7-7 7-7" />
    </svg>
  );
}
