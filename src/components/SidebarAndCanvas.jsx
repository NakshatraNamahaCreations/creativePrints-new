// src/components/SidebarAndCanvas.jsx
import React from "react";
import TrashIcon from "./TrashIcon.jsx";
import TextToolbar from "./TextToolbar.jsx";
import { useTextEffects } from "./useTextEffects.jsx";
import { fabric } from "fabric"; // ✅ for Image.fromURL

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

// store recent uploaded image URLs (for thumbnails only)
const [recentUploads, setRecentUploads] = React.useState([]);

// 1️⃣ Upload from device: ONLY save to recentUploads
const handleUploadFromDevice = (event) => {
  const files = Array.from(event.target.files || []);
  if (!files.length) return;

  setRecentUploads((prev) => {
    const newUrls = files.map((file) => URL.createObjectURL(file));
    // newest first
    return [...newUrls, ...prev].slice(0, 20);
  });

  // allow re-selecting the same file later
  event.target.value = "";
};

// Auto-scale images so they fit nicely on the card
const scaleImageToFit = (img, maxWidth, maxHeight) => {
  const w = img.width;
  const h = img.height;

  if (!w || !h) return 1;

  const scale = Math.min(maxWidth / w, maxHeight / h);

  return scale < 1 ? scale : 1; // only shrink, never enlarge
};


// 2️⃣ When user clicks a thumbnail: NOW add to canvas
const handleAddFromThumbnail = (url) => {
  if (!fabricCanvas) return;

  fabric.Image.fromURL(url, (img) => {
    if (!img) return;

    // 1) Compute auto-scale
    const scale = scaleImageToFit(
      img,
      CARD.w * 0.2,   // occupy max 40% of card width
      CARD.h * 0.2    // occupy max 40% of card height
    );

    img.scale(scale);

    // 2) Center the image
    img.set({
      originX: "center",
      originY: "center",
      left: (CARD.w || fabricCanvas.getWidth()) / 2,
      top: (CARD.h || fabricCanvas.getHeight()) / 2,
      selectable: true,
    });

    fabricCanvas.add(img);
    fabricCanvas.setActiveObject(img);
    fabricCanvas.requestRenderAll();
  });
};



  // 🔹 1) Simple update: only React state
  //    Canvas will listen to `data` via useEffect below.
  const updateFieldStateOnly = React.useCallback(
    (key, value) => {
      setData((prev) => ({
        ...prev,
        [key]: value,
      }));
    },
    [setData]
  );

  
  // 🔹 2) Sync Fabric objects whenever `data` changes
  React.useEffect(() => {
    if (!fabricCanvas) return;

    const c = fabricCanvas;

    c.getObjects().forEach((obj) => {
      const elId = obj.data?.elId; // 👈 MUST match your FIELD_DEFS key
      if (!elId) return;

      const value = data[elId];

      // TEXT
      if ((obj.type === "text" || obj.type === "i-text") && typeof value === "string") {
        if (obj.text !== value) {
          obj.set("text", value || "");
        }
      }

      // IMAGE
      if (obj.type === "image" && typeof value === "string") {
        // Replace image with new URL
        fabric.Image.fromURL(value, (img) => {
          if (!img) return;

          img.set({
            left: obj.left,
            top: obj.top,
            angle: obj.angle,
            scaleX: obj.scaleX,
            scaleY: obj.scaleY,
            originX: obj.originX,
            originY: obj.originY,
            data: obj.data, // keep mapping
          });

          c.remove(obj);
          c.add(img);
          c.requestRenderAll();
        });
      }
    });

    c.requestRenderAll();
  }, [data, fabricCanvas]);

  // left toolbar buttons (now with image icons)
  const LEFT_TOOLS = [
    { id: "product", label: "Product options", icon: "/products/equalizer.png" },
    { id: "text", label: "Text", icon: "/products/text.png" },
    { id: "uploads", label: "Uploads", icon: "/products/image-.png" },
    { id: "graphics", label: "Graphics", icon: "/products/shapes.png" },
    { id: "background", label: "Background", icon: "/products/background.png" },
    { id: "template", label: "Template", icon: "/products/layout.png" },
    { id: "templateColor", label: "Template color", icon: "/products/paint-bucket.png" },
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
                <span
                  className="leading-tight text-center"
                  style={{ fontSize: "12px" }}
                >
                  {tool.label}
                </span>
              </button>
            );
          })}
        </nav>

        {/* MIDDLE PANEL – changes per activeTool */}
              <aside className="border rounded-xl p-4 bg-white shadow-sm hover:shadow-xl transition-all duration-200">
          {/* TEXT PANEL */}
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
                                  const url = URL.createObjectURL(f);
                                  updateFieldStateOnly(key, url);
                                }}
                              />
                            ) : (
                              <input
                                type={type}
                                placeholder={label}
                                className="w-full border rounded px-3 py-2"
                                value={data[key] ?? ""}
                                onChange={(e) =>
                                  updateFieldStateOnly(key, e.target.value)
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

          {/* UPLOADS PANEL – like Vistaprint left bar */}
        {activeTool === "uploads" && (
  <div className="flex flex-col h-full">
    <h3 className="font-semibold text-lg mb-3">Uploads</h3>

    {/* Upload from this device */}
    <label className="mb-3">
      <span className="inline-flex items-center justify-center w-full rounded-full bg-sky-500 hover:bg-sky-600 text-white text-sm font-medium py-2.5 cursor-pointer">
        Upload from this device
      </span>
      <input
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={handleUploadFromDevice}   
      />
    </label>

    <p className="text-xs text-gray-600 mb-2">Recently uploaded</p>

    {recentUploads.length === 0 ? (
      <p className="text-xs text-gray-400">
        No uploads yet. Use the button above to add images.
      </p>
    ) : (
      <div className="grid grid-cols-3 gap-2">
        {recentUploads.map((url, idx) => (
          <button
            key={idx}
            type="button"
            className="relative w-full pt-[100%] rounded-md overflow-hidden border hover:ring-2 hover:ring-sky-500"
            onClick={() => handleAddFromThumbnail(url)}
          >
            <img
              src={url}
              alt={`Upload ${idx + 1}`}
              className="absolute inset-0 w-full h-full object-cover"
            />
          </button>
        ))}
      </div>
    )}
  </div>
)}


          {/* PLACEHOLDER FOR OTHER TOOLS */}
          {activeTool !== "text" && activeTool !== "uploads" && (
            <div className="flex flex-col items-center justify-center h-full text-sm text-gray-500">
              <p className="mb-1 font-semibold">
                {LEFT_TOOLS.find((t) => t.id === activeTool)?.label}
              </p>
              <p>Panel coming soon – only Text and Uploads are active for now.</p>
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

              if (obj && (obj.type === "text" || obj.type === "i-text")) {
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
