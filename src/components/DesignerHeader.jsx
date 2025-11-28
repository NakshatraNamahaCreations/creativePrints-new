// src/components/DesignerHeader.jsx
import React from "react";

export default function DesignerHeader({
  templateBase,
  paletteIdx,
  setPaletteIdx,
  setShowPreview,
  saving,
  saveError,
  handleNext,
}) {
  return (
    <div className="flex justify-center w-full pb-3 mb-4 border-b border-gray-200">
      <div
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between px-4 gap-4"
        style={{ width: "97%", margin: "0 auto" }}
      >
        {/* LEFT: Title */}
        <div className="flex flex-col">
          <p
            className="text-sm opacity-70 font-semibold whitespace-nowrap"
            style={{ fontSize: "20px" }}
          >
            My Projects • Standard Visiting Cards
          </p>
        </div>

        {/* RIGHT: Colour Options + Buttons */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-6">
          {/* Colour Options */}
          <div className="flex flex-col text-sm">
            <p
              className="opacity-70 mb-1 font-semibold"
              style={{ fontSize: "16px" }}
            >
              Colour Options
            </p>

            <div className="flex gap-2 flex-wrap">
              {(templateBase?.palettes || []).map((p, i) => {
                const active = paletteIdx === i;
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setPaletteIdx(i)}
                    className={`h-9 w-9 rounded-full border ${
                      active ? "ring-2 ring-black" : "border-gray-300"
                    }`}
                    title={p.id}
                    aria-pressed={active}
                    style={{
                      background: `linear-gradient(135deg, ${
                        p.bg || "#fff"
                      } 45%, ${p.accent || "#06f"} 45%)`,
                    }}
                  />
                );
              })}
            </div>
          </div>

          {/* Preview / Next */}
          <div className="flex items-center gap-3">
            <button
              className="px-3 py-2 border rounded"
              onClick={() => setShowPreview(true)}
            >
              Preview
            </button>

            <div className="flex flex-col items-end">
              <button
                className={`px-3 py-2 border rounded text-white ${
                  saving ? "bg-gray-500 cursor-not-allowed" : "bg-black"
                }`}
                onClick={handleNext}
                disabled={saving}
              >
                {saving ? "Saving..." : "Next"}
              </button>

              {saveError && (
                <p className="text-xs text-red-600 mt-1 max-w-[160px] text-right">
                  {saveError}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
