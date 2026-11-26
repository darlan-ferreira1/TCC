# Tarefa: exercícios do Lançamento Oblíquo

Você é um agente de implementação. Siga as instruções abaixo sem fazer perguntas.

## Arquivo a editar

`C:\Users\darla\OneDrive\Área de Trabalho\TCC\exposicao\src\museum\exerciciosInterativos.ts`

Este arquivo exporta `EXERCICIOS_INTERATIVOS`, um `Record<string, ExercicioInterativo[]>`.
A chave é o ID da porta da sala (string).

## O que fazer

Adicionar uma nova entrada `'projectile-room'` ao `EXERCICIOS_INTERATIVOS`.

**Passos:**
1. Leia o arquivo inteiro com o Read tool.
2. Localize a linha `};` que fecha o mapa `EXERCICIOS_INTERATIVOS` (a última linha do arquivo que contém só `};`).
3. Use o **Edit tool** com:
   - `old_string`: os últimos ~4 caracteres únicos antes do fim, como `  ],\n};`  
     (exatamente como aparecem no arquivo; a string deve ser única no arquivo)
   - `new_string`: mesmos caracteres + a nova entrada + `};`
4. Rode `npm run build` em `C:\Users\darla\OneDrive\Área de Trabalho\TCC\exposicao\` e reporte se passou.

## Código a inserir

Substitua `\n};` no final do arquivo por:

```
  'projectile-room': [
    {
      id: 'lancamento-q7',
      titulo: 'Q7 — Dados do lançamento (20 m/s, 30°)',
      enunciado: {
        title: 'Exercício 1 · Lançamento',
        pages: [{
          heading: 'Calcule e confira',
          text: 'Uma bola é lançada a v₀ = 20 m/s, θ = 30°, g = 10 m/s².\n\nCalcule o tempo de voo, a altura máxima e o alcance. Depois observe a trajetória e confira.',
        }],
      },
      isCorrect: () => true,
      feedbackCorreto: 'T = 2 s, H = 5 m, R ≈ 34,6 m — conferido na simulação!',
      preControls: { v0: 20, angle: 30 },
      lockedControls: ['v0', 'angle'],
      dica: 'v₀y = 20·sin30° = 10 m/s\nT = 2v₀y/g = 2 s\nH = v₀y²/(2g) = 5 m\nv₀x = 20·cos30° ≈ 17,3 m/s\nR = v₀x·T ≈ 34,6 m',
      minHoldMs: 3000,
    },
    {
      id: 'lancamento-q8',
      titulo: 'Q8 — Ângulo de máximo alcance',
      enunciado: {
        title: 'Exercício 2 · Lançamento',
        pages: [{
          heading: 'Maior alcance',
          text: 'Com v₀ = 20 m/s, ajuste o ângulo θ para obter o maior alcance possível.\n\nQual ângulo maximiza R = v₀²·sin(2θ)/g?',
        }],
      },
      isCorrect: (v) => Math.abs(Number(v.angle) - 45) <= 5,
      feedbackCorreto: 'θ = 45° dá o maior alcance: R = v₀²/g = 40 m!',
      preControls: { v0: 20 },
      lockedControls: ['v0'],
      dica: 'R é máximo quando 2θ = 90°, ou seja, θ = 45°.',
    },
    {
      id: 'lancamento-q9a',
      titulo: 'Q9a — Lançamento a 30°',
      enunciado: {
        title: 'Exercício 3 · Lançamento',
        pages: [{
          heading: 'Compare 30° e 60°',
          text: 'Lançamento a 30°. Observe e anote o alcance.\n\nNa próxima questão você compara com 60°.',
        }],
      },
      isCorrect: () => true,
      feedbackCorreto: 'Anotou o alcance? Próxima questão: 60°.',
      preControls: { v0: 20, angle: 30 },
      lockedControls: ['v0', 'angle'],
      dica: 'R = v₀²·sin(60°)/g ≈ 34,6 m',
      minHoldMs: 2000,
    },
    {
      id: 'lancamento-q9b',
      titulo: 'Q9b — Lançamento a 60° (mesmo alcance, mais alto)',
      enunciado: {
        title: 'Exercício 4 · Lançamento',
        pages: [{
          heading: 'Compare com 30°',
          text: 'Agora observe o lançamento a 60°. Compare o alcance com o de 30°.\n\n30° e 60° são complementares: sin(2·30°) = sin(2·60°), então R é igual!\nMas qual sobe mais alto?',
        }],
      },
      isCorrect: () => true,
      feedbackCorreto: 'Mesmo alcance, maior altura! sin(60°) = sin(120°).',
      preControls: { v0: 20, angle: 60 },
      lockedControls: ['v0', 'angle'],
      dica: 'Com 60°: v₀y = 17,3 m/s → H = 15 m (3× maior). Mesmo R, maior H.',
      minHoldMs: 2000,
    },
  ],
};
```

## Regras

- Não altere entradas existentes (`'simple-pendulum'` e qualquer outra já presente).
- Não adicione comentários.
- O arquivo usa aspas simples (`'`), não duplas.
- Reporte: "PASSOU" ou "FALHOU: <mensagem de erro>".
