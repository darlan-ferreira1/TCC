# Ondas Mecânicas

| | |
|---|---|
| **id** (`registry.ts`) | `mechanical-waves` |
| **Área** | Física — Ondulatória |
| **Modalidade** | Desktop/mobile 3D (WebGL) |
| **Arquivos** | `physics.ts` (30 linhas) · `scene.ts` (125) · `index.tsx` (120) |
| **Dependências** | `three`, `OrbitControls`, `react` |

## 1. Objetivo pedagógico

Visualizar uma onda progressiva como uma superfície 3D e relacionar amplitude, comprimento de onda e frequência com as grandezas derivadas (número de onda, frequência angular, velocidade e período).

## 2. Modelo científico

Onda plana harmônica progressiva no sentido +x:

```
y(x, t) = A · sin(k x − ω t)
k = 2π / λ        (número de onda, rad/m)
ω = 2π f          (frequência angular, rad/s)
v = λ f           (velocidade de fase, m/s)
T = 1 / f         (período, s)
```

- `physics.ts → waveDisplacement(x, t, p)`: deslocamento de um ponto.
- `physics.ts → waveInfo(p)`: grandezas derivadas para o painel.

O sinal negativo em `−ωt` faz a crista andar para +x com o tempo. É uma **solução analítica** (não há integração numérica).

## 3. Arquitetura do experimento

```
index.tsx                         scene.ts                         physics.ts
─────────                         ────────                         ──────────
estado: A, λ, f                   createWaveScene(canvas, cfg, bg)  waveDisplacement()
info = waveInfo() → painel        update(cfg) → só troca params     waveInfo()
sliders → push() ───────────────▶ (sem rebuild, sem reset do tempo)
desmontagem ────────────────────▶ dispose()
```

## 4. Técnica de renderização: deformação de malha na CPU

Esta é a cena tecnicamente mais interessante do grupo de Física.

1. Cria um plano bem subdividido: `PlaneGeometry(10, 6, 240, 30)` → 241 × 31 = **7.471 vértices**.
2. Gira o plano −π/2 em X para ficar "deitado". Com essa rotação, o eixo **Z local vira o Y do mundo**:
   `local(x, y, z) → mundo(x, z, −y)`.
3. A cada frame, para cada vértice: lê o `x`, calcula a onda e escreve no `z` local:

```ts
for (let i = 0; i < positions.count; i++) {
  const x = positions.getX(i);
  positions.setZ(i, waveDisplacement(x, t, params));   // z local = altura no mundo
}
positions.needsUpdate = true;     // reenvia o buffer para a GPU
geo.computeVertexNormals();       // recalcula normais → iluminação correta nas cristas
```

**Por que 240 segmentos em X?** Largura 10 / 240 ≈ 0,042 m entre vértices. Com λ mínimo de 1 m, há ~24 vértices por comprimento de onda — suficiente para a senoide não parecer "serrilhada" (critério bem acima do mínimo de Nyquist de 2 amostras por período).

Material: `MeshPhongMaterial` azul com especular claro e `shininess 120` (aspecto de água), `DoubleSide`. Iluminação: ambiente + direcional de cima + uma direcional azulada **de baixo** para iluminar a face inferior das cristas.

## 5. Interação

| Controle | Faixa | Efeito |
|---|---|---|
| Amplitude A | 0,1 – 2,0 m | Altura das cristas |
| Comprimento de onda λ | 1,0 – 5,0 m | Distância entre cristas |
| Frequência f | 0,1 – 3,0 Hz | Rapidez da oscilação |
| Mouse | arrastar/rolar | Orbita/zoom |

`update()` só substitui os parâmetros; o tempo `t` continua correndo. Por isso mudar λ ou f causa um "salto" visual (a fase `kx − ωt` muda instantaneamente) — comportamento esperado de uma solução analítica.

## 6. Decisões e simplificações

- A onda varia só em X; em Z (profundidade) todos os pontos têm a mesma altura (onda plana).
- O nome no catálogo promete "reflexão e interferência", mas a implementação atual é **uma única onda progressiva** — não há reflexão nem superposição.

## 7. Limitações e problemas conhecidos

- Custo por frame: 7.471 avaliações de `sin` + `computeVertexNormals()` na **CPU**. Funciona a 60 FPS em PCs, mas é o candidato natural a otimização.
- Troca de tema recria a cena com `DEFAULTS` enquanto os sliders mantêm valores anteriores (D1).
- Descrição do `registry.ts` promete mais do que o experimento faz.

## 8. Ideias para o TCC2

- **Mover a deformação para a GPU** com um *vertex shader* (`ShaderMaterial` ou `onBeforeCompile`): o JavaScript só atualiza um *uniform* `uTime`. Medir FPS antes/depois rende um bom resultado quantitativo de desempenho.
- Implementar o que a descrição promete: superposição de duas fontes (interferência), onda estacionária (`2A sin kx cos ωt`) e reflexão em parede.
- Onda circular a partir de um ponto (`r = √(x² + z²)`).
