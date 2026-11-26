// Marcadores da resposta: objetos que mostram NA CENA a alternativa que o
// estudante escolheu (ver devAlternativas.md). O fenômeno real confirma ou
// desmente a escolha: um "fantasma" que se move no período escolhido sai de
// sincronia com o objeto real se a conta estiver errada.
//
// Convenção: o valor 0 num controle de marcador = marcador desligado.

import * as THREE from 'three';

export const MARCADOR_COR = 0x2ecc71;

// Material translúcido e brilhante dos fantasmas e marcas.
export function ghostMaterial(opacity = 0.45): THREE.MeshStandardMaterial {
  return new THREE.MeshStandardMaterial({
    color: MARCADOR_COR, emissive: MARCADOR_COR, emissiveIntensity: 0.6,
    transparent: true, opacity, depthWrite: false, roughness: 0.4,
  });
}

// Controle escondido padrão para um marcador numérico.
export function marcadorControl(id: string, label: string) {
  return { id, label, kind: 'range' as const, min: -1e9, max: 1e9, step: 1, default: 0, hidden: true };
}
