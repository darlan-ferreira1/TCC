# TCC — Plataforma de Simulações Científicas 3D

Monorepo com duas aplicações independentes:

- `backend/` — API em Fastify + TypeScript. Roda em localhost:3000.
- `frontend/` — Aplicação React + Vite + TypeScript. Roda em localhost:5173.

## Estrutura do frontend
- `src/experiments/` — as simulações 3D interativas (Three.js), o produto principal.
  Cada experimento é uma pasta com `index.tsx` (wrapper React) e `scene.ts` (Three.js puro).
  O `registry.ts` é a fonte única que alimenta a galeria e o roteamento.
- `src/content/` — explicações teóricas (páginas de texto), mesmo padrão de registry.
- `src/three/` e `src/vision/` — helpers compartilhados (Three.js e MediaPipe).
- `playground/` — APENAS estudos pessoais de Three.js. NÃO faz parte do produto,
  não deve ser modificado em tarefas relacionadas à plataforma.
  - `src2` — um design que estou tentando adicionar ao sistema principal
## Comandos
- Backend: `cd backend && npm run dev`
- Frontend: `cd frontend && npm run dev`