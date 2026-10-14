import React from "react";

function AccessibilityControls({
  fontSize,
  setFontSize,
  highContrast,
  setHighContrast,
  simpleLanguage,
  setSimpleLanguage,
  onReadAloud,
}) {
  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: "12px",
        padding: "18px",
        marginBottom: "20px",
        background: highContrast ? "#000" : "#f8f9fc",
        border: highContrast ? "2px solid #fff" : "1px solid #ddd",
        borderRadius: "14px",
      }}
    >
      <button
        onClick={() => setFontSize(fontSize + 2)}
        style={{
          padding: "10px 14px",
          borderRadius: "8px",
          cursor: "pointer",
        }}
      >
        🔠 Increase Text
      </button>

      <button
        onClick={() => setFontSize(Math.max(14, fontSize - 2))}
        style={{
          padding: "10px 14px",
          borderRadius: "8px",
          cursor: "pointer",
        }}
      >
        🔡 Decrease Text
      </button>

      <button
        onClick={() => setHighContrast(!highContrast)}
        style={{
          padding: "10px 14px",
          borderRadius: "8px",
          cursor: "pointer",
        }}
      >
        🌓 High Contrast
      </button>

      <button
        onClick={() => setSimpleLanguage(!simpleLanguage)}
        style={{
          padding: "10px 14px",
          borderRadius: "8px",
          cursor: "pointer",
        }}
      >
        🧠 Simple Language
      </button>

      <button
        onClick={onReadAloud}
        style={{
          padding: "10px 14px",
          borderRadius: "8px",
          cursor: "pointer",
        }}
      >
        🔊 Read Aloud
      </button>
    </div>
  );
}

export default AccessibilityControls;