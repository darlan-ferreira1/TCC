# Modelo de Bohr — AR (Realidade Aumentada)

| | |
|---|---|
| **id** (`registry.ts`) | `ar-bohr-model` |
| **Área** | Química — Estrutura atômica |
| **Modalidade** | **Realidade aumentada** (WebXR `immersive-ar` + hit-test + dom-overlay), com prévia 3D no navegador |
| **Arquivos** | `ar.ts` (20 linhas) — só a definição; a página e o hospedeiro AR são genéricos (`src/ar/`) |
| **Reaproveita** | `BohrModel/scene.ts` (conteúdo montável) e `BohrModel/sala.ts` (controles) |
| **Requer** | Celular Android com Chrome e ARCore; HTTPS. O Safari do iPhone não suporta AR pela web (aparece um aviso) |

## 1. Objetivo pedagógico

Colocar o átomo sobre uma mesa ou o chão da sala de aula e observá-lo de qualquer ângulo, aproximando o celular. O aluno escolhe onde o átomo fica, aumenta, diminui e gira com os dedos, e troca o elemento sem sair do AR.

## 2. Como usar

1. Toque em **Iniciar AR** e permita o uso da câmera.
2. Mova o celular devagar, apontando para o chão ou uma mesa, até aparecer um **anel branco** (retícula) sobre a superfície.
3. **Toque na tela**: o átomo é colocado onde está o anel, de frente para você.
4. Ajuste com os dedos:

| Gesto | Efeito |
|---|---|
| Arrastar com um dedo | Move o átomo sobre a superfície |
| Pinça (dois dedos) | Aumenta ou diminui (de 20% a 500% do tamanho inicial) |
| Girar com dois dedos | Gira o átomo em torno do eixo vertical |
| Botão **↺ Reposicionar** | Volta para a retícula, para colocar em outro lugar |
| Botão **⚙ Ajustes** | Troca o elemento e a velocidade, durante o AR |
| Botão **✕ Sair** | Encerra a sessão AR |

## 3. Modelo científico

O mesmo do Modelo de Bohr da página (r ∝ n², ω ∝ 1/n³). Ver `BohrModel/README.md` e a aba **Teoria**.

## 4. Como foi feito

Até 06/10/2026 esta pasta tinha um `scene.ts` (232 linhas) e um `index.tsx` (120 linhas) próprios: uma cópia da cena do Bohr com outra escala, a tabela de elementos repetida, o átomo fixo a 1,5 m à frente do celular (o usuário tinha de procurá-lo) e controles HTML que sumiam durante a sessão.

Agora o experimento é exibido pelo **hospedeiro AR genérico** (`src/ar/scene.ts`, função `hostInAR`), o terceiro hospedeiro do contrato montável, ao lado da página (`hostInPage`) e da sala do Museu Virtual. Esta pasta só declara **como** o Bohr aparece em AR:

```ts
export const ar: ARDefinition<BohrSceneConfig> = {
  experiment: bohrModel,       // o mesmo conteúdo da página e do museu
  controls: sala.controls,     // os mesmos controles da sala interativa
  toConfig: sala.toConfig,
  scale: 0.04,                 // camada 1 = 8 cm, camada 2 = 32 cm de raio
  lift: 0.35,                  // núcleo 35 cm acima da superfície
  previewDistance: 1.4,        // câmera da prévia no navegador
};
```

O funcionamento do hospedeiro (hit-test, retícula, posicionamento, gestos, dom-overlay) está em `ARQUITETURA.md`, seção 23.

## 5. Limitações

- Só Android + Chrome com ARCore (limitação do WebXR, não do projeto).
- A detecção de superfície precisa de luz e textura: mesa branca lisa ou piso muito brilhante dificultam.
- O objeto é posicionado no ponto da superfície, mas não usa âncoras do WebXR: em sessões longas, o rastreamento pode "escorregar" alguns centímetros.
- Sem estimativa de luz do ambiente (`light-estimation`).
