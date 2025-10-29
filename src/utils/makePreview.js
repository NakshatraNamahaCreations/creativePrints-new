// src/utils/makePreview.js
export async function renderTemplateDataURL({  palette, data, width, height }) {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");

  // background
  ctx.fillStyle = "#f3f3f3";
  ctx.fillRect(0, 0, width, height);

  // mock "card" on a scene like Vistaprint
  const cardW = Math.round(width * 0.78);
  const cardH = Math.round(height * 0.72);
  const x = Math.round((width - cardW) / 2);
  const y = Math.round((height - cardH) / 2);

  // card shadow + body
  ctx.shadowColor = "rgba(0,0,0,.10)";
  ctx.shadowBlur = 18;
  ctx.fillStyle = "#fff";
  roundRect(ctx, x, y, cardW, cardH, 12);
  ctx.fill();
  ctx.shadowBlur = 0;

  // sample blue rule + text (use palette)
  const accent = palette?.accent || "#4376AE";
  ctx.fillStyle = accent;
  ctx.fillRect(x + Math.round(cardW * 0.06), y + Math.round(cardH * 0.72), Math.round(cardW * 0.88), 3);

  ctx.fillStyle = "#2b3a55";
  ctx.font = "600 16px system-ui, -apple-system, Segoe UI, Roboto";
  ctx.fillText(data.companyName || "Company Name", x + Math.round(cardW * 0.28), y + Math.round(cardH * 0.28));
  ctx.font = "12px system-ui, -apple-system, Segoe UI, Roboto";
  ctx.fillStyle = "#6b7280";
  ctx.fillText(data.fullName || "Full Name", x + Math.round(cardW * 0.72), y + Math.round(cardH * 0.30));

  return canvas.toDataURL("image/png");
}

function roundRect(ctx, x, y, w, h, r) {
  const rr = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + rr, y);
  ctx.arcTo(x + w, y, x + w, y + h, rr);
  ctx.arcTo(x + w, y + h, x, y + h, rr);
  ctx.arcTo(x, y + h, x, y, rr);
  ctx.arcTo(x, y, x + w, y, rr);
  ctx.closePath();
}
