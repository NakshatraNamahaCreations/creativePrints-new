// src/components/TemplateTile.jsx
import React, { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { renderTemplateDataURL } from "../utils/makePreview";
import { CATEGORY_DIMS } from "../utils/categoryDims"; // optional: centralize dims here OR duplicate small map

// If you don't create a separate file, fallback dims here:
const FALLBACK_DIMS = { w: 412, h: 412 };

export default function TemplateTile({ template }) {
  const [sp] = useSearchParams();
  const fromProduct = sp.get("product") || "";

  const [paletteIdx, setPaletteIdx] = useState(0);
  const [previewSrc, setPreviewSrc] = useState("");
  const [dims, setDims] = useState(FALLBACK_DIMS);

  useEffect(() => {
    const category =
      (template.categories && template.categories.find((c) => CATEGORY_DIMS?.[c])) ||
      fromProduct ||
      "default";
    const d = (CATEGORY_DIMS && CATEGORY_DIMS[category]) || FALLBACK_DIMS;
    setDims(d);
  }, [template, fromProduct]);

  useEffect(() => {
    let alive = true;
    (async () => {
      const palette = template.palettes?.[paletteIdx] ?? template.palettes?.[0];
      const sample = {
        companyName: "nakshatra",
        fullName: "Full Name",
        jobTitle: "Job Title",
        logoUrl: "", // put a default logo path here to see a logo by default
      };
      try {
        const url = await renderTemplateDataURL({
          template,
          palette,
          data: sample,
          width: dims.w,
          height: dims.h,
        });
        if (alive) setPreviewSrc(url);
      } catch (err) {
        console.error("Preview generation failed", err);
      }
    })();
    return () => {
      alive = false;
    };
  }, [template, paletteIdx, dims]);

  const paletteId = template.palettes?.[paletteIdx]?.id;
  const href = `/designer/${template.id}?product=${fromProduct}${
    paletteId ? `&palette=${paletteId}` : ""
  }`;

  // render with padding-top trick to preserve AR
  const aspectPercent = (dims.h / dims.w) * 100;

  return (
    <div className="border rounded-2xl bg-white hover:shadow-lg overflow-hidden">
      <Link to={href} className="block" style={{ display: "inherit" }}>
        <div style={{ width: "100%", maxWidth: 412 }}>
          <div style={{ position: "relative", width: "100%", paddingTop: `${aspectPercent}%` }}>
            <img
              alt={`Design Preview for ${template.name}`}
              src={previewSrc}
              loading="lazy"
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                objectFit: "cover",
                background: "#f3f3f3",
                display: "block",
              }}
            />
          </div>
        </div>
      </Link>

      <div className="p-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">{template.name}</h3>
          <input type="checkbox" aria-label="Add to Favourites" className="h-5 w-5 accent-black" />
        </div>

        {/* colour swatches */}
        <div className="flex gap-2 mt-3" role="radiogroup" aria-label="Colour Options">
          {(template.palettes || []).map((p, i) => {
            const active = i === paletteIdx;
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => setPaletteIdx(i)}
                className={`h-5 w-5 rounded-full border ${active ? "ring-2 ring-black" : ""}`}
                title={p.id}
                style={{ background: p.accent }}
                aria-pressed={active}
              />
            );
          })}
        </div>

        <div className="mt-3 text-sm">
          <span className="opacity-70">100 from </span>
          <span className="font-medium">₹200.00</span>
        </div>
      </div>
    </div>
  );
}
