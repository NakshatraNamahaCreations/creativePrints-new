// logical business-card dimensions & helpers

export function buildCardPx(dpi = 300) {
  // 89 × 51 mm (+ 3mm bleed each side is common; adjust if you want)
  const mmToPx = (mm) => Math.round((mm / 25.4) * dpi);

  const widthMM = 89;
  const heightMM = 51;

  const w = mmToPx(widthMM);
  const h = mmToPx(heightMM);

  // safe/bleed in base logical space (tweak as needed)
  const bleed = Math.round(mmToPx(3)); // 3mm
  const safePad = Math.round(mmToPx(4)); // 4mm

  return {
    widthMM,
    heightMM,
    w,
    h,
    aspect: w / h,
    bleed,
    safeBox: { x: bleed + safePad, y: bleed + safePad, w: w - (bleed + safePad) * 2, h: h - (bleed + safePad) * 2 },
  };
}

export const mm2px = (mm, dpi = 300) => (mm / 25.4) * dpi;
