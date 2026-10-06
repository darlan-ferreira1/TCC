// Página genérica de experimento em realidade aumentada.
//
// Recebe uma ARDefinition (o `ar.ts` do experimento) e cuida de tudo:
//   - prévia 3D no navegador (com o painel de ajustes ⚙);
//   - botão "Iniciar AR" (ou aviso, se o aparelho não suporta);
//   - durante a sessão: a sobreposição HTML (dom-overlay) com as instruções,
//     a camada que captura os gestos e os botões Reposicionar / ⚙ / Sair.

import { useEffect, useRef, useState, type PointerEvent } from 'react';
import { defaultValues, type ControlValue, type ControlValues } from '../core/controls';
import ControlsHud from '../components/ControlsHud/ControlsHud';
import { hostInAR, isARSupported, type ARHost, type ARState } from './scene';
import type { ARDefinition } from './definition';
import type { Point } from './gestures';

interface Props {
  def: ARDefinition;
  title: string;
}

const STATUS: Record<Exclude<ARState, 'preview'>, string> = {
  searching: 'Mova o celular devagar, apontando para o chão ou uma mesa',
  ready: 'Toque na tela para posicionar',
  placed: 'Arraste para mover · pinça para redimensionar · gire com dois dedos',
};

const IS_SMALL = typeof window !== 'undefined' && window.matchMedia('(max-width: 640px)').matches;

export default function ARExperiment({ def, title }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const uiRef = useRef<HTMLDivElement>(null);
  const gestureRef = useRef<HTMLDivElement>(null);
  const hostRef = useRef<ARHost<unknown> | null>(null);
  const pointers = useRef(new Map<number, Point>());

  const [supported, setSupported] = useState<boolean | null>(null);
  const [state, setState] = useState<ARState>('preview');
  const [scale, setScale] = useState(1);
  const [values, setValues] = useState<ControlValues>(() => defaultValues(def.controls));
  const [hudOpen, setHudOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inSession = state !== 'preview';

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const host = hostInAR(container, def, def.toConfig(defaultValues(def.controls)));
    host.onStateChange = setState;
    host.onScaleChange = setScale;
    hostRef.current = host;
    let cancelled = false;
    isARSupported().then((ok) => { if (!cancelled) setSupported(ok); });
    return () => {
      cancelled = true;
      host.dispose();
      hostRef.current = null;
    };
  }, [def]);

  // Durante a sessão, um toque no HTML também gera o evento `select` do WebXR
  // (que posiciona o objeto). `beforexrselect` cancelado impede isso:
  //   - nos botões/painel: sempre (tocar num botão não deve posicionar nada);
  //   - na camada de gestos: só depois de posicionado (aí o toque é gesto).
  useEffect(() => {
    const ui = uiRef.current;
    const layer = gestureRef.current;
    const block = (e: Event) => e.preventDefault();
    const blockWhenPlaced = (e: Event) => { if (state === 'placed') e.preventDefault(); };
    ui?.addEventListener('beforexrselect', block);
    layer?.addEventListener('beforexrselect', blockWhenPlaced);
    return () => {
      ui?.removeEventListener('beforexrselect', block);
      layer?.removeEventListener('beforexrselect', blockWhenPlaced);
    };
  }, [state]);

  function changeControl(id: string, value: ControlValue) {
    const next = { ...values, [id]: value };
    setValues(next);
    hostRef.current?.update(def.toConfig(next));
  }

  async function start() {
    setError(null);
    setHudOpen(false);
    try {
      await hostRef.current?.startSession(overlayRef.current!);
    } catch {
      setError('Não foi possível iniciar o AR. É preciso um celular Android com Google Play Services para AR (ARCore) e o Chrome.');
    }
  }

  // ── Gestos (camada transparente sobre a câmera) ──
  function pointList(): Point[] {
    return [...pointers.current.values()];
  }
  function onDown(e: PointerEvent<HTMLDivElement>) {
    if (state !== 'placed') return;
    e.currentTarget.setPointerCapture(e.pointerId);
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    const pts = pointList();
    if (pts.length === 1) hostRef.current?.dragStart(pts[0]);
    else if (pts.length === 2) {
      hostRef.current?.dragEnd();
      hostRef.current?.pinchStart(pts[0], pts[1]);
    }
  }
  function onMove(e: PointerEvent<HTMLDivElement>) {
    if (!pointers.current.has(e.pointerId)) return;
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    const pts = pointList();
    if (pts.length === 1) hostRef.current?.dragMove(pts[0]);
    else if (pts.length >= 2) hostRef.current?.pinchMove(pts[0], pts[1]);
  }
  function onUp(e: PointerEvent<HTMLDivElement>) {
    if (!pointers.current.delete(e.pointerId)) return;
    const pts = pointList();
    hostRef.current?.pinchEnd();
    hostRef.current?.dragEnd();
    // Sobrou um dedo depois da pinça: continua arrastando com ele.
    if (pts.length === 1) hostRef.current?.dragStart(pts[0]);
  }

  const pill = {
    background: 'rgba(10,10,26,0.8)', color: '#e0e0f0', borderRadius: 10,
    border: '1px solid rgba(255,255,255,0.2)', backdropFilter: 'blur(4px)',
  } as const;
  const button = {
    ...pill, padding: '10px 16px', fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit',
  } as const;

  return (
    <div style={{ position: 'relative', height: '100vh', overflow: 'hidden', background: '#0a0a1a', color: '#e0e0f0', fontFamily: 'Inter, sans-serif' }}>
      <div ref={containerRef} style={{ position: 'absolute', inset: 0 }} />

      {/* ── Prévia (fora da sessão AR) ── */}
      {!inSession && (
        <>
          <div style={{ position: 'absolute', top: 16, left: 20, pointerEvents: 'none' }}>
            <div style={{
              display: 'inline-block', fontSize: 11, letterSpacing: '0.15em', color: '#3498db',
              border: '1px solid #3498db', borderRadius: 6, padding: '2px 8px', marginBottom: 6,
              fontFamily: "'JetBrains Mono', monospace",
            }}>
              REALIDADE AUMENTADA
            </div>
            <div style={{ fontSize: 26, fontWeight: 700 }}>{title}</div>
          </div>

          <div style={{
            position: 'absolute', left: 0, right: 0, bottom: 'calc(20px + env(safe-area-inset-bottom, 0px))',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, padding: '0 16px',
          }}>
            {error && <div style={{ ...pill, padding: '8px 14px', fontSize: 13, maxWidth: 440, textAlign: 'center', borderColor: '#a04020' }}>{error}</div>}
            {supported === false && (
              <div style={{ ...pill, padding: '10px 16px', fontSize: 13, maxWidth: 460, textAlign: 'center', lineHeight: 1.5 }}>
                Este aparelho/navegador não suporta realidade aumentada pela web.
                Abra esta página no <strong>Chrome de um celular Android</strong> com ARCore.
                Enquanto isso, explore a prévia: arraste para girar e use os ajustes.
              </div>
            )}
            <div style={{ display: 'flex', gap: 10 }}>
              {supported && (
                <button onClick={start} style={{ ...button, background: '#3498db', borderColor: '#3498db', color: '#fff' }}>
                  Iniciar AR
                </button>
              )}
              <button onClick={() => setHudOpen((o) => !o)} style={button}>⚙ Ajustes</button>
            </div>
            {supported && (
              <div style={{ fontSize: 12, color: '#8888aa', textAlign: 'center' }}>
                Aponte para o chão ou uma mesa, toque para posicionar e ajuste com os dedos.
              </div>
            )}
          </div>

          {hudOpen && (
            <ControlsHud
              title={title}
              controls={def.controls}
              values={values}
              compact={IS_SMALL}
              onChange={changeControl}
              onClose={() => setHudOpen(false)}
              closeLabel="Fechar"
            />
          )}
        </>
      )}

      {/* ── Sobreposição da sessão AR (dom-overlay) ──
          Este elemento vira a camada HTML por cima da câmera durante a sessão. */}
      <div
        ref={overlayRef}
        style={{ position: 'fixed', inset: 0, display: inSession ? 'block' : 'none', fontFamily: 'Inter, sans-serif' }}
      >
        <div
          ref={gestureRef}
          onPointerDown={onDown}
          onPointerMove={onMove}
          onPointerUp={onUp}
          onPointerCancel={onUp}
          style={{ position: 'absolute', inset: 0, touchAction: 'none' }}
        />

        {inSession && (
          <div ref={uiRef}>
            <div style={{
              ...pill, position: 'absolute', top: 'calc(14px + env(safe-area-inset-top, 0px))',
              left: '50%', transform: 'translateX(-50%)', padding: '8px 14px', fontSize: 13,
              textAlign: 'center', width: 'max-content', maxWidth: 'calc(100vw - 32px)',
            }}>
              {STATUS[state as Exclude<ARState, 'preview'>]}
              {state === 'placed' && scale !== 1 && <span style={{ opacity: 0.7 }}> · {Math.round(scale * 100)}%</span>}
            </div>

            <div style={{
              position: 'absolute', left: 0, right: 0, bottom: 'calc(20px + env(safe-area-inset-bottom, 0px))',
              display: 'flex', justifyContent: 'center', gap: 10, padding: '0 12px',
            }}>
              {state === 'placed' && (
                <button onClick={() => hostRef.current?.reposition()} style={button}>↺ Reposicionar</button>
              )}
              <button onClick={() => setHudOpen((o) => !o)} style={button}>⚙ Ajustes</button>
              <button onClick={() => hostRef.current?.endSession()} style={button}>✕ Sair</button>
            </div>

            {hudOpen && (
              <ControlsHud
                title={title}
                controls={def.controls}
                values={values}
                compact
                onChange={changeControl}
                onClose={() => setHudOpen(false)}
                closeLabel="Fechar"
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
}
