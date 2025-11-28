// src/components/SidebarAndCanvas.jsx
import React from "react";
import TrashIcon from "./TrashIcon.jsx";

export default function SidebarAndCanvas({
  // data / form
  FIELD_DEFS,
  data,
  setData,
  runtimeEls,
  addNewTextField,
  deleteFieldByKey,
  deletedKeys,
  styleOverrides,
  setStyleOverrides,

  // toggles
  autoHideEmpty,
  setAutoHideEmpty,
  dragEnabled,
  setDragEnabled,

  // canvas props
  CARD,
  side,
  setSide,
  canvasRef,

  // preview modal props
  showPreview,
  setShowPreview,
  fabricRef,

  // inline edit bubble props
  activeEdit,
  setActiveEdit,
  editInputRef,
  commitActiveEdit,
}) {
  return (
    <>
      {/* BODY: sidebar + canvas */}
      <div className="grid grid-cols-1 lg:grid-cols-[360px_1fr] gap-6">
        {/* Sidebar */}
        <aside className="border rounded-xl p-4 bg-white">
          <h3 className="font-semibold text-lg">Content</h3>

          {/* Toggles */}
          <div className="flex items-center gap-4 mt-2 mb-3 text-sm flex-wrap">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={autoHideEmpty}
                onChange={(e) => setAutoHideEmpty(e.target.checked)}
              />
              Auto-hide empty fields
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={dragEnabled}
                onChange={(e) => setDragEnabled(e.target.checked)}
              />
              Enable drag/resize on canvas
            </label>
          </div>

          <div className="space-y-4">
            {FIELD_DEFS.map(([label, key, type]) => {
              const deleted = deletedKeys.has(key);

              return (
                <div key={key} className="space-y-1">
                  {deleted ? null : type === "file" ? (
                    <span className="text-xs text-gray-600 block">
                      {label} (JPG/PNG/SVG)
                    </span>
                  ) : (
                    <span className="sr-only">{label}</span>
                  )}

                  {deleted ? (
                    <div className="text-xs text-gray-500 border rounded px-3 py-2">
                      {label} removed
                    </div>
                  ) : (
                    <>
                      <div className="relative">
                        {type === "file" ? (
                          <input
                            type="file"
                            accept="image/*"
                            className="w-full border rounded px-3 py-2 pr-10"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (!file) return;
                              const url = URL.createObjectURL(file);
                              setData((v) => ({ ...v, [key]: url }));
                            }}
                          />
                        ) : (
                          <input
                            type={type}
                            placeholder={label}
                            className="w-full border rounded px-3 py-2 pr-10"
                            value={data[key] ?? ""}
                            onChange={(e) =>
                              setData((v) => ({
                                ...v,
                                [key]: e.target.value,
                              }))
                            }
                          />
                        )}

                        {/* delete field button */}
                        <button
                          className="absolute right-2 top-1/2 -translate-y-1/2 p-1 border rounded hover:bg-red-50 bg-white"
                          onClick={() => deleteFieldByKey(key)}
                          title={`Delete ${label}`}
                          aria-label={`Delete ${label}`}
                        >
                          <TrashIcon className="w-4 h-4 text-red-600" />
                        </button>
                      </div>
                    </>
                  )}
                </div>
              );
            })}

            {/* runtime custom fields (front side only) */}
            {runtimeEls
              .filter(
                (e) =>
                  e.type === "text" &&
                  String(e.bindTo || "").startsWith("custom_")
              )
              .map((el) => {
                const k = el.bindTo;
                const deleted = deletedKeys.has(k);
                return (
                  <div key={k} className="relative">
                    {!deleted && (
                      <button
                        className="absolute right-2 top-2 p-1 border rounded hover:bg-red-50 bg-white"
                        onClick={() => deleteFieldByKey(k)}
                        title="Delete this field"
                        aria-label="Delete this field"
                      >
                        <TrashIcon className="w-4 h-4 text-red-600" />
                      </button>
                    )}

                    {deleted ? (
                      <div className="text-xs text-gray-500 border rounded px-3 py-2">
                        Custom field removed
                      </div>
                    ) : (
                      <>
                        <input
                          className="mt-1 w-full border rounded px-3 py-2 pr-8"
                          value={data[k] ?? ""}
                          onChange={(e) =>
                            setData((v) => ({
                              ...v,
                              [k]: e.target.value,
                            }))
                          }
                        />

                        {/* font size slider for custom text */}
                        <div className="mt-2 text-xs">
                          <div className="flex items-center justify-between mb-1">
                            <span>Font Size (optional)</span>
                            <span className="opacity-60">
                              {styleOverrides[k]?.fontSize ?? 16}px
                            </span>
                          </div>
                          <input
                            type="range"
                            min={10}
                            max={300}
                            step={1}
                            value={styleOverrides[k]?.fontSize ?? 16}
                            onChange={(e) => {
                              const val = Number(e.target.value);
                              setStyleOverrides((prev) => ({
                                ...prev,
                                [k]: {
                                  ...(prev[k] || {}),
                                  fontSize: val,
                                },
                              }));
                            }}
                            className="w-full"
                          />
                        </div>
                      </>
                    )}
                  </div>
                );
              })}

            <button
              type="button"
              className="w-full mt-1 py-2 rounded bg-black text-white"
              onClick={addNewTextField}
              disabled={side === "back"}
              title={
                side === "back"
                  ? "Custom text fields are only added to the front for now"
                  : undefined
              }
            >
              New Text Field
            </button>
          </div>
        </aside>

        {/* Canvas preview area */}
        <section className="flex flex-col items-center justify-center">
         <div
  className="rounded-xl border bg-white  shadow-[0_20px_50px_rgba(0,0,0,0.06)] relative"
  style={{
    borderRadius: CARD.cornerRadiusPx ? `${CARD.cornerRadiusPx}px` : undefined,
    overflow: CARD.cornerRadiusPx ? "hidden" : undefined,
  }}
>
  <canvas ref={canvasRef} width={CARD.w} height={CARD.h} />
</div>


          {/* card size note */}
          <div className="text-center text-xs text-gray-500 mt-2">
            {side === "front" ? "Front" : "Back"} • Standard{" "}
            {CARD.widthMM}×{CARD.heightMM} mm preview (screen px)
          </div>

          {/* FRONT / BACK TOGGLE UNDER CARD */}
          <div className="mt-6 flex items-center justify-center gap-0 text-sm">
            {/* FRONT button */}
            <button
              type="button"
              onClick={() => setSide("front")}
              className={`px-4 py-3 border rounded-l-md focus:outline-none ${
                side === "front"
                  ? "bg-white shadow-[0_10px_30px_rgba(0,0,0,0.08)] ring-2 ring-blue-500"
                  : "bg-white border-gray-300 hover:ring-1 hover:ring-blue-300"
              }`}
              style={{
                minWidth: "100px",
              }}
            >
              Front
            </button>

            {/* BACK button */}
            <button
              type="button"
              onClick={() => setSide("back")}
              className={`px-4 py-3 border rounded-r-md focus:outline-none ${
                side === "back"
                  ? "bg-white shadow-[0_10px_30px_rgba(0,0,0,0.08)] ring-2 ring-blue-500"
                  : "bg-white border-gray-300 hover:ring-1 hover:ring-blue-300"
              }`}
              style={{
                minWidth: "100px",
              }}
            >
              Back
            </button>
          </div>
        </section>
      </div>

      {/* Preview modal */}
      {showPreview && (
        <div
          className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4"
          onClick={() => setShowPreview(false)}
        >
          <div
            className="bg-white rounded-xl p-4 max-w-[95vw]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-3">
              <h4 className="font-semibold">Preview ({side})</h4>
              <button
                className="px-3 py-1 border rounded"
                onClick={() => setShowPreview(false)}
              >
                Close
              </button>
            </div>
            <canvas
              ref={(node) => {
                if (!node || !fabricRef.current) return;
                const src = fabricRef.current.toCanvasElement();
                const ctx = node.getContext("2d");
                node.width = src.width;
                node.height = src.height;
                ctx.drawImage(src, 0, 0);
              }}
            />
          </div>
        </div>
      )}

      {/* Inline edit bubble (dblclick on text in canvas) */}
      {activeEdit && (
        <div
          className="fixed z-[9999] bg-white shadow-xl rounded-xl border border-gray-300 px-3 py-2 flex items-center gap-2"
          style={{
            left: activeEdit.leftPx,
            top: activeEdit.topPx,
          }}
        >
          <input
            ref={editInputRef}
            className="border border-gray-300 rounded px-3 py-2 text-sm min-w-[220px] outline-none"
            value={activeEdit.value}
            onChange={(e) => {
              const newVal = e.target.value;

              // update bubble state
              setActiveEdit((prev) =>
                prev
                  ? {
                      ...prev,
                      value: newVal,
                    }
                  : prev
              );

              // live update on canvas
              const c = fabricRef.current;
              if (!c) return;
              const target = c
                .getObjects()
                .find(
                  (o) =>
                    o.data &&
                    o.data.elId === activeEdit.elId
                );
              if (target && target.type === "text") {
                target.set("text", newVal);
                c.requestRenderAll();
              }
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                commitActiveEdit();
              } else if (e.key === "Escape") {
                setActiveEdit(null);
              }
            }}
          />

          <button
            className="text-xs border rounded px-2 py-1 bg-black text-white"
            onClick={commitActiveEdit}
          >
            Save
          </button>

          <button
            className="text-xs border rounded px-2 py-1 bg-white text-gray-600"
            onClick={() => setActiveEdit(null)}
          >
            ✕
          </button>
        </div>
      )}
    </>
  );
}
