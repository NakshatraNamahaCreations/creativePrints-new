import React, { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { renderTemplateDataURL } from "../utils/makePreview";

export default function TemplateTile({ template }) {
  const [sp] = useSearchParams();
  const fromProduct = sp.get("product") || "";

  const [paletteIdx, setPaletteIdx] = useState(0);
  const [previewSrc, setPreviewSrc] = useState("");

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
      const url = await renderTemplateDataURL({ template, palette, data: sample, width: 412 });
      if (alive) setPreviewSrc(url);
    })();
    return () => { alive = false; };
  }, [template, paletteIdx]);

  const paletteId = template.palettes?.[paletteIdx]?.id;
  const href = `/designer/${template.id}?product=${fromProduct}${paletteId ? `&palette=${paletteId}` : ""}`;

  return (
    <div className="border rounded-2xl bg-white hover:shadow-lg overflow-hidden">
      {/* clickable preview like Vistaprint */}
      <Link to={href} className="block" style={{ display: "inherit" }}>
        <img
          alt={`Design Preview for ${template.name}`}
          src={previewSrc}
          width={412}
          loading="lazy"
          style={{ aspectRatio: 1, background: "#f3f3f3", display: "block", width: "100%" }}
        />
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
