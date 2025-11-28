// logical business-card dimensions & helpers
export function buildCardPx(opts = {}) {
  // opts: { dpi = 300, widthMM = 89, heightMM = 51, cornerRadiusMM = 0 }
  const dpi = opts.dpi ?? 300;
  const widthMM = opts.widthMM ?? 89;
  const heightMM = opts.heightMM ?? 51;
  const cornerRadiusMM = opts.cornerRadiusMM ?? 0;

  const mmToPx = (mm) => Math.round((mm / 25.4) * dpi);

  const w = mmToPx(widthMM);
  const h = mmToPx(heightMM);
  const cornerRadiusPx = mmToPx(cornerRadiusMM);

  const bleed = Math.round(mmToPx(3)); // 3mm
  const safePad = Math.round(mmToPx(4)); // 4mm

  return {
    widthMM,
    heightMM,
    w,
    h,
    aspect: w / h,
    bleed,
    safeBox: {
      x: bleed + safePad,
      y: bleed + safePad,
      w: w - (bleed + safePad) * 2,
      h: h - (bleed + safePad) * 2,
    },
    cornerRadiusMM,
    cornerRadiusPx,
    dpi,
  };
}

export const mm2px = (mm, dpi = 300) => (mm / 25.4) * dpi;
