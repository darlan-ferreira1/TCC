# CLARA.js

Plataforma web de simulações científicas interativas em 3D — Física, Química e Biologia — desenvolvida como TCC. Cada experimento roda com física real (integração numérica própria) renderizada em Three.js, com variantes AR/VR via WebXR para alguns temas.

Site publicado: https://darlan-ferreira1.github.io/TCC/

## Stack

- **React 19** + **TypeScript** — UI e composição de páginas
- **Vite 8** — dev server e build
- **Three.js** — renderização 3D e WebXR (AR/VR)
- **Tailwind CSS 4** (`@tailwindcss/vite`) — utilitário de estilo, combinado com CSS custom properties para o tema
- **@vitejs/plugin-basic-ssl** — HTTPS no dev server (necessário para APIs de câmera/WebXR fora de `localhost`)
- Deploy automático para **GitHub Pages** via GitHub Actions

Não há roteador (`react-router` etc.) nem gerenciador de estado global — a navegação é feita com `useState` simples em `App.tsx`, e cada simulação é isolada em sua própria pasta.

## Estrutura de pastas

```
src/
├── App.tsx                  # "router" — máquina de estados de página + tema global
├── main.tsx                 # entry point
├── index.css                # variáveis CSS de tema (dark/light) + import Tailwind
├── pages/
│   ├── ModeSelect.tsx        # tela inicial: Modo Normal vs Modo Imersivo
│   ├── Home.tsx               # galeria de simulações (busca, filtro por categoria)
│   └── Placeholder.tsx        # placeholder para páginas ainda não implementadas
├── components/ui/             # componentes de card/detalhe (não usados atualmente pelo fluxo principal)
└── simulations/
    ├── registry.ts             # fonte única de verdade dos metadados de cada experimento
    ├── physics/
    │   ├── Pendulum/
    │   ├── Projectile/
    │   ├── SolarSystem/
    │   └── Waves/
    ├── chemistry/
    │   ├── BohrModel/            + xrBhorModel/ + arBohrModel/
    │   └── MolecularGeometry/
    └── biology/
        └── DnaHelix/              + xrDnaHelix/ + arDnaHelix/
```

### Padrão de cada simulação

Toda simulação "normal" segue a mesma convenção de 3 arquivos:

| Arquivo | Responsabilidade |
|---|---|
| `physics.ts` | Matemática pura (integração numérica, sem nenhuma dependência do Three.js). Ex.: `stepPendulum`, `period`. |
| `scene.ts` | Setup do Three.js: câmera, luzes, meshes, loop de animação via `requestAnimationFrame`, e uma função `dispose()` para limpar geometrias/materiais/renderer. Expõe `createXScene(canvas, config) → { update(config), dispose() }`. |
| `index.tsx` | Componente React: monta o `<canvas>`, guarda a cena em um `useRef`, sincroniza os controles de UI (sliders) com `scene.update(...)`, e desmonta a cena no `useEffect` cleanup. |

Esse desacoplamento existe para que a física seja testável isoladamente e a cena não precise saber nada sobre React.

As variantes **XR** (`xrDnaHelix`, `xrBhorModel`) e **AR** (`arDnaHelix`, `arBohrModel`) seguem o mesmo padrão, mas `scene.ts` usa `VRButton`/`ARButton` de `three/examples/jsm/webxr/` e o loop de animação roda via `renderer.setAnimationLoop` (obrigatório em sessões WebXR, ao invés de `requestAnimationFrame` puro). O componente React só injeta o botão de entrada (`vrButton`/`arButton`) num container próprio.

### Registro de simulações

`src/simulations/registry.ts` é a única fonte de verdade sobre quais experimentos existem, sua categoria e se já estão disponíveis (`available: boolean`). A `Home.tsx` renderiza a galeria e os filtros a partir desse array — simulações com `available: false` aparecem em "Em breve" sem link ativo.

**Para adicionar uma nova simulação:**
1. Criar a pasta em `src/simulations/<área>/<Nome>/` com `physics.ts` (se aplicável), `scene.ts` e `index.tsx`.
2. Registrar os metadados em `registry.ts`.
3. Importar o componente e adicionar o `id` ao union type `Page` + ao bloco de `if`s em `App.tsx`.

### Tema

Dark é o tema padrão. `index.css` define duas paletas de custom properties (`:root` e `.light`), e `App.tsx` alterna a classe `.light` no `<html>` via `toggleTheme`. Os componentes de UI usam `var(--bg)`, `var(--text)` etc. diretamente em `style={{}}` (não há CSS Modules/styled-components). As cenas Three.js recebem a cor de fundo já resolvida (hex) como prop, pois não enxergam CSS.

## Rodando localmente

```bash
npm install
npm run dev      # HTTPS em https://localhost:5173 (plugin-basic-ssl gera certificado autoassinado)
npm run build    # tsc -b && vite build → dist/
npm run preview  # serve o build de produção localmente
npm run lint
```

HTTPS é necessário para testar captura de câmera (AR) fora do `localhost` puro; em `localhost` o navegador já trata como contexto seguro mesmo em HTTP, mas o projeto mantém HTTPS ligado por padrão para replicar o comportamento em rede local (ex.: testar no celular via IP).

## Deploy (GitHub Pages)

Workflow em `.github/workflows/deploy.yml`: a cada push na `main`, builda `frontend/` com `npm ci && npm run build` e publica `frontend/dist` via `actions/deploy-pages`. Não é necessário rodar nenhum comando manual — a única configuração feita uma vez foi apontar **Settings → Pages → Source: GitHub Actions** no repositório.

Ponto de atenção: `vite.config.ts` define `base: '/TCC/'` porque o site é servido como *project page* (`darlan-ferreira1.github.io/TCC/`), não como *user page* na raiz. Se o repositório for renomeado, esse valor precisa mudar junto.

## Débitos conhecidos

- `src/components/ui/ExperimentCard.tsx` e `ExperimentDetails.tsx` não são usados pelo fluxo atual (a `Home.tsx` implementa o card inline) — candidatos a remoção ou a uma futura migração da galeria para usá-los.
- O bundle de produção está acima de 500 kB (aviso do Vite) por concentrar Three.js + todas as simulações num único chunk; `React.lazy` por simulação resolveria isso quando a lista crescer.
