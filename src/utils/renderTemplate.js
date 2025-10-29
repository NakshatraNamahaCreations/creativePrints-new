import * as FabricNS from "fabric";
const fabric = (FabricNS.fabric ?? FabricNS.default ?? FabricNS);

/**
 * Renders a template side ('front' | 'back') into a given <canvas>.
 * - template.elements       → front
 * - template.backElements   → back (optional)
 * - palette: { bg, primary, accent }
 * - data:    bound text/logo (companyName, fullName, jobTitle, logoUrl, etc.)
 */
export async function renderTemplateToCanvas({ template, side = "front", palette, data, canvas }) {
  if (!template || !canvas) return null;

  const c = new fabric.StaticCanvas(canvas, {
    backgroundColor: "#fff",
    enableRetinaScaling: true,
    renderOnAddRemove: true,
    preserveObjectStacking: true,
  });
   // force background to be committed before drawing objects
    await new Promise((r) => {
   c.setBackgroundColor("#fff", () => {
     c.renderAll();
     r();
   });
 });

  const W = canvas.width;
  const H = canvas.height;

  const resolveColor = (val) => {
    if (!val) return val;
    if (val === "{bg}") return palette?.bg ?? "#fff";
    if (val === "{primary}") return palette?.primary ?? "#111";
    if (val === "{accent}") return palette?.accent ?? "#06f";
    return val;
  };

  const toPx = (v, axis) => {
    if (typeof v === "string" && v.endsWith("%")) {
      const pct = parseFloat(v) / 100;
      return axis === "x" ? pct * W : pct * H;
    }
    return v;
  };

  c.clear();

  const elements = side === "back" ? (template.backElements ?? []) : (template.elements ?? []);

  // Render in sequence; await images
  for (const el of elements) {
    if (el.type === "rect") {
      c.add(new fabric.Rect({
        left: toPx(el.x, "x"),
        top: toPx(el.y, "y"),
        width: el.w === "100%" ? W : el.w,
        height: el.h === "100%" ? H : el.h,
        fill: resolveColor(el.fill),
        selectable: false, evented: false,
      }));
    }

    if (el.type === "text") {
      const txt = new fabric.Text(el.bindTo ? (data?.[el.bindTo] ?? el.text ?? "") : (el.text ?? ""), {
        left: toPx(el.x, "x"),
        top: toPx(el.y, "y"),
        fontFamily: el.fontFamily || "Inter, system-ui, Arial",
        fontWeight: el.fontWeight || 400,
        fontSize: el.fontSize || 14,
        fill: resolveColor(el.fill) || "#111",
        selectable: false, evented: false,
      });
      c.add(txt);
    }

    if (el.type === "image") {
      const url = el.bindTo ? data?.[el.bindTo] : el.src;
      if (!url) continue;

      // eslint-disable-next-line no-await-in-loop
      await new Promise((resolve) => {
        const left = toPx(el.x, "x");
        const top = toPx(el.y, "y");
        const w = el.w, h = el.h;

        fabric.Image.fromURL(url, (img) => {
          img.set({ left, top, selectable: false, evented: false });
          img.scaleToWidth(w);
          if (img.getScaledHeight() > h) img.scaleToHeight(h);

          if (el.mask === "circle" || el.mask === "rounded") {
            const clip = new fabric.Rect({
              left, top, width: w, height: h,
              rx: el.mask === "rounded" ? 8 : Math.min(w, h) / 2,
              ry: el.mask === "rounded" ? 8 : Math.min(w, h) / 2,
            });
            img.clipPath = clip;
          }
          c.add(img);
          resolve();
        }, { crossOrigin: "anonymous" });
      });
    }
  }

  c.renderAll();
  return c.toDataURL({ format: "png", quality: 0.92 });
}
