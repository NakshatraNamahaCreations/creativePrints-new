// src/components/EffectsPanel.jsx
import React from "react";

export default function EffectsPanel({
  visible,
  onClose,
  // style
  effectStyle,
  shadowEnabled,
  shadowColor,
  shadowDistance,
  shadowOpacity,
  shadowAngle,
  shadowBlur,
  echoSteps,
  // shape
  shapeStyle,
  curveAmount,
  // callbacks
  onSelectStyle,
  onToggleShadow,
  onShadowColorChange,
  onShadowDistanceChange,
  onShadowOpacityChange,
  onShadowAngleChange,
  onShadowBlurChange,
  onEchoStepsChange,
  onSelectShape,
  onCurveAmountChange,
}) {
  if (!visible) return null;

  return (
    <div className="absolute inset-y-0 right-0 w-80 bg-white shadow-xl border-l z-30 p-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-semibold text-lg">Effects</h2>
        <button
          className="border px-2 py-1 rounded text-sm hover:bg-gray-100"
          onClick={onClose}
        >
          Close
        </button>
      </div>

      <div className="space-y-6 text-sm">
        {/* STYLE SECTION */}
        <div>
          <h3 className="font-semibold text-xs uppercase tracking-wide mb-2">
            Style
          </h3>

          <div className="grid grid-cols-2 gap-2 mb-3">
            <StyleButton
              label="None"
              active={effectStyle === "none"}
              onClick={() => onSelectStyle("none")}
            />
            <StyleButton
              label="Shadow"
              active={effectStyle === "shadow"}
              onClick={() => onSelectStyle("shadow")}
            />
            <StyleButton
              label="Glitch"
              active={effectStyle === "glitch"}
              onClick={() => onSelectStyle("glitch")}
            />
            <StyleButton
              label="Echo"
              active={effectStyle === "echo"}
              onClick={() => onSelectStyle("echo")}
            />
          </div>

          {/* Shadow toggle (for Shadow style) */}
          <label className="flex items-center gap-2 mb-3">
            <input
              type="checkbox"
              checked={shadowEnabled && effectStyle === "shadow"}
              onChange={(e) => onToggleShadow(e.target.checked)}
            />
            <span>Enable shadow</span>
          </label>

          {/* Color */}
          <div className="mb-3">
            <div className="flex justify-between items-center mb-1">
              <span>Color</span>
              <input
                type="color"
                value={shadowColor}
                onChange={(e) => onShadowColorChange(e.target.value)}
                className="w-8 h-8 rounded-full border cursor-pointer"
              />
            </div>
          </div>

          {/* Echo-specific slider */}
          <ControlSlider
            label="Steps (Echo)"
            value={echoSteps}
            min={1}
            max={12}
            onChange={onEchoStepsChange}
          />

          {/* Common sliders */}
          <ControlSlider
            label="Distance"
            value={shadowDistance}
            min={0}
            max={100}
            onChange={onShadowDistanceChange}
          />
          <ControlSlider
            label="Opacity"
            value={shadowOpacity}
            min={0}
            max={1}
            step={0.01}
            onChange={onShadowOpacityChange}
          />
          <ControlSlider
            label="Angle"
            value={shadowAngle}
            min={-180}
            max={180}
            onChange={onShadowAngleChange}
          />
          <ControlSlider
            label="Blur"
            value={shadowBlur}
            min={0}
            max={100}
            onChange={onShadowBlurChange}
          />
        </div>

        {/* SHAPE SECTION */}
        <div>
          <h3 className="font-semibold text-xs uppercase tracking-wide mb-2">
            Shape
          </h3>

          <div className="grid grid-cols-2 gap-2 mb-3">
            <StyleButton
              label="None"
              active={shapeStyle === "none"}
              onClick={() => onSelectShape("none")}
            />
            <StyleButton
              label="Curve"
              active={shapeStyle === "curve"}
              onClick={() => onSelectShape("curve")}
            />
          </div>

          <ControlSlider
            label="Curve amount"
            value={curveAmount}
            min={20}
            max={200}
            onChange={onCurveAmountChange}
          />
        </div>
      </div>
    </div>
  );
}

function StyleButton({ label, active, onClick }) {
  return (
    <button
      type="button"
      className={`border rounded-lg px-3 py-2 text-xs text-center transition 
        ${
          active
            ? "bg-black text-white border-black shadow-sm"
            : "bg-white text-gray-800 hover:bg-gray-50"
        }`}
      onClick={onClick}
    >
      {label}
    </button>
  );
}

function ControlSlider({ label, value, min, max, step = 1, onChange }) {
  return (
    <div className="mb-4">
      <div className="flex justify-between mb-1 text-xs">
        <span>{label}</span>
        <span>{value}</span>
      </div>
      <input
        type="range"
        className="w-full"
        value={value}
        min={min}
        max={max}
        step={step}
        onChange={(e) => onChange(Number(e.target.value))}
      />
    </div>
  );
}
