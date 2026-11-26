// Avisos da questão por cima da cena. Não há mais barra no topo: o estudante
// faz tudo andando pela sala (iniciar no "i" verde, Dica no "?" amarelo,
// "Próxima questão" e saída pelas portas).

interface Props {
  successToast: string | null; // acertou: feedback da questão
  erroToast: string | null;    // alternativa errada: o que deu errado + "tente outra"
}

const toastBase: React.CSSProperties = {
  position: 'absolute', top: 'calc(16px + env(safe-area-inset-top, 0px))', left: '50%', transform: 'translateX(-50%)',
  borderRadius: 10, padding: '10px 18px', fontSize: 14, fontWeight: 600,
  fontFamily: 'Inter, sans-serif',
  zIndex: 25, maxWidth: 'calc(100vw - 32px)', textAlign: 'center',
  boxShadow: '0 4px 20px rgba(0,0,0,0.5)', pointerEvents: 'none',
  whiteSpace: 'pre-wrap',
};

export default function ExerciseHud({ successToast, erroToast }: Props) {
  return (
    <>
      {successToast && (
        <div style={{ ...toastBase, background: '#0f2f0f', border: '1px solid #27ae60', color: '#7dff9e' }}>
          ✓ {successToast}
          {'\n'}
          <span style={{ fontWeight: 500, fontSize: 13, color: '#b8f5c8' }}>A porta "Próxima questão" foi liberada.</span>
        </div>
      )}
      {erroToast && (
        <div style={{ ...toastBase, background: '#2f0f0f', border: '1px solid #c0392b', color: '#ffb3a7' }}>
          ✗ {erroToast}
        </div>
      )}
    </>
  );
}
