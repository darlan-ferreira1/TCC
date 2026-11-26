# Tarefa: exercícios do Pêndulo de Foucault + correção de tipo

Você é um agente de implementação. Siga as instruções abaixo sem fazer perguntas.

## Arquivo a editar

`C:\Users\darla\OneDrive\Área de Trabalho\TCC\exposicao\src\museum\exerciciosInterativos.ts`

## Passo 1 — Correção de tipo (OBRIGATÓRIA, fazer primeiro)

O controle `place` do Foucault é um **select** com valor string. O campo `preControls` da interface está tipado como `Record<string, number>`, o que causaria erro de TypeScript.

**Edição 1:** linha 2 do arquivo, trocar:
```
import type { ControlValues } from '../core/controls';
```
por:
```
import type { ControlValue, ControlValues } from '../core/controls';
```

**Edição 2:** linha 10 do arquivo, trocar:
```
  preControls?: Record<string, number>;
```
por:
```
  preControls?: Record<string, ControlValue>;
```

## Controles do Foucault

- `place`: select com opções `'polo_norte'` / `'paris'` / `'equador'` / `'quixada'` / `'polo_sul'`
- `timeScale`: 600–14400, step 600 (segundos reais por segundo simulado)

## Passo 2 — Adicionar exercícios

Adicionar `'foucault-pendulum'` ao `EXERCICIOS_INTERATIVOS`.

Localize `\n};` no final do arquivo (único), substitua pela nova entrada + `\n};`.

## Código a inserir

```
  'foucault-pendulum': [
    {
      id: 'foucault-f1',
      titulo: 'F1 — Período do pêndulo (L=6m)',
      enunciado: {
        title: 'Exercício 1 · Foucault',
        pages: [{
          heading: 'Período do pêndulo',
          text: 'O pêndulo desta sala tem L = 6 m. Qual é o período?\n\nCronometre as oscilações e confira com T = 2π√(L/g).',
        }],
      },
      isCorrect: () => true,
      feedbackCorreto: 'T ≈ 4,87 s — período de um pêndulo de 6 m!',
      preControls: { place: 'paris', timeScale: 600 },
      lockedControls: ['place', 'timeScale'],
      dica: 'T = 2π√(6/10) ≈ 4,87 s',
      minHoldMs: 5000,
    },
    {
      id: 'foucault-f2',
      titulo: 'F2 — Por que o plano gira?',
      enunciado: {
        title: 'Exercício 2 · Foucault',
        pages: [{
          heading: 'A Terra que gira',
          text: 'Em Paris, acelere o tempo e observe o plano girar.\n\nO pêndulo não recebe força lateral. Por que o plano parece girar?',
        }],
      },
      isCorrect: () => true,
      feedbackCorreto: 'O plano é fixo no espaço. É o chão que gira!',
      preControls: { place: 'paris', timeScale: 3600 },
      lockedControls: ['place', 'timeScale'],
      dica: 'O plano é fixo no espaço; a Terra (e você) gira por baixo dele.',
      minHoldMs: 4000,
    },
    {
      id: 'foucault-f3a',
      titulo: 'F3a — Polo Norte: 1 volta em 24 h',
      enunciado: {
        title: 'Exercício 3a · Foucault',
        pages: [{
          heading: 'No Polo Norte',
          text: 'No Polo Norte, o plano gira uma volta completa em 24 h.\n\nAcelere o tempo. T_Foucault = 24 h / sen(latitude). Latitude = 90°.',
        }],
      },
      isCorrect: () => true,
      feedbackCorreto: 'Uma volta em 24 h no polo!',
      preControls: { place: 'polo_norte', timeScale: 7200 },
      lockedControls: ['place', 'timeScale'],
      dica: 'T = 24 / sen(90°) = 24 / 1 = 24 h.',
      minHoldMs: 3000,
    },
    {
      id: 'foucault-f3b',
      titulo: 'F3b — Equador: plano não gira',
      enunciado: {
        title: 'Exercício 3b · Foucault',
        pages: [{
          heading: 'No Equador',
          text: 'No Equador (latitude = 0°), o plano não gira.\n\nObserve. T = 24 / sen(0°) = ?',
        }],
      },
      isCorrect: () => true,
      feedbackCorreto: 'T → ∞ no equador. O plano nunca gira!',
      preControls: { place: 'equador', timeScale: 7200 },
      lockedControls: ['place', 'timeScale'],
      dica: 'sen(0°) = 0 → T → ∞: nunca completa uma volta.',
      minHoldMs: 3000,
    },
    {
      id: 'foucault-f4',
      titulo: 'F4 — Paris: período ≈ 32 h',
      enunciado: {
        title: 'Exercício 4 · Foucault',
        pages: [{
          heading: 'Em Paris',
          text: 'Em Paris (lat. 49° N), quanto tempo o plano leva para girar uma volta?\n\nAcelere o tempo. T = 24 h / sen(49°).',
        }],
      },
      isCorrect: () => true,
      feedbackCorreto: 'T ≈ 32 h em Paris!',
      preControls: { place: 'paris', timeScale: 7200 },
      lockedControls: ['place', 'timeScale'],
      dica: 'T = 24 / sen(49°) ≈ 24 / 0,755 ≈ 32 h.',
      minHoldMs: 4000,
    },
    {
      id: 'foucault-f5',
      titulo: 'F5 — Quixadá: 276 h, sentido inverso',
      enunciado: {
        title: 'Exercício 5 · Foucault',
        pages: [{
          heading: 'Em Quixadá',
          text: 'Em Quixadá (lat. 5° S), calcule T e observe o sentido de rotação.\n\nCompare com Paris: mesmo sentido ou inverso?',
        }],
      },
      isCorrect: () => true,
      feedbackCorreto: 'T ≈ 276 h e sentido inverso ao de Paris!',
      preControls: { place: 'quixada', timeScale: 14400 },
      lockedControls: ['place', 'timeScale'],
      dica: 'T = 24 / sen(5°) ≈ 276 h ≈ 11,5 dias. No hemisfério sul, sentido invertido.',
      minHoldMs: 4000,
    },
  ],
```

## Verificação

1. `npm run build` em `C:\Users\darla\OneDrive\Área de Trabalho\TCC\exposicao\`
2. Nenhum erro de TypeScript em `preControls` (foi corrigido no Passo 1).
3. Reporte: "PASSOU" ou "FALHOU: <mensagem de erro>".

## Regras

- Não altere entradas existentes.
- Não adicione comentários.
- O arquivo usa aspas simples (`'`), não duplas.
