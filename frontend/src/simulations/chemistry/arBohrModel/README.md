# Modelo de Bohr — AR (Realidade Aumentada)

| | |
|---|---|
| **id** (`registry.ts`) | `ar-bohr-model` |
| **Área** | Química — Estrutura atômica |
| **Modalidade** | **AR** (WebXR `immersive-ar`) com fallback desktop |
| **Arquivos** | `scene.ts` (251 linhas) · `index.tsx` (138) — **sem `physics.ts` próprio** |
| **Dependências** | `three`, `ARButton`, `OrbitControls`, `react`, `../BohrModel/physics` |
| **Requer** | Celular Android com ARCore + Chrome (iOS Safari não suporta `immersive-ar`), HTTPS |

## 1. Objetivo pedagógico

Projetar o átomo no ambiente real, visto pela câmera do celular. O aluno caminha ao redor e através das órbitas.

## 2. Modelo científico — reutilizado

Igual ao VR: importa `computeElectronPositions` e `shellRadius` de `../BohrModel/physics`. O que muda é a escala, agora pensada para caber numa sala:

| Parâmetro | Desktop | VR | AR (este) |
|---|---|---|---|
| `baseRadius` | 2,0 | 2,0 m | **0,30 m** |
| Camadas 1/2/3/4 | 2 / 8 / 18 / 32 | 2 / 8 / 18 / 32 m | 0,3 / 1,2 / 2,7 / 4,8 m |
| `baseOmega` | 2,0 | 0,7 | 0,7 |
| Posição | origem | (0; 1,6; −4) | **(0; 1,2; −1,5)** |
| Raio do núcleon | 0,22 | 0,2 | 0,022 m |

Ver `BohrModel/README.md` para as equações.

## 3. Arquitetura do experimento

Idêntica à do `xrBhorModel` (container, botão exposto, `setElement`, `onElementChange`), trocando `VRButton` por `ARButton` e `vrButton` por `arButton`. Não há painel 3D com `CanvasTexture`: a informação do elemento fica no HTML.

## 4. O que é específico de AR

### Fundo transparente (passthrough)

```ts
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });  // canal alpha
renderer.setClearColor(0x0a0a1a, 1);   // fora da sessão: fundo escuro opaco

renderer.xr.addEventListener('sessionstart', () => {
  renderer.setClearColor(0x000000, 0);  // alpha 0 → a imagem da câmera aparece por trás
  controls.enabled = false;
});
```

No AR o navegador compõe a imagem da câmera **atrás** do canvas WebGL; qualquer pixel com alpha 0 deixa o mundo real visível.

### Iluminação neutra

`HemisphereLight` (céu branco, chão cinza) + uma direcional suave. Luzes coloridas fortes (como no VR) ficariam artificiais sobre a imagem real.

### Âncora implícita

O átomo é colocado em coordenadas fixas do *reference space* (`local-floor`), ou seja, 1,5 m à frente e 1,2 m acima do chão **em relação a onde o celular estava quando a sessão começou**. Não usa *hit-test* (detecção de superfícies) nem âncoras.

### Entrada

Em AR de celular, tocar a tela gera um evento `select` no "controlador" 0, então `selectstart` do `ctrl0` avança o elemento.

## 5. Laço, resize e dispose

Iguais ao VR: `setAnimationLoop`, `ResizeObserver` ignorado durante a sessão, `dispose()` com `orbitDisposables` (sem o vazamento do desktop).

## 6. Interação

| Contexto | Entrada | Efeito |
|---|---|---|
| Fora da sessão | Select, mouse | Troca elemento / orbita |
| Fora da sessão | Botão "START AR" | Inicia AR |
| Sessão AR | Toque na tela | Próximo elemento |
| Sessão AR | Andar com o celular | Explorar o átomo |

## 7. Limitações e problemas conhecidos

- **Controles HTML não aparecem durante a sessão AR** (D4, verificar em aparelho): o `ARButton` foi criado sem `domOverlay`; nas versões recentes do Three.js ele cria seu próprio overlay contendo só o botão de fechar. O comentário no topo de `scene.ts` ("Controles HTML permanecem visíveis") não corresponde a isso. Correção:
  ```ts
  ARButton.createButton(renderer, {
    optionalFeatures: ['dom-overlay'],
    domOverlay: { root: containerOuPainel },
  });
  ```
- O overlay criado pelo `ARButton` é anexado ao `document.body` e não é removido no `dispose`.
- Sem *hit-test*: o átomo pode aparecer "dentro" de uma mesa ou parede.
- Sem estimativa de luz real (`light-estimation`).
- Gatilho esquerdo (`ctrl1`) não existe em celular — só é possível avançar, não voltar.
- Tabela de elementos e construção do átomo duplicadas (D3).

## 8. Ideias para o TCC2

- `hit-test` para o usuário escolher onde "pousar" o átomo (retícula + toque), padrão de mercado em AR.
- `dom-overlay` para manter o select de elemento visível na sessão.
- Medir FPS no celular em AR vs. desktop para a seção de avaliação de desempenho.
