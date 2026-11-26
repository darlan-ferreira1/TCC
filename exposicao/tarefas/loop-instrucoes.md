# Instruções do loop de exercícios

Pasta de trabalho: `C:\Users\darla\OneDrive\Área de Trabalho\TCC`

## A cada iteração

1. Leia `C:\Users\darla\OneDrive\Área de Trabalho\TCC\exposicao\tarefas\tarefas.md`.
2. Encontre a **primeira linha** com `[ ]` (tarefa pendente).
   - Se não houver nenhuma → `ScheduleWakeup(stop=true)`.
3. Extraia a chave (ex: `lancamento`) e leia o arquivo de contexto:
   `C:\Users\darla\OneDrive\Área de Trabalho\TCC\exposicao\tarefas\ctx-<chave>.md`
4. Crie um `Agent(subagent_type: "general-purpose", prompt: <conteúdo completo do ctx>)`.
   A chamada é **síncrona** — aguarde o agente terminar.
5. Marque a tarefa como `[x]` em tarefas.md com o Edit tool.
6. Verifique se ainda há `[ ]` restantes:
   - Sim → `ScheduleWakeup(delaySeconds=60, noop=false, reason="próxima sala", prompt="Leia e siga C:\\Users\\darla\\OneDrive\\Área de Trabalho\\TCC\\exposicao\\tarefas\\loop-instrucoes.md")`
   - Não → `ScheduleWakeup(stop=true)`
