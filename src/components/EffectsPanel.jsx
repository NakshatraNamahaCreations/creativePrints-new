  // src/components/SidebarAndCanvas.jsx
  import React, { useEffect, useState, useCallback } from "react";
  import { fabric } from "fabric";    // ✅ v5 style

  import TrashIcon from "./TrashIcon.jsx";
  import TextToolbar from "./TextToolbar.jsx";

  const DESIGN_STORAGE_KEY = "myCardDesign_v1";

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

    const [selectedObject, setSelectedObject] = useState(null);
    const fabricCanvas = fabricRef?.current || null;

    // -------- EFFECT STATE (used by toolbar popup) --------
    const [highlightColor, setHighlightColor] = useState("#6FD0F5");
    const [highlightRoundness, setHighlightRoundness] = useState(72);
    const [highlightSize, setHighlightSize] = useState(43);

    const [shadowEnabled, setShadowEnabled] = useState(true);
    const [shadowColor, setShadowColor] = useState("#000000");
    const [shadowDistance, setShadowDistance] = useState(26);
    const [shadowOpacity, setShadowOpacity] = useState(0.4);
    const [shadowAngle, setShadowAngle] = useState(35);
    const [shadowBlur, setShadowBlur] = useState(10);

    const echoSteps = 4;
    const curveAmount = 80;

    // style: none | shadow | echo | glitch | highlight
    const [effectStyle, setEffectStyle] = useState("none");

    // shape: none | curve
    const [shapeStyle, setShapeStyle] = useState("none");

    // ---------- HELPERS ----------
    const ensureData = (obj) => {
      if (!obj) return;
      if (!obj.data) obj.data = {};
      if (!obj.data.effectClones) obj.data.effectClones = [];
      if (!obj.data.shapeClones) obj.data.shapeClones = [];
      if (!("highlightRect" in obj.data)) obj.data.highlightRect = null;
    };

    const clearEffectClones = (obj) => {
      if (!fabricCanvas || !obj || !obj.data) return;
      const clones = obj.data.effectClones || [];
      clones.forEach((c) => fabricCanvas.remove(c));
      obj.data.effectClones = [];
    };

    const clearShapeClones = (obj) => {
      if (!fabricCanvas || !obj || !obj.data) return;
      const clones = obj.data.shapeClones || [];
      clones.forEach((c) => fabricCanvas.remove(c));
      obj.data.shapeClones = [];
      if (obj.data.shapeStyle === "curve") {
        obj.set({ opacity: 1 }); // show original straight text again
      }
      obj.data.shapeStyle = "none";
    };

    const clearHighlightRect = (obj) => {
      if (!fabricCanvas || !obj || !obj.data?.highlightRect) return;
      fabricCanvas.remove(obj.data.highlightRect);
      obj.data.highlightRect = null;
    };

    // ---------------- SHADOW SYNC (for simple shadow) ----------------
    useEffect(() => {
      if (!selectedObject) return;

      const sh = selectedObject.shadow;
      if (!sh) {
        setShadowEnabled(false);
        if (!selectedObject.data?.effectStyle) {
          setEffectStyle("none");
        }
        return;
      }

      setShadowEnabled(true);
      setShadowBlur(sh.blur ?? 10);

      const ox = sh.offsetX || 0;
      const oy = sh.offsetY || 0;
      setShadowDistance(Math.sqrt(ox * ox + oy * oy));

      const ang = Math.atan2(oy, ox) * (180 / Math.PI);
      setShadowAngle(Math.round(ang));

      const colorMatch = /rgba?\((\d+),\s*(\d+),\s*(\d+)/i.exec(sh.color || "");
      if (colorMatch) {
        const r = Number(colorMatch[1]).toString(16).padStart(2, "0");
        const g = Number(colorMatch[2]).toString(16).padStart(2, "0");
        const b = Number(colorMatch[3]).toString(16).padStart(2, "0");
        setShadowColor(`#${r}${g}${b}`);
      } else if (sh.color?.startsWith("#")) {
        setShadowColor(sh.color);
      }

      if (!selectedObject.data?.effectStyle) {
        setEffectStyle("shadow");
      }
    }, [selectedObject]);

    // ---------------- APPLY SHADOW ----------------
    const applyShadowToSelected = (over = {}) => {
      if (!fabricCanvas || !selectedObject) return;

      const enabled =
        over.enabled !== undefined ? over.enabled : shadowEnabled;

      ensureData(selectedObject);

      if (!enabled) {
        selectedObject.set("shadow", null);
        selectedObject.data.effectStyle = "none";
        setEffectStyle("none");
        fabricCanvas.requestRenderAll();
        return;
      }

      const distance = over.distance ?? shadowDistance;
      const opacity = over.opacity ?? shadowOpacity;
      const angle = over.angle ?? shadowAngle;
      const blur = over.blur ?? shadowBlur;
      const colorHex = over.color ?? shadowColor;

      const rad = (angle * Math.PI) / 180;
      const offsetX = distance * Math.cos(rad);
      const offsetY = distance * Math.sin(rad);

      const hex = colorHex.replace("#", "");
      const r = parseInt(hex.substring(0, 2), 16);
      const g = parseInt(hex.substring(2, 4), 16);
      const b = parseInt(hex.substring(4, 6), 16);

      selectedObject.set("shadow", {
        color: `rgba(${r},${g},${b},${opacity})`,
        blur,
        offsetX,
        offsetY,
      });

      selectedObject.data.effectStyle = "shadow";
      clearEffectClones(selectedObject);
      clearHighlightRect(selectedObject);

      setEffectStyle("shadow");
      fabricCanvas.requestRenderAll();
    };

    // ---------------- APPLY ECHO (multi-shadow) ----------------
    const applyEchoEffectToSelected = (over = {}) => {
      if (!fabricCanvas || !selectedObject) return;
      if (!["text", "i-text", "textbox"].includes(selectedObject.type)) return;

      ensureData(selectedObject);

      const steps = over.steps ?? echoSteps;
      const distance = over.distance ?? shadowDistance;
      const opacity = over.opacity ?? shadowOpacity;
      const angleDeg = over.angle ?? shadowAngle;
      const blur = over.blur ?? shadowBlur;
      const baseColor = over.color ?? shadowColor;

      const angle = (angleDeg * Math.PI) / 180;

      // remove real shadow + old clones + highlight
      selectedObject.set("shadow", null);
      clearEffectClones(selectedObject);
      clearHighlightRect(selectedObject);

      const baseLeft = selectedObject.left;
      const baseTop = selectedObject.top;

      const hex = baseColor.replace("#", "");
      const r = parseInt(hex.substring(0, 2), 16);
      const g = parseInt(hex.substring(2, 4), 16);
      const b = parseInt(hex.substring(4, 6), 16);

      for (let i = 1; i <= steps; i++) {
        const offset = (distance / steps) * i;
        const dx = Math.cos(angle) * offset;
        const dy = Math.sin(angle) * offset;

        selectedObject.clone((clone) => {
          ensureData(clone);
          clone.data.isEffectClone = true;
          clone.data.dx = dx;
          clone.data.dy = dy;

          clone.set({
            left: baseLeft + dx,
            top: baseTop + dy,
            selectable: false,
            evented: false,
            opacity: opacity * (1 - i / (steps + 1)),
            fill: `rgba(${r},${g},${b},1)`,
            shadow: {
              color: `rgba(${r},${g},${b},${opacity})`,
              blur,
              offsetX: 0,
              offsetY: 0,
            },
          });

          fabricCanvas.add(clone);
          clone.moveTo(fabricCanvas.getObjects().indexOf(selectedObject));
          selectedObject.data.effectClones.push(clone);
          fabricCanvas.requestRenderAll();
        });
      }

      selectedObject.data.effectStyle = "echo";
      setEffectStyle("echo");
    };

    // ---------------- APPLY GLITCH ----------------
    const applyGlitchEffectToSelected = () => {
      if (!fabricCanvas || !selectedObject) return;
      if (!["text", "i-text", "textbox"].includes(selectedObject.type)) return;

      ensureData(selectedObject);

      // remove shadow + old clones + highlight
      selectedObject.set("shadow", null);
      clearEffectClones(selectedObject);
      clearHighlightRect(selectedObject);

      const baseLeft = selectedObject.left;
      const baseTop = selectedObject.top;

      const variations = [
        { dx: -2, dy: -1, color: "#00ffff", opacity: 0.9 }, // cyan
        { dx: 2, dy: 1, color: "#ff00ff", opacity: 0.9 }, // magenta
        { dx: 1, dy: -2, color: "#ff5555", opacity: 0.7 }, // red
      ];

      variations.forEach((v) => {
        selectedObject.clone((clone) => {
          ensureData(clone);
          clone.data.isEffectClone = true;
          clone.data.dx = v.dx;
          clone.data.dy = v.dy;

          clone.set({
            left: baseLeft + v.dx,
            top: baseTop + v.dy,
            fill: v.color,
            opacity: v.opacity * shadowOpacity,
            selectable: false,
            evented: false,
            shadow: null,
          });

          fabricCanvas.add(clone);
          clone.moveTo(fabricCanvas.getObjects().indexOf(selectedObject));
          selectedObject.data.effectClones.push(clone);
          fabricCanvas.requestRenderAll();
        });
      });

      selectedObject.data.effectStyle = "glitch";
      setEffectStyle("glitch");
    };

    // ---------------- APPLY CURVE SHAPE ----------------
    const applyCurveShapeToSelected = (over = {}) => {
      if (!fabricCanvas || !selectedObject) return;
      if (!["text", "i-text", "textbox"].includes(selectedObject.type)) return;

      ensureData(selectedObject);

      const text = selectedObject.text || "";
      if (!text.length) return;

      const radius = over.radius ?? curveAmount;

      // clear old shape clones
      clearShapeClones(selectedObject);

      const baseLeft = selectedObject.left;
      const baseTop = selectedObject.top;

      // simple 180° arc
      const angleSpan = Math.PI;
      const count = text.length;
      const denom = Math.max(1, count - 1);

      for (let i = 0; i < count; i++) {
        const ch = text[i];
        const t = i / denom;
        const angle = -angleSpan / 2 + angleSpan * t;

        const dx = radius * Math.cos(angle);
        const dy = radius * Math.sin(angle);

        selectedObject.clone((clone) => {
          ensureData(clone);
          clone.data.isShapeClone = true;
          clone.data.sdx = dx;
          clone.data.sdy = dy;

          clone.set({
            text: ch,
            left: baseLeft + dx,
            top: baseTop + dy,
            originX: "center",
            originY: "center",
            selectable: false,
            evented: false,
            angle: (angle * 180) / Math.PI + 90, // roughly tangent to the arc
          });

          selectedObject.data.shapeClones.push(clone);
          fabricCanvas.add(clone);
          clone.moveTo(fabricCanvas.getObjects().indexOf(selectedObject));
          fabricCanvas.requestRenderAll();
        });
      }

      // hide original straight text
      selectedObject.set({ opacity: 0 });
      selectedObject.data.shapeStyle = "curve";
      setShapeStyle("curve");
    };

    // ---------------- SELECTION ----------------
    useEffect(() => {
      const canvas = fabricCanvas;
      if (!canvas) return;

      const handle = (e) => {
        const obj = e.selected?.[0] || null;
        const isText = obj && ["text", "i-text", "textbox"].includes(obj.type);
        setSelectedObject(isText ? obj : null);

        if (isText && obj.data?.effectStyle) {
          setEffectStyle(obj.data.effectStyle);
        } else if (isText && obj.shadow) {
          setEffectStyle("shadow");
        } else {
          setEffectStyle("none");
        }

        if (isText && obj.data?.shapeStyle) {
          setShapeStyle(obj.data.shapeStyle);
        } else {
          setShapeStyle("none");
        }
      };

      const clear = () => {
        setSelectedObject(null);
        setEffectStyle("none");
        setShapeStyle("none");
      };

      canvas.on("selection:created", handle);
      canvas.on("selection:updated", handle);
      canvas.on("selection:cleared", clear);

      return () => {
        canvas.off("selection:created", handle);
        canvas.off("selection:updated", handle);
        canvas.off("selection:cleared", clear);
      };
    }, [fabricCanvas]);

    // ---------------- KEEP CLONES / HIGHLIGHT IN SYNC WHEN MOVING / SCALING ----------------
    useEffect(() => {
      const canvas = fabricCanvas;
      if (!canvas) return;

      const syncClones = (e) => {
        const obj = e.target;
        if (!obj || !obj.data) return;

        // echo / glitch clones
        if (obj.data.effectClones) {
          obj.data.effectClones.forEach((clone) => {
            const dx = clone.data?.dx || 0;
            const dy = clone.data?.dy || 0;
            clone.set({
              left: obj.left + dx,
              top: obj.top + dy,
              angle: obj.angle,
              scaleX: obj.scaleX,
              scaleY: obj.scaleY,
            });
          });
        }

        // curve clones
        if (obj.data.shapeClones) {
          obj.data.shapeClones.forEach((clone) => {
            const dx = clone.data?.sdx || 0;
            const dy = clone.data?.sdy || 0;
            clone.set({
              left: obj.left + dx,
              top: obj.top + dy,
            });
          });
        }

        // highlight rect
        if (obj.data.highlightRect) {
          const rect = obj.data.highlightRect;
          const bounds = obj.getBoundingRect(true, true);

          const fontSize = obj.fontSize || 16;
          const sizeFactor =
            obj.data.highlightSize ?? highlightSize; // fallback to state
          const padding = (sizeFactor / 100) * fontSize;

          const width = bounds.width + padding * 2;
          const height = bounds.height + padding * 2;

          const cornerPct =
            obj.data.highlightRoundness ?? highlightRoundness;
          const radius = (cornerPct / 100) * (height / 2);

          rect.set({
            left: bounds.left - padding,
            top: bounds.top - padding,
            width,
            height,
            rx: radius,
            ry: radius,
            angle: obj.angle,
            scaleX: obj.scaleX,
            scaleY: obj.scaleY,
          });
        }

        canvas.requestRenderAll();
      };

      canvas.on("object:moving", syncClones);
      canvas.on("object:scaling", syncClones);
      canvas.on("object:rotating", syncClones);

      return () => {
        canvas.off("object:moving", syncClones);
        canvas.off("object:scaling", syncClones);
        canvas.off("object:rotating", syncClones);
      };
    }, [fabricCanvas, highlightSize, highlightRoundness]);

    // ---------------- SAVE DESIGN ----------------
    const saveDesign = useCallback(() => {
      const canvas = fabricCanvas;
      if (!canvas) return;

      const json = canvas.toJSON([
        "data",
        "bindTo",
        "shadow",
        "fontFamily",
        "fontSize",
        "fontWeight",
        "fill",
        "opacity",
        "textAlign",
      ]);

      const payload = { canvasJSON: json, data, styleOverrides, side };
      localStorage.setItem(DESIGN_STORAGE_KEY, JSON.stringify(payload));
    }, [data, styleOverrides, side, fabricCanvas]);

    useEffect(() => {
      saveDesign();
    }, [data, styleOverrides, side, saveDesign]);

    useEffect(() => {
      const canvas = fabricCanvas;
      if (!canvas) return;

      const mod = () => saveDesign();
      canvas.on("object:modified", mod);

      return () => canvas.off("object:modified", mod);
    }, [fabricCanvas, saveDesign]);

    // --------------- LOAD DESIGN (ONLY ONCE) ---------------
    useEffect(() => {
      const canvas = fabricCanvas;
      if (!canvas) return;

      const saved = localStorage.getItem(DESIGN_STORAGE_KEY);
      if (!saved) return;

      try {
        const parsed = JSON.parse(saved);

        if (parsed.data) setData(parsed.data);
        if (parsed.styleOverrides) setStyleOverrides(parsed.styleOverrides);
        if (parsed.side) setSide(parsed.side);

        if (parsed.canvasJSON) {
          canvas.loadFromJSON(parsed.canvasJSON, () => {
            canvas.renderAll();
          });
        }
      } catch (err) {
        console.error("Load failed:", err);
      }
    }, [fabricCanvas, setData, setStyleOverrides, setSide]);

    // ---------------- HANDLERS FOR EFFECTS (from toolbar popup) ----------------
    const handleSelectStyle = (style) => {
      if (!selectedObject || !fabricCanvas) {
        setEffectStyle(style);
        return;
      }

      ensureData(selectedObject);

      if (style === "none") {
        selectedObject.set("shadow", null);
        selectedObject.set("backgroundColor", undefined);
        clearEffectClones(selectedObject);
        clearHighlightRect(selectedObject);
        selectedObject.data.effectStyle = "none";
        setShadowEnabled(false);
        setEffectStyle("none");
        fabricCanvas.requestRenderAll();
      } else if (style === "shadow") {
        setEffectStyle("shadow");
        setShadowEnabled(true);
        applyShadowToSelected({ enabled: true });
      } else if (style === "glitch") {
        setEffectStyle("glitch");
        applyGlitchEffectToSelected();
      } else if (style === "echo") {
        setEffectStyle("echo");
        applyEchoEffectToSelected();
      } else if (style === "highlight") {
        // Build pill highlight rectangle behind text
        const hex = (highlightColor || "#6FD0F5").replace("#", "");
        const r = parseInt(hex.substring(0, 2), 16);
        const g = parseInt(hex.substring(2, 4), 16);
        const b = parseInt(hex.substring(4, 6), 16);
        const colorRGBA = `rgba(${r},${g},${b},0.85)`;

        selectedObject.set("shadow", null);
        clearEffectClones(selectedObject);
        clearHighlightRect(selectedObject);

        const bounds = selectedObject.getBoundingRect(true, true);
        const fontSize = selectedObject.fontSize || 16;

        const sizeFactor = highlightSize ?? 43; // 0–100
        const padding = (sizeFactor / 100) * fontSize;

        const width = bounds.width + padding * 2;
        const height = bounds.height + padding * 2;

        const cornerPct = highlightRoundness ?? 72; // 0–100
        const radius = (cornerPct / 100) * (height / 2);

        const rect = new fabric.Rect({
          left: bounds.left - padding,
          top: bounds.top - padding,
          width,
          height,
          fill: colorRGBA,
          rx: radius,
          ry: radius,
          selectable: false,
          evented: false,
          angle: selectedObject.angle,
          scaleX: selectedObject.scaleX,
          scaleY: selectedObject.scaleY,
        });

        fabricCanvas.add(rect);
        rect.moveTo(fabricCanvas.getObjects().indexOf(selectedObject));
        selectedObject.bringToFront();

        ensureData(selectedObject);
        selectedObject.data.effectStyle = "highlight";
        selectedObject.data.highlightRoundness = highlightRoundness;
        selectedObject.data.highlightSize = highlightSize;
        selectedObject.data.highlightRect = rect;

        // remove Fabric's internal background so only our rect is visible
        selectedObject.set({
          backgroundColor: undefined,
          padding: 0,
        });

        setEffectStyle("highlight");
        fabricCanvas.requestRenderAll();
      }
    };

    const handleSelectShape = (shape) => {
      if (!selectedObject || !fabricCanvas) {
        setShapeStyle(shape);
        return;
      }

      if (shape === "none") {
        clearShapeClones(selectedObject);
        setShapeStyle("none");
        fabricCanvas.requestRenderAll();
      } else if (shape === "curve") {
        applyCurveShapeToSelected();
      }
    };

    // ---------------- UI ----------------
    return (
      <>
        <div className="grid grid-cols-1 lg:grid-cols-[360px_1fr] gap-6">
          {/* SIDEBAR */}
          <aside className="border rounded-xl p-4 bg-white shadow-sm hover:shadow-xl transition-all duration-200">
            <h3 className="font-semibold text-lg">Content</h3>

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
          </aside>

          {/* CANVAS AREA */}
          <section className="relative flex flex-col items-center justify-center">
            {/* Toolbar */}
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
                  if (effectStyle === "shadow")
                    applyShadowToSelected({ color });
                }}
                onShadowDistanceChange={(v) => {
                  setShadowDistance(v);
                  if (effectStyle === "shadow")
                    applyShadowToSelected({ distance: v });
                }}
                onShadowOpacityChange={(v) => {
                  setShadowOpacity(v);
                  if (effectStyle === "shadow")
                    applyShadowToSelected({ opacity: v });
                }}
                onShadowAngleChange={(v) => {
                  setShadowAngle(v);
                  if (effectStyle === "shadow")
                    applyShadowToSelected({ angle: v });
                }}
                onShadowBlurChange={(v) => {
                  setShadowBlur(v);
                  if (effectStyle === "shadow")
                    applyShadowToSelected({ blur: v });
                }}
                /* highlight props */
                highlightColor={highlightColor}
                highlightRoundness={highlightRoundness}
                highlightSize={highlightSize}
                onHighlightColorChange={(color) => {
                  setHighlightColor(color);
                  if (effectStyle === "highlight") {
                    handleSelectStyle("highlight");
                  }
                }}
                onHighlightRoundnessChange={(v) => {
                  setHighlightRoundness(v);
                  if (effectStyle === "highlight") {
                    handleSelectStyle("highlight");
                  }
                }}
                onHighlightSizeChange={(v) => {
                  setHighlightSize(v);
                  if (effectStyle === "highlight") {
                    handleSelectStyle("highlight");
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

        {/* EDIT BUBBLE */}
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
