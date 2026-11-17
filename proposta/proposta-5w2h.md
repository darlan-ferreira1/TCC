# Nova proposta de TCC: resumo em 5W2H

**Aluno:** Darlan Ferreira · **Orientador:** Prof. Dr. Rubens Fernandes Nunes
**Curso:** Ciência da Computação, UFC Quixadá · **Versão:** 15/11/2026

**Título provisório:** Museu virtual 3D com exercícios interativos de [Mecânica | Modelos Atômicos] para o ensino médio
*(o tema será escolhido entre as duas listas em `listas-de-exercicios.md`)*

---

## 1. Contexto

Listas de exercícios são o principal instrumento de estudo de Física e Química no ensino médio. Nelas, o aluno resolve o problema no papel e só confere o resultado no gabarito, sem ver o fenômeno acontecer.

Simuladores como PhET, Labster e ChemCollective mostram o fenômeno, mas em geral não estão ligados à lista que o aluno precisa resolver. Além disso, eles são telas soltas, não um ambiente que se explora.

O CLARA.js, desenvolvido nas etapas anteriores deste trabalho, já tem:
- um Museu Virtual 3D navegável no navegador (computador e celular), com uma sala por experimento;
- as simulações de pêndulo, lançamento de projétil, ondas, sistema solar, modelo de Bohr e geometria molecular.

## 2. Problema e justificativa

- **Exercício e fenômeno separados:** o aluno calcula o período de um pêndulo, mas não vê se o pêndulo de fato oscila com aquele período.
- **Conferência sem explicação:** o gabarito diz se a resposta está certa, mas não mostra por que está errada.
- **A resposta do aluno vira o fenômeno:** em vez de só calcular, o aluno vê o resultado acontecer. A resposta digitada controla a simulação. Se estiver errada, a cena fica visivelmente errada (o pêndulo do aluno sai de sincronia com o real, a bola não cai no alvo). O erro é mostrado, não apenas apontado.
- **Questões do ENEM:** algumas questões de provas anteriores do ENEM que dependem de uma figura conceitual serão recriadas em 3D. Isso aproxima o ambiente do que o aluno vai enfrentar no vestibular.
- **Ambiente favorável à exploração:** um museu virtual organiza o conteúdo em salas temáticas e convida a explorar. Isso já foi usado em divulgação científica (ex.: Brito, 2026, com artefatos espaciais), mas não para resolver exercícios.
- **Acesso:** uma solução gratuita e no navegador dispensa laboratório e instalação.

## 3. Questão de pesquisa

**Principal:** Um museu virtual 3D em que cada sala propõe exercícios de uma lista do ensino médio, cujas respostas o aluno obtém ou confere interagindo com a simulação, é considerado útil e fácil de usar por alunos e professores do ensino médio?

**Secundária, sobre o uso de IA, sugerida pelo orientador:** Como a IA generativa pode apoiar a construção desse tipo de ambiente, ao transformar uma lista resolvida à mão em salas e exercícios interativos? Quais são os limites dessa ajuda?

## 4. Objetivos

**Geral:** desenvolver e avaliar um museu virtual 3D com exercícios interativos baseados em uma lista de ensino médio resolvida pelo autor.

**Específicos:**
1. Elaborar e resolver à mão uma lista de cerca de 12 exercícios do tema escolhido.
2. Transformar cada exercício em uma atividade em uma sala do museu. A resposta do aluno é aplicada à simulação: se estiver certa, o fenômeno acontece como previsto; se estiver errada, o erro aparece na cena.
3. Recriar em 3D, como desafio final do museu, de 2 a 4 questões do ENEM do tema escolhido que tenham figura conceitual.
4. Registrar como a IA generativa foi usada em cada etapa: o que ela gerou, o que precisou ser corrigido e quanto tempo isso levou.
5. Avaliar o ambiente com alunos e professores do ensino médio.

## 5. 5W2H

| | Pergunta | Resposta |
|---|---|---|
| **What** | O quê? | Um museu virtual 3D no navegador. Cada sala tem uma simulação e os exercícios de uma lista do ensino médio, que o aluno resolve e confere interagindo com a simulação. |
| **Why** | Por quê? | Para ligar o exercício de papel ao fenômeno e dar ao aluno uma conferência que mostra o porquê do erro, num ambiente gratuito e que convida à exploração. |
| **Who** | Quem? | **Público:** alunos do ensino médio. **Avaliação:** cerca de 5 alunos e 5 professores voluntários. **Desenvolvimento:** o autor, com apoio de IA generativa, sob orientação do Prof. Rubens. |
| **Where** | Onde? | No navegador (computador e celular), publicado no GitHub Pages. A avaliação é feita a distância, com roteiro de tarefas e Google Forms. |
| **When** | Quando? | De 16/11 a 11/12/2026 (ver cronograma). |
| **How** | Como? | Lista resolvida à mão → exercícios dentro das salas do museu (React, Three.js) → testes → avaliação com roteiro de tarefas e questionário em escala Likert. |
| **How much** | Quanto custa? | Nada: software livre e hospedagem gratuita. Também se mede o esforço, como horas e linhas de código por sala, com e sem a ajuda da IA. |

## 6. Fundamentação teórica (tópicos)

- **Resolução de problemas e feedback imediato no ensino de Física e Química:** por que a conferência na hora ajuda.
- **Simulações computacionais no ensino:** o modelo científico simplificado e seus limites (ex.: a fórmula do pêndulo só vale para ângulos pequenos).
- **Museus e ambientes virtuais 3D como espaço de aprendizagem:** salas temáticas e exploração livre.
- **Conteúdo do tema escolhido:** Mecânica (pêndulo, lançamento, Kepler, ondas) ou Modelos Atômicos (de Dalton a Bohr, VSEPR).
- **Tecnologias Web 3D:** WebGL e Three.js.
- **IA generativa no desenvolvimento de software:** assistentes de código, ganhos e riscos.
- **Avaliação de usabilidade:** escala Likert e, se couber, SUS.

## 7. Trabalhos relacionados (mantidos da versão anterior)

| Trabalho | O que faz | Diferença desta proposta |
|---|---|---|
| **Labster** | Laboratórios virtuais 3D com perguntas dentro da simulação | É o mais parecido, mas é pago, em inglês e voltado ao ensino superior. Não tem museu nem lista em português. |
| **PhET** (Univ. do Colorado) | Simulações 2D gratuitas | Não tem exercícios ligados à simulação nem ambiente 3D navegável. |
| **ChemCollective** | Laboratório virtual de química com problemas propostos | É 2D, em inglês e só de Química. |
| **ECOS** (Brito, 2026, UFC Quixadá) | Exposição virtual Web 3D de artefatos espaciais | É divulgação científica, sem exercícios. |

## 8. Metodologia

1. **Lista de exercícios:** escolher o tema e elaborar e resolver à mão cerca de 12 exercícios.
2. **Projeto das atividades:** definir, para cada exercício, o que o aluno faz na sala (ajustar, medir, responder) e como o sistema confere a resposta, com tolerância e dica.
3. **Desenvolvimento:** criar o sistema de exercícios e as salas, reaproveitando o Museu Virtual e as simulações do CLARA.js. Cada uso da IA generativa vai para um diário: pedido, resultado, correções e tempo.
4. **Testes:** testes automatizados (Playwright) e conferência de cada resposta da simulação contra o gabarito feito à mão.
5. **Avaliação com usuários:**
   - **Alunos:** seguem um roteiro de tarefas (resolver 3 exercícios no papel, conferir na sala e explorar o museu) e respondem a um questionário Likert sobre facilidade, utilidade e compreensão.
   - **Professores:** avaliam se os exercícios e as salas são adequados para usar em aula.
   - **Ética:** participação voluntária e anônima, com TCLE. Para os menores, autorização do responsável e assentimento do aluno. A necessidade de submissão ao CEP será confirmada com o orientador.
6. **Análise:** estatística descritiva das respostas e dos comentários abertos, e discussão do diário de uso da IA.

## 9. Cronograma até 11/12/2026

| Período | Atividade |
|---|---|
| 16 a 18/11 | Escolha do tema, lista resolvida à mão e protótipo de uma sala com exercícios |
| 19 a 29/11 | Desenvolvimento das demais salas e do sistema de exercícios, e reescrita da Introdução, Fundamentação e Trabalhos Relacionados |
| 30/11 a 04/12 | Aplicação do roteiro e do questionário com alunos e professores |
| 05 a 11/12 | Resultados, Conclusão e revisão final |

## 10. Escopo

**Dentro:**
- Museu Virtual
- Salas do tema escolhido
- Sistema de exercícios
- Avaliação com usuários
- Relato do uso da IA

**Fora:** a interação pela webcam (MediaPipe), a realidade aumentada e a realidade virtual. Elas continuam no site, mas não fazem parte deste trabalho e podem ser citadas como trabalhos futuros.
