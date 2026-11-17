# Receita do TCC do Gustavo (ECOS), para fazer o meu no mesmo formato

> **Atualização de 17/11/2026:**
> - **Tema:** Física.
> - **Termo:** onde este arquivo diz "museu", leia **"ambiente virtual interativo / exposição virtual interativa"**, porque a banca disse que "museu" invade a Museologia.
> - **Trabalhos relacionados:** o estudo detalhado está em `trabsRel.md`.

**Fonte:** BRITO, João Gustavo Feitosa. *ECOS: uma exposição virtual de artefatos espaciais baseada em Web 3D*. TCC (Ciência da Computação), UFC Quixadá, 2026, 47 f. Orientador: Prof. Dr. Rubens Fernandes Nunes. Aprovado em 23/01/2026.
**Banca:** Paulyne Matthews Jucá e João Vilnei de Oliveira Filho.

## 0. Visão geral (tamanho de cada parte)

| Cap. | Título | Páginas | O que tem |
|---|---|---|---|
| 1 | Introdução | 12–14 (≈2,5) | 7 parágrafos, objetivos e organização |
| 2 | Fundamentação Teórica | 15–26 (≈12) | o tema (astronomia) e a tecnologia (WebGL → Three.js → A-Frame) |
| 3 | Trabalhos Relacionados | 27–30 (≈4) | 3 trabalhos e um quadro comparativo |
| 4 | Metodologia | 31–35 (≈5) | um fluxograma, as etapas de desenvolvimento e a avaliação |
| 5 | Resultados e Discussão | 36–43 (≈8) | telas de cada ambiente, gráficos do questionário e discussão |
| 6 | Conclusão e Trabalhos Futuros | 44–45 (≈2) | 4 parágrafos e 4 itens futuros |
| — | Referências | 46–47 | 25 referências |

São só 34 páginas de texto. O trabalho é **curto, simples e bem amarrado**: o que a introdução promete é o que a metodologia faz e o que os resultados mostram.

**Pré-textuais:** resumo (1 parágrafo: problema → objetivo → metodologia → resultado), abstract, 5 palavras-chave, lista de figuras (18), lista de quadros (2) e sumário. Sem lista de siglas.

---

## 1. Introdução: a estrutura dele

Ele **não usa subtítulos** para contexto, problema e justificativa. É um texto corrido em que cada parágrafo tem uma função, seguido de duas subseções formais.

| § | Função | O que ele escreveu (resumo) | O que eu escrevo |
|---|---|---|---|
| 1 | **Contextualização histórica** | Desde a antiguidade o céu desperta curiosidade; a astronomia serviu à agricultura e à medição do tempo (Pannekoek; Kuhn; Filho) | Mecânica: de Galileu (pêndulo) a Newton e Kepler. Átomos: de Dalton a Bohr. Usar 2–3 citações de livros de história da ciência |
| 2 | **Contextualização (marco)** | A era espacial, o Sputnik (1957) e a Lua (1969) (Saraiva) | Por que esses conteúdos são base do ensino médio e caem no ENEM (citar a BNCC e a matriz do ENEM) |
| 3 | **Problemática** | Os artefatos são inacessíveis, e os painéis e vídeos estáticos não mostram o 3D (Vinhas) | O aluno resolve a conta no papel e **nunca vê o fenômeno**. O livro mostra uma figura parada e o erro de cálculo não tem consequência visível. Citar um artigo sobre dificuldade em física/química no EM |
| 4 | **Solução genérica** | Ambientes virtuais 3D superam barreiras físicas | Simulações e ambientes 3D tornam o fenômeno visível (citar PhET/Wieman) |
| 5 | **Justificativa com evidência** | Estudos mostram que o 3D ajuda a compreensão (Cardoso et al., 2014) | Uma evidência de que simulação e feedback visual ajudam a aprender. Somar o argumento "a resposta do aluno vira o fenômeno" |
| 6 | **Proposta** | "Este trabalho propõe…" uma exposição Web 3D no navegador com os artefatos X, Y e Z | "Este trabalho propõe um museu virtual 3D com exercícios interativos de [tema] para o EM, no navegador, baseado em uma lista de exercícios resolvida à mão" |
| 7 | **Como será feito e o diferencial** | Seleção dos objetos → ambientes → navegação → avaliação; "transforma a observação passiva em engajamento ativo" | Seleção dos conteúdos e exercícios → salas → exercícios com feedback visual → avaliação com usuários. Incluir aqui a frase sobre IA (como a IA ajudou a gerar) |

**1.1 Objetivos**
- **Objetivo geral:** uma frase só. Verbo "desenvolver" + o quê + para quem + com qual tecnologia.
  - Ele: "desenvolver uma exposição digital interativa baseada em Web 3D … utilizando o framework A-Frame".
- **Objetivos específicos:** **apenas 3**, um por etapa do trabalho.
  1. estudo inicial do tema;
  2. desenvolver a aplicação com navegação e interação;
  3. aplicar um questionário para avaliar a experiência.
- Eu faria 4:
  1. elaborar e resolver a lista de exercícios;
  2. desenvolver o museu com as salas;
  3. implementar os exercícios com feedback visual;
  4. avaliar com usuários.

**1.2 Organização do trabalho:** uma lista de 5 itens, um por capítulo, cada um com uma frase.

> ⚠ **Pontos fracos dele que a banca pode cobrar de mim:**
> - ele **não tem uma questão de pesquisa explícita** nem uma subseção de justificativa;
> - o meu já tem a questão de pesquisa no 5W2H, e posso colocá-la como parágrafo final antes dos objetivos.

---

## 2. Fundamentação Teórica: a estrutura dele

Ele usa um **funil em 3 blocos**. Cada conceito entra porque é usado depois.

1. **2.1 O tema (o conteúdo da exposição)**, com 4 subseções:
   - artefatos espaciais (introdução);
   - satélites, com uma lista LEO/MEO/GEO e uma figura;
   - sondas, com a lista flyby/orbiter/lander e duas figuras;
   - telescópios, com uma figura do espectro e uma comparação Terra × Hubble.

   Cada subseção explica **os objetos que aparecem no museu**. Usa livros técnicos (Elbert, Bely, Petrescu) e figuras da NASA.
2. **2.2 Ambientes virtuais interativos**, com a base teórica de "por que o 3D funciona":
   - Slater (2009): imersão, ilusão de lugar e ilusão de plausibilidade;
   - Lepouras (2004): museu virtual.
3. **2.3 Tecnologias Web 3D**, do mais baixo ao mais alto nível:
   - OpenGL/WebGL (Hearn & Baker; Parisi);
   - Three.js (Danchilla);
   - A-Frame, com ECS e primitivas (Neelakantam & Pant), mais uma figura do ECS e uma das primitivas.

**Minha versão:**
- **2.1 O conteúdo.**
  - Mecânica: pêndulo simples (T = 2π√(L/g)), lançamento oblíquo, Kepler, ondas e pêndulo cônico/Foucault.
  - Átomos: Dalton, Thomson, Rutherford, Bohr e geometria.
  - Uma subseção por sala, com **fórmula e figura**, citando livros do EM e de física básica (Halliday, Nussenzveig, Feltre, Atkins).
- **2.2 Fundamentação pedagógica**, o bloco que o Gustavo não tem e que fortalece o meu:
  - aprendizagem com simulações;
  - feedback imediato;
  - resolução de problemas;
  - talvez a aprendizagem significativa de Ausubel.

  Somar Slater para a imersão.
- **2.3 Ambientes virtuais e museus virtuais**, com Slater e Lepouras (pode reaproveitar as mesmas citações dele).
- **2.4 Tecnologias.** WebGL → Three.js (que eu uso direto, sem A-Frame) → React/Vite → PointerLockControls/OrbitControls.
- **2.5 (opcional) IA generativa no desenvolvimento**, se o professor quiser a parte de IA.

---

## 3. Trabalhos Relacionados: a estrutura dele (o molde)

**Abertura (1 parágrafo, 3 linhas):** "Nesta seção são apresentados trabalhos que utilizam [tecnologias] no contexto de [domínio]. O objetivo é analisar implementações existentes … a fim de situar a proposta deste trabalho."

**Cada trabalho é uma subseção** cujo título é o **título do artigo**, com **3 parágrafos curtos e 1 figura**:

| Parágrafo | Conteúdo | Frase-modelo dele |
|---|---|---|
| **P1: o quê** | Citação, o que foi desenvolvido, para quem e qual pergunta o artigo investigou | "O trabalho Pina et al. (2025) apresenta o desenvolvimento de … O artigo investigou como …" |
| **P2: como e resultado** | Tecnologia usada, como avaliou (n.º de participantes) e o resultado principal | "A aplicação foi desenvolvida utilizando … O estudo contou com 150 participantes e demonstrou que …" |
| **P3: semelhança × diferença** | O que tem em comum com o meu e a diferença principal | "Assim como este trabalho, … Ambos … A diferença principal reside em: enquanto X foca em …, este trabalho concentra-se em …" |
| **Figura** | Uma tela do sistema do artigo | "A Figura N ilustra … Fonte: (Autor, ano)." |

O título da subseção pode ficar no idioma original, como "Design of a Virtual Museum using Unity and VR".

**Fechamento: 3.4 Análise comparativa.** Um parágrafo de uma linha e o **Quadro 1**, com 4 colunas: **Trabalho | Objetivo | Tecnologia | Diferencial**. A **primeira linha é "Este Trabalho"**. A fonte é "Elaborado pelo Autor".

> **Dica para superar o dele:** acrescentar colunas **sim/não**, que deixam a lacuna evidente:
> - "Navegador?"
> - "Ensino médio?"
> - "Exercícios com feedback?"
> - "Avaliação com usuários?"
>
> A banca gosta de quadro pequeno, e assim fica claro que **nenhum** trabalho junta museu + exercícios + EM.

### Meus 5 trabalhos relacionados (dados para preencher P1/P2/P3)

**3.1 ECOS: uma exposição virtual de artefatos espaciais baseada em Web 3D** (Brito, 2026)
- **P1:**
  - TCC da UFC Quixadá;
  - uma exposição virtual no navegador de 5 artefatos espaciais (Saturn V, Hubble, James Webb, Voyager 1, ISS);
  - 3 ambientes: um hall com pedestais, salas temáticas com painéis História/Tecnologias/Missões/Futuro e um visualizador orbital.
- **P2:**
  - A-Frame (sobre Three.js/WebGL), com modelos 3D do Sketchfab e da NASA e publicação no GitHub Pages;
  - **26 voluntários**, com roteiro de tarefas e questionário Likert de 5 pontos (experiência, qualidade visual e percepção de conteúdo);
  - a qualidade visual foi o aspecto mais bem avaliado;
  - no celular houve dificuldade de navegação e faltou um tutorial.
- **P3:**
  - **semelhante:** museu virtual Web 3D no navegador, hall → salas → inspeção, avaliação com usuários;
  - **diferente:**
    - ECOS é divulgação científica para leigos, sem exercícios;
    - os textos abrem páginas HTML externas;
    - os modelos são baixados (carregamento lento);
    - o meu é para o EM, com exercícios em que a resposta do aluno vira o fenômeno, as cenas são geradas por código e a navegação é em 1ª pessoa (WASD/toque/controle).
- **Figura:** a do hall dele (Figura 13 do TCC).

**3.2 Experiência Interativa em 3D para Exibição de Animais Extintos no Museu Emílio Goeldi** (Pina et al., 2025)
- **Referência:** PINA, I. C.; SOUZA, T. M.; SILVA FILHO, F. G. S.; SERUFFO, M. C. R.; CARDOSO, D. L. In: *Anais do XXXI WebMedia*. Porto Alegre: SBC, 2025, p. 220–228. DOI 10.5753/webmedia.2025.16163. https://sol.sbc.org.br/index.php/webmedia/article/view/37965
- **P1:** aplicação web 3D com 5 animais extintos brasileiros (Megalonyx, Toxodon, Gomphotherium, Phorusrhacidae, Glyptodon) para o Museu Emílio Goeldi.
- **P2:**
  - React Three Fiber (Three.js/WebGL), otimizada para celular;
  - estudo quase-experimental com **150 participantes**;
  - engajamento e retenção de conhecimento significativamente maiores que a exposição tradicional.
- **P3:**
  - **semelhante:** Three.js no navegador e a ideia de museu;
  - **diferente:** paleontologia e visitante de museu, só visualização; o meu é física/química do EM, com exercícios.
- ⚠ O Gustavo também cita esse. Pode manter (é o mais próximo em tecnologia), mas descreva com as suas palavras.

**3.3 Um Laboratório Virtual Tridimensional e Interativo para Suporte ao Ensino de Física** (Falcão; Machado, 2010)
- **Referência:** FALCÃO, E. L.; MACHADO, L. S. In: *Anais do XVI Workshop de Informática na Escola (WIE)*. Belo Horizonte: SBC, 2010, p. 1285–1293. DOI 10.5753/wie.2010.25401. https://sol.sbc.org.br/index.php/wie/article/view/25401
- **P1:** laboratório virtual 3D para simular experimentos de Física e facilitar a compreensão de alunos do **Ensino Médio**, com visão estereoscópica (RV).
- **P2:**
  - pelas referências do artigo, usa X3D/InstantReality (**confirmar no PDF**);
  - avaliação: **ler o PDF para ver se houve e com quantos**.
- **P3:**
  - **semelhante:** física do EM em 3D interativo;
  - **diferente:** é de 2010, precisa de software/óculos e é um laboratório e não um museu, sem exercícios ligados a uma lista; o meu roda em qualquer navegador e celular.

**3.4 ARTOM: Aplicativo para Ensino de Química em Realidade Aumentada** (Pereira et al., 2021)
- **Referência:** PEREIRA, Z.; RODRIGUES, L.; COSTA, R. O.; AMARAL, E. I.; MATTOS, M. S. In: *Anais dos Workshops do X CBIE (WCBIE 2021)*. Porto Alegre: SBC, 2021, p. 139–146. DOI 10.5753/wcbie.2021.217420.
- **P1:**
  - app Android para alunos que **entram no ensino médio** estudarem átomos e ligações covalentes;
  - cartas com QR code fazem aparecer átomos 3D (H, O, C, Cl, B, N) e, ao aproximar as cartas, mostram a ligação e a geometria molecular.
- **P2:**
  - Unity 2018 + Vuforia (RA com marcador), em C#;
  - **sem avaliação com usuários** (é um protótipo de projeto integrador do técnico do IFRJ);
  - os autores relatam que uma dependência do Vuforia deixou de existir no Unity, mostrando a fragilidade de depender de plug-ins.
- **P3:**
  - **semelhante:** átomos e geometria molecular em 3D para o EM;
  - **diferente:** precisa instalar o app e imprimir cartas, só Android, sem exercícios nem avaliação; o meu roda no navegador, sem instalação, e tem a sala de Geometria molecular e os modelos históricos.
- **Serve para:** a opção **Modelos Atômicos**.

**3.5 PhET: Simulations That Enhance Learning** (Wieman; Adams; Perkins, 2008)
- **Referência:** WIEMAN, C. E.; ADAMS, W. K.; PERKINS, K. K. PhET: simulations that enhance learning. *Science*, v. 322, n. 5902, p. 682–683, 2008. DOI 10.1126/science.1161948.
- **P1:**
  - o projeto PhET (Universidade do Colorado), com centenas de simulações gratuitas de física e química, no navegador;
  - inclui *Pendulum Lab*, *Projectile Motion*, *Rutherford Scattering* e *Models of the Hydrogen Atom*, que são **as mesmas salas do meu museu**.
- **P2:**
  - simulações em HTML5 (antes Java/Flash);
  - desenhadas com entrevistas com alunos;
  - o artigo relata que as simulações podem ser tão ou mais eficazes que o laboratório real em alguns contextos.
- **P3:**
  - **semelhante:** simulação interativa no navegador, gratuita, mesmos fenômenos;
  - **diferente:** o PhET é 2D, solto (uma simulação por vez) e não tem a lista de exercícios integrada nem o espaço de museu; o meu junta as simulações num museu 3D navegável, com exercícios resolvidos à mão como base.
- É a referência mais conhecida da área, e a banca já perguntou de PhET/Labster antes.

**Opção extra (se o professor quiser um mais recente de museu e escola):** Santos et al. (2026), *Realidade Virtual no Ensino de História: Aplicação de uma Experiência Imersiva em Museus e Sítios Arqueológicos*, WIE 2026, p. 428–439, https://sol.sbc.org.br/index.php/wie/article/view/45036.
- Aplicado com **60 alunos do 6º ano** (fundamental II, não EM), avaliados por questionário e observação.

**Quadro comparativo (rascunho):**

| Trabalho | Navegador, sem instalar | Ensino médio | Museu 3D navegável | Exercícios com feedback visual | Avaliação com usuários |
|---|---|---|---|---|---|
| Este trabalho | sim | sim | sim | sim | sim (planejada) |
| Brito (2026), ECOS | sim | não (público geral) | sim | não | sim (26) |
| Pina et al. (2025) | sim | não (visitante) | parcial | não | sim (150) |
| Falcão e Machado (2010) | não | sim | não (laboratório) | não | confirmar |
| Pereira et al. (2021), ARTOM | não (app + cartas) | sim | não | não | não |
| Wieman et al. (2008), PhET | sim | sim | não (2D, avulso) | não | sim |

> ✔ Antes de colocar no texto: **abrir os PDFs** do Falcão e do Pina para confirmar tecnologia, avaliação e figura. Eu só li os resumos e a página do SOL. O ARTOM eu li inteiro.

---

## 4. Metodologia: como ele fez

**Abertura:** um parágrafo e a **Figura 11, um fluxograma** com os passos seleção → desenvolvimento (Ambiente 01, 02 e 03 em paralelo) → finalização/deploy → avaliação com usuários.

As seções seguem o fluxograma, na mesma ordem:
- **4.1 Ambiente de desenvolvimento e recursos:**
  - por que é web (sem instalação; Android/Chrome e iOS/Safari);
  - por que A-Frame (ECS, HTML declarativo).
- **4.2 Seleção dos objetos:**
  - critérios históricos e científicos, mais a disponibilidade de modelo 3D gratuito (Sketchfab/NASA);
  - **Quadro 2**: Categoria | Objeto | Justificativa.
- **4.3 Desenvolvimento**, uma subseção por ambiente:
  - **4.3.1 Hall:**
    - primitivas (`a-box`, `a-plane`) para paredes;
    - iluminação;
    - *hotspots* (clicar no objeto → descrição + botão para a sala);
    - portal de volta;
    - figura do protótipo inicial.
  - **4.3.2 Salas temáticas:**
    - 4 painéis curvos;
    - "navegação híbrida" (o painel abre uma página HTML);
    - clicar no modelo leva ao visualizador.
  - **4.3.3 Visualizador orbital:** `orbit-controls` (A-Frame Extras), fundo neutro e luz de 3 pontos.
  - **4.3.4 Finalização e deploy:**
    - componente próprio (`AFRAME.registerComponent`) para transições e pré-carregamento;
    - GitHub Pages.
- **4.4 Procedimentos de avaliação**, em 3 fases:
  1. **roteiro de tarefas**: andar no hall, interagir com um artefato, ler uma sala e usar o visualizador;
  2. **perfil**: dispositivo, sistema operacional e conhecimento prévio;
  3. **questionário Likert de 1 a 5**, mais campos abertos, em 3 eixos (experiência, qualidade visual/imersão, percepção de conteúdo).

  Foi feito remotamente, pelo Google Forms.

**Minha versão no mesmo molde:**
- **Fluxograma:**
  1. seleção dos conteúdos;
  2. elaboração e resolução da lista;
  3. desenvolvimento (hall/alas → salas → exercícios → inspeção);
  4. deploy;
  5. avaliação.
- **4.1 Ambiente:**
  - React + Vite + Three.js, sem modelos baixados (tudo gerado por código, para carregar rápido);
  - GitHub Pages;
  - **uso de IA generativa** no desenvolvimento e nos textos, dizendo como foi validado (lista resolvida à mão, revisão das fórmulas).
- **4.2 Seleção dos conteúdos:**
  - quadro **Sala | Conteúdo | Exercícios da lista | Justificativa** (ex.: "Pêndulo de Galileu | período | 1–6 | cai no ENEM");
  - critérios: currículo do EM/BNCC e ENEM.
- **4.3 A lista de exercícios:** como foi elaborada, resolvida à mão e ligada às salas. **É o que diferencia o meu do dele.**
- **4.4 Desenvolvimento**, uma subseção por parte do sistema:
  - **4.4.1 Hall e alas:** pedestais com miniaturas e "i";
  - **4.4.2 Salas:** experimento, quadros Teoria/História em pop-up e ajustes;
  - **4.4.3 Exercícios interativos:** o aluno responde e a cena mostra o resultado, certo ou errado;
  - **4.4.4 Modo inspecionar:** OrbitControls;
  - **4.4.5 Deploy.**
- **4.5 Avaliação**: as mesmas 3 fases dele (roteiro, perfil, Likert), **com dois acréscimos**:
  - um pré-teste e um pós-teste curto com questões da lista, para medir aprendizado e não só opinião;
  - o **TCLE** (e, para menores, o termo de assentimento mais a autorização dos responsáveis).

---

## 5. Resultados e Discussão: como ele fez

- **Abertura:** o que foi entregue, os 3 ambientes e o **link público** da aplicação.
- **5.1 Implementação**, uma subseção por ambiente, cada uma com 1–2 parágrafos e **uma captura de tela**:
  - Hall (Fig. 13);
  - Salas (Fig. 14);
  - Visualizador (Fig. 15).

  Ele **justifica cada decisão de design**:
  - o hall imita um museu real, para orientação espacial e uma futura RV;
  - a sala é circular, para tudo ficar ao alcance;
  - o orbital segue o modelo tradicional de visualizador.
- **5.2 Avaliação do usuário:**
  - **5.2.1 Perfil:**
    - 26 voluntários, com TCLE, anônimos;
    - gráfico de dispositivos (Fig. 16);
    - conhecimento prévio: 53,8% baixo e 42,3% médio.
  - **5.2.2 Experiência e navegação:**
    - no PC foi fácil e no celular foi difícil (sensibilidade do toque, travamentos);
    - faltou um tutorial;
    - gráfico (Fig. 17).
  - **5.2.3 Qualidade visual e imersão:**
    - o mais bem avaliado, com a maioria dando nota 5;
    - citou um comentário ("Amei os modelos 3D");
    - houve relatos de tontura;
    - gráfico (Fig. 18).
  - **5.2.4 Percepção de aprendizado:**
    - quase todos acharam que o 3D ajuda a entender a escala e a forma;
    - sugeriram ampliar o acervo.
  - **5.2.5 Discussão**, com **3 conclusões numeradas**:
    1. indícios de viabilidade do Web 3D;
    2. limitações de desempenho no celular, admitindo que não coletou dados técnicos para achar a causa;
    3. necessidade de um tutorial.

    Fecha com citações dos comentários abertos.

**O que copiar:**
- um gráfico por eixo do questionário;
- "indícios" em vez de "prova";
- admitir as limitações.

**O que fazer melhor:**
- dar os **números** (média/mediana por pergunta numa tabela pequena), porque ele mostra só gráficos e quase nenhum número no texto;
- o resultado do **pré × pós-teste**;
- registrar o dispositivo e o navegador, porque ele não conseguiu explicar os travamentos por não ter registrado isso.

---

## 6. Conclusão e Trabalhos Futuros: como ele fez

**4 parágrafos:**
1. o que foi feito e qual era a motivação (retomar o problema da introdução);
2. a tecnologia se mostrou eficaz (A-Frame no navegador × apps instaláveis);
3. o que os resultados mostraram (a estrutura Hall → Salas → Visualizador guia do geral ao detalhe);
4. "o projeto cumpre seu objetivo …" e "estabelece uma base técnica para extensões futuras".

**6.1 Trabalhos futuros, 4 itens com uma frase cada:**
- WebXR/VR;
- gamificação (quizzes nas salas);
- áudio-guia (text-to-speech);
- ampliar o acervo.

> Repare: o futuro dele inclui **"quizzes nas salas"**, que é justamente o que o meu faz. Posso usar isso na introdução ou nos trabalhos relacionados: "o próprio Brito (2026) aponta a integração de exercícios como trabalho futuro".

**Minha versão:**
- **Trabalhos futuros:**
  - a outra temática (Mecânica ↔ Átomos);
  - geração de exercícios com IA;
  - painel para o professor ver os erros da turma;
  - acessibilidade (narração);
  - mais questões do ENEM.
- **Não** colocar VR/MediaPipe, que o professor tirou do escopo.

---

## 7. Receita em 10 passos

1. **Escolher o tema** (Mecânica ou Átomos) e a lista final de salas, com 5 itens como ele.
2. **Introdução** com 7 parágrafos:
   - história;
   - importância;
   - problema;
   - solução genérica;
   - evidência;
   - "este trabalho propõe";
   - como e o diferencial.

   Depois a questão de pesquisa, o objetivo geral (1 frase), 3–4 objetivos específicos e a organização.
3. **Fundamentação** em funil:
   - conteúdo (uma subseção por sala, com fórmula e figura);
   - pedagogia (simulação e feedback);
   - museus e ambientes virtuais (Slater);
   - tecnologia (WebGL → Three.js).
4. **Trabalhos relacionados:**
   - 5 subseções com P1/P2/P3 e uma figura cada;
   - o quadro comparativo com "Este trabalho" na primeira linha.
5. **Metodologia:**
   - fluxograma;
   - ambiente e tecnologia (+ IA);
   - quadro de seleção dos conteúdos;
   - a lista;
   - desenvolvimento por partes;
   - avaliação (roteiro + perfil + Likert + pré/pós + TCLE).
6. **Construir e publicar** (GitHub Pages) e **tirar uma captura de tela de cada parte**.
7. **Aplicar a avaliação** pelo Google Forms, com o TCLE no início.
8. **Resultados:**
   - uma subseção com print por parte do sistema;
   - perfil;
   - um gráfico mais uma tabela por eixo;
   - discussão com 3 conclusões numeradas e as limitações.
9. **Conclusão** com 4 parágrafos e trabalhos futuros em 4–5 itens.
10. **Resumo por último:** problema → objetivo → método → resultado, com 5 palavras-chave.
