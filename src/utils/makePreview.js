// src/utils/makePreview.js
export async function renderTemplateDataURL({ palette, data, width, height, shape = "standard" }) {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");

  // Base background
  ctx.fillStyle = "#f3f3f3";
  ctx.fillRect(0, 0, width, height);

  // Determine card size per shape
  let cardW, cardH;
  if (shape === "square") {
    cardW = Math.round(width * 0.75);
    cardH = Math.round(height * 0.75);
  } else if (shape === "rounded") {
    cardW = Math.round(width * 0.8);
    cardH = Math.round(height * 0.68);
  } else {
    // default (standard rectangle)
    cardW = Math.round(width * 0.84);
    cardH = Math.round(height * 0.65);
  }

  const x = Math.round((width - cardW) / 2);
  const y = Math.round((height - cardH) / 2);

  // Draw card shadow and body
  ctx.shadowColor = "rgba(0,0,0,0.1)";
  ctx.shadowBlur = 18;
  ctx.fillStyle = "#fff";
  roundRect(ctx, x, y, cardW, cardH, shape === "rounded" ? 18 : 8);
  ctx.fill();
  ctx.shadowBlur = 0;

  // Palette-based accent color
  const accent = palette?.accent || "#4376AE";
  const accent2 = palette?.accent2 || "#2C5282";

  // Accent bar (for standard & rounded)
  if (shape !== "square") {
    ctx.fillStyle = accent;
    ctx.fillRect(
      x + Math.round(cardW * 0.08),
      y + Math.round(cardH * 0.7),
      Math.round(cardW * 0.84),
      3
    );
  }

  // --- Text layout ---
  ctx.fillStyle = "#2b3a55";
  ctx.font = `600 ${Math.round(cardW * 0.06)}px system-ui, -apple-system, Segoe UI, Roboto`;
  ctx.fillText(
    data.companyName || "Company Name",
    x + Math.round(cardW * 0.1),
    y + Math.round(cardH * 0.25)
  );

  ctx.font = `${Math.round(cardW * 0.045)}px system-ui, -apple-system, Segoe UI, Roboto`;
  ctx.fillStyle = "#6b7280";
  ctx.fillText(
    data.fullName || "Full Name",
    x + Math.round(cardW * 0.1),
    y + Math.round(cardH * 0.38)
  );

  // --- Logo area (especially for square cards) ---
  const logoBoxSize = Math.round(cardW * 0.35);
  const logoX = x + Math.round((cardW - logoBoxSize) / 2);
  const logoY = y + Math.round(cardH * 0.1);

  if (shape === "square") {
    ctx.fillStyle = "#eaeaea";
    ctx.fillRect(logoX, logoY, logoBoxSize, logoBoxSize);
    ctx.fillStyle = "#888";
    ctx.font = `${Math.round(logoBoxSize * 0.2)}px Inter, sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("LOGO", logoX + logoBoxSize / 2, logoY + logoBoxSize / 2);
  }

  // --- Bottom info for all shapes ---
  ctx.fillStyle = accent2;
  ctx.font = `${Math.round(cardW * 0.04)}px system-ui, -apple-system, Segoe UI, Roboto`;
  ctx.textAlign = "left";
  ctx.fillText(
    data.web || "website.com",
    x + Math.round(cardW * 0.1),
    y + Math.round(cardH * 0.85)
  );

  return canvas.toDataURL("image/png");
}

// helper for rounded corners
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
