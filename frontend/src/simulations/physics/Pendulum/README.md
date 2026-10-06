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

## 10. Sala interativa (Museu Virtual) e contrato montável

Desde 06/10/2026 o Pêndulo é um **experimento montável** (`core/mountable.ts`) e tem uma **sala interativa** no Museu Virtual (`sala.ts`). Ver `ARQUITETURA.md`, seção 22.

### O que mudou no `scene.ts`

- O conteúdo (pivô, haste, massa, estado físico) foi para `pendulum.mount(root)`. Renderer, câmera, OrbitControls, luzes e laço saíram: agora vêm do hospedeiro.
- `createPendulumScene(canvas, config, bg)` **manteve a assinatura** e virou uma chamada a `hostInPage(...)` com a câmera e as luzes que a página sempre usou. Por isso `index.tsx` e `physics.ts` não mudaram nenhuma linha.
- **Subpasso de integração**: antes, o teto de 20 ms no `dt` era garantido pelo laço próprio. Como o laço agora é do hospedeiro (que limita a 50 ms), o próprio `tick` divide passos maiores em pedaços de até 20 ms. Resultado: a precisão do integrador não depende mais de quem hospeda (verificado: `tick(0,1)` = 5 × `tick(0,02)`).
- Ganhou dois métodos extras, usados só pela sala: `grab(θ)` (segura a massa num ângulo e pausa a física) e `release()` (solta a partir do repouso), além de expor `bob` (o objeto da massa).

Tamanho: 142 → 146 linhas, mesmo ganhando o subpasso e o `grab/release`.

### A sala (`sala.ts`, 71 linhas)

| Item | Valor |
|---|---|
| Sala | 8 × 9 m, pé-direito 4,8 m |
| Posição do pivô | 3,8 m do chão (com L = 3 m a massa passa a 0,8 m do chão) |
| Escala | 1 (o pêndulo já é modelado em metros) |
| Camada A — HUD | Comprimento L (0,5–3 m), gravidade g (1–20 m/s²), ângulo inicial θ₀ (−170° a 170°) |
| Camada B — interação | **Pegar a massa**: mirar nela e segurar E (ou o botão no celular); arrastar define o ângulo; soltar larga o pêndulo do repouso |

Como a interação funciona: o raio da mira (centro da tela) é cruzado com o **plano de oscilação** (plano vertical que passa pelo pivô); o ponto de cruzamento, convertido para as coordenadas locais do pêndulo, vira o ângulo `θ = atan2(x, −y)`, limitado a ±170°. A massa é considerada "na mira" se o raio passa a menos de 35 cm dela e ela está a menos de 6 m.

É o único dos quatro experimentos com camada B: soltar o pêndulo com a mão é a forma mais natural de definir θ₀, e mostra na prática que o período não depende do ângulo (para ângulos pequenos).

### Como este experimento mexe na arquitetura

- É o **piloto** da migração: provou que dá para separar conteúdo de infraestrutura sem tocar em `physics.ts` nem em `index.tsx`.
- É o único que exercita **todas** as peças da sala interativa: `tick` com estado físico, HUD (camada A) e interação direta (camada B, `RoomInteraction`).
- Revelou uma consequência não óbvia da migração: garantias que dependiam do laço próprio (o teto de `dt`) precisam migrar para dentro do experimento.

### Limitações da sala

- O pivô flutua (não há viga nem suporte desenhado).
- A interação usa o plano de oscilação fixo (plano XY da sala): olhando o pêndulo exatamente de lado, o arrasto fica impreciso.
