// Fábrica de salas de exercício: cada ExercicioInterativo vira um InteractiveRoom
// sintético que reaproveita o experimento base mas com preControls aplicados e
// controles travados. Usado em museum/index.tsx para gerar ALL_ROOMS_FINAL.

import type { InteractiveRoom } from './interactiveRoom';
import { EXERCICIOS_INTERATIVOS } from './exerciciosInterativos';

export function buildAllExerciseRooms(
  baseRooms: Record<string, InteractiveRoom>,
): Record<string, InteractiveRoom> {
  const result: Record<string, InteractiveRoom> = {};
  for (const [expId, exercises] of Object.entries(EXERCICIOS_INTERATIVOS)) {
    const base = baseRooms[expId];
    if (!base) continue;
    for (let i = 0; i < exercises.length; i++) {
      const ex = exercises[i];
      const hasNext = i < exercises.length - 1;
      const hasPrev = i > 0;
      const page = ex.enunciado.pages[0];
      result[ex.id] = {
        experiment: base.experiment,
        room: { ...base.room, exerciseDoor: false, nextExerciseDoor: hasNext, prevExerciseDoor: hasPrev },
        controls: base.controls,
        // Os preControls são só os valores INICIAIS (scene.ts os aplica ao abrir
        // a sala). Não forçar aqui: senão a alternativa escolhida pelo estudante
        // seria desfeita e a cena não mostraria a resposta dele.
        toConfig: base.toConfig,
        interactions: base.interactions,
        lockedControls: ex.lockedControls,
        preControls: ex.preControls,
        // "Q1/5 · título": o número da questão aparece no quadro do enunciado e
        // nos painéis flutuantes do enunciado e da Dica.
        enunciado: { heading: `Q${i + 1}/${exercises.length} · ${page.heading ?? ex.titulo}`, text: page.text },
        dica: ex.dica,
        alternativas: ex.tipo === 'alternativas' ? ex.alternativas.map((a) => a.texto) : undefined,
      };
    }
  }
  return result;
}

// Mapeia experimentId → lista de { id, title } em ordem, para scene.ts navegar.
export function buildExerciseMap(
  baseRooms: Record<string, InteractiveRoom>,
): Record<string, Array<{ id: string; title: string }>> {
  const result: Record<string, Array<{ id: string; title: string }>> = {};
  for (const [expId, exercises] of Object.entries(EXERCICIOS_INTERATIVOS)) {
    if (baseRooms[expId]) {
      result[expId] = exercises.map((ex) => ({ id: ex.id, title: ex.titulo }));
    }
  }
  return result;
}
