# Tarefa: exercícios do Kepler

Você é um agente de implementação. Siga as instruções abaixo sem fazer perguntas.

## Arquivo a editar

`C:\Users\darla\OneDrive\Área de Trabalho\TCC\exposicao\src\museum\exerciciosInterativos.ts`

Este arquivo exporta `EXERCICIOS_INTERATIVOS`, um `Record<string, ExercicioInterativo[]>`.
A chave é o ID da porta da sala (string).

## O que fazer

Adicionar uma nova entrada `'kepler-room'` ao `EXERCICIOS_INTERATIVOS`.

**Passos:**
1. Leia o arquivo inteiro com o Read tool.
2. Localize a linha `};` que fecha o mapa `EXERCICIOS_INTERATIVOS` (a última linha do arquivo).
3. Use o **Edit tool**: `old_string` = os ~4 caracteres finais únicos antes do `\n};`; `new_string` = mesmos + nova entrada + `};`.
4. Rode `npm run build` em `C:\Users\darla\OneDrive\Área de Trabalho\TCC\exposicao\` e reporte se passou.

## Código a inserir

Adicione antes do `\n};` final:

```
  'kepler-room': [
    {
      id: 'kepler-q10',
      titulo: 'Q10 — Período do Planeta X a 4 UA',
      enunciado: {
        title: 'Exercício 1 · Kepler',
        pages: [{
          heading: '3ª Lei de Kepler',
          text: 'O Planeta X está a 4 UA do Sol. Pela 3ª Lei: T² = a³ (T em anos, a em UA).\n\nQual é o período? Observe: quantas vezes a Terra volta enquanto o Planeta X dá uma?',
        }],
      },
      isCorrect: () => true,
      feedbackCorreto: 'T = 8 anos — confirmado contando as voltas da Terra!',
      preControls: { planetX: 4, yearsPerSecond: 0.5 },
      lockedControls: ['planetX', 'yearsPerSecond'],
      dica: 'T² = 4³ = 64 → T = 8 anos.',
      minHoldMs: 5000,
    },
    {
      id: 'kepler-q11',
      titulo: 'Q11 — Órbita de Marte (1,52 UA)',
      enunciado: {
        title: 'Exercício 2 · Kepler',
        pages: [{
          heading: 'Período de Marte',
          text: 'Marte orbita a 1,52 UA. Posicione o Planeta X na mesma distância e calcule T.\n\nCompare: quantas vezes a Terra volta enquanto Marte dá uma?',
        }],
      },
      isCorrect: () => true,
      feedbackCorreto: 'T ≈ 1,87 anos — Marte leva quase 2 anos para completar uma órbita!',
      preControls: { planetX: 1.52, yearsPerSecond: 0.5 },
      lockedControls: ['planetX', 'yearsPerSecond'],
      dica: 'T² = 1,52³ ≈ 3,51 → T ≈ 1,87 anos.',
      minHoldMs: 5000,
    },
  ],
```

## Regras

- Não altere entradas existentes.
- Não adicione comentários.
- O arquivo usa aspas simples (`'`), não duplas.
- Reporte: "PASSOU" ou "FALHOU: <mensagem de erro>".
