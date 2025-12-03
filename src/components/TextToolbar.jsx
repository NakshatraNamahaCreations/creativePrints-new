// src/components/TextToolbar.jsx
import React, { useEffect, useState } from "react";
import {
  LuAlignLeft,
  LuAlignCenter,
  LuAlignRight,
  LuAlignJustify,
} from "react-icons/lu";
import { MdOpacity } from "react-icons/md";
import TextStylingPanel from "./TextStylingPanel.jsx";

const FONT_FAMILIES = [
  "Inter",
  "Arial",
  "QT OldGoudy",
  "Times New Roman",
  "Roboto",
];

export default function TextToolbar({
  canvas,
  selectedObject,
  effectStyle,
  shapeStyle,
  onSelectStyle,
  onSelectShape,

  // shadow controls
  shadowColor,
  shadowDistance,
  shadowOpacity,
  shadowAngle,
  shadowBlur,
  onShadowColorChange,
  onShadowDistanceChange,
  onShadowOpacityChange,
  onShadowAngleChange,
  onShadowBlurChange,

  // highlight controls
  highlightColor,
  highlightRoundness,
  highlightSize,
  highlightOpacity,
  onHighlightColorChange,
  onHighlightRoundnessChange,
  onHighlightSizeChange,
  onHighlightOpacityChange,
}) {
  const [fontFamily, setFontFamily] = useState("Inter");
  const [fontSize, setFontSize] = useState(12);
  const [color, setColor] = useState("#000000");
  const [bold, setBold] = useState(false);
  const [align, setAlign] = useState("left");

  const [opacity, setOpacity] = useState(1);
  const [showOpacityPanel, setShowOpacityPanel] = useState(false);
  const [showEffectsPanel, setShowEffectsPanel] = useState(false);

  // sync toolbar when selection changes
  useEffect(() => {
    if (
      !selectedObject ||
      !["text", "textbox", "i-text"].includes(selectedObject.type)
    )
      return;

    setFontFamily(selectedObject.fontFamily || "Inter");
    setFontSize(selectedObject.fontSize || 12);
    setColor(selectedObject.fill || "#000000");
    setBold(
      selectedObject.fontWeight === "bold" ||
        selectedObject.fontWeight === 700
    );
    setAlign(selectedObject.textAlign || "left");

    setOpacity(
      typeof selectedObject.opacity === "number" ? selectedObject.opacity : 1
    );
  }, [selectedObject]);

  const updateText = (props) => {
    if (!canvas || !selectedObject) return;
    selectedObject.set(props);
    canvas.fire("object:modified");
    canvas.requestRenderAll();
  };

  const handleFontChange = (e) => {
    const value = e.target.value;
    setFontFamily(value);
    updateText({ fontFamily: value });
  };

  const handleSizeChange = (value) => {
    const size = Number(value) || 1;
    setFontSize(size);
    updateText({ fontSize: size });
  };

  const handleColorChange = (e) => {
    const value = e.target.value;
    setColor(value);
    updateText({ fill: value });
  };

  const toggleBold = () => {
    const newBold = !bold;
    setBold(newBold);
    updateText({ fontWeight: newBold ? "bold" : "normal" });
  };

  const setAlignment = (value) => {
    setAlign(value);
    updateText({ textAlign: value });
  };

  const handleOpacityChange = (percentValue) => {
    const pct = Number(percentValue);
    const o = Math.min(1, Math.max(0, pct / 100));
    setOpacity(o);
    updateText({ opacity: o });
  };

  const resetOpacity = () => {
    setOpacity(1);
    updateText({ opacity: 1 });
  };

  if (
    !selectedObject ||
    !["text", "textbox", "i-text"].includes(selectedObject.type)
  ) {
    return null;
  }

  const opacityPercent = Math.round(opacity * 100);

  const handleStyleClick = (style) => {
    onSelectStyle && onSelectStyle(style);
  };

  const handleShapeClick = (shape) => {
    onSelectShape && onSelectShape(shape);
  };

  return (
    <div
      style={{
        display: "flex",
        gap: 10,
        padding: "8px 14px",
        background: "rgba(255,255,255,0.92)",
        borderRadius: 9999,
        alignItems: "center",
        boxShadow: "0 18px 45px rgba(15,23,42,0.25)",
        border: "1px solid rgba(148,163,184,0.4)",
        backdropFilter: "blur(18px)",
        WebkitBackdropFilter: "blur(18px)",
        position: "relative",
      }}
    >
      {/* Font family */}
      <select
        value={fontFamily}
        onChange={handleFontChange}
        style={{
          padding: "4px 8px",
          borderRadius: 9999,
          border: "1px solid #e5e7eb",
          fontSize: 12,
          outline: "none",
          background: "white",
        }}
      >
        {FONT_FAMILIES.map((font) => (
          <option key={font} value={font}>
            {font}
          </option>
        ))}
      </select>

      {/* Font size with - / + */}
      <button
        type="button"
        onClick={() => handleSizeChange(Math.max(4, fontSize - 1))}
        style={{
          padding: "2px 6px",
          borderRadius: 9999,
          border: "1px solid #e5e7eb",
          background: "#ffffff",
          cursor: "pointer",
        }}
      >
        −
      </button>
      <input
        type="number"
        value={fontSize}
        onChange={(e) => handleSizeChange(e.target.value)}
        style={{
          width: 50,
          padding: "2px 6px",
          borderRadius: 9999,
          border: "1px solid #e5e7eb",
          textAlign: "center",
          fontSize: 12,
          outline: "none",
        }}
      />
      <button
        type="button"
        onClick={() => handleSizeChange(fontSize + 1)}
        style={{
          padding: "2px 6px",
          borderRadius: 9999,
          border: "1px solid #e5e7eb",
          background: "#ffffff",
          cursor: "pointer",
        }}
      >
        +
      </button>

      {/* Text color */}
      <input
        type="color"
        value={color}
        onChange={handleColorChange}
        style={{
          width: 26,
          height: 26,
          borderRadius: "50%",
          border: "1px solid #d1d5db",
          padding: 0,
          overflow: "hidden",
          cursor: "pointer",
        }}
      />

      {/* Bold */}
      <button
        type="button"
        onClick={toggleBold}
        style={{
          fontWeight: 700,
          borderRadius: 6,
          border: "1px solid " + (bold ? "#111" : "#e5e7eb"),
          background: bold ? "#111827" : "#ffffff",
          color: bold ? "#fff" : "#111827",
          padding: "2px 8px",
          cursor: "pointer",
          fontSize: 12,
        }}
      >
        B
      </button>

      {/* Alignment buttons */}
      <div
        style={{
          display: "flex",
          gap: 4,
          padding: 2,
          borderRadius: 9999,
          border: "1px solid #e5e7eb",
          background: "#ffffff",
        }}
      >
        <IconButton
          active={align === "left"}
          onClick={() => setAlignment("left")}
          title="Align left"
        >
          <LuAlignLeft size={18} />
        </IconButton>
        <IconButton
          active={align === "center"}
          onClick={() => setAlignment("center")}
          title="Align center"
        >
          <LuAlignCenter size={18} />
        </IconButton>
        <IconButton
          active={align === "right"}
          onClick={() => setAlignment("right")}
          title="Align right"
        >
          <LuAlignRight size={18} />
        </IconButton>
        <IconButton
          active={align === "justify"}
          onClick={() => setAlignment("justify")}
          title="Justify"
        >
          <LuAlignJustify size={18} />
        </IconButton>
      </div>

      {/* OPACITY TRIGGER BUTTON (whole text) */}
      <button
        type="button"
        onClick={() => {
          setShowOpacityPanel((v) => !v);
          setShowEffectsPanel(false);
        }}
        style={{
          marginLeft: 8,
          borderRadius: 9999,
          border: "1px solid #e5e7eb",
          padding: 6,
          background: "#ffffff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
        }}
        aria-label="Opacity"
      >
        <MdOpacity size={18} />
      </button>

      {/* EFFECTS BUTTON */}
      <button
        type="button"
        onClick={() => {
          setShowEffectsPanel((v) => !v);
          setShowOpacityPanel(false);
        }}
        style={{
          marginLeft: 4,
          borderRadius: 9999,
          border: "1px solid #e5e7eb",
          padding: "6px 10px",
          background: "#ffffff",
          fontSize: 12,
          cursor: "pointer",
        }}
      >
        Effects
      </button>

      {/* OPACITY PANEL */}
      {showOpacityPanel && (
        <div
          style={{
            position: "absolute",
            top: 52,
            right: 0,
            padding: 12,
            background: "#ffffff",
            borderRadius: 12,
            boxShadow: "0 10px 30px rgba(15,23,42,0.25)",
            border: "1px solid rgba(148,163,184,0.4)",
            width: 230,
            zIndex: 9999,
          }}
        >
          <div
            style={{
              fontSize: 12,
              fontWeight: 600,
              marginBottom: 8,
            }}
          >
            Opacity
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <input
              type="range"
              min={0}
              max={100}
              value={opacityPercent}
              onChange={(e) => handleOpacityChange(e.target.value)}
              style={{ flex: 1 }}
            />

            <button
              type="button"
              onClick={resetOpacity}
              style={{
                borderRadius: 9999,
                border: "1px solid #e5e7eb",
                padding: "4px 6px",
                background: "#f9fafb",
                cursor: "pointer",
                fontSize: 11,
              }}
              title="Reset opacity"
            >
              ↺
            </button>

            <input
              type="number"
              min={0}
              max={100}
              value={opacityPercent}
              onChange={(e) => {
                const v = Math.min(100, Math.max(0, Number(e.target.value)));
                handleOpacityChange(v);
              }}
              style={{
                width: 48,
                padding: "3px 4px",
                borderRadius: 6,
                border: "1px solid #e5e7eb",
                fontSize: 11,
                textAlign: "center",
              }}
            />
          </div>
        </div>
      )}

      {/* EFFECTS PANEL POPUP (Shadow / Highlight / Echo / Glitch / Shape) */}
      {showEffectsPanel && (
        <TextStylingPanel
          effectStyle={effectStyle}
          shapeStyle={shapeStyle}
          onSelectStyle={handleStyleClick}
          onSelectShape={handleShapeClick}
          shadowColor={shadowColor}
          shadowDistance={shadowDistance}
          shadowOpacity={shadowOpacity}
          shadowAngle={shadowAngle}
          shadowBlur={shadowBlur}
          onShadowColorChange={onShadowColorChange}
          onShadowDistanceChange={onShadowDistanceChange}
          onShadowOpacityChange={onShadowOpacityChange}
          onShadowAngleChange={onShadowAngleChange}
          onShadowBlurChange={onShadowBlurChange}
          highlightColor={highlightColor}
          highlightRoundness={highlightRoundness}
          highlightSize={highlightSize}
          highlightOpacity={highlightOpacity}
          onHighlightColorChange={onHighlightColorChange}
          onHighlightRoundnessChange={onHighlightRoundnessChange}
          onHighlightSizeChange={onHighlightSizeChange}
          onHighlightOpacityChange={onHighlightOpacityChange}
        />
      )}
    </div>
  );
}

function IconButton({ active, onClick, title, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      style={{
        borderRadius: 9999,
        border: "none",
        padding: "4px 6px",
        background: active ? "#111827" : "transparent",
        color: active ? "#ffffff" : "#4b5563",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
      }}
    >
      {children}
    </button>
  );
}
