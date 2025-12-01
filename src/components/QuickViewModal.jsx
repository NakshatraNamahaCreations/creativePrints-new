import React, { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import * as FabricNS from "fabric";
import { findTemplate } from "../templates"; // your index.js
import { renderTemplateToFabric } from "../utils/renderTemplate"; // the renderer we built earlier
import { mm2px } from "../utils/cardDims"; // your mm→px helper
import { useNavigate } from "react-router-dom";

const fabric = (FabricNS.fabric ?? FabricNS.default ?? FabricNS);

const DPI = 300;
const CARD_W_MM = 89;
const CARD_H_MM = 51;
const CARD_W = mm2px(CARD_W_MM, DPI);
const CARD_H = mm2px(CARD_H_MM, DPI);

export default function QuickViewModal({
  open,
  onClose,
  templateId,
  initialPaletteId,
  priceLabel = "100 from ₹200.00",
  productSlug = "standard", // used for building designer URL
}) {
  const navigate = useNavigate();
  const template = useMemo(() => findTemplate(templateId), [templateId]);
  const [side, setSide] = useState("front");
  const [paletteId, setPaletteId] = useState(
    initialPaletteId || template?.palettes?.[0]?.id || ""
  );

  const palette = useMemo(
    () => template?.palettes?.find((p) => p.id === paletteId) || template?.palettes?.[0],
    [template, paletteId]
  );

  // minimal preview data; on Designer this comes from form
  const data = useMemo(
    () => ({
      companyName: "Company Name",
      fullName: "Full Name",
      jobTitle: "Job Title",
      logoUrl: "", // placeholder
    }),
    []
  );

  const canvasRef = useRef(null);
  const fabricRef = useRef(null);

  // init Fabric
  useEffect(() => {
    if (!open || !canvasRef.current) return;

    const c = new fabric.Canvas(canvasRef.current, {
      selection: false,
      preserveObjectStacking: true,
    });
    fabricRef.current = c;

    // HiDPI crispness; canvas CSS size controlled by container
    const ratio = window.devicePixelRatio || 1;
    c.setWidth(CARD_W);
    c.setHeight(CARD_H);
    c.setZoom(ratio);

    return () => {
      c.dispose();
      fabricRef.current = null;
    };
  }, [open]);

  // render the preview
// render the preview
useEffect(() => {
  if (!open || !template || !palette || !fabricRef.current) return;
  const c = fabricRef.current;
  c.clear();

  // simple white rounded card
  const cardPanel = new fabric.Rect({
    left: 0,
    top: 0,
    width: CARD_W,
    height: CARD_H,
    rx: mm2px(3, DPI),
    ry: mm2px(3, DPI),
    fill: "#ffffff",
    selectable: false,
    evented: false,
  });
  c.add(cardPanel);

  // 👇 pick the correct side definition
  const sideDef = template.sides?.[side] || template.sides?.front;

  // 👇 match renderTemplateToFabric signature
  renderTemplateToFabric({
    canvas: c,
    template: sideDef,
    palette,
    data,
    cardSize: { w: CARD_W, h: CARD_H },
  });

  c.renderAll();
  // ❗ notice: no `data` in deps (it never changes here anyway)
}, [open, template, palette, side]);


  if (!open || !template) return null;

  const gotoDesigner = () => {
    navigate(`/designer/${template.id}?product=${productSlug}&palette=${palette.id}`);
  };

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      aria-modal="true"
      role="dialog"
      aria-label="Quick view"
    >
      {/* backdrop */}
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />

      {/* modal panel */}
      <div className="relative bg-white w-[min(1100px,95vw)] rounded-2xl shadow-xl overflow-hidden grid grid-cols-1 md:grid-cols-[1fr_380px]">
        {/* left: preview area */}
        <div className="swan-col-8 swan-bgc-strong preview-wrapper p-6">
          <div id="quickview-preview" className="quick-view-preview">
            <div className="vortex-container">
              <div className="flex items-center justify-center bg-[#f7f7f7] rounded-xl p-6">
                <canvas
                  aria-label={`Design Preview for ${template.name}`}
                  ref={canvasRef}
                  width={CARD_W}
                  height={CARD_H}
                  // match Vistaprint shadow look
                  style={{
                    maxWidth: "100%",
                    maxHeight: "600px",
                    filter:
                      "drop-shadow(rgba(0,0,0,0.05) 0px 0px 10px) drop-shadow(rgba(0,0,0,0.04) 0px 2px 2px)",
                    borderRadius: "10px",
                  }}
                />
              </div>

              <span className="sr-only">
                Colours: {palette?.id} – {side === "front" ? "Front" : "Back"} – {template.name}
              </span>

              {/* Front / Back toggles */}
              <div aria-label="Preview" role="radiogroup" className="mt-4 flex justify-center">
                <div className="inline-flex gap-2">
                  <label className="inline-flex items-center gap-2 px-3 py-2 rounded-md border">
                    <input
                      type="radio"
                      name="preview-side"
                      value="front"
                      checked={side === "front"}
                      onChange={() => setSide("front")}
                    />
                    Front
                  </label>
                  <label className="inline-flex items-center gap-2 px-3 py-2 rounded-md border">
                    <input
                      type="radio"
                      name="preview-side"
                      value="back"
                      checked={side === "back"}
                      onChange={() => setSide("back")}
                    />
                    Back
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* right: info column */}
        <div className="swan-col-4 content-column p-6 flex flex-col">
          {/* close */}
          <button
            onClick={onClose}
            aria-label="Close"
            className="absolute right-3 top-3 inline-flex items-center justify-center h-9 w-9 rounded-full hover:bg-black/5"
          >
            ✕
            <span className="sr-only">Close</span>
          </button>

          <h2 className="text-2xl font-bold">{template.name}</h2>

          <div className="mt-4">
            <div className="text-base">
              <span className="opacity-70">100 from </span>
              <span className="font-semibold">{priceLabel.replace("100 from ", "")}</span>
            </div>
          </div>

          {/* shipping line (optional) */}
          <div className="text-sm mt-2">
            <button type="button" className="underline underline-offset-2">
              FREE Shipping
            </button>
          </div>

          {/* color swatches */}
          <div className="mt-6">
            <div className="text-sm font-semibold mb-2">Colours</div>
            <div role="radiogroup" className="flex gap-3">
              {(template.palettes || []).map((p) => (
                <label key={p.id} className="cursor-pointer">
                  <input
                    type="radio"
                    name="palette"
                    className="sr-only"
                    checked={paletteId === p.id}
                    onChange={() => setPaletteId(p.id)}
                  />
                  <span
                    title={p.id}
                    className={`inline-block h-7 w-7 rounded-full ring-2 ${
                      paletteId === p.id ? "ring-black" : "ring-transparent"
                    }`}
                    style={{
                      backgroundColor: p.bg,
                      boxShadow: `inset 0 0 0 8px ${p.accent}`,
                    }}
                  />
                </label>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="mt-auto pt-6">
            <button
              onClick={gotoDesigner}
              className="w-full h-12 rounded-md bg-sky-500 text-white font-semibold hover:bg-sky-600"
            >
              Edit my design
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
