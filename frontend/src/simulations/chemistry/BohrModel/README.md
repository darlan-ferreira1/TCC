# Modelo Atômico de Bohr

| | |
|---|---|
| **id** (`registry.ts`) | `bohr-model` |
| **Área** | Química — Estrutura atômica |
| **Modalidade** | Desktop/mobile 3D (WebGL) |
| **Arquivos** | `physics.ts` (70 linhas) · `scene.ts` (257) · `index.tsx` (228) |
| **Dependências** | `three`, `OrbitControls`, `react` |
| **Reutilizado por** | `xrBhorModel/` (VR) e `arBohrModel/` (AR) importam este `physics.ts` |

## 1. Objetivo pedagógico

Visualizar a estrutura atômica dos 20 primeiros elementos (H a Ca): núcleo com prótons e nêutrons, e elétrons distribuídos em camadas que giram em velocidades diferentes. O aluno também pode digitar uma distribuição eletrônica arbitrária.

## 2. Modelo científico

No modelo de Bohr, para a camada `n` (n = 1, 2, 3…):

```
r_n ∝ n²            (raio da órbita)
v_n ∝ 1/n           (velocidade linear)
ω_n = v_n / r_n ∝ 1/n³   (velocidade angular)
```

`physics.ts` implementa exatamente essas proporções:

```ts
shellRadius(i, base) = base · n²       // n = i + 1
shellOmega (i, base) = base / n³
```

Posição do elétron `i` de uma camada com `count` elétrons:

```
φᵢ = 2π i / count                       ← elétrons igualmente espaçados
x = r_n cos(ω_n t + φᵢ)
z = r_n sin(ω_n t + φᵢ)
```

`computeElectronPositions(config, t)` devolve a lista plana de posições `{x, z, shellIndex}` de **todos** os elétrons, na mesma ordem em que os meshes são criados na cena — essa correspondência por índice é o que liga física e renderização.

Com `baseRadius = 2`: camada 1 = 2, camada 2 = 8, camada 3 = 18, camada 4 = 32 unidades. A camada 2 gira 8× mais devagar que a 1; a camada 4, 64×.

## 3. Arquitetura do experimento

```
index.tsx                                  scene.ts                         physics.ts
─────────                                  ────────                         ──────────
ELEMENTS (20 linhas: símbolo, nome,        createBohrScene(canvas, cfg, bg) shellRadius()
  Z, N, camadas)                           update(cfg) → rebuild()          shellOmega()
estado: selectedIndex, shellsInput,        dispose()                        initialPhases()
  inputError, speed                                                         computeElectronPositions()
select de elemento ─────────────────────▶ update({protons, neutrons, shells, speedFactor})
campo "2, 8, 1" → parseShells() ────────▶ update(...)  (só se válido)
slider velocidade ──────────────────────▶ update(...)
```

`parseShells` aceita qualquer lista de inteiros não negativos separados por vírgula; entrada inválida pinta o campo de vermelho e **não** atualiza a cena.

## 4. Construção da cena (`scene.ts`)

### Núcleo

- Raio do aglomerado `clusterR = max(0,3; 0,35·∛A)` — imita a lei real do raio nuclear `R = R₀ A^{1/3}`.
- Cada núcleon é posicionado por **amostragem por rejeição** num cubo, descartando pontos fora da esfera (distribuição uniforme no volume).
- Gerador de números **pseudoaleatório com semente** (`xorshift32`, semente `Z·100 + N`) + embaralhamento **Fisher–Yates** de prótons e nêutrons. Resultado: o mesmo elemento sempre gera o mesmo núcleo (reprodutível), e prótons e nêutrons ficam misturados.
- Geometria única `SphereGeometry(0.22)` compartilhada por todos os núcleons; materiais vermelho (próton) e cinza (nêutron).

### Órbitas e elétrons

- Cada camada recebe uma **inclinação** diferente: 0°, 15°, 30°, 45°… — apenas estética, para o átomo parecer 3D.
- A órbita é um `LineLoop` de 128 pontos no plano XZ com `rotation.x = tilt`.
- O elétron guarda a inclinação em `mesh.userData.tilt`. A cada frame a posição (x, 0, z) da física é rotacionada em X manualmente:

```ts
mesh.position.set(x, -z·sin(tilt), z·cos(tilt));   // rotação em torno de X
```

  Isso é a mesma transformação que o Three.js aplica ao `LineLoop`, então o elétron fica exatamente sobre o anel desenhado.

### Luz e câmera

`PointLight` no núcleo + luz ambiente. Elétrons com `emissive` (brilham um pouco). Câmera em `(0, 8, 18)`, `OrbitControls` com distância entre 3 e 60.

## 5. Laço de animação

```ts
simTime += clock.getDelta() * speedFactor;
updateElectronPositions(currentConfig.shells, simTime);
```

## 6. Interação

| Controle | Efeito |
|---|---|
| Select "Elemento" (H … Ca) | Reconstrói núcleo e camadas; preenche o campo de distribuição |
| Campo "Distribuição eletrônica" | Permite camadas personalizadas (ex.: `2, 8, 18, 32`) |
| Slider Velocidade (0,1× – 4×) | Multiplicador do tempo |
| Mouse | Orbita/zoom |

## 7. Decisões e simplificações

- Modelo de Bohr é **histórico/didático**: não representa orbitais quânticos.
- Escala sem relação com a real (o núcleo real é ~10⁵ vezes menor que o átomo).
- O número de nêutrons é o do isótopo mais comum (ex.: Cl com 18).
- A tabela `ELEMENTS` é uma tupla `[símbolo, nome, Z, N, camadas]`, sem tipos nomeados.

## 8. Limitações e problemas conhecidos

- **Vazamento de memória de GPU** (D2): `buildOrbitAndElectrons` chama `orbitsGroup.clear()` mas não faz `dispose()` das geometrias de órbita criadas a cada `update`. Como mexer no slider de velocidade também chama `update` → `rebuild`, arrastar o slider cria dezenas de geometrias não liberadas. As variantes XR/AR já corrigem isso com `orbitDisposables`.
- `update` reconstrói o átomo inteiro até quando só a velocidade muda.
- `setPixelRatio(window.devicePixelRatio)` sem limite (os outros experimentos limitam a 2).
- `Clock.getDelta()` sem teto: ao voltar de outra aba os elétrons "pulam".
- A tabela de elementos está copiada também em `xrBhorModel/scene.ts` e `arBohrModel/scene.ts` (D3).

## 9. Ideias para o TCC2

- Mover `ELEMENTS` para `physics.ts` (ou `elements.ts`) e importar nas três variantes.
- Separar `setSpeed()` de `update()` para não reconstruir a geometria.
- Validar a distribuição pela regra 2n² e avisar quando o aluno digita algo impossível.
- Transições de nível: clicar num elétron e "excitar" para outra camada, emitindo um fóton com a cor da linha espectral (série de Balmer para o hidrogênio).
