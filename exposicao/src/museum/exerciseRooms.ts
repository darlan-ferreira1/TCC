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
      result[ex.id] = {
        experiment: base.experiment,
        room: { ...base.room, exerciseDoor: false, nextExerciseDoor: hasNext },
        controls: base.controls,
        toConfig(values) {
          return base.toConfig({ ...values, ...ex.preControls });
        },
        interactions: base.interactions,
        lockedControls: ex.lockedControls,
        preControls: ex.preControls,
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
