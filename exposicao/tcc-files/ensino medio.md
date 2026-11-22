# Ensino médio no TCC: onde aparece e proposta de avaliação sem menores

Levantamento feito em 19/11/2026 em `tcc2_museu/`. As linhas são as desses arquivos.

**Legenda da coluna "Sugestão":**
- **TROCAR:** a frase prende o trabalho ao ensino médio e conflita com a avaliação sem menores;
- **AJUSTAR:** basta ampliar para "Mecânica básica (ensino médio e ciclo básico)";
- **MANTER:** está correta como está (ex.: descreve outro trabalho).

Por enquanto, nada foi alterado no texto.

---

## Parte 1: menções ao ensino médio

### Título (`documento.tex`)

| Linha | Trecho | Sugestão |
|---|---|---|
| 179 | "...ferramenta para o aprendizado de mecânica clássica **do ensino médio**" | **TROCAR.** Ver sugestões de título na Parte 2 |

### Resumo e abstract (`1-pre-textuais/`)

| Arquivo | Trecho | Sugestão |
|---|---|---|
| `resumo.tex:1` | "O estudo de ciências **no ensino médio**..." | **TROCAR.** Este resumo ainda é o do CLARA.js; vai ser reescrito de qualquer forma |
| `abstract.tex:1` | "Studying science **in high school**..." | **TROCAR.** Mesmo caso |

### Introdução (`2-textuais/1-introducao.tex`)

| Linha | Trecho | Sugestão |
|---|---|---|
| 14 | "...fazem parte do que se espera que o **estudante do ensino médio** compreenda" | **AJUSTAR:** "...do que se espera que o estudante compreenda, **no ensino médio e nas disciplinas introdutórias de Física do ensino superior**" |
| 16–17 | §2 inteiro: **BNCC** e **ENEM** como justificativa | **AJUSTAR.** Pode manter a BNCC como *uma* razão (o conteúdo é da educação básica) e acrescentar uma frase dizendo que os mesmos tópicos abrem a Física I dos cursos de exatas \cite{halliday2016v1} |
| 20 | "Porém na **prática escolar** esses conteúdos..." | **AJUSTAR:** "Porém, **no ensino de Física**, esses conteúdos..." (o problema da lista resolvida no papel existe nos dois níveis) |
| 30 | "...exposição virtual interativa tridimensional de Mecânica **para o ensino médio**" | **TROCAR:** "...de Mecânica **básica**" ou "...**de nível introdutório**" |
| 44 (QP1) | "exercícios de Mecânica **do ensino médio**" | **AJUSTAR:** "exercícios de Mecânica **básica**" |
| 45 (QP2) | "...e qual a diferença entre o desempenho deles em testes de conhecimento antes e depois do uso?" | **TROCAR** se não houver pré/pós: "Como estudantes de exatas e professores de Física avaliam a usabilidade da exposição, o retorno visual dos exercícios e sua adequação ao ensino?" |
| 49 | seu comentário "{ver depois} talvez por estudantes e professores" | É exatamente a proposta da Parte 2 |
| 56 (objetivo geral) | "...simulações de Mecânica **do ensino médio**..." | **AJUSTAR:** "...de Mecânica **básica**..." |
| 61 (objetivo específico) | "lista de exercícios de Mecânica **do ensino médio**" | **AJUSTAR:** "**de nível introdutório**", ou só "de Mecânica" |

### Fundamentação teórica (`2-textuais/2-fundamentacao-teorica.tex`)

| Linha | Trecho | Sugestão |
|---|---|---|
| 23 | "...fazerem parte do currículo de Física **do ensino médio**... $g = 10$, valor usual nos livros didáticos e **no ENEM**" | **AJUSTAR:** "...do currículo de Física **da educação básica e das disciplinas introdutórias do ensino superior**". O $g = 10$ pode ficar ("valor usual em livros didáticos") |

O Halliday **continua**: é o livro do ciclo básico, e passa a combinar ainda mais com o novo público.

### Trabalhos relacionados (`2-textuais/3-trabalhos-relacionados.tex`)

| Linha | Trecho | Sugestão |
|---|---|---|
| 31 | ECOS "voltado à divulgação... enquanto este trabalho é direcionado ao ensino de Física **no ensino médio**" | **AJUSTAR:** "...direcionado ao ensino de **Mecânica básica**" |
| 63 | LabSEF "...ensino de Física **no ensino médio**" | **MANTER** (descreve o trabalho do Falcão) |
| 67 | "Assim como este trabalho, aborda conteúdos de Mecânica **do ensino médio**..." | **AJUSTAR:** "...aborda conteúdos de Mecânica **básica**..." |
| 138 | ARTOM "...no início do ensino médio" | **MANTER** (descreve o trabalho do Pereira) |
| 157 | "...quanto ao **foco no ensino médio**..." | **TROCAR:** "...quanto ao **foco no ensino de Física**..." |
| 166 | coluna do quadro "**Ensino médio**" | **TROCAR** a coluna para "**Ensino de Física**" e refazer as marcações. Sugestão: Falcão, Dancy, Jalk Duque e PhET = Sim; ECOS e Pina = Não; ARTOM = Não (é Química) |
| 190 | "laboratórios tridimensionais de Física **para o ensino médio** \cite{falcao2010}" | **MANTER** (descreve o Falcão) |

### Softwares relacionados (`2-textuais/4-softwares-realcionados.tex`)

| Linha | Trecho | Sugestão |
|---|---|---|
| 10, 92, 114 | níveis de ensino / "educação básica" (descrevem PhET, Labster e Merge) | **MANTER** |

### Metodologia (`2-textuais/5-metodologia.tex`)

| Linha | Trecho | Sugestão |
|---|---|---|
| 42 | critérios: "currículo de Física **do ensino médio** \cite{bncc2018}; ser recorrente **em questões do ENEM**..." | **AJUSTAR:** "pertencer aos conteúdos introdutórios de Mecânica, presentes na educação básica \cite{bncc2018} e nas disciplinas iniciais de Física do ensino superior \cite{halliday2016v1}; ..." O ENEM pode sair ou virar "recorrente em exames e livros didáticos" |
| 77 | seu comentário sobre basear as questões em ENEM, vestibulares ou livros | Livros do ciclo básico (Halliday) também servem e combinam com o novo público |
| seção de avaliação (perto da 150) | público e instrumentos | **TROCAR** pelo desenho da Parte 2 |

### Resultados (`2-textuais/6-Resultados.tex`)

| Linha | Trecho | Sugestão |
|---|---|---|
| 152–185 | perfil dos participantes e **tabela pré/pós** | **AJUSTAR** conforme a Parte 2: perfil dividido em estudantes e professores; sai a tabela pré/pós, se não houver pré/pós |

### Conclusão (`2-textuais/7-Conclusao.tex`)

| Linha | Trecho | Sugestão |
|---|---|---|
| 12 | "...exposição... de Mecânica **para o ensino médio**" | **AJUSTAR:** "...de Mecânica **básica**" |
| 28 | trabalho futuro "Questões do ENEM em três dimensões" | **MANTER.** Combina com um trabalho futuro novo: "avaliar com estudantes do ensino médio, após aprovação no CEP" |

### Fora do TCC (para lembrar)

- `proposta/pesquisa.md`:
  - a pergunta de idade tem "até 14 … 17", e a Parte 0 fala em TALE;
  - a situação tem "1º, 2º, 3º ano EM".
  
  Tudo isso muda com a Parte 2.
- `09-Apendices.txt` (apêndices B e C): o pré e o pós-teste saem se não houver pré/pós.

---

## Parte 2: proposta de avaliação sem alunos menores de idade

### Ideia em uma frase

Tratar o trabalho como **prova de conceito para o ensino de Mecânica básica**, conteúdo comum ao ensino médio e ao ciclo básico das exatas, e avaliá-lo com **dois grupos maiores de 18 anos**: **estudantes** (que usam a exposição como aprendizes) e **professores de Física** (que julgam se a abordagem serve para ensinar).

### Por que essa proposta se sustenta

1. **O conteúdo das salas é o mesmo** da Física I do ciclo básico: pêndulo, lançamento, Kepler e ondas estão no Halliday, vol. 1 e 2. Isso não é uma "adaptação" forçada.
2. **A banca já pediu prova de conceito**, e não "salvar a educação". Prova de conceito avalia se a ideia funciona e é usável, e não o efeito em sala de aula.
3. **A avaliação por especialistas é um método reconhecido** para validar material didático. Os professores trazem a visão pedagógica que adolescentes não trariam.
4. **Cabe no prazo**: dá para aplicar no próprio campus, com formulário anônimo, sem CEP (se o orientador concordar com o enquadramento na Res. CNS 510/2016, art. 1º, parágrafo único, inciso I).
5. **O ensino médio não some**: vira **público potencial** e **trabalho futuro**, dito com honestidade.

### Grupo A: estudantes (usuários aprendizes), de 10 a 20 pessoas

- **Quem:**
  - calouros e estudantes dos cursos de exatas da UFC Quixadá que cursam ou já cursaram Física;
  - **alunos do 3º ano do ensino médio com 18 anos ou mais**, se você quiser incluí-los. Entram aqui sem nenhum problema, desde que passem pelo filtro de idade.
- **O que fazem** (de 20 a 30 min):
  1. o roteiro de tarefas (Apêndice A), incluindo resolver os exercícios em duas salas: Pêndulo e Lançamento;
  2. a SUS (Apêndice D);
  3. um questionário Likert curto de percepção:
     - "ver a cena com a minha resposta me ajudou a entender onde errei";
     - "a exposição ajudaria alguém que está aprendendo esse conteúdo";
  4. duas ou três perguntas abertas.
- **Dado objetivo (opcional):** quantas tentativas cada pessoa levou para acertar cada exercício, registrado de forma anônima pelo próprio sistema.

### Grupo B: professores de Física (avaliação de especialistas), de 3 a 5 pessoas

- **Quem:** professores de Física de escolas da região e/ou professores de Física da UFC.
- **O que fazem** (de 20 a 30 min):
  1. exploram livremente a exposição e resolvem um exercício;
  2. respondem um questionário Likert de adequação:
     - "a física das simulações está correta";
     - "os textos de teoria são adequados ao nível do conteúdo";
     - "eu usaria a exposição em aula";
     - "o retorno visual ajuda o aluno a perceber o erro";
  3. perguntas abertas: "o que mudaria?", "em que momento da aula usaria?".
- **Por que vale:** é o grupo que mais pesa na banca, porque responde "isso serve para ensinar?".

### Ética

- **Formulário anônimo** (Google Forms), sem nome, e-mail ou outro dado identificável.
- **1ª seção com o termo de consentimento** e a opção "Li e concordo". Quem não marca não continua.
- **Pergunta de filtro:** "Tenho 18 anos ou mais". Quem marcar "não" é encerrado.
- **Guarde a planilha de respostas** como comprovante.
- **Confirme com o orientador** o enquadramento na Res. CNS 510/2016 ou se é preciso o CEP.

### Como fica no texto

- **QP2:** "Como estudantes de cursos de exatas e professores de Física avaliam a usabilidade da exposição, o retorno visual dos exercícios e sua adequação ao ensino de Mecânica?"
- **Limitação** (Resultados/Discussão): "A avaliação não incluiu estudantes do ensino médio menores de idade, um dos públicos potenciais da exposição, e foi realizada com amostra reduzida e de conveniência. Os resultados indicam a viabilidade da proposta, mas não medem seu efeito na aprendizagem."
- **Trabalho futuro novo** (Conclusão): "avaliar a exposição com estudantes do ensino médio em sala de aula, com aprovação no Comitê de Ética, termo de assentimento e grupo de controle."

### Sugestões de título

1. *Exposição virtual interativa para o ensino de Mecânica básica: uma prova de conceito em que a resposta do estudante se torna o fenômeno*
2. *Criação de uma exposição virtual interativa com exercícios de Mecânica cuja resposta é representada no fenômeno simulado*
3. *Exposição virtual interativa de Mecânica com exercícios de retorno visual: uma prova de conceito*

### O que levar ao orientador (decisões, não perguntas)

> "Vou avaliar com maiores de 18 anos, em dois grupos: estudantes de exatas (e terceiranistas que tenham 18) e professores de Física. O trabalho vai ser tratado como prova de conceito para Mecânica básica, e o ensino médio vira público potencial e trabalho futuro. A avaliação vai ser anônima, pelo Forms, com SUS, questionário de percepção e perguntas abertas. Se houver algum impedimento, me avisa."
