// src/utils/cardDims.js

// mm → px with optional DPI (default 300)
// rounded to nearest integer, good enough for print layouts
export const mm2px = (mm, dpi = 300) => Math.round((mm / 25.4) * dpi);

/**
 * Generic print-size helper.
 * Use this when you want any rectangular product:
 * visiting cards, letterheads, flyers, etc.
 *
 * opts:
 *  - widthMM, heightMM (required)
 *  - dpi (default 300)
 *  - cornerRadiusMM (default 0)
 *  - bleedMM (default 3)
 *  - safePadMM (default 4)
 */
export function buildPrintPx(opts = {}) {
  const {
    dpi = 300,
    widthMM,
    heightMM,
    cornerRadiusMM = 0,
    bleedMM = 3,
    safePadMM = 4,
  } = opts;

  if (!widthMM || !heightMM) {
    throw new Error("buildPrintPx: widthMM and heightMM are required");
  }

  const w = mm2px(widthMM, dpi);
  const h = mm2px(heightMM, dpi);
  const cornerRadiusPx = mm2px(cornerRadiusMM, dpi);
  const bleed = mm2px(bleedMM, dpi);
  const safePad = mm2px(safePadMM, dpi);

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

/**
 * Business card helper (backwards compatible).
 * Defaults:
 *  - 89×51mm
 *  - 3mm bleed
 *  - 4mm safe margin
 */
export function buildCardPx(opts = {}) {
  const {
    dpi = 300,
    widthMM = 89,
    heightMM = 51,
    cornerRadiusMM = 0,
  } = opts;

  return buildPrintPx({
    dpi,
    widthMM,
    heightMM,
    cornerRadiusMM,
    bleedMM: 3,
    safePadMM: 4,
  });
}

/**
 * Letterhead helper – useful for your Premium Letterhead product.
 * Defaults to A4 (210×297mm).  
 * Change to 215×280mm etc. if you want a different standard.
 */
export function buildLetterheadPx(opts = {}) {
  const {
    dpi = 300,
    widthMM = 210,   // A4 width
    heightMM = 297,  // A4 height
    cornerRadiusMM = 0,
  } = opts;

  return buildPrintPx({
    dpi,
    widthMM,
    heightMM,
    cornerRadiusMM,
    bleedMM: 3,
    safePadMM: 6, // slightly larger safe zone for letterhead
  });
}
