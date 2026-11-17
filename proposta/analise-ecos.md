# Análise do ECOS (TCC do Gustavo, 2026) e comparação com o museu do TCC

Pasta estudada: `D:\26\exposicao-ecos`.

## Como o ECOS é feito

| Aspecto | ECOS |
|---|---|
| Tecnologia | A-Frame 1.6 (carregado de CDN), HTML + JS puro, sem build |
| Estrutura | Cada ambiente é uma página HTML separada: `scene01.html` (hall), `scene02.html` (sala temática), `scene03.html` (visualizador). A troca de ambiente recarrega a página inteira e passa o objeto escolhido por `sessionStorage`. |
| Acervo | 5 modelos 3D baixados prontos (Sketchfab/NASA): Hubble, James Webb, Saturno V, ISS e Voyager 1 |
| Movimentação | `look-controls` (clicar e arrastar para olhar) + `wasd-controls` |
| Hall | 5 pedestais, cada um com um ícone "i" (hotspot) que abre uma placa 3D de informação na cena |
| Sala temática | Circular, com 4 quadros curvos (História, Tecnologia, Missões, Futuro). Clicar num quadro abre outra página HTML com o texto (vindo de `conteudoTematico.json`) |
| Visualizador | `orbit-controls`: o objeto isolado, girando e com zoom |
| Avaliação | 26 voluntários, Google Forms, Likert de 1 a 5, TCLE e anonimato |

## Por que ele demora a carregar (medido nos arquivos)

- **O hall carrega os 5 modelos de uma vez, cerca de 25 MB em `.glb`:**
  - Hubble: 11,4 MB
  - James Webb: 7,0 MB
  - Voyager: 2,8 MB
  - ISS: 2,5 MB
  - Saturno V: 1,0 MB
- **A sala temática carrega um panorama de 8,5 MB** (`360scene01.png`) e imagens de fundo de 6,6 MB. Busca ainda fotos externas (Unsplash) a cada visita.
- **Cada troca de ambiente recarrega tudo:** é uma página nova, então a biblioteca e os modelos são carregados de novo.
- **O repositório tem 139 MB**, incluindo arquivos que não são usados, como `the_great_drawing_room.glb` (53 MB) e uma cópia do `hubble.glb` (37 MB).

**No museu do TCC:** é uma página única, os objetos são gerados por código (sem `.glb`), e a troca de sala acontece na mesma cena e no mesmo renderer, com um véu preto. Não há recarga de página nem download de modelos.

## Comparação com o museu do TCC

| | ECOS | Museu do TCC |
|---|---|---|
| Carregamento | Lento (cerca de 25 MB de modelos + imagens, recarga a cada cena) | Rápido (geometria por código, uma página só) |
| Câmera | Clicar e arrastar | Estilo FPS (mouse travado), joystick no celular e controle de videogame |
| Objetos | Modelos 3D estáticos para olhar | Fenômenos simulados que o aluno controla (L, θ, v₀, latitude…) |
| Informação | Placa "i" no hall; texto longo em outra página | Painéis 3D com valores medidos ao vivo |
| Exercícios | Não tem | É o objetivo: a resposta do aluno vai para a cena |
| Ponto forte dele | Visualizador 3D do objeto isolado (orbit) e acervo com modelos reais e bonitos | — |

## O que vale adotar do ECOS

1. **Pedestais no hall de cada ala, com uma miniatura de cada sala.** Por exemplo, um pêndulo pequeno, um canhão pequeno e um átomo de Thomson pequeno.
2. **Ícones "i" nos pedestais e nos objetos das salas,** abrindo um pop-up de informação. É o mesmo papel do painel do Foucault, só que sob demanda.
3. **Melhoria sobre o ECOS: texto em pop-up com setas (◀ ▶), em vez de abrir outra página.** Os quadros História, Teoria e Curiosidade da sala abrem um pop-up dentro do próprio museu, e o aluno passa as páginas com as setas sem sair da cena.
4. **Um equivalente ao visualizador orbital:** um botão "inspecionar" que trava o objeto da sala no centro e deixa girar e dar zoom (por exemplo, o átomo de Thomson ou o canhão).

## Para o texto do TCC

O ECOS entra em Trabalhos Relacionados como precedente direto: mesmo orientador, mesma universidade e mesmo tipo de produto (exposição Web 3D). As diferenças a destacar são:
- fenômeno simulado e controlável, em vez de um modelo estático;
- exercícios ligados à cena;
- carregamento leve, sem modelos externos;
- movimentação FPS em computador, celular e controle.
