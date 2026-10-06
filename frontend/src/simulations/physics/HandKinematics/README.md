# Você é o Móvel (Cinemática com a mão)

| | |
|---|---|
| **id** (`registry.ts`) | `hand-kinematics` |
| **Área** | Física — Cinemática (MU, MUV, leitura de gráficos) |
| **Modalidade** | **Interação natural**: rastreamento da mão pela webcam (MediaPipe Hand Landmarker), com mouse como alternativa |
| **Arquivos** | `physics.ts` (159 linhas) · `scene.ts` (232) · `index.tsx` (192) |
| **Dependências** | `@mediapipe/tasks-vision` (via `core/handTracking.ts`), `react`; **sem Three.js** (gráficos em canvas 2D) |
| **BNCC** | EM13CNT101 — analisar e representar movimentos "com ou sem o uso de dispositivos e de aplicativos digitais" |
| **Criado em** | 06/10/2026 |

## 1. Objetivo pedagógico

Ler gráficos de cinemática é uma das dificuldades clássicas do ensino médio. Aqui o aluno **é** o móvel: move a mão diante da câmera e vê os gráficos de **posição × tempo** e **velocidade × tempo** se formando ao vivo. Desafios com nota (repouso, MU, ida e volta, MUV) mostram um alvo tracejado que o aluno tenta reproduzir com o próprio corpo.

## 2. Modelo e algoritmos (`physics.ts`)

### Calibração: de pixels a metros

A câmera só mede pixels. A palma da mão (punho → base do dedo médio, pontos 0 e 9 do MediaPipe) mede ~9,5 cm em um adulto e serve de régua:

```
metros por pixel = 0,095 m / mediana(tamanho da palma em pixels, 20 quadros)
```

A **mediana** descarta quadros ruins. A conversão vale enquanto a mão se move **de lado**, à mesma distância da câmera (o aviso na tela pede isso). A precisão é de ±15–20% (as mãos variam de tamanho) — suficiente para o objetivo didático, que é a **forma** dos gráficos.

### Velocidade sem amplificar o ruído

A posição detectada treme alguns milímetros por quadro. `Δx/Δt` entre quadros vizinhos amplificaria isso. A velocidade é a **inclinação da reta de mínimos quadrados** das posições dos últimos 0,25 s:

```
v = Σ(tᵢ − t̄)(xᵢ − x̄) / Σ(tᵢ − t̄)²
```

É a própria ideia de "velocidade = inclinação de x(t)" que o aluno aprende, aplicada a uma janela curta. Testado: MU de 8 cm/s com ruído de ±3 mm → ~7–8 cm/s; MUV de 4 cm/s² → 4,00 cm/s².

### Desafios e nota

| Desafio | Alvo (deslocamento a partir do início) | Conceito |
|---|---|---|
| Repouso | x = 0 por 4 s | v = 0 |
| Movimento uniforme | x = 0,08·t por 4 s | x(t) reta, v(t) constante |
| Ida e volta | 20 cm em 2,5 s e volta | sinal de v = sentido |
| Acelerando | x = ½·0,04·t² por 4 s | x(t) parábola, v(t) reta |

A nota compara o movimento gravado com o alvo pelo **erro quadrático médio (RMS)**: `nota = 100 · (1 − RMS / tolerância)`. A tolerância acompanha o tamanho do movimento (metade da amplitude do alvo, mínimo 3 cm). Esse ajuste veio de um teste: com tolerância fixa de 5 cm, fazer o MU na metade da velocidade dava nota 0, desanimador para um aluno que entendeu a ideia; agora dá 42.

## 3. Arquitetura

```
index.tsx  ── useHandCamera (webcam + MediaPipe, compartilhado) ──┐
   │  readPosition(): mão calibrada → metros  |  mouse → metros    │
   ▼                                                                │
scene.ts (canvas 2D) ── a cada quadro: readPosition() → physics ───┘
   │                     máquina de estados do desafio, desenho dos gráficos
   ▼
physics.ts (puro): calibração, slope, histórico, desafios, nota
```

- A cena **não sabe** se a posição veio da mão ou do mouse: recebe uma função `readPosition()`. É a terceira ocorrência do padrão de abstração de entrada do projeto (Dissecação: `PinchState`; Museu Virtual: vetor de movimento).
- O rastreamento da mão é o módulo comum `core/handTracking.ts` + o gancho `components/handInput/useHandCamera.ts`, que só roda a rede neural quando chega um quadro **novo** da câmera.
- A "cena" é 2D (canvas), não Three.js: a convenção de 3 arquivos foi mantida, mas `scene.ts` aqui desenha gráficos — mostra que a separação domínio × apresentação não depende do motor gráfico.

## 4. Interação

| Ação | Como |
|---|---|
| Mover o "móvel" | Mover a mão aberta para os lados diante da câmera |
| Sem câmera | Clicar e arrastar na área do gráfico (largura da área = 60 cm) |
| Desafio | Botões "Repouso", "Movimento uniforme", "Ida e volta", "Acelerando": contagem de 3 s → gravação → nota + conceito |
| Limpar / Recalibrar | Botões no painel |

## 5. Limitações

- Só o eixo horizontal (movimento lateral).
- Escala aproximada (tamanho de mão varia); afastar/aproximar a mão da câmera distorce a medida.
- A câmera entrega ~30 quadros/s; movimentos muito bruscos ficam "serrilhados".
- Depende de CDN para o modelo do MediaPipe (igual à Dissecação).

## 6. Ideias de evolução

- Gráfico de aceleração a(t) (exige filtrar mais o ruído).
- Eixo vertical: lançar algo para cima e ver a desaceleração (a = −g não é reproduzível com a mão, mas a forma do gráfico é).
- Comparar dois alunos (duas mãos, duas curvas).
