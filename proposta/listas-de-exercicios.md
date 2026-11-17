# Listas de exercícios: as duas opções de tema

Nível: ensino médio. Use g = 10 m/s² e π ≈ 3,14.

Cada questão traz:
- **Gabarito:** a resolução à mão, que você confere e refaz no papel;
- **Na sala:** como o aluno usa a simulação do museu para obter a resposta ou conferir o cálculo dele.

Legenda: ✅ já existe no CLARA.js · 🔧 existe, mas precisa de ajuste · 🆕 precisa ser criado.

---

## OPÇÃO A: Museu da Mecânica, "de Galileu a Newton"

### Sala 1: O pêndulo de Galileu ✅ (já tem sala no museu)

**1.** Um pêndulo simples tem 2,5 m de comprimento. Qual é o período de oscilação para pequenos ângulos?
- **Gabarito:** T = 2π√(L/g) = 2π√(2,5/10) = 2π · 0,5 = π ≈ 3,14 s.
- **Na sala:** o aluno ajusta L = 2,5 m, cronometra 10 oscilações e divide o tempo por 10.

**2.** Qual deve ser o comprimento de um pêndulo para que o período seja de 2 s?
- **Gabarito:** L = gT²/(4π²) = 10 · 4/(4 · 10) ≈ 1,0 m (usando π² ≈ 10).
- **Na sala:** o aluno ajusta o comprimento até o período medido dar 2 s.

**3.** Se trocarmos a massa por outra com o dobro da massa, o que acontece com o período?
- **Gabarito:** nada muda, porque o período não depende da massa.
- **Na sala:** 🔧 adicionar um controle de massa e o aluno comparar os dois períodos.

**4.** Se o comprimento do pêndulo for multiplicado por 4, o que acontece com o período?
- **Gabarito:** como T ∝ √L, o período dobra.
- **Na sala:** o aluno mede com L = 0,5 m e depois com L = 2 m.

**5.** Na Lua, g = 1,6 m/s². Qual é o período de um pêndulo de 1 m de comprimento lá?
- **Gabarito:** T = 2π√(1/1,6) = 2π · 0,79 ≈ 5,0 s, contra 2 s na Terra.
- **Na sala:** o aluno troca a gravidade para a da Lua e mede.

**6.** (Conceitual) A fórmula T = 2π√(L/g) vale para qualquer ângulo de soltura?
- **Gabarito:** não. Ela só vale para ângulos pequenos (até uns 15°). Com ângulos grandes, o período real é maior.
- **Na sala:** o aluno solta o pêndulo com 10° e com 60° e compara o período medido com o da fórmula. A simulação já faz essa comparação.

### Sala 2: Lançamento de projéteis ✅ (o experimento existe) · 🆕 (precisa virar sala)

**7.** Uma bola é lançada a 20 m/s, com 30° acima da horizontal. Calcule o tempo de voo, a altura máxima e o alcance.
- **Gabarito:** v₀y = 20 · sen 30° = 10 m/s e v₀x = 20 · cos 30° ≈ 17,3 m/s.
  - Tempo de voo: T = 2v₀y/g = 2 s.
  - Altura máxima: H = v₀y²/(2g) = 100/20 = 5 m.
  - Alcance: R = v₀x · T ≈ 34,6 m.
- **Na sala:** o aluno digita as três respostas antes de lançar, lança, e a sala mostra os valores medidos ao lado dos que ele digitou.

**8.** Com a mesma velocidade de 20 m/s, qual ângulo dá o maior alcance? Qual é esse alcance?
- **Gabarito:** 45°. R = v₀²/g = 400/10 = 40 m.
- **Na sala:** o aluno testa vários ângulos e encontra o máximo.

**9.** Mostre que lançamentos a 30° e a 60°, com a mesma velocidade, têm o mesmo alcance. Qual dos dois sobe mais alto?
- **Gabarito:** como sen(2 · 30°) = sen(2 · 60°), os dois alcances são iguais (≈ 34,6 m). O de 60° sobe mais: H = 15 m, contra 5 m no de 30°.
- **Na sala:** o aluno faz os dois lançamentos e compara as trajetórias.

### Sala 3: As leis de Kepler 🔧 (o Sistema Solar existe, mas os raios estão fora de escala)

**10.** Pela 3ª Lei de Kepler (T² = a³, com T em anos e a em UA), qual é o período de um planeta a 4 UA do Sol?
- **Gabarito:** T² = 64, então T = 8 anos.
- **Na sala:** 🔧 o aluno posiciona um planeta a 4 UA e conta quantas voltas a Terra dá enquanto esse planeta dá uma.

**11.** Marte está a cerca de 1,52 UA do Sol. Estime o ano marciano.
- **Gabarito:** T = 1,52^1,5 ≈ 1,87 ano terrestre.
- **Na sala:** o aluno compara as voltas de Marte com as da Terra.

### Sala 4: Ondas ✅ (o experimento existe) · 🆕 (precisa virar sala)

**12.** Uma onda tem frequência de 5 Hz e comprimento de onda de 0,4 m. Qual é a velocidade dela? E o período?
- **Gabarito:** v = λf = 0,4 · 5 = 2 m/s. T = 1/f = 0,2 s.
- **Na sala:** o aluno ajusta f e λ e confere a velocidade e o período no painel.

**13.** No mesmo meio (v = 2 m/s), a frequência passa para 10 Hz. Qual é o novo comprimento de onda?
- **Gabarito:** λ = v/f = 0,2 m. O comprimento de onda cai pela metade.
- **Na sala:** o aluno ajusta f = 10 Hz e procura o λ que mantém v = 2 m/s.

**Trabalho de software na opção A:**
- **Já existe e é reaproveitado:** o pêndulo.
- **Criar:** as salas do Projétil e das Ondas.
- **Ajustar:** as escalas do Sistema Solar.
- **Novo, comum aos dois temas:** o sistema de exercícios, que mostra o enunciado, recebe a resposta, confere com tolerância e dá dica.

---

## OPÇÃO B: Museu dos Modelos Atômicos (uma linha do tempo)

### Sala 1: Dalton, o átomo como esfera maciça 🆕

**1.** Em uma reação, 12 g de carbono reagem totalmente com 32 g de oxigênio. Qual é a massa de gás carbônico formada? Como o modelo de Dalton explica isso?
- **Gabarito:** 44 g, pela conservação da massa (Lavoisier). Para Dalton, os átomos não são criados nem destruídos na reação, só se rearranjam.
- **Na sala:** 🆕 o aluno monta as moléculas com "bolinhas" numa balança e confere que as duas massas são iguais.

**2.** A água sempre tem a proporção de 1 g de hidrogênio para 8 g de oxigênio. Com 4 g de hidrogênio, quanto oxigênio é necessário e quanta água se forma?
- **Gabarito:** 32 g de oxigênio e 36 g de água, pela Lei de Proust.
- **Na sala:** 🆕 o aluno monta as moléculas e confere a proporção.

### Sala 2: Thomson e o "pudim de passas" 🆕

**3.** No tubo de raios catódicos, o feixe é desviado em direção à placa positiva. O que isso indica sobre as partículas do feixe?
- **Gabarito:** elas têm carga negativa. São os elétrons, descobertos por Thomson em 1897.
- **Na sala:** 🆕 o aluno liga o campo elétrico, inverte a polaridade e observa o desvio do feixe.

**4.** No modelo de Thomson, um átomo neutro tem 6 elétrons. Qual é a carga positiva total da "massa" do átomo?
- **Gabarito:** +6. O átomo é neutro.
- **Na sala:** 🆕 o aluno conta os elétrons e confere a carga total exibida.

### Sala 3: Rutherford e a folha de ouro 🆕

**5.** No experimento de Rutherford, a maioria das partículas alfa atravessou a folha de ouro, algumas foram desviadas e muito poucas voltaram. Quais são as três conclusões?
- **Gabarito:**
  1. O átomo é quase todo espaço vazio.
  2. Existe um núcleo pequeno, denso e positivo.
  3. Os elétrons ficam ao redor do núcleo, na eletrosfera.
- **Na sala:** 🆕 o aluno dispara milhares de partículas e a sala conta quantas passaram, quantas desviaram e quantas voltaram.

**6.** O núcleo tem cerca de 10⁻¹⁵ m e o átomo, cerca de 10⁻¹⁰ m. Se o núcleo fosse uma bolinha de 1 cm, qual seria o tamanho do átomo?
- **Gabarito:** a razão é 10⁵, então o átomo teria 10⁵ cm = 1 km.
- **Na sala:** 🆕 o aluno vê uma comparação de escala, com a bolinha no centro de um estádio.

### Sala 4: Bohr e as camadas ✅ (já tem sala no museu)

**7.** Quantos prótons, nêutrons e elétrons têm o sódio (Z = 11, A = 23) e o cloro (Z = 17, A = 35)? E o íon Cl⁻?
- **Gabarito:**
  - Na: 11 prótons, 12 nêutrons, 11 elétrons.
  - Cl: 17 prótons, 18 nêutrons, 17 elétrons.
  - Cl⁻: 18 elétrons.
- **Na sala:** o aluno escolhe o elemento e conta as partículas no núcleo e na eletrosfera.

**8.** Faça a distribuição em camadas (K, L, M, N) do nitrogênio (Z = 7), do magnésio (Z = 12) e do cálcio (Z = 20). Quantos elétrons de valência cada um tem?
- **Gabarito:**
  - N: 2, 5 (5 de valência).
  - Mg: 2, 8, 2 (2 de valência).
  - Ca: 2, 8, 8, 2 (2 de valência).
- **Na sala:** o aluno digita a distribuição, que a simulação já aceita, e a sala confere com o elemento escolhido.

**9.** Qual é a distribuição do íon Mg²⁺?
- **Gabarito:** 2, 8, porque o átomo perde os 2 elétrons da camada de valência.
- **Na sala:** o aluno remove os elétrons e confere.

**10.** No hidrogênio, Eₙ = −13,6/n² eV. Qual é a energia do fóton emitido quando o elétron salta de n = 3 para n = 2?
- **Gabarito:** E₃ = −1,51 eV e E₂ = −3,40 eV, então ΔE ≈ 1,89 eV. É luz vermelha (656 nm).
- **Na sala:** 🔧 o aluno provoca o salto entre camadas e vê o fóton com a cor e a energia.

### Sala 5: Geometria molecular ✅ (já tem sala no museu)

**11.** Qual é a geometria e o ângulo de ligação de CO₂, H₂O, NH₃ e CH₄?
- **Gabarito:**
  - CO₂: linear, 180°.
  - H₂O: angular, 104,5°.
  - NH₃: piramidal, 107°.
  - CH₄: tetraédrica, 109,5°.
- **Na sala:** o aluno escolhe cada molécula e mede o ângulo.

**12.** Por que H₂O é angular e CO₂ é linear, se as duas têm 3 átomos?
- **Gabarito:** o oxigênio da água tem 2 pares de elétrons livres, que repelem as ligações. O carbono do CO₂ não tem nenhum (teoria VSEPR).
- **Na sala:** o aluno liga a exibição dos pares livres.

**13.** O CO₂ tem ligações polares. Por que a molécula é apolar?
- **Gabarito:** por ser linear e simétrica, os dois vetores de polaridade se anulam.
- **Na sala:** 🔧 o aluno liga a exibição dos vetores de dipolo.

**Trabalho de software na opção B:**
- **Já existem e são reaproveitados:** Bohr e Geometria Molecular.
- **Criar:** 3 simulações novas (Dalton, Thomson e Rutherford).
- **Ajustar:** transições de energia no Bohr e vetores de dipolo na Geometria.
- **Novo:** o mesmo sistema de exercícios da opção A.

---

## Comparação rápida

| | A: Mecânica | B: Modelos Atômicos |
|---|---|---|
| Exercícios de "calcule e confira" | Muitos (quase todos numéricos) | Poucos (mais conceituais) |
| Narrativa de museu | Boa (Galileu → Kepler → Newton) | Ótima (linha do tempo dos modelos) |
| Código novo | Menos (as 4 simulações já existem) | Mais (3 simulações do zero) |
| Risco até 11/12 | Menor | Maior |

---

## EXTRA (opção A): pêndulos que só existem em 3D

Estes exercícios entram na sala do pêndulo, ou numa sala própria, "De Galileu a Foucault". A ideia é responder à pergunta "por que 3D?": o pêndulo simples (2D) é só um caso particular destes.

### Pêndulo cônico 🆕 (ensino médio: dinâmica do movimento circular)

A massa gira em círculo horizontal e o fio de comprimento L forma o ângulo θ com a vertical.

- **Raio do círculo:** r = L·sen θ.
- **Forças:** no eixo vertical, T·cos θ = m·g. No eixo horizontal, T·sen θ = m·v²/r.
- **Resultados:** tg θ = v²/(r·g) e período = 2π√(L·cos θ / g).

**C1.** Um pêndulo cônico tem fio de 1 m e gira com o fio a 60° da vertical. Qual é o período da volta?
- **Gabarito:** período = 2π√(1 · 0,5 / 10) = 2π√0,05 ≈ 2π · 0,224 ≈ 1,4 s.
- **Na sala:** o aluno digita o período. O cone "dele" gira ao lado do real e sai de sincronia se a conta estiver errada.

**C2.** Uma massa de 0,5 kg gira num pêndulo cônico de 2 m, a 60° da vertical. Calcule a tração no fio, o raio do círculo e a velocidade da massa.
- **Gabarito:**
  - Tração: T = m·g/cos θ = 5/0,5 = 10 N.
  - Raio: r = 2 · sen 60° ≈ 1,73 m.
  - Velocidade: v² = r·g·tg θ = 1,73 · 10 · 1,73 ≈ 30, então v ≈ 5,5 m/s.
- **Na sala:** o aluno ativa os vetores de força e confere a tração e a velocidade exibidas.

**C3.** Um pêndulo cônico de 1 m completa uma volta por segundo. Qual é o ângulo do fio com a vertical?
- **Gabarito:** cos θ = g·(período)²/(4π²·L) = 10 · 1/(4 · 10 · 1) = 0,25, então θ ≈ 75,5°.
- **Na sala:** o aluno ajusta o ângulo até o período medido dar 1 s.

**C4.** (Conceitual) Aumentando a velocidade, o fio pode chegar a ficar na horizontal (θ = 90°)?
- **Gabarito:** não. A componente vertical da tração (T·cos θ) precisa equilibrar o peso. Com θ = 90°, cos θ = 0, e a tração teria de ser infinita.
- **Na sala:** o aluno aumenta a velocidade e vê o ângulo se aproximar de 90° sem nunca chegar, enquanto o indicador de tração dispara.

**C5.** (Conceitual) Compare o período do pêndulo cônico com ângulo muito pequeno com o do pêndulo simples de mesmo comprimento.
- **Gabarito:** com θ pequeno, cos θ ≈ 1, e o período fica ≈ 2π√(L/g), igual ao do pêndulo simples.
- **Na sala:** o aluno coloca os dois lado a lado, diminui o ângulo do cônico e vê os períodos se igualarem.

### Pêndulo de Foucault 🆕 (conceitual no ensino médio; a fórmula é dada)

Em 1851, no Panteão de Paris, Foucault pendurou uma esfera de 28 kg num fio de 67 m. O plano de oscilação gira devagar ao longo do dia, e isso prova que a Terra gira. Dado: o plano dá uma volta completa em **24 h / sen(latitude)**.

**F1.** O pêndulo do Panteão tinha 67 m de fio. Qual era o período de cada ida e volta?
- **Gabarito:** T = 2π√(67/10) = 2π√6,7 ≈ 2π · 2,59 ≈ 16,3 s.
- **Na sala:** o aluno cronometra as oscilações do pêndulo gigante.

**F2.** (Conceitual) Por que o pêndulo de Foucault prova que a Terra gira?
- **Gabarito:** por inércia, o plano de oscilação se mantém fixo em relação às estrelas. Quem gira é o chão, junto com a Terra. Para quem está no chão, parece que o plano é que gira.
- **Na sala:** o aluno alterna entre a câmera "no chão" (o plano gira) e a câmera "no espaço" (o plano fica parado e a Terra gira por baixo).

**F3.** Quanto tempo o plano de oscilação leva para dar uma volta no Polo Norte? E no Equador?
- **Gabarito:** no Polo Norte, sen 90° = 1, então 24 h. No Equador, sen 0° = 0, então o plano não gira.
- **Na sala:** o aluno arrasta o pêndulo num globo para o polo e para o equador e compara.

**F4.** Paris está a cerca de 49° N. Quanto tempo o plano leva para dar uma volta?
- **Gabarito:** 24/sen 49° ≈ 24/0,755 ≈ 32 h.
- **Na sala:** o aluno coloca o pêndulo em Paris e acelera o tempo da simulação.

**F5.** E em Quixadá, que fica a cerca de 5° S? O sentido de giro é o mesmo de Paris?
- **Gabarito:** 24/sen 5° ≈ 24/0,087 ≈ 276 h, ou cerca de 11,5 dias. O sentido é o contrário: no hemisfério norte o plano gira no sentido horário (visto de cima), e no sul, no anti-horário.
- **Na sala:** o aluno coloca o pêndulo em Quixadá e compara o sentido com o de Paris.

### Pêndulo esférico livre 🆕 (curiosidade; o caso geral é de ensino superior)

A massa pode se mover em qualquer direção. O pêndulo simples e o pêndulo cônico são casos particulares dele. As questões abaixo usam só ferramentas do ensino médio. O caso geral, em que a trajetória vira uma "roseta", fica só para observação.

**E1.** (Conceitual) Visto de cima, que forma tem a trajetória com amplitude pequena nestes três casos?
  a) soltando a massa sem empurrar;
  b) soltando e dando um empurrão lateral qualquer;
  c) soltando e dando o empurrão lateral exato.
- **Gabarito:**
  - a) uma reta: é o pêndulo simples;
  - b) uma elipse;
  - c) um círculo: é o pêndulo cônico.
- **Na sala:** o aluno escolhe o empurrão e vê o rastro desenhado no chão.

**E2.** Um pêndulo de 1 m é afastado 0,1 m do ponto mais baixo. Que velocidade lateral precisa receber para descrever um círculo?
- **Gabarito:** para ângulos pequenos, ω = √(g/L) = √10 ≈ 3,16 rad/s, e v = ω·r = 3,16 · 0,1 ≈ 0,32 m/s.
- **Na sala:** o aluno digita a velocidade. Se ela estiver errada, o rastro vira uma elipse em vez de um círculo.

**E3.** A massa é solta, sem empurrão, de 0,2 m acima do ponto mais baixo. Com que velocidade ela passa pelo ponto mais baixo?
- **Gabarito:** pela conservação da energia, v = √(2·g·h) = √4 = 2 m/s. Isso vale para qualquer pêndulo, inclusive o esférico.
- **Na sala:** o aluno confere a velocidade exibida quando a massa passa pelo ponto mais baixo.

**E4.** (Observação, sem cálculo) Com amplitude grande e um empurrão lateral, o que acontece com a elipse ao longo do tempo?
- **Gabarito:** ela gira devagar e o rastro forma uma "roseta". A explicação exige mecânica do ensino superior, e a questão fica como curiosidade.
- **Na sala:** o aluno deixa o pêndulo rodando e observa o desenho da roseta se formando.

**Trabalho de software do extra:** uma única simulação de pêndulo esférico (integração em 3D) cobre o cônico e o esférico livre. O pêndulo simples também passa a ser um caso dela. O de Foucault é a mesma simulação, com a rotação da Terra somada à cena.
