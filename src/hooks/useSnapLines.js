// -----------------------------------------------------------
// useSnapLines.js — ESLint-safe, React-safe, Fabric-safe
// -----------------------------------------------------------
import { useCallback, useRef } from "react";
import * as fabric from "fabric";



export default function useSnapLines(fabricRef) {
  const canvas = fabricRef?.current;

  // Keep line references over renders
  const hLineRef = useRef(null);
  const vLineRef = useRef(null);

  // Clear any existing snap lines
  const clearSnapLines = useCallback(() => {    
    if (!canvas) return;

    if (hLineRef.current) {
      canvas.remove(hLineRef.current);
      hLineRef.current = null;
    }

    if (vLineRef.current) {
      canvas.remove(vLineRef.current);
      vLineRef.current = null;
    }

    canvas.requestRenderAll();
  }, [canvas]);

  // Draw snap lines relative to canvas center
  const drawSnapLines = useCallback(
    (target) => {
      if (!canvas || !target) return;

      const canvasCenterX = canvas.width / 2;
      const canvasCenterY = canvas.height / 2;
      const objCenter = target.getCenterPoint();

      // Remove previous lines
      clearSnapLines();

      // Vertical line
      if (Math.abs(objCenter.x - canvasCenterX) < 8) {
        vLineRef.current = new fabric.Line(
          [canvasCenterX, 0, canvasCenterX, canvas.height],
          {
            stroke: "red",
            strokeWidth: 1,
            selectable: false,
            evented: false,
          }
        );
        canvas.add(vLineRef.current);
      }

      // Horizontal line
      if (Math.abs(objCenter.y - canvasCenterY) < 8) {
        hLineRef.current = new fabric.Line(
          [0, canvasCenterY, canvas.width, canvasCenterY],
          {
            stroke: "red",
            strokeWidth: 1,
            selectable: false,
            evented: false,
          }
        );
        canvas.add(hLineRef.current);
      }

      canvas.requestRenderAll();
    },
    [canvas, clearSnapLines]
  );

  return { drawSnapLines, clearSnapLines };
}
