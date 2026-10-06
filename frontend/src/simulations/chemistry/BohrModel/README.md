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

- ~~**Vazamento de memória de GPU** (D2)~~ — **resolvido em 06/10/2026** (ver §10): as geometrias das órbitas agora são liberadas a cada `update`.
- `update` reconstrói o átomo inteiro até quando só a velocidade muda.
- ~~`setPixelRatio` sem limite~~ e ~~`Clock.getDelta()` sem teto~~ — **resolvidos** pela migração para o `hostInPage` (ver §10).
- ~~Tabela de elementos copiada em três arquivos~~ — **resolvido**: agora é `elements.ts` (ver §10). A construção do átomo continua duplicada nas variantes XR/AR (D3).

## 9. Ideias para o TCC2

- Mover `ELEMENTS` para `physics.ts` (ou `elements.ts`) e importar nas três variantes.
- Separar `setSpeed()` de `update()` para não reconstruir a geometria.
- Validar a distribuição pela regra 2n² e avisar quando o aluno digita algo impossível.
- Transições de nível: clicar num elétron e "excitar" para outra camada, emitindo um fóton com a cor da linha espectral (série de Balmer para o hidrogênio).

## 10. Sala interativa (Museu Virtual) e contrato montável

Desde 06/10/2026 o Modelo de Bohr é um **experimento montável** (`core/mountable.ts`) e tem uma **sala interativa** no Museu Virtual (`sala.ts`). Ver `ARQUITETURA.md`, seção 22.

### O que mudou

- **`scene.ts`**: núcleo, órbitas e elétrons foram para `bohrModel.mount(root)`; o avanço dos elétrons virou `tick(dt)`. `createBohrScene(canvas, config, bg)` manteve a assinatura e virou `hostInPage(...)` com a câmera (0, 8, 18), zoom 3–60 e a luz ambiente 0,4 da página.
- **A luz pontual do núcleo foi para dentro do experimento** (antes era da cena). Critério usado: luz que faz parte do fenômeno ("o núcleo ilumina o átomo") é do experimento; luz de ambiente é do hospedeiro. Assim, na sala do museu o átomo continua se iluminando sozinho.
- **Correções que vieram de graça com a migração**:
  - **D2 resolvido**: as geometrias das órbitas agora são liberadas a cada `update` (antes vazavam memória de GPU a cada mexida no slider).
  - **D19 resolvido**: o `hostInPage` limita o `pixelRatio` a 2, como os demais experimentos.
  - O passo de tempo passou a ter teto de 50 ms (antes, ao voltar de outra aba, os elétrons "pulavam").
- **Tabela de elementos única** (`elements.ts`): a tabela dos 20 elementos estava copiada em `BohrModel/index.tsx`, `xrBhorModel/scene.ts` e `arBohrModel/scene.ts`. Agora as três variantes **e** a sala importam o mesmo arquivo (−68/+7 linhas nos três arquivos; parte do débito D3). Este é o único caso em que um `index.tsx` foi tocado: só para importar a tabela em vez de declará-la.
- `physics.ts` não mudou.

Tamanho do `scene.ts`: 257 → 239 linhas (−18), já contando a correção do vazamento.

### A sala (`sala.ts`, 40 linhas)

| Item | Valor |
|---|---|
| Sala | 10 × 10 m, pé-direito 5 m |
| Posição | núcleo flutuando a 2,3 m do chão (acima da cabeça) |
| Escala | 0,1 → camada 1 com 20 cm de raio, camada 4 (K, Ca) com 3,2 m |
| Experiência | o aluno anda **por dentro** das órbitas e vê os elétrons passarem ao redor — a ideia da variante VR, agora também no PC e no celular |
| Camada A — HUD | elemento (H a Ca, de `elements.ts`) e velocidade (0,1×–4×) |
| Camada B | nenhuma |

### Como este experimento mexe na arquitetura

- Mostrou que o `sala.ts` pode ter controles **diferentes** dos da página: a página aceita uma distribuição eletrônica digitada à mão; a sala só oferece a lista de elementos. `toConfig` traduz a escolha ("C") na configuração completa (prótons, nêutrons, camadas).
- Forçou a regra "luz do fenômeno é do experimento; luz de ambiente é do hospedeiro", registrada na seção 22.
- Foi o experimento em que a migração mais **pagou dívida técnica** (D2, D19 e parte de D3).
- As variantes `xrBhorModel`/`arBohrModel` continuam no contrato antigo; candidatas a serem substituídas pela sala quando o museu ganhar VR/AR.
