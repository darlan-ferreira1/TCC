// Portas do salão de entrada que levam direto a uma sala (sem ala).
// No CLARA.js estas portas eram geradas do registro de experimentos da
// Galeria; aqui a lista é fixa. Para tirar uma porta, apague a linha.
// As portas das alas temáticas (Mecânica, Modelos Atômicos) ficam em alas.ts.

export interface HallDoor {
  id: string;
  title: string;
  category: string;
  color: number;
  folder: string; // pasta em src/simulations/ que tem o sala.ts
}

const COR = { Física: 0x9b59b6, Química: 0x3498db, Biologia: 0x2ecc71 };

export const HALL_DOORS: HallDoor[] = [
  { id: 'bohr-model',         title: 'Modelo de Bohr',       category: 'Química',  color: COR.Química,  folder: 'chemistry/BohrModel' },
  { id: 'molecular-geometry', title: 'Geometria Molecular',  category: 'Química',  color: COR.Química,  folder: 'chemistry/MolecularGeometry' },
  { id: 'simple-pendulum',    title: 'Pêndulo Simples',      category: 'Física',   color: COR.Física,   folder: 'physics/Pendulum' },
  { id: 'dna-helix',          title: 'Dupla Hélice de DNA',  category: 'Biologia', color: COR.Biologia, folder: 'biology/DnaHelix' },
];
