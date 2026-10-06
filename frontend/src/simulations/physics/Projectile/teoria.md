# Lançamento de Projétil

Um **projétil** é qualquer corpo lançado no ar que, depois de solto, se move apenas sob a ação da gravidade: uma bola chutada, uma pedra arremessada, a água de uma mangueira.

## A ideia central: dois movimentos independentes

Galileu percebeu que o movimento oblíquo pode ser separado em dois movimentos que acontecem **ao mesmo tempo e sem interferir um no outro**:

| Direção | Tipo de movimento | Por quê |
|---|---|---|
| Horizontal (x) | **Uniforme** (velocidade constante) | Nenhuma força horizontal (sem resistência do ar) |
| Vertical (y) | **Uniformemente variado** (aceleração −g) | A gravidade puxa para baixo |

A velocidade inicial **v₀**, lançada com ângulo **θ**, se divide em:

> vₓ = v₀ · cos θ  vᵧ = v₀ · sin θ

## Equações da trajetória

> x(t) = v₀ · cos θ · t
>
> y(t) = v₀ · sin θ · t − ½ · g · t²

Eliminando o tempo, y vira uma função de 2º grau de x: a trajetória é uma **parábola**.

## Grandezas importantes

| Grandeza | Fórmula | Significado |
|---|---|---|
| Tempo de voo | T = 2 · v₀ · sin θ / g | quanto tempo fica no ar |
| Altura máxima | H = (v₀ · sin θ)² / (2g) | ponto mais alto, atingido na metade do alcance |
| Alcance | R = v₀² · sin(2θ) / g | distância horizontal até cair |

## Curiosidades que você pode verificar

- **O alcance máximo acontece em 45°**, porque sin(2θ) vale no máximo 1 quando 2θ = 90°.
- **Ângulos complementares têm o mesmo alcance**: 30° e 60° caem no mesmo lugar (mas o de 60° sobe mais e demora mais).
- **Dobrar a velocidade quadruplica o alcance** (R depende de v₀²).

## Limitações do modelo

No mundo real o ar freia o projétil: o alcance é menor e a curva não é uma parábola perfeita (a descida é mais íngreme que a subida). A simulação ignora o ar para mostrar o comportamento ideal.

## Experimente

1. Com v₀ = 20 m/s, dispare em 30°, 45° e 60°. Qual foi mais longe?
2. Mude g para 1,6 (Lua). O que acontece com o alcance e a altura?
