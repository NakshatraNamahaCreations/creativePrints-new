// src/components/ImageCropPanel.jsx
import React, { useState, useEffect } from "react";
import { fabric } from "fabric";
import "./ImageCropPanel.css";

export default function ImageCropPanel({
  isOpen,
  onClose,
  canvas,
  selectedObject,
}) {
  // Is the current selection an image?
  const isImage =
    !!canvas && selectedObject && selectedObject.type === "image";

  // 🔹 React state for which shape is selected in the UI
  const [selectedShapeId, setSelectedShapeId] = useState("none");

  // When panel opens or clipPath changes (new object selected),
  // sync the state from the Fabric object.
  useEffect(() => {
    if (!isOpen || !isImage || !selectedObject) return;

    const cp = selectedObject.clipPath;
    const currentId =
      cp && cp.customShapeId ? cp.customShapeId : cp ? "custom" : "none";

    setSelectedShapeId(currentId);
  }, [isOpen, isImage, selectedObject]);

  // ✅ EARLY RETURN ONLY AFTER HOOKS
  if (!isOpen || !isImage) return null;

  // Safe to use after the early return
  const target = selectedObject;

  const applyShape = (shapeId) => {
    if (!canvas || !target) return;

    let clip = null;

    // use unscaled width/height
    const w = target.width || target._originalElement?.naturalWidth || 100;
    const h = target.height || target._originalElement?.naturalHeight || 100;
    const size = Math.min(w, h);

    switch (shapeId) {
      case "none":
        clip = null;
        break;

      case "circle": {
        const radius = size / 2;
        clip = new fabric.Circle({
          radius,
          originX: "center",
          originY: "center",
        });
        break;
      }

      case "square": {
        clip = new fabric.Rect({
          width: size,
          height: size,
          originX: "center",
          originY: "center",
        });
        break;
      }

      case "roundedSquare": {
        const s = size;
        clip = new fabric.Rect({
          width: s,
          height: s,
          rx: s * 0.2,
          ry: s * 0.2,
          originX: "center",
          originY: "center",
        });
        break;
      }

      case "triangle": {
        clip = new fabric.Triangle({
          width: size,
          height: size,
          originX: "center",
          originY: "center",
        });
        break;
      }

      case "star": {
        const points = [];
        const outerR = size / 2;
        const innerR = outerR * 0.5;
        for (let i = 0; i < 10; i++) {
          const angle = (Math.PI / 5) * i;
          const r = i % 2 === 0 ? outerR : innerR;
          points.push({
            x: r * Math.sin(angle),
            y: -r * Math.cos(angle),
          });
        }
        clip = new fabric.Polygon(points, {
          originX: "center",
          originY: "center",
        });
        break;
      }

      case "hexagon": {
        const points = [];
        const r = size / 2;
        for (let i = 0; i < 6; i++) {
          const angle = (Math.PI / 3) * i;
          points.push({
            x: r * Math.cos(angle),
            y: r * Math.sin(angle),
          });
        }
        clip = new fabric.Polygon(points, {
          originX: "center",
          originY: "center",
        });
        break;
      }

      case "parallelogram": {
        const s = size;
        clip = new fabric.Polygon(
          [
            { x: -s * 0.3, y: -s / 2 },
            { x: s * 0.7, y: -s / 2 },
            { x: s * 0.3, y: s / 2 },
            { x: -s * 0.7, y: s / 2 },
          ],
          {
            originX: "center",
            originY: "center",
          }
        );
        break;
      }

      case "arch": {
        // rect + semicircle top
        const r = size / 2;
        const path = new fabric.Path(
          `
          M ${-r} 0
          A ${r} ${r} 0 0 1 ${r} 0
          L ${r} ${r}
          L ${-r} ${r}
          Z
        `,
          {
            originX: "center",
            originY: "center",
          }
        );
        clip = path;
        break;
      }

  case "heart": {
  // Build heart geometry using the local `size` (so generic scaling will work)
  // size = Math.min(originalWidth, originalHeight)
  const s = size; // base geometry size in same units as other shapes
  const shapeExtraScale = 1.0; // tweak if you want heart larger/smaller relative to 'size'

  // control points chosen to give a visually pleasing heart within ~s units tall
  const sx = s * shapeExtraScale;
  const pathStr = `
    M 0 ${-0.25 * sx}
    C ${-0.166 * sx} ${-0.416 * sx}, ${-0.416 * sx} ${-0.333 * sx}, ${-0.416 * sx} ${-0.083 * sx}
    C ${-0.416 * sx} ${0.166 * sx}, ${-0.166 * sx} ${0.333 * sx}, 0 ${0.5 * sx}
    C ${0.166 * sx} ${0.333 * sx}, ${0.416 * sx} ${0.166 * sx}, ${0.416 * sx} ${-0.083 * sx}
    C ${0.416 * sx} ${-0.333 * sx}, ${0.166 * sx} ${-0.416 * sx}, 0 ${-0.25 * sx}
    Z
  `;

  const path = new fabric.Path(pathStr, {
    originX: "center",
    originY: "center",
  });

  // Do NOT call path.scale(...) here — let the generic patch below scale the clip
  // If you still want an extra multiplier you can set `shapeExtraScale` > 1 above.

  clip = path;
  break;
}


      default:
        clip = null;
        break;
    }

    // --- BEGIN SMALL PATCH (paste before `target.clipPath = clip;`) ---
if (clip) {
  clip.customShapeId = shapeId;

  // compute original (unscaled) image size and rendered size
  const origW = target.width || target._originalElement?.naturalWidth || 100;
  const origH = target.height || target._originalElement?.naturalHeight || 100;
  const renderedW = target.getScaledWidth();
  const renderedH = target.getScaledHeight();

  // Center of the object in canvas coords
  const center = target.getCenterPoint ? target.getCenterPoint() : { x: target.left, y: target.top };

  // Use absolute positioning so the clip sits exactly where the user sees the image
  clip.absolutePositioned = true;
  clip.originX = "center";
  clip.originY = "center";

  // position clip at the object's center (canvas coords)
  clip.left = center.x;
  clip.top = center.y;

  // scale the clip so its geometry (which was created using "size") fits
  // If your clip geometry used 'size' units, scale it by the same ratio the image is rendered
  const sizeUsed = Math.min(origW, origH) || 100;
  clip.scaleX = (renderedW / sizeUsed) || 1;
  clip.scaleY = (renderedH / sizeUsed) || 1;

  // If image rotated, set clip angle to match the image rotation
  if (typeof target.angle === "number") {
    clip.angle = target.angle;
  }

  // ensure fabric recalculates bounds
  if (typeof clip.setCoords === "function") clip.setCoords();
}
// --- END SMALL PATCH ---


    target.clipPath = clip;
    canvas.requestRenderAll();

    // 🔹 update React state so buttons re-render
    setSelectedShapeId(shapeId === "none" ? "none" : shapeId);
  };

  const handleRemoveCrop = () => {
    applyShape("none");
  };

  const handleDone = () => {
    onClose && onClose();
  };

  const handleCancel = () => {
    onClose && onClose();
  };

  // ---------- SVG PREVIEWS (for UI only) ----------

  const renderShapePreview = (id) => {
    const clipId = `crop-preview-${id}`;

    const getClipPath = () => {
      switch (id) {
        case "circle":
          return (
            <clipPath id={clipId}>
              <circle cx="40" cy="40" r="30" />
            </clipPath>
          );
        case "triangle":
          return (
            <clipPath id={clipId}>
              <polygon points="40,10 70,70 10,70" />
            </clipPath>
          );
        case "square":
          return (
            <clipPath id={clipId}>
              <rect x="14" y="14" width="52" height="52" />
            </clipPath>
          );
        case "roundedSquare":
          return (
            <clipPath id={clipId}>
              <rect x="14" y="14" width="52" height="52" rx="10" ry="10" />
            </clipPath>
          );
        case "heart":
          return (
            <clipPath id={clipId}>
              <path
                d="
                  M40 22
                  C32 10, 18 12, 18 24
                  C18 38, 32 50, 40 58
                  C48 50, 62 38, 62 24
                  C62 12, 48 10, 40 22
                  Z
                "
              />
            </clipPath>
          );
        case "star":
          return (
            <clipPath id={clipId}>
              <polygon points="40,8 48,30 72,30 52,44 60,68 40,54 20,68 28,44 8,30 32,30" />
            </clipPath>
          );
        case "hexagon":
          return (
            <clipPath id={clipId}>
              <polygon points="40,8 64,24 64,56 40,72 16,56 16,24" />
            </clipPath>
          );
        case "arch":
          return (
            <clipPath id={clipId}>
              <path d="M20,36 A20,20 0 0 1 60,36 L60,68 L20,68 Z" />
            </clipPath>
          );
        case "parallelogram":
          return (
            <clipPath id={clipId}>
              <polygon points="18,18 62,18 50,62 6,62" />
            </clipPath>
          );
        default:
          return null; // "none" => no clip
      }
    };

    const hasClip = id !== "none";
    const clipPathUrl = hasClip ? `url(#${clipId})` : undefined;

    return (
      <svg
        viewBox="0 0 80 80"
        className="crop-panel__shape-svg"
        aria-hidden="true"
      >
        <defs>{getClipPath()}</defs>

        {/* base card background */}
        <rect x="10" y="10" width="60" height="60" rx="8" fill="#f5f5f5" />

        {/* photo area with clip */}
        <g clipPath={clipPathUrl}>
          <rect x="10" y="10" width="60" height="60" fill="#d8ecff" />
          {/* sun */}
          <circle cx="40" cy="24" r="6" fill="#ffdb6b" />
          {/* hills */}
          <path
            d="M10 55 L28 36 L44 52 L56 44 L70 55 L70 70 L10 70 Z"
            fill="#4caf50"
          />
        </g>
      </svg>
    );
  };

  const shapeButton = (id, label) => (
    <button
      type="button"
      className={
        "crop-panel__shape-btn" +
        (selectedShapeId === id ? " crop-panel__shape-btn--active" : "")
      }
      onClick={() => applyShape(id)}
    >
      <div className="crop-panel__shape-preview">
        {renderShapePreview(id)}
      </div>
      <span className="crop-panel__shape-label">{label}</span>
    </button>
  );

  const SHAPES = [
    { id: "none", label: "None" },
    { id: "circle", label: "Circle" },
    { id: "triangle", label: "Triangle" },
    { id: "square", label: "Square" },
    { id: "roundedSquare", label: "Rounded square" },
    { id: "heart", label: "Heart" },
    { id: "star", label: "Star" },
    { id: "hexagon", label: "Hexagon" },
    { id: "arch", label: "Arch" },
    { id: "parallelogram", label: "Parallelogram" },
  ];

  return (
    <aside className="crop-panel" role="dialog" aria-label="Image crop">
      <div className="crop-panel__header">
        <h2 className="crop-panel__title">Crop</h2>
        <button
          className="crop-panel__close-btn"
          type="button"
          onClick={onClose}
          aria-label="Close"
        >
          ✕
        </button>
      </div>

      <div className="crop-panel__body">
        <div className="crop-panel__toggle-row">
          <label className="crop-panel__toggle">
            <input type="checkbox" defaultChecked disabled />
            <span>Lock aspect ratio</span>
          </label>
        </div>

        <hr className="crop-panel__divider" />

        <div className="crop-panel__section-title">Frames</div>

        <div className="crop-panel__grid">
          {SHAPES.map((s) => shapeButton(s.id, s.label))}
        </div>
      </div>

      <div className="crop-panel__footer">
        <button
          type="button"
          className="crop-panel__btn crop-panel__btn--ghost"
          onClick={handleRemoveCrop}
        >
          ✂ Remove crop
        </button>

        <div className="crop-panel__footer-right">
          <button
            type="button"
            className="crop-panel__btn crop-panel__btn--secondary"
            onClick={handleCancel}
          >
            Cancel
          </button>
          <button
            type="button"
            className="crop-panel__btn crop-panel__btn--primary"
            onClick={handleDone}
          >
            Done
          </button>
        </div>
      </div>
    </aside>
  );
}
