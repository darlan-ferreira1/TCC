# O uso de IA no TCC: como declarar e como transformar em parte do trabalho

> **Situação real:** o desenvolvimento está sendo feito com **prompts no Claude Code**, um assistente de programação com IA da Anthropic que roda no terminal, lê e edita arquivos e executa comandos.
> - O orientador **sabe** e **pediu** que a proposta mostre como a IA ajuda a gerar as coisas.
> - Portanto não é algo a esconder: é algo a **documentar com método**.

---

## 1. Por que declarar (e declarar bem)

- **Honestidade acadêmica.** Os textos e o código não foram escritos "na mão". Omitir isso seria apresentar como seu o que não é.
- **Prática atual das revistas.** Grandes editoras (Springer Nature, Elsevier, ACM, IEEE) adotam regras parecidas:
  1. IA **não pode ser autora**;
  2. o uso **deve ser declarado**;
  3. os autores são **responsáveis** por tudo o que foi publicado.

  Exemplo real: o artigo de Jalk Duque et al. (2026), um dos seus trabalhos parecidos, termina com um *AI statement* dizendo que a IA foi usada só para revisar o idioma e que os autores assumem a responsabilidade.
- **⚠ Pergunte ao orientador** se a UFC ou o curso já têm alguma norma ou modelo de declaração. Eu não sei se existe.
- **Vira contribuição.** O orientador quer ver "como a IA ajuda a gerar coisas". Se você **medir e relatar** o processo, o uso de IA deixa de ser um ponto fraco e passa a ser um **resultado** do TCC.

---

## 2. Onde a IA entra em cada capítulo

### Introdução
Inclua uma **questão secundária**, que já está na proposta 5W2H. Sugestão:
> *"De que forma um assistente de programação baseado em IA generativa apoia o desenvolvimento de um ambiente virtual interativo educacional por um único desenvolvedor, e quais verificações humanas são necessárias para garantir a correção do conteúdo?"*

Um objetivo específico extra:
> *"Relatar o processo de desenvolvimento assistido por IA generativa, descrevendo as tarefas delegadas, as verificações realizadas e os erros encontrados."*

### Fundamentação teórica (uma subseção curta, cerca de 1 página)
**"IA generativa e assistentes de programação"**:
- **Modelos de linguagem de grande escala (LLMs):** são treinados em muito texto e código e geram texto prevendo a próxima palavra. A arquitetura *Transformer* vem de Vaswani et al. (2017).
- **Geração de código por LLM:** Chen et al. (2021) apresentaram o Codex e o *benchmark* HumanEval.
- **Assistentes "agentes" (o caso do Claude Code):** além de sugerir código, eles **leem o projeto, editam arquivos, executam comandos** (build, testes) e verificam o resultado em ciclos.
  - É diferente do autocompletar do GitHub Copilot.
- **Evidência de produtividade:** Peng et al. (2023), num experimento controlado, mostram que desenvolvedores com o GitHub Copilot terminaram uma tarefa **55,8% mais rápido**.
- **Riscos conhecidos:**
  - **"alucinação"**, isto é, afirmações falsas ditas com confiança;
  - código que compila mas está conceitualmente errado;
  - dependência do usuário.

> Referências sugeridas (**conferir antes de usar**):
> - Vaswani et al., *Attention Is All You Need*, NeurIPS 2017.
> - Chen et al., *Evaluating Large Language Models Trained on Code*, arXiv:2107.03374, 2021.
> - Peng et al., *The Impact of AI on Developer Productivity: Evidence from GitHub Copilot*, arXiv:2302.06590, 2023.
> - A documentação oficial do Claude Code (Anthropic), citada como site.

### Metodologia (a parte principal)
Crie uma subseção **"Processo de desenvolvimento assistido por IA"** que responda:

| Pergunta | O que escrever |
|---|---|
| **Qual ferramenta?** | Claude Code (Anthropic), versão e modelo usados (ex.: Claude Opus), período (out–dez/2026) |
| **Como era o ciclo?** | Você descreve a tarefa em português → a IA propõe, edita o código e roda build/testes → **você testa no navegador e no celular** → aponta os problemas → a IA corrige. Repete |
| **O que a IA fez** | O código das salas e simulações, o ambiente 3D, os textos dos quadros e do "i", rascunhos das listas e da proposta, a busca e os resumos de trabalhos relacionados, os testes automatizados |
| **O que VOCÊ fez** | A escolha do tema e do escopo, **a resolução manual da lista**, as decisões de design (ex.: tudo dentro do ambiente, sem abrir páginas; movimento em 1ª pessoa), a validação visual, a correção dos erros da IA, a aplicação da pesquisa com pessoas, a análise e a **redação final** |
| **Como garantiu que estava certo?** | Ver o quadro "Verificações" abaixo |

**Quadro de verificações (as 5 camadas):**
1. **Física:** cada exercício foi resolvido à mão. A simulação precisa dar o mesmo valor que o gabarito (ex.: pêndulo de L = 2,5 m → T ≈ 3,14 s).
2. **Texto dos painéis:** você revisa cada texto de `conteudo.ts` contra um livro do EM.
3. **Código:** compilação TypeScript (`tsc`), lint (`eslint`) e build sem erros.
4. **Testes automatizados:** testes de ponta a ponta com Playwright (44 testes passando). Inclusive passeios automáticos com um controle de videogame simulado, que tiram prints de cada sala.
5. **Teste humano:** você mesmo no PC e no celular, e depois os participantes da pesquisa.

### Resultados (uma subseção de relato, com números **medidos**)
**"Relato do desenvolvimento assistido por IA"**. Itens sugeridos:
- **quantidade:** número de sessões e de prompts, período, arquivos e linhas criadas (dá para medir, ver a seção 4);
- **tempo:** quanto tempo cada sala levou, do pedido até ficar aprovada;
- **erros da IA encontrados pelas verificações.** É **a parte mais valiosa** e deve virar uma tabela. Exemplos reais deste projeto:

| Erro cometido pela IA | Como foi detectado | Camada |
|---|---|---|
| Rastro do pêndulo de Foucault desenhado com o sinal trocado (girava ao contrário) | Conferência visual com a teoria (sentido horário no hemisfério norte) | 1 (física) |
| Luz do Sol na sala de Kepler sem limite de alcance, deixando as paredes amarelas | Captura de tela do passeio automático | 4/5 |
| Gravidade ajustável no lançamento fazia o alcance passar da parede da sala | Teste manual, levou à decisão de fixar g = 10 | 5 |
| Painéis de texto vazando da moldura e cobrindo placas | Capturas de tela | 4/5 |
| Portas que abriam páginas fora do ambiente | **Seu** teste e o **seu** feedback | 5 |
| Resumo de artigo (PhET) feito de memória, sem acesso ao PDF | A própria IA avisou, e você precisa conferir | — (alucinação potencial) |

  ➡ **A partir de agora, anote todo erro novo** no diário (seção 4). Não invente exemplos: use só o que aconteceu.
- **Exemplo de prompt e resultado:** mostre um prompt real seu (ex.: *"crie mais duas portas… mantenha o estilo de movimentação"*), o que a IA gerou (um print) e o que você precisou corrigir.

### Discussão e conclusão
- **Benefícios:** um único aluno conseguiu construir um ambiente 3D com várias salas num semestre.
- **Limites:**
  - a IA errou física e layout, e só a verificação humana pegou;
  - você não domina todo o código gerado (seja honesto, isso é um risco de manutenção);
  - reprodutibilidade: o mesmo prompt pode gerar outra coisa, e os modelos mudam.
- **Lição central:** *"a IA acelerou a produção, mas a responsabilidade pela correção do conteúdo permaneceu humana, e a lista resolvida à mão funcionou como gabarito para validar o que foi gerado"*.
  - Esse é o casamento perfeito com a proposta: **a lista à mão não é enfeite, é o controle de qualidade da IA.**

### Declaração de uso de IA (nota no início ou no fim do TCC)
Modelo (adapte):
> *Declaração de uso de inteligência artificial: Este trabalho utilizou o assistente de programação Claude Code (Anthropic), baseado em modelos de linguagem de grande escala, no desenvolvimento do código-fonte da aplicação, na geração de rascunhos de textos explicativos exibidos no ambiente virtual e no apoio à busca e ao resumo de trabalhos relacionados. Todo o conteúdo gerado foi revisado pelo autor; os exercícios foram resolvidos manualmente e utilizados como referência para validar as simulações. A redação final, a análise dos dados e as conclusões são de responsabilidade do autor.*

> ⚠ Só escreva "a redação final é do autor" se for verdade, ou seja, se você reescrever os rascunhos com as suas palavras antes de colar no Overleaf.

---

## 3. O que NÃO fazer

- ❌ **Usar IA para gerar dados da pesquisa** (respostas de participantes, notas, gráficos de resultados). Isso é fraude, e a banca percebe (ver as inconsistências dos percentuais em Pina et al. e Jalk Duque et al.).
- ❌ **Colar texto da IA sem reescrever.** Isso tira a sua voz, e o texto fica genérico.
- ❌ **Citar uma referência que a IA indicou sem abrir o original.** A IA pode errar autor, ano, página e até inventar o artigo.
- ❌ **Dizer que a IA "garantiu" a correção.** Quem garante são as verificações.
- ❌ **Esconder o uso**, ou declarar só "revisão de idioma" quando a IA escreveu código e conteúdo.

---

## 4. Como coletar evidências (comece já)

1. **Os registros do Claude Code já existem.** Cada sessão fica salva em `C:\Users\Admin\.claude\projects\D--26-TCC\*.jsonl`. Dá para escrever um script que conte sessões, prompts, ferramentas usadas e período. **Peça quando quiser.**
2. **Git:** o histórico de commits mostra datas e tamanho das mudanças (`git log --stat`).
3. **Diário de prompts.** Mantenha uma tabela simples, preenchida ao fim de cada dia de trabalho:

| Data | Objetivo | Prompt (resumo) | O que a IA entregou | O que estava errado | Como verifiquei | Tempo |
|---|---|---|---|---|---|---|
| 16/11 | Salas novas | "crie mais duas portas no museu…" | 2 alas, 8 salas | Portas abriam páginas externas | Testei no PC | ~3 h |

4. **Prints antes e depois** de cada correção (você já tem os do passeio automático).

---

## 5. Resumo em uma frase para a reunião
> "A IA entra no TCC como **ferramenta declarada** e como **objeto de relato**. Na metodologia descrevo o ciclo prompt → código → verificação. Nos resultados mostro números e uma tabela dos erros que a IA cometeu e de como cada um foi detectado. A lista resolvida à mão é o gabarito que valida o que a IA produziu."
