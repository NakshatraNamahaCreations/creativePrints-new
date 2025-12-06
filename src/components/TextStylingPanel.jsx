// src/components/TextStylingPanel.jsx
import React from "react";

export default function TextStylingPanel({
  effectStyle,
  shapeStyle,
  onSelectStyle,
  onSelectShape,

  // shadow
  shadowColor,
  shadowDistance,
  shadowOpacity, // 0–1
  shadowAngle,
  shadowBlur,
  onShadowColorChange,
  onShadowDistanceChange,
  onShadowOpacityChange,
  onShadowAngleChange,
  onShadowBlurChange,

  // highlight
  highlightColor,
  highlightRoundness,
  highlightSize,
  highlightOpacity, // 0–1
  onHighlightColorChange,
  onHighlightRoundnessChange,
  onHighlightSizeChange,
  onHighlightOpacityChange,
   
    glitchPreset,
  glitchAngle,
  glitchOffset,
  onGlitchPresetChange,
  onGlitchAngleChange,
  onGlitchOffsetChange,

    echoSteps,
  onEchoStepsChange,
}) {
  const shadowOpacityPercent = Math.round((shadowOpacity ?? 0) * 100);
  const highlightOpacityPercent = Math.round((highlightOpacity ?? 0.85) * 100);

  // 🔴 local list of glitch presets for the UI


  const handleStyleClick = (style) => {
    onSelectStyle && onSelectStyle(style);
  };

  const handleShapeClick = (shape) => {
    onSelectShape && onSelectShape(shape);
  };

  const resetShadow = () => {
    onShadowDistanceChange && onShadowDistanceChange(26);
    onShadowOpacityChange && onShadowOpacityChange(0.4);
    onShadowAngleChange && onShadowAngleChange(35);
    onShadowBlurChange && onShadowBlurChange(10);
  };

  
  return (
    <div
      style={{
        position: "absolute",
        top: 40,
        left: "-50%",
        transform: "translateX(-50%)",
        padding: 12,
        background: "#ffffff",
        borderRadius: 16,
        boxShadow: "0 18px 45px rgba(15,23,42,0.25)",
        border: "1px solid rgba(148,163,184,0.4)",
        width: 350,
        zIndex: 9999,
      }}
    >
      {/* STYLE SECTION */}
      <div className="mb-4">
        <div className="text-xs font-semibold uppercase tracking-wide mb-2">
          Style
        </div>

        <div className="grid grid-cols-3 gap-2">
          <EffectTile
            label="None"
            active={effectStyle === "none"}
            onClick={() => handleStyleClick("none")}
            iconType="none"
          />
          <EffectTile
            label="Shadow"
            active={effectStyle === "shadow"}
            onClick={() => handleStyleClick("shadow")}
            iconType="shadow"
          />
          <EffectTile
            label="Highlight"
            active={effectStyle === "highlight"}
            onClick={() => handleStyleClick("highlight")}
            iconType="highlight"
          />
          <EffectTile
            label="Glitch"
            active={effectStyle === "glitch"}
            onClick={() => handleStyleClick("glitch")}
            iconType="glitch"
          />
          <EffectTile
            label="Echo"
            active={effectStyle === "echo"}
            onClick={() => handleStyleClick("echo")}
            iconType="echo"
          />
        </div>

        {/* SHADOW SETTINGS */}
        {effectStyle === "shadow" && (
          <div className="mt-4 space-y-4 border-t pt-4">
            {/* Shadow color */}
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-semibold">Shadow color</span>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={shadowColor}
                  onChange={(e) =>
                    onShadowColorChange &&
                    onShadowColorChange(e.target.value)
                  }
                  className="w-8 h-8 border rounded-full overflow-hidden cursor-pointer"
                />
              </div>
            </div>

            <ShadowSliderRow
              label="Distance"
              min={0}
              max={100}
              value={shadowDistance}
              onChange={(v) =>
                onShadowDistanceChange && onShadowDistanceChange(v)
              }
              onReset={() =>
                onShadowDistanceChange && onShadowDistanceChange(26)
              }
            />

            <ShadowSliderRow
              label="Opacity"
              min={0}
              max={100}
              value={shadowOpacityPercent}
              onChange={(v) =>
                onShadowOpacityChange && onShadowOpacityChange(v / 100)
              }
              onReset={() =>
                onShadowOpacityChange && onShadowOpacityChange(0.4)
              }
            />

            <ShadowSliderRow
              label="Angle"
              min={-180}
              max={180}
              value={shadowAngle}
              onChange={(v) =>
                onShadowAngleChange && onShadowAngleChange(v)
              }
              onReset={() =>
                onShadowAngleChange && onShadowAngleChange(35)
              }
            />

            <ShadowSliderRow
              label="Blur"
              min={0}
              max={100}
              value={shadowBlur}
              onChange={(v) => onShadowBlurChange && onShadowBlurChange(v)}
              onReset={() => onShadowBlurChange && onShadowBlurChange(10)}
            />

            <button
              type="button"
              onClick={resetShadow}
              className="mt-1 text-[11px] underline text-gray-500"
            >
              Reset shadow
            </button>
          </div>
        )}

        {/* HIGHLIGHT SETTINGS */}
        {effectStyle === "highlight" && (
          <div className="mt-4 space-y-4 border-t pt-4">
            {/* Highlight color */}
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-semibold">
                Highlight color
              </span>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={highlightColor}
                  onChange={(e) =>
                    onHighlightColorChange &&
                    onHighlightColorChange(e.target.value)
                  }
                  className="w-8 h-8 border overflow-hidden cursor-pointer"
                />
              </div>
            </div>

            {/* Roundness */}
            <ShadowSliderRow
              label="Roundness"
              min={0}
              max={100}
              value={highlightRoundness}
              onChange={(v) =>
                onHighlightRoundnessChange &&
                onHighlightRoundnessChange(v)
              }
              onReset={() =>
                onHighlightRoundnessChange &&
                onHighlightRoundnessChange(72)
              }
            />

            {/* Size */}
            <ShadowSliderRow
              label="Size"
              min={0}
              max={100}
              value={highlightSize}
              onChange={(v) =>
                onHighlightSizeChange && onHighlightSizeChange(v)
              }
              onReset={() =>
                onHighlightSizeChange && onHighlightSizeChange(43)
              }
            />

            {/* Opacity (for pill) */}
            <ShadowSliderRow
              label="Opacity"
              min={0}
              max={100}
              value={highlightOpacityPercent}
              onChange={(v) =>
                onHighlightOpacityChange &&
                onHighlightOpacityChange(v / 100)
              }
              onReset={() =>
                onHighlightOpacityChange &&
                onHighlightOpacityChange(0.85)
              }
            />
          </div>
        )}
                {/* GLITCH SETTINGS */}
        {effectStyle === "glitch" && (
          <div className="mt-4 space-y-4 border-t pt-4">
            {/* Preset bubbles */}
            <div>
              <div className="text-xs font-semibold mb-1">Preset</div>
              <div className="flex gap-2">
                {[
                  { name: "cyan-magenta", colors: ["#00FFFF", "#FF00FF"], label: "cyan / magenta" },
                  { name: "green-pink",   colors: ["#00FF00", "#FF00AA"], label: "green / pink" },
                  { name: "blue-red",     colors: ["#0000FF", "#FF0000"], label: "blue / red" },
                ].map((p) => (
                  <button
                    key={p.name}
                    type="button"
                    onClick={() =>
                      onGlitchPresetChange && onGlitchPresetChange(p.name)
                    }
                    className={`w-8 h-8 rounded-full border flex items-center justify-center ${
                      glitchPreset === p.name ? "ring-2 ring-black" : ""
                    }`}
                    style={{
                      background: `linear-gradient(90deg, ${p.colors[0]}, ${p.colors[1]})`,
                    }}
                  />
                ))}
              </div>
              <div className="text-[11px] text-gray-600 mt-1">
                {glitchPreset.replace("-", " / ")}
              </div>
            </div>

            {/* Angle slider */}
            <ShadowSliderRow
              label="Angle"
              min={-180}
              max={180}
              value={glitchAngle}
              onChange={(v) => onGlitchAngleChange && onGlitchAngleChange(v)}
              onReset={() => onGlitchAngleChange && onGlitchAngleChange(180)}
            />

            {/* Offset slider */}
            <ShadowSliderRow
              label="Offset"
              min={0}
              max={50}
              value={glitchOffset}
              onChange={(v) => onGlitchOffsetChange && onGlitchOffsetChange(v)}
              onReset={() => onGlitchOffsetChange && onGlitchOffsetChange(8)}
            />
          </div>
        )}
{/* ECHO SETTINGS */}
{effectStyle === "echo" && (
  <div className="mt-4 space-y-4 border-t pt-4">
    {/* Distance */}
    <ShadowSliderRow
      label="Distance"
      min={0}
      max={100}
      value={shadowDistance}
      onChange={(v) =>
        onShadowDistanceChange && onShadowDistanceChange(v)
      }
      onReset={() =>
        onShadowDistanceChange && onShadowDistanceChange(8)
      }
    />

    {/* Steps */}
    <ShadowSliderRow
      label="Steps"
      min={1}
      max={10}
      value={echoSteps}
      onChange={(v) =>
        onEchoStepsChange && onEchoStepsChange(v)
      }
      onReset={() =>
        onEchoStepsChange && onEchoStepsChange(3)
      }
    />

    {/* Angle */}
    <ShadowSliderRow
      label="Angle"
      min={-180}
      max={180}
      value={shadowAngle}
      onChange={(v) =>
        onShadowAngleChange && onShadowAngleChange(v)
      }
      onReset={() =>
        onShadowAngleChange && onShadowAngleChange(45)
      }
    />
  </div>
)}

      </div>

      {/* SHAPE SECTION */}
      <div>
        <div className="text-xs font-semibold uppercase tracking-wide mb-2">
          Shape
        </div>
        <div className="grid grid-cols-2 gap-2">
          <EffectTile
            label="None"
            active={shapeStyle === "none"}
            onClick={() => handleShapeClick("none")}
            iconType="shape-none"
          />
          <EffectTile
            label="Curve"
            active={shapeStyle === "curve"}
            onClick={() => handleShapeClick("curve")}
            iconType="shape-curve"
          />
        </div>
      </div>
    </div>
  );
}

/* --- Small subcomponents used only inside this panel --- */

function EffectTile({ label, active, onClick, iconType }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full flex flex-col items-center text-xs"
    >
      <div
        className={`w-full aspect-square rounded-xl border flex items-center justify-center relative mb-1 ${
          active
            ? "border-black bg-white"
            : "border-gray-200 bg-white hover:bg-gray-50"
        }`}
      >
        <EffectIcon type={iconType} />
        {active && (
          <div className="absolute bottom-1 right-1 w-4 h-4 rounded-full bg-black flex items-center justify-center">
            <span className="text-[9px] text-white">✓</span>
          </div>
        )}
      </div>
      <span className="text-[11px] text-gray-700">{label}</span>
    </button>
  );
}

function ShadowSliderRow({ label, min, max, value, onChange, onReset }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-[11px] font-semibold">{label}</span>
      <div className="flex items-center gap-2">
        <input
          type="range"
          min={min}
          max={max}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="flex-1"
        />
        <button
          type="button"
          onClick={onReset}
          className="w-7 h-7 rounded-full border flex items-center justify-center text-[11px]"
        >
          ↺
        </button>
        <input
          type="number"
          min={min}
          max={max}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-14 border rounded px-1 py-[3px] text-[11px]"
        />
      </div>
    </div>
  );
}

function EffectIcon({ type }) {
  const size = 72;

  if (type === "none" || type === "shape-none") {
    return (
      <svg width={size} height={size} viewBox="0 0 40 40">
        <circle
          cx="20"
          cy="20"
          r="13"
          fill="none"
          stroke="#CBD5E1"
          strokeWidth="2.5"
        />
        <line
          x1="13"
          y1="27"
          x2="27"
          y2="13"
          stroke="#CBD5E1"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
      </svg>
    );
  }

  if (type === "shadow") {
    return (
      <svg width={size} height={size} viewBox="0 0 40 40">
        <text
          x="14"
          y="22"
          fontSize="14"
          fontFamily="system-ui, sans-serif"
          fontWeight="700"
          fill="#111827"
        >
          T
        </text>
        <rect x="18" y="23" width="10" height="4" fill="#E5E7EB" rx="2" />
      </svg>
    );
  }

  if (type === "highlight") {
    return (
      <svg width={size} height={size} viewBox="0 0 40 40">
        <rect x="9" y="10" width="22" height="20" rx="6" fill="#DBEAFE" />
        <text
          x="20"
          y="24"
          fontSize="14"
          textAnchor="middle"
          fontFamily="system-ui, sans-serif"
          fontWeight="700"
          fill="#111827"
        >
          A
        </text>
      </svg>
    );
  }

  if (type === "glitch") {
    return (
      <svg width={size} height={size} viewBox="0 0 40 40">
        <text
          x="20"
          y="24"
          fontSize="14"
          textAnchor="middle"
          fontFamily="system-ui, sans-serif"
          fontWeight="700"
          fill="#111827"
        >
          A
        </text>
        <path
          d="M11 26 L16 14"
          stroke="#06B6D4"
          strokeWidth="2.4"
          strokeLinecap="round"
        />
        <path
          d="M24 26 L29 14"
          stroke="#EC4899"
          strokeWidth="2.4"
          strokeLinecap="round"
        />
      </svg>
    );
  }

  if (type === "echo") {
    return (
      <svg width={size} height={size} viewBox="0 0 40 40">
        <text
          x="17"
          y="22"
          fontSize="14"
          textAnchor="middle"
          fontFamily="system-ui, sans-serif"
          fontWeight="700"
          fill="#9CA3AF"
        >
          A
        </text>
        <text
          x="22"
          y="24"
          fontSize="14"
          textAnchor="middle"
          fontFamily="system-ui, sans-serif"
          fontWeight="700"
          fill="#111827"
        >
          A
        </text>
      </svg>
    );
  }

  if (type === "shape-curve") {
    return (
    <svg width={200} height={80} viewBox="0 0 40 40">
  {/* Define the curved path */}
  <path
    id="curvePath"
    d="M10 26 C16 16, 24 16, 30 26"
    stroke="#111827"
    strokeWidth="1.5"
    fill="none"
    strokeLinecap="round"
  />
 
  {/* Text on the curve */}
  <text
    fontSize="9"
    fontFamily="system-ui, sans-serif"
    fontWeight="700"
    letterSpacing="1"
    fill="#111827"
   dy="-3"
  >
    <textPath href="#curvePath" startOffset="50%" textAnchor="middle" >
      ABCD
    </textPath>
  </text>
</svg>

    );
  }

  return null;
}
