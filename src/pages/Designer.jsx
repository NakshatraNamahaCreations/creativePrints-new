import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import * as FabricNS from "fabric";
import { findTemplate } from "../templates";
import { buildCardPx } from "../utils/cardDims";

// Normalize Fabric across v4/v5/v6
const fabric = FabricNS.fabric ?? FabricNS.default ?? FabricNS;

// Cross-version image loader (works for Fabric v4/v5/v6)
const loadFabricImage = (url, opts = {}) => {
  const maybe = fabric.Image.fromURL(url, opts);
  if (maybe && typeof maybe.then === "function") return maybe; // v6+
  return new Promise((resolve) =>
    fabric.Image.fromURL(url, (img) => resolve(img), opts) // v4/v5
  );
};

// Standard card dims helper (keeps aspect consistent)
const CARD = buildCardPx(300);

// Clamp text to max width by reducing font size
const clampText = (text, canvasText, maxWidth) => {
  if (!maxWidth) return text;
  canvasText.set({ text });
  while (canvasText.getScaledWidth() > maxWidth && canvasText.fontSize > 8) {
    canvasText.set({ fontSize: canvasText.fontSize - 1 });
  }
  return canvasText.text;
};

// Sidebar rows ordering (Vistaprint-like)
const DEFAULT_FIELD_ORDER = [
  ["Full Name", "fullName", "text"],
  ["Job Title", "jobTitle", "text"],
  ["Email / Other", "email", "email"],
  ["Company Name", "companyName", "text"],


  ["Phone / Other", "phone", "tel"],
  ["Fax / Other", "fax", "text"],
  ["Address Line 1", "address1", "text"],
  ["Address Line 2", "address2", "text"],
  ["City / State / PIN", "cityStatePin", "text"],
  ["Web / Other", "web", "url"],
];



export default function Designer() {
  const { templateId } = useParams();
  const navigate = useNavigate();

  // Base template
  const templateBase = useMemo(() => findTemplate(templateId), [templateId]);

  // Palette via ?palette= (not editable here; just honors URL or template default)
  const urlParams = new URLSearchParams(
    typeof window !== "undefined" ? window.location.search : ""
  );
  const initialPalette = urlParams.get("palette") || "";
  const paletteId = useMemo(
    () => initialPalette || templateBase?.palettes?.[0]?.id || "",
    [initialPalette, templateBase]
  );
  const palette = useMemo(
    () =>
      templateBase?.palettes?.find((p) => p.id === paletteId) ||
      templateBase?.palettes?.[0],
    [templateBase, paletteId]
  );

  // Runtime (user-added) elements (for "New Text Field")
  const [runtimeEls, setRuntimeEls] = useState([]);

  // All bindable data for the design
  const [data, setData] = useState({
    companyName: "Company Name",

    fullName: "Full Name",
    jobTitle: "Job Title",
    email: "Email / Other",
    address1: "Address Line 1",
    address2: "Address Line 2",
    cityStatePin: "City, State – PIN",
    phone: "Phone / Other",
    fax: "Fax / Other",
    web: "Web / Other",
    logoUrl: "", 
    office: "Office Address",
     Company: "Company",
     name:"Name"
  });

  // Fabric canvas
  const canvasRef = useRef(null);
  const fabricRef = useRef(null);

  // Init canvas (once)
  useEffect(() => {
    if (!canvasRef.current) return;

    const c = new fabric.Canvas(canvasRef.current, {
      backgroundColor: "#fff",
      preserveObjectStacking: true,
    });
    fabricRef.current = c;

    const ratio = window.devicePixelRatio || 1;
    c.setHeight(CARD.h);
    c.setWidth(CARD.w);
    c.setZoom(ratio);

    return () => c.dispose();
  }, []);

  // Unified template = base + runtime-added text fields
  const template = useMemo(() => {
    if (!templateBase) return null;
    return {
      ...templateBase,
      elements: [...(templateBase.elements || []), ...runtimeEls],
    };
  }, [templateBase, runtimeEls]);

  // Render template to canvas whenever inputs change
  useEffect(() => {
    if (!template || !fabricRef.current) return;
    const c = fabricRef.current;
    c.clear();

    const resolveColor = (val) => {
      if (!val) return val;
      if (val === "{bg}") return palette?.bg || "#fff";
      if (val === "{primary}") return palette?.primary || "#111";
      if (val === "{accent}") return palette?.accent || "#06f";
      if (val === "{accent2}") return palette?.accent2 || palette?.accent || "#06f";
      return val;
    };

    const toPx = (v, axis) => {
      if (typeof v === "string" && v.endsWith("%")) {
        return axis === "x"
          ? (parseFloat(v) / 100) * CARD.w
          : (parseFloat(v) / 100) * CARD.h;
      }
      return v;
    };

    (template.elements || []).forEach((el) => {
      // Rect
      if (el.type === "rect") {
        const widthPx = el.w === "100%" ? CARD.w : toPx(el.w, "x");
        const heightPx = el.h === "100%" ? CARD.h : toPx(el.h, "y");
        c.add(
          new fabric.Rect({
            left: toPx(el.x, "x"),
            top: toPx(el.y, "y"),
            width: widthPx,
            height: heightPx,
            fill: resolveColor(el.fill),
            rx: el.rounded
              ? typeof el.rounded === "number"
                ? el.rounded
                : 8
              : el.rx ?? 0,
            ry: el.rounded
              ? typeof el.rounded === "number"
                ? el.rounded
                : 8
              : el.ry ?? 0,
            selectable: !!el.editable,
            hasControls: !!el.editable,
          })
        );
      }

      // Polygon
      if (el.type === "polygon") {
        const pts = (el.points || []).map((p) => ({
          x: toPx(p.x, "x"),
          y: toPx(p.y, "y"),
        }));
        c.add(
          new fabric.Polygon(pts, {
            left: 0,
            top: 0,
            fill: resolveColor(el.fill) || "transparent",
            stroke: resolveColor(el.stroke),
            strokeWidth: el.strokeWidth ?? 0,
            selectable: !!el.editable,
            hasControls: !!el.editable,
          })
        );
      }

      // Text
      if (el.type === "text" || el.type === "textbox") {
        const txt = new fabric.Text(el.text || "", {
          left: toPx(el.x, "x"),
          top: toPx(el.y, "y"),
          fontFamily: el.fontFamily || "Inter, system-ui, Arial",
          fontWeight: el.fontWeight || 400,
          fontSize: el.fontSize || 14,
          fill: resolveColor(el.fill) || "#111",
          selectable: !!el.editable,
          hasControls: !!el.editable,
        });

        const bound = el.bindTo ? data[el.bindTo] ?? "" : el.text ?? "";
        txt.set({ text: bound });
        if (el.maxWidth) clampText(txt.text, txt, el.maxWidth);
        c.add(txt);
      }

      // Image
      if (el.type === "image") {
        const left = toPx(el.x, "x");
        const top = toPx(el.y, "y");
        const boxW = toPx(el.w, "x");
        const boxH = toPx(el.h, "y");

        const url = el.bindTo ? data[el.bindTo] : el.src;
        if (!url) {
          c.add(
            new fabric.Rect({
              left,
              top,
              width: boxW,
              height: boxH,
              fill: "#EEE",
              stroke: "#DDD",
            })
          );
          return;
        }

        const isBlob = String(url).startsWith("blob:");
        const opts = isBlob ? {} : { crossOrigin: "anonymous" };

        loadFabricImage(url, opts).then((img) => {
          const iw = img.width || 1;
          const ih = img.height || 1;
          const scale = Math.min(boxW / iw, boxH / ih);

          img.set({
            left,
            top,
            scaleX: scale,
            scaleY: scale,
            selectable: !!el.editable,
            hasControls: !!el.editable,
          });

          if (el.mask === "circle" || el.mask === "rounded") {
            const clip =
              el.mask === "circle"
                ? new fabric.Circle({
                    radius: Math.min(boxW, boxH) / 2 / scale,
                    left: (boxW / 2) / scale,
                    top: (boxH / 2) / scale,
                    originX: "center",
                    originY: "center",
                  })
                : new fabric.Rect({
                    width: boxW / scale,
                    height: boxH / scale,
                    rx: 8 / scale,
                    ry: 8 / scale,
                    left: 0,
                    top: 0,
                    originX: "left",
                    originY: "top",
                  });
            clip.absolutePositioned = false;
            img.clipPath = clip;
          }

          c.add(img);
          img.bringToFront();
          c.requestRenderAll();
        });
      }
    });

    c.renderAll();
  }, [template, palette, data]);

  // Preview modal toggle
  const [showPreview, setShowPreview] = useState(false);

  // Add an extra text field near the bottom-left (Vistaprint-like)
  const addNewTextField = () => {
    const bindTo = `custom_${Date.now()}`;
    const existingCustoms = runtimeEls.filter(
      (e) => e.type === "text" && String(e.bindTo || "").startsWith("custom_")
    ).length;
    const yPct = 74 + existingCustoms * 5; // 74%, 79%, 84%, ...

    const newEl = {
      type: "text",
      bindTo,
      x: "14%",
      y: `${yPct}%`,
      fontSize: 12,
      fontWeight: 400,
      fill: "#231F20",
      editable: true,
    };
    setRuntimeEls((els) => [...els, newEl]);
    setData((v) => ({ ...v, [bindTo]: "New text" }));
  };

  const handleNext = () => {
    navigate("/review"); // wire this to your flow
  };

  if (!templateBase) return <div className="p-6">Template not found.</div>;

  return (
    <div className="p-4">
      {/* Header actions */}
      <div className="flex items-center justify-between mb-4">
        <div className="text-sm opacity-70">My Projects • Standard Visiting Cards</div>
        <div className="flex items-center gap-3">
          <button className="px-3 py-2 border rounded" onClick={() => setShowPreview(true)}>
            Preview
          </button>
          <button className="px-3 py-2 border rounded bg-black text-white" onClick={handleNext}>
            Next
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[340px_1fr] gap-6">
        {/* Sidebar */}
        <aside className="border rounded-xl p-4 bg-white">
          <h3 className="font-semibold text-lg mb-3">Text</h3>

          <div className="mt-3 space-y-3 h-auto overflow-visible pr-1">
            {DEFAULT_FIELD_ORDER.map(([label, key, type]) => (
              <label key={key} className="block">
           
                <input
                  type={type}
                  placeholder={label}
                  className="mt-1 w-full border rounded px-3 py-1"
                  value={data[key] ?? ""}
                  onChange={(e) =>
                    setData((v) => ({ ...v, [key]: e.target.value }))
                  }
                />
              </label>
            ))}

            {/* Custom fields */}
            {runtimeEls
              .filter(
                (e) =>
                  e.type === "text" &&
                  String(e.bindTo || "").startsWith("custom_")
              )
              .map((el) => (
                <label key={el.bindTo} className="block">
                  <input
                    className="mt-1 w-full border rounded px-3 py-2"
                    value={data[el.bindTo] ?? ""}
                    onChange={(e) =>
                      setData((v) => ({ ...v, [el.bindTo]: e.target.value }))
                    }
                  />
                </label>
              ))}

            <button
              type="button"
              className="w-full mt-2 py-2 rounded bg-black text-white"
              onClick={addNewTextField}
            >
              New Text Field
            </button>

            <label className="block mt-4">
              <span className="text-xs text-gray-600">Upload Logo (JPG/PNG/SVG)</span>
              <input
                type="file"
                accept="image/*"
                className="mt-1 w-full border rounded px-3 py-2"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  const url = URL.createObjectURL(file); // blob: URL
                  setData((v) => ({ ...v, logoUrl: url }));
                }}
              />
            </label>
          </div>
        </aside>

        {/* Canvas */}
        <section className="flex items-center justify-center">
          <div className="rounded-xl border bg-white p-4 shadow">
            <canvas ref={canvasRef} width={CARD.w} height={CARD.h} />
            <div className="text-center text-xs text-gray-500 mt-2">
              Standard {CARD.widthMM}×{CARD.heightMM} mm preview (screen px)
            </div>
          </div>
        </section>
      </div>

      {/* Preview modal */}
      {showPreview && (
        <div
          className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4"
          onClick={() => setShowPreview(false)}
        >
          <div
            className="bg-white rounded-xl p-4 max-w-[95vw]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-3">
              <h4 className="font-semibold">Preview</h4>
              <button
                className="px-3 py-1 border rounded"
                onClick={() => setShowPreview(false)}
              >
                Close
              </button>
            </div>
            <canvas
              ref={(node) => {
                if (!node || !fabricRef.current) return;
                const src = fabricRef.current.toCanvasElement();
                const ctx = node.getContext("2d");
                node.width = src.width;
                node.height = src.height;
                ctx.drawImage(src, 0, 0);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
