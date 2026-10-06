# Lei de Boyle com as Mãos

| | |
|---|---|
| **id** (`registry.ts`) | `boyle-law` |
| **Área** | Química (e Física) — Estudo dos gases, teoria cinética, transformação isotérmica |
| **Modalidade** | **Interação natural**: as duas mãos rastreadas pela webcam (MediaPipe Hand Landmarker, 2 mãos), com mouse como alternativa |
| **Arquivos** | `physics.ts` (129 linhas) · `scene.ts` (205) · `index.tsx` (153) |
| **Dependências** | `@mediapipe/tasks-vision` (via `core/handTracking.ts`), `react`; **sem Three.js** (canvas 2D sobre o vídeo) |
| **Criado em** | 06/10/2026 |

## 1. Objetivo pedagógico

O aluno **comprime um gás com as próprias mãos**: as mãos viram as paredes de um recipiente desenhado sobre a imagem da câmera. Ao aproximá-las, vê as partículas se apertarem, a pressão subir e o produto **P·V** ficar constante — e um gráfico P × V desenhar a isoterma (hipérbole) ponto a ponto.

## 2. Modelo (`physics.ts`)

Gás ideal **2D** de N = 140 partículas (massa 1, sem colisões entre si) num recipiente de largura W (controlada pelas mãos) e altura H = 1 (u.a.).

| Grandeza | Como é obtida |
|---|---|
| **Pressão** | **Medida**, não calculada: soma dos impulsos `2·m·|v⊥|` de cada batida nas paredes, dividida pelo perímetro e pelo tempo; média móvel exponencial (τ = 0,4 s) |
| **Temperatura** | Energia cinética média: `T = ⟨vx² + vy²⟩ / 2` (k_B = 1, 2D) |
| **Parede móvel** | Reflexão no referencial da parede: `v' = 2·v_parede − v` (uma parede que avança dá energia às partículas) |
| **Isotermia** | Termostato de Berendsen: `λ² = 1 + (Δt/τ)(T_alvo/T − 1)`, τ = 0,15 s — como um gás trocando calor com o ambiente |
| **Teoria (comparação)** | Gás ideal 2D: `P·A = N·T` |

**Por que um termostato?** Empurrar a parede aquece o gás (compressão adiabática). Teste: sem termostato, comprimir de V = 2 para 0,5 levou T de 3,7 para 30. A Lei de Boyle é para temperatura constante, então o termostato remove esse calor.

### Validação (teste automático no Node)

| V | P medida (colisões) | P teórica N·T/V | Erro |
|---|---|---|---|
| 0,5 | 1139 | 1120 | 1,7% |
| 1 | 560 | 560 | 0,0% |
| 2 | 294 | 280 | 5,2% |

P·V = 569 / 560 / 589 (N·T = 560): variação de 5% — a **Lei de Boyle emerge** da mecânica das partículas, sem ser programada. Com termostato, após comprimir, T volta a 4,00 (alvo 4).

## 3. Arquitetura

```
index.tsx ── useHandCamera(2 mãos) ── readWalls(): centros das palmas → pixels da tela
   │                                   (coverMapping corrige o object-fit: cover do vídeo)
   ▼
scene.ts (canvas 2D transparente sobre o vídeo)
   │  largura na tela → W do gás · subpassos de física · pressão média · gráfico P×V
   ▼
physics.ts (puro): gás, colisões, termostato, pressão, teoria
```

- Mesma abstração de entrada do "Você é o móvel": a cena recebe `readWalls()` e não sabe se vieram das mãos ou do mouse.
- **Alinhamento vídeo × desenho**: o vídeo usa `object-fit: cover` (corta as bordas). `coverMapping` (em `core/handTracking.ts`) converte as coordenadas da imagem para a tela levando o corte em conta, para as paredes ficarem exatamente nas mãos. Isso resolve, para os experimentos novos, o desalinhamento que a Dissecação ainda tem (débito D16).
- Sem uma das mãos, o recipiente **mantém** a última largura (não "pula").

## 4. Interação

| Ação | Como |
|---|---|
| Comprimir / expandir | Aproximar / afastar as duas mãos (palmas para a câmera) |
| Sem câmera | Clicar e arrastar para os lados (largura = 2 × distância ao centro) |
| Temperatura | Slider (1–10 u.a.); com as mãos paradas mostra P ∝ T (Gay-Lussac) |
| Limpar gráfico | Botão |

## 5. Limitações

- Gás **2D** e unidades arbitrárias: as proporções estão certas, os valores não são de um gás real.
- Sem colisões entre partículas (gás ideal) — não mostra comportamento de gás real a alta pressão.
- O termostato torna a compressão sempre isotérmica (a transformação adiabática fica como extensão).
- Depende de as duas mãos estarem visíveis; mãos sobrepostas confundem o detector.

## 6. Ideias de evolução

- Botão "isolar termicamente" (desliga o termostato) para mostrar a compressão **adiabática** esquentando o gás.
- Colorir partículas pela velocidade (distribuição de Maxwell-Boltzmann).
- Controlar a temperatura pela altura de uma das mãos.
