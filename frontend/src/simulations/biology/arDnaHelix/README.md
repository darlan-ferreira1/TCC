# Dupla Hélice de DNA — AR (Realidade Aumentada)

| | |
|---|---|
| **id** (`registry.ts`) | `ar-dna-helix` |
| **Área** | Biologia — Biologia molecular |
| **Modalidade** | **Realidade aumentada** (WebXR `immersive-ar` + hit-test + dom-overlay), com prévia 3D no navegador |
| **Arquivos** | `ar.ts` (20 linhas) — só a definição; a página e o hospedeiro AR são genéricos (`src/ar/`) |
| **Reaproveita** | `DnaHelix/scene.ts` (conteúdo montável) e `DnaHelix/sala.ts` (controles) |
| **Requer** | Celular Android com Chrome e ARCore; HTTPS. O Safari do iPhone não suporta AR pela web (aparece um aviso) |

## 1. Objetivo pedagógico

Colocar uma hélice de DNA sobre a mesa ou o chão e observá-la de perto: o aluno caminha ao redor, aproxima o celular dos pares de base e muda o tamanho da molécula com os dedos.

## 2. Como usar

1. Toque em **Iniciar AR** e permita o uso da câmera.
2. Mova o celular devagar, apontando para o chão ou uma mesa, até aparecer o **anel branco** (retícula).
3. **Toque na tela** para colocar a hélice ali.
4. Gestos: **arrastar** move; **pinça** redimensiona (20% a 500%); **girar com dois dedos** gira. Botões: **↺ Reposicionar**, **⚙ Ajustes** (pares de base e rotação) e **✕ Sair**.

## 3. Modelo científico

A mesma hélice B-DNA da página (10 pares por volta, 0,34 por par, fitas defasadas 180°). Ver `DnaHelix/README.md` e a aba **Teoria**.

## 4. Como foi feito

Até 06/10/2026 esta pasta tinha um `scene.ts` (210 linhas) e um `index.tsx` (112 linhas) próprios, com a matemática da hélice **reimplementada** (débito D3), a hélice fixa 1,5 m à frente do celular e centrada no nível do chão (metade dela ficava "enterrada", débito D22).

Agora a hélice é exibida pelo **hospedeiro AR genérico** (`src/ar/scene.ts`, `hostInAR`). Esta pasta só declara:

```ts
export const ar: ARDefinition<DnaSceneConfig> = {
  experiment: dnaHelix,        // o mesmo conteúdo da página e do museu
  controls: sala.controls,     // os mesmos controles da sala interativa
  toConfig: sala.toConfig,
  scale: 0.08,                 // 20 pares → ~54 cm de altura
  lift: 0.3,                   // centro 30 cm acima da superfície (a hélice "nasce" apoiada)
  previewDistance: 1.3,
};
```

Com isso a duplicação da matemática da hélice **acabou** nesta variante e o problema do "meio enterrado" também. Ver `ARQUITETURA.md`, seção 23.

## 5. Limitações

- Só Android + Chrome com ARCore.
- O `lift` é fixo: com muitos pares de base (até 40) a hélice fica mais alta e a parte de baixo pode atravessar a superfície. Basta diminuir com a pinça ou reduzir os pares.
- Sem âncoras do WebXR e sem estimativa de luz.
