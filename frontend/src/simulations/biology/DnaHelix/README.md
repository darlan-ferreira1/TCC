# Dupla Hélice de DNA

| | |
|---|---|
| **id** (`registry.ts`) | `dna-helix` |
| **Área** | Biologia — Biologia molecular |
| **Modalidade** | Desktop/mobile 3D (WebGL) |
| **Arquivos** | `physics.ts` (55 linhas) · `scene.ts` (160) · `index.tsx` (136) |
| **Dependências** | `three`, `OrbitControls`, `react` |
| **Variantes** | `xrDnaHelix/` (VR) e `arDnaHelix/` (AR) — **não** reutilizam este `physics.ts` (ver §8) |

## 1. Objetivo pedagógico

Visualizar a estrutura tridimensional da dupla hélice: duas fitas (esqueleto açúcar-fosfato) enroladas em torno de um eixo e ligadas por pares de bases.

## 2. Modelo científico

Hélice paramétrica baseada no **DNA-B** (a forma mais comum em células):

| Constante (`physics.ts`) | Valor | Significado real |
|---|---|---|
| `BP_PER_TURN` | 10 | ~10 (10,5 no DNA-B real) pares de base por volta |
| `RISE_PER_BP` | 0,34 | 0,34 nm de subida por par de base (aqui em unidades da cena) |
| `RADIUS` | 1,5 | raio do esqueleto (~1 nm no real) |

Para o par de bases `i`:

```
ângulo = i · 2π / 10                       (36° por par de bases)
y      = −altura/2 + i · 0,34              (centralizada verticalmente)
fita 1 = ( R cos(ângulo),     y, R sin(ângulo)     )
fita 2 = ( R cos(ângulo + π), y, R sin(ângulo + π) )   ← defasada 180°
```

`computeDnaHelix(basePairs)` devolve as duas listas de posições. É **geometria estática** (não depende do tempo) — a animação é só uma rotação do conjunto.

## 3. Arquitetura do experimento

```
index.tsx                              scene.ts                        physics.ts
─────────                              ────────                        ──────────
estado: basePairs, speed               createDnaScene(canvas, cfg, bg) computeDnaHelix()
slider pares ────────────────────────▶ update({basePairs, rotationSpeed}) → rebuild
slider rotação ──────────────────────▶ update(...)                       → rebuild também
legenda (fitas, A-T, G-C)
```

## 4. Construção da cena

| Elemento | Implementação |
|---|---|
| Esqueleto (2 fitas) | `TubeGeometry` sobre uma `CatmullRomCurve3` que passa pelas posições dos nucleotídeos. A spline Catmull-Rom interpola suavemente entre os pontos, então 20 pontos viram um tubo liso (`basePairs × 3` segmentos tubulares) |
| Nucleotídeos | `SphereGeometry(0,13)` **compartilhada** por todas as esferas (vermelha fita 1, azul fita 2) |
| Pares de bases ("degraus") | `CylinderGeometry` de `strand1[i]` até `strand2[i]`, posicionado no ponto médio e orientado por quaternion `setFromUnitVectors((0,1,0), b−a)` |
| Cores dos pares | alterna laranja (A-T) e verde (G-C) por índice par/ímpar |
| Rotação | todo o DNA está em `dnaGroup`; a cada frame `rotation.y += speed · dt · 2π` (speed em voltas por segundo) |

Gestão de memória: geometrias recriadas (tubos e cilindros) entram numa lista `disposables` que é liberada a cada rebuild; a esfera e os 4 materiais são criados uma vez e reutilizados.

## 5. Interação

| Controle | Faixa | Efeito |
|---|---|---|
| Pares de base | 4 – 40 | Reconstrói a hélice |
| Rotação | 0 – 0,5 voltas/s | Velocidade de giro (também reconstrói, desnecessariamente) |
| Mouse | arrastar/rolar | Orbita/zoom |

## 6. Decisões e simplificações

- A sequência de bases é **artificial** (alterna A-T / G-C); não há sequência real nem distinção de A↔T vs T↔A.
- As fitas estão a 180° uma da outra: o DNA real tem **sulco maior e sulco menor** porque as fitas não são diametralmente opostas. Este modelo não mostra os sulcos.
- Antiparalelismo (5'→3' vs 3'→5') não é representado.
- Pares de bases desenhados como um único cilindro (sem as duas bases nem pontes de hidrogênio — 2 em A-T, 3 em G-C).

## 7. Limitações e problemas conhecidos

- Troca de tema recria a cena com `DEFAULT_BASE_PAIRS`/`DEFAULT_SPEED` enquanto os sliders mantêm valores anteriores (D1).
- Mudar a velocidade de rotação reconstrói toda a geometria.

## 8. Relação com as variantes XR/AR

`xrDnaHelix/scene.ts` e `arDnaHelix/scene.ts` têm cada um sua função `computeHelix` com as mesmas fórmulas, só mudando raio e subida. Isso é duplicação (débito D3). Refatoração sugerida:

```ts
// physics.ts
export function computeDnaHelix(basePairs: number, radius = 1.5, rise = 0.34): DnaGeometry
```

e as variantes chamam `computeDnaHelix(bp, 3.75, 0.85)` (VR) ou `computeDnaHelix(bp, 0.40, 0.09)` (AR). Medir as linhas removidas é um resultado concreto de reuso para o TCC2.

## 9. Ideias para o TCC2

- Sulcos maior/menor (defasagem ~150° em vez de 180°) e 10,5 pb/volta.
- Sequência digitável (ex.: `ATGCGTA…`) com cores por base e as pontes de hidrogênio.
- Base para os experimentos "Replicação do DNA" já previstos no `registry.ts` (`available: false`).
