# Você é o Móvel — Cinemática

A **cinemática** descreve os movimentos: onde um corpo está, quão rápido ele se move e como essa rapidez muda — sem se preocupar com a causa do movimento. Nesta simulação, o "móvel" é a sua mão.

## Posição e deslocamento

A **posição x** diz onde o móvel está em relação a uma origem (aqui, o centro da imagem da câmera). Direita é positivo, esquerda é negativo.

O **deslocamento** é a variação de posição: Δx = x_final − x_inicial.

## Velocidade

A **velocidade média** é o deslocamento dividido pelo tempo gasto:

> v = Δx / Δt

O **sinal** da velocidade indica o **sentido**: v > 0 indo para a direita, v < 0 indo para a esquerda, v = 0 parado.

## Lendo os gráficos

| Movimento | Gráfico x(t) | Gráfico v(t) |
|---|---|---|
| **Repouso** | reta horizontal | v = 0 |
| **Uniforme (MU)** — velocidade constante | reta inclinada | reta horizontal (≠ 0) |
| **Uniformemente variado (MUV)** — aceleração constante | parábola | reta inclinada |

Duas ideias-chave:

- **A inclinação do gráfico x(t) é a velocidade.** Reta mais "em pé" = movimento mais rápido.
- **A inclinação do gráfico v(t) é a aceleração** (a = Δv / Δt).

## Equações

**Movimento uniforme:**

> x = x₀ + v · t

**Movimento uniformemente variado** (partindo com velocidade v₀):

> x = x₀ + v₀ · t + ½ · a · t²
>
> v = v₀ + a · t

## Experimente

1. **Repouso:** fique parado. O gráfico x(t) fica horizontal? E o v(t), fica no zero?
2. **Movimento uniforme:** mova a mão com velocidade constante. Repare que x(t) vira uma reta e v(t) fica constante.
3. **Ida e volta:** na volta, o gráfico de velocidade vai para baixo do zero. Por quê?
4. **Acelerando:** comece devagar e vá cada vez mais rápido. x(t) vira uma curva e v(t) uma reta subindo.

## Como a câmera mede em metros?

A câmera só enxerga pixels. Para converter em metros, a simulação usa a sua **palma como régua**: uma palma adulta mede cerca de 9,5 cm do punho até a base do dedo médio. Por isso é importante mover a mão **para os lados, sempre à mesma distância da câmera** — se você aproximar a mão, ela parece maior e a régua muda.
