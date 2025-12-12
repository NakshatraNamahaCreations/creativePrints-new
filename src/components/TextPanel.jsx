// src/components/TextPanel.jsx
import React from "react";
import TrashIcon from "./TrashIcon.jsx";

export default function TextPanel({
  FIELD_DEFS,
  data,
  deletedKeys,
  deleteFieldByKey,
  updateFieldStateOnly,
  addNewTextField,
  autoHideEmpty,
  setAutoHideEmpty,
  dragEnabled,
  setDragEnabled,
  side,
}) {
  return (
    <div>
      <h3 className="font-semibold text-lg mb-2">Text</h3>

      <div className="flex items-center gap-4 mt-2 mb-3 text-sm flex-wrap">
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={autoHideEmpty} onChange={(e) => setAutoHideEmpty(e.target.checked)} />
          Auto-hide empty
        </label>
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={dragEnabled} onChange={(e) => setDragEnabled(e.target.checked)} />
          Enable drag
        </label>
      </div>

      <div className="space-y-4">
        {FIELD_DEFS.map(([label, key, type]) => {
          const deleted = deletedKeys.has(key);
          return (
            <div key={key} className="space-y-1">
              {deleted ? (
                <div className="text-xs text-gray-400 border rounded px-3 py-2">{label} removed</div>
              ) : (
                <>
                  {type === "file" && <span className="text-xs text-gray-600 block">{label} (Image file)</span>}

                  <div className="relative">
                    {type === "file" ? (
                      <input
                        type="file"
                        accept="image/*"
                        className="w-full border rounded px-3 py-2"
                        onChange={(e) => {
                          const f = e.target.files?.[0];
                          if (!f) return;
                          const url = URL.createObjectURL(f);
                          updateFieldStateOnly(key, url);
                        }}
                      />
                    ) : (
                      <input
                        type={type}
                        placeholder={label}
                        className="w-full border rounded px-3 py-2"
                        value={data[key] ?? ""}
                        onChange={(e) => updateFieldStateOnly(key, e.target.value)}
                      />
                    )}

                    <button className="absolute right-2 top-1/2 -translate-y-1/2 p-1 border rounded bg-white hover:bg-red-50" onClick={() => deleteFieldByKey(key)}>
                      <TrashIcon className="w-4 h-4 text-red-600" />
                    </button>
                  </div>
                </>
              )}
            </div>
          );
        })}

        <button type="button" className="w-full py-2 rounded bg-black text-white" disabled={side === "back"} onClick={addNewTextField}>
          Add Text
        </button>
      </div>
    </div>
  );
}
