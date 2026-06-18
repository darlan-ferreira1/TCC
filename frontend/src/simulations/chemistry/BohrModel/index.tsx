import { useEffect, useRef, useState } from "react";
import { createBohrScene, type BohrScene, type BohrSceneConfig } from "./scene";

// Elementos pré-definidos: [símbolo, nome, prótons, nêutrons, distribuição eletrônica]
const ELEMENTS: [string, string, number, number, number[]][] = [
  ["H",  "Hidrogênio",  1,  0,  [1]],
  ["He", "Hélio",       2,  2,  [2]],
  ["Li", "Lítio",       3,  4,  [2, 1]],
  ["Be", "Berílio",     4,  5,  [2, 2]],
  ["B",  "Boro",        5,  6,  [2, 3]],
  ["C",  "Carbono",     6,  6,  [2, 4]],
  ["N",  "Nitrogênio",  7,  7,  [2, 5]],
  ["O",  "Oxigênio",    8,  8,  [2, 6]],
  ["F",  "Flúor",       9,  10, [2, 7]],
  ["Ne", "Neônio",      10, 10, [2, 8]],
  ["Na", "Sódio",       11, 12, [2, 8, 1]],
  ["Mg", "Magnésio",    12, 12, [2, 8, 2]],
  ["Al", "Alumínio",    13, 14, [2, 8, 3]],
  ["Si", "Silício",     14, 14, [2, 8, 4]],
  ["P",  "Fósforo",     15, 16, [2, 8, 5]],
  ["S",  "Enxofre",     16, 16, [2, 8, 6]],
  ["Cl", "Cloro",       17, 18, [2, 8, 7]],
  ["Ar", "Argônio",     18, 22, [2, 8, 8]],
  ["K",  "Potássio",    19, 20, [2, 8, 8, 1]],
  ["Ca", "Cálcio",      20, 20, [2, 8, 8, 2]],
];

function shellsToString(shells: number[]): string {
  return shells.join(", ");
}

function parseShells(input: string): number[] | null {
  const parts = input.split(",").map((s) => s.trim());
  const nums = parts.map(Number);
  if (nums.some(isNaN) || nums.some((n) => n < 0)) return null;
  return nums;
}

interface Props {
  onBack: () => void;
}

export default function BohrModelSimulation({ onBack }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sceneRef = useRef<BohrScene | null>(null);

  const [selectedIndex, setSelectedIndex] = useState(5); // Carbono por padrão
  const [shellsInput, setShellsInput] = useState("");
  const [inputError, setInputError] = useState(false);
  const [speed, setSpeed] = useState(1.0);

  const element = ELEMENTS[selectedIndex];

  // Inicializa a cena Three.js uma vez
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const [, , protons, neutrons, shells] = ELEMENTS[selectedIndex];
    sceneRef.current = createBohrScene(canvas, { protons, neutrons, shells, speedFactor: speed });
    setShellsInput(shellsToString(shells));
    return () => {
      sceneRef.current?.dispose();
      sceneRef.current = null;
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Quando troca de elemento, atualiza a cena
  function handleElementChange(index: number) {
    setSelectedIndex(index);
    const [, , protons, neutrons, shells] = ELEMENTS[index];
    setShellsInput(shellsToString(shells));
    setInputError(false);
    const cfg: BohrSceneConfig = { protons, neutrons, shells, speedFactor: speed };
    sceneRef.current?.update(cfg);
  }

  // Quando edita a distribuição manualmente
  function handleShellsChange(value: string) {
    setShellsInput(value);
    const parsed = parseShells(value);
    if (!parsed) {
      setInputError(true);
      return;
    }
    setInputError(false);
    const [, , protons, neutrons] = element;
    sceneRef.current?.update({ protons, neutrons, shells: parsed, speedFactor: speed });
  }

  function handleSpeedChange(value: number) {
    setSpeed(value);
    const parsed = parseShells(shellsInput) ?? element[4];
    const [, , protons, neutrons] = element;
    sceneRef.current?.update({ protons, neutrons, shells: parsed, speedFactor: value });
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh", background: "#0a0a1a", color: "#e0e0f0", fontFamily: "Inter, sans-serif" }}>
      {/* Canvas ocupa todo o espaço disponível */}
      <div style={{ flex: 1, position: "relative", minHeight: 0 }}>
        <canvas
          ref={canvasRef}
          style={{ width: "100%", height: "100%", display: "block" }}
        />
        {/* Botão voltar */}
        <button
          onClick={onBack}
          style={{
            position: "absolute", top: 16, right: 20,
            background: "rgba(17,17,48,0.8)",
            border: "1px solid #333366",
            borderRadius: 8,
            color: "#aaa",
            fontSize: 13,
            padding: "6px 14px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: 6,
            backdropFilter: "blur(4px)",
          }}
        >
          ← Voltar
        </button>

        {/* Legenda do elemento sobre o canvas */}
        <div style={{ position: "absolute", top: 16, left: 20, pointerEvents: "none" }}>
          <span style={{ fontSize: 48, fontWeight: 700, color: "#3498db", lineHeight: 1 }}>{element[0]}</span>
          <div style={{ fontSize: 14, color: "#aaa", marginTop: 2 }}>
            {element[1]} · Z={element[2]} · A={element[2] + element[3]}
          </div>
        </div>
      </div>

      {/* Painel de controles em DOM normal, fora do canvas WebGL */}
      <div style={{
        padding: "16px 24px",
        background: "#111130",
        borderTop: "1px solid #222244",
        display: "flex",
        flexWrap: "wrap",
        gap: 20,
        alignItems: "flex-end",
      }}>
        {/* Seletor de elemento */}
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <label style={{ fontSize: 12, color: "#888", letterSpacing: 1 }}>ELEMENTO</label>
          <select
            value={selectedIndex}
            onChange={(e) => handleElementChange(Number(e.target.value))}
            style={{
              background: "#1a1a3a",
              color: "#e0e0f0",
              border: "1px solid #333366",
              borderRadius: 6,
              padding: "6px 10px",
              fontSize: 14,
              cursor: "pointer",
            }}
          >
            {ELEMENTS.map(([symbol, name, protons], i) => (
              <option key={symbol} value={i}>
                {symbol} — {name} (Z={protons})
              </option>
            ))}
          </select>
        </div>

        {/* Distribuição eletrônica manual */}
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <label style={{ fontSize: 12, color: "#888", letterSpacing: 1 }}>
            DISTRIBUIÇÃO ELETRÔNICA (ex: 2, 8, 1)
          </label>
          <input
            type="text"
            value={shellsInput}
            onChange={(e) => handleShellsChange(e.target.value)}
            style={{
              background: "#1a1a3a",
              color: inputError ? "#e74c3c" : "#e0e0f0",
              border: `1px solid ${inputError ? "#e74c3c" : "#333366"}`,
              borderRadius: 6,
              padding: "6px 10px",
              fontSize: 14,
              width: 160,
            }}
          />
          {inputError && (
            <span style={{ fontSize: 11, color: "#e74c3c" }}>Formato inválido</span>
          )}
        </div>

        {/* Velocidade */}
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <label style={{ fontSize: 12, color: "#888", letterSpacing: 1 }}>
            VELOCIDADE: {speed.toFixed(1)}×
          </label>
          <input
            type="range"
            min={0.1}
            max={4}
            step={0.1}
            value={speed}
            onChange={(e) => handleSpeedChange(Number(e.target.value))}
            style={{ width: 140, cursor: "pointer" }}
          />
        </div>

        {/* Legenda de cores */}
        <div style={{ display: "flex", gap: 16, marginLeft: "auto", alignItems: "center" }}>
          {[
            { color: "#e74c3c", label: "Próton" },
            { color: "#95a5a6", label: "Nêutron" },
            { color: "#3498db", label: "Elétron" },
          ].map(({ color, label }) => (
            <div key={label} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13 }}>
              <div style={{ width: 12, height: 12, borderRadius: "50%", background: color }} />
              <span style={{ color: "#aaa" }}>{label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
