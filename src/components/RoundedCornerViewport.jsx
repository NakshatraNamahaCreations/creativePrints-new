// src/components/RoundedCornerViewport.jsx
import React from "react";

export default function RoundedCornerViewport({ width = 320, height = 320, radius = 18, bleed = 8, children }) {
  const innerInset = bleed; // safety inset
  return (
    <div
      style={{
        width,
        height,
        borderRadius: radius,
        overflow: "hidden",
        background: "#fff",
        position: "relative",
        boxShadow: "0 6px 18px rgba(12,12,12,0.06)",
        border: "1px solid rgba(0,0,0,0.06)",
      }}
      className="rounded-card-viewport"
    >
      {/* Safety area dashed */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: innerInset,
          borderRadius: Math.max(0, radius - innerInset),
          border: "1px dashed rgba(0,0,0,0.12)",
          pointerEvents: "none",
        }}
      />

      {/* Content slot */}
      <div style={{ width: "100%", height: "100%", position: "relative", zIndex: 2 }}>
        {children}
      </div>
    </div>
  );
}
