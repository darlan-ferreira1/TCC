# Trabalhos parecidos: exercícios dentro de simulações

> **Por que este arquivo existe:** estes são os dois trabalhos encontrados (17/11/2026) que **mais se parecem com a ideia central** do seu TCC, ou seja, exercícios resolvidos com a ajuda de uma simulação.
> - Eles **não invalidam** o seu trabalho. Eles **delimitam** a sua contribuição.
> - **Formato:** igual ao `trabsRel.md`. A Parte A é o estudo profundo; a Parte B é o texto para o TCC.
> - **Termo:** "ambiente virtual interativo" ou "exposição virtual interativa", nunca "museu".

---

# PARTE A: Estudo profundo

## P1. Teaching with Physlets: Examples from Optics (Dancy; Christian; Belloni, 2002)

**Ficha**
- **Autores:**
  - Melissa Dancy, Wolfgang Christian e Mario Belloni (Davidson College, EUA).
  - Christian e Belloni são os criadores dos Physlets e autores de livros sobre o tema.
- **Publicação:** *The Physics Teacher*, v. 40, n. 8, p. 494–499, 2002. DOI 10.1119/1.1526622.
- **Pré-print gratuito:** https://arxiv.org/abs/physics/0211028
- **Coleção atual:** *Physlet Physics*, com o volume de Mecânica gratuito (CC BY-NC-ND): https://www.compadre.org/portal/items/detail.cfm?ID=8462
  - A 3ª edição foi reescrita em JavaScript e roda em celular.
- **Revista:** *The Physics Teacher* é da AAPT (associação americana de professores de física). É uma revista **para professores**, com relatos de prática, e não uma revista de pesquisa experimental.

### Contexto
- A pesquisa em ensino de física (Chi et al., 1981; Larkin et al., 1980; Van Heuvelen, 1991) mostra que, nos exercícios de fim de capítulo, o aluno **procura uma fórmula que contenha as letras do enunciado** e ignora o conceito. É o famoso **"plug-and-chug"** (substituir e calcular).
- **Alternativas já propostas:**
  - estratégias passo a passo (Polya; Reif);
  - problemas "ricos em contexto" (Heller), que contam uma história, dão informação demais e não dizem o que calcular;
  - problemas de estimativa (Fermi).

### Problema
Como criar exercícios que **obriguem o aluno a conceituar o problema** antes de fazer conta?

### Proposta e objetivo
Usar **Physlets**, pequenos programas de simulação "roteirizáveis" (*scriptable*), para escrever **problemas alternativos**.
- Na época eram 24 Physlets, com os quais professores já tinham criado **milhares de problemas** cobrindo quase toda a física introdutória, entregues em páginas web.
- O artigo apresenta os fundamentos pedagógicos e exemplos de **óptica**.

### Como funcionam os problemas (os exemplos)
1. **Espelho (Fig. 1):**
   - Enunciado: "uma fonte está à esquerda de um espelho; você pode arrastá-la; ache a distância focal".
   - **Nenhum dado numérico é fornecido.**
   - O aluno precisa decidir o que medir (onde um raio paralelo cruza o eixo) e medir na simulação.
2. **"O que há atrás da cortina?" (Fig. 3):**
   - Há quatro regiões escondidas.
   - O aluno move as fontes de luz para descobrir se ali há uma lente divergente, convergente ou nada.
   - Depois ordena as distâncias focais.
3. **Olho (Fig. 4–5):**
   - O aluno coloca fontes perto e longe e ajusta a acomodação para diagnosticar a miopia.
   - Depois "prescreve" a lente dos óculos.
   - Foi usado **em prova**.
4. **Índice de refração (Fig. 6):** o aluno muda o meio em volta da lente até a luz não desviar. Nesse ponto o índice é igual ao do meio.
5. **Tanque de ondas (Fig. 7):** uma demonstração de interferência que gera perguntas, como descobrir a diferença de fase entre as fontes.

### Argumentos do artigo (os 3 benefícios da interatividade)
1. **Criatividade:** há vários caminhos para a resposta.
   - No exemplo do espelho, alguns alunos movem a fonte até os raios saírem paralelos e assim acham o foco "de trás para frente".
2. **Aprendizagem durante a resolução:** o aluno vê o efeito das próprias ações, mesmo quando não era necessário mexer.
3. **Diagnóstico de concepções erradas:**
   - Alguns alunos põem a fonte no eixo, veem os raios convergirem e dizem "o foco é aqui". Está errado, porque o foco é onde convergem raios **paralelos**.
   - No papel esse erro ficaria invisível.
   - Na simulação, o próprio aluno pode perceber: ao mover a fonte, o ponto muda, mas o foco é fixo.

> **A frase-chave do artigo:** o maior benefício aparece **quando interagir com o Physlet é essencial para a solução** (citam Titus, 1998, e Dancy, 2000).

### Resultados e conclusão
- **Não há experimento quantitativo.** É um relato de prática com exemplos.
- **Evidência indireta:**
  - os alunos acharam o problema do olho "empolgante e relevante";
  - o problema funcionou em prova para separar quem entendeu de quem não entendeu.
- Os problemas são gratuitos para uso não comercial, e os autores anunciam o livro de exercícios (*Physlet Workbook*).

### 🧠 Leitura crítica e reflexões
1. **É a ideia de "lista interativa" de vinte anos atrás, e isso é bom para você.** Mostra que exercício dentro de simulação é uma abordagem reconhecida pela comunidade de ensino de física.
   - Na banca, cite como **fundamentação**: "a literatura já aponta vantagens de problemas baseados em simulação (Dancy; Christian; Belloni, 2002)".
2. **A direção da informação é o ponto central:**
   - **Physlet:** simulação → o aluno **extrai** dados → responde. A simulação é **fonte**.
   - **O seu:** o aluno calcula → a resposta **entra** na simulação → a cena mostra a consequência. A simulação é **juiz**.

   Pense no exercício 7 da sua lista: o aluno calcula o alcance (34,6 m), e o ambiente coloca o alvo onde ele disse. Se errou, a bola cai longe do alvo, e **o erro vira algo que se vê**.
3. **O seu também combate o "plug-and-chug", por outro caminho.** No Physlet, o enunciado não dá números. No seu, a consequência visual força o aluno a perguntar **por que** errou.
   - **Reflexão:** dá para juntar os dois? Uma questão em que o aluno mede na sala e outra em que a resposta dele é testada? A sua lista já tem as duas coisas (exercícios 1 e 2 do pêndulo).
4. **Diagnóstico de concepções erradas** é um argumento forte para a sua discussão. Se a cena "errada" mostrar **qual** erro o aluno cometeu, por exemplo trocar seno por cosseno no lançamento, você está fazendo o que o artigo elogia.
   - **Ideia para o sistema:** prever os erros comuns e mostrar a cena correspondente a cada um.
5. **Limite:** sem dados de aprendizagem. **Não diga** "Physlets comprovadamente melhoram o aprendizado". Diga "os autores relatam…".
6. **2D e páginas soltas.** Não há ambiente navegável nem organização espacial. É o mesmo limite do PhET.

### 💬 Possíveis perguntas da banca
- *"Exercício com simulação já existe desde 2002, qual a novidade?"*
  - A inversão: a resposta do aluno **dirige** a simulação, em vez de ser lida dela.
  - Fica num ambiente 3D navegável e está ligado a uma lista resolvida.
  - Não é inédito no mundo, mas é uma combinação que não aparece nos trabalhos analisados.
- *"Por que não usou Physlets?"* Eles são 2D e de outro contexto (o currículo americano). O seu foco é o currículo do EM brasileiro e o ENEM, num ambiente navegável.

### 📚 Onde ler
- O **pré-print do arXiv** tem só 6 páginas, leia inteiro. As Figuras 1 e 2 (o erro do foco) são a melhor parte.
- **Abra o *Physlet Physics*** (ComPADRE), capítulo de cinemática, e resolva 2 problemas, prestando atenção em como o enunciado é escrito. É um ótimo modelo para escrever as suas questões.
- **Van Heuvelen (1991),** *Learning to think like a physicist*, American Journal of Physics 59, 891–897: a base sobre resolução de problemas.
- **Chi, Feltovich e Glaser (1981),** *Categorization and representation of physics problems by experts and novices*, Cognitive Science 5: o estudo clássico que mostra que novatos olham para a superfície do problema.

---

## P2. Design of a Virtual Environment with Interactive Simulations for the Teaching of Mechanics (Jalk Duque; Valbuena Duarte; Racedo Niebles, 2026)

**Ficha**
- **Autores:** Fabián Andrés Jalk Duque, Sonia Valbuena Duarte e Francisco Juan Racedo Niebles (Universidad del Atlántico, Barranquilla, Colômbia).
- **Publicação:** *EURASIA Journal of Mathematics, Science and Technology Education*, v. 22, n. 1, em2764, 2026. DOI 10.29333/ejmste/17756.
  - Recebido em 18/07/2025 e aceito em 07/12/2025.
  - Acesso aberto (CC BY).
- **Revista:** periódico internacional da área de ensino de ciências e matemática, publicado pela Modestum.

### Contexto e problema
- A mecânica é a base da física, mas é abstrata e matemática, e os alunos se entediam ou se frustram.
- Muitas instituições **não têm laboratórios**: os equipamentos são caros e faltam espaço e pessoal treinado.
- Simulações digitais (PhET, GeoGebra) são uma alternativa.

### Fundamentação
- **Simulações:** permitem gerar e analisar dados em cenários hipotéticos, e não só assistir (PhET; Lino-Calle et al., 2023).
- **Abordagem STEM:** ciência, tecnologia, engenharia e matemática integradas, com resolução de problemas reais. O artigo organiza cada simulação nas 4 dimensões:
  - **ciência:** testar hipóteses;
  - **tecnologia:** inspecionar e modificar o applet;
  - **engenharia:** projetar e calibrar;
  - **matemática:** modelar e comparar dados.

### Objetivo
Projetar e apresentar uma **plataforma web de simuladores interativos feitos em GeoGebra**. Complementarmente, fazer um **piloto exploratório** sobre usabilidade percebida e contribuição pedagógica.

### Metodologia: desenvolvimento
- **Simulações em GeoGebra**, o software de geometria dinâmica, gratuito, com a parte algébrica e a geométrica integradas.
  - Temas: MRU, queda livre, lançamento oblíquo, movimento circular, plano inclinado, máquina de Atwood, sistema massa-mola, pêndulo, mesa de forças, paquímetro e micrômetro.
  - Cada simulação é um applet independente com controles (massa, gravidade, ângulo, velocidade) e **gráficos em tempo real**.
- **Site em Wix**, um editor arrasta-e-solta sem programação, com hospedagem incluída. Os applets entram por *iframe*.
  - Menu por tema.
  - Cada página tem **3 abas: Teoria, Guia e Simulação**, mais as referências.
- **Exemplo detalhado, a queda livre:**
  - (A) um prédio "no estilo de Galileu", com altura de 0 a 100 m e gravidade **Terra, Lua, Marte ou uma gravidade misteriosa gₓ**;
  - (B) um arranjo de laboratório escolar com eletroímã, esfera e cronômetro digital.
  - Atividades:
    1. medir o tempo de queda;
    2. variar a altura e o planeta;
    3. calcular g = 2h/t²;
    4. calcular o **erro percentual**;
    5. **descobrir a que planeta pertence a gravidade misteriosa**;
    6. opinar.
- **MRU:** calcular a inclinação do gráfico x × t, interpretá-la como velocidade e comparar com o simulador, com erro percentual.

### Metodologia: as atividades e o feedback
Uma sequência de 5 fases:
1. manipular os parâmetros;
2. atividade guiada (no simulador ou na aba Guia);
3. coletar dados (gráficos, tabelas, leituras);
4. **responder às perguntas orientadoras**;
5. análise e reflexão em grupo.

**Dois tipos de feedback (Fig. 3):**
- **visual dinâmico:** na mesa de forças, mudar uma força faz o vetor resultante se atualizar na hora;
- **validação de resposta:** no paquímetro, o aluno digita a leitura e recebe **"¡Correcto!"** ou **"Intenta de nuevo"**, com dica.

### Avaliação
- **Participantes:** 20 estudantes de um curso de formação em ensino de física para **licenciandos em Matemática** (universidade pública da Colômbia), voluntários de uma única turma.
- **Contexto:** em sala, com o professor guiando, como preparação ou substituto de laboratório real.
- **Instrumentos:**
  - questionário Likert de 5 itens (muito ruim → excelente) sobre usabilidade, motivação e apoio à aprendizagem;
  - observação em sala.
- **Ética:** o artigo declara isenção de comitê de ética, por ser avaliação de baixo risco em contexto normal de ensino, com consentimento informado e dados anônimos.

### Resultados
- Mais de 80% avaliaram como bom ou excelente, com destaque para **motivação (93%)** e **compreensão dos conceitos (87%)**. Nenhuma resposta "muito ruim".
- **Por simulador:**
  - queda livre: 91% disseram que ajudou a entender o MUV;
  - plano inclinado: 88%;
  - MRU: 90%;
  - micrômetro: 85%.
- **Relatos:** menos ansiedade antes do laboratório real, os alunos chegam com hipóteses, e o professor antecipa as dificuldades.

### Conclusão
- GeoGebra com Wix é uma estratégia eficaz e de baixo custo para ensinar mecânica onde faltam recursos. A organização Teoria, Guia e Simulação favorece a autonomia.
- Não substitui o laboratório real, mas prepara para ele.
- **Futuros:**
  - amostras maiores e mais diversas;
  - análise qualitativa da interação;
  - **IA para personalizar trilhas de aprendizagem**.

### 🧠 Leitura crítica e reflexões
1. **Esta é a revisão mais importante para você:** é Mecânica, inclui o ensino médio no público-alvo, tem teoria + guia + simulação + perguntas com feedback, roda na web e é de 2026.
   - O seu ambiente tem a mesma tríade: **Teoria** (quadro), **instruções** (o "i") e **simulação**.
   - Cite como o **trabalho mais próximo** e mostre a diferença com calma.
2. **Confira os percentuais. Com N = 20, cada pessoa vale 5%.**
   - Então só são possíveis 85%, 90%, 95%… Valores como **93%, 87%, 91% e 88% são impossíveis** com 20 respondentes, a menos que alguns não tenham respondido, o que o artigo não diz.
   - Não é acusação, pode ser arredondamento sobre itens ou outra base de cálculo. Mas é **exatamente** o tipo de coisa que um avaliador atento nota.
   - **Lição para o seu resultado:** sempre informe "n de N" (ex.: "17 de 20 participantes, 85%").
3. **Mede percepção, não aprendizagem.** A pergunta "a simulação ajudou a entender o MUV?" é de opinião. É o mesmo limite do Gustavo e do Falcão: **a lacuna "medir se aprendeu" aparece em quase todos**. Isso fortalece o seu pré/pós-teste.
4. **As perguntas induzem o "sim"**: "Did the virtual free-fall practice help strengthen your understanding…?". Quem respondeu estava em aula, com o professor ao lado.
   - **Reflexão:** na sua pesquisa, quem aplica o questionário é você, o autor do sistema. Como evitar que as pessoas respondam para agradar? Questionário anônimo, itens negativos (SUS) e questões de conteúdo.
5. **O feedback deles é "certo/errado" em texto.** O mais próximo do seu é a **gravidade misteriosa gₓ**, em que o aluno deduz o planeta pelos dados. Mesmo ali, a simulação **fornece** os dados.
   - **No seu:** a resposta do aluno **produz** a cena.
6. **A dependência do Wix**, uma plataforma comercial: se a conta acabar, o site some. É o mesmo padrão de fragilidade do Vuforia (ARTOM) e do X3D (Falcão).
   - O seu é código próprio e aberto, publicado no GitHub Pages.
7. **Repare na declaração de IA e na de ética no fim do artigo.** Eles declaram que usaram IA **só para revisar o idioma** e isentam o comitê de ética por ser baixo risco. É um modelo real de como revistas pedem isso (ver `ia_questao.md`).
8. **O público testado foi de licenciandos**, futuros professores, e não alunos do EM. Se o seu teste for com alunos do EM, isso já é uma diferença a seu favor.

### 💬 Possíveis perguntas da banca
- *"Esse artigo de 2026 já faz o que você faz?"*
  - Ele faz simulação 2D com perguntas corrigidas.
  - O seu faz **a resposta do aluno virar o fenômeno**, num ambiente 3D navegável, com uma lista resolvida e um teste de aprendizagem (pré/pós).
  - Os dois compartilham a estrutura teoria + guia + simulação, e você pode dizer que ela tem respaldo.
- *"Por que não usou GeoGebra?"* O GeoGebra é ótimo para 2D e gráficos, mas o ambiente navegável em 3D, com várias simulações num mesmo espaço e física por quadro, pede uma biblioteca 3D (Three.js).

### 📚 Onde ler
- **O artigo inteiro** (15 páginas, aberto).
  - Seção "Free fall" (p. 7–8): veja a lista de atividades, principalmente a gravidade misteriosa.
  - Seção "Results and Discussion": confira os percentuais.
- **Abra o GeoGebra** e procure "queda livre" ou "lançamento oblíquo" na comunidade. Há centenas de applets, o que mostra quão comum é a simulação 2D, e por isso o seu diferencial não pode ser "ter simulação".
- **Vidal e Menezes (2019),** *Laboratório real x laboratório virtual*, A Física na Escola 17(2). É brasileiro, está citado por eles e é bom para a fundamentação.

---

## Síntese: os dois juntos

| | Physlets (2002) | Jalk Duque et al. (2026) | **Este trabalho** |
|---|---|---|---|
| Plataforma | Web (applet → JS), 2D | Web (Wix + GeoGebra), 2D | Web (Three.js), **3D navegável** |
| Conteúdo | Física introdutória (óptica no artigo) | Mecânica | **Mecânica do EM**, lista própria |
| Papel da simulação | **Fonte** dos dados | Fonte dos dados + **valida** a resposta | **Recebe** a resposta e mostra a consequência |
| Feedback | O aluno interpreta | Correto / Tente de novo + dica; visual dinâmico | **Visual: a cena certa ou errada**, com dica |
| Avaliação | Relato (sem dados) | Piloto N = 20, percepção | **Pré/pós de conteúdo + SUS** (planejado) |

**Frase para a lacuna (versão final sugerida):**
> Simulações com exercícios já são usadas no ensino de física, seja como fonte de dados para o problema (Dancy; Christian; Belloni, 2002), seja com validação automática da resposta (Jalk Duque et al., 2026). Nos trabalhos analisados, no entanto, a resposta do aluno não é usada para gerar o fenômeno na simulação, e as atividades não ocorrem em um ambiente tridimensional navegável. Este trabalho explora essa combinação.

---

# PARTE B: Texto para o TCC (P1/P2/P3)

> Os textos são rascunhos. Reescreva com as suas palavras.

### B1. Teaching with Physlets: Examples from Optics
- **P1 (o quê):**
  - Dancy, Christian e Belloni (2002) apresentam o uso de Physlets, pequenas simulações programáveis distribuídas em páginas web, para a construção de problemas de física.
  - Nesses problemas, o enunciado não fornece os dados numéricos: o estudante precisa interagir com a simulação para identificar e medir as grandezas relevantes antes de resolver a questão.
  - O objetivo é evitar a estratégia de apenas substituir valores em fórmulas.
- **P2 (como e resultado):**
  - O artigo discute fundamentos pedagógicos e exemplos de óptica: a determinação da distância focal de um espelho, a identificação de lentes escondidas e o diagnóstico de miopia em um modelo do olho.
  - Os autores relatam que a interatividade permite diferentes caminhos de solução e torna visíveis concepções equivocadas que passariam despercebidas em problemas de papel.
  - O trabalho não apresenta uma avaliação quantitativa de aprendizagem.
- **P3 (semelhança × diferença):**
  - **Assim como** este trabalho, integra exercícios de física a simulações interativas acessíveis pelo navegador.
  - **A diferença principal** está no papel da simulação. Nos Physlets ela fornece os dados para o estudante resolver o problema. Neste trabalho, a resposta calculada pelo estudante é usada como entrada da simulação, de modo que um erro de cálculo se manifesta visualmente no fenômeno.
  - Além disso, as simulações aqui estão organizadas em um ambiente tridimensional navegável.
- **Figura:** a Figura 1 do artigo (o problema do espelho). Fonte: Dancy, Christian e Belloni (2002).

### B2. Design of a Virtual Environment with Interactive Simulations for the Teaching of Mechanics
- **P1:**
  - Jalk Duque, Valbuena Duarte e Racedo Niebles (2026) desenvolveram uma plataforma web com simulações interativas de Mecânica: queda livre, movimento retilíneo uniforme, lançamento oblíquo, plano inclinado, máquina de Atwood e pêndulo.
  - A motivação é a falta de laboratórios em instituições com poucos recursos.
  - Cada tema é organizado em seções de teoria, guia e simulação, com atividades e perguntas orientadoras.
- **P2:**
  - As simulações foram construídas no GeoGebra e incorporadas a um site criado no Wix.
  - Algumas atividades validam a resposta do estudante com mensagens de acerto ou erro e dicas.
  - Em um estudo piloto com 20 licenciandos, avaliado por questionário Likert e observação, os autores relatam avaliação positiva da motivação e da compreensão percebida dos conceitos.
- **P3:**
  - **Assim como** este trabalho, aborda conteúdos de Mecânica com simulações acessíveis pelo navegador, organizadas com teoria, instruções e atividades com retorno ao estudante.
  - **Diferencia-se** por apresentar simulações bidimensionais em páginas separadas e por fornecer retorno textual de acerto ou erro, sem que a resposta altere o fenômeno simulado.
  - Também avaliou apenas a percepção dos participantes. Este trabalho propõe um ambiente tridimensional navegável, no qual a resposta do estudante é representada na cena, e prevê a avaliação da aprendizagem por meio de testes antes e depois do uso.
- **Figura:** a Figura 6 do artigo (simulação de queda livre). Fonte: Jalk Duque, Valbuena Duarte e Racedo Niebles (2026).

### Referências (ABNT, conferir)
- DANCY, M.; CHRISTIAN, W.; BELLONI, M. Teaching with Physlets: examples from optics. **The Physics Teacher**, v. 40, n. 8, p. 494–499, 2002. DOI: 10.1119/1.1526622.
- JALK DUQUE, F. A.; VALBUENA DUARTE, S.; RACEDO NIEBLES, F. J. Design of a virtual environment with interactive simulations for the teaching of mechanics. **Eurasia Journal of Mathematics, Science and Technology Education**, v. 22, n. 1, em2764, 2026. DOI: 10.29333/ejmste/17756.
