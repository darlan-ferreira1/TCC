# Pêndulo Simples

Um **pêndulo simples** é uma massa pequena presa a um fio (ou haste) leve, de comprimento **L**, que oscila em torno de um ponto fixo sob a ação da gravidade.

## Por que ele oscila?

Quando a massa é afastada da vertical por um ângulo **θ**, o peso dela tem uma componente que aponta de volta para o centro:

> F = −m · g · sin θ

Essa força **restauradora** sempre puxa a massa para a posição de equilíbrio. A massa passa do ponto mais baixo com velocidade máxima, sobe do outro lado até parar e volta — e o ciclo se repete.

## Equação do movimento

Aplicando a 2ª Lei de Newton na direção do movimento:

> θ'' = −(g / L) · sin θ

- **θ''** é a aceleração angular;
- **g** é a aceleração da gravidade;
- **L** é o comprimento do fio.

Repare que a **massa não aparece** na equação: um pêndulo com uma bola de chumbo e outro com uma bola de isopor (sem atrito) oscilam igual.

## Período

O **período T** é o tempo de uma oscilação completa (ida e volta). Para **ângulos pequenos** (até uns 15°), vale sin θ ≈ θ e chegamos à fórmula clássica:

> T = 2π · √(L / g)

O que ela diz:

- **Fio mais longo → oscila mais devagar.** Quadruplicar L dobra o período.
- **Gravidade maior → oscila mais rápido.** Na Lua (g ≈ 1,6 m/s²) o mesmo pêndulo seria ~2,5 vezes mais lento.
- **O período não depende da amplitude** (para ângulos pequenos). Essa propriedade, o *isocronismo*, foi observada por Galileu e usada por séculos em relógios de pêndulo.

## E para ângulos grandes?

A fórmula acima é uma **aproximação**. A simulação, porém, resolve a equação completa (com sin θ), então:

- com θ₀ = 45°, o período real é cerca de **4% maior** que o mostrado no painel;
- com θ₀ perto de 170°, o pêndulo quase para lá em cima e o período fica **muito** maior.

## Experimente

1. Deixe θ₀ em 10° e cronometre 10 oscilações. Compare com 10 × T do painel.
2. Repita com θ₀ = 150°. A diferença ficou maior?
3. Coloque g = 1,6 (Lua) e g = 24,8 (Júpiter) e compare.
