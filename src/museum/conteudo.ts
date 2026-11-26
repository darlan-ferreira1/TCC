// Textos do Museu Virtual: "i" dos pedestais (resumo), "i" ao lado do
// experimento (o que fazer na sala) e quadros (Teoria e História).
// Chave: id da porta (ver alas.ts). Valores usam g = 10 m/s², como a lista.

import type { InfoContent, RoomContent } from './info';

// Pop-up da planta no centro do salão (mirar nela e apertar E).
export const BOAS_VINDAS: InfoContent = {
  title: 'Bem-vindo(a)!',
  pages: [
    {
      heading: 'Bem-vindo(a) à exposição',
      text: 'Esta é uma exposição virtual interativa de Mecânica Clássica.\n\nEm volta deste salão há seis salas, cada uma com um fenômeno: o pêndulo de Galileu, o lançamento de projéteis, as leis de Kepler, as ondas, o pêndulo cônico e o pêndulo de Foucault.\n\nA planta aqui embaixo mostra onde fica cada sala.',
    },
    {
      heading: 'Como andar',
      text: 'Computador: W A S D para andar, o mouse para olhar e Shift para correr. E entra numa porta ou lê um "i".\n\nCelular: o joystick anda e arrastar o dedo olha em volta.\n\nControle: o analógico esquerdo anda, o direito olha e A interage.',
    },
    {
      heading: 'Em cada sala',
      text: 'No centro fica a simulação. Os quadros de Teoria e História e o "i" explicam o fenômeno.\n\nTab (ou ⚙ no celular) abre os ajustes, para mudar os valores da simulação. I inspeciona de perto.',
    },
    {
      heading: 'As questões',
      text: 'Cada sala tem uma porta "Espaço de exercícios". Lá, mire no "i" verde para começar a questão.\n\nA sua resposta vira a entrada da simulação: você ajusta um valor ou escolhe uma alternativa, e a cena mostra o resultado. Se a conta estiver errada, você vê o erro acontecer (a bola cai longe da bandeira, o "fantasma" verde sai do ritmo) e pode tentar de novo.',
    },
  ],
};

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

};
