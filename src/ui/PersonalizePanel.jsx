// src/ui/PersonalizePanel.jsx
import React, { useState } from "react";
import { ImagePlus, ChevronDown } from "lucide-react";

const COLOR_SWATCHES = [
  { hex: "#1E50FF", name: "Blue" },
  { hex: "#0F8A17", name: "Green" },
  { hex: "#F2D200", name: "Yellow" },
  { hex: "#F04023", name: "Red" },
  { hex: "#A3A6A9", name: "Grey" },
  { hex: "#FFFFFF", name: "White", ring: true },
  { hex: "#000000", name: "Black" },
  { hex: "#6F4E37", name: "Brown" },
  { hex: "#E9DFC7", name: "Cream" },
  { hex: "#7E22CE", name: "Purple" },
  { hex: "#F0B6BD", name: "Pink" },
];

const INDUSTRIES_PRIMARY = [
  "Agriculture & Farming",
  "Animals & Pet Care",
  "Arts, Crafts and Design",
  "Automotive & Transportation",
  "Beauty & Spa",
];
const INDUSTRIES_MORE = [
  "Business & Consulting",
  "Construction & Real Estate",
  "Education & Training",
  "Events & Entertainment",
  "Fitness & Sports",
  "Food & Beverage",
  "Healthcare & Medical",
  "Hospitality & Travel",
  "IT & Software",
  "Retail & E-commerce",
];

export default function PersonalizePanel() {
  const [expandedColour, setExpandedColour] = useState(true);
  const [expandedIndustry, setExpandedIndustry] = useState(true);
  const [expandedOrientation, setExpandedOrientation] = useState(true);
  const [showMore, setShowMore] = useState(false);

  const [selectedColour, setSelectedColour] = useState(null);
  const [orientation, setOrientation] = useState({
    vertical: false,
    horizontal: false,
  });

  return (
    <div className="flex flex-col gap-6" style={{ width: 280 }}>
      {/* --- Make it yours --- */}
      <div className="rounded-[22px] bg-[#E6F3FF] p-6" style={{ height: 400 }}>
        <h3 className="text-[22px] font-semibold text-black">Make it yours</h3>
        <p className="mt-2 text-gray-700 leading-6">
          Add your information to see personalised templates just for you.
        </p>

        <button className="mt-5 w-full rounded-xl border border-gray-300 bg-white px-4 py-4 text-left font-medium flex items-center gap-3 hover:bg-gray-50">
          <ImagePlus size={20} className="text-gray-800" />
          Add logo or photo
        </button>

        <input
          placeholder="Company Name"
          className="mt-4 w-full rounded-xl border border-gray-300 bg-white px-4 py-4 outline-none placeholder:text-gray-500"
        />
        <input
          placeholder="Full Name"
          className="mt-4 w-full rounded-xl border border-gray-300 bg-white px-4 py-4 outline-none placeholder:text-gray-500"
        />
      </div>

      {/* --- Filter By --- */}
      <div className="rounded-[22px] bg-white p-6 border border-gray-200">
        <h3 className="text-[20px] font-semibold text-gray-900">Filter By</h3>

        {/* Design colour */}
        <button
          type="button"
          onClick={() => setExpandedColour((v) => !v)}
          className="mt-4 w-full flex items-center justify-between"
        >
          <span className="text-[16px] font-semibold text-gray-900">
            Design colour
          </span>
          <ChevronDown
            size={18}
            className={`transition-transform ${expandedColour ? "rotate-180" : ""}`}
          />
        </button>

        {expandedColour && (
          <div className="mt-4 flex flex-wrap gap-3">
            {COLOR_SWATCHES.map(({ hex, name, ring }, i) => {
              const active = selectedColour === hex;
              return (
                <button
                  key={hex + i}
                  type="button"
                  onClick={() => setSelectedColour((c) => (c === hex ? null : hex))}
                  className={`inline-flex h-9 w-9 items-center justify-center rounded-full border-2 transition ${
                    active ? "border-black" : "border-black/20 hover:border-black/40"
                  }`}
                  aria-label={name}
                  title={name}
                >
                  <span
                    className="block h-6 w-6 rounded-full"
                    style={{
                      background: hex,
                      boxShadow: ring ? "inset 0 0 0 1px #D1D5DB" : "none",
                    }}
                  />
                </button>
              );
            })}
          </div>
        )}

        <hr className="my-6 border-gray-200" />

        {/* Industry */}
        <button
          type="button"
          onClick={() => setExpandedIndustry((v) => !v)}
          className="w-full flex items-center justify-between"
        >
          <span className="text-[16px] font-semibold text-gray-900">Industry</span>
          <ChevronDown
            size={18}
            className={`transition-transform ${expandedIndustry ? "rotate-180" : ""}`}
          />
        </button>

        {expandedIndustry && (
          <div className="mt-4">
            <ul className="space-y-3">
              {INDUSTRIES_PRIMARY.map((label) => (
                <li key={label} className="text-[15px] text-gray-800 hover:underline cursor-pointer">
                  {label}
                </li>
              ))}
              {showMore &&
                INDUSTRIES_MORE.map((label) => (
                  <li key={label} className="text-[15px] text-gray-800 hover:underline cursor-pointer">
                    {label}
                  </li>
                ))}
            </ul>

            <button
              type="button"
              onClick={() => setShowMore((s) => !s)}
              className="mt-4 text-[15px] font-semibold text-gray-900 underline"
            >
              {showMore ? "Show Less" : "Show More"}
            </button>
          </div>
        )}

        <hr className="my-6 border-gray-200" />

        {/* Product Orientation (NEW) */}
        <button
          type="button"
          onClick={() => setExpandedOrientation((v) => !v)}
          className="w-full flex items-center justify-between"
        >
          <span className="text-[16px] font-semibold text-gray-900">
            Product Orientation
          </span>
          <ChevronDown
            size={18}
            className={`transition-transform ${
              expandedOrientation ? "rotate-180" : ""
            }`}
          />
        </button>

        {expandedOrientation && (
          <div className="mt-4 space-y-4">
            {/* Vertical */}
            <label className="flex items-center gap-3 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={orientation.vertical}
                onChange={(e) =>
                  setOrientation((o) => ({ ...o, vertical: e.target.checked }))
                }
                className="h-[20px] w-[20px] appearance-none rounded-md border border-gray-400 grid place-items-center
                           checked:bg-black checked:border-black"
              />
              <span className="text-[16px] text-gray-800">Vertical</span>
            </label>

            {/* Horizontal */}
            <label className="flex items-center gap-3 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={orientation.horizontal}
                onChange={(e) =>
                  setOrientation((o) => ({ ...o, horizontal: e.target.checked }))
                }
                className="h-[20px] w-[20px] appearance-none rounded-md border border-gray-400 grid place-items-center
                           checked:bg-black checked:border-black"
              />
              <span className="text-[16px] text-gray-800">Horizontal</span>
            </label>
          </div>
        )}
      </div>
    </div>
  );
}
