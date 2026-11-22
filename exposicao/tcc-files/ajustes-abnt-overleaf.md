# Ajustes ABNT no Overleaf (modelo UFC 2019 → normas atuais)

Comparação feita em 18/11/2026 entre:
- **o modelo** (`tcc2_museu/`, versão 2019, e o PDF `tcc2_museu.pdf`);
- **os guias da UFC** em `normasFormatacaoUFC/`:
  - citações 2025 (NBR 10520:2023);
  - referências (NBR 6023:2018);
  - trabalhos acadêmicos 2022 (NBR 14724:2011).

O guia de trabalhos acadêmicos (2022) ainda cita a NBR 10520:2002. Para **citações**, vale o guia de 2025, que é mais novo.

Nada foi alterado no modelo. Tudo abaixo é para você fazer no Overleaf.

**Não precisa trocar de biblioteca.** O `abntex2cite` do modelo já tem as opções certas, só não estão ligadas. São quatro mudanças de configuração (seção 1) e o resto são ajustes no `.bib` e no texto.

---

## 1. Citações (o mais importante)

| # | No modelo 2019 | Agora (guia de citações 2025) | Como consertar |
|---|---|---|---|
| 1.1 | Autor entre parênteses em MAIÚSCULAS: **(BRITO, 2026)** | Maiúsculas/minúsculas: **(Brito, 2026)**. A NBR 10520:2023 aboliu a caixa alta na citação. | Opção `abnt-cite-style=AuthorYEAR` (ver bloco abaixo) |
| 1.2 | `abnt-etal-cite=2`: com **3 autores** já usa "et al." (ex.: "Dancy et al. (2002)") | **Até 3 autores, citam-se todos**: "Dancy, Christian e Belloni (2002)" e "(Dancy; Christian; Belloni, 2002)". "et al." só com **4 ou mais**. | Trocar para `abnt-etal-cite=3` |
| 1.3 | `apud` sem destaque, se escrito à mão | `apud` **em itálico** | Escreva `\textit{apud}` |
| 1.4 | Citação longa: depende de como você escreve | Mais de 3 linhas: recuo de 4 cm, fonte menor, espaço simples, sem aspas | Use o ambiente do abnTeX2: `\begin{citacao} ... \end{citacao}` |

**Em `lib/preambulo.tex`, linha 73**, troque:

```latex
\usepackage[alf, abnt-emphasize=bf, recuo=0cm, abnt-etal-cite=2, abnt-etal-list=0, abnt-etal-text=it]{abntex2cite}
```

por:

```latex
\usepackage[alf, abnt-emphasize=bf, recuo=0cm, abnt-etal-cite=3, abnt-etal-list=0, abnt-etal-text=it, abnt-cite-style=AuthorYEAR]{abntex2cite}
```

- ⚠ **Atualização de 18/11:** a opção `abnt-cite-style=AuthorYEAR` **não funciona** porque é um bug do pacote. O BibTeX não diferencia maiúsculas de minúsculas na chave e a descarta como "Repeated entry". A solução que funcionou foi esta:
  - tirar a opção da linha 73;
  - criar no `referencias.bib` a entrada `@ABNT-options{citacao-maiusc-minusc, abnt-cite-style = "(Author, YEAR)", key = "aaaa"}`;
  - pôr `\citeoption{citacao-maiusc-minusc}` logo depois de `\begin{document}`.
- (Texto original:) `abnt-cite-style=AuthorYEAR` é uma opção que já existe no arquivo de opções do abntex2cite (`abntex2-options.bib`). Ela muda só a citação no texto; a lista de REFERÊNCIAS continua com o SOBRENOME em maiúsculas, como a NBR 6023 exige.
- Depois de trocar, mande o Overleaf **recompilar do zero**. Para isso, use o menu *Logs and output files → Clear cached files*, porque o `.bbl` antigo fica guardado.
- **Confira no PDF:** o resultado esperado é "(Brito, 2026)" e "Wieman, Adams e Perkins (2008)".
- **"et al." em itálico:** os guias da UFC não exigem itálico no "et al." (só no *apud*). O `abnt-etal-text=it` pode ficar; só não misture com "et al." sem itálico escrito à mão.

---

## 2. Referências (lista no final)

| # | No modelo 2019 / no seu PDF hoje | Agora (guia de referências, NBR 6023:2018) | Como consertar |
|---|---|---|---|
| 2.1 | URL entre sinais de menor e maior: `Disponível em: <https://...>` | **Sem `< >`**: `Disponível em: https://... . Acesso em: 18 nov. 2026.` | No `lib/preambulo.tex`, **depois** da linha `\usepackage{lib/ufctex}`, acrescente: `\def\UrlLeft{}\def\UrlRight{}` |
| 2.2 | Sem local: `[S.l.]` | `[S. l.]` (com espaço). Para eventos da SBC, o local é Porto Alegre. | O `[S.l.]` está fixo no estilo do abnTeX2. Para evitá-lo, **preencha sempre o `address`** (ex.: `address = {Porto Alegre}`). Se não houver local mesmo, escreva `address = {[S. l.]}` |
| 2.3 | Trabalho em evento sai como "In: Anais do XVI Workshop..." ou "In: Proceedings of..." | Formato de evento: `In: NOME DO EVENTO, nº., ano, cidade. Anais [...]. Local: Editora, ano. p. x-y.` | Ver o modelo de entrada `@inproceedings` abaixo |
| 2.4 | TCC do Gustavo sai só como "Ecos: ... 2026." | TCC precisa de: ano, tipo e curso, travessão, instituição, cidade e ano | Ver o modelo `@thesis` abaixo |
| 2.5 | Título em minúsculas: "Phet", "physlets", "webgl", "3d", "museu emílio goeldi" | Nomes próprios e siglas mantêm a grafia original | No `.bib`, proteja com chaves: `{PhET}`, `{Physlets}`, `{WebGL}`, `{3D}`, `{Museu Emílio Goeldi}` |
| 2.6 | "FALCãO" (acento quebrado no sobrenome em maiúsculas) | FALCÃO | No `.bib`: `Falc{\~a}o` |
| 2.7 | Sobrenomes compostos quebrados: "DUQUE, F. A. J.", "FILHO, F. S." | **JALK DUQUE, F. A.**; **SILVA FILHO, F. G. S.** (Filho, Júnior e Neto fazem parte do sobrenome) | `author = {{Jalk Duque}, Fabián Andrés and {Valbuena Duarte}, Sonia and {Racedo Niebles}, Francisco Juan}` e `{Silva Filho}, Frederico Guilherme Santana da` |
| 2.8 | Lixo do Google Acadêmico ou da editora: `ISSN 0000-0000`, "American Association of Physics Teachers (AAPT)", "In: SBC." | Só os elementos da norma | Apague os campos `issn = {0000-0000}`, `publisher` de periódico e `organization = {SBC}` |
| 2.9 | Sem "Acesso em:" na maioria | Documento consultado online: "Disponível em: ... Acesso em: ..." | Em toda entrada com `url`, acrescente `urlaccessdate = {18 nov. 2026}` |
| 2.10 | Ordem, espaçamento e alinhamento | Ordem alfabética, espaço simples, **alinhadas só à esquerda**, uma linha em branco entre elas | Já está assim no modelo. Não precisa mexer |

**Modelo de `@inproceedings`** (Pina et al., para a regra 2.3):

```bibtex
@inproceedings{pina2025,
  author              = {Pina, Israel Coimbra de and Souza, Tobias Moraes de and {Silva Filho}, Frederico Guilherme Santana da and Seruffo, Marcos Cesar da Rocha and Cardoso, Diego Lisboa},
  title               = {Experiência interativa em {3D} para exibição de animais extintos no {Museu Emílio Goeldi}: uma abordagem educacional e tecnológica baseada em {WebGL}},
  organization        = {Simpósio Brasileiro de Sistemas Multimídia e Web},
  conference-number   = {31},
  conference-year     = {2025},
  conference-location = {Rio de Janeiro},
  booktitle           = {Anais [\ldots]},
  address             = {Porto Alegre},
  publisher           = {SBC},
  year                = {2025},
  pages               = {220--228},
  doi                 = {10.5753/webmedia.2025.16163},
  url                 = {https://sol.sbc.org.br/index.php/webmedia/article/view/37965},
  urlaccessdate       = {18 nov. 2026}
}
```

Resultado esperado: "PINA, I. C. de *et al.* Experiência interativa... In: SIMPÓSIO BRASILEIRO DE SISTEMAS MULTIMÍDIA E WEB, 31., 2025, Rio de Janeiro. **Anais [...]**. Porto Alegre: SBC, 2025. p. 220–228."

- **Falcão (WIE 2010):** mesmo formato. `organization = {Workshop de Informática na Escola}`, número 16, local Belo Horizonte.
- **ARTOM:** mesmo formato. O evento é `Workshops do Congresso Brasileiro de Informática na Educação`, número 10, ano **2021**, e não 2020 como está hoje no seu `.bib`.

**Modelo de `@thesis`** (TCC do Gustavo, para a regra 2.4):

```bibtex
@thesis{brito2026,
  author        = {Brito, João Gustavo Feitosa},
  title         = {{ECOS}: uma exposição virtual de artefatos espaciais baseada em {Web} {3D}},
  year          = {2026},
  type          = {Trabalho de Conclusão de Curso (Graduação em Ciência da Computação)},
  school        = {Campus Quixadá, Universidade Federal do Ceará},
  address       = {Quixadá}
}
```

Resultado esperado: "BRITO, J. G. F. **ECOS**: uma exposição virtual... 2026. Trabalho de Conclusão de Curso (Graduação em Ciência da Computação) – Campus Quixadá, Universidade Federal do Ceará, Quixadá, 2026."

**Prenomes abreviados ou por extenso:** a norma aceita os dois ("FARIAS, I. M. S." ou "LESSA, Sérgio"), desde que todas as referências sigam o mesmo padrão. O modelo abrevia todos, o que está OK.

---

## 3. Elementos pré-textuais (`documento.tex`)

| # | No seu `documento.tex` | O guia pede | Como consertar |
|---|---|---|---|
| 3.1 | Capa: "UNIVERSIDADE FEDERAL DO CEARÁ / CURSO DE GRADUAÇÃO..." (sem o campus) | Instituição, **centro/campus** e curso. O TCC do Gustavo (mesmo modelo, aprovado em 2026) traz "CAMPUS QUIXADÁ" | Linha 123: troque `%\centro{Centro de Xxxxxxxx}` por `\centro{Campus Quixadá}`. Confira se a folha de rosto passa a dizer "do Campus Quixadá da Universidade Federal do Ceará", como a do Gustavo |
| 3.2 | `%\imprimirfolhadeaprovacao` (comentada) e banca "Prof. Dr. Xxxxxxx" | **Folha de aprovação é obrigatória** | Na versão final: descomente a linha 240, preencha `\dataaprovacao{}` e os membros da banca. Apague os membros que não existem (deixe o nome vazio) |
| 3.3 | `%\imprimirfichacatalografica` (comentada) | **Ficha catalográfica é obrigatória** (no verso da folha de rosto) | Gere no módulo **CATALOG** da Biblioteca da UFC (o PDF substitui `1-pre-textuais/ficha-catalografica.pdf`) e descomente a linha 238. Só na versão final |
| 3.4 | Resumo e abstract ainda com o texto do CLARA.js | 150 a 500 palavras, parágrafo único, 3ª pessoa, com objetivo, método, resultados e conclusão | Troque pelo `00-Resumo.txt` e `00-Abstract.txt` novos quando terminar |
| 3.5 | `Keywords: Computer graphics; ...` | Palavras-chave separadas por `;`, terminadas em ponto e **com inicial minúscula** (exceto nomes próprios) | `Keywords: computer graphics; ...` |
| 3.6 | Capa sem brasão | O guia cita o brasão da UFC como 1º item da capa | O modelo só põe o brasão em tese e dissertação. Pergunte ao orientador se o curso exige. O TCC do Gustavo usou o mesmo modelo |

---

## 4. Texto (capítulos)

| # | Hoje | O guia pede | Como consertar |
|---|---|---|---|
| 4.1 | Listas com marcadores (•) via `itemize` | **Alíneas**: `a)`, `b)`, `c)`, texto com inicial minúscula, terminado em `;`, e o último em `.`. Subalíneas com travessão (–) | Use `\begin{alineas} \item ... \end{alineas}` (do abnTeX2) no lugar de `itemize`. Subalíneas: `\begin{subalineas}` |
| 4.2 | `\Fonte{Elaborado pelo autor.}` em tudo | A fonte é obrigatória em toda ilustração e tabela, mesmo que seja do autor (já está certo). Concordância: **Figura/Tabela → "Elaborada"**; **Quadro → "Elaborado"** | Ajuste o gênero |
| 4.3 | Fonte de figura de outro autor: "Figura 2 do artigo de Pina et al. (2025)" | Seguir a regra de citação: autor, ano e página | `\Fonte{\citeonline[p.~X]{pina2025}.}`, com X = página da figura no artigo |
| 4.4 | Tamanho da legenda e da fonte das figuras: padrão do modelo | Recomenda-se **tamanho 10** para legenda e fonte de ilustrações e tabelas (é recomendação, não obrigação) | Opcional: em `lib/preambulo.tex`, linha 71, troque `font=singlespacing` por `font={footnotesize,singlespacing}` e veja se fica bom |
| 4.5 | Tabelas com traços verticais (ex.: Quadro de erros da IA) | **Tabelas** (dados numéricos, padrão IBGE): sem traços verticais. **Quadros** (texto) podem ser fechados | O quadro pode ficar como está. As tabelas (pré/pós, SUS) já usam `booktabs`, sem traços verticais. Está certo |
| 4.6 | Siglas | Na primeira vez, por extenso e depois a sigla entre parênteses | Ex.: "Inteligência Artificial (IA)". Confira IA, SUS, ENEM, BNCC e SBC |

---

## 5. O que já está de acordo (não mexer)

- **Página:** A4, fonte Times 12 e espaço 1,5.
- **Margens:** 3 cm (superior e esquerda) e 2 cm (inferior e direita).
- **Parágrafo:** recuo de 2 cm.
- **Títulos das seções:**
  - primária: MAIÚSCULAS e negrito;
  - secundária: negrito;
  - terciária: negrito e itálico;
  - quaternária: itálico;
  - quinária: normal.
- **Elementos pré e pós-textuais:** títulos centralizados (RESUMO, SUMÁRIO, REFERÊNCIAS, APÊNDICE A – …), sem número.
- **Paginação:** começa a aparecer na Introdução, no canto superior direito, e os apêndices seguem a numeração.
- **Legendas:** "Figura 1 – Título" em cima e "Fonte:" embaixo.
- **Referências:** espaço simples, alinhadas à esquerda e separadas por uma linha em branco.
- **Apêndices:** `\imprimirapendices` já abre a parte de apêndices. Por isso os arquivos `apendice-*.tex` **não** podem ter `\begin{apendicesenv}`.

---

## Ordem sugerida

1. Seção 1: trocar a linha 73 e recompilar do zero. É o que mais aparece no texto.
2. Regra 2.1: tirar o `< >` das URLs.
3. Corrigir o `.bib` entrada por entrada (seção 2), conferindo cada uma com o PDF do trabalho.
4. Seções 3 e 4: aos poucos. A folha de aprovação e a ficha catalográfica ficam para a versão final.
