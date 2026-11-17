# CLAUDE.md: TCC (Exposição Virtual Interativa de Mecânica)

Contexto geral do repositório. Detalhes técnicos do código estão em `exposicao/CLAUDE.md`.

- **Aluno:** Darlan Ferreira · **Orientador:** Prof. Rubens Fernandes Nunes
- **Curso:** Ciência da Computação, UFC Quixadá · **Fim do semestre:** 11/12/2026

## O que tem aqui

| Pasta | Conteúdo |
|---|---|
| `exposicao/` | O software: exposição 3D no navegador (React + Vite + Three.js) |
| `exposicao/tcc-files/` | Rascunho da monografia em LaTeX para o Overleaf (um arquivo por capítulo) |
| `proposta/` | Proposta, lista de exercícios, trabalhos relacionados, uso de IA, roteiro e questionário da pesquisa |

Os arquivos do projeto antigo (CLARA.js, app Android, Tauri, TCC antigo) foram guardados fora deste repositório, numa pasta de backup no PC do usuário.

## Como era o trabalho antigo

O TCC começou como o **CLARA.js**: uma biblioteca e galeria de simulações 3D educacionais (Física, Química e Biologia) para o navegador.

- **Contribuição defendida:** a **arquitetura** de reuso. Cada simulação era um módulo "montável" que podia ser hospedado em páginas diferentes.
- **Extras:** controle por gestos com MediaPipe, realidade aumentada e virtual (WebXR), app nativo com Tauri (Windows/Linux) e app Android (TWA).
- **Museu Virtual:** no fim, ganhou um "Museu Virtual" 3D navegável, com uma sala por simulação.

## Por que mudou

- **Arquitetura não é a contribuição (orientador, 12/11/2026):** o orientador rejeitou a ideia de que a arquitetura do CLARA.js seria a contribuição.
- **Problema de "falta de acesso" já resolvido (banca):** a banca disse que esse problema já tem resposta (PhET, Labster, ChemCollective e outros). Pediu para tirar o tom de "salvar a educação" e apresentar o trabalho como **prova de conceito**.
- **Recursos retirados do escopo:** o orientador tirou MediaPipe, RA e RV.
- **Parte mais promissora:** o ambiente navegável virou o foco, no modelo do TCC do Gustavo Brito ("ECOS", 2026, mesmo orientador).
- **Tema:** escolhido em 17/11/2026, **Física (Mecânica) do ensino médio**.
- **Termo "museu":** **não usar**. Um membro da banca disse que o termo invade a área da Museologia. Usar **"exposição virtual interativa"** ou **"ambiente virtual interativo"** (a escolha final será feita com o orientador).
- **Separação do código:** em 17/11/2026, a exposição saiu do CLARA.js (a partir do commit `3d636c4`) e virou o projeto `exposicao/`. O CLARA.js volta a ser desenvolvido depois da formatura.

## O conceito atual

Uma exposição 3D no navegador, com salas de Mecânica:
- pêndulo;
- lançamento oblíquo;
- Kepler;
- ondas;
- pêndulo cônico;
- pêndulo de Foucault.

O aluno anda em primeira pessoa pelas salas.

**Ideia central:** os exercícios vêm de uma lista resolvida à mão (`proposta/listas-de-exercicios.md`), e **a resposta do aluno vira o fenômeno na cena**. Se a conta estiver errada, a cena mostra o resultado errado: a bola não cai no alvo, ou o pêndulo do aluno sai de sincronia com o correto. O erro é mostrado, não só apontado.

- **Contribuição:** nos trabalhos relacionados (Physlets, Jalk Duque et al. 2026, Falcão & Machado 2010 e outros), a simulação fornece os dados ou apenas valida a resposta. Aqui, **a resposta do aluno é a entrada da simulação**, dentro de um ambiente 3D navegável.
- **Depois:** questões do ENEM com figura conceitual recriadas em 3D.
- **Avaliação:** com usuários, usando pré e pós-teste, SUS e Likert (`proposta/roteiro_pesquisa.md` e `proposta/pesquisa.md`).
- **Uso de IA:** o desenvolvimento é feito com o Claude Code, e isso é declarado no TCC (`proposta/ia_questao.md`). Os erros da IA são anotados, porque viram resultado.

## Regras do usuário

- **Git:** nunca fazer commit, push nem PR sem pedido explícito.
- **Respostas:** em pt-BR e curtas. Listas longas vão para arquivos.
- **Monografia:** o texto é do usuário. Não alterar conteúdo sem ele pedir e **não compilar LaTeX**.
- **Observações do usuário:** `DarlanObs:{...}` é uma observação dele. Leia, aja e apague a marca.
- **Dados:** nunca inventar dados de pesquisa nem testes que não existem. O que não foi medido fica como `\pendente`.
- **Privacidade:** não enviar dados pessoais do usuário a serviços externos.
