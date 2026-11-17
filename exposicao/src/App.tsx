// A exposição abre direto no ambiente 3D: não há galeria nem outras páginas.
// Tema escuro fixo (o index.css também tem o tema claro, classe .light no <html>).
import VirtualMuseum from './museum/index';

export default function App() {
  return <VirtualMuseum theme="dark" />;
}
