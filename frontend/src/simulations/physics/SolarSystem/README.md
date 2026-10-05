# Sistema Solar

| | |
|---|---|
| **id** (`registry.ts`) | `planetary-motion` |
| **Área** | Física — Mecânica celeste / Astronomia |
| **Modalidade** | Desktop/mobile 3D (WebGL) |
| **Arquivos** | `physics.ts` (51 linhas) · `scene.ts` (204) · `index.tsx` (110) |
| **Dependências** | `three`, `OrbitControls`, `react` |

## 1. Objetivo pedagógico

Mostrar os 8 planetas orbitando o Sol com **períodos orbitais proporcionais aos reais**, para que o aluno perceba que planetas internos giram muito mais rápido (Mercúrio dá ~4 voltas enquanto a Terra dá 1; Netuno leva ~165 anos terrestres).

## 2. Modelo científico

**Cinemática de órbitas circulares** (não é gravitação newtoniana):

```
ω = 2π / T
x(t) = r · cos(ω t + φ₀)
z(t) = r · sin(ω t + φ₀)
y(t) = 0                       ← todas as órbitas no plano XZ
```

`physics.ts → PLANETS` guarda, para cada planeta:

| Planeta | Raio na cena | Período (anos terrestres) | Fase inicial φ₀ |
|---|---|---|---|
| Mercúrio | 2,5 | 0,24 | 0,5 |
| Vênus | 3,8 | 0,62 | 1,2 |
| Terra | 5,2 | 1,00 | 2,0 |
| Marte | 6,8 | 1,88 | 3,5 |
| Júpiter | 10,0 | 11,86 | 0,8 |
| Saturno | 13,0 | 29,46 | 4,2 |
| Urano | 16,0 | 84,01 | 1,7 |
| Netuno | 19,0 | 164,80 | 5,1 |

- **Períodos**: proporções reais.
- **Raios**: comprimidos (em escala real Netuno estaria a 30 UA e a cena seria inutilizável). Por isso a 3ª Lei de Kepler (T² ∝ r³) **não vale** com esses raios — vale só para os períodos reais.
- **Fases**: arbitrárias, só para espalhar os planetas.

O próprio `physics.ts` tem um `TODO` documentando a evolução natural: substituir por gravitação `F = GMm/r²` integrada com Euler semi-implícito, com velocidade inicial circular `v = √(GM/r)`.

## 3. Arquitetura do experimento

```
index.tsx                                  scene.ts
─────────                                  ────────
estado: speed                              createSolarSystemScene(canvas,
timeDisplayRef (<span>)  ◀── onTimeUpdate ──  {speedFactor}, onTimeUpdate, bg)
slider velocidade ────────────────────────▶ update({speedFactor})
legenda PLANETS (cores)                     getTime()
desmontagem ──────────────────────────────▶ dispose()
```

Destaque arquitetural: **o tempo simulado não passa pelo estado do React**. A cena chama `onTimeUpdate(t)` a cada 10 frames, e o componente escreve direto no DOM:

```ts
(t) => { timeDisplayRef.current.textContent = `${t.toFixed(1)} anos`; }
```

Usar `setState` aqui causaria ~6 re-renders por segundo do componente inteiro. É um exemplo didático de **canal de saída de alta frequência fora da reconciliação**.

## 4. Construção da cena

| Elemento | Implementação |
|---|---|
| Sol | `SphereGeometry(1.2)` + `MeshBasicMaterial` (não sofre iluminação — "emite" luz) |
| Halo | esfera de raio 1,7 com opacidade 0,12 |
| Luz do Sol | `PointLight(0xffdd88, intensidade 3, distância 120, decay 1,5)` na origem |
| Luz ambiente | muito fraca (`0x111122`), só para o lado noturno não ficar 100% preto |
| Planetas | `SphereGeometry` + `MeshPhongMaterial`, raio e cor em `VISUALS[i]` (índice alinhado com `PLANETS`) |
| Anel de Saturno | `RingGeometry(0.7, 1.2)` como **filho** da esfera de Saturno, rotacionado −π/2 em X; acompanha o planeta automaticamente |
| Órbitas | `LineLoop` de 128 pontos por planeta |
| Estrelas | 2000 `Points` distribuídos **uniformemente numa casca esférica** de raio 180–260 (usa `φ = acos(2u − 1)` para não concentrar nos polos) |

`dispose()` usa `scene.traverse` para liberar todas as geometrias e materiais de uma vez (inclusive os criados dentro do `forEach`).

## 5. Laço de animação

```ts
simTime += dt * speedFactor;          // dt ≤ 50 ms
PLANETS.forEach((p, i) => planetMeshes[i].position.set(...planetPosition(simTime, p)));
if (++frameCount % 10 === 0) onTimeUpdate(simTime);
```

Com `speedFactor = 1`, 1 segundo real = 1 ano terrestre simulado.

## 6. Interação

| Controle | Faixa | Efeito |
|---|---|---|
| Velocidade do tempo | 0,1× – 10× (padrão 1,5×) | Altera `speedFactor` sem reiniciar |
| Mouse | arrastar/rolar | Orbita/zoom |

## 7. Decisões e simplificações

- Órbitas circulares e coplanares (sem excentricidade nem inclinação).
- Tamanhos dos planetas fora de escala (Júpiter seria 11× a Terra; aqui é 2,4×).
- Sem rotação dos planetas em torno do próprio eixo, sem luas.

## 8. Limitações e problemas conhecidos

- Troca de tema recria a cena com `DEFAULT_SPEED` e zera o tempo, mas o slider mantém o valor anterior (D1).
- A descrição em `registry.ts` fala em "falloff gravitacional" da luz; o decaimento da `PointLight` é um efeito de iluminação, não tem relação com gravidade (D18).
- No tema claro o fundo fica claro e as estrelas brancas somem.

## 9. Ideias para o TCC2

- Implementar o `TODO`: gravitação newtoniana N-corpos (ou só Sol–planeta) com integrador simplético, e mostrar que as órbitas fechadas **emergem** da física — ótimo para discutir a separação domínio × renderização (só `physics.ts` muda).
- Órbitas elípticas com excentricidades reais (Kepler).
- Clicar num planeta para ver dados (raycaster).
- Versão VR: o usuário no centro do sistema solar.
