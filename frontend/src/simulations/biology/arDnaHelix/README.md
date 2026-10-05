# Dupla Hélice de DNA — AR (Realidade Aumentada)

| | |
|---|---|
| **id** (`registry.ts`) | `ar-dna-helix` |
| **Área** | Biologia — Biologia molecular |
| **Modalidade** | **AR** (WebXR `immersive-ar`) com fallback desktop |
| **Arquivos** | `scene.ts` (210 linhas) · `index.tsx` (130) — sem `physics.ts` |
| **Dependências** | `three`, `ARButton`, `OrbitControls`, `react` |
| **Requer** | Android com ARCore + Chrome, HTTPS |

## 1. Objetivo pedagógico

Colocar uma hélice de DNA do tamanho de uma pessoa no ambiente real (sala de aula) para o aluno caminhar ao redor dela olhando pela câmera do celular.

## 2. Modelo científico

Mesma hélice paramétrica do desktop (ver `DnaHelix/README.md`), reimplementada em `computeHelix` com escala de sala:

| Constante | Desktop | VR | AR (este) |
|---|---|---|---|
| Raio | 1,5 | 3,75 m | **0,40 m** (80 cm de diâmetro) |
| Subida por pb | 0,34 | 0,85 m | **0,09 m** |
| Pares padrão | 20 | 14 | **16** → 1,44 m de altura |
| Esfera / tubo / degrau | 0,13 / 0,07 / 0,05 | ×2,5 | 0,055 / 0,030 / 0,020 m |
| Posição | origem | (0, 0, −6) | **(0, 0, −1,5)** |
| Rotação | slider | 0,15 volta/s | 0,2 volta/s |

## 3. Arquitetura

Igual à do `arBohrModel`: container, `arButton` exposto ao React, `setBasePairs` (React → cena) e `onBasePairsChange` (cena → React), `setAnimationLoop`, fundo transparente na sessão AR.

## 4. Pontos específicos de AR

- `WebGLRenderer({ alpha: true })`; `setClearColor(0x000000, 0)` no `sessionstart` para a câmera real aparecer por trás.
- `HemisphereLight` (céu branco, chão esverdeado) + direcional suave — iluminação neutra para combinar com o ambiente.
- Sem painel 3D: a informação fica no HTML do `index.tsx`.
- Toque na tela = `selectstart` do controlador 0 = +2 pares.

## 5. Interação

| Contexto | Entrada | Efeito |
|---|---|---|
| Fora da sessão | Slider (6–30, passo 2), mouse | Pares de base / orbitar |
| Fora da sessão | Botão "START AR" | Inicia AR |
| Sessão AR | Toque | +2 pares |
| Sessão AR | Andar | Explorar ao redor |

## 6. Limitações e problemas conhecidos

- **Slider não aparece durante a sessão AR** (D4, verificar em aparelho): o comentário em `scene.ts` diz "Slider HTML também funciona durante a sessão AR", mas o `ARButton` foi criado sem `domOverlay` apontando para o painel React. Ver correção em `arBohrModel/README.md §7`.
- Em celular só existe um "controlador" (o toque): é possível aumentar os pares, mas não diminuir dentro da sessão.
- A hélice está centralizada em y = 0, que no *reference space* `local-floor` é o **chão**: metade inferior (−0,72 m a 0) fica abaixo do piso. O comentário diz "quase chão a cabeça", o que só vale se a origem estiver na altura do celular (`local`). Verificar em aparelho; possivelmente usar `DNA_POS.y = 0,72`.
- Sem *hit-test* nem âncoras.
- Matemática da hélice duplicada (D3).

## 7. Ideias para o TCC2

- *Hit-test* para posicionar a hélice no chão real com um toque.
- `dom-overlay` para controles na sessão.
- Gesto de pinça com dois dedos na tela para escalar a hélice.
- Comparar FPS e conforto (questionário) entre AR (este) e VR (`xrDnaHelix`) — dado para a avaliação.
