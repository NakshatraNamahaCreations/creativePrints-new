// src/pages/TemplateGallery.jsx
import React, { useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { TEMPLATES } from "../templates";
import TemplatePreview from "../components/TemplatePreview";

const THUMB_W = 440;

export default function TemplateGallery() {
  const [sp] = useSearchParams();
  const fromProduct = sp.get("product") || "";

  const [paletteIndexById, setPaletteIndexById] = useState({});

  // Include ALL keys your templates bind to: companyName + Company/name + office
  const sampleData = useMemo(
    () => ({
      companyName: "Company Name",
      Company: "Company",
      name: "Name",
      companyMessage: "Company Message",
      fullName: "Full Name",
      jobTitle: "Job Title",
      email: "Email / Other",
      address1: "Address Line 1",
      address2: "Address Line 2",
      cityStatePin: "City, State – PIN",
      phone: "Phone / Other",
      fax: "Fax / Other",
      web: "Web / Other",
      office: "Office Address",
      logoUrl: "", // (optional) put a default logo path here if you want
    }),
    []
  );

  const setPalette = (templateId, idx) => {
    setPaletteIndexById((m) => ({ ...m, [templateId]: idx }));
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Choose a design</h1>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {TEMPLATES.map((t) => {
          const idx = paletteIndexById[t.id] ?? 0;
          const paletteId = t.palettes?.[idx]?.id;

          const href = `/designer/${t.id}?product=${fromProduct}${
            paletteId ? `&palette=${paletteId}` : ""
          }`;

          return (
            <div
              key={t.id}
              className="border rounded-2xl bg-white hover:shadow-lg overflow-hidden"
            >
              <Link to={href} className="block">
                <div
                  className="w-full flex items-center justify-center bg-[#f7f7f8]"
                  style={{ padding: "18px 18px 8px 18px" }}
                >
                  <TemplatePreview
                    templateId={t.id}
                    paletteId={paletteId || t.palettes?.[0]?.id}
                    data={sampleData}
                    width={THUMB_W}
                    className="rounded-xl"
                  />
                </div>
              </Link>

              <div className="p-4">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="font-semibold text-sm md:text-base line-clamp-1">
                    {t.name}
                  </h3>
                  <input
                    type="checkbox"
                    aria-label="Add to Favourites"
                    className="h-5 w-5 accent-black"
                  />
                </div>

                <div
                  className="flex gap-2 mt-3"
                  role="radiogroup"
                  aria-label="Colour Options"
                >
                  {(t.palettes || []).map((p, i) => {
                    const active = (paletteIndexById[t.id] ?? 0) === i;
                    return (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => setPalette(t.id, i)}
                        className={`h-5 w-5 rounded-full border ${
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

                <div className="mt-3 text-sm">
                  <span className="opacity-70">100 from </span>
                  <span className="font-medium">₹200.00</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
