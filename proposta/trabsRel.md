# Trabalhos Relacionados: estudo dos 5 trabalhos

> **Decisões de 17/11/2026:**
> - **Tema escolhido:** Física (Mecânica).
> - **Não usar mais "museu".** Usar **"ambiente virtual interativo"** ou **"exposição virtual interativa"** (decidir com o orientador). Segundo o membro da banca, "museu" invade a área da Museologia.
>   - Repare que o próprio Gustavo nunca chama o ECOS de museu: ele usa **"exposição virtual"**. Provavelmente ouviu a mesma crítica.
>   - Quando um trabalho relacionado for de museu (Pina et al.), tudo bem citar a palavra, porque é o contexto **deles**. No seu texto, você fala em exposição ou ambiente.

**Como usar este arquivo:**
- **Parte A:** estudo profundo de cada trabalho, para você entender, discutir e defender. Tem perguntas que a banca pode fazer e o que vale a pena ler no original.
- **Parte B:** o texto para o TCC, no formato do `gustavo.md`: P1 o quê, P2 como e resultado, P3 semelhança × diferença, e uma figura.

**Ordem sugerida no capítulo:**
1. ECOS (o mais parecido);
2. Pina (Web 3D com avaliação forte);
3. Falcão (física do EM em 3D);
4. PhET (simulação de física);
5. ARTOM (ver o aviso abaixo).

> ⚠ **Sobre o ARTOM:** ele é de **química**. Como você escolheu Física, ele ficou fraco como trabalho relacionado. Ou você mantém (o argumento é "ensino médio + 3D + mesmo problema de visualizar o invisível"), ou troca por um de física.
> - **Candidato:** Meiguins et al. (2002), *Ambientes Virtuais Tridimensionais para Simulação de Experiências da Física Fundamental*, SBIE 2002 (SBC). É citado pelo Falcão e simula MRUV e lançamento oblíquo.
> - Eu **ainda não li** esse. Posso buscar e resumir se você quiser trocar.

---

# PARTE A: Estudo profundo

## A1. ECOS: Uma Exposição Virtual de Artefatos Espaciais Baseada em Web 3D (Brito, 2026)

**Ficha**
- **Tipo:** TCC de Ciência da Computação, UFC Quixadá, 2026, 47 folhas.
- **Orientador:** Rubens Fernandes Nunes (o seu).
- **Banca:** Paulyne Matthews Jucá e João Vilnei de Oliveira Filho.
- **Aplicação:** https://gustavobritof.github.io/exposicao-ecos
- **Arquivo local:** `D:\26\TCC\2026_tcc_jgfbrito.pdf`
- **Código:** `D:\26\exposicao-ecos`.

### Contexto e introdução
- O texto parte da história da astronomia (Pannekoek, Kuhn): o céu servia para agricultura, navegação e calendário.
- Depois vêm a era espacial (Sputnik em 1957, a Lua em 1969) e o conhecimento acumulado nos artefatos que a humanidade lançou: satélites, sondas, telescópios, estações.

### Problema
- Esses artefatos são **fisicamente inacessíveis**: estão em órbita, em outro ponto do Sistema Solar, ou em poucos museus do mundo.
- A divulgação depende de vídeos e painéis estáticos, que não mostram a **complexidade tridimensional** dos objetos (Vinhas, 2021).

### Justificativa
- Ambientes virtuais 3D derrubam a barreira física e permitem exibir objetos remotos a qualquer pessoa.
- Representações 3D ajudam a compreender estrutura e função em áreas visuais como astronomia e engenharia (Cardoso et al., 2014).
- Por ser **Web 3D**, roda no navegador, sem instalar nada.

### Objetivos
- **Geral:** desenvolver uma exposição digital interativa em Web 3D, com modelos 3D de artefatos espaciais, usando A-Frame.
- **Específicos:**
  1. estudar os marcos da exploração espacial;
  2. desenvolver a aplicação com navegação e interação;
  3. aplicar um questionário para avaliar a experiência e a eficácia.

### Fundamentação
Três blocos:
1. **O tema:**
   - satélites (órbitas LEO/MEO/GEO);
   - sondas (flyby, orbiter, lander/rover; Voyager, Rosetta);
   - telescópios espaciais: por que ir ao espaço? Extinção atmosférica e turbulência (*seeing*), com a comparação Subaru × Hubble.
2. **Ambientes virtuais interativos:** Slater (2009).
   - **Imersão** é uma propriedade técnica do sistema.
   - **Ilusão de Lugar** (*Place Illusion*) é a sensação de "estar lá". Num monitor ela não é automática, mas o usuário faz uma "recriação mental" ao controlar a câmera.
   - **Ilusão de Plausibilidade** (*Psi*) é aceitar que o que se vê é real e coerente.
3. **Tecnologia:** OpenGL → WebGL (API no `<canvas>`) → Three.js (abstrai o WebGL) → A-Frame.
   - O A-Frame usa HTML declarativo e o padrão **ECS** (Entity-Component-System), com primitivas e `<a-assets>` para pré-carregar.

### Metodologia
Segue um fluxograma: seleção → desenvolvimento dos 3 ambientes → deploy → avaliação.
- **Seleção dos objetos:**
  - Saturn V, Hubble, James Webb, Voyager 1 e ISS;
  - critérios históricos e científicos, mais a existência de modelo 3D gratuito (Sketchfab, NASA).
- **Ambiente 01, Hall:**
  - paredes com primitivas (`a-box`, `a-plane`) e iluminação;
  - *hotspots*: clicar no artefato mostra uma descrição e um botão para a sala;
  - um portal de volta.
- **Ambiente 02, Salas temáticas:**
  - uma por objeto, com 4 painéis curvos (História, Tecnologias, Missões, Futuro);
  - o painel **abre uma página HTML externa** (ele chama isso de "navegação híbrida", justificando a legibilidade);
  - clicar no modelo leva ao visualizador.
- **Ambiente 03, Visualizador orbital:**
  - `orbit-controls` do A-Frame Extras;
  - fundo neutro e luz de três pontos.
- **Deploy:** componente próprio para transições e pré-carregamento, publicado no GitHub Pages.
- **Avaliação:**
  - remota, pelo Google Forms;
  - roteiro de tarefas (andar no hall, interagir, ler uma sala, usar o visualizador);
  - perfil (dispositivo, sistema, conhecimento prévio);
  - Likert de 1 a 5 em 3 eixos (experiência, qualidade visual/imersão, conteúdo), mais perguntas abertas.

### Resultados
- **Participantes:** 26 voluntários com TCLE e anonimato. O conhecimento prévio era baixo em 53,8% e médio em 42,3%.
- **Navegação:** no PC (WASD + mouse) foi fácil. No celular houve dificuldade com o toque, a velocidade e travamentos. **Faltou um tutorial.**
- **Qualidade visual:** foi o item mais bem avaliado, com a maioria dando nota 5. Alguns relataram **tontura** ao girar rápido.
- **Aprendizado (percebido):** quase todos acharam que o 3D ajuda a entender a escala e a forma melhor que imagens. Pediram mais itens.
- **Discussão:**
  1. "indícios de viabilidade" do Web 3D;
  2. limitações de desempenho no celular, sem dados técnicos para achar a causa;
  3. necessidade de um tutorial.

### Conclusão
- O A-Frame foi eficaz.
- A estrutura Hall → Salas → Visualizador guia do geral ao detalhe.
- O trabalho é uma base técnica para extensões.
- **Trabalhos futuros:** WebXR/VR, **gamificação com quizzes nas salas**, áudio-guia (TTS) e mais acervo.

### 🧠 Leitura crítica (o que um professor quer que você perceba)
1. **O aprendizado foi só "percebido".** A pergunta foi "você acha que o 3D ajudou?". Isso mede **opinião**, não aprendizagem. Não houve pré-teste nem pós-teste.
   - **Reflexão:** se a banca perguntar "seu aluno aprendeu?", o que vai responder? Você precisa de pelo menos um pré e pós com questões da sua lista.
2. **O desempenho não foi medido.** Ele mesmo admite que não registrou dispositivo, navegador nem rede, e por isso não consegue explicar os travamentos.
   - Você viu a causa provável no código: cerca de 25 MB de GLB e um panorama de 8,5 MB (ver `analise-ecos.md`).
   - **Lição:** registre o modelo do celular e o navegador no formulário, e meça o tempo de carregamento.
3. **A "navegação híbrida" quebra a imersão.** Abrir uma página HTML tira o usuário do 3D. Pela teoria que ele mesmo cita (Slater), sair do ambiente quebra a Ilusão de Lugar.
   - É um bom ponto para você justificar o pop-up dentro do ambiente.
4. **O resultado positivo mais forte (visual) não é mérito dele.** Os modelos vieram do Sketchfab e da NASA, e ele próprio ressalva isso no 5.2.3.
   - **Reflexão:** no seu caso, o que é mérito seu? As cenas são geradas por código, a física é correta, e a lista foi resolvida à mão e ligada às salas.
5. **Não há questão de pesquisa nem hipótese.** O trabalho é "desenvolver e ver se gostam".
   - Seu orientador aprovou esse formato, então é o mínimo aceito. Ter uma questão de pesquisa coloca você **acima** desse mínimo.
6. **26 participantes, divulgação remota e amostra de conveniência.** É um "estudo exploratório", e ele usa a palavra certa: *indícios*. Use o mesmo vocabulário.
7. **O trabalho futuro dele é o seu trabalho.** "Quizzes interativos integrados às salas temáticas" está nos trabalhos futuros. Você pode escrever: *"Brito (2026) aponta como trabalho futuro a integração de exercícios às salas; este trabalho parte desse ponto."* Isso mostra **continuidade de pesquisa** no mesmo grupo.

### 💬 Possíveis perguntas da banca
- *"Qual a diferença do seu para o do Gustavo?"*
  - **Público e propósito:** ele faz divulgação científica para leigos; você faz ensino de Física no EM, com exercícios.
  - **Interação:** ele mostra; no seu, o aluno responde e **a cena reage** à resposta.
  - **Técnica:** cenas geradas por código, sem modelos pesados, e navegação em 1ª pessoa com toque e controle.
- *"Por que não usou A-Frame como ele?"* Você precisava de física simulada por quadro e de controle fino da cena. Three.js direto dá isso, e o A-Frame é uma camada a mais sobre o mesmo Three.js. (A fundamentação dele já explica essa pilha.)

### 📚 Onde ler
- **No PDF:** cap. 4 (p. 31–35) e seção 5.2 (p. 39–43). É ali que está a "receita" da avaliação.
- **Slater (2009):** *Place illusion and plausibility…*, Phil. Trans. R. Soc. B 364:3549–3557, DOI 10.1098/rstb.2009.0138. São 9 páginas. É **a** referência de imersão, e você pode citar também.
- **Lepouras et al. (2004):** *Real exhibitions in a virtual museum*, Virtual Reality 7(2). Repare que o título diz "exposições" (*exhibitions*): a exposição é o que se mostra, e o museu é a instituição. Isso ajuda a justificar o seu novo termo.

---

## A2. Experiência Interativa em 3D para Exibição de Animais Extintos no Museu Emílio Goeldi (Pina et al., 2025)

**Ficha**
- **Autores:** Israel Coimbra de Pina e Tobias Moraes de Souza (Estácio Belém); Frederico G. S. da Silva Filho, Marcos C. R. Seruffo e Diego L. Cardoso (UFPA).
- **Publicação:** *Anais do XXXI WebMedia*, SBC, 2025, p. 220–228. DOI 10.5753/webmedia.2025.16163.
- **Link:** https://sol.sbc.org.br/index.php/webmedia/article/view/37965

### Contexto e introdução
- Museus fazem a ponte entre pesquisa e público.
- O Museu Paraense Emílio Goeldi (1866) tem um acervo paleontológico valioso, mas há limitações:
  - os fósseis são **frágeis** e não podem ser manuseados;
  - falta **espaço** para expor tudo;
  - a exposição **estática** não prende a atenção das gerações digitais.

### Proposta e objetivos
Uma aplicação web 3D de alta fidelidade com 5 animais extintos brasileiros:
- *Megalonyx jeffersonii* (preguiça-gigante);
- *Toxodon platensis*;
- *Gomphotherium angustidens*;
- Phorusrhacidae (ave-do-terror);
- *Glyptodon clavipes* (tatu-gigante).

A aplicação roda em qualquer navegador, do desktop ao celular.

**Questões de pesquisa explícitas:**
- **QP1:** é viável uma aplicação web 3D de alto desempenho em vários dispositivos?
- **QP2:** como a usabilidade varia por faixa etária?
- **QP3:** qual o impacto no engajamento comparado à exposição tradicional?
- **QP4:** qual o impacto na aquisição e retenção de conhecimento?

**Hipóteses:**
- **H1:** mais de 30 FPS;
- **H2:** SUS acima de 68 em todas as idades;
- **H3:** maior engajamento;
- **H4:** maior ganho e retenção.

### Trabalhos relacionados (deles)
Organizados em **categorias**, e não em uma lista:
- aprendizagem mediada por tecnologia em museus;
- frameworks 3D para patrimônio;
- Web 3D e usabilidade (Jankowski; Yoon et al.; Three.js × Babylon.js);
- aplicações museológicas (Smithsonian 3D).

Fecham com uma subseção **"Lacuna na literatura"**: muitos trabalhos são técnicos ou anedóticos, e poucos avaliam o impacto educacional com rigor.

### Metodologia
Seis fases:
1. **Seleção das espécies:**
   - parceria com a Paleontologia do museu e um comitê (2 paleontólogos, 1 curador educacional, 1 especialista);
   - 5 critérios: relevância regional, dados morfológicos, potencial educativo, diversidade e viabilidade técnica.
2. **Modelos 3D:**
   - fotogrametria (48 câmeras DSLR, Agisoft Metashape);
   - malha de 2 milhões de polígonos reduzida para cerca de 50 mil (alta qualidade) e 15 mil (celular);
   - retopologia;
   - compressão **Draco** (−67% no tamanho).
3. **Aplicação:**
   - React 18 + React Three Fiber + Three.js r150;
   - módulos: visualização, interface, assets, navegação, analytics;
   - **LOD adaptativo** (o nível de detalhe muda com a distância e o aparelho);
   - acessibilidade **WCAG 2.1** (teclado, ARIA, descrições alternativas).
4. **Testes de desempenho:**
   - uma matriz de dispositivos (desktops, tablets, iPhones, Galaxy, Pixel) e navegadores;
   - metas: carregar em menos de 8 s no 3G, 30 FPS ou mais, resposta abaixo de 100 ms.
5. e 6. **Avaliação com 150 visitantes ao longo de 3 meses:**
   - estratificados por idade (8–12, 13–17, 18–64, 65+);
   - observação estruturada, **questionário pré e pós** e entrevista semiestruturada;
   - **quase-experimento**: o grupo do app 3D comparado ao grupo da exposição tradicional;
   - *follow-up* após 2 semanas para medir retenção.

### Resultados

| Aspecto | Resultado |
|---|---|
| **Desempenho** | Desktop high-end 58 FPS e 3,8 s de carregamento; celular de entrada 28 FPS e 7,9 s |
| **Usabilidade (SUS)** | Média 78,4. Adolescentes de 13–17 anos 82,1 (o maior); idosos 72,1 |
| **Tarefas** | 94,2% de conclusão em cerca de 2,3 min |

**Aprendizado (escala de 0 a 10):**

| | Pré | Pós imediato | Após 2 semanas |
|---|---|---|---|
| App 3D | 4,2 | 7,8 | 7,1 |
| Exposição tradicional | 4,1 | 6,1 | 5,4 |

- No pós imediato: t(148) = 6,42, p < 0,001, **d = 1,05** (efeito grande).
- Após 2 semanas: p < 0,001, d = 0,98.
- **Engajamento:** a preguiça-gigante foi a mais vista (12,4 min). A explicação é a familiaridade com as preguiças atuais.

### Conclusão
- A Web 3D é viável e educacionalmente superior.
- Eles oferecem um "framework replicável" (seleção → otimização → avaliação).
- **Futuros:** mais espécies, AR por WebXR, **gamificação com quizzes**, estudos mais longos e integração com **visitas escolares**.
- Há também uma seção incomum sobre **custos** (fotogrametria entre R$ 15 e 50 mil, desenvolvimento entre R$ 60 e 120 mil), com sugestões de políticas públicas.

### 🧠 Leitura crítica (importante, leia com calma)
Este é o artigo mais "forte" no papel, mas um leitor atento encontra **inconsistências**. Saber vê-las é exatamente o que a banca espera de quem faz pesquisa.
1. **Os números da conclusão não batem com a tabela.**
   - A Tabela 3 diz +27,9% no pós e +31,5% na retenção.
   - A conclusão diz "31% de melhoria na retenção imediata e 27% após duas semanas", ou seja, os valores estão invertidos.
2. **Duas linhas idênticas na Tabela 1.** "Tablet Mid-range" e "Smartphone Modern" têm exatamente o mesmo FPS (38,2 ± 4,8). Isso parece erro de copiar e colar.
3. **Quem é o grupo de controle?**
   - t(148) indica 150 pessoas divididas em dois grupos.
   - Mas a usabilidade (SUS) também é relatada "com 150 participantes" usando o app.
   - Então o grupo da exposição tradicional também usou o app? O texto não explica.
4. **A estrutura é grande demais para o porte do trabalho.** Comitê, 48 câmeras DSLR e 3 meses de coleta, num artigo curto de faculdade particular e UFPA, sem nenhuma foto desse equipamento.
   - Não dá para afirmar nada, mas é o tipo de coisa que um avaliador **pergunta**.
5. **Sinais de pressa no texto:**
   - o cabeçalho das páginas diz "**Pereira et al.**", mas os autores são Pina et al. (sobra de modelo);
   - a conclusão cita a referência [1] para apoiar o **próprio** resultado;
   - há referências a blogs (MoldStud, Pixel Free Studio, threejsresources.com).

> **Por que isso importa para você?**
> 1. Você vai citá-lo, então cite **o que ele afirma** ("os autores relatam…") e não trate os números como verdade absoluta. Prefira "Pina et al. (2025) relatam ganho significativo…".
> 2. É a lição sobre resultados inventados ou "bonitos demais": uma tabela com linhas repetidas, números trocados e efeitos enormes chama atenção de qualquer revisor. **Resultado pequeno e honesto (como os 26 do Gustavo) vale mais que resultado perfeito e incoerente.**
> 3. **Na reunião:** comentar essas inconsistências com o orientador mostra maturidade. Isso é "leitura crítica de literatura", uma competência avaliada.

### O que vale **copiar** dele (é bom mesmo)
- **Questões de pesquisa e hipóteses explícitas com números** (">30 FPS", "SUS > 68"). Você pode fazer igual, por exemplo:
  - **H1:** o ambiente roda a 30 FPS ou mais num celular intermediário;
  - **H2:** SUS acima de 68;
  - **H3:** a nota no pós-teste é maior que no pré-teste.
- **SUS (System Usability Scale).** É um questionário **padronizado** de 10 itens, com nota de 0 a 100 e referência de 68 = "acima da média". É muito melhor que um Likert inventado do zero, e você pode usar.
- **Uma subseção de "lacuna na literatura"** fechando os trabalhos relacionados.
- **Medir o desempenho** (FPS e tempo de carregamento) numa tabela pequena.

### 💬 Possíveis perguntas da banca
- *"O seu também compara com uma aula tradicional?"* Provavelmente não, por tempo. Responda que o seu é um **estudo exploratório pré/pós com um grupo só** e que o grupo de controle fica como trabalho futuro. É honesto e aceito.
- *"Por que não React Three Fiber, como eles?"* Você já usa React e optou por Three.js imperativo para controlar o laço da simulação física. As duas opções usam o mesmo Three.js por baixo.

### 📚 Onde ler
- No PDF: seção 3 (metodologia, p. 222–223) e a Tabela 3 (p. 226). Leia a Tabela 3 e tente achar sozinho a inconsistência com a conclusão.
- **SUS:** Brooke (1996), *SUS: a "quick and dirty" usability scale*. Existe tradução para o português, e vale buscar "SUS versão em português validada".
- **Jankowski (2015),** *Usability of WebGL Applications*: os problemas de navegação 3D com mouse e toque, que são os mesmos que o Gustavo teve no celular.

---

## A3. Um Laboratório Virtual Tridimensional e Interativo para Suporte ao Ensino de Física (Falcão; Machado, 2010)

**Ficha**
- **Autores:** Eduardo de Lucena Falcão e Liliane S. Machado (LabTEVE, UFPB).
- **Publicação:** *Anais do XVI Workshop de Informática na Escola (WIE 2010)*, SBC, p. 1285–1293. DOI 10.5753/wie.2010.25401.
- **Link:** https://sol.sbc.org.br/index.php/wie/article/view/25401
- **Orientadora:** Liliane Machado é referência nacional em Realidade Virtual para educação e saúde. Vale procurar outros trabalhos dela.

### Contexto e problema
- A Física é a matéria em que "a maioria dos alunos tem dificuldade", e as aulas ficam tediosas sem uma didática dinâmica.
- Os professores usam animações e gráficos **2D**.
- Com a evolução das ferramentas, ambientes 3D se tornaram viáveis.
- **Lacuna que eles apontam:** os trabalhos anteriores de física em 3D não usavam **estereoscopia**. Os anteriores citados são:
  - "Água Virtual" de Fiolhais e Trindade (RBEF 2003);
  - o lançamento de projétil em RA de Forte, Kirner et al. (2008);
  - Meiguins et al. (SBIE 2002), com MRUV;
  - Reis e Filho (2006), com lançamento oblíquo.

### Objetivo
Desenvolver o **LabSEF**, o Laboratório para Simulação de Experimentos Físicos: um ambiente 3D navegável com estereoscopia anáglifa. O objetivo principal é **verificar sua eficácia e importância para alunos e professores do EM**.

### Fundamentação
- **Realidade Virtual** (Burdea & Coiffet): computação gráfica criando mundos de aparência real.
- **Ambientes virtuais de aprendizagem** (Almeida, 2003).
- **Estereoscopia:**
  - duas imagens com **paralaxe**;
  - a passiva usa óculos **anáglifos** vermelho e azul ou polarizados;
  - a ativa usa *shutter glasses* a 120 Hz;
  - escolheram a passiva pelo custo: "com R$ 3,00 é possível produzir cerca de 50 óculos".

### Metodologia e desenvolvimento
- **Ferramentas:** X3D (gráficos 3D descritos para a web), Blender (modelagem) e Java. Todas gratuitas, abertas e multiplataforma (visualizadas no InstantReality).
- **Estrutura espacial (repare: é quase a mesma ideia de hall e salas):**
  - **Sala de Física (recepção):**
    - um painel ensinando a navegar;
    - quadros de Einstein, Newton e Kepler;
    - porta e lâmpadas interativas;
    - um **corredor com 3 portas** que levam aos experimentos.
  - **MRU:**
    - um painel lembrando a teoria (velocidade constante, aceleração nula, s = s₀ + vt);
    - placas para inserir dados;
    - uma **tabela de valores montada durante a simulação**.
  - **Queda livre (MUV):**
    - uma **Torre de Pisa** modelada;
    - o aluno configura os parâmetros e assiste do chão ou **do topo da torre**;
    - g = 9,8;
    - o painel diz que "a massa não interfere no tempo de queda".
  - **Lançamento oblíquo:** o aluno define v₀ e o ângulo, e os **vetores Vx e Vy** aparecem sobre a bolinha durante o voo.
  - Cada ambiente tem versão normal e versão estereoscópica.

### Avaliação
- **Questionário** com 13 perguntas objetivas (3 de perfil, e o resto sobre aparência, facilidade e motivação).
- **33 adolescentes** de um **pré-vestibular**, numa atividade coletiva em sala mediada pelo professor.

### Resultados
- 23 não tiveram dificuldade.
- Dos 10 que tiveram, a maior dificuldade foi no lançamento oblíquo (5), depois na queda livre (3) e no MRU (2).
- 31 disseram que a visão 3D os estimulou a navegar e 2 disseram que atrapalhou.
- 100% disseram que a aula ficaria mais interessante.
- 30 gostariam de baixar o laboratório.

### Conclusão
- A estereoscopia foi um fator motivador.
- Os alunos gostaram do laboratório como **complemento** à aula.
- **Futuros:** continuar as avaliações e criar mais experimentos.

### 🧠 Leitura crítica
1. **Ele mede motivação, não aprendizagem.** É o mesmo limite do Gustavo, quinze anos antes. Isso mostra que a lacuna "avaliar se aprendeu" é **antiga e persistente** na área. É um ótimo argumento para a sua introdução.
2. **As perguntas induzem a resposta.** "A aula se tornaria mais interessante?" quase sempre recebe 100% de sim. Na sua avaliação, evite perguntas que pedem o "sim".
   - **Reflexão:** como perguntar sem induzir? Use itens neutros (como os do SUS, que alternam frases positivas e negativas) e questões de conteúdo.
3. **Os números do lançamento oblíquo.** Foi o experimento mais difícil para os alunos: 5 de 10. É exatamente um dos conteúdos da sua lista (exercícios 7–9).
   - **Reflexão:** a sua ideia de "a resposta do aluno vira o fenômeno" ataca justamente o conteúdo que os alunos acham mais difícil.
4. **A tecnologia envelheceu.** O X3D/InstantReality praticamente morreu, e hoje ninguém roda aquilo. É um argumento a favor de padrões **vivos** (WebGL e Three.js no navegador), e o mesmo vale para o Vuforia no ARTOM.
5. **A ideia de recepção + corredor + salas é a mesma do seu ambiente.** Não esconda isso: cite como **precedente** do formato. Mostra que a organização espacial por experimento já tem respaldo.
6. **Painel de teoria + placas de dados + tabela durante a simulação** é exatamente o que o seu ambiente faz (painéis, ajustes, quadros). A diferença é que o seu tem **exercícios com resposta** e eles não.

### 💬 Possíveis perguntas da banca
- *"Já existe laboratório 3D de física desde 2010, o que o seu traz de novo?"*
  - roda em qualquer navegador e no celular, sem instalar nada e sem óculos;
  - está ligado a uma lista de exercícios resolvida;
  - o erro do aluno aparece na cena;
  - a avaliação mede aprendizagem com pré e pós, e não só gosto.

### 📚 Onde ler
- O PDF tem só 9 páginas: leia **inteiro**. As figuras 2 a 5 (p. 1288–1291) são ótimas para comparar com as suas salas.
- **Fiolhais e Trindade (2003),** *Física no computador*, Revista Brasileira de Ensino de Física, v. 25. É um clássico brasileiro sobre o computador no ensino de física e pode ir para a sua fundamentação pedagógica.
- **Meiguins et al. (2002), SBIE.** É o candidato a substituir o ARTOM.

---

## A4. PhET: Simulations That Enhance Learning (Wieman; Adams; Perkins, 2008)

**Ficha**
- **Autores:** Carl E. Wieman (**Nobel de Física em 2001**), Wendy K. Adams e Katherine K. Perkins (Universidade do Colorado em Boulder).
- **Publicação:** *Science*, v. 322, n. 5902, p. 682–683, 2008 (seção *Education Forum*). DOI 10.1126/science.1161948.
- **Site:** https://phet.colorado.edu/pt_BR/
- ⚠ Este eu resumi **de memória** e por fontes secundárias: não consegui baixar o PDF (o link do PhET deu 404). Antes de citar, **leia o original** (são 2 páginas; pelo Portal de Periódicos CAPES você acessa a *Science*) e confira as afirmações abaixo.

### Contexto
- O artigo é um texto curto de opinião com evidências, numa das revistas mais importantes do mundo.
- O argumento: simulações bem projetadas podem ensinar física **tão bem ou melhor** que aulas expositivas e até que laboratórios reais, em certos contextos.

### O que é o PhET
- Um projeto (desde 2002) de **simulações interativas gratuitas** de física, química e matemática, que rodam no navegador. Hoje são HTML5; em 2008 eram Java e Flash.
- Simulações que **são exatamente o seu conteúdo**:
  - *Laboratório de Pêndulo*;
  - *Movimento de Projétil*;
  - *Ondas em uma Corda*;
  - *Gravidade e Órbitas* / *Minha Sala Solar*;
  - *Espalhamento de Rutherford*;
  - *Modelos do Átomo de Hidrogênio*.

### Ideias centrais do artigo (conferir no original)
- **Design baseado em pesquisa:** cada simulação é testada com **entrevistas individuais com estudantes** (pensar em voz alta) e redesenhada até funcionar. A interface deve ser intuitiva, sem manual.
- **Tornar visível o invisível:** elétrons, fótons, campos, vetores de velocidade.
- **Múltiplas representações ligadas:** o objeto, o gráfico e o número mudam juntos.
- **Feedback imediato:** o aluno muda um parâmetro e vê a consequência na hora. Isso estimula a exploração do tipo "e se…?".
- **"Andaime implícito"** (*implicit scaffolding*): a interface guia sem dar ordens, mostrando os controles certos e escondendo o que distrai.
- **Evidência citada:** um estudo do mesmo grupo (Finkelstein et al., 2005) em que alunos que usaram o *Circuit Construction Kit* (virtual) se saíram melhor em montar circuitos **reais** e em questões conceituais que alunos que usaram equipamento real.

### 🧠 Leitura crítica e reflexões
1. **Por que o PhET é 2D, se dá para fazer 3D?** Porque o objetivo deles é a **clareza conceitual**: menos detalhe é menos distração.
   - Essa é exatamente a pergunta que o seu orientador fez ("por que o pêndulo em 3D?").
   - **A sua resposta:** o 3D vale quando o fenômeno é 3D (pêndulo cônico, Foucault, órbitas, lançamento visto de lado e de cima) ou quando o **espaço** organiza a exploração (as salas da exposição). Num fenômeno puramente plano, o 2D é suficiente, e você deve reconhecer isso.
2. **O PhET é "solto":** cada simulação é uma página isolada, e o professor monta a atividade fora (roteiros no próprio site). O seu ambiente **embute a atividade** (a lista) dentro do espaço.
3. **Feedback imediato é o coração do PhET, e também da sua proposta.** A diferença: no PhET, o aluno muda um parâmetro e vê o efeito. No seu, o aluno **calcula uma resposta** e a cena usa a resposta dele, de modo que **o erro fica visível**.
   - **Reflexão:** isso é feedback sobre o *raciocínio*, não só sobre a exploração.
4. Não confunda **"engajamento" com "aprendizagem"**. O grupo do PhET mede aprendizagem com testes conceituais, e é esse o padrão a imitar.

### 💬 Possíveis perguntas da banca
- *"Por que não usar o PhET, que já existe?"* O PhET é ótimo, e você inclusive recomenda. O seu trabalho não compete com ele: **integra** simulação, lista de exercícios e espaço navegável, e o resultado do aluno alimenta a cena. É um formato diferente de atividade.
- *"O PhET tem anos de validação; o seu tem quanto?"* Seja honesto: o seu é uma **prova de conceito** com avaliação exploratória.

### 📚 Onde ler
- **O artigo original** (2 páginas, via CAPES).
- **Finkelstein et al. (2005),** *When learning about the real world is better done virtually*, Physical Review ST – Physics Education Research 1, 010103. É o estudo do circuito e a melhor evidência do argumento.
- **Adams et al. (2008),** *A study of educational simulations Part I – Engagement and learning*, Journal of Interactive Learning Research 19(3). Explica o método das entrevistas.
- **Brinque com o PhET** *Laboratório de Pêndulo* e *Movimento de Projétil* por 15 minutos cada, comparando com as suas salas. Anote o que ele faz que o seu não faz, como gráficos e medidores, e vice-versa.

---

## A5. ARTOM: Aplicativo para Ensino de Química em Realidade Aumentada (Pereira et al., 2021)

**Ficha**
- **Autores:** Zandara Pereira, Luana Rodrigues, Rafael de Oliveira Costa, Eros Izidoro Amaral e Marcelo Simas Mattos (IFRJ Arraial do Cabo).
- **Publicação:** *Anais dos Workshops do X CBIE (WCBIE 2021)*, SBC, p. 139–146. DOI 10.5753/wcbie.2021.217420.
- **Código:** github.com/luhunicorn/Artom
- **Vídeo:** youtu.be/WekOTTfQkYw

### Contexto e problema
- Para entender ligações químicas, o aluno precisa **imaginar** elétrons interagindo, porque átomos não são visíveis.
- Figuras estáticas mostram só o "antes" e o "depois" da ligação, não o processo.
- Os apps de química da Play Store (Resumão de Química etc.) têm texto e quiz, mas **nenhum mostra a ligação de forma dinâmica**.
- Os alunos são "nativos digitais" e o celular está deixando de ser proibido em sala.

### Por que RA e não RV
A RV exige óculos (Cardboard). A RA só precisa de um celular com câmera, portanto é mais acessível (Tori et al., 2006).

### Objetivo
Um app Android que mostre de forma dinâmica e interativa como ocorrem as **ligações covalentes**, voltado ao 1º ano do EM. É o conteúdo-base de toda a química do EM.

### Desenvolvimento
- **Ferramentas:** Unity 2018.4 + **Vuforia** (RA por marcador), em C#, para Android 4.4 ou mais novo.
- **Cartões impressos** com QR code, um por átomo (H, O, C, Cl, B, N). A câmera reconhece o cartão e mostra o átomo 3D (núcleo colorido e elétrons orbitando) com nome, número atômico e massa.
- **Interação física:** o aluno **aproxima os cartões com a mão**. Se a distância passa de um limiar **e** os átomos podem formar uma molécula, uma animação os funde e mostra a **geometria molecular**. Se afastar, a molécula se desfaz.
- **Moléculas codificadas:** H₂O, HCl, BH₃, CH₄ e "NH (Amônia)".

### Resultados e conclusão
- **Não houve avaliação com usuários.** O app foi feito na pandemia e não pôde ser testado em sala.
- É um **projeto integrador de alunas do técnico integrado ao EM**.
- **Problema relatado:** uma dependência do Vuforia deixou de existir no Unity, e por isso **não puderam fazer as correções pedidas pelos revisores**.
- **Melhorias sugeridas:**
  - textos explicativos;
  - **jogos de fixação** (memória, associação fórmula × nome, adivinhação);
  - chat professor-aluno.

### 🧠 Leitura crítica
1. **A interação é muito boa:** juntar cartões com a mão é um gesto **concreto** que vira um fenômeno. É a mesma filosofia de "a ação do aluno vira o fenômeno" da sua proposta.
2. **A fragilidade tecnológica é real.** Um plug-in proprietário quebrou e o projeto parou. É o mesmo destino do X3D (Falcão).
   - **Argumento para você:** padrões abertos da web (WebGL) duram mais que plug-ins.
3. **Há um erro de química no texto:** "NH (Amônia)". A amônia é **NH₃**.
   - **Reflexão:** um software educacional com erro conceitual ensina errado.
   - **Isso justifica a sua lista resolvida à mão e a revisão das fórmulas, principalmente porque você usa IA para gerar conteúdo.** Coloque isso na metodologia: "todo conteúdo gerado foi conferido contra a resolução manual".
4. **Sem avaliação, não há resultado.** É um artigo de "apresentação de software", formato válido em workshop, mas que **não serviria** para um TCC. O seu precisa de avaliação.
5. **Por que ainda pode servir para Física?** Pelo argumento comum: **ensino médio + 3D + tornar visível o que não se vê + feedback imediato da ação**. Mesmo assim, como seu tema é Física, a banca pode achar fora do escopo, por isso a sugestão de trocar pelo Meiguins (2002).

### 📚 Onde ler
- O PDF tem só 8 páginas, e as Figuras 4 a 6 (p. 144) mostram a interação.
- Assista ao vídeo do YouTube (2 min) para ver a interação com os cartões.
- **Tori, Kirner e Siscoutto (2006),** *Fundamentos e Tecnologia de Realidade Virtual e Aumentada*, SBC. É o livro brasileiro de base sobre RV e RA, gratuito, e serve para a sua fundamentação sobre ambientes virtuais.

---

## Fio condutor: o que os 5 juntos mostram (use na "Lacuna")

| | Navegador, sem instalar | Ensino médio / Física | Ambiente navegável | Exercícios com feedback do raciocínio | Mede aprendizagem |
|---|---|---|---|---|---|
| **Este trabalho** | ✔ | ✔ | ✔ | ✔ | ✔ (pré/pós planejado) |
| Brito (2026), ECOS | ✔ | ✘ (público geral, astronomia) | ✔ | ✘ | ✘ (só percepção) |
| Pina et al. (2025) | ✔ | ✘ (visitantes, paleontologia) | parcial (visualizador) | ✘ | ✔ (pré/pós com controle) |
| Falcão e Machado (2010) | ✘ (X3D + óculos) | ✔ | ✔ (recepção + salas) | ✘ (só parâmetros) | ✘ (só motivação) |
| Wieman et al. (2008), PhET | ✔ | ✔ | ✘ (simulações avulsas, 2D) | parcial (feedback da exploração) | ✔ (estudos do grupo) |
| Pereira et al. (2021), ARTOM | ✘ (app + cartões) | ✘ (química EM) | ✘ | ✘ | ✘ (sem avaliação) |

**A lacuna, em uma frase:**
> Há ambientes 3D de exposição (Brito; Pina), laboratórios 3D de física (Falcão) e simulações validadas (PhET). Mas nenhum deles **integra uma lista de exercícios do ensino médio a um ambiente virtual navegável em que a resposta do aluno é usada para gerar o fenômeno**, tornando o erro visível. Os trabalhos de ambiente virtual também raramente medem aprendizagem.

---

## A6. Busca extra (17/11): existe "exercício + simulação"? Sim, e isso é bom

Procurei especificamente sistemas em que o aluno **resolve exercícios dentro de uma simulação**. Achei dois que precisam estar no seu radar.

### A6.1 Physlets: problemas baseados em simulação (Dancy; Christian; Belloni, 2002)
- **Referência:** DANCY, M.; CHRISTIAN, W.; BELLONI, M. Teaching with Physlets: examples from optics. *The Physics Teacher*, v. 40, n. 8, p. 494–499, 2002. DOI 10.1119/1.1526622. Pré-print: https://arxiv.org/abs/physics/0211028
- **Livro base:** CHRISTIAN, W.; BELLONI, M. *Physlets: Teaching Physics with Interactive Curricular Material*. Prentice Hall, 2001. Há também o *Physlet Physics*, com volume de Mecânica gratuito (CC BY-NC-ND) na ComPADRE: https://www.compadre.org/portal/items/detail.cfm?ID=8462
- **O que é:**
  - *Physlets* são pequenos programas de simulação (na época applets Java, hoje JavaScript) do Davidson College (EUA).
  - Com eles foram escritos **milhares de exercícios** de física introdutória, entregues numa página web.
  - **É o precedente mais próximo de uma "lista de exercícios interativa".**
- **Como funciona o exercício:**
  - O enunciado **não dá os dados**. Exemplo: "a fonte está à esquerda do espelho; você pode arrastá-la; encontre a distância focal".
  - O aluno precisa **descobrir quais informações importam, medir na simulação** e só então calcular.
  - Isso derruba o "plug-and-chug", o hábito de procurar uma fórmula com as letras do enunciado.
  - **Outros exemplos:**
    - "o que há atrás da cortina?" (descobrir a lente escondida);
    - prescrever óculos para um olho míope;
    - achar o índice de refração.
- **Argumentos do artigo (úteis para a sua fundamentação):**
  - Pesquisas (Chi; Larkin; Van Heuvelen) mostram que alunos resolvem problemas **sem pensar no conceito**, só caçando fórmula.
  - A interatividade **expõe concepções erradas** que o papel esconde. No exemplo, o aluno vê raios convergindo e acha que ali é o foco, e a própria simulação permite perceber o erro.
  - O maior benefício aparece **quando interagir com a simulação é essencial para resolver**.
  - Limite: é um artigo de relato de prática. **Não traz um experimento com números de aprendizagem**; cita teses (Titus, 1998; Dancy, 2000).

> 🔑 **A diferença que salva o seu trabalho:**
> - **No Physlet:** simulação → aluno mede → aluno responde (a simulação é a *fonte dos dados*).
> - **No seu:** aluno calcula → **a resposta dele entra na simulação** → a cena mostra a consequência (a simulação é o *teste da resposta*).
>
> É o caminho **inverso**. Se o aluno erra o alcance do lançamento, o alvo não é atingido. Se erra o período, o pêndulo não sincroniza.
>
> **Escreva isso explicitamente no TCC.** É a sua contribuição mais clara, e citar o Physlet mostra que você conhece a área.

### A6.2 Ambiente virtual com simulações interativas para Mecânica (Jalk Duque; Valbuena Duarte; Racedo Niebles, 2026)
- **Referência:** JALK DUQUE, F. A.; VALBUENA DUARTE, S.; RACEDO NIEBLES, F. J. Design of a virtual environment with interactive simulations for the teaching of mechanics. *EURASIA Journal of Mathematics, Science and Technology Education*, v. 22, n. 1, em2764, 2026. DOI 10.29333/ejmste/17756. Acesso aberto (CC BY). Autores da Universidad del Atlántico, Colômbia.
- **O que fizeram:**
  - um **site** (feito no Wix, sem programação) com simulações **2D** em **GeoGebra** embutidas por iframe;
  - temas: MRU, queda livre (inclusive "no estilo de Galileu, do alto de um prédio"), lançamento oblíquo, movimento circular, plano inclinado, máquina de Atwood, pêndulo, mesa de forças e paquímetro;
  - cada simulação tem **três abas: Teoria, Guia e Simulação**;
  - comparam a gravidade em diferentes planetas.
- **Atividades e feedback:**
  - sequência de 5 fases: manipular parâmetros → atividade guiada → coletar dados → responder perguntas orientadoras → refletir;
  - **dois tipos de feedback:**
    1. **visual dinâmico:** mudar as forças e ver o vetor resultante mudar;
    2. **validação de resposta:** no paquímetro, o aluno digita a leitura e recebe "¡Correcto!" ou "Intenta de nuevo", com dica.
- **Avaliação:**
  - piloto exploratório com **20 licenciandos em Matemática** (não alunos do EM), em sala com o professor;
  - os autores relatam mais motivação, compreensão visual e autonomia, em análise qualitativa;
  - recomendam ampliar para outras instituições e explorar **personalização com IA**.
- **Por que é importante para você:**
  - É **o trabalho mais parecido com o seu** em conteúdo (Mecânica do EM) e em ideia (teoria + simulação + perguntas com feedback).
  - Também é **de 2026**, o que mostra que o tema está atual.
- **Diferenças:**
  1. é **2D**, em páginas separadas, e não um espaço 3D navegável;
  2. o feedback é "certo/errado" em texto, e a resposta **não muda o fenômeno**;
  3. as perguntas não vêm de uma lista resolvida ligada ao conteúdo;
  4. foi avaliado com licenciandos, não com alunos do EM.
- **Leitura crítica:**
  - o site foi feito em Wix, uma plataforma comercial: se a conta acabar, o site some (o mesmo problema do Vuforia e do X3D);
  - N = 20, sem pré/pós-teste, então é um "piloto";
  - eles sugerem IA como futuro, e você **já usa IA** no desenvolvimento.
- 👉 **Sugestão:** **troque o ARTOM por este.** É Física, é Mecânica, é recente e tem exercícios com feedback.

### Atualização do quadro comparativo

| | Navegador | EM / Física | Ambiente 3D navegável | Exercícios | A resposta do aluno **altera a cena** | Mede aprendizagem |
|---|---|---|---|---|---|---|
| **Este trabalho** | ✔ | ✔ | ✔ | ✔ (lista resolvida) | ✔ | ✔ (pré/pós) |
| Dancy et al. (2002), Physlets | ✔ | ✔ (introdutória) | ✘ (2D) | ✔ | ✘ (a simulação dá os dados) | ✘ (relato) |
| Jalk Duque et al. (2026) | ✔ | ✔ Mecânica | ✘ (2D, páginas) | ✔ (perguntas + correto/errado) | ✘ | ✘ (piloto qualitativo) |

**A lacuna, refinada:**
> Simulações com exercícios já existem: os Physlets desde os anos 2000, e Jalk Duque et al. (2026) com GeoGebra. Ambientes 3D navegáveis de física também (Falcão; Machado, 2010). Nos trabalhos analisados, porém, a simulação **fornece os dados** ou apenas **valida** a resposta. **Nenhum usa a resposta do aluno como entrada da simulação**, de modo que o erro de cálculo se torne visível no fenômeno, e nenhum faz isso dentro de uma exposição 3D navegável.

> ⚠ **Honestidade:** a busca não foi exaustiva (é impossível ser). Na banca, diga **"nos trabalhos analisados"** e nunca "não existe nenhum trabalho que…". Isso evita a pergunta "e o trabalho X?".
>
> Também vale abrir o *Movimento de Projétil* do PhET: ele tem um **alvo** para tentar acertar, o que é uma forma simples de "desafio". Confira, porque é o PhET e a banca pode conhecer.

---

# PARTE B: Texto para o TCC (formato P1/P2/P3)

> **Abertura do capítulo:**
> - **Modelo:** "Nesta seção são apresentados trabalhos que utilizam ambientes virtuais tridimensionais e simulações interativas no apoio ao ensino e à divulgação científica. O objetivo é analisar soluções existentes quanto à tecnologia, ao público e à forma de avaliação, a fim de situar a proposta deste trabalho."
> - Os textos abaixo são **rascunhos-base**: reescreva com as suas palavras antes de colar no Overleaf.

### B1. ECOS: Uma Exposição Virtual de Artefatos Espaciais Baseada em Web 3D
- **P1 (o quê):**
  - Brito (2026) desenvolveu o ECOS, uma exposição virtual de artefatos espaciais (Saturn V, Hubble, James Webb, Voyager 1 e ISS) acessível pelo navegador.
  - Está organizada em três ambientes: um hall com os artefatos em pedestais, salas temáticas com painéis de História, Tecnologias, Missões e Futuro, e um visualizador orbital para inspeção detalhada.
  - O objetivo foi superar a inacessibilidade física desses objetos e a limitação de painéis e vídeos estáticos.
- **P2 (como e resultado):**
  - A aplicação foi construída com o framework A-Frame, sobre Three.js e WebGL, com modelos 3D obtidos de repositórios públicos, e publicada no GitHub Pages.
  - A avaliação envolveu 26 voluntários, com roteiro de tarefas e questionário em escala Likert.
  - A qualidade visual foi o aspecto mais bem avaliado, enquanto usuários de celular relataram dificuldades de navegação e desempenho e sentiram falta de um tutorial.
- **P3 (semelhança × diferença):**
  - **Assim como** este trabalho, o ECOS utiliza uma exposição Web 3D navegável, organizada do geral (hall) ao específico (salas e inspeção), e avalia a experiência com usuários.
  - **A diferença principal** está no propósito. O ECOS é voltado à divulgação científica para o público geral e não propõe atividades. Este trabalho é direcionado ao ensino de Física no ensino médio e integra exercícios cuja resposta do aluno é representada na cena.
  - O próprio autor aponta a integração de exercícios às salas como trabalho futuro.
- **Figura:** o hall do ECOS (Figura 13 do TCC). Fonte: Brito (2026).

### B2. Experiência Interativa em 3D para Exibição de Animais Extintos no Museu Emílio Goeldi
- **P1:**
  - Pina et al. (2025) apresentam uma aplicação web interativa para a visualização de modelos tridimensionais de cinco animais extintos do território brasileiro, no contexto do Museu Paraense Emílio Goeldi.
  - Os autores investigaram se a visualização 3D interativa aumenta o engajamento e a retenção de conhecimento em comparação com a exposição tradicional.
- **P2:**
  - A aplicação foi desenvolvida com React Three Fiber (Three.js/WebGL), com modelos otimizados (compressão Draco e nível de detalhe adaptativo) para funcionar também em celulares.
  - Em um estudo quase-experimental com 150 participantes, com testes de conhecimento pré e pós-uso e retenção após duas semanas, os autores relatam usabilidade média de 78,4 na escala SUS e ganho de conhecimento significativamente maior no grupo que usou a aplicação.
- **P3:**
  - **Assim como** este trabalho, utiliza Three.js no navegador, priorizando o acesso por diferentes dispositivos, e avalia o aprendizado com testes antes e depois do uso.
  - **Diferencia-se** pelo domínio e pela interação. A aplicação de Pina et al. é voltada à paleontologia e permite apenas observar e girar os modelos. Este trabalho trata de conteúdos de Física do ensino médio, em que o aluno resolve exercícios e altera o fenômeno observado.
- **Figura:** a Figura 2 do artigo (as espécies na aplicação). Fonte: Pina et al. (2025).

### B3. Um Laboratório Virtual Tridimensional e Interativo para Suporte ao Ensino de Física
- **P1:**
  - Falcão e Machado (2010) desenvolveram o LabSEF, um laboratório virtual tridimensional para apoiar o ensino de Física no ensino médio.
  - O ambiente simula três experimentos: movimento retilíneo uniforme, queda livre e lançamento oblíquo.
  - Ele é organizado em uma sala de recepção e um corredor com portas para cada experimento, onde o aluno insere parâmetros e observa a simulação, tabelas de dados e vetores de velocidade.
- **P2:**
  - O laboratório foi construído com X3D, Blender e Java e oferece visualização estereoscópica com óculos anáglifos de baixo custo.
  - Uma avaliação com 33 estudantes de um curso pré-vestibular indicou que 23 não tiveram dificuldade nas simulações e que 31 se sentiram estimulados pela visão 3D. O lançamento oblíquo foi o experimento em que mais alunos relataram dificuldade.
- **P3:**
  - **Assim como** este trabalho, trata de conteúdos de Mecânica do ensino médio em um ambiente 3D navegável, organizado em salas por experimento, com painéis teóricos e parâmetros ajustáveis.
  - **Diferencia-se** por exigir a instalação de um software específico, por não estar associado a exercícios e por avaliar apenas a motivação dos alunos.
  - Este trabalho roda diretamente no navegador, inclusive em celulares, e vincula cada sala a exercícios de uma lista resolvida.
- **Figura:** a Figura 2 do artigo (recepção e corredor de portas). Fonte: Falcão e Machado (2010).

### B4. PhET: Simulations That Enhance Learning
- **P1:**
  - Wieman, Adams e Perkins (2008) apresentam o projeto PhET, da Universidade do Colorado: um conjunto de simulações interativas gratuitas de Física e Química, executadas no navegador.
  - Inclui fenômenos como pêndulo, movimento de projéteis e órbitas.
  - Os autores defendem que simulações projetadas a partir de pesquisa com estudantes podem promover aprendizagem conceitual comparável ou superior à de métodos tradicionais.
- **P2:** *(conferir no artigo original antes de usar)*
  - As simulações são desenvolvidas e refinadas a partir de entrevistas com estudantes.
  - Priorizam feedback imediato, múltiplas representações (objeto, gráfico e valores) e a visualização de grandezas invisíveis.
  - Os autores citam estudos em que estudantes que usaram simulações tiveram desempenho superior aos que usaram equipamentos reais.
- **P3:**
  - **Assim como** este trabalho, utiliza simulações interativas no navegador com feedback imediato para o ensino de Física.
  - **Diferencia-se** por oferecer simulações bidimensionais e independentes, sem um espaço que as organize e sem exercícios integrados.
  - Neste trabalho, as simulações compõem uma exposição virtual tridimensional, e a resposta do aluno a cada exercício é usada como entrada da simulação.
- **Figura:** uma captura do *Laboratório de Pêndulo* do PhET. Fonte: PhET Interactive Simulations, University of Colorado Boulder. O PhET permite usar imagens com atribuição (CC-BY).

### B5. ARTOM: Aplicativo para Ensino de Química em Realidade Aumentada *(ou o substituto de Física)*
- **P1:**
  - Pereira et al. (2021) apresentam o ARTOM, um aplicativo Android para apoiar o ensino de ligações químicas covalentes no início do ensino médio.
  - Ao aproximar cartões impressos que representam átomos, o aluno visualiza em realidade aumentada a formação da molécula e sua geometria.
- **P2:**
  - O aplicativo foi desenvolvido em Unity com o plug-in Vuforia para reconhecer os cartões.
  - Não foi avaliado com usuários, e os autores relatam que a descontinuação de uma dependência do Vuforia impediu ajustes no protótipo.
- **P3:**
  - **Assim como** este trabalho, busca tornar visível um fenômeno que o aluno não enxerga, com uma interação em que a ação do usuário gera o resultado visual.
  - **Diferencia-se** pela área (Química), pela necessidade de instalar o aplicativo e imprimir cartões, e pela ausência de avaliação.
  - Este trabalho funciona no navegador, sem materiais adicionais, e inclui avaliação com usuários.
- **Figura:** a Figura 5 do artigo (formação da H₂O). Fonte: Pereira et al. (2021).

### B6. Análise comparativa (fechamento)
> "O Quadro X compara os trabalhos analisados com a proposta deste trabalho quanto à forma de acesso, ao público, à organização do ambiente, à presença de exercícios e à avaliação de aprendizagem."

Use a tabela do **Fio condutor** acima, com ✔/✘ ou Sim/Não. A **lacuna** vai num parágrafo logo depois do quadro.

---

## Referências (formato ABNT, conferir antes de usar)
- BRITO, J. G. F. **ECOS**: uma exposição virtual de artefatos espaciais baseada em web 3D. 2026. 47 f. Trabalho de Conclusão de Curso (Graduação em Ciência da Computação) – Universidade Federal do Ceará, Campus de Quixadá, Quixadá, 2026.
- PINA, I. C.; SOUZA, T. M.; SILVA FILHO, F. G. S.; SERUFFO, M. C. R.; CARDOSO, D. L. Experiência interativa em 3D para exibição de animais extintos no Museu Emílio Goeldi: uma abordagem educacional e tecnológica baseada em WebGL. In: SIMPÓSIO BRASILEIRO DE SISTEMAS MULTIMÍDIA E WEB (WEBMEDIA), 31., 2025, Rio de Janeiro. **Anais** [...]. Porto Alegre: SBC, 2025. p. 220–228. DOI: 10.5753/webmedia.2025.16163.
- FALCÃO, E. L.; MACHADO, L. S. Um laboratório virtual tridimensional e interativo para suporte ao ensino de física. In: WORKSHOP DE INFORMÁTICA NA ESCOLA (WIE), 16., 2010, Belo Horizonte. **Anais** [...]. Porto Alegre: SBC, 2010. p. 1285–1293. DOI: 10.5753/wie.2010.25401.
- WIEMAN, C. E.; ADAMS, W. K.; PERKINS, K. K. PhET: simulations that enhance learning. **Science**, v. 322, n. 5902, p. 682–683, 2008. DOI: 10.1126/science.1161948.
- PEREIRA, Z.; RODRIGUES, L.; COSTA, R. O.; AMARAL, E. I.; MATTOS, M. S. ARTOM: aplicativo para ensino de química em realidade aumentada. In: WORKSHOPS DO CONGRESSO BRASILEIRO DE INFORMÁTICA NA EDUCAÇÃO (WCBIE), 10., 2021, *online*. **Anais** [...]. Porto Alegre: SBC, 2021. p. 139–146. DOI: 10.5753/wcbie.2021.217420.

**Leituras extras recomendadas:**
- Slater (2009): imersão;
- Brooke (1996): SUS;
- Finkelstein et al. (2005): o virtual × o real no PhET;
- Fiolhais e Trindade (2003): física no computador, RBEF;
- Tori, Kirner e Siscoutto (2006): livro de RV/RA da SBC.
