// src/components/TextToolbar.jsx
import React, { useEffect, useState } from "react";
import {
  LuAlignLeft,
  LuAlignCenter,
  LuAlignRight,
  LuAlignJustify,
} from "react-icons/lu";
import { MdOpacity } from "react-icons/md";
import { FaArrowsAltH, FaArrowsAltV } from "react-icons/fa";
import { FiMoreHorizontal, FiCopy, FiTrash2, FiRotateCw } from "react-icons/fi";
import TextStylingPanel from "./TextStylingPanel.jsx";
import { MdFlip } from "react-icons/md";
const FONT_FAMILIES = [
  "Inter",
  "Arial",
  "QT OldGoudy",
  "Times New Roman",
  "Roboto",
];

function toTitleCase(str) {
  if (!str) return str;
  return str
    .split(" ")
    .map((w) => (w.length ? w[0].toUpperCase() + w.slice(1).toLowerCase() : w))
    .join(" ");
}

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

  glitchPreset,
  glitchAngle,
  glitchOffset,
  onGlitchPresetChange,
  onGlitchAngleChange,
  onGlitchOffsetChange,

  closeEffectsPanel,
  onEffectsPanelClosed,

  echoSteps,
  onEchoStepsChange,

  // optional parent-provided spacing defaults / callbacks
  lineSpacing = undefined,
  letterSpacing = undefined,
  onLineSpacingChange,
  onLetterSpacingChange,
}) {
  const [fontFamily, setFontFamily] = useState("Inter");
  const [fontSize, setFontSize] = useState(12);
  const [color, setColor] = useState("#000000");
  const [bold, setBold] = useState(false);
  const [align, setAlign] = useState("left");

  // CASE state
  const [showCasePanel, setShowCasePanel] = useState(false);
  const [caseMode, setCaseMode] = useState(null); // "upper"|"lower"|"title"|null

  const [opacity, setOpacity] = useState(1);
  const [showOpacityPanel, setShowOpacityPanel] = useState(false);
  const [showEffectsPanel, setShowEffectsPanel] = useState(false);

  // spacing UI
  const [showSpacingPanel, setShowSpacingPanel] = useState(false);
  const [localLineSpacing, setLocalLineSpacing] = useState(lineSpacing ?? 1.9);
  const [localLetterSpacing, setLocalLetterSpacing] = useState(
    letterSpacing ?? 0.71
  );

  // rotation UI (popovers)
  const [showRotationPanel, setShowRotationPanel] = useState(false);
  const [rotation, setRotation] = useState(0);

  // flip + more menus
  const [showFlipPanel, setShowFlipPanel] = useState(false);
  const [showMorePanel, setShowMorePanel] = useState(false);

  // sync toolbar when selection changes
  useEffect(() => {
    if (
      !selectedObject ||
      !["text", "textbox", "i-text", "group", "pathGroup"].includes(
        selectedObject.type
      )
    )
      return;

    setFontFamily(selectedObject.fontFamily || "Inter");
    setFontSize(selectedObject.fontSize || 12);
    setColor(selectedObject.fill || "#000000");
    setBold(
      selectedObject.fontWeight === "bold" || selectedObject.fontWeight === 700
    );
    setAlign(selectedObject.textAlign || "left");

    setOpacity(
      typeof selectedObject.opacity === "number" ? selectedObject.opacity : 1
    );

    // line/letter spacing sync (Fabric stores charSpacing in thousandths)
    setLocalLineSpacing(
      typeof selectedObject.lineHeight === "number"
        ? selectedObject.lineHeight
        : lineSpacing ?? 1.9
    );
    setLocalLetterSpacing(
      typeof selectedObject.charSpacing === "number"
        ? selectedObject.charSpacing / 1000
        : letterSpacing ?? 0.71
    );

    // rotation sync (angle property)
    const angle = typeof selectedObject.angle === "number" ? selectedObject.angle : 0;
    setRotation(Math.round(angle));

    // clear case mode (optional UX)
    setCaseMode(null);

    // close panels when selection changes (a friendly UX touch)
    setShowFlipPanel(false);
    setShowMorePanel(false);
    setShowRotationPanel(false);
  }, [selectedObject, lineSpacing, letterSpacing, canvas]);

  // handle parent request to close effects panel
  useEffect(() => {
    if (closeEffectsPanel) {
      setShowEffectsPanel(false);
      onEffectsPanelClosed && onEffectsPanelClosed();
    }
  }, [closeEffectsPanel, onEffectsPanelClosed]);

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

  // ------------------ Case functionality ------------------
  const applyCaseToSelected = (mode) => {
    if (!canvas || !selectedObject) return;

    const transform = (text) => {
      if (typeof text !== "string") return text;
      if (mode === "upper") return text.toUpperCase();
      if (mode === "lower") return text.toLowerCase();
      if (mode === "title") return toTitleCase(text);
      return text;
    };

    const setTextValue = (obj) => {
      if (!obj || typeof obj.text !== "string") return false;
      const newText = transform(obj.text);
      if (newText !== obj.text) {
        obj.set({ text: newText });
        return true;
      }
      return false;
    };

    if (["group", "pathGroup"].includes(selectedObject.type)) {
      const children = typeof selectedObject.getObjects === "function"
        ? selectedObject.getObjects()
        : [];
      let updated = false;
      children.forEach((child) => {
        if (["text", "textbox", "i-text"].includes(child.type)) {
          const did = setTextValue(child);
          if (did) updated = true;
        }
      });

      if (updated) {
        canvas.requestRenderAll();
        canvas.fire("object:modified");
      } else if (selectedObject.data?.sourceText && typeof selectedObject.data.sourceText.text === "string") {
        // fallback update for curved group that stores original text
        selectedObject.data.sourceText.text = transform(selectedObject.data.sourceText.text);
        canvas.requestRenderAll();
        canvas.fire("object:modified");
      }
      return;
    }

    if (["text", "textbox", "i-text"].includes(selectedObject.type)) {
      const changed = setTextValue(selectedObject);
      if (changed) {
        canvas.fire("object:modified");
        canvas.requestRenderAll();
      }
    }
  };

  // ------------------ Spacing helpers ------------------
  const applySpacingToSelected = ({ lineHeight, letter }) => {
    if (!canvas || !selectedObject) return;

    const setTextProps = (obj) => {
      const props = {};
      if (typeof lineHeight === "number") props.lineHeight = lineHeight;
      if (typeof letter === "number")
        props.charSpacing = Math.round(Number(letter) * 1000);
      if (Object.keys(props).length) {
        obj.set(props);
      }
    };

    if (selectedObject.type === "group" || selectedObject.type === "pathGroup") {
      selectedObject.getObjects().forEach((child) => {
        if (["text", "i-text", "textbox"].includes(child.type)) {
          setTextProps(child);
        }
      });
      canvas.requestRenderAll();
      return;
    }

    setTextProps(selectedObject);
    canvas.fire("object:modified");
    canvas.requestRenderAll();
  };

  const handleLineSpacingChange = (v) => {
    const n = Number(v);
    setLocalLineSpacing(n);
    onLineSpacingChange && onLineSpacingChange(n);
    applySpacingToSelected({ lineHeight: n });
  };

  const handleLetterSpacingChange = (v) => {
    const n = Number(v);
    setLocalLetterSpacing(n);
    onLetterSpacingChange && onLetterSpacingChange(n);
    applySpacingToSelected({ letter: n });
  };

  const resetLineSpacing = () => handleLineSpacingChange(lineSpacing ?? 1.9);
  const resetLetterSpacing = () =>
    handleLetterSpacingChange(letterSpacing ?? 0.71);

  // ------------------ Rotation controls ------------------
  const applyRotationToSelected = (angle) => {
    if (!canvas || !selectedObject) return;
    const a = Number(angle) || 0;
    selectedObject.set({ angle: a });
    canvas.fire("object:modified");
    canvas.requestRenderAll();
    setRotation(Math.round(a));
  };

  const handleRotationSlider = (val) => {
    const n = Number(val) || 0;
    setRotation(n);
    applyRotationToSelected(n);
  };

  const resetRotation = () => {
    setRotation(0);
    applyRotationToSelected(0);
  };

  // ------------------ Flip (vertical / horizontal) ------------------
  const applyFlip = (dir) => {
    if (!canvas || !selectedObject) return;

    const toggleFlipOnObj = (obj) => {
      if (!obj) return;
      if (dir === "horizontal") obj.set("flipX", !obj.flipX);
      if (dir === "vertical") obj.set("flipY", !obj.flipY);
    };

    if (["group", "pathGroup"].includes(selectedObject.type)) {
      selectedObject.getObjects().forEach((child) => {
        toggleFlipOnObj(child);
      });
      // also flip group container
      toggleFlipOnObj(selectedObject);
    } else {
      toggleFlipOnObj(selectedObject);
    }

    canvas.fire("object:modified");
    canvas.requestRenderAll();
    setShowFlipPanel(false);
  };

  // ------------------ Duplicate / Delete ------------------
  const duplicateSelection = () => {
    if (!canvas || !selectedObject) return;
    // prefer clone API
    if (typeof selectedObject.clone === "function") {
      selectedObject.clone((cloned) => {
        const left = (selectedObject.left || 0) + 16;
        const top = (selectedObject.top || 0) + 16;
        cloned.set({ left, top, evented: true });
        canvas.add(cloned);
        canvas.setActiveObject(cloned);
        canvas.requestRenderAll();
      });
      setShowMorePanel(false);
      return;
    }

    // fallback JSON method
    try {
      const objJSON = selectedObject.toJSON();
      if (objJSON.left == null) objJSON.left = (selectedObject.left || 0) + 16;
      else objJSON.left = objJSON.left + 16;
      if (objJSON.top == null) objJSON.top = (selectedObject.top || 0) + 16;
      else objJSON.top = objJSON.top + 16;

      const minimal = { objects: [objJSON] };
      canvas.loadFromJSON(minimal, () => {
        const objs = canvas.getObjects();
        const newObj = objs[objs.length - 1];
        if (newObj) {
          canvas.setActiveObject(newObj);
        }
        canvas.requestRenderAll();
      });
    } catch (e) {
      console.warn("duplicateSelection fallback failed:", e);
    }
    setShowMorePanel(false);
  };

  const deleteSelection = () => {
    if (!canvas || !selectedObject) return;
    try {
      canvas.remove(selectedObject);
      canvas.discardActiveObject();
      canvas.requestRenderAll();
    } catch (e) {
      console.error("delete failed", e);
    }
    setShowMorePanel(false);
  };

  // Guard: if no valid selection, don't render
  if (!selectedObject) return null;
  if (!["text", "textbox", "i-text", "group", "pathGroup"].includes(selectedObject.type)) {
    return null;
  }

  const opacityPercent = Math.round(opacity * 100);

  const caseButtonBase = {
    flex: 1,
    padding: "6px 8px",
    borderRadius: 8,
    border: "1px solid #e5e7eb",
    cursor: "pointer",
    transition: "background .12s, color .12s, border-color .12s",
  };

  function getCaseButtonStyle(mode) {
    if (caseMode === mode) {
      return {
        ...caseButtonBase,
        border: "1px solid #111827",
        background: "#111827",
        color: "#fff",
      };
    }
    return {
      ...caseButtonBase,
      background: "#f9fafb",
      color: "#111827",
    };
  }

  const handleStyleClick = (style) => {
    onSelectStyle && onSelectStyle(style);
  };

  const handleShapeClick = (shape) => {
    onSelectShape && onSelectShape(shape);
  };

  // Inline SVG rotate icon (kept for look) - optional: can swap to FiRotateCw
  const RotateSvg = ({ size = 18 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M21 12a9 9 0 10-2.39 6.02" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M21 3v6h-6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );

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
          setShowSpacingPanel(false);
          setShowCasePanel(false);
          setShowRotationPanel(false);
          setShowFlipPanel(false);
          setShowMorePanel(false);
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

      {/* CASE BUTTON */}
      <button
        type="button"
        onClick={() => {
          setShowCasePanel((v) => !v);
          setShowEffectsPanel(false);
          setShowOpacityPanel(false);
          setShowSpacingPanel(false);
          setShowRotationPanel(false);
          setShowFlipPanel(false);
          setShowMorePanel(false);
        }}
        style={{
          marginLeft: 6,
          borderRadius: 9999,
          border: "1px solid #e5e7eb",
          padding: "6px 10px",
          background: "#ffffff",
          fontSize: 12,
          cursor: "pointer",
        }}
        title="Case"
      >
        Aa
      </button>

      {/* ROTATE BUTTON (opens rotation popover) */}
      <button
        type="button"
        onClick={() => {
          setShowRotationPanel((s) => !s);
          // when opening, close others
          if (!showRotationPanel) {
            setShowOpacityPanel(false);
            setShowEffectsPanel(false);
            setShowSpacingPanel(false);
            setShowCasePanel(false);
            setShowFlipPanel(false);
            setShowMorePanel(false);
          }
        }}
        style={{
          marginLeft: 6,
          borderRadius: 9999,
          border: showRotationPanel ? "1px solid #111827" : "1px solid #e5e7eb",
          padding: "8px",
          background: showRotationPanel ? "#111827" : "#ffffff",
          color: showRotationPanel ? "#fff" : "#111827",
          fontSize: 12,
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
        title="Rotate"
      >
        <FiRotateCw size={16} aria-hidden="true" />
      </button>

      {/* FLIP BUTTON */}
      <button
        type="button"
        onClick={() => {
          setShowFlipPanel((v) => !v);
          setShowCasePanel(false);
          setShowRotationPanel(false);
          setShowMorePanel(false);
          setShowOpacityPanel(false);
          setShowEffectsPanel(false);
          setShowSpacingPanel(false);
        }}
        style={{
          marginLeft: 6,
          borderRadius: 9999,
          border: "1px solid #e5e7eb",
          padding: "6px 10px",
          background: "#ffffff",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          gap: 6,
        }}
        title="Flip"
        aria-haspopup="true"
        aria-expanded={showFlipPanel}
      >
        <MdFlip size={16} aria-hidden="true" />
      </button>

      {/* MORE (duplicate / delete) */}
      <button
        type="button"
        onClick={() => {
          setShowMorePanel((v) => !v);
          setShowCasePanel(false);
          setShowRotationPanel(false);
          setShowFlipPanel(false);
          setShowOpacityPanel(false);
          setShowEffectsPanel(false);
          setShowSpacingPanel(false);
        }}
        style={{
          marginLeft: 6,
          borderRadius: 9999,
          border: "1px solid #e5e7eb",
          padding: "6px 10px",
          background: "#ffffff",
          cursor: "pointer",
        }}
        title="More"
        aria-haspopup="true"
        aria-expanded={showMorePanel}
      >
        <FiMoreHorizontal size={18} aria-hidden="true" />
      </button>

      {/* CASE PANEL */}
      {showCasePanel && (
        <div
          style={{
            position: "absolute",
            top: 52,
            right: 0,
            padding: 10,
            background: "#ffffff",
            borderRadius: 12,
            boxShadow: "0 10px 30px rgba(15,23,42,0.12)",
            border: "1px solid rgba(148,163,184,0.18)",
            width: 220,
            zIndex: 9999,
          }}
        >
          <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 8 }}>
            Case
          </div>

          <div style={{ display: "flex", gap: 8 }}>
            <button
              onClick={() => {
                applyCaseToSelected("title");
                setCaseMode("title");
                setShowCasePanel(false);
              }}
              style={getCaseButtonStyle("title")}
              title="Title Case"
            >
              Aa
            </button>

            <button
              onClick={() => {
                applyCaseToSelected("lower");
                setCaseMode("lower");
                setShowCasePanel(false);
              }}
              style={getCaseButtonStyle("lower")}
              title="lowercase"
            >
              a↓
            </button>

            <button
              onClick={() => {
                applyCaseToSelected("upper");
                setCaseMode("upper");
                setShowCasePanel(false);
              }}
              style={getCaseButtonStyle("upper")}
              title="UPPERCASE"
            >
              A↑
            </button>
          </div>

    
        </div>
      )}

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
          <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 8 }}>
            Opacity
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
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

      {/* SPACING PANEL */}
      {showSpacingPanel && (
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
            width: 300,
            zIndex: 9999,
          }}
        >
          <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 8 }}>
            Line spacing
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              marginBottom: 12,
            }}
          >
            <input
              type="range"
              min={0}
              max={3}
              step={0.1}
              value={localLineSpacing}
              onChange={(e) => handleLineSpacingChange(e.target.value)}
              style={{ flex: 1 }}
            />
            <button
              onClick={resetLineSpacing}
              style={{
                borderRadius: 9999,
                padding: "6px",
                border: "1px solid #e5e7eb",
                background: "#f9fafb",
                cursor: "pointer",
              }}
              title="Reset line spacing"
            >
              ↺
            </button>
            <input
              type="number"
              step={0.1}
              min={0}
              max={3}
              value={localLineSpacing}
              onChange={(e) => handleLineSpacingChange(e.target.value)}
              style={{
                width: 60,
                padding: "3px 6px",
                borderRadius: 6,
                border: "1px solid #e5e7eb",
              }}
            />
          </div>

          <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 8 }}>
            Letter spacing
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <input
              type="range"
              min={-0.2}
              max={1.5}
              step={0.01}
              value={localLetterSpacing}
              onChange={(e) => handleLetterSpacingChange(e.target.value)}
              style={{ flex: 1 }}
            />
            <button
              onClick={resetLetterSpacing}
              style={{
                borderRadius: 9999,
                padding: "6px",
                border: "1px solid #e5e7eb",
                background: "#f9fafb",
                cursor: "pointer",
              }}
              title="Reset letter spacing"
            >
              ↺
            </button>
            <input
              type="number"
              step={0.01}
              min={-0.2}
              max={1.5}
              value={localLetterSpacing}
              onChange={(e) => handleLetterSpacingChange(e.target.value)}
              style={{
                width: 60,
                padding: "3px 6px",
                borderRadius: 6,
                border: "1px solid #e5e7eb",
              }}
            />
          </div>
        </div>
      )}

      {/* ROTATION PANEL (popover anchored near toolbar) */}
      {showRotationPanel && (
        <div
          style={{
            position: "absolute",
            top: 52,
            right: -6,
            padding: 12,
            background: "#ffffff",
            borderRadius: 12,
            boxShadow: "0 10px 30px rgba(15,23,42,0.12)",
            border: "1px solid rgba(148,163,184,0.18)",
            width: 320,
            zIndex: 9999,
          }}
        >
          <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 8 }}>
            Rotation
          </div>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <input
              type="range"
              min={-180}
              max={180}
              value={rotation}
              onChange={(e) => handleRotationSlider(e.target.value)}
              style={{ flex: 1 }}
            />
            <input
              type="number"
              value={rotation}
              onChange={(e) => {
                const v = Math.max(-180, Math.min(180, Number(e.target.value) || 0));
                setRotation(v);
                applyRotationToSelected(v);
              }}
              style={{
                width: 64,
                padding: "4px 6px",
                borderRadius: 6,
                border: "1px solid #e5e7eb",
                fontSize: 12,
                textAlign: "center",
              }}
            />
            <button
              onClick={resetRotation}
              title="Reset rotation"
              style={{
                borderRadius: 6,
                padding: "6px 8px",
                border: "1px solid #e5e7eb",
                background: "#f9fafb",
                cursor: "pointer",
              }}
            >
              ↺
            </button>
          </div>
        </div>
      )}

      {/* FLIP PANEL */}
      {showFlipPanel && (
        <div
          style={{
            position: "absolute",
            top: 52,
            right: 0,
            padding: 10,
            background: "#ffffff",
            borderRadius: 10,
            boxShadow: "0 8px 20px rgba(15,23,42,0.12)",
            border: "1px solid rgba(148,163,184,0.18)",
            width: 160,
            zIndex: 9999,
          }}
          role="menu"
        >
          <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 8 }}>
            Flip
          </div>
          <button
            onClick={() => applyFlip("vertical")}
            style={{
              display: "flex",
              gap: 8,
              alignItems: "center",
              padding: "8px 10px",
              borderRadius: 8,
              border: "1px solid #e5e7eb",
              background: "#fff",
              width: "100%",
              cursor: "pointer",
              marginBottom: 6,
            }}
            title="Flip vertically"
          >
            <FaArrowsAltV size={16} aria-hidden="true" />
            <span style={{ fontSize: 13 }}>Vertically</span>
          </button>

          <button
            onClick={() => applyFlip("horizontal")}
            style={{
              display: "flex",
              gap: 8,
              alignItems: "center",
              padding: "8px 10px",
              borderRadius: 8,
              border: "1px solid #e5e7eb",
              background: "#fff",
              width: "100%",
              cursor: "pointer",
            }}
            title="Flip horizontally"
          >
            <FaArrowsAltH size={16} aria-hidden="true" />
            <span style={{ fontSize: 13 }}>Horizontally</span>
          </button>
        </div>
      )}

      {/* MORE PANEL */}
      {showMorePanel && (
        <div
          style={{
            position: "absolute",
            top: 52,
            right: 0,
            padding: 10,
            background: "#ffffff",
            borderRadius: 10,
            boxShadow: "0 8px 20px rgba(15,23,42,0.12)",
            border: "1px solid rgba(148,163,184,0.18)",
            width: 160,
            zIndex: 9999,
          }}
          role="menu"
        >
          <button
            onClick={() => duplicateSelection()}
            style={{
              display: "flex",
              gap: 8,
              alignItems: "center",
              padding: "8px 10px",
              borderRadius: 8,
              border: "1px solid #e5e7eb",
              background: "#fff",
              width: "100%",
              cursor: "pointer",
              marginBottom: 6,
            }}
            title="Duplicate"
          >
            <FiCopy size={16} aria-hidden="true" />
            <span style={{ fontSize: 13 }}>Duplicate</span>
          </button>

          <button
            onClick={() => {
              deleteSelection();
            }}
            style={{
              display: "flex",
              gap: 8,
              alignItems: "center",
              padding: "8px 10px",
              borderRadius: 8,
              border: "1px solid #ffe0e0",
              background: "#fff",
              width: "100%",
              cursor: "pointer",
            }}
            title="Delete"
          >
            <FiTrash2 size={16} aria-hidden="true" />
            <span style={{ fontSize: 13 }}>Delete</span>
          </button>
        </div>
      )}

      {/* EFFECTS PANEL POPUP */}
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
          glitchPreset={glitchPreset}
          glitchAngle={glitchAngle}
          glitchOffset={glitchOffset}
          onGlitchPresetChange={onGlitchPresetChange}
          onGlitchAngleChange={onGlitchAngleChange}
          onGlitchOffsetChange={onGlitchOffsetChange}
          echoSteps={echoSteps}
          onEchoStepsChange={onEchoStepsChange}
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
