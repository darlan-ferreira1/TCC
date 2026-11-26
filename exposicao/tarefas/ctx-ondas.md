# Tarefa: exercícios das Ondas

Você é um agente de implementação. Siga as instruções abaixo sem fazer perguntas.

## Arquivo a editar

`C:\Users\darla\OneDrive\Área de Trabalho\TCC\exposicao\src\museum\exerciciosInterativos.ts`

Este arquivo exporta `EXERCICIOS_INTERATIVOS`, um `Record<string, ExercicioInterativo[]>`.
A chave é o ID da porta da sala (string).

## Contexto dos valores

A lista de exercícios usava f = 5 Hz e λ = 0,4 m, que estão **fora do range** dos controles (f max = 2 Hz, λ min = 0,5 m). Os exercícios abaixo usam valores rescalados que preservam o mesmo conceito (v = λ·f) dentro do range disponível.

## Controles disponíveis

- `wavelength`: 0.5–4 m, step 0.1
- `frequency`: 0.1–2 Hz, step 0.1
- `amplitude`: 0.1–0.8 m, step 0.05

## O que fazer

Adicionar uma nova entrada `'waves-room'` ao `EXERCICIOS_INTERATIVOS`.

**Passos:**
1. Leia o arquivo inteiro com o Read tool.
2. Localize a linha `};` que fecha o mapa (última linha do arquivo).
3. Edit: substitua os últimos caracteres únicos + `\n};` pela nova entrada + `\n};`.
4. Rode `npm run build` em `C:\Users\darla\OneDrive\Área de Trabalho\TCC\exposicao\` e reporte.

## Código a inserir

```
  'waves-room': [
    {
      id: 'ondas-q12',
      titulo: 'Q12 — Velocidade e período (λ=2m, f=1Hz)',
      enunciado: {
        title: 'Exercício 1 · Ondas',
        pages: [{
          heading: 'v = λ·f',
          text: 'Uma onda com λ = 2 m e f = 1 Hz. Qual é a velocidade e o período?\n\nObserve uma crista se mover e confira: v = λ·f e T = 1/f.',
        }],
      },
      isCorrect: () => true,
      feedbackCorreto: 'v = 2 m/s e T = 1 s — a crista percorre 2 m a cada segundo!',
      preControls: { wavelength: 2, frequency: 1, amplitude: 0.4 },
      lockedControls: ['wavelength', 'frequency', 'amplitude'],
      dica: 'v = 2·1 = 2 m/s; T = 1/1 = 1 s',
      minHoldMs: 4000,
    },
    {
      id: 'ondas-q13',
      titulo: 'Q13 — Ajuste λ para manter v=2 m/s',
      enunciado: {
        title: 'Exercício 2 · Ondas',
        pages: [{
          heading: 'Dobrar f, manter v',
          text: 'A frequência agora é f = 2 Hz. Para manter v = 2 m/s, qual deve ser o novo comprimento de onda?\n\nAjuste λ até a cena mostrar o resultado correto.',
        }],
      },
      isCorrect: (v) => Math.abs(Number(v.wavelength) - 1.0) <= 0.15,
      feedbackCorreto: 'λ = 1 m: v = 1·2 = 2 m/s. Dobrar f exige λ pela metade!',
      preControls: { frequency: 2, amplitude: 0.4, wavelength: 2 },
      lockedControls: ['frequency', 'amplitude'],
      dica: 'λ = v/f = 2/2 = 1 m',
    },
  ],
```

## Regras

- Não altere entradas existentes.
- Não adicione comentários.
- O arquivo usa aspas simples (`'`), não duplas.
- Reporte: "PASSOU" ou "FALHOU: <mensagem de erro>".
