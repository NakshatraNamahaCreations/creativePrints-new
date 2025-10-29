// src/components/TemplatePreview.jsx
import React, { useEffect, useMemo, useRef } from "react";
import * as FabricNS from "fabric";
import { findTemplate } from "../templates";
// import { buildCardPx } from "../utils/cardDims";

const fabric = (FabricNS.fabric ?? FabricNS.default ?? FabricNS);
const CARD = { w: 500, h: 400 }; // your fixed width & height in pixels


export default function TemplatePreview({
  templateId,
  paletteId,
  data = {},
  width = 460,         // CSS width of the preview (keeps aspect)
  className = "",
}) {
  const template = useMemo(() => findTemplate(templateId), [templateId]);
  const canvasRef = useRef(null);
  const fabricRef = useRef(null);

  // init once
  useEffect(() => {
    if (!canvasRef.current) return;
    const c = new fabric.Canvas(canvasRef.current, {
      backgroundColor: "#fff",
      preserveObjectStacking: true,
      selection: false,
    });
    fabricRef.current = c;

    // keep logical size = CARD.w x CARD.h, scale via zoom for crisp preview
    const dpr = window.devicePixelRatio || 1;
    const scale = width / CARD.w;

    c.setWidth(CARD.w);
    c.setHeight(CARD.h);
    c.setZoom(dpr * scale);

    // set CSS size to target width (height by aspect)
    canvasRef.current.style.width = `${CARD.w * scale}px`;
    canvasRef.current.style.height = `${CARD.h * scale}px`;

    return () => c.dispose();
  }, [width]);

  // render template (read-only)
  useEffect(() => {
    const c = fabricRef.current;
    if (!template || !c) return;
    c.clear();

    const palette =
      template.palettes?.find((p) => p.id === paletteId) ||
      template.palettes?.[0] || {};

    const resolveColor = (val) => {
      if (!val) return val;
      if (val === "{bg}") return palette.bg || "#fff";
      if (val === "{primary}") return palette.primary || "#111";
      if (val === "{accent}") return palette.accent || "#06f";
      if (val === "{accent2}") return palette.accent2 || palette.accent || "#06f";
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
      // rect
      if (el.type === "rect") {
        const rect = new fabric.Rect({
          left: toPx(el.x, "x"),
          top: toPx(el.y, "y"),
          width: el.w === "100%" ? CARD.w : toPx(el.w, "x"),
          height: el.h === "100%" ? CARD.h : toPx(el.h, "y"),
          fill: resolveColor(el.fill),
          rx: el.rounded ? (typeof el.rounded === "number" ? el.rounded : 8) : (el.rx ?? 0),
          ry: el.rounded ? (typeof el.rounded === "number" ? el.rounded : 8) : (el.ry ?? 0),
          opacity: el.opacity ?? 1,
          selectable: false,
          evented: false,
          shadow: el.shadow
            ? new fabric.Shadow({
                color: el.shadow.color ?? "rgba(0,0,0,0.18)",
                blur: el.shadow.blur ?? 18,
                offsetX: el.shadow.offsetX ?? 0,
                offsetY: el.shadow.offsetY ?? 6,
              })
            : undefined,
        });
        c.add(rect);
      }

      // polygon
      if (el.type === "polygon") {
        const pts = (el.points || []).map((p) => ({
          x: toPx(p.x, "x"),
          y: toPx(p.y, "y"),
        }));
        const poly = new fabric.Polygon(pts, {
          left: 0,
          top: 0,
          fill: resolveColor(el.fill) || "transparent",
          stroke: resolveColor(el.stroke),
          strokeWidth: el.strokeWidth ?? 0,
          selectable: false,
          evented: false,
        });
        c.add(poly);
      }

      // text
      if (el.type === "text" || el.type === "textbox") {
        const bound = el.bindTo ? (data[el.bindTo] ?? el.text ?? "") : (el.text ?? "");
        const txt = new fabric.Text(String(bound), {
          left: toPx(el.x, "x"),
          top: toPx(el.y, "y"),
          fontFamily: el.fontFamily || "Inter, system-ui, Arial",
          fontWeight: el.fontWeight || 400,
          fontSize: el.fontSize || 14,
          fill: resolveColor(el.fill) || "#111",
          selectable: false,
          evented: false,
        });
        c.add(txt);
      }

      // image
      if (el.type === "image") {
        const left = toPx(el.x, "x");
        const top = toPx(el.y, "y");
        const w = toPx(el.w, "x");
        const h = toPx(el.h, "y");
        const url = el.bindTo ? data[el.bindTo] : el.src;

        const drawPh = () =>
          c.add(
            new fabric.Rect({
              left, top, width: w, height: h,
              rx: el.mask === "rounded" ? 8 : 0,
              fill: "#F0F0F0", stroke: "#DDD",
              selectable: false, evented: false,
            })
          );

        if (!url) return drawPh();

        fabric.Image.fromURL(
          url,
          (img) => {
            img.set({ left, top, selectable: false, evented: false });
            img.scaleToWidth(w);
            if (img.getScaledHeight() > h) img.scaleToHeight(h);
            if (el.mask === "circle" || el.mask === "rounded") {
              img.clipPath = new fabric.Rect({
                left, top, width: w, height: h,
                rx: el.mask === "rounded" ? 8 : Math.min(w, h) / 2,
                ry: el.mask === "rounded" ? 8 : Math.min(w, h) / 2,
              });
            }
            c.add(img);
          },
          { crossOrigin: "anonymous" }
        );
      }
    });

    c.renderAll();
  }, [template, paletteId, data]);

  if (!template) return null;
  return <canvas ref={canvasRef} className={className} aria-label={`${template.name} preview`} />;
}
