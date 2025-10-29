// src/ui/TemplateCard.jsx
import React from "react";
import { Heart } from "lucide-react";
import { Link } from "react-router-dom";

const nf = new Intl.NumberFormat("en-IN", { minimumFractionDigits: 2 });

export default function TemplateCard({
  id,
  title,
  img,
  colors = [],
  qtyBase = 100,
  priceFrom = 230,
  isFavorite = false,
  onToggleFavorite,
  to = "#",
}) {
  // Match screenshot proportions closely
  const CARD_W = 240;          // card width
  const CARD_H = 350;          // card height
  const IMG_H = 210;           // image container height

  const Wrap = to ? Link : "div";
  const wrapProps = to ? { to } : {};

  return (
    <div className="relative" style={{ width: CARD_W }}>
      {/* Heart button */}
      <button
        onClick={(e) => { e.stopPropagation(); onToggleFavorite?.(id); }}
        aria-label="toggle favourite"
        className="absolute right-3 top-3 z-10 grid place-items-center h-12 w-12 rounded-full bg-white shadow"
      >
        <Heart
          size={24}
          className={isFavorite ? "fill-red-500 text-red-500" : "text-gray-700"}
        />
      </button>

      <Wrap
        {...wrapProps}
        className="block rounded-[22px] bg-[#F4F4F4] shadow-sm hover:shadow-md transition"
        style={{ height: CARD_H }}
      >
        <div className="p-4 h-full flex flex-col">
          {/* image */}
          <div
            className="rounded-md border border-gray-300 bg-white overflow-hidden"
            style={{ height: IMG_H }}
          >
            <img
              src={img}
              alt={title}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>

          {/* tiny color dots like in screenshot */}
          {colors.length > 0 && (
            <div className="mt-4 flex items-center gap-3">
              {colors.slice(0, 5).map((c, i) => (
                <span
                  key={i}
                  className="inline-flex h-8 w-8 items-center justify-center rounded-full border-2 border-black/20"
                >
                  <span
                    className="block h-6 w-6 rounded-full"
                    style={{ background: c }}
                  />
                </span>
              ))}
            </div>
          )}

          {/* price line anchored to bottom */}
          <div className="mt-auto pt-4 text-[18px] text-black">
            {qtyBase} from <span className="font-semibold">₹{nf.format(priceFrom)}</span>
          </div>
        </div>
      </Wrap>
    </div>
  );
}
