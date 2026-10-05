# Lançamento de Projétil

| | |
|---|---|
| **id** (`registry.ts`) | `projectile-motion` |
| **Área** | Física — Cinemática |
| **Modalidade** | Desktop/mobile 3D (WebGL) |
| **Arquivos** | `physics.ts` (48 linhas) · `scene.ts` (277) · `index.tsx` (151) |
| **Dependências** | `three`, `OrbitControls`, `react` |

## 1. Objetivo pedagógico

Visualizar a trajetória parabólica de um lançamento oblíquo e relacionar velocidade inicial, ângulo e gravidade com o **alcance**, a **altura máxima** e o **tempo de voo**. O aluno vê a curva prevista antes de disparar e os marcadores de R e H depois do pouso.

## 2. Modelo científico

Movimento sem resistência do ar, lançado da origem, ângulo θ medido a partir da horizontal:

```
x(t) = v₀ cos θ · t
y(t) = v₀ sin θ · t − ½ g t²
```

Grandezas analíticas (`physics.ts → projectileInfo`):

| Grandeza | Fórmula |
|---|---|
| Alcance | R = v₀² sin(2θ) / g |
| Altura máxima | H = (v₀ sin θ)² / (2g), atingida em x = R/2 |
| Tempo de voo | T = 2 v₀ sin θ / g |

Diferente do Pêndulo, aqui **não há integração numérica**: a posição é calculada pela solução exata em função do tempo (`projectilePos(t, p)`). Isso torna a trajetória independente do FPS.

`trajectoryPoints(p, n = 100)` amostra 101 pontos de `t = 0` a `t = T` para desenhar a curva de prévia.

## 3. Arquitetura do experimento

```
index.tsx                              scene.ts
─────────                              ────────
estado: v0, θ (graus), g, launched     createProjectileScene(canvas, cfg, bg)
info = projectileInfo() → painel       update(cfg)  → rebuild() e volta a 'idle'
botão Disparar/Resetar ──────────────▶ launch()     → idle→flying | flying/landed→idle
desmontagem ─────────────────────────▶ dispose()
```

Este experimento **estende o contrato padrão** com o método `launch()`.

## 4. Máquina de estados da cena

```
         launch()              y ≤ 0 (pousou)
 idle ───────────▶ flying ─────────────────▶ landed
  ▲                  │                          │
  └──── launch() ────┴──────── launch() ────────┘
  ▲
  └──── update(cfg) a partir de qualquer estado (rebuild)
```

| Estado | Projétil | Prévia | Rastro | Marcadores R/H |
|---|---|---|---|---|
| `idle` | na origem | visível | vazio | ocultos |
| `flying` | movendo | oculta | crescendo | ocultos |
| `landed` | em (R, 0) | oculta | completo | visíveis |

A condição de pouso é `y <= 0 && simTime > 0.05·T`: a segunda parte evita detectar "pouso" no instante zero (quando `y` também é 0).

O estado `launched` do React apenas troca o texto do botão ("Disparar"/"Resetar"); quem manda de verdade é o `simState` interno da cena.

## 5. Construção da cena

| Elemento | Implementação |
|---|---|
| Projétil | `SphereGeometry(0.5)` vermelha |
| Rastro | `BufferGeometry` **pré-alocado** com 500 pontos (`Float32Array(1500)`); a cada frame escreve o ponto e aumenta `setDrawRange(0, n)` — sem realocar memória |
| Prévia | `Line` com os 101 pontos de `trajectoryPoints`, cor discreta |
| Chão | `PlaneGeometry` + `GridHelper`, dimensionados por `max(1,4·R, 20)` |
| Marcadores | linha laranja (0→R) + esfera em (R,0); linhas verdes vertical em x=R/2 e horizontal em y=H + esfera em (R/2, H) |
| Grupos | `groundGroup`, `previewGroup`, `markersGroup` — limpos e reconstruídos em `rebuild()` com `clearGroup()` (que libera as geometrias) |

**Enquadramento automático** (`frameCamera`): a cada `rebuild` a câmera é reposicionada para que a trajetória inteira caiba na tela:

```ts
dist = max(R·0.9, H·3, 15)
camera.position = (R/2, max(H/2, 2), dist)
target          = (R/2, max(H/4, 1), 0)
```

## 6. Interação

| Controle | Faixa | Efeito |
|---|---|---|
| Velocidade inicial v₀ | 5 – 40 m/s | `rebuild()` (volta a idle) |
| Ângulo θ | 5° – 85° | `rebuild()` |
| Gravidade g | 1 – 20 m/s² | `rebuild()` |
| Botão Disparar / Resetar | — | `launch()` |
| Mouse | arrastar/rolar | Orbita/zoom |

## 7. Decisões e simplificações

- Sem arrasto do ar, solo plano, lançamento do nível do chão.
- Projétil de raio 0,5 m (exagerado para ser visível; com g = 9,8 o alcance chega a ~163 m e com g = 1 a 1.600 m).
- Tempo real 1:1 (um voo de 4 s dura 4 s), limitado por `dt ≤ 50 ms`.

## 8. Limitações e problemas conhecidos

- Troca de tema recria a cena com `DEFAULTS` enquanto os sliders mantêm valores antigos (D1).
- Rastro limitado a 500 pontos: a 60 FPS isso cobre ~8 s de voo; com v₀ = 40 e g = 1 o voo dura ~80 s e o rastro para de crescer no meio.
- `projectileInfo()` é recalculado a cada frame durante o voo (barato, mas poderia ser cacheado no `rebuild`).

## 9. Ideias para o TCC2

- Resistência do ar (força ∝ v²) com integração numérica, comparando com a parábola ideal.
- Lançamento de uma altura inicial (penhasco).
- Mostrar vetores de velocidade (componentes vx e vy) durante o voo com `ArrowHelper`.
- Teste: alcance máximo ocorre em θ = 45°; R(θ) = R(90° − θ).
