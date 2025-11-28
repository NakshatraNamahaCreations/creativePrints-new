// src/pages/Designer.jsx
import React from "react";
import { useNavigate, useParams } from "react-router-dom";

import DesignerHeader from "../components/DesignerHeader.jsx";
import SidebarAndCanvas from "../components/SidebarAndCanvas.jsx";
import useDesignerEngine from "./useDesignerEngine";

export default function Designer() {
  const { templateId } = useParams();
  const navigate = useNavigate();

  // use hook — DO NOT redeclare setShowPreview or showPreview locally
  const {
    templateBase,
    paletteIdx,
    setPaletteIdx,
   
    saving,
    saveError,
    handleNext,

    FIELD_DEFS,
    data,
    setData,
    runtimeEls,
    addNewTextField,
    deleteFieldByKey,
    deletedKeys,
    styleOverrides,
    setStyleOverrides,
    autoHideEmpty,
    setAutoHideEmpty,
    dragEnabled,
    setDragEnabled,

    CARD,
    side,
    setSide,
    canvasRef,
    showPreview,
    setShowPreview: setShowPreviewFromHook,
    fabricRef,
    activeEdit,
    setActiveEdit,
    editInputRef,
    commitActiveEdit,
  } = useDesignerEngine(templateId, navigate);

  // note: we destructured setShowPreview twice earlier in my quick split example.
  // to avoid redeclaration errors use only the hook-provided identifiers (above).
  // If you'd prefer a single name, remove either `setShowPreview` or `setShowPreviewFromHook`
  // and use the remaining one. Below we'll use `setShowPreviewFromHook`.

  return (
    <div className="p-4 relative">
      {!templateBase ? (
        <div className="p-6">Template not found.</div>
      ) : (
        <>
          <DesignerHeader
            templateBase={templateBase}
            paletteIdx={paletteIdx}
            setPaletteIdx={setPaletteIdx}
            setShowPreview={setShowPreviewFromHook}
            saving={saving}
            saveError={saveError}
            handleNext={handleNext}
          />

          <SidebarAndCanvas
            FIELD_DEFS={FIELD_DEFS}
            data={data}
            setData={setData}
            runtimeEls={runtimeEls}
            addNewTextField={addNewTextField}
            deleteFieldByKey={deleteFieldByKey}
            deletedKeys={deletedKeys}
            styleOverrides={styleOverrides}
            setStyleOverrides={setStyleOverrides}
            autoHideEmpty={autoHideEmpty}
            setAutoHideEmpty={setAutoHideEmpty}
            dragEnabled={dragEnabled}
            setDragEnabled={setDragEnabled}
            CARD={CARD}
            side={side}
            setSide={setSide}
            canvasRef={canvasRef}
            showPreview={showPreview}
            setShowPreview={setShowPreviewFromHook}
            fabricRef={fabricRef}
            activeEdit={activeEdit}
            setActiveEdit={setActiveEdit}
            editInputRef={editInputRef}
            commitActiveEdit={commitActiveEdit}
          />
        </>
      )}
    </div>
  );
}
