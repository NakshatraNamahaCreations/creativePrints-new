import React, { useEffect, useRef, useState } from "react";
import { fabric } from "fabric";
import "./ImageToolbar.css";

export default function ImageToolbar({ canvas, selectedObject, onOpenCropPanel }) {
  // UI ranges:
  // hue: 0 .. 359.9 (degrees)
  // sat: 0 .. 2 (UI center 1 => no change)
  // bright: 0 .. 1 (UI center 0.5 => no change)
  // opacity: 0 .. 1
  const [isAdjustOpen, setIsAdjustOpen] = useState(false);
  const [isOpacityOpen, setIsOpacityOpen] = useState(false); // NEW: separate state for opacity popover
  const [hue, setHue] = useState(0);
  const [sat, setSat] = useState(1);
  const [bright, setBright] = useState(0.5);
  const [opacity, setOpacity] = useState(1);

  const fileInputRef = useRef(null);
  const popoverRef = useRef(null);
  const opacityPopoverRef = useRef(null); // NEW: separate ref for opacity popover

  // visible when there's a selected image
  const isVisible = !!canvas && !!selectedObject && selectedObject.type === "image";

  // Load initial values from selected image when selection changes
  useEffect(() => {
    if (!isVisible || !selectedObject) return;
    const data = selectedObject.data || {};

    const loadedHue = data.hueUI ?? data.hue ?? 0;
    const loadedSatUI = data.satUI ?? (typeof data.sat === "number" ? data.sat + 1 : 1);
    const loadedBrightUI = data.brightUI ?? (typeof data.bright === "number" ? (data.bright + 1) / 2 : 0.5);

    setHue(Number(loadedHue) || 0);
    setSat(Number(loadedSatUI) || 1);
    setBright(Number(loadedBrightUI) || 0.5);
    setOpacity(typeof selectedObject.opacity === "number" ? selectedObject.opacity : 1);
  }, [isVisible, selectedObject]);

  // Convert UI -> fabric ranges and apply filters (unchanged)
  const applyFilters = (next = {}) => {
    if (!isVisible || !selectedObject || !canvas) return;
    const target = selectedObject;

    const uiHue = typeof next.hue === "number" ? next.hue : hue;
    const uiSat = typeof next.sat === "number" ? next.sat : sat;
    const uiBright = typeof next.bright === "number" ? next.bright : bright;

    target.data = {
      ...(target.data || {}),
      hueUI: uiHue,
      satUI: uiSat,
      brightUI: uiBright,
      hue: uiHue,
      sat: uiSat - 1,
      bright: uiBright * 2 - 1,
    };

    const fabricSat = uiSat - 1;
    const fabricBright = uiBright * 2 - 1;
    const hueRadians = (uiHue * Math.PI) / 180;

    const filters = [];

    if (Math.abs(fabricBright) > 1e-6 && fabric.Image.filters.Brightness) {
      filters.push(new fabric.Image.filters.Brightness({ brightness: fabricBright }));
    }

    if (Math.abs(fabricSat) > 1e-6 && fabric.Image.filters.Saturation) {
      filters.push(new fabric.Image.filters.Saturation({ saturation: fabricSat }));
    }

    if (fabric.Image.filters.HueRotation && Math.abs(uiHue) > 1e-6) {
      filters.push(new fabric.Image.filters.HueRotation({ rotation: hueRadians }));
    }

    target.filters = filters;
    try {
      target.applyFilters();
    } catch (err) {
      console.warn("applyFilters failed:", err);
    }
    canvas.requestRenderAll();
  };

  // Opacity helper
  const handleOpacityChange = (value) => {
    if (!isVisible || !selectedObject || !canvas) return;
    const v = parseFloat(value);
    setOpacity(v);
    selectedObject.set("opacity", v);
    canvas.requestRenderAll();
  };

  // Reset helpers
  const handleResetAll = () => {
    if (!isVisible || !selectedObject || !canvas) return;
    setHue(0);
    setSat(1);
    setBright(0.5);
    setOpacity(1);

    selectedObject.filters = [];
    selectedObject.clipPath = null;
    selectedObject.set("opacity", 1);
    selectedObject.data = {
      ...(selectedObject.data || {}),
      hueUI: 0,
      satUI: 1,
      brightUI: 0.5,
      hue: 0,
      sat: 0,
      bright: 0,
    };
    try {
      selectedObject.applyFilters();
    } catch (error) {
      console.warn("applyFilters error:", error);
    }
    canvas.requestRenderAll();
  };

  const handleResetOne = (field) => {
    if (!isVisible || !selectedObject || !canvas) return;
    if (field === "hue") {
      setHue(0);
      applyFilters({ hue: 0 });
    } else if (field === "sat") {
      setSat(1);
      applyFilters({ sat: 1 });
    } else if (field === "bright") {
      setBright(0.5);
      applyFilters({ bright: 0.5 });
    }
  };

  const handleReplaceClick = () => {
    if (fileInputRef.current) fileInputRef.current.click();
  };

  const handleReplaceFile = (e) => {
    if (!isVisible || !selectedObject || !canvas) return;
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    const target = selectedObject;

    fabric.Image.fromURL(url, (img) => {
      if (!img) return;
      img.set({
        left: target.left,
        top: target.top,
        angle: target.angle,
        scaleX: target.scaleX,
        scaleY: target.scaleY,
        originX: target.originX,
        originY: target.originY,
        data: target.data,
        clipPath: target.clipPath,
        opacity: target.opacity,
      });

      canvas.remove(target);
      canvas.add(img);
      canvas.setActiveObject(img);
      canvas.requestRenderAll();
    });
  };

  // Close popovers when clicking outside (handles both popovers)
  useEffect(() => {
    const onDocClick = (e) => {
      if (isAdjustOpen && popoverRef.current && !popoverRef.current.contains(e.target)) {
        setIsAdjustOpen(false);
      }
      if (isOpacityOpen && opacityPopoverRef.current && !opacityPopoverRef.current.contains(e.target)) {
        setIsOpacityOpen(false);
      }
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, [isAdjustOpen, isOpacityOpen]);

  if (!isVisible) {
    return null;
  }

  const hueGradient =
    "linear-gradient(90deg, hsl(0 100% 50%), hsl(30 100% 50%), hsl(60 100% 50%), hsl(120 100% 50%), hsl(180 100% 50%), hsl(240 100% 50%), hsl(300 100% 50%), hsl(360 100% 50%))";
  const satGradient = `linear-gradient(90deg, hsl(${hue} 0% 50%), hsl(${hue} 100% 50%))`;
  const brightGradient = `linear-gradient(90deg, black, white)`;

  return (
    <div className="image-toolbar">
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        className="image-toolbar__file-input"
        onChange={handleReplaceFile}
      />

      <button className="image-toolbar__btn" onClick={handleReplaceClick}>
        <span className="image-toolbar__icon">
          <svg viewBox="0 0 24 24" width="18" height="18"><path d="M7 7h10v3l4-4-4-4v3H6a4 4 0 0 0-4 4v3h2V9a2 2 0 0 1 2-2zm10 10H7v-3l-4 4 4 4v-3h11a4 4 0 0 0 4-4v-3h-2v3a2 2 0 0 1-2 2z" fill="currentColor"/></svg>
        </span>
        <span className="image-toolbar__label">Replace</span>
      </button>

      <div className="image-toolbar__divider" />

      <button className="image-toolbar__btn" onClick={() => onOpenCropPanel && onOpenCropPanel()}>
        <span className="image-toolbar__icon">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2v4M2 6h4M18 22v-4M22 18h-4" /><rect x="6" y="6" width="12" height="12" rx="1" /></svg>
        </span>
        <span className="image-toolbar__label">Crop</span>
      </button>

      <div className="image-toolbar__divider" />

      {/* Adjust button opens the hue/sat/brightness popover */}
      <button
        className="image-toolbar__btn image-toolbar__btn--icon-only"
        onClick={() => {
          setIsAdjustOpen((v) => !v);
          if (!isAdjustOpen) setIsOpacityOpen(false); // close opacity when opening adjust
        }}
      >
        <span className="image-toolbar__icon">
          <svg viewBox="0 0 24 24" width="18" height="18"><path d="M6 10v10h2V10zm10-6v6h2V4zM11 4v12h2V4zM16 12v8h2v-8zM6 4v4h2V4z" fill="currentColor"/></svg>
        </span>
        <span className="image-toolbar__label">Adjust</span>
      </button>

      <div className="image-toolbar__divider" />

      {/* Opacity button opens its own small popover */}
      <button
        className="image-toolbar__btn image-toolbar__btn--icon-only"
        onClick={() => {
          setIsOpacityOpen((v) => !v);
          if (!isOpacityOpen) setIsAdjustOpen(false); // close adjust when opening opacity
        }}
      >
        <span className="image-toolbar__icon">
          <svg viewBox="0 0 24 24" width="18" height="18"><path d="M12 3L5 10a7 7 0 1010 0l-3-3-3 3" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </span>
        <span className="image-toolbar__label">Opacity</span>
      </button>

      {/* ADJUST POPOVER */}
      {isAdjustOpen && (
        <div className="image-toolbar__popover" ref={popoverRef}>
          <div className="image-toolbar__popover-row">
            <span className="image-toolbar__popover-label">Reset</span>
            <button className="image-toolbar__pill-btn" onClick={handleResetAll}>Reset</button>
          </div>

          {/* Hue */}
          <div className="image-toolbar__slider-row">
            <span className="image-toolbar__slider-label">Hue</span>
            <input
              type="range"
              min="0"
              max="359.9"
              step="0.1"
              value={hue}
              onChange={(e) => {
                const v = parseFloat(e.target.value);
                setHue(v);
                applyFilters({ hue: v });
              }}
              style={{ background: hueGradient }}
            />
            <button className="image-toolbar__small-reset" onClick={() => handleResetOne("hue")} aria-label="Reset hue">↺</button>
            <input
              className="image-toolbar__number"
              type="number"
              min="0"
              max="359.9"
              step="0.1"
              value={hue}
              onChange={(e) => {
                const v = Number(e.target.value || 0);
                setHue(v);
                applyFilters({ hue: v });
              }}
            />
          </div>

          {/* Saturation */}
          <div className="image-toolbar__slider-row">
            <span className="image-toolbar__slider-label">Saturation</span>
            <input
              type="range"
              min="0"
              max="2"
              step="0.01"
              value={sat}
              onChange={(e) => {
                const v = parseFloat(e.target.value);
                setSat(v);
                applyFilters({ sat: v });
              }}
              style={{ background: satGradient }}
            />
            <button className="image-toolbar__small-reset" onClick={() => handleResetOne("sat")} aria-label="Reset saturation">↺</button>
            <input
              className="image-toolbar__number"
              type="number"
              min="0"
              max="2"
              step="0.01"
              value={sat}
              onChange={(e) => {
                const v = Number(e.target.value || 0);
                setSat(v);
                applyFilters({ sat: v });
              }}
            />
          </div>

          {/* Brightness */}
          <div className="image-toolbar__slider-row">
            <span className="image-toolbar__slider-label">Brightness</span>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={bright}
              onChange={(e) => {
                const v = parseFloat(e.target.value);
                setBright(v);
                applyFilters({ bright: v });
              }}
              style={{ background: brightGradient }}
            />
            <button className="image-toolbar__small-reset" onClick={() => handleResetOne("bright")} aria-label="Reset brightness">↺</button>
            <input
              className="image-toolbar__number"
              type="number"
              min="0"
              max="1"
              step="0.01"
              value={bright}
              onChange={(e) => {
                const v = Number(e.target.value || 0);
                setBright(v);
                applyFilters({ bright: v });
              }}
            />
          </div>
        </div>
      )}

      {/* OPACITY POPOVER (separate) */}
      {isOpacityOpen && (
        <div className="image-toolbar__popover image-toolbar__popover--small" ref={opacityPopoverRef}>
          <div className="image-toolbar__slider-row">
            <span className="image-toolbar__slider-label">Opacity</span>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={opacity}
              onChange={(e) => handleOpacityChange(e.target.value)}
              style={{ background: "linear-gradient(90deg, rgba(0,0,0,0), currentColor)" }}
            />
            <button className="image-toolbar__small-reset" onClick={() => handleOpacityChange(1)} aria-label="Reset opacity">↺</button>
            <input
              className="image-toolbar__number"
              type="number"
              min="0"
              max="1"
              step="0.01"
              value={opacity}
              onChange={(e) => handleOpacityChange(e.target.value)}
            />
          </div>
        </div>
      )}
    </div>
  );
}
