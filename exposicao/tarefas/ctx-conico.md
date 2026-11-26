# Tarefa: exercícios do Pêndulo Cônico

Você é um agente de implementação. Siga as instruções abaixo sem fazer perguntas.

## Arquivo a editar

`C:\Users\darla\OneDrive\Área de Trabalho\TCC\exposicao\src\museum\exerciciosInterativos.ts`

Este arquivo exporta `EXERCICIOS_INTERATIVOS`, um `Record<string, ExercicioInterativo[]>`.
A chave é o ID da porta da sala (string).

## Fórmula

T = 2π√(L·cosθ / g), onde θ é em radianos.

## Controles disponíveis

- `L`: 0.5–3 m, step 0.1
- `theta`: 5–80°, step 1 (graus — a sala converte para rad internamente)
- `g`: 1–20 m/s², step 0.1

## O que fazer

Adicionar uma nova entrada `'conical-pendulum'` ao `EXERCICIOS_INTERATIVOS`.

**Passos:**
1. Leia o arquivo inteiro com o Read tool.
2. Localize a linha `};` que fecha o mapa (última linha).
3. Edit: substitua os últimos caracteres únicos + `\n};` pela nova entrada + `\n};`.
4. Rode `npm run build` em `C:\Users\darla\OneDrive\Área de Trabalho\TCC\exposicao\` e reporte.

## Código a inserir

```
  'conical-pendulum': [
    {
      id: 'conico-c1',
      titulo: 'C1 — Período com L=1m, θ=60°',
      enunciado: {
        title: 'Exercício 1 · Pêndulo Cônico',
        pages: [{
          heading: 'Cronometre o período',
          text: 'O pêndulo cônico tem L = 1 m e θ = 60°. Qual é o período?\n\nCronometre 3 voltas e divida por 3. Use: T = 2π√(L·cosθ/g)',
        }],
      },
      isCorrect: () => true,
      feedbackCorreto: 'T ≈ 1,40 s — confirmado na simulação!',
      preControls: { L: 1, theta: 60, g: 10 },
      lockedControls: ['L', 'theta', 'g'],
      dica: 'T = 2π√(cos60°/10) = 2π√(0,05) ≈ 1,40 s',
      minHoldMs: 4200,
    },
    {
      id: 'conico-c3',
      titulo: 'C3 — Encontre θ para T=1 s',
      enunciado: {
        title: 'Exercício 2 · Pêndulo Cônico',
        pages: [{
          heading: 'Ajuste o ângulo',
          text: 'Com L = 1 m, qual deve ser θ para que o período seja T = 1 s?\n\nAjuste θ e cronometre até bater.',
        }],
      },
      isCorrect: (v) => {
        const th = Number(v.theta) * Math.PI / 180;
        return Math.abs(2 * Math.PI * Math.sqrt(Number(v.L) * Math.cos(th) / 10) - 1) <= 0.1;
      },
      feedbackCorreto: 'θ ≈ 75° dá T ≈ 1 s — correto!',
      preControls: { L: 1, g: 10, theta: 50 },
      lockedControls: ['L', 'g'],
      dica: 'cosθ = g/(L·(2π)²) ≈ 0,253 → θ ≈ 75°',
    },
    {
      id: 'conico-c4',
      titulo: 'C4 — Por que θ não pode chegar a 90°?',
      enunciado: {
        title: 'Exercício 3 · Pêndulo Cônico',
        pages: [{
          heading: 'O ângulo máximo',
          text: 'Tente aumentar θ ao máximo. Por que não pode chegar a 90°?\n\nObserve o que acontece com o período.',
        }],
      },
      isCorrect: (v) => Number(v.theta) >= 75,
      feedbackCorreto: 'Com θ→90°, v→∞ e a tração→∞. O ângulo tem um limite!',
      preControls: { L: 1, g: 10, theta: 50 },
      lockedControls: ['L', 'g'],
      dica: 'θ→90°: cosθ→0, T→0, v→∞. Fisicamente impossível.',
      minHoldMs: 2000,
    },
    {
      id: 'conico-c5',
      titulo: 'C5 — θ→0: cônico ≈ simples',
      enunciado: {
        title: 'Exercício 4 · Pêndulo Cônico',
        pages: [{
          heading: 'Limite para θ→0',
          text: 'Com θ = 5°, o pêndulo cônico deve ter período próximo ao do pêndulo simples.\n\nObserve e compare com T = 2π√(L/g) ≈ 2 s.',
        }],
      },
      isCorrect: () => true,
      feedbackCorreto: 'T ≈ 2 s — igual ao pêndulo simples! Quando θ→0, cosθ→1.',
      preControls: { L: 1, g: 10, theta: 5 },
      lockedControls: ['L', 'g'],
      dica: 'cos(5°) ≈ 0,996 ≈ 1 → T_cônico ≈ T_simples = 2π√(1/10) ≈ 2 s',
      minHoldMs: 3000,
    },
  ],
```

## Regras

- Não altere entradas existentes.
- Não adicione comentários.
- O arquivo usa aspas simples (`'`), não duplas.
- Reporte: "PASSOU" ou "FALHOU: <mensagem de erro>".
