// src/ui/UploadTile.jsx
import React from "react";
import { UploadCloud } from "lucide-react";

const nf = new Intl.NumberFormat("en-IN", { minimumFractionDigits: 2 });

export default function UploadTile({ baseQty = 100, priceFrom = 230 }) {
  return (
    <div
      className="rounded-[22px] bg-[#F6F6E8] grid place-items-center text-center px-6"
      style={{ width: 250, height: 350 }}
    >
      <div>
        <div className="mx-auto mb-6 grid place-items-center h-16 w-16 rounded-full border-2 border-dashed border-gray-400 bg-white">
          <UploadCloud size={26} className="text-gray-700" />
        </div>
        <div className="text-[22px] font-semibold">Upload your own design</div>
        <div className="mt-8 text-[18px]">
          {baseQty} from <span className="font-semibold">₹{nf.format(priceFrom)}</span>
        </div>
      </div>
    </div>
  );
}
