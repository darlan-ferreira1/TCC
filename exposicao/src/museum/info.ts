// Textos informativos do Museu Virtual (ícones "i", quadros e pedestais).
//
// O texto é mostrado num pop-up paginado (InfoPopup.tsx): o estudante passa as
// páginas com as setas sem sair do museu (no ECOS, cada quadro abria outra
// página do site).

export interface InfoPage {
  heading?: string;
  text: string;
}

export interface InfoContent {
  title: string;
  pages: InfoPage[];
}

// Conteúdo de uma sala (chave: id da porta).
export interface RoomContent {
  resumo: InfoContent;   // "i" do pedestal da ala (o que é esta sala)
  observar: InfoContent; // "i" ao lado do experimento (o que fazer aqui)
  quadros: InfoContent[]; // quadros da sala (Teoria, História…)
}
