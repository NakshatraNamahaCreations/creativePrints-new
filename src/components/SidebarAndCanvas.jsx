// src/components/SidebarAndCanvas.jsx
import React from "react";
import { fabric } from "fabric";
import ImageCropPanel from "./ImageCropPanel.jsx";

import TextToolbar from "./TextToolbar.jsx";
import ImageToolbar from "./ImageToolbar.jsx";
import LeftToolbar from "./LeftToolbar.jsx";
import TextPanel from "./TextPanel.jsx";
import UploadsPanel from "./UploadsPanel.jsx";
import BackgroundPanel from "./BackgroundPanel.jsx";
import QrPanel from "./QrPanel.jsx";

import { useTextEffects } from "./useTextEffects.jsx";

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
    // optional hook: setCanvasBackground from the engine, if exposed
    setCanvasBackground,
  } = props;

  const [activeTool, setActiveTool] = React.useState("text");
  const [isCropPanelOpen, setIsCropPanelOpen] = React.useState(false);

  // background
  const [backgroundColor, setBackgroundColor] = React.useState("");
  const [recentBgColors, setRecentBgColors] = React.useState([]);

  // text effects hook
  const {
    fabricCanvas,
    selectedObject,
    effectStyle,
    shapeStyle,
    // ...lots of values/actions from the hook
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

  const [selectedCanvasObject, setSelectedCanvasObject] = React.useState(null);
  const [recentUploads, setRecentUploads] = React.useState([]);
  const wrapperRef = React.useRef(null); // used to set wrapper background to match canvas

  // ---------- applyQrToCanvas ----------
const applyQrToCanvas = React.useCallback(async (opts = {}) => {
  // opts: { dataUrl, sizePx, left, top, scale, selectable }
  const c = fabricRef?.current || fabricCanvas;
  if (!c) return;
  if (!opts || !opts.dataUrl) return;

  try {
    // add QR as fabric.Image from dataURL
    await new Promise((resolve, reject) => {
      fabric.Image.fromURL(opts.dataUrl, (img) => {
        if (!img) return reject(new Error("QR image load failed"));
        // set sensible defaults
        const size = typeof opts.sizePx === "number" ? opts.sizePx : Math.min(c.getWidth(), c.getHeight()) * 0.2;
        // ensure image uses its own natural size: scale relative to size param
        const scale = size / Math.max(img.width || 1, img.height || 1);

        img.set({
          left: typeof opts.left === "number" ? opts.left : (CARD.w || c.getWidth()) / 2,
          top: typeof opts.top === "number" ? opts.top : (CARD.h || c.getHeight()) / 2,
          originX: "center",
          originY: "center",
          selectable: typeof opts.selectable === "boolean" ? opts.selectable : true,
          hasControls: true,
          lockScalingFlip: true,
        });

        img.scale((typeof opts.scale === "number" ? opts.scale : 1) * scale);

        // attach meta so you can find/delete later
        img.set("data", { role: "qr", meta: opts.meta || null });

        c.add(img);
        // ensure bg stays at back if present
        const bg = c.getObjects().find(o => o?.data?.role === "background");
        if (bg) c.sendToBack(bg);

        c.setActiveObject(img);
        // more forceful redraw
        c.renderOnAddRemove = true;
        c.renderAll();
        setTimeout(() => { try { c.renderAll(); } catch (e) { void e; } }, 0);

        resolve();
      }, { crossOrigin: "anonymous" });
    });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error("applyQrToCanvas failed:", err);
  }
}, [fabricRef, fabricCanvas, CARD]);


  React.useEffect(() => {
    if (!fabricCanvas) return;
    const handleSel = (e) => setSelectedCanvasObject(e.selected?.[0] || null);
    const clearSel = () => setSelectedCanvasObject(null);

    fabricCanvas.on("selection:created", handleSel);
    fabricCanvas.on("selection:updated", handleSel);
    fabricCanvas.on("selection:cleared", clearSel);

    return () => {
      fabricCanvas.off("selection:created", handleSel);
      fabricCanvas.off("selection:updated", handleSel);
      fabricCanvas.off("selection:cleared", clearSel);
    };
  }, [fabricCanvas]);

  // uploads helpers
  const handleUploadFromDevice = (event) => {
    const files = Array.from(event.target.files || []);
    if (!files.length) return;

    setRecentUploads((prev) => {
      const newUrls = files.map((file) => URL.createObjectURL(file));
      return [...newUrls, ...prev].slice(0, 20);
    });

    event.target.value = "";
  };

  const scaleImageToFit = (img, maxWidth, maxHeight) => {
    const w = img.width;
    const h = img.height;
    if (!w || !h) return 1;
    const scale = Math.min(maxWidth / w, maxHeight / h);
    return scale < 1 ? scale : 1;
  };

  const handleAddFromThumbnail = (url) => {
    const c = fabricRef?.current;
    if (!c) return;
    fabric.Image.fromURL(url, (img) => {
      if (!img) return;
      const canvasW = c.getWidth();
      const canvasH = c.getHeight();
      const scale = scaleImageToFit(img, (CARD.w || canvasW) * 0.2, (CARD.h || canvasH) * 0.2);
      img.scale(scale);
      img.set({
        originX: "center",
        originY: "center",
        left: (CARD.w || canvasW) / 2,
        top: (CARD.h || canvasH) / 2,
        selectable: true,
      });
      c.add(img);
      c.setActiveObject(img);
      c.requestRenderAll();
      // ensure bg stays at back
      const bg = c.getObjects().find(o => o?.data?.role === "background");
      if (bg) c.sendToBack(bg);
    }, { crossOrigin: "anonymous" });
  };



  
  const handleDeleteUpload = (idx) => {
    setRecentUploads((prev) => {
      const next = [...prev];
      const url = next[idx];
      if (url && url.startsWith("blob:")) {
        try {
          URL.revokeObjectURL(url);
        } catch (e) {
          void e;
        }
      }
      next.splice(idx, 1);
      return next;
    });
  };

  const handleClearUploads = () => {
    if (!recentUploads.length) return;
    if (!window.confirm("Remove all recent uploads?")) return;
    recentUploads.forEach((u) => {
      if (u && u.startsWith("blob:")) {
        try { URL.revokeObjectURL(u); } catch (e) { void e; }
      }
    });
    setRecentUploads([]);
  };

  // delete selected object
  const handleDeleteSelected = React.useCallback(() => {
    const c = fabricRef?.current;
    if (!c || !selectedCanvasObject) return;
    if (!window.confirm("Delete selected object?")) return;

    try {
      const src =
        (typeof selectedCanvasObject.getSrc === "function" && selectedCanvasObject.getSrc()) ||
        selectedCanvasObject?.src ||
        selectedCanvasObject?.getElement?.()?.src ||
        null;
      if (src && src.startsWith("blob:")) {
        try { URL.revokeObjectURL(src); } catch (e) { void e; }
      }
    } catch (e) { void e; }

    const elId = selectedCanvasObject?.data?.elId;
    if (elId) {
      setData((prev) => ({ ...prev, [elId]: "" }));
    }

    try {
      c.remove(selectedCanvasObject);
      c.discardActiveObject();
      c.requestRenderAll();
      // ensure bg stays at back
      const bg = c.getObjects().find(o => o?.data?.role === "background");
      if (bg) c.sendToBack(bg);
    } catch (err) {
      console.warn("Failed to delete selected object:", err);
    }
  }, [fabricRef, selectedCanvasObject, setData]);

  // ---------- applyBackgroundToCanvas (keeps single permanent bg rect) ----------
  const applyBackgroundToCanvas = React.useCallback(async (payload) => {
    // Accept either a hex string (legacy) or an object payload:
    // string -> treat as color; null/"" -> transparent
    const dataPayload =
      typeof payload === "string" || payload === null
        ? payload
          ? { mode: "color", color: payload }
          : { mode: "transparent" }
        : payload || { mode: "transparent" };

    const c = fabricRef?.current || fabricCanvas;
    if (!c) return;

    try {
      // Update wrapper DOM background (outside card area)
      if (wrapperRef.current) {
        if (dataPayload.mode === "color") wrapperRef.current.style.background = dataPayload.color || "transparent";
        else if (dataPayload.mode === "transparent") wrapperRef.current.style.background = "transparent";
        else wrapperRef.current.style.background = "";
      }

      // If engine exposes a helper, use it (keeps behaviour consistent)
      if (typeof setCanvasBackground === "function") {
        await setCanvasBackground(dataPayload);
        if (dataPayload.mode === "color" && dataPayload.color) {
          setRecentBgColors((prev) => {
            const next = [dataPayload.color, ...prev.filter((c) => c !== dataPayload.color)];
            return next.slice(0, 8);
          });
          setBackgroundColor(dataPayload.color);
        } else if (dataPayload.mode === "transparent") {
          setBackgroundColor("");
        }
        return;
      }

      // Otherwise operate directly on the canvas bg rect
      const bgObj = c.getObjects().find(o => o?.data?.role === "background");
      if (!bgObj) {
        // fallback: create background rect
        const cornerRadiusPx =
          CARD.cornerRadiusPx ?? (CARD.cornerRadiusMM ? Math.round((CARD.cornerRadiusMM / 25.4) * CARD.dpi) : 0);
        const newBg = new fabric.Rect({
          left: 0,
          top: 0,
          width: c.getWidth(),
          height: c.getHeight(),
          rx: cornerRadiusPx,
          ry: cornerRadiusPx,
          fill: dataPayload.mode === "color" ? dataPayload.color || "transparent" : null,
          selectable: false,
          evented: false,
        });
        newBg.set("data", { layer: "card-bg", role: "background" });
        c.add(newBg);
        c.sendToBack(newBg);
        c.requestRenderAll();
        if (dataPayload.mode === "color" && dataPayload.color) {
          setRecentBgColors((prev) => [dataPayload.color, ...prev.filter(c => c !== dataPayload.color)].slice(0,8));
          setBackgroundColor(dataPayload.color);
        }
        return;
      }

      // We have a bgObj — update it depending on payload
      if (dataPayload.mode === "transparent") {
        bgObj.set("fill", null);
        bgObj.set("clipPath", null);
        bgObj.set("opacity", 1);
        bgObj.setCoords();
        c.sendToBack(bgObj);
        c.requestRenderAll();
        setBackgroundColor("");
        return;
      }

      // if (dataPayload.mode === "color") {
      //   bgObj.set("fill", dataPayload.color || null);
      //   bgObj.set("clipPath", null);
      //   bgObj.set("opacity", 1);
      //   bgObj.setCoords();
      //   c.sendToBack(bgObj);
      //   c.requestRenderAll();
      //   setRecentBgColors((prev) => {
      //     const next = [dataPayload.color, ...prev.filter((c) => c !== dataPayload.color)];
      //     return next.slice(0, 8);
      //   });
      //   setBackgroundColor(dataPayload.color || "");
      //   return;
      // }

      if (dataPayload.mode === "color") {
  bgObj.set("fill", dataPayload.color || null);
  bgObj.set("clipPath", null);
  bgObj.set("opacity", 1);

  // force immediate redraw
  bgObj.setCoords();
  c.sendToBack(bgObj);
  c.renderOnAddRemove = true;
  c.requestRenderAll();

  setRecentBgColors((prev) => {
    const next = [dataPayload.color, ...prev.filter((c) => c !== dataPayload.color)];
    return next.slice(0, 8);
  });

  setBackgroundColor(dataPayload.color || "");
  return;
}


      if (dataPayload.mode === "image" && dataPayload.imageUrl) {
        // pattern fill approach: create small canvas source and set as fabric.Pattern
        await new Promise((resolve, reject) => {
          fabric.Image.fromURL(dataPayload.imageUrl, (img) => {
            if (!img) return reject(new Error("image load fail"));
            const w = bgObj.width * (bgObj.scaleX || 1) || c.getWidth();
            const h = bgObj.height * (bgObj.scaleY || 1) || c.getHeight();
            const scaleX = w / img.width;
            const scaleY = h / img.height;
            const finalScale = (dataPayload.fit === "cover" ? Math.max(scaleX, scaleY) : Math.min(scaleX, scaleY)) * (typeof dataPayload.scale === "number" ? dataPayload.scale : 1);

            const src = document.createElement("canvas");
            src.width = Math.round(img.width * finalScale);
            src.height = Math.round(img.height * finalScale);
            const ctx = src.getContext("2d");
            const imgEl = img.getElement ? img.getElement() : img._element || null;
            if (imgEl) ctx.drawImage(imgEl, 0, 0, src.width, src.height);
            const pattern = new fabric.Pattern({ source: src, repeat: "no-repeat" });
            bgObj.set("fill", pattern);
            bgObj.setCoords();
            c.sendToBack(bgObj);
            c.requestRenderAll();
            resolve();
          }, { crossOrigin: "anonymous" });
        });
      }
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error("applyBackgroundToCanvas failed:", err);
    }
  }, [fabricRef, wrapperRef, setCanvasBackground, CARD]);

  // LEFT tools constant
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

  const isTextSelection =
    selectedObject && ["text", "i-text", "textbox"].includes(selectedObject.type);

  const selectedImage = selectedCanvasObject && selectedCanvasObject.type === "image" ? selectedCanvasObject : null;

  // keep wrapper background aligned if palette changes (safe)
  React.useEffect(() => {
    const c = fabricRef?.current;
    const bg = c?.getObjects().find(o => o?.data?.role === "background");
    if (bg && wrapperRef.current) {
      const fill = bg.fill;
      // if fill is a color string
      if (typeof fill === "string") wrapperRef.current.style.background = fill || "";
      else wrapperRef.current.style.background = "";
    }
  }, [fabricRef, /* you can add palette to deps if you pass it */]);

  return (
    <div className="relative">
      {selectedImage && (
        <ImageCropPanel isOpen={isCropPanelOpen} onClose={() => setIsCropPanelOpen(false)} canvas={fabricCanvas} selectedObject={selectedImage} />
      )}

      {/* Tailwind grid: left fixed 72px, centre fixed 360px, right flexible */}
      <div className="grid grid-cols-1 lg:grid-cols-[72px_360px_minmax(0,1fr)] gap-6">
        {/* LEFT: fixed width wrapper to prevent overflow */}
        <div className="w-[72px] min-w-[72px]">
          <div className="flex flex-col items-center h-full">
            <LeftToolbar
              leftTools={LEFT_TOOLS}
              activeTool={activeTool}
              setActiveTool={setActiveTool}
              selectedImage={selectedImage}
              onDeleteSelected={handleDeleteSelected}
              onClearUploads={handleClearUploads}
              recentUploads={recentUploads}
            />
          </div>
        </div>

        {/* MIDDLE: control panel fixed 360px */}
        <aside className="w-[300px] min-w-[300px] border rounded-xl p-4 bg-white shadow-sm hover:shadow-xl transition-all duration-200">
          {activeTool === "text" && (
            <TextPanel
              FIELD_DEFS={FIELD_DEFS}
              data={data}
              deletedKeys={deletedKeys}
              deleteFieldByKey={deleteFieldByKey}
              updateFieldStateOnly={(k, v) => setData((p) => ({ ...p, [k]: v }))}
              addNewTextField={addNewTextField}
              autoHideEmpty={autoHideEmpty}
              setAutoHideEmpty={setAutoHideEmpty}
              dragEnabled={dragEnabled}
              setDragEnabled={setDragEnabled}
              side={side}
            />
          )}

          {activeTool === "uploads" && (
            <UploadsPanel
              recentUploads={recentUploads}
              onUploadFromDevice={handleUploadFromDevice}
              onAddFromThumbnail={handleAddFromThumbnail}
              onDeleteUpload={handleDeleteUpload}
            />
          )}
          {activeTool === "qrcode" && (
  <QrPanel
    initialData={{}}
    onApply={(payload) => applyQrToCanvas(payload)}
    // optional: pass recent qrs or presets if you want
  />
)}

          {activeTool === "background" && (
            <BackgroundPanel
              initialHex={backgroundColor || "#FFFFFF"}
              onApply={applyBackgroundToCanvas}
              initialRecents={recentBgColors}
              presets={[
                "#ffffff","#f5f5f5","#ffe7e7","#ffd9b3",
                "#fff2b3","#e8ffdb","#dbe7ff","#e7e7ff",
                "#f0d9ff"
              ]}
            />
          )}

          {activeTool !== "text" && activeTool !== "uploads" && activeTool !== "background" && (
            <div className="flex flex-col items-center justify-center h-full text-sm text-gray-500">
              <p className="mb-1 font-semibold">{LEFT_TOOLS.find((t) => t.id === activeTool)?.label}</p>
              <p>Panel coming soon – only Text, Uploads and Background are active for now.</p>
            </div>
          )}
        </aside>

        {/* RIGHT: flexible canvas area; min-w-0 allows it to shrink instead of forcing other columns to grow */}
        <section className="relative flex flex-col items-center justify-center min-w-0">
          <div className="absolute -top-10 left-1/2 -translate-x-1/2 z-20">
            {isTextSelection && (
              <TextToolbar
                canvas={fabricCanvas}
                selectedObject={selectedObject}
                effectStyle={effectStyle}
                shapeStyle={shapeStyle}
                onSelectStyle={handleSelectStyle}
                onSelectShape={handleSelectShape}
                shadowColor={shadowColor}
                shadowDistance={shadowDistance}
                shadowOpacity={shadowOpacity}
                shadowAngle={shadowAngle}
                shadowBlur={shadowBlur}
                onShadowColorChange={(c) => { setShadowColor(c); if (effectStyle === "shadow") applyShadowToSelected({ color: c }); }}
                onShadowDistanceChange={(v) => { setShadowDistance(v); if (effectStyle === "shadow") applyShadowToSelected({ distance: v }); if (effectStyle === "echo") applyEchoEffectToSelected({ distance: v }); }}
                onShadowOpacityChange={(v) => { setShadowOpacity(v); if (effectStyle === "shadow") applyShadowToSelected({ opacity: v }); }}
                onShadowAngleChange={(v) => { setShadowAngle(v); if (effectStyle === "shadow") applyShadowToSelected({ angle: v }); if (effectStyle === "echo") applyEchoEffectToSelected({ angle: v }); }}
                onShadowBlurChange={(v) => { setShadowBlur(v); if (effectStyle === "shadow") applyShadowToSelected({ blur: v }); }}
                highlightColor={highlightColor}
                highlightRoundness={highlightRoundness}
                highlightSize={highlightSize}
                onHighlightColorChange={(color) => { setHighlightColor(color); if (effectStyle === "highlight") handleSelectStyle("highlight", { color }); }}
                onHighlightRoundnessChange={(v) => { setHighlightRoundness(v); if (effectStyle === "highlight") handleSelectStyle("highlight", { roundness: v }); }}
                onHighlightSizeChange={(v) => { setHighlightSize(v); if (effectStyle === "highlight") handleSelectStyle("highlight", { size: v }); }}
                glitchPreset={glitchPreset}
                onGlitchPresetChange={(name) => { setGlitchPreset(name); if (effectStyle === "glitch") applyGlitchEffectToSelected(); }}
                glitchAngle={glitchAngle}
                glitchOffset={glitchOffset}
                onGlitchAngleChange={(v) => { setGlitchAngle(v); if (effectStyle === "glitch") applyGlitchEffectToSelected(); }}
                onGlitchOffsetChange={(v) => { setGlitchOffset(v); if (effectStyle === "glitch") applyGlitchEffectToSelected(); }}
                echoSteps={echoSteps}
                onEchoStepsChange={(v) => { setEchoSteps(v); if (effectStyle === "echo") applyEchoEffectToSelected({ steps: v }); }}
                curveRadius={curveAmount}
                curveSpacing={curveSpacing}
                onCurveRadiusChange={(v) => { setCurveAmount(v); if (shapeStyle === "curve") applyCurveShapeToSelected({ radius: v }); }}
                onCurveSpacingChange={(v) => { setCurveSpacing(v); if (shapeStyle === "curve") applyCurveShapeToSelected({ letterSpacing: v }); }}
              />
            )}

            {selectedImage && (
              <ImageToolbar canvas={fabricCanvas} selectedObject={selectedImage} onOpenCropPanel={() => setIsCropPanelOpen(true)} onDeleteSelected={handleDeleteSelected} />
            )}
          </div>

          {/* wrapperRef lets us set background of card region to match canvas background */}
          <div
            ref={wrapperRef}
            className="rounded-xl border bg-white shadow-xl relative overflow-hidden"
            style={{
              borderRadius: CARD.cornerRadiusPx ? `${CARD.cornerRadiusPx}px` : undefined,
            }}
          >
            <canvas ref={canvasRef} width={CARD.w} height={CARD.h} />
          </div>

          <div className="text-xs text-gray-500 mt-2">{side} • {CARD.widthMM}×{CARD.heightMM} mm preview</div>

          <div className="mt-6 flex gap-0 text-sm">
            <button
              onClick={() => setSide("front")}
              className={`px-4 py-3 border rounded-l-md ${side === "front" ? "ring-2 ring-blue-500 shadow-md" : "hover:ring-1 hover:ring-blue-400"}`}
            >
              Front
            </button>
            <button
              onClick={() => setSide("back")}
              className={`px-4 py-3 border rounded-r-md ${side === "back" ? "ring-2 ring-blue-500 shadow-md" : "hover:ring-1 hover:ring-blue-400"}`}
            >
              Back
            </button>
          </div>
        </section>
      </div>

      {activeEdit && (
        <div
          className="fixed z-[9999] bg-white shadow-xl rounded-xl border px-3 py-2 flex items-center gap-2"
          style={{ left: activeEdit.leftPx, top: activeEdit.topPx }}
        >
          <input
            ref={editInputRef}
            className="border rounded px-3 py-2 text-sm"
            value={activeEdit.value}
            onChange={(e) => {
              const val = e.target.value;
              setActiveEdit((prev) => (prev ? { ...prev, value: val } : prev));
              const c = fabricRef?.current || fabricCanvas;
              if (!c) return;
              c.renderOnAddRemove = true;

              const obj = c.getObjects().find((o) => o.data?.elId === activeEdit.elId);
              if (obj && (obj.type === "text" || obj.type === "i-text")) {
                obj.set("text", val);
                c.requestRenderAll();
              }
            }}
            onKeyDown={(e) => { if (e.key === "Enter") commitActiveEdit(); if (e.key === "Escape") setActiveEdit(null); }}
          />

          <button className="text-xs border rounded px-2 py-1 bg-black text-white" onClick={commitActiveEdit}>Save</button>
          <button className="text-xs border rounded px-2 py-1" onClick={() => setActiveEdit(null)}>✕</button>
        </div>
      )}
    </div>
  );
}
