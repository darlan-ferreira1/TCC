# CLAUDE.md: Exposição Virtual Interativa (TCC)

Detalhes técnicos do código. O contexto geral do TCC (trabalho antigo, por que mudou, regras) está no `CLAUDE.md` da raiz do repositório.

## O que é

Ambiente virtual interativo em 3D, no navegador, para o **ensino de Física (Mecânica) no ensino médio**. O aluno anda em 1ª pessoa por um salão com alas e salas. Cada sala tem uma simulação, quadros de teoria e história, um "i" explicativo e um modo de inspeção.

**Objetivo do TCC:** integrar **exercícios de uma lista resolvida à mão**, de modo que **a resposta do aluno vire o fenômeno na cena**. Se o aluno erra a conta, a cena mostra o resultado errado.

- **Curso:** TCC de Ciência da Computação, UFC Quixadá.
- **Orientador:** Prof. Rubens Fernandes Nunes.
- **Prazo:** o semestre termina em 11/12/2026.
- **Origem:** o projeto foi separado do CLARA.js em 17/11/2026, a partir do commit `3d636c4`. O CLARA.js continua existindo à parte, e esta exposição volta para ele depois da formatura.

## Decisões já tomadas (não rediscutir)

- **Tema:** Física (Mecânica).
  - As salas de Química e Biologia vieram junto na cópia e podem ser removidas (ver "Tarefas").
- **Termo:** **não usar "museu"** em textos do TCC nem na interface. Um membro da banca disse que invade a área da Museologia. Usar **"ambiente virtual interativo"** ou **"exposição virtual interativa"** (a escolha final será feita com o orientador).
  - O código ainda usa `museum`, `VirtualMuseum` e `MuseumScene` nos nomes internos. Renomear é opcional e só deve ser feito se o usuário pedir.
- **Fora do escopo:** MediaPipe, RA, RV/WebXR. O orientador tirou.
- **Uso de IA:** o projeto é desenvolvido com o Claude Code, e isso **será declarado e relatado no TCC** (ver `proposta/ia_questao.md`).
  - **Anote os erros que a IA cometer e como foram detectados.** Isso vira resultado.

## Regras do usuário

- **Commits e push:** nunca fazer `git commit`, `git push` nem PR sem pedido explícito, porque o usuário versiona sozinho.
- **Idioma:** respostas, comentários, documentação e textos de interface em **português (pt-BR)**.
- **Tamanho das respostas:** curtas. O usuário se sobrecarrega com respostas longas. Listas grandes vão para arquivos.
- **Explicações:** o usuário fez o projeto com muita ajuda de IA e não conhece todo o código, então explique as mudanças de forma didática.
- **Monografia (`docs/tccfiles/`):**
  - o texto é **do usuário**: não corrigir conteúdo sem ele pedir;
  - **não compilar LaTeX**, porque o texto oficial fica no Overleaf;
  - `DarlanObs:{...}` nos arquivos é uma observação do usuário: leia, aja e apague a marca.
- **Dados:** **nunca inventar** dados de pesquisa, resultados ou testes que não existem. Valores não medidos ficam como `\pendente`.
- **Privacidade:** não enviar dados pessoais do usuário (e-mail, nome) para serviços externos.

## Comandos (dentro de `exposicao/`)

```bash
npm install
npm run dev       # http://localhost:5173/
npm run build     # tsc -b && vite build → dist/
npm run lint
npm run preview   # serve o dist/
```

Depois de mudar código, rode no mínimo `npm run build` e `npm run lint`.

`vite.config.ts` usa `base: './'`, então o build funciona em qualquer endereço. Ainda **não há** deploy automático: para o GitHub Pages, é preciso criar um workflow (pode copiar o `deploy.yml` do CLARA.js, trocando `frontend` por `exposicao`).

## Estrutura

```
src/
  main.tsx, App.tsx       # App abre direto na exposição (sem galeria nem rotas)
  index.css               # tokens de cor (var(--…)); tema escuro padrão, .light = claro
  core/
    mountable.ts          # contrato das simulações: mount({root}, cfg) → { update, tick(dt), dispose }
    controls.ts           # ControlDef (controles declarativos) + stepControl
    gamepad.ts            # Gamepad API → analógicos/botões
    textPanel.ts          # painel de texto 3D (canvas) com fonte autoajustável
    hostInPage.ts         # hospedeiro de página antigo; só os scene.ts antigos o usam
  components/ControlsHud/ # painel de ajustes (Tab / ⚙ / Start)
  museum/                 # a exposição em si
    index.tsx             # componente React: HUD, instruções, pop-up, inspeção, toque/controle
    scene.ts              # renderer, câmera, PointerLockControls, laço, troca de fases (véu preto)
    levels.ts             # fases: salão → ala → sala (mesma interface Level)
    layout.ts             # geometria pura (portas, paredes, obstáculos, pedestais)
    builders.ts           # construção 3D compartilhada (paredes, portas, placas, "i", cavaletes)
    portas.ts             # portas do salão que levam direto a uma sala (lista fixa)
    alas.ts               # alas temáticas (Mecânica, Modelos Atômicos) e suas salas
    conteudo.ts           # TEXTOS: resumo (i do pedestal), observar (i da sala), quadros Teoria/História
    miniaturas.ts         # miniaturas animadas dos pedestais
    InfoPopup.tsx, info.ts# pop-up paginado ◀ ▶
    TouchControls.tsx     # joystick e arrastar no celular
    interactiveRoom.ts    # tipo InteractiveRoom (o que um sala.ts exporta)
  simulations/<área>/<Nome>/
    physics.ts            # física pura (sem three/react), quando existe
    scene.ts              # Three.js, exporta o objeto montável
    sala.ts               # exporta `sala: InteractiveRoom` (sala, controles, inspeção, posição do "i")
```

**Salas de Física:**
- `physics/Pendulum` (Pêndulo de Galileu);
- `physics/ProjectileRoom` (Lançamento);
- `physics/KeplerRoom`;
- `physics/WavesRoom` (Ondas);
- `physics/ConicalPendulum`;
- `physics/FoucaultPendulum`.

**Salas de Química e Biologia** (herdadas): Bohr, Geometria Molecular, Dalton, Thomson, Rutherford e DNA.

## Convenções e armadilhas

- **Estilo:** `style={{}}` inline com `var(--token)`. Não há Tailwind.
- **Liberar recursos:** tudo o que o Three.js cria (geometria, material, textura, listener, laço) precisa ser liberado no `dispose()`. O StrictMode monta duas vezes em dev, e um dispose incompleto aparece como canvas ou laço duplicado.
- **Passo de tempo no laço:** `dt = Math.min((t - last) / 1000, 0.05)`.
- **Precisão da física:** fica no `tick` da simulação (passo máximo do integrador), não no laço.
- **Luz:** a luz que faz parte do fenômeno (ex.: o Sol de Kepler) fica no `mount` e precisa ter `distance` e `decay`, senão tinge as paredes. A luz de ambiente é do hospedeiro.
- **Gravidade:** g = 10 m/s² nas salas e na lista.
- **Dados de alta frequência:** nunca passam por `setState`.
- **Nova sala:** criar a pasta com `scene.ts` + `sala.ts`, registrar em `alas.ts` (`WING_ROOMS` + `entries` da ala) ou em `portas.ts`, e escrever os textos em `conteudo.ts` com o mesmo id.

## Tarefas em aberto (ordem sugerida)

1. **Sistema de exercícios (o núcleo do TCC):**
   - enunciado na sala → o aluno digita a resposta → **a cena é montada com a resposta** → comparação com o resultado correto, com tolerância e dica.
   - Começar pelo Lançamento (exercício 7: alcance com v₀ = 20 m/s e 30°) e pelo Pêndulo (exercício 2: L para T = 2 s).
   - Os exercícios estão em `proposta/listas-de-exercicios.md`.
2. **Questões do ENEM** com figura conceitual em versão 3D, como desafio final.
3. **Decidir com o orientador** se remove as salas de Química e Biologia. Para remover:
   - apagar as pastas `simulations/chemistry` e `simulations/biology`;
   - tirar a ala `ala-atomos` de `alas.ts`;
   - tirar as portas de `portas.ts`;
   - tirar as entradas de `conteudo.ts` e `miniaturas.ts`.
4. **Nome final do projeto** e textos da tela (o título hoje é "Exposição Virtual Interativa").
5. **Contador de tentativas por exercício** (anônimo), para a pesquisa.
6. **Testes de ponta a ponta** (os do CLARA ficaram para trás) e um workflow de deploy.

## Texto do TCC (pasta `tcc-files/`)

Rascunho da monografia em LaTeX para o Overleaf, um arquivo por capítulo (mesmos nomes do TCC antigo), no modelo do TCC do Gustavo. `extra.txt` explica como montar no Overleaf. `figuras/` tem os prints da exposição (refazer quando a interface mudar). `08-Referencias.txt` é BibTeX. O texto passa a ser do usuário: não alterar conteúdo sem ele pedir; `\pendente` = valor ainda não medido.

## Documentos do TCC (pasta `proposta/`)

| Arquivo | Conteúdo |
|---|---|
| `proposta-5w2h.md` | Proposta para o orientador (5W2H) |
| `listas-de-exercicios.md` | Lista de Mecânica (1–13) + extras (cônico, Foucault, esférico) com gabarito |
| `gustavo.md` | "Receita" do TCC do Gustavo (ECOS, 2026, mesmo orientador): o modelo a seguir |
| `trabsRel.md` | 5 trabalhos relacionados: estudo + texto P1/P2/P3 |
| `trabsParecidos.md` | Physlets (2002) e Jalk Duque et al. (2026), os mais próximos da ideia |
| `ia_questao.md` | Como o uso de IA entra no TCC |
| `roteiro_pesquisa.md` | Roteiro da avaliação com usuários (pré → tarefas → pós) |
| `pesquisa.md` | Perguntas: perfil, pré/pós-teste, SUS, Likert, abertas |
| `analise-ecos.md` | Análise técnica do ECOS (por que carrega devagar) |

**A contribuição em uma frase:** nos trabalhos analisados, a simulação fornece os dados ou valida a resposta; aqui, **a resposta do aluno é a entrada da simulação**, dentro de um ambiente 3D navegável.
