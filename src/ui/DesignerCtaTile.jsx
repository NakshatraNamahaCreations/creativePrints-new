// src/ui/DesignerCtaTile.jsx
import React from "react";
import { ArrowRight } from "lucide-react";

export default function DesignerCtaTile() {
  return (
    <div
      className="rounded-[22px] bg-[#23314A] text-white px-6 py-7 flex flex-col justify-between"
      style={{ width: 240, height: 360 }}
    >
      {/* Top avatars */}
      <div className="flex -space-x-4">
        {/* Use your own images if you like */}
        <img
          src="https://i.pravatar.cc/80?img=12"
          alt="Designer 1"
          className="h-16 w-16 rounded-full border-4 border-[#23314A]"
        />
        <img
          src="https://i.pravatar.cc/80?img=23"
          alt="Designer 2"
          className="h-16 w-16 rounded-full border-4 border-[#23314A]"
        />
        <img
          src="https://i.pravatar.cc/80?img=31"
          alt="Designer 3"
          className="h-16 w-16 rounded-full border-4 border-[#23314A]"
        />
      </div>

      {/* Copy */}
      <div className="mt-6">
        <h3 className="text-[22px] font-semibold leading-snug">
          Looking for a custom design?
        </h3>
        <p className="mt-4 text-[16px] leading-7 text-gray-200">
          Our professional designers will craft a design that’s just right for you.
        </p>
      </div>

      {/* CTA */}
      <button
        type="button"
        className="mt-6 w-full bg-white text-[#23314A] rounded-xl py-3.5 font-semibold flex items-center justify-center gap-2 hover:bg-gray-100"
      >
        Work with a designer <ArrowRight size={18} />
      </button>
    </div>
  );
}
