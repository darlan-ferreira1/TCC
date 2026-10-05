# Pêndulo Simples

| | |
|---|---|
| **id** (`registry.ts`) | `simple-pendulum` |
| **Área** | Física — Mecânica / Oscilações |
| **Modalidade** | Desktop/mobile 3D (WebGL) |
| **Arquivos** | `physics.ts` (35 linhas) · `scene.ts` (142) · `index.tsx` (125) |
| **Dependências** | `three`, `OrbitControls`, `react` |

## 1. Objetivo pedagógico

Mostrar o movimento oscilatório de um pêndulo e como o comprimento `L` e a gravidade `g` mudam o período. O aluno também pode comparar o período da fórmula de pequenos ângulos (exibido no painel) com o movimento real simulado em ângulos grandes.

## 2. Modelo científico

Equação de movimento do pêndulo simples (sem atrito, haste rígida e sem massa):

```
θ''(t) = −(g / L) · sin θ(t)
```

Ela é uma EDO **não linear** (por causa do `sin θ`) e não tem solução fechada elementar. Por isso a simulação **integra numericamente**.

### Integrador: Euler semi-implícito (simplético)

`physics.ts → stepPendulum(state, config, dt)`:

```
ω_{n+1} = ω_n + Δt · (−g/L) · sin θ_n      ← atualiza a velocidade primeiro
θ_{n+1} = θ_n + Δt · ω_{n+1}                ← usa a velocidade NOVA
```

No Euler explícito comum a 2ª linha usaria `ω_n`, e a energia do pêndulo cresceria a cada passo (a amplitude aumenta até ele dar voltas). O semi-implícito é **simplético**: a energia oscila em torno do valor correto sem crescer. É a escolha certa para osciladores com custo computacional mínimo.

### Período exibido

`physics.ts → period(config)` = `2π √(L/g)`. Vale só para **ângulos pequenos** (sin θ ≈ θ). Com θ₀ = 45° o período real já é ~4% maior; com θ₀ = 170° é bem maior. O painel avisa isso com "aproximação de pequenos ângulos".

## 3. Arquitetura do experimento

```
index.tsx (React)                 scene.ts (Three.js)              physics.ts (puro)
─────────────────                 ───────────────────              ─────────────────
estado: L, g, θ₀ (graus)  ──────▶ createPendulumScene(canvas,      stepPendulum()
T = period({L,g}) p/ exibir         {L, g, theta0(rad)}, bg)       period()
sliders → push() ───────────────▶ update(cfg)  → reconstrói haste,
                                               reinicia estado
desmontagem ────────────────────▶ dispose()
```

- `index.tsx` converte graus para radianos (`DEG = π/180`) antes de mandar para a cena.
- `index.tsx` importa `period()` só para **mostrar** o número; quem simula é a cena.

## 4. Construção da cena (`scene.ts`)

| Objeto | Geometria | Detalhe |
|---|---|---|
| `pivotMesh` | `SphereGeometry(0.07)` | Ponto de suspensão fixo na origem |
| `pivotGroup` | `Group` | Gira em Z pelo ângulo θ (é a "dobradiça") |
| `rodMesh` | `CylinderGeometry(0.025, 0.025, L)` | Centralizado em `(0, −L/2, 0)` dentro do grupo |
| `massMesh` | `SphereGeometry(0.18)` | Em `(0, −L, 0)` dentro do grupo |

Truque central: em vez de calcular a posição `(x, y)` da massa com seno/cosseno, a haste e a massa ficam **penduradas dentro de um grupo** e só o grupo gira:

```ts
pivotGroup.rotation.z = -state.theta;   // negativo: rotação +Z do Three.js vai para a esquerda
```

Câmera: `PerspectiveCamera(45°)` em `(0, −0.5, 8)`, `OrbitControls` com alvo em `(0, −1.5, 0)` e amortecimento. Luz ambiente + direcional.

## 5. Laço de animação

```ts
function animate(t) {
  raf = requestAnimationFrame(animate);
  const dt = Math.min((t - last) / 1000, 0.02);   // teto de 20 ms
  last = t;
  state = stepPendulum(state, physConfig, dt);
  pivotGroup.rotation.z = -state.theta;
  controls.update();
  renderer.render(scene, camera);
}
```

O teto de 20 ms (menor que nos outros experimentos, que usam 50 ms) existe porque este é o único experimento com **integração numérica**: passos grandes degradam a precisão.

## 6. Interação

| Controle | Faixa | Efeito |
|---|---|---|
| Comprimento L | 0,5 – 3,0 m (passo 0,1) | Reconstrói a haste, reinicia em θ₀ com ω = 0 |
| Gravidade g | 1 – 20 m/s² (passo 0,5) | Reinicia o movimento |
| Ângulo inicial θ₀ | −170° a 170° (passo 5°) | Reinicia o movimento |
| Mouse | arrastar/rolar | Orbita/zoom da câmera |

Qualquer mudança chama `update()`, que **reinicia** a oscilação a partir do repouso.

## 7. Decisões e simplificações

- Sem atrito/amortecimento: a oscilação dura para sempre.
- Haste reconstruída a cada `update` (até quando só `g` muda) — simples, custo desprezível.
- Escala: 1 unidade da cena = 1 m.

## 8. Limitações e problemas conhecidos

- **Troca de tema** recria a cena com `DEFAULTS` (L = 1,5; g = 9,8; θ₀ = 45°), mas os sliders mantêm os valores anteriores → o 3D e o painel ficam diferentes até mexer num slider (débito D1 em `ARQUITETURA.md`).
- O passo de tempo é variável (depende do FPS). Em monitores de 144 Hz e 60 Hz a trajetória numérica é levemente diferente.
- O período real (não linear) não é exibido.

## 9. Ideias para o TCC2

- Passo de tempo fixo com acumulador (`while (acc >= DT) step(DT)`).
- Mostrar o período **medido** na simulação (contar cruzamentos de θ = 0) ao lado do teórico — ótimo para um gráfico na monografia.
- Adicionar amortecimento `−b·ω` e gráfico θ(t) em tempo real.
- Teste unitário: energia `E = ½L²ω² + gL(1 − cos θ)` deve variar < 1% após 10⁴ passos.
