// src/components/SidebarAndCanvas.jsx
import React from "react";
import TrashIcon from "./TrashIcon.jsx";
import TextToolbar from "./TextToolbar.jsx";
import { useTextEffects } from "./useTextEffects.jsx";

/* 🔹 IMPORT YOUR OWN ICONS HERE
   Put SVG/PNG files in src/assets/icons/ and update paths as needed */
// import iconProduct from "../assets/icons/product.webp";
// import iconText from "../assets/icons/product.webp";
// import iconUploads from "../assets/icons/product.webp";
// import iconGraphics from "../assets/icons/product.webp";
// import iconBackground from "../assets/icons/product.webp";
// import iconTemplate from "../assets/icons/product.webp";
// import iconTemplateColor from "../assets/icons/product.webp";
// import iconQr from "../assets/icons/product.webp";
// import iconTables from "../assets/icons/product.webp";

export default function SidebarAndCanvas(props) {
  const {
    FIELD_DEFS,
    data,
    setData,
    addNewTextField,
    deleteFieldByKey,
    deletedKeys,
    styleOverrides,
    setStyleOverrides,
    autoHideEmpty,
    setAutoHideEmpty,
    dragEnabled,
    setDragEnabled,
    CARD,
    side,
    setSide,
    canvasRef,
    fabricRef,
    activeEdit,
    setActiveEdit,
    editInputRef,
    commitActiveEdit,
  } = props;

  // which left toolbar tab is active
  const [activeTool, setActiveTool] = React.useState("text");

  // all the text / effect logic lives in the hook
  const {
    fabricCanvas,
    selectedObject,
    effectStyle,
    shapeStyle,

    // state
    shadowColor,
    shadowDistance,
    shadowOpacity,
    shadowAngle,
    shadowBlur,

    highlightColor,
    highlightRoundness,
    highlightSize,
  

    glitchPreset,
    glitchAngle,
    glitchOffset,

    echoSteps,

    curveAmount,
    curveSpacing,

    // setters
    setShadowColor,
    setShadowDistance,
    setShadowOpacity,
    setShadowAngle,
    setShadowBlur,

    setHighlightColor,
    setHighlightRoundness,
    setHighlightSize,


    setGlitchPreset,
    setGlitchAngle,
    setGlitchOffset,

    setEchoSteps,
    setCurveAmount,
    setCurveSpacing,

    // actions
    handleSelectStyle,
    handleSelectShape,
    applyShadowToSelected,
    applyEchoEffectToSelected,
    applyGlitchEffectToSelected,
    applyCurveShapeToSelected,
  } = useTextEffects({
    fabricRef,
    data,
    setData,
    styleOverrides,
    setStyleOverrides,
    side,
    setSide,
  });

  // left toolbar buttons (now with image icons)
  const LEFT_TOOLS = [
    { id: "product", label: "Product options", icon: "/products/equalizer.png" },
    { id: "text", label: "Text", icon:"/products/text.png" },
    { id: "uploads", label: "Uploads", icon: "/products/image-.png"  },
    { id: "graphics", label: "Graphics", icon: "/products/shapes.png"  },
    { id: "background", label: "Background", icon: "/products/background.png"  },
    { id: "template", label: "Template", icon: "/products/layout.png"  },
    { id: "templateColor", label: "Template color", icon: "/products/paint-bucket.png"  },
    { id: "qrcode", label: "QR-codes", icon: "/products/qr-code.png" },
    { id: "tables", label: "Tables", icon: "/products/grid.png" },
  ];

  // ---------------- UI ----------------
  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-[72px_360px_1fr] gap-6">
        {/* LEFT VISTAPRINT-STYLE TOOLBAR */}
        <nav className="hidden lg:flex flex-col bg-white rounded-xl shadow-sm border py-2">
          {LEFT_TOOLS.map((tool) => {
            const isActive = activeTool === tool.id;
            return (
              <button
                key={tool.id}
                type="button"
                className={
                  "flex flex-col items-center justify-center px-2 py-3 text-[11px] border-l-4 transition-colors " +
                  (isActive
                    ? "border-blue-600 bg-blue-50 font-semibold text-blue-700"
                    : "border-transparent hover:bg-gray-50 text-gray-600")
                }
                onClick={() => setActiveTool(tool.id)}
              >
                {/* 🔹 REAL IMAGE ICON INSTEAD OF LETTER */}
                <span
                  className={
                    " h-8 w-8 rounded-lg flex items-center justify-center " +
                    (isActive ? "bg-sky-200" : "")
                  }
                >
                  <img
                    src={tool.icon}
                    alt={tool.label}
                    className="h-8 w-8 object-contain"
                  />
                </span>
                <span className="leading-tight text-center" style={{fontSize:"12px"}}>
                  {tool.label}
                </span>
              </button>
            );
          })}
        </nav>

        {/* MIDDLE PANEL – changes per activeTool */}
        <aside className="border rounded-xl p-4 bg-white shadow-sm hover:shadow-xl transition-all duration-200">
          {activeTool === "text" && (
            <>
              <h3 className="font-semibold text-lg mb-2">Text</h3>

              {/* Toggles */}
              <div className="flex items-center gap-4 mt-2 mb-3 text-sm flex-wrap">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={autoHideEmpty}
                    onChange={(e) => setAutoHideEmpty(e.target.checked)}
                  />
                  Auto-hide empty
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={dragEnabled}
                    onChange={(e) => setDragEnabled(e.target.checked)}
                  />
                  Enable drag
                </label>
              </div>

              <div className="space-y-4">
                {FIELD_DEFS.map(([label, key, type]) => {
                  const deleted = deletedKeys.has(key);

                  return (
                    <div key={key} className="space-y-1">
                      {deleted ? (
                        <div className="text-xs text-gray-400 border rounded px-3 py-2">
                          {label} removed
                        </div>
                      ) : (
                        <>
                          {type === "file" && (
                            <span className="text-xs text-gray-600 block">
                              {label} (Image file)
                            </span>
                          )}

                          <div className="relative">
                            {type === "file" ? (
                              <input
                                type="file"
                                accept="image/*"
                                className="w-full border rounded px-3 py-2"
                                onChange={(e) => {
                                  const f = e.target.files?.[0];
                                  if (!f) return;
                                  setData((v) => ({
                                    ...v,
                                    [key]: URL.createObjectURL(f),
                                  }));
                                }}
                              />
                            ) : (
                              <input
                                type={type}
                                placeholder={label}
                                className="w-full border rounded px-3 py-2"
                                value={data[key] ?? ""}
                                onChange={(e) =>
                                  setData((v) => ({
                                    ...v,
                                    [key]: e.target.value,
                                  }))
                                }
                              />
                            )}

                            <button
                              className="absolute right-2 top-1/2 -translate-y-1/2 p-1 border rounded bg-white hover:bg-red-50"
                              onClick={() => deleteFieldByKey(key)}
                            >
                              <TrashIcon className="w-4 h-4 text-red-600" />
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  );
                })}

                {/* Add field */}
                <button
                  type="button"
                  className="w-full py-2 rounded bg-black text-white"
                  disabled={side === "back"}
                  onClick={addNewTextField}
                >
                  Add Text
                </button>
              </div>
            </>
          )}

          {activeTool !== "text" && (
            <div className="flex flex-col items-center justify-center h-full text-sm text-gray-500">
              <p className="mb-1 font-semibold">
                {LEFT_TOOLS.find((t) => t.id === activeTool)?.label}
              </p>
              <p>Panel coming soon – only Text is active for now.</p>
            </div>
          )}
        </aside>

        {/* CANVAS AREA */}
        <section className="relative flex flex-col items-center justify-center">
          {/* Toolbar floating above canvas */}
          <div className="absolute -top-10 left-1/2 -translate-x-1/2 z-20">
            <TextToolbar
              canvas={fabricCanvas}
              selectedObject={selectedObject}
              effectStyle={effectStyle}
              shapeStyle={shapeStyle}
              onSelectStyle={handleSelectStyle}
              onSelectShape={handleSelectShape}
        
              /* shadow props */
              shadowColor={shadowColor}
              shadowDistance={shadowDistance}
              shadowOpacity={shadowOpacity}
              shadowAngle={shadowAngle}
              shadowBlur={shadowBlur}
              onShadowColorChange={(color) => {
                setShadowColor(color);
                if (effectStyle === "shadow") {
                  applyShadowToSelected({ color });
                }
              }}
              onShadowDistanceChange={(v) => {
                setShadowDistance(v);
                if (effectStyle === "shadow") {
                  applyShadowToSelected({ distance: v });
                }
                if (effectStyle === "echo") {
                  applyEchoEffectToSelected({ distance: v });
                }
              }}
              onShadowOpacityChange={(v) => {
                setShadowOpacity(v);
                if (effectStyle === "shadow") {
                  applyShadowToSelected({ opacity: v });
                }
              }}
              onShadowAngleChange={(v) => {
                setShadowAngle(v);
                if (effectStyle === "shadow") {
                  applyShadowToSelected({ angle: v });
                }
                if (effectStyle === "echo") {
                  applyEchoEffectToSelected({ angle: v });
                }
              }}
              onShadowBlurChange={(v) => {
                setShadowBlur(v);
                if (effectStyle === "shadow") {
                  applyShadowToSelected({ blur: v });
                }
              }}
              /* highlight */
              highlightColor={highlightColor}
              highlightRoundness={highlightRoundness}
              highlightSize={highlightSize}
             onHighlightColorChange={(color) => {
  setHighlightColor(color);
  if (effectStyle === "highlight") {
    handleSelectStyle("highlight", { color });
  }
}}

onHighlightRoundnessChange={(v) => {
  setHighlightRoundness(v);
  if (effectStyle === "highlight") {
    handleSelectStyle("highlight", { roundness: v });
  }
}}

onHighlightSizeChange={(v) => {
  setHighlightSize(v);
  if (effectStyle === "highlight") {
    handleSelectStyle("highlight", { size: v });
  }
}}



              /* glitch */
              glitchPreset={glitchPreset}
              onGlitchPresetChange={(name) => {
                setGlitchPreset(name);
                if (effectStyle === "glitch") {
                  applyGlitchEffectToSelected();
                }
              }}
              glitchAngle={glitchAngle}
              glitchOffset={glitchOffset}
              onGlitchAngleChange={(v) => {
                setGlitchAngle(v);
                if (effectStyle === "glitch") {
                  applyGlitchEffectToSelected();
                }
              }}
              onGlitchOffsetChange={(v) => {
                setGlitchOffset(v);
                if (effectStyle === "glitch") {
                  applyGlitchEffectToSelected();
                }
              }}
              /* echo */
              echoSteps={echoSteps}
              onEchoStepsChange={(v) => {
                setEchoSteps(v);
                if (effectStyle === "echo") {
                  applyEchoEffectToSelected({ steps: v });
                }
              }}
              /* curve controls */
              curveRadius={curveAmount}
              curveSpacing={curveSpacing}
              onCurveRadiusChange={(v) => {
                setCurveAmount(v);
                if (shapeStyle === "curve") {
                  applyCurveShapeToSelected({ radius: v });
                }
              }}
              onCurveSpacingChange={(v) => {
                setCurveSpacing(v);
                if (shapeStyle === "curve") {
                  applyCurveShapeToSelected({ letterSpacing: v });
                }
              }}
            />
          </div>

          {/* Canvas wrapper */}
          <div
            className="mt-10 rounded-xl border bg-white shadow-xl relative"
            style={{
              borderRadius: CARD.cornerRadiusPx
                ? `${CARD.cornerRadiusPx}px`
                : undefined,
              overflow: CARD.cornerRadiusPx ? "hidden" : undefined,
            }}
          >
            <canvas ref={canvasRef} width={CARD.w} height={CARD.h} />
          </div>

          <div className="text-xs text-gray-500 mt-2">
            {side} • {CARD.widthMM}×{CARD.heightMM} mm preview
          </div>

          {/* Front/Back Switch */}
          <div className="mt-6 flex gap-0 text-sm">
            <button
              onClick={() => setSide("front")}
              className={`px-4 py-3 border rounded-l-md ${
                side === "front"
                  ? "ring-2 ring-blue-500 shadow-md"
                  : "hover:ring-1 hover:ring-blue-400"
              }`}
            >
              Front
            </button>
            <button
              onClick={() => setSide("back")}
              className={`px-4 py-3 border rounded-r-md ${
                side === "back"
                  ? "ring-2 ring-blue-500 shadow-md"
                  : "hover:ring-1 hover:ring-blue-400"
              }`}
            >
              Back
            </button>
          </div>
        </section>
      </div>

      {/* EDIT BUBBLE (unchanged) */}
      {activeEdit && (
        <div
          className="fixed z-[9999] bg-white shadow-xl rounded-xl border px-3 py-2 flex items-center gap-2"
          style={{
            left: activeEdit.leftPx,
            top: activeEdit.topPx,
          }}
        >
          <input
            ref={editInputRef}
            className="border rounded px-3 py-2 text-sm"
            value={activeEdit.value}
            onChange={(e) => {
              const val = e.target.value;

              setActiveEdit((prev) =>
                prev ? { ...prev, value: val } : prev
              );

              const c = fabricCanvas;
              if (!c) return;

              const obj = c
                .getObjects()
                .find((o) => o.data?.elId === activeEdit.elId);

              if (obj && obj.type === "text") {
                obj.set("text", val);
                c.requestRenderAll();
              }
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") commitActiveEdit();
              if (e.key === "Escape") setActiveEdit(null);
            }}
          />

          <button
            className="text-xs border rounded px-2 py-1 bg-black text-white"
            onClick={commitActiveEdit}
          >
            Save
          </button>

          <button
            className="text-xs border rounded px-2 py-1"
            onClick={() => setActiveEdit(null)}
          >
            ✕
          </button>
        </div>
      )}
    </>
  );
}
