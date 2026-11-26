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

// Sem portas avulsas no salão: o estudante começa direto na Ala da Mecânica.
export const HALL_DOORS: HallDoor[] = [];
