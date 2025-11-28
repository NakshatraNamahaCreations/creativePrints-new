// src/pages/TemplateGallery.jsx
import React, { useMemo, useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { TEMPLATES } from "../templates";
import TemplatePreview from "../components/TemplatePreview";
import RoundedCornerViewport from "../components/RoundedCornerViewport";
import { mm2px } from "../utils/cardDims";

const THUMB_W = 320; // fallback width

// px sizes for thumbnails per category
const CATEGORY_DIMS = {
  square: { w: 320, h: 320 }, // square preview
  "rounded-corner": { w: 320, h: 200 },
  rounded: { w: 320, h: 200 },
  standard: { w: 320, h: 200 },
  labels: { w: 300, h: 120 },
  banners: { w: 420, h: 120 },
  "circle-visiting-cards": { w: 320, h: 320 },
  "oval-visiting-cards":{w: 280, h: 337},
  default: { w: THUMB_W, h: 180 },
  "letterhead":{w:300, h:400 },
  "premium-letterhead": { w: 300, h: 400 }, // or 500, etc.

};

// optional map when URL product slugs should expand to multiple categories
const PRODUCT_CATEGORY_MAP = {
  standard: ["standard"],
  rounded: ["rounded", "rounded-corner"],
  labels: ["labels"],
  banners: ["banners"],
  square: ["square"],
   "premium-letterhead": ["letterhead"],
};

// normalize a category string into the canonical key used by CATEGORY_DIMS
const normalizeCategoryKey = (c) =>
  String(c || "")
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-");

// pick a category to determine thumbnail dims
function pickCategoryFromTemplate(template, fromProduct) {
  if (fromProduct) return fromProduct;
  if (Array.isArray(template?.categories) && template.categories.length) {
    const cats = template.categories.map(normalizeCategoryKey);
    const match = cats.find((c) => CATEGORY_DIMS[c]);
    return match || cats[0] || "default";
  }
  return "default";
}

export default function TemplateGallery() {
  
  const [sp] = useSearchParams();
  const fromProduct = sp.get("product") || "";

  // which palette is active per template
  const [paletteIndexById, setPaletteIndexById] = useState({});

  // personalization fields shown in the left sidebar
  const [userData, setUserData] = useState({
    companyName: sp.get("companyName") || "",
    fullName: sp.get("fullName") || "",
    jobTitle: "",
    web: "",
    logoUrl: sp.get("logoUrl") || "",
  });

  // cleanup any blob URL for uploaded logo when unmounting page
  useEffect(() => {
    return () => {
      if (userData.logoUrl && userData.logoUrl.startsWith("blob:")) {
        URL.revokeObjectURL(userData.logoUrl);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // fallback sample data so the previews are never empty
  const sampleData = useMemo(
    () => ({
      companyName: "Company Name",
      companyMessage: "Tagline goes here",
      fullName: "Full Name",
      jobTitle: "Job Title",
      email: "you@email.com",
      address1: "Address Line 1",
      address2: "Address Line 2",
      cityStatePin: "City, State – PIN",
      phone: "",
      fax: "Fax / Other",
      web: "website.com",
      logoUrl: "",
    }),
    []
  );

  // merge user personalization over the defaults (what TemplatePreview receives)
  const previewData = useMemo(() => {
    return {
      ...sampleData,
      ...(userData.companyName ? { companyName: userData.companyName } : {}),
      ...(userData.fullName ? { fullName: userData.fullName } : {}),
      ...(userData.jobTitle ? { jobTitle: userData.jobTitle } : {}),
      ...(userData.web ? { web: userData.web } : {}),
      ...(userData.logoUrl ? { logoUrl: userData.logoUrl } : {}),
    };
  }, [sampleData, userData]);

  // choose a palette option for a given template card
  const setPalette = (templateId, idx) => {
    setPaletteIndexById((m) => ({ ...m, [templateId]: idx }));
  };

  // build querystring so when user clicks a card, we pass palette and personalization forward
  const carryQS = (paletteId) => {
    const params = new URLSearchParams();

    if (fromProduct) params.set("product", fromProduct);
    if (paletteId) params.set("palette", paletteId);

    if (userData.companyName) params.set("companyName", userData.companyName);
    if (userData.fullName) params.set("fullName", userData.fullName);
    if (userData.jobTitle) params.set("jobTitle", userData.jobTitle);
    if (userData.web) params.set("web", userData.web);
    if (userData.logoUrl) params.set("logoUrl", userData.logoUrl);

    const qs = params.toString();
    return qs ? `?${qs}` : "";
  };

  // compute the list to render: filter TEMPLATES by fromProduct (if present)
  const listToRender = useMemo(() => {
    if (!fromProduct) return TEMPLATES;

    const allowed = PRODUCT_CATEGORY_MAP[fromProduct] || [fromProduct];
    // normalize allowed list too
    const allowedNorm = allowed.map(normalizeCategoryKey);

    return TEMPLATES.filter((t) => {
      if (allowedNorm.includes(t.id)) return true;

      if (Array.isArray(t.categories) && t.categories.some((c) => allowedNorm.includes(normalizeCategoryKey(c)))) return true;

      const nameSlug = t.name?.toLowerCase().replace(/\s+/g, "-");
      if (nameSlug && allowedNorm.includes(nameSlug)) return true;

      return false;
    });
  }, [fromProduct]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Choose a design</h1>

      <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-6">
        {/* LEFT SIDEBAR: personalization form */}
        <aside className="border rounded-2xl bg-white p-4 lg:sticky lg:top-4 h-max">
          <div className="text-lg font-semibold mb-2">Make it yours</div>
          <p className="text-sm text-gray-600 mb-3">
            Add your information to see personalised templates just for you.
          </p>

          {/* LOGO UPLOAD */}
          <label className="block">
            <span className="text-sm font-medium">Logo</span>
            <input
              type="file"
              accept="image/*"
              className="mt-1 w-full border rounded px-3 py-2 text-sm"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (!file) return;

                // revoke old blob to avoid leaks
                if (userData.logoUrl && userData.logoUrl.startsWith("blob:")) {
                  URL.revokeObjectURL(userData.logoUrl);
                }

                const url = URL.createObjectURL(file);
                setUserData((v) => ({ ...v, logoUrl: url }));
              }}
            />
          </label>

          {/* COMPANY NAME */}
          <label className="block mt-3">
            <span className="text-sm font-medium">Company Name</span>
            <input
              className="mt-1 w-full border rounded px-3 py-2 text-sm"
              value={userData.companyName}
              placeholder="e.g., NNC"
              onChange={(e) =>
                setUserData((v) => ({
                  ...v,
                  companyName: e.target.value,
                }))
              }
            />
          </label>

          {/* FULL NAME */}
          <label className="block mt-3">
            <span className="text-sm font-medium">Full Name</span>
            <input
              className="mt-1 w-full border rounded px-3 py-2 text-sm"
              value={userData.fullName}
              placeholder="e.g., Your name"
              onChange={(e) =>
                setUserData((v) => ({
                  ...v,
                  fullName: e.target.value,
                }))
              }
            />
          </label>

          {/* JOB TITLE */}
          <label className="block mt-3">
            <span className="text-sm font-medium">Job Title</span>
            <input
              className="mt-1 w-full border rounded px-3 py-2 text-sm"
              value={userData.jobTitle}
              placeholder="e.g., Marketing Manager"
              onChange={(e) =>
                setUserData((v) => ({
                  ...v,
                  jobTitle: e.target.value,
                }))
              }
            />
          </label>

          {/* WEBSITE */}
          <label className="block mt-3">
            <span className="text-sm font-medium">Website</span>
            <input
              className="mt-1 w-full border rounded px-3 py-2 text-sm"
              value={userData.web}
              placeholder="e.g., yoursite.com"
              onChange={(e) =>
                setUserData((v) => ({
                  ...v,
                  web: e.target.value,
                }))
              }
            />
          </label>

          {/* CLEAR BUTTON */}
          {(userData.companyName ||
            userData.fullName ||
            userData.jobTitle ||
            userData.web ||
            userData.logoUrl) && (
            <button
              type="button"
              className="mt-4 text-sm underline text-gray-700"
              onClick={() => {
                // revoke blob so we don't leak memory
                if (userData.logoUrl && userData.logoUrl.startsWith("blob:")) {
                  URL.revokeObjectURL(userData.logoUrl);
                }

                setUserData({
                  companyName: "",
                  fullName: "",
                  jobTitle: "",
                  web: "",
                  logoUrl: "",
                });
              }}
            >
              Clear personalisation
            </button>
          )}
        </aside>

        {/* RIGHT SIDE: template cards grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {listToRender.length === 0 ? (
            <div className="col-span-full p-6 text-center text-gray-600">
              No templates found for <strong>{fromProduct || "all"}</strong>.
              Try a different product query or remove the <code>?product=</code> param.
            </div>
          ) : (
            listToRender.map((t) => {
              const idx = paletteIndexById[t.id] ?? 0;
              const paletteId = t.palettes?.[idx]?.id;
              const href = `/designer/${t.id}${carryQS(paletteId)}`;

              const categoryForTemplate = pickCategoryFromTemplate(t, fromProduct);
              const dims = CATEGORY_DIMS[categoryForTemplate] || CATEGORY_DIMS.default;

              // compute a thumbnail corner radius in px (screen preview)
              // templates may optionally define `spec: { cornerRadiusMM: <number> }`
              // convert mm -> px using a low screen DPI (72) so the radius looks reasonable on thumbnails
              const thumbRadiusPx =
                t.spec && typeof t.spec.cornerRadiusMM === "number"
                  ? Math.max(4, Math.round(mm2px(t.spec.cornerRadiusMM, 72)))
                  : 18;

              return (
                <div
                  key={t.id}
                  className="border rounded-2xl bg-white hover:shadow-lg overflow-hidden"
                >
                  {/* Thumbnail / click target */}
                  <Link to={href} className="block">
                    <div
                      className="w-full bg-[#fff] flex items-center justify-center"
                      style={{
                        height: dims.h,
                        padding: 10,
                        marginTop: 14,
                      }}
                    >
                      {categoryForTemplate === "rounded-corner" ? (
                        <RoundedCornerViewport width={dims.w} height={dims.h} radius={thumbRadiusPx}>
                          <TemplatePreview
                            templateId={t.id}
                            paletteId={paletteId || t.palettes?.[0]?.id}
                            data={previewData}
                            width={dims.w}
                            height={dims.h}
                          />
                        </RoundedCornerViewport>
                      ) : (
                        <TemplatePreview
                          templateId={t.id}
                          paletteId={paletteId || t.palettes?.[0]?.id}
                          data={previewData}
                          width={dims.w}
                          height={dims.h}
                          className="rounded-xl shadow-sm"
                        />
                      )}
                    </div>
                  </Link>

                  {/* Card footer: name, palette choices, price */}
                  <div className="p-4">
                    {/* template title + favourite checkbox */}
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

                    {/* Color palette selector bubbles */}
                    <div
                      className="flex gap-2 mt-3 flex-wrap"
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

                    {/* Pricing line (static for now) */}
                    <div className="mt-3 text-sm">
                      <span className="opacity-70">100 from </span>
                      <span className="font-medium">₹200.00</span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
