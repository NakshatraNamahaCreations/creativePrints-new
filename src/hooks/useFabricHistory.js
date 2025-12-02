// -------------------------------------------------------------
// useFabricHistory.js — Fabric.js Undo / Redo PRO Version
// -------------------------------------------------------------
import { useRef, useCallback } from "react";

export default function useFabricHistory(fabricRef) {
  const history = useRef([]);
  const redoStack = useRef([]);
  const isRestoring = useRef(false);

  // -------------------------------------------
  // SAVE CURRENT CANVAS STATE INTO HISTORY
  // -------------------------------------------
  const saveState = useCallback(() => {
    const canvas = fabricRef.current;
    if (!canvas || isRestoring.current) return;

    const json = canvas.toDatalessJSON([
      "data",
      "bindTo",
      "fontFamily",
      "fontSize",
      "fontWeight",
      "fill",
      "opacity",
      "shadow",
      "stroke",
      "strokeWidth",
      "lineHeight",
      "charSpacing",
      "textAlign",
    ]);

    history.current.push(json);
    redoStack.current = []; // Clear redo stack on new action
  }, [fabricRef]);

  // -------------------------------------------
  // RESTORE A SAVED STATE
  // -------------------------------------------
  const restoreState = useCallback(
    (json, pushToRedo = false) => {
      const canvas = fabricRef.current;
      if (!canvas) return;

      isRestoring.current = true;

      if (pushToRedo) {
        const current = canvas.toDatalessJSON([
          "data",
          "bindTo",
          "fontFamily",
          "fontSize",
          "fontWeight",
          "fill",
          "opacity",
          "shadow",
          "stroke",
          "strokeWidth",
          "lineHeight",
          "charSpacing",
          "textAlign",
        ]);
        redoStack.current.push(current);
      }

      canvas.loadFromJSON(json, () => {
        canvas.renderAll();
        isRestoring.current = false;
      });
    },
    [fabricRef]
  );

  // -------------------------------------------
  // UNDO
  // -------------------------------------------
  const undo = useCallback(() => {
    if (history.current.length <= 1) return;

    const current = history.current.pop();
    const prev = history.current[history.current.length - 1];

    redoStack.current.push(current);
    restoreState(prev);
  }, [restoreState]);

  // -------------------------------------------
  // REDO
  // -------------------------------------------
  const redo = useCallback(() => {
    if (redoStack.current.length === 0) return;

    const json = redoStack.current.pop();
    history.current.push(json);
    restoreState(json);
  }, [restoreState]);

  return {
    saveState,
    undo,
    redo,
  };
}
