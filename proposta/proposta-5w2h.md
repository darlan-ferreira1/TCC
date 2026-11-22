# Nova proposta de TCC: resumo em 5W2H

**Aluno:** Darlan Ferreira · **Orientador:** Prof. Dr. Rubens Fernandes Nunes
**Curso:** Ciência da Computação, UFC Quixadá · **Versão:** 19/11/2026

**Título provisório:** Exposição virtual baseada em Web 3D com exercícios interativos de Física focados na Mecânica clássica

---

## 1. Contexto

Listas de exercícios são o principal instrumento usado no aprendizado de Física. Nelas, quem estuda resolve o problema no papel e só confere o resultado no gabarito, sem ver o fenômeno acontecer.

Simuladores como PhET, Labster e ChemCollective mostram o fenômeno, mas em geral não estão ligados aos exercícios que a pessoa precisa resolver. A simulação e o exercício ficam separados.

## 2. Problema e justificativa

- **Exercício e fenômeno separados:** a pessoa calcula o período de um pêndulo, mas não vê se o pêndulo de fato oscila com aquele período.
- **Conferência sem explicação:** o gabarito diz se a resposta está certa, mas não mostra por que está errada.
- **A resposta vira o fenômeno:** em vez de só calcular, a pessoa vê o resultado acontecer, porque a resposta digitada controla a simulação. Se estiver errada, a cena fica visivelmente errada: o pêndulo sai de sincronia com o correto, a bola não cai no alvo. O erro é mostrado, não apenas apontado.
- **Ambiente favorável à exploração:** uma exposição virtual organiza o conteúdo em salas temáticas e convida a explorar. Isso já foi usado em divulgação científica (ex.: Brito, 2026, com artefatos espaciais), mas não para resolver exercícios.
- **Acesso:** uma solução gratuita e no navegador dispensa laboratório e instalação.

## 3. Questão de pesquisa

**Principal:** Uma exposição virtual 3D em que cada sala propõe exercícios de Mecânica, cuja resposta é usada para montar o fenômeno na simulação, é considerada útil e fácil de usar pelo público interessado em Física?

**Secundária, sobre o uso de IA, sugerida pelo orientador:** Como a IA generativa pode apoiar a construção desse tipo de ambiente, ao transformar uma lista resolvida à mão em salas e exercícios interativos? Quais são os limites dessa ajuda?

## 4. Objetivos

**Geral:** desenvolver e avaliar, como prova de conceito, uma exposição virtual 3D com exercícios interativos de Física focados na Mecânica clássica.

**Específicos:**
1. Selecionar e resolver à mão uma lista de cerca de 12 exercícios de Mecânica de nível introdutório.
2. Transformar cada exercício em uma atividade em uma sala da exposição. A resposta do usuário é aplicada à simulação: se estiver certa, o fenômeno acontece como previsto; se estiver errada, o erro aparece na cena.
3. Registrar como a IA generativa foi usada em cada etapa: o que ela gerou, o que precisou ser corrigido e quanto tempo isso levou.
4. Avaliar a usabilidade e a utilidade percebida da exposição com o público interessado em Física, maior de 18 anos.

## 5. 5W2H

| | Pergunta | Resposta |
|---|---|---|
| **What** | O quê? | Uma exposição virtual 3D no navegador. Cada sala tem uma simulação e exercícios de Mecânica de nível introdutório, que o usuário resolve e confere vendo a resposta acontecer na cena. |
| **Why** | Por quê? | Para ligar o exercício de papel ao fenômeno e dar uma conferência que mostra o porquê do erro, num ambiente gratuito e que convida à exploração. |
| **Who** | Quem? | **Público:** pessoas interessadas em Física e entusiastas que estão aprendendo ou revisando os fundamentos de Mecânica. **Avaliação:** de 10 a 20 voluntários maiores de 18 anos desse público. **Desenvolvimento:** o autor, com apoio de IA generativa, sob orientação do Prof. Rubens. |
| **Where** | Onde? | No navegador (computador e celular), publicado no GitHub Pages. A avaliação é feita a distância, com roteiro de tarefas e Google Forms. |
| **When** | Quando? | De 16/11 a 11/12/2026 (ver cronograma). |
| **How** | Como? | Lista resolvida à mão → exercícios dentro das salas da exposição (React, Three.js) → testes → avaliação com roteiro de tarefas e questionário em escala Likert. |
| **How much** | Quanto custa? | Nada: software livre e hospedagem gratuita. Também se mede o esforço, como horas e linhas de código por sala, com e sem a ajuda da IA. |

## 6. Fundamentação teórica (tópicos)

- **Resolução de problemas e feedback imediato no ensino de Física:** por que a conferência na hora ajuda.
- **Simulações computacionais no aprendizado:** o modelo científico simplificado e seus limites (ex.: a fórmula do pêndulo só vale para ângulos pequenos).
- **Ambientes virtuais 3D como espaço de aprendizagem:** salas temáticas e exploração livre.
- **Conteúdo:** Mecânica (pêndulo, lançamento, Kepler, ondas), com as simplificações usuais de nível introdutório (g = 10 m/s², ângulos pequenos, sem resistência do ar).
- **Tecnologias Web 3D:** WebGL e Three.js.
- **IA generativa no desenvolvimento de software:** assistentes de código, ganhos e riscos.
- **Avaliação de usabilidade:** escala Likert e SUS.

## 7. Trabalhos relacionados (mantidos da versão anterior)

| Trabalho | O que faz | Diferença desta proposta |
|---|---|---|
| **Labster** | Laboratórios virtuais 3D com perguntas dentro da simulação | É o mais parecido, mas é pago, em inglês e voltado a instituições. Não é uma exposição navegável e não usa a resposta para montar o fenômeno. |
| **PhET** (Univ. do Colorado) | Simulações 2D gratuitas | Não tem exercícios ligados à simulação nem ambiente 3D navegável. |
| **ChemCollective** | Laboratório virtual de química com problemas propostos | É 2D, em inglês e só de Química. |
| **ECOS** (Brito, 2026, UFC Quixadá) | Exposição virtual Web 3D de artefatos espaciais | É divulgação científica, sem exercícios. |

## 8. Metodologia

1. **Lista de exercícios:** selecionar cerca de 12 exercícios de conceitos introdutórios de Mecânica, a partir de livros didáticos e de questões de vestibulares e de disciplinas introdutórias, e resolvê-los à mão.
2. **Projeto das atividades:** definir, para cada exercício, o que o usuário faz na sala (ajustar, medir, responder) e como o sistema confere a resposta, com tolerância e dica.
3. **Desenvolvimento:** criar o sistema de exercícios e as atividades de cada sala. Cada uso da IA generativa vai para um diário: pedido, resultado, correções e tempo.
4. **Testes:** testes automatizados (Playwright) e conferência de cada resposta da simulação contra o gabarito feito à mão.
5. **Avaliação com usuários:**
   - **Participantes** (de 10 a 20): voluntários do **público interessado em Física**, todos maiores de 18 anos, como egressos recentes do ensino médio, terceiranistas com 18 anos ou mais, calouros, estudantes de exatas e professores.
   - **Roteiro de tarefas:** explorar a exposição e resolver os exercícios de duas salas (Pêndulo e Lançamento), vendo a cena montada com a resposta.
   - **Questionário em escala Likert:**
     - usabilidade (os 10 itens da SUS);
     - utilidade percebida do retorno visual (ex.: "ver a cena com a minha resposta me ajudou a entender onde errei");
     - perfil (faixa de idade, escolaridade, dispositivo) e duas ou três perguntas abertas.
   - **Dado objetivo:** número de tentativas até acertar cada exercício, registrado de forma anônima pelo sistema.
   - **Ética:** formulário on-line anônimo (Google Forms), sem nome, e-mail ou dados identificáveis.
     - A 1ª seção traz o termo de consentimento, e só prossegue quem marcar "Li e concordo".
     - Uma pergunta de filtro encerra o formulário para menores de 18 anos.
     - Enquadramento proposto: Res. CNS 510/2016, art. 1º, parágrafo único, inciso I (pesquisa de opinião com participantes não identificados), a confirmar com o orientador.
   - **Limitação assumida:** a avaliação mede usabilidade e percepção, não ganho de aprendizagem.
6. **Análise:** estatística descritiva das respostas (pontuação SUS comparada à média de referência de 68 e distribuição das respostas Likert), agrupamento dos comentários abertos por tema e discussão do diário de uso da IA.

## 9. Cronograma até 11/12/2026

| Período | Atividade |
|---|---|
| 16 a 18/11 | Escolha do tema, lista resolvida à mão e protótipo de uma sala com exercícios |
| 19 a 29/11 | Desenvolvimento das demais salas e do sistema de exercícios, e reescrita da Introdução, Fundamentação e Trabalhos Relacionados |
| 30/11 a 04/12 | Aplicação do roteiro e do questionário com o público |
| 05 a 11/12 | Resultados, Conclusão e revisão final |

## 10. Escopo

**Dentro:**
- Exposição virtual
- Salas de Mecânica
- Sistema de exercícios
- Avaliação com usuários maiores de 18 anos
- Relato do uso da IA

**Fora (trabalhos futuros):**
- Pré-teste e pós-teste para medir aprendizagem
- Avaliação com estudantes menores de idade, com aprovação no CEP
- Questões do ENEM recriadas em 3D
