import * as FabricNS from "fabric";
const fabric = FabricNS.fabric ?? FabricNS.default ?? FabricNS;

export async function renderTemplateToFabric({
  canvas, template, palette, data, cardSize,
}) {
  const c = canvas;
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
        ? (parseFloat(v) / 100) * cardSize.w
        : (parseFloat(v) / 100) * cardSize.h;
    }
    return v;
  };

  const loadImage = (url, opts = {}) => {
    const maybe = fabric.Image.fromURL(url, opts);
    if (maybe && typeof maybe.then === "function") return maybe;
    return new Promise((resolve) =>
      fabric.Image.fromURL(url, (img) => resolve(img), opts)
    );
  };

  for (const el of (template.elements || [])) {
    if (el.type === "rect") {
      const widthPx  = el.w === "100%" ? cardSize.w : toPx(el.w, "x");
      const heightPx = el.h === "100%" ? cardSize.h : toPx(el.h, "y");
      c.add(new fabric.Rect({
        left: toPx(el.x, "x"),
        top: toPx(el.y, "y"),
        width: widthPx,
        height: heightPx,
        fill: resolveColor(el.fill),
        rx: el.rx ?? 0, ry: el.ry ?? 0,
        selectable: false, hasControls: false,
      }));
      continue;
    }

    if (el.type === "polygon") {
      const pts = (el.points || []).map((p) => ({
        x: toPx(p.x, "x"),
        y: toPx(p.y, "y"),
      }));
      c.add(new fabric.Polygon(pts, {
        left: 0, top: 0,
        fill: resolveColor(el.fill) || "transparent",
        stroke: resolveColor(el.stroke),
        strokeWidth: el.strokeWidth ?? 0,
        selectable: false, hasControls: false,
      }));
      continue;
    }

    if (el.type === "text" || el.type === "textbox") {
      const bound = el.bindTo ? (data[el.bindTo] ?? "") : (el.text ?? "");
      c.add(new fabric.Text(bound, {
        left: toPx(el.x, "x"),
        top:  toPx(el.y, "y"),
        fontFamily: el.fontFamily || "Inter, system-ui, Arial",
        fontWeight: el.fontWeight || 400,
        fontSize: el.fontSize || 14,
        fill: resolveColor(el.fill) || "#111",
        selectable: false, hasControls: false,
      }));
      continue;
    }

    if (el.type === "image") {
      const left = toPx(el.x, "x");
      const top  = toPx(el.y, "y");
      const boxW = toPx(el.w, "x");
      const boxH = toPx(el.h, "y");

      const url = el.bindTo ? data[el.bindTo] : el.src;
      if (!url) {
        c.add(new fabric.Rect({ left, top, width: boxW, height: boxH, fill: "#EEE", stroke: "#DDD" }));
        continue;
      }
      const isBlob = String(url).startsWith("blob:");
      const opts = isBlob ? {} : { crossOrigin: "anonymous" };
      const img = await loadImage(url, opts);
      const iw = img.width || 1;
      const ih = img.height || 1;
      const scale = Math.min(boxW / iw, boxH / ih);
      img.set({ left, top, scaleX: scale, scaleY: scale, selectable: false, hasControls: false });
      c.add(img);
    }
  }

  c.renderAll();
}
