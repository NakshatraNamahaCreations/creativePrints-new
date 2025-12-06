// src/components/TextToolbarPanels.jsx
import React from "react";

/**
 * Presentational panel components used by TextToolbar.
 * They are dumb components — they only render UI and call provided callbacks.
 */

/* ---------- CasePanel ---------- */
export function CasePanel({ onTitle, onLower, onUpper }) {
  return (
    <div
      style={{
        position: "absolute",
        top: 52,
        right: 0,
        padding: 10,
        background: "#ffffff",
        borderRadius: 12,
        boxShadow: "0 10px 30px rgba(15,23,42,0.12)",
        border: "1px solid rgba(148,163,184,0.18)",
        width: 180,
        zIndex: 9999,
      }}
    >
      <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 8 }}>Case</div>

      <div style={{ display: "flex", gap: 8 }}>
        <button
          onClick={onTitle}
          style={{
            flex: 1,
            padding: "6px 8px",
            borderRadius: 8,
            border: "1px solid #e5e7eb",
            background: "#f9fafb",
            cursor: "pointer",
          }}
          title="Title Case"
        >
          Aa
        </button>

        <button
          onClick={onLower}
          style={{
            flex: 1,
            padding: "6px 8px",
            borderRadius: 8,
            border: "1px solid #e5e7eb",
            background: "#f9fafb",
            cursor: "pointer",
          }}
          title="lowercase"
        >
          a↓
        </button>

        <button
          onClick={onUpper}
          style={{
            flex: 1,
            padding: "6px 8px",
            borderRadius: 8,
            border: "1px solid #111827",
            background: "#111827",
            color: "#fff",
            cursor: "pointer",
          }}
          title="UPPERCASE"
        >
          A↑
        </button>
      </div>
    </div>
  );
}

/* ---------- RotatePanel ---------- */
export function RotatePanel({
  localRotate,
  onRotateChange,
  onResetRotation,
  visible,
}) {
  if (!visible) return null;
  return (
    <div
      style={{
        position: "absolute",
        top: 52,
        right: 0,
        padding: 12,
        background: "#ffffff",
        borderRadius: 12,
        boxShadow: "0 10px 30px rgba(15,23,42,0.12)",
        border: "1px solid rgba(148,163,184,0.18)",
        width: 260,
        zIndex: 9999,
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <div style={{ fontSize: 12, fontWeight: 600 }}>Rotation</div>
        <button
          onClick={() => {
            onResetRotation();
          }}
          style={{
            border: "none",
            background: "transparent",
            cursor: "pointer",
            color: "#111827",
          }}
          title="Reset rotation"
        >
          ↺
        </button>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 8 }}>
        <input
          type="range"
          min={-180}
          max={180}
          value={localRotate}
          onChange={(e) => onRotateChange(Number(e.target.value))}
          style={{ flex: 1 }}
        />
        <input
          type="number"
          value={localRotate}
          onChange={(e) => onRotateChange(Number(e.target.value))}
          style={{
            width: 56,
            padding: "4px 6px",
            borderRadius: 6,
            border: "1px solid #e5e7eb",
            textAlign: "center",
          }}
        />
      </div>
    </div>
  );
}

/* ---------- FlipPanel ---------- */
export function FlipPanel({ onFlipVertical, onFlipHorizontal, visible }) {
  if (!visible) return null;
  return (
    <div
      style={{
        position: "absolute",
        top: 52,
        right: 0,
        padding: 10,
        background: "#ffffff",
        borderRadius: 10,
        boxShadow: "0 8px 20px rgba(15,23,42,0.12)",
        border: "1px solid rgba(148,163,184,0.18)",
        width: 160,
        zIndex: 9999,
      }}
    >
      <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 8 }}>Flip</div>
      <button
        onClick={onFlipVertical}
        style={{
          display: "flex",
          gap: 8,
          alignItems: "center",
          padding: "8px 10px",
          borderRadius: 8,
          border: "1px solid #e5e7eb",
          background: "#fff",
          width: "100%",
          cursor: "pointer",
          marginBottom: 6,
        }}
        title="Flip vertically"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M7 4h10v2H7zM6 8h12v8H6zM7 20h10v-2H7z" fill="currentColor" />
        </svg>
        <span style={{ fontSize: 13 }}>Vertically</span>
      </button>

      <button
        onClick={onFlipHorizontal}
        style={{
          display: "flex",
          gap: 8,
          alignItems: "center",
          padding: "8px 10px",
          borderRadius: 8,
          border: "1px solid #e5e7eb",
          background: "#fff",
          width: "100%",
          cursor: "pointer",
        }}
        title="Flip horizontally"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M4 7h2v10H4zM8 6h10v12H8zM20 7h2v10h-2z" fill="currentColor" />
        </svg>
        <span style={{ fontSize: 13 }}>Horizontally</span>
      </button>
    </div>
  );
}

/* ---------- MorePanel (Duplicate/Delete) ---------- */
export function MorePanel({
  onDuplicate,
  onDelete,
  visible,
}) {
  if (!visible) return null;
  return (
    <div
      style={{
        position: "absolute",
        top: 52,
        right: 0,
        padding: 10,
        background: "#ffffff",
        borderRadius: 10,
        boxShadow: "0 8px 20px rgba(15,23,42,0.12)",
        border: "1px solid rgba(148,163,184,0.18)",
        width: 160,
        zIndex: 9999,
      }}
    >
      <button
        onClick={onDuplicate}
        style={{
          display: "flex",
          gap: 8,
          alignItems: "center",
          padding: "8px 10px",
          borderRadius: 8,
          border: "1px solid #e5e7eb",
          background: "#fff",
          width: "100%",
          cursor: "pointer",
          marginBottom: 6,
        }}
        title="Duplicate"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M7 7h10v10H7zM3 3h10v10H3z" fill="currentColor" />
        </svg>
        <span style={{ fontSize: 13 }}>Duplicate</span>
      </button>

      <button
        onClick={onDelete}
        style={{
          display: "flex",
          gap: 8,
          alignItems: "center",
          padding: "8px 10px",
          borderRadius: 8,
          border: "1px solid #ffe0e0",
          background: "#fff",
          width: "100%",
          cursor: "pointer",
        }}
        title="Delete"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
          <path
            d="M6 7h12v12a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V7zm3-4h6l1 2H8l1-2z"
            fill="currentColor"
          />
        </svg>
        <span style={{ fontSize: 13 }}>Delete</span>
      </button>
    </div>
  );
}

/* ---------- OpacityPanel ---------- */
export function OpacityPanel({ opacityPercent, onOpacityChange, onReset, visible }) {
  if (!visible) return null;
  return (
    <div
      style={{
        position: "absolute",
        top: 52,
        right: 0,
        padding: 12,
        background: "#ffffff",
        borderRadius: 12,
        boxShadow: "0 10px 30px rgba(15,23,42,0.25)",
        border: "1px solid rgba(148,163,184,0.4)",
        width: 230,
        zIndex: 9999,
      }}
    >
      <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 8 }}>Opacity</div>

      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <input
          type="range"
          min={0}
          max={100}
          value={opacityPercent}
          onChange={(e) => onOpacityChange(e.target.value)}
          style={{ flex: 1 }}
        />

        <button
          type="button"
          onClick={onReset}
          style={{
            borderRadius: 9999,
            border: "1px solid #e5e7eb",
            padding: "4px 6px",
            background: "#f9fafb",
            cursor: "pointer",
            fontSize: 11,
          }}
          title="Reset opacity"
        >
          ↺
        </button>

        <input
          type="number"
          min={0}
          max={100}
          value={opacityPercent}
          onChange={(e) => onOpacityChange(Math.min(100, Math.max(0, Number(e.target.value))))}
          style={{
            width: 48,
            padding: "3px 4px",
            borderRadius: 6,
            border: "1px solid #e5e7eb",
            fontSize: 11,
            textAlign: "center",
          }}
        />
      </div>
    </div>
  );
}

/* ---------- SpacingPanel ---------- */
export function SpacingPanel({
  localLineSpacing,
  onLineSpacingChange,
  onResetLineSpacing,
  localLetterSpacing,
  onLetterSpacingChange,
  onResetLetterSpacing,
  visible,
}) {
  if (!visible) return null;
  return (
    <div
      style={{
        position: "absolute",
        top: 52,
        right: 0,
        padding: 12,
        background: "#ffffff",
        borderRadius: 12,
        boxShadow: "0 10px 30px rgba(15,23,42,0.25)",
        border: "1px solid rgba(148,163,184,0.4)",
        width: 300,
        zIndex: 9999,
      }}
    >
      <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 8 }}>Line spacing</div>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
        <input
          type="range"
          min={0}
          max={3}
          step={0.1}
          value={localLineSpacing}
          onChange={(e) => onLineSpacingChange(e.target.value)}
          style={{ flex: 1 }}
        />
        <button
          onClick={onResetLineSpacing}
          style={{
            borderRadius: 9999,
            padding: "6px",
            border: "1px solid #e5e7eb",
            background: "#f9fafb",
            cursor: "pointer",
          }}
          title="Reset line spacing"
        >
          ↺
        </button>
        <input
          type="number"
          step={0.1}
          min={0}
          max={3}
          value={localLineSpacing}
          onChange={(e) => onLineSpacingChange(e.target.value)}
          style={{
            width: 60,
            padding: "3px 6px",
            borderRadius: 6,
            border: "1px solid #e5e7eb",
          }}
        />
      </div>

      <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 8 }}>Letter spacing</div>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <input
          type="range"
          min={-0.2}
          max={1.5}
          step={0.01}
          value={localLetterSpacing}
          onChange={(e) => onLetterSpacingChange(e.target.value)}
          style={{ flex: 1 }}
        />
        <button
          onClick={onResetLetterSpacing}
          style={{
            borderRadius: 9999,
            padding: "6px",
            border: "1px solid #e5e7eb",
            background: "#f9fafb",
            cursor: "pointer",
          }}
          title="Reset letter spacing"
        >
          ↺
        </button>
        <input
          type="number"
          step={0.01}
          min={-0.2}
          max={1.5}
          value={localLetterSpacing}
          onChange={(e) => onLetterSpacingChange(e.target.value)}
          style={{
            width: 60,
            padding: "3px 6px",
            borderRadius: 6,
            border: "1px solid #e5e7eb",
          }}
        />
      </div>
    </div>
  );
}
