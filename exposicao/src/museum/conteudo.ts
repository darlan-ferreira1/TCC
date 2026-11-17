// Textos do Museu Virtual: "i" dos pedestais (resumo), "i" ao lado do
// experimento (o que fazer na sala) e quadros (Teoria e História).
// Chave: id da porta (ver alas.ts). Valores usam g = 10 m/s², como a lista.

import type { RoomContent } from './info';

export const CONTEUDO: Record<string, RoomContent> = {
  // ── Museu da Mecânica ──
  'simple-pendulum': {
    resumo: { title: 'Pêndulo de Galileu', pages: [
      { heading: 'O pêndulo simples', text: 'Uma massa presa a um fio, balançando de um lado para o outro. Galileu percebeu que o tempo de cada ida e volta (o período) quase não depende de quão longe a massa é solta.' },
    ] },
    observar: { title: 'O que fazer nesta sala', pages: [
      { heading: 'Meça o período', text: 'Cronometre 10 oscilações e divida por 10. Depois mude o comprimento no painel de ajustes (Tab, ⚙ ou Start) e meça de novo.' },
      { heading: 'Pegue a massa', text: 'Mire na massa e segure E (ou o botão, no celular) para puxá-la. Solte para ver o pêndulo oscilar a partir do ângulo escolhido.' },
    ] },
    quadros: [
      { title: 'Teoria', pages: [
        { heading: 'Período do pêndulo', text: 'Para ângulos pequenos (até uns 15°), o período é\n\nT = 2π √(L / g)\n\nL é o comprimento do fio e g, a gravidade. A massa não aparece na fórmula: trocar a massa não muda o período.' },
        { heading: 'Ângulos grandes', text: 'Com ângulos grandes a fórmula deixa de valer e o período real fica maior. Solte o pêndulo com 10° e com 60° e compare os tempos medidos.' },
      ] },
      { title: 'História', pages: [
        { heading: 'O lustre da catedral', text: 'Conta-se que Galileu Galilei, por volta de 1583, observou um lustre balançando na catedral de Pisa e comparou as oscilações com a própria pulsação. Elas pareciam durar sempre o mesmo tempo.' },
        { heading: 'Relógios de pêndulo', text: 'Em 1656, Christiaan Huygens construiu o primeiro relógio de pêndulo. Por quase 300 anos, foi o relógio mais preciso que existia.' },
      ] },
    ],
  },

  'projectile-room': {
    resumo: { title: 'Lançamento de projéteis', pages: [
      { heading: 'A trajetória parabólica', text: 'Uma bola lançada em ângulo descreve uma parábola. O movimento horizontal tem velocidade constante; o vertical é freado e depois acelerado pela gravidade.' },
    ] },
    observar: { title: 'O que fazer nesta sala', pages: [
      { heading: 'Calcule antes de ver', text: 'Escolha a velocidade e o ângulo nos ajustes. Calcule no papel o alcance, a altura máxima e o tempo de voo. Depois confira as marcas que aparecem quando a bola pousa.' },
      { heading: 'Procure o maior alcance', text: 'Mantenha a velocidade e teste vários ângulos. Qual dá o maior alcance? E 30° e 60° caem no mesmo lugar?' },
    ] },
    quadros: [
      { title: 'Teoria', pages: [
        { heading: 'Decompondo a velocidade', text: 'v₀x = v₀ · cos θ\nv₀y = v₀ · sen θ\n\nNa horizontal a velocidade não muda. Na vertical, a gravidade reduz v₀y até zero (topo) e depois faz a bola cair.' },
        { heading: 'As três fórmulas', text: 'Tempo de voo: T = 2 · v₀y / g\nAltura máxima: H = v₀y² / (2g)\nAlcance: R = v₀² · sen(2θ) / g\n\nComo sen(2θ) é máximo em 90°, o maior alcance é com θ = 45°.' },
      ] },
      { title: 'História', pages: [
        { heading: 'Galileu e a parábola', text: 'Antes de Galileu, acreditava-se que a bala de canhão subia em linha reta e depois caía. Em 1638, no livro "Duas Novas Ciências", Galileu mostrou que a trajetória é uma parábola.' },
      ] },
    ],
  },

  'kepler-room': {
    resumo: { title: 'Leis de Kepler', pages: [
      { heading: 'Os planetas têm regras', text: 'Johannes Kepler descobriu três leis que descrevem o movimento dos planetas em volta do Sol. Nesta sala, as distâncias são proporcionais às reais.' },
    ] },
    observar: { title: 'O que fazer nesta sala', pages: [
      { heading: 'O Planeta X', text: 'O planeta laranja é o Planeta X. Escolha a distância dele ao Sol nos ajustes, calcule o período com a 3ª Lei e confira no painel: conte quantas voltas a Terra dá enquanto ele dá uma.' },
    ] },
    quadros: [
      { title: 'Teoria', pages: [
        { heading: '1ª e 2ª Leis', text: '1ª Lei: as órbitas são elipses, com o Sol num dos focos.\n2ª Lei: a linha Sol–planeta varre áreas iguais em tempos iguais (o planeta anda mais rápido perto do Sol).\n\nNesta sala as órbitas são desenhadas como círculos, uma boa aproximação.' },
        { heading: '3ª Lei', text: 'O quadrado do período é proporcional ao cubo da distância:\n\nT² = a³\n\ncom T em anos e a em UA (1 UA = distância Terra–Sol). Um planeta a 4 UA: T² = 64, então T = 8 anos.' },
      ] },
      { title: 'História', pages: [
        { heading: 'Os dados de Tycho Brahe', text: 'Kepler usou as medições muito precisas de Tycho Brahe. Publicou as duas primeiras leis em 1609 e a terceira em 1619.' },
        { heading: 'De Kepler a Newton', text: 'As leis de Kepler diziam "como" os planetas se movem. Em 1687, Isaac Newton explicou "por quê": a gravitação universal.' },
      ] },
    ],
  },

  'conical-pendulum': {
    resumo: { title: 'Pêndulo cônico', pages: [
      { heading: 'Um pêndulo que gira', text: 'Em vez de ir e voltar, a massa gira num círculo horizontal e o fio desenha um cone. É um pêndulo que só existe em 3D.' },
    ] },
    observar: { title: 'O que fazer nesta sala', pages: [
      { heading: 'Cronometre as voltas', text: 'O painel conta as voltas, mas não mostra o período. Calcule o período com a fórmula, cronometre algumas voltas e compare.' },
      { heading: 'Mude o ângulo', text: 'Aumente o ângulo do fio. O que acontece com o período? Dá para o fio ficar na horizontal?' },
    ] },
    quadros: [
      { title: 'Teoria', pages: [
        { heading: 'As forças', text: 'Na massa agem o peso e a tração do fio.\nVertical: T · cos θ = m · g\nHorizontal: T · sen θ = m · v² / r\n\nA componente horizontal da tração é a força centrípeta.' },
        { heading: 'O período', text: 'período = 2π √(L · cos θ / g)\n\nCom θ pequeno, cos θ ≈ 1 e o período fica igual ao do pêndulo simples. O fio nunca fica na horizontal: com θ = 90°, a tração teria de ser infinita.' },
      ] },
      { title: 'História', pages: [
        { heading: 'Reguladores de máquinas', text: 'O "regulador centrífugo", usado por James Watt nas máquinas a vapor (por volta de 1788), funciona como um pêndulo cônico: quanto mais rápido gira, mais as massas se abrem e menos vapor entra.' },
      ] },
    ],
  },

  'waves-room': {
    resumo: { title: 'Ondas', pages: [
      { heading: 'Energia que viaja', text: 'Numa onda, o que viaja é a perturbação (e a energia), não a matéria: cada conta da corda só sobe e desce.' },
    ] },
    observar: { title: 'O que fazer nesta sala', pages: [
      { heading: 'Siga a crista vermelha', text: 'Use as marcas do chão (a cada 0,5 m) para medir quanto a crista vermelha anda em um período. Compare com a conta v = λ · f.' },
    ] },
    quadros: [
      { title: 'Teoria', pages: [
        { heading: 'Grandezas da onda', text: 'Comprimento de onda (λ): distância entre duas cristas.\nFrequência (f): oscilações por segundo (Hz).\nPeríodo: T = 1 / f.\nAmplitude: altura da crista.' },
        { heading: 'Equação fundamental', text: 'v = λ · f\n\nNum mesmo meio a velocidade é fixa: se a frequência dobra, o comprimento de onda cai pela metade.' },
      ] },
      { title: 'História', pages: [
        { heading: 'Do som à luz', text: 'O estudo das ondas começou com o som e as cordas dos instrumentos. No século XIX, Maxwell mostrou que a luz também é uma onda (eletromagnética), que viaja até no vácuo.' },
      ] },
    ],
  },

  'foucault-pendulum': {
    resumo: { title: 'Pêndulo de Foucault', pages: [
      { heading: 'A prova de que a Terra gira', text: 'Um pêndulo enorme cujo plano de oscilação gira devagar ao longo do dia. Quem gira, na verdade, é a Terra por baixo dele.' },
    ] },
    observar: { title: 'O que fazer nesta sala', pages: [
      { heading: 'Escolha o lugar da Terra', text: 'Nos ajustes, escolha Polo Norte, Paris, Equador, Quixadá ou Polo Sul. Calcule quanto tempo o plano leva para dar uma volta e confira no painel (tempo simulado e giro do plano).' },
      { heading: 'Observe o rastro', text: 'O rastro amarelo no chão mostra o plano girando. Compare o sentido do giro em Paris e em Quixadá.' },
    ] },
    quadros: [
      { title: 'Teoria', pages: [
        { heading: 'Inércia', text: 'Por inércia, o plano de oscilação fica fixo em relação às estrelas. Como o chão gira com a Terra, para quem está no chão o plano parece girar.' },
        { heading: 'Depende da latitude', text: 'Tempo de uma volta = 24 h / sen(latitude)\n\nNos polos: 24 h. No equador: o plano não gira. No hemisfério norte o giro é horário (visto de cima); no sul, anti-horário.' },
      ] },
      { title: 'História', pages: [
        { heading: 'Paris, 1851', text: 'Léon Foucault pendurou uma esfera de 28 kg num fio de 67 m na cúpula do Panteão de Paris. O público viu o plano girar ao longo das horas: foi a primeira demonstração simples de que a Terra gira.' },
      ] },
    ],
  },

  // ── Museu dos Modelos Atômicos ──
  'dalton-model': {
    resumo: { title: 'Dalton (1808)', pages: [
      { heading: 'A "bola de bilhar"', text: 'Para John Dalton, o átomo era uma esfera maciça e indivisível. Cada elemento químico teria o seu tipo de átomo.' },
    ] },
    observar: { title: 'O que fazer nesta sala', pages: [
      { heading: 'Conte os átomos', text: 'Escolha uma reação nos ajustes e conte os átomos antes e depois da seta. O painel confere a contagem: nenhum átomo some nem aparece.' },
    ] },
    quadros: [
      { title: 'Teoria', pages: [
        { heading: 'As ideias de Dalton', text: '1. Toda matéria é formada por átomos.\n2. Átomos de um mesmo elemento são iguais.\n3. Numa reação, os átomos não são criados nem destruídos: só se rearranjam.' },
        { heading: 'Conservação da massa', text: 'Se os átomos só se rearranjam, a massa total se conserva (Lei de Lavoisier): 12 g de carbono + 32 g de oxigênio formam 44 g de gás carbônico.' },
      ] },
      { title: 'História', pages: [
        { heading: 'Um professor de Manchester', text: 'John Dalton publicou sua teoria atômica em 1808, no livro "Um Novo Sistema de Filosofia Química". Ele também estudou o daltonismo, que tinha e que leva o seu nome.' },
      ] },
    ],
  },

  'thomson-model': {
    resumo: { title: 'Thomson (1904)', pages: [
      { heading: 'O "pudim de passas"', text: 'Uma esfera de carga positiva com os elétrons incrustados, como passas num pudim. Foi o primeiro modelo com partículas dentro do átomo.' },
    ] },
    observar: { title: 'O que fazer nesta sala', pages: [
      { heading: 'Átomo neutro', text: 'Mude o número de elétrons nos ajustes. Observe no painel que a carga positiva acompanha, e o total é sempre zero.' },
    ] },
    quadros: [
      { title: 'Teoria', pages: [
        { heading: 'O átomo é divisível', text: 'Thomson mostrou que os raios catódicos são feitos de partículas negativas muito leves, os elétrons. Então o átomo não é indivisível, como dizia Dalton.' },
        { heading: 'Neutralidade', text: 'Como a matéria é neutra, o átomo precisa ter carga positiva igual à negativa: com 6 elétrons (−6), a "massa" positiva vale +6.' },
      ] },
      { title: 'História', pages: [
        { heading: 'O tubo de raios catódicos', text: 'Em 1897, J. J. Thomson desviou os raios catódicos com campos elétricos e magnéticos e descobriu o elétron. Recebeu o Nobel de Física em 1906.' },
      ] },
    ],
  },

  'rutherford-model': {
    resumo: { title: 'Rutherford (1911)', pages: [
      { heading: 'O núcleo', text: 'Disparando partículas alfa contra uma folha de ouro, Rutherford descobriu que o átomo tem um núcleo pequeno, denso e positivo, e é quase todo espaço vazio.' },
    ] },
    observar: { title: 'O que fazer nesta sala', pages: [
      { heading: 'Conte os desvios', text: 'Observe o painel: quantas partículas passaram reto, quantas desviaram e quantas voltaram? As proporções aqui são exageradas: no experimento real, só cerca de 1 em 8000 voltava.' },
    ] },
    quadros: [
      { title: 'Teoria', pages: [
        { heading: 'As três conclusões', text: '1. A maioria passa reto: o átomo é quase todo vazio.\n2. Algumas desviam: há uma região positiva que repele as partículas alfa (também positivas).\n3. Raríssimas voltam: essa região, o núcleo, é muito pequena e concentra a massa.' },
        { heading: 'Escala', text: 'O núcleo tem cerca de 10⁻¹⁵ m e o átomo, cerca de 10⁻¹⁰ m: o átomo é 100 mil vezes maior. Se o núcleo fosse uma bolinha de 1 cm, o átomo teria 1 km.' },
      ] },
      { title: 'História', pages: [
        { heading: 'Geiger e Marsden', text: 'O experimento foi feito por Hans Geiger e Ernest Marsden em 1909, sob orientação de Rutherford. Rutherford disse que era como disparar um projétil num lenço de papel e vê-lo voltar.' },
      ] },
    ],
  },

  'bohr-model': {
    resumo: { title: 'Bohr (1913)', pages: [
      { heading: 'Camadas de energia', text: 'Os elétrons giram em órbitas (camadas) com energias definidas. Para mudar de camada, o elétron absorve ou emite energia.' },
    ] },
    observar: { title: 'O que fazer nesta sala', pages: [
      { heading: 'Monte o átomo', text: 'Escolha um elemento nos ajustes e conte prótons, nêutrons e elétrons. Faça a distribuição em camadas (K, L, M, N) no papel e compare com o átomo da sala.' },
    ] },
    quadros: [
      { title: 'Teoria', pages: [
        { heading: 'Distribuição em camadas', text: 'Capacidade das primeiras camadas: K = 2, L = 8, M = 8 (até o cálcio), N = 2.\nExemplos: N (Z = 7): 2, 5\nMg (Z = 12): 2, 8, 2\nCa (Z = 20): 2, 8, 8, 2' },
        { heading: 'Energia no hidrogênio', text: 'Eₙ = −13,6 / n² eV\n\nQuando o elétron salta de n = 3 para n = 2, emite um fóton de cerca de 1,89 eV: luz vermelha (656 nm).' },
      ] },
      { title: 'História', pages: [
        { heading: 'Explicando as cores', text: 'Niels Bohr propôs seu modelo em 1913 para explicar por que o hidrogênio emite só algumas cores de luz (o espectro de linhas). Recebeu o Nobel de Física em 1922.' },
      ] },
    ],
  },

  'molecular-geometry': {
    resumo: { title: 'Geometria molecular', pages: [
      { heading: 'A forma das moléculas', text: 'Os pares de elétrons em volta do átomo central se repelem e ficam o mais longe possível. Isso define a forma da molécula (teoria VSEPR).' },
    ] },
    observar: { title: 'O que fazer nesta sala', pages: [
      { heading: 'Compare as formas', text: 'Escolha CO₂, H₂O, NH₃ e CH₄ nos ajustes. Anote a geometria e o ângulo de cada uma e explique as diferenças pelos pares de elétrons livres.' },
    ] },
    quadros: [
      { title: 'Teoria', pages: [
        { heading: 'Geometrias comuns', text: 'CO₂: linear, 180°\nBF₃: trigonal plana, 120°\nCH₄: tetraédrica, 109,5°\nNH₃: piramidal, 107°\nH₂O: angular, 104,5°' },
        { heading: 'Pares livres e polaridade', text: 'Pares livres empurram as ligações e diminuem os ângulos (H₂O é angular). O CO₂ tem ligações polares, mas é linear e simétrico: as polaridades se anulam e a molécula é apolar.' },
      ] },
      { title: 'História', pages: [
        { heading: 'A teoria VSEPR', text: 'A teoria da repulsão dos pares de elétrons foi proposta por Sidgwick e Powell (1940) e desenvolvida por Gillespie e Nyholm (1957).' },
      ] },
    ],
  },
};
