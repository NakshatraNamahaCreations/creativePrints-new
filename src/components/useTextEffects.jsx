// src/components/useTextEffects.js
import { useState, useEffect, useCallback } from "react";
import { fabric } from "fabric";

const DESIGN_STORAGE_KEY = "myCardDesign_v1";

export function useTextEffects({
  fabricRef,
  data,
  setData,
  styleOverrides,
  setStyleOverrides,
  side,
  setSide,
}) {
  const fabricCanvas = fabricRef?.current || null;

  // --- selection ---
  const [selectedObject, setSelectedObject] = useState(null);

  // -------- EFFECT STATE --------
  // Highlight settings (VistaPrint-like)
  const [highlightColor, setHighlightColor] = useState("#6FD0F5");
  const [highlightRoundness, setHighlightRoundness] = useState(72);
  const [highlightSize, setHighlightSize] = useState(43);
  const [highlightOpacity, setHighlightOpacity] = useState(0.85);

  // Shadow settings
  const [shadowEnabled, setShadowEnabled] = useState(true);
  const [shadowColor, setShadowColor] = useState("#000000");
  const [shadowDistance, setShadowDistance] = useState(26);
  const [shadowOpacity, setShadowOpacity] = useState(0.4);
  const [shadowAngle, setShadowAngle] = useState(35);
  const [shadowBlur, setShadowBlur] = useState(10);

  const [echoSteps, setEchoSteps] = useState(3);

  // curve controls
  const [curveAmount, setCurveAmount] = useState(1); // radius (bigger = flatter)
  const [curveSpacing, setCurveSpacing] = useState(4); // extra px between letters

  // style: none | shadow | echo | glitch | highlight
  const [effectStyle, setEffectStyle] = useState("none");
  // shape: none | curve
  const [shapeStyle, setShapeStyle] = useState("none");

  const glitchPresets = [
    { name: "cyan-magenta", colors: ["#00FFFF", "#FF00FF"] },
    { name: "green-pink", colors: ["#00FF00", "#FF00AA"] },
    { name: "blue-red", colors: ["#0000FF", "#FF0000"] },
  ];

  const [glitchPreset, setGlitchPreset] = useState("cyan-magenta");
  const [glitchAngle, setGlitchAngle] = useState(180); // degrees
  const [glitchOffset, setGlitchOffset] = useState(8); // pixels

  const ensureData = (obj) => {
    if (!obj) return;
    if (!obj.data) obj.data = {};
    if (!obj.data.effectClones) obj.data.effectClones = [];
    if (!obj.data.shapeClones) obj.data.shapeClones = [];
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

  // ---------------- SHADOW SYNC (when selecting) ----------------
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

    selectedObject.set("shadow", null);
    clearEffectClones(selectedObject);

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

    selectedObject.set("shadow", null);
    clearEffectClones(selectedObject);

    const baseLeft = selectedObject.left;
    const baseTop = selectedObject.top;
    const preset = glitchPresets.find((p) => p.name === glitchPreset);

    const rad = (glitchAngle * Math.PI) / 180;
    const dx = glitchOffset * Math.cos(rad);
    const dy = glitchOffset * Math.sin(rad);

    const variations = [
      { dx: -dx, dy: -dy, color: preset.colors[0], opacity: 0.9 },
      { dx, dy, color: preset.colors[1], opacity: 0.9 },
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
  clearHighlightRect(selectedObject);

  const text = selectedObject.text || "";
  if (!text.length) return;

  // 🔹 Auto calculate radius from text width
  const textWidth =
    selectedObject.getScaledWidth?.() ||
    selectedObject.width ||
    (selectedObject.fontSize || 16) * text.length;

  // curveAmount acts as a factor here
  const radius = over.radius ?? textWidth * curveAmount;
  const letterSpacing = over.letterSpacing ?? curveSpacing;

  // remove old curve clones
  clearShapeClones(selectedObject);

  const baseLeft = selectedObject.left;
  const baseTop = selectedObject.top;

  const count = text.length;
  const avgCharWidth = textWidth / count;
  const stepAngle = (avgCharWidth + letterSpacing) / radius;

  const totalAngle = stepAngle * (count - 1);
  const startAngle = -totalAngle / 2;

  const centerX = baseLeft + textWidth / 2;
  const centerY = baseTop + radius;

  for (let i = 0; i < count; i++) {
    const ch = text[i];
    const theta = startAngle + i * stepAngle;
    const x = centerX + radius * Math.sin(theta);
    const y = centerY - radius * Math.cos(theta);
    const angleDeg = (theta * 180) / Math.PI;

    selectedObject.clone((clone) => {
      ensureData(clone);
      clone.data.isShapeClone = true;
      clone.data.sdx = x - baseLeft;
      clone.data.sdy = y - baseTop;

      clone.set({
        text: ch,
        left: x,
        top: y,
        originX: "center",
        originY: "center",
        selectable: false,
        evented: false,
        angle: angleDeg, // letters follow the arc
      });

      selectedObject.data.shapeClones.push(clone);
      fabricCanvas.add(clone);
      clone.moveTo(fabricCanvas.getObjects().indexOf(selectedObject));
      fabricCanvas.requestRenderAll();
    });
  }

  selectedObject.set({ opacity: 0 });
  selectedObject.data.shapeStyle = "curve";
  setShapeStyle("curve");
};
 const applyHighlightAroundCurve = (baseObj, over = {}) => {
  if (!fabricCanvas || !baseObj?.data?.shapeClones?.length) return;

  const clones = baseObj.data.shapeClones;

  let minX = Infinity,
    minY = Infinity,
    maxX = -Infinity,
    maxY = -Infinity;

  clones.forEach((c) => {
    const b = c.getBoundingRect(true, true);
    minX = Math.min(minX, b.left);
    minY = Math.min(minY, b.top);
    maxX = Math.max(maxX, b.left + b.width);
    maxY = Math.max(maxY, b.top + b.height);
  });

  const hex = ((over.color ?? highlightColor) || "#6FD0F5").replace("#", "");
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);

 const colorRGBA = `rgba(${r},${g},${b},1)`;   // always 100% opaque


  const fontSize = baseObj.fontSize || 16;
  const sizeFactor = over.size ?? highlightSize ?? 43;
  const padding = (sizeFactor / 100) * fontSize;

  const width = maxX - minX + padding * 2;
  const height = maxY - minY + padding * 2;
  const cornerPct = over.roundness ?? highlightRoundness ?? 72;
  const radius = (cornerPct / 100) * (height / 2);

  const rect = new fabric.Rect({
    left: minX - padding,
    top: minY - padding,
    width,
    height,
    fill: colorRGBA,
    rx: radius,
    ry: radius,
    selectable: false,
    evented: false,
  });

  fabricCanvas.add(rect);
  rect.sendToBack();
  clones.forEach((c) => c.bringToFront());

  baseObj.data.highlightRect = rect;
};


  // ---------------- SELECTION ----------------
  // ---------------- SELECTION ----------------
  useEffect(() => {
    const canvas = fabricCanvas;
    if (!canvas) return;

    const handle = (e) => {
      // whatever was selected (text, image, etc.)
      const obj = e.selected?.[0] || e.target || null;

      // ✅ always store the selected object
      setSelectedObject(obj);

      const isText =
        obj && ["text", "i-text", "textbox"].includes(obj.type);

      // effectStyle / shapeStyle are only meaningful for text,
      // so we keep that logic but don't block images.
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



  // ---------------- KEEP CLONES IN SYNC WHEN MOVING / SCALING ----------------
  useEffect(() => {
    const canvas = fabricCanvas;
    if (!canvas) return;

    const syncClones = (e) => {
      const obj = e.target;
      if (!obj || !obj.data) return;

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
  }, [fabricCanvas]);

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

  // ---------------- HANDLERS FOR EFFECTS (toolbar) ----------------
  const handleSelectStyle = (style, over = {}) => {
    if (!selectedObject || !fabricCanvas) {
      setEffectStyle(style);
      return;
    }

    ensureData(selectedObject);

    if (style === "none") {
      selectedObject.set("shadow", null);
      selectedObject.set("backgroundColor", undefined);
      selectedObject.set("padding", 0);
      clearEffectClones(selectedObject);
      clearShapeClones(selectedObject);
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
  if (selectedObject.data?.shapeStyle === "curve") {
    // curved text – pill around the arc
    clearHighlightRect(selectedObject);
    applyHighlightAroundCurve(selectedObject, over);
    selectedObject.data.effectStyle = "highlight";
    setEffectStyle("highlight");
    fabricCanvas.requestRenderAll();
    return;
  }

  // straight text highlight
  const hex = (
    (over.color ?? highlightColor) || "#6FD0F5"
  ).replace("#", "");
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);

  const alpha = over.opacity ?? highlightOpacity ?? 0.85;
  const colorRGBA = `rgba(${r},${g},${b},${alpha})`;

  selectedObject.set("shadow", null);
  clearEffectClones(selectedObject);
  clearHighlightRect(selectedObject);

  const bounds = selectedObject.getBoundingRect(true, true);
  const fontSize = selectedObject.fontSize || 16;

  const sizeFactor = over.size ?? highlightSize ?? 43;
  const padding = (sizeFactor / 100) * fontSize;

  const width = bounds.width + padding * 2;
  const height = bounds.height + padding * 2;

  const cornerPct = over.roundness ?? highlightRoundness ?? 72;
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
  selectedObject.data.highlightRoundness =
    over.roundness ?? highlightRoundness;
  selectedObject.data.highlightSize = over.size ?? highlightSize;
  selectedObject.data.highlightOpacity = over.opacity ?? highlightOpacity;
  selectedObject.data.highlightRect = rect;

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

  // what the component can use
  return {
    // canvas / selection
    fabricCanvas,
    selectedObject,
    setSelectedObject,

    // styles
    effectStyle,
    shapeStyle,

    // state for toolbar
    shadowEnabled,
    shadowColor,
    shadowDistance,
    shadowOpacity,
    shadowAngle,
    shadowBlur,

    highlightColor,
    highlightRoundness,
    highlightSize,
    highlightOpacity,

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
    setHighlightOpacity,

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
  };
}
