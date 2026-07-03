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
  theme: 'dark' | 'light';
}

export default function BohrModelSimulation({ onBack, theme }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sceneRef = useRef<BohrScene | null>(null);

  const [selectedIndex, setSelectedIndex] = useState(5); // Carbono por padrão
  const [shellsInput, setShellsInput] = useState("");
  const [inputError, setInputError] = useState(false);
  const [speed, setSpeed] = useState(1.0);

  const element = ELEMENTS[selectedIndex];

  const dark = theme === 'dark';
  const c = {
    bg:          dark ? "#0a0a1a"             : "#f0f0f8",
    text:        dark ? "#e0e0f0"             : "#1a1a2e",
    muted:       dark ? "#aaa"                : "#555",
    label:       dark ? "#888"                : "#666",
    panelBg:     dark ? "#111130"             : "#e0e0ef",
    panelBorder: dark ? "#222244"             : "#c0c0d8",
    btnBg:       dark ? "rgba(17,17,48,0.8)" : "rgba(240,240,250,0.85)",
    btnBorder:   dark ? "#333366"             : "#9999cc",
    inputBg:     dark ? "#1a1a3a"             : "#f8f8ff",
    inputBorder: dark ? "#333366"             : "#9999cc",
    sceneBg:     dark ? 0x0a0a1a             : 0xf0f0f8,
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const [, , protons, neutrons, shells] = ELEMENTS[selectedIndex];
    sceneRef.current = createBohrScene(canvas, { protons, neutrons, shells, speedFactor: speed }, c.sceneBg);
    setShellsInput(shellsToString(shells));
    return () => {
      sceneRef.current?.dispose();
      sceneRef.current = null;
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [theme]);

  function handleElementChange(index: number) {
    setSelectedIndex(index);
    const [, , protons, neutrons, shells] = ELEMENTS[index];
    setShellsInput(shellsToString(shells));
    setInputError(false);
    const cfg: BohrSceneConfig = { protons, neutrons, shells, speedFactor: speed };
    sceneRef.current?.update(cfg);
  }

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
    <div style={{ display: "flex", flexDirection: "column", height: "100vh", background: c.bg, color: c.text, fontFamily: "Inter, sans-serif" }}>
      <div style={{ flex: 1, position: "relative", minHeight: 0 }}>
        <canvas ref={canvasRef} style={{ width: "100%", height: "100%", display: "block" }} />
        <button
          onClick={onBack}
          style={{
            position: "absolute", top: 16, right: 20,
            background: c.btnBg,
            border: `1px solid ${c.btnBorder}`,
            borderRadius: 8,
            color: c.muted,
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

        <div style={{ position: "absolute", top: 16, left: 20, pointerEvents: "none" }}>
          <span style={{ fontSize: 48, fontWeight: 700, color: "#3498db", lineHeight: 1 }}>{element[0]}</span>
          <div style={{ fontSize: 14, color: c.muted, marginTop: 2 }}>
            {element[1]} · Z={element[2]} · A={element[2] + element[3]}
          </div>
        </div>
      </div>

      <div style={{
        padding: "16px 24px",
        background: c.panelBg,
        borderTop: `1px solid ${c.panelBorder}`,
        display: "flex",
        flexWrap: "wrap",
        gap: 20,
        alignItems: "flex-end",
      }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <label style={{ fontSize: 12, color: c.label, letterSpacing: 1 }}>ELEMENTO</label>
          <select
            value={selectedIndex}
            onChange={(e) => handleElementChange(Number(e.target.value))}
            style={{
              background: c.inputBg,
              color: c.text,
              border: `1px solid ${c.inputBorder}`,
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

        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <label style={{ fontSize: 12, color: c.label, letterSpacing: 1 }}>
            DISTRIBUIÇÃO ELETRÔNICA (ex: 2, 8, 1)
          </label>
          <input
            type="text"
            value={shellsInput}
            onChange={(e) => handleShellsChange(e.target.value)}
            style={{
              background: c.inputBg,
              color: inputError ? "#e74c3c" : c.text,
              border: `1px solid ${inputError ? "#e74c3c" : c.inputBorder}`,
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

        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <label style={{ fontSize: 12, color: c.label, letterSpacing: 1 }}>
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

        <div style={{ display: "flex", gap: 16, marginLeft: "auto", alignItems: "center" }}>
          {[
            { color: "#e74c3c", label: "Próton" },
            { color: "#95a5a6", label: "Nêutron" },
            { color: "#3498db", label: "Elétron" },
          ].map(({ color, label }) => (
            <div key={label} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13 }}>
              <div style={{ width: 12, height: 12, borderRadius: "50%", background: color }} />
              <span style={{ color: c.muted }}>{label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
