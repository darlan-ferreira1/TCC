// Descrição DECLARATIVA de controles (ver ARQUITETURA.md, seção 22).
//
// Em vez de cada experimento desenhar seus sliders em JSX, ele descreve os
// controles como dados. Cada hospedeiro decide como exibi-los — hoje o HUD do
// Museu Virtual (museum/ControlsHud.tsx); no futuro, um painel 3D no VR.

export type ControlValue = number | string;
export type ControlValues = Record<string, ControlValue>;

interface BaseControl {
  id: string;
  label: string;
}

export interface RangeControl extends BaseControl {
  kind: 'range';
  min: number;
  max: number;
  step: number;
  unit?: string;
  default: number;
}

export interface SelectControl extends BaseControl {
  kind: 'select';
  options: { value: string; label: string }[];
  default: string;
}

export type ControlDef = RangeControl | SelectControl;

export function defaultValues(controls: ControlDef[]): ControlValues {
  return Object.fromEntries(controls.map((c) => [c.id, c.default]));
}
