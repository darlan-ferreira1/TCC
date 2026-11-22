# Onde vale a pena usar citação direta (19/11/2026)

Feito a partir do texto em `tcc2_museu/2-textuais/`. As linhas são as desses arquivos.

**Quando a citação direta vale a pena:**
- definição;
- número;
- afirmação forte que sustenta o seu argumento, especialmente a **lacuna**.

Nesses casos, a citação direta protege você na banca: se alguém duvidar, você mostra que é exatamente o que o autor escreveu.

**Como escrever** (guia de citações UFC 2025):
- até 3 linhas: entre aspas, com página. Ex.: `\citeonline[p.~44]{brito2026}` ou `\cite[p.~44]{brito2026}`;
- mais de 3 linhas: bloco recuado, sem aspas, com `\begin{citacao} ... \end{citacao}`;
- texto em inglês traduzido por você: acrescente "tradução nossa", como em `\cite[p.~81, tradução nossa]{hattie2007}`;
- trecho cortado: use `[...]`.

**Legenda:**
- ✅ **conferido:** trecho copiado do PDF que está em `pdfsTrabalhosRelacionados/`;
- ⚠ **confirmar:** eu não tenho o PDF. O trecho é de memória e você **precisa** conferir texto e página no original antes de usar.

---

## Prioridade alta

### 1. O próprio Gustavo coloca exercícios como trabalho futuro ✅
- **Onde:** `3-trabalhos-relacionados.tex`, parágrafo de semelhança × diferença do ECOS ("O próprio autor aponta a integração de exercícios às salas temáticas como trabalho futuro").
- **Por quê:** sustenta a lacuna do seu trabalho. É a frase que a banca mais pode questionar ("ele disse isso mesmo?").
- **Trecho original** (Brito, 2026, seção 6.1, Trabalhos Futuros; p. 44 no sumário do PDF):
  > "Gamificação: Incorporar elementos de jogos, como quizzes interativos integrados às salas temáticas, com o objetivo de aumentar o engajamento e estimular a participação ativa dos usuários."
- **Sugestão:** O próprio autor sugere, como trabalho futuro, "incorporar elementos de jogos, como quizzes interativos integrados às salas temáticas" \cite[p.~44]{brito2026}.
- ⚠ **Detalhe:** ele fala em *quizzes*, não em "exercícios". Com a citação direta, o leitor vê a palavra exata. Ajuste a sua frase para não dizer mais do que ele disse.

### 2. O Falcão avaliou só a motivação ✅
- **Onde:** `3-trabalhos-relacionados.tex:67` ("por avaliar apenas a motivação dos estudantes").
- **Por quê:** é uma crítica ao trabalho dele, então é melhor mostrar as palavras do próprio autor.
- **Trecho original** (Falcão; Machado, 2010, p. 1292):
  > "Uma avaliação preliminar do ambiente foi realizada com 33 alunos para coletar as impressões destes e verificar sua motivação quanto ao uso da aplicação."
- **Sugestão:** Os autores descrevem a avaliação como "preliminar", feita "com 33 alunos para coletar as impressões destes e verificar sua motivação quanto ao uso da aplicação" \cite[p.~1292]{falcao2010}.

### 3. Resultados declarados pelo Pina ✅
- **Onde:** `3-trabalhos-relacionados.tex`, parágrafo "como e resultado" do Pina (logo depois da linha 45).
- **Por quê:** você encontrou inconsistências nesse artigo (ver `proposta/trabsRel.md`). Citar diretamente deixa claro que **a afirmação é dos autores**, não sua.
- **Trecho original** (Pina et al., 2025, p. 220, resumo em inglês):
  > "Results demonstrated significantly higher engagement and knowledge retention."
- **Sugestão:** Segundo os autores, os resultados "demonstraram engajamento e retenção de conhecimento significativamente maiores" \cite[p.~220, tradução nossa]{pina2025}.

### 4. Conclusão do Jalk Duque ✅
- **Onde:** `3-trabalhos-relacionados.tex`, parágrafo "como e resultado" do Jalk Duque (depois da linha 99).
- **Por quê:** o estudo teve só 20 participantes, e os autores usam "sugere". A citação direta preserva essa cautela.
- **Trecho original** (Jalk Duque; Valbuena Duarte; Racedo Niebles, 2026, p. 1, resumo):
  > "Analysis of pedagogical use suggests that these simulations enhance motivation, visual understanding, and learning autonomy, particularly in resource-limited contexts."
- **Sugestão:** os autores concluem que a análise "sugere que essas simulações aumentam a motivação, a compreensão visual e a autonomia na aprendizagem" \cite[p.~1, tradução nossa]{jalkduque2026}.

### 5. PhET: simulação × demonstração tradicional ✅
- **Onde:** `3-trabalhos-relacionados.tex:118` ("aprendizagem conceitual comparável ou superior à de métodos tradicionais").
- **Por quê:** é uma afirmação comparativa forte. Hoje o texto generaliza mais do que o artigo diz.
- **Trecho original** (Wieman; Adams; Perkins, 2008, p. 682):
  > "When used as a lecture demonstration, the 'Wave on a String' simulation resulted in greater conceptual learning than did the standard demonstration."
- **Sugestão:** os autores relatam que, usada como demonstração em aula, a simulação de ondas em uma corda "resultou em maior aprendizagem conceitual do que a demonstração tradicional" \cite[p.~682, tradução nossa]{wieman2008}.

### 6. Definição de feedback (Hattie e Timperley) ⚠ confirmar
- **Onde:** `2-fundamentacao-teorica.tex:100` ("o definem como a informação fornecida sobre o desempenho...").
- **Por quê:** é uma **definição**, e o texto já diz "o definem como". Definição pede citação direta.
- **Trecho provável** (Hattie; Timperley, 2007, p. 81):
  > "feedback is conceptualized as information provided by an agent (e.g., teacher, peer, book, parent, self, experience) regarding aspects of one's performance or understanding."
- **Sugestão:** Hattie e Timperley (2007, p. 81, tradução nossa) definem o feedback como "informação fornecida por um agente (por exemplo, professor, colega, livro, pais, a própria pessoa, a experiência) sobre aspectos do desempenho ou da compreensão de alguém".

### 7. Ilusão de lugar e ilusão de plausibilidade (Slater) ⚠ confirmar
- **Onde:** `2-fundamentacao-teorica.tex:105` ("A ilusão de lugar é a sensação de estar no ambiente virtual; a ilusão de plausibilidade é...").
- **Por quê:** são **dois conceitos definidos** pelo autor. A citação direta evita uma definição sua que fique imprecisa.
- **Trechos prováveis** (Slater, 2009, resumo, p. 3549):
  > place illusion: "the strong illusion of being in a place in spite of the sure knowledge that you are not there"
  >
  > plausibility illusion: "the illusion that what is apparently happening is really happening (even though you know for sure that it is not)"
- **Sugestão:** traduza as duas e use `\cite[p.~3549, tradução nossa]{slater2009}`.

### 8. O número 55,8% (Peng et al.) ⚠ confirmar
- **Onde:** `2-fundamentacao-teorica.tex:123` ("concluíram uma tarefa 55,8% mais rápido").
- **Por quê:** é um **número**. Número citado sem a frase original é a primeira coisa que a banca checa.
- **Trecho provável** (Peng et al., 2023, resumo, p. 1):
  > "The treated group completed the task 55.8% faster than the control group."
- **Sugestão:** os autores relatam que o grupo com acesso ao assistente "concluiu a tarefa 55,8% mais rápido do que o grupo de controle" \cite[p.~1, tradução nossa]{peng2023}.

---

## Prioridade média (vale se sobrar tempo)

### 9. BNCC (currículo) ⚠ procurar o trecho
- **Onde:** `1-introducao.tex:17` e `5-metodologia.tex:42`.
- **Por quê:** é documento oficial, e você usa a BNCC para justificar a escolha dos conteúdos. Uma frase literal da competência dá mais força.
- **O que fazer:** no PDF da BNCC, Ensino Médio, área de Ciências da Natureza e suas Tecnologias, copie o trecho da **competência específica** que fala de analisar fenômenos e movimentos, com a página. Eu não vou citar de memória.

### 10. Chi, Feltovich e Glaser (1981): novatos × especialistas ⚠ procurar o trecho
- **Onde:** `2-fundamentacao-teorica.tex:96` e `1-introducao.tex:20`.
- **Por quê:** é o resultado central em que se apoia a sua "problemática". Uma frase do resumo do artigo, com a página, basta.

### 11. Finkelstein et al. (2005): simulação × equipamento real ⚠ procurar o trecho
- **Onde:** `1-introducao.tex:26`.
- **Por quê:** é uma afirmação comparativa ("desempenho superior, inclusive na montagem de circuitos reais"). Copie a frase do resumo.

### 12. Labster: licença paga e sem celular ⚠ procurar no site
- **Onde:** `4-softwares-realcionados.tex:94`.
- **Por quê:** são afirmações sobre um produto comercial, que pode mudar. Copie a frase do site (FAQ ou requisitos) com a data de acesso, que já está no `.bib`.

---

## Onde NÃO precisa de citação direta (pode continuar indireta)

- **Física (fórmulas e leis):** pêndulo, lançamento, Kepler, ondas, cônico e Foucault, em `2-fundamentacao-teorica.tex:27–82`. É conhecimento consolidado de livro-texto.
- **Tecnologias:** WebGL, Three.js, React e Vite (`2-fundamentacao-teorica.tex:114–118`). São descrições técnicas.
- **Descrição do que cada trabalho relacionado é** (o parágrafo "o que" de cada um). Resumir com as suas palavras é o esperado.
- **História da Mecânica** (`1-introducao.tex:14`).

**Resumo:** os itens 1 a 5 já estão conferidos com os PDFs que você tem e são os que mais protegem o texto.
