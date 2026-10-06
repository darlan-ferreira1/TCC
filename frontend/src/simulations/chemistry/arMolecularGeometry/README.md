# Geometria Molecular — AR (Realidade Aumentada)

| | |
|---|---|
| **id** (`registry.ts`) | `ar-molecular-geometry` |
| **Área** | Química — Geometria molecular (VSEPR) |
| **Modalidade** | **Realidade aumentada** (WebXR `immersive-ar` + hit-test + dom-overlay), com prévia 3D no navegador |
| **Arquivos** | `ar.ts` (21 linhas) — só a definição; a página e o hospedeiro AR são genéricos (`src/ar/`) |
| **Reaproveita** | `MolecularGeometry/scene.ts` (conteúdo montável) e `MolecularGeometry/sala.ts` (controles) |
| **Requer** | Celular Android com Chrome e ARCore; HTTPS |
| **Criado em** | 06/10/2026 |

## 1. Objetivo pedagógico

Colocar moléculas sobre a mesa e observar as geometrias VSEPR de todos os ângulos — o ângulo de 104,5° da água, a pirâmide da amônia, o tetraedro do metano — girando e aproximando com as mãos, como um modelo molecular de bolinhas que se pode trocar com um toque.

## 2. Como usar

1. **Iniciar AR** → mova o celular até aparecer o anel branco sobre a mesa → **toque** para posicionar.
2. Gestos: **arrastar** move; **pinça** redimensiona (20% a 500%); **girar com dois dedos** gira.
3. **⚙ Ajustes** troca a molécula (as 7 da página) sem sair do AR.

## 3. Modelo científico

O mesmo da página: posições dos ligantes calculadas pela teoria VSEPR. Ver `MolecularGeometry/README.md` e a aba **Teoria**.

## 4. Como foi feito

Esta é a primeira variante AR criada **depois** do hospedeiro AR genérico, e por isso é a melhor demonstração da arquitetura: a Geometria Molecular **não tinha AR** e ganhou sem nenhuma linha de cena nova. Bastou declarar como ela aparece em AR:

```ts
export const ar: ARDefinition<MolSceneConfig> = {
  experiment: molecularGeometry, // o mesmo conteúdo da página e do museu
  controls: sala.controls,       // os mesmos controles da sala interativa
  toConfig: sala.toConfig,
  scale: 0.08,                   // a maior molécula fica com ~34 cm
  lift: 0.2,                     // centro 20 cm acima da superfície
  previewDistance: 0.8,
};
```

…mais a entrada no `registry.ts` e uma linha no `App.tsx`. Ver `ARQUITETURA.md`, seção 23.

## 5. Limitações

- Só Android + Chrome com ARCore.
- Pares solitários não são desenhados (igual à página).
- Sem âncoras do WebXR e sem estimativa de luz.
