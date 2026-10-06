# Geometria Molecular (VSEPR)

| | |
|---|---|
| **id** (`registry.ts`) | `molecular-geometry` |
| **Área** | Química — Ligações químicas / Geometria molecular |
| **Modalidade** | Desktop/mobile 3D (WebGL) |
| **Arquivos** | `physics.ts` (194 linhas) · `scene.ts` (151) · `index.tsx` (135) |
| **Dependências** | `three`, `OrbitControls`, `react` |

## 1. Objetivo pedagógico

Mostrar em 3D as geometrias previstas pela teoria **VSEPR** (*Valence Shell Electron Pair Repulsion*) para 7 moléculas clássicas, com ângulo de ligação, número de pares solitários e uma nota explicativa.

## 2. Modelo científico

Apesar do nome, `physics.ts` aqui é **geometria analítica**: dado o tipo de geometria, o ângulo de ligação e o comprimento da ligação, calcula a posição 3D de cada ligante em relação ao átomo central na origem (`computeLigandPositions`).

| Geometria | Exemplo | Ângulo | Pares solitários | Construção |
|---|---|---|---|---|
| Linear | CO₂ | 180° | 0 | (±L, 0, 0) |
| Angular | H₂O | 104,5° | 2 | bissetriz em +Y; ligantes a ±α/2: `(±L sin(α/2), L cos(α/2), 0)` |
| Trigonal plana | BF₃ | 120° | 0 | 3 pontos a 120° no plano XZ |
| Piramidal trigonal | NH₃ | 107° | 1 | 3 pontos a 120° em azimute, inclinados em relação a −Y (ver abaixo) |
| Tetraédrica | CH₄ | 109,5° | 0 | vértices alternados do cubo: (±1, ±1, ±1)/√3 com produto dos sinais positivo |
| Bipiramidal trigonal | PCl₅ | 90°/120° | 0 | 3 equatoriais no plano XZ + 2 axiais em ±Y |
| Octaédrica | SF₆ | 90° | 0 | (±L,0,0), (0,±L,0), (0,0,±L) |

### Derivação da piramidal trigonal

Os três ligantes têm o mesmo ângulo θ com o eixo −Y e estão separados 120° em azimute. O ângulo α entre dois ligantes satisfaz (produto escalar de vetores unitários):

```
cos α = cos²θ + sin²θ · cos 120° = 1 − sin²θ − ½ sin²θ = 1 − (3/2) sin²θ
⇒ sin²θ = 2(1 − cos α) / 3
```

Com α = 107°, obtém-se θ ≈ 68,2°. O código implementa exatamente essa fórmula (`physics.ts:89`). É um bom exemplo para a monografia de como um requisito do domínio ("ângulo H–N–H = 107°") vira código verificável.

### Cores CPK

Os átomos usam as cores da convenção CPK (H branco, C cinza, N azul, O vermelho, F verde-claro, Cl verde, S amarelo, P laranja, B salmão), ajustadas para fundo escuro, e raios visuais aproximados.

## 3. Arquitetura do experimento

```
index.tsx                                  scene.ts                     physics.ts
─────────                                  ────────                     ──────────
estado: selectedId                         createMolScene(canvas,        MOLECULES (dados)
mol = MOLECULES.find(...)                    {molecule}, bg)             computeLigandPositions()
select de molécula ──────────────────────▶ update({molecule}) → buildMolecule()
painel: geometria, ângulo, pares,
  nota, legenda (lê direto de mol)
```

`physics.ts` aqui é **dado + função pura**: o componente React lê os metadados (nome, nota, pares solitários) diretamente da `MoleculeDefinition`, e a cena só precisa da geometria.

## 4. Construção da cena

| Elemento | Implementação |
|---|---|
| Átomo central | `SphereGeometry(raio CPK)` na origem |
| Ligantes | esferas nas posições de `computeLigandPositions` |
| Ligações | `CylinderGeometry(0,07)` com comprimento = distância; posicionado no **ponto médio** e orientado por **quaternion** `setFromUnitVectors((0,1,0), direção)` — o cilindro do Three.js nasce alinhado a Y, e o quaternion gira Y para a direção da ligação |
| Grupo | tudo dentro de `moleculeGroup`; `clearMolecule()` libera geometrias e materiais dos átomos antes de reconstruir |
| Luzes | ambiente + direcional principal + direcional azulada de preenchimento (por trás) |

O laço de animação só faz `controls.update()` + `render` — a molécula é **estática**; o movimento vem do usuário orbitando a câmera.

## 5. Interação

| Controle | Efeito |
|---|---|
| Select "Molécula" | Reconstrói a molécula |
| Mouse | Orbita (distância 2–20) |

## 6. Decisões e simplificações

- Pares solitários **não são desenhados** (só informados no painel).
- Ligações duplas (CO₂) desenhadas como simples.
- Comprimentos de ligação em unidades arbitrárias, não em Å.
- Na bipiramidal, o painel mostra 90° como "ângulo de ligação" (axial–equatorial), embora existam também os de 120°.

## 7. Limitações e problemas conhecidos

- No `dispose()`, depois de `clearMolecule()`, ainda há um `scene.traverse` que tenta liberar geometrias — redundante mas inofensivo.
- A troca de tema mantém a molécula escolhida (este experimento passa `mol` atual na recriação, então **não** sofre do débito D1).

## 8. Ideias para o TCC2

- Desenhar pares solitários como lóbulos semitransparentes.
- Modo "construir": o aluno escolhe nº de ligantes e de pares solitários, e o sistema deduz a geometria (tabela AXₙEₘ).
- Exibir o ângulo medido entre duas ligações clicadas (raycaster + produto escalar).
- Testes unitários: para cada molécula, verificar por produto escalar que os ângulos gerados batem com `bondAngleDeg` (±0,1°).

## 9. Sala interativa (Museu Virtual) e contrato montável

Desde 06/10/2026 a Geometria Molecular é um **experimento montável** (`core/mountable.ts`) e tem uma **sala interativa** no Museu Virtual (`sala.ts`). Ver `ARQUITETURA.md`, seção 22.

### O que mudou no `scene.ts`

- A construção da molécula (`moleculeGroup`, átomos, ligações) foi para `molecularGeometry.mount(root)`. `tick` não faz nada — a molécula é estática.
- `createMolScene(canvas, config, bg)` manteve a assinatura e virou `hostInPage(...)` com a mesma câmera (0; 1,5; 7), os mesmos limites de zoom (2–20) e as mesmas três luzes. `index.tsx` e `physics.ts` não mudaram.
- O `dispose` ficou mais simples: o `scene.traverse` redundante que existia antes sumiu, porque o experimento só libera o que ele mesmo criou.

Tamanho: 151 → 123 linhas (−28).

### A sala (`sala.ts`, 35 linhas)

| Item | Valor |
|---|---|
| Sala | 8 × 8 m |
| Posição | sobre um pedestal (raio 1 m, altura 0,8 m), centro da molécula a 2 m do chão |
| Escala | 0,5 (a maior molécula, SF₆/PCl₅, fica com ~2 m de diâmetro) |
| Giro automático | 0,4 rad/s em Y — o aluno vê todos os lados sem precisar dar a volta (mas pode) |
| Camada A — HUD | seleção da molécula (as 7 de `physics.ts`, com fórmula, nome e geometria) |
| Camada B | nenhuma |

### Como este experimento mexe na arquitetura

- É o caso **mínimo**: experimento estático, um único controle do tipo `select`. Mostra o custo-base de dar uma sala a um experimento: **35 linhas**, só de dados (sala, escala, giro, pedestal e a lista de opções).
- Exercitou dois recursos genéricos da sala que não precisam de código no experimento: `spin` (giro automático) e `pedestal` (desenha o pedestal e bloqueia a passagem).
- O `select` do HUD é gerado a partir de `MOLECULES` — a mesma tabela que alimenta o select da página. Uma molécula nova em `physics.ts` aparece nos dois lugares.
