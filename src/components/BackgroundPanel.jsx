  // src/components/BackgroundPanel.jsx
  import React from "react";
  import { HexColorPicker } from "react-colorful";
  import "./BackgroundPanel.css";

  /* helper: normalize hex (robust) */
  const normHex = (v) => {
    if (!v || typeof v !== "string") return "";
    const s = v.trim();
    return s[0] === "#" ? s.toUpperCase() : `#${s.toUpperCase()}`;
  };

  /* helper: hex -> rgb */
  function hexToRgb(hex) {
    if (!hex) return { r: 255, g: 255, b: 255 };
    const h = hex.replace("#", "");
    const clean = h.length === 3 ? h.split("").map((c) => c + c).join("") : h;
    const bigint = parseInt(clean, 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return { r, g, b };
  }

  /* helper: hex -> cmyk (0-100) */
  function hexToCmyk(hex) {
    const { r, g, b } = hexToRgb(hex);
    if (r === 0 && g === 0 && b === 0) return { c: 0, m: 0, y: 0, k: 100 };
    const rr = r / 255;
    const gg = g / 255;
    const bb = b / 255;
    const k = 1 - Math.max(rr, gg, bb);
    const denom = 1 - k || 1;
    const c = Math.round(((1 - rr - k) / denom) * 100);
    const m = Math.round(((1 - gg - k) / denom) * 100);
    const y = Math.round(((1 - bb - k) / denom) * 100);
    return { c, m, y, k: Math.round(k * 100) };
  }

  /* tiny debounce helper */
  function debounce(fn, delay = 100) {
    let t;
    return (...args) => {
      clearTimeout(t);
      t = setTimeout(() => fn(...args), delay);
    };
  }

  export default function BackgroundPanel({
    initialHex = "#FFFFFF",
    onApply = () => {},
    initialRecents = [],
    presets = [
      "#ffffff","#f5f5f5","#ffe7e7","#ffd9b3",
      "#fff2b3","#e8ffdb","#dbe7ff","#e7e7ff",
      "#f0d9ff"
    ],
  }) {
    const [hex, setHex] = React.useState(normHex(initialHex));
    const [tempHex, setTempHex] = React.useState(normHex(initialHex));
    const [recent, setRecent] = React.useState(initialRecents.slice(0,8));
    const [showCmyk, setShowCmyk] = React.useState(false);
    const [activeTab, setActiveTab] = React.useState("swatches"); // swatches | cmyk

    React.useEffect(() => {
      const n = normHex(initialHex);
      setHex(n);
      setTempHex(n);
    }, [initialHex]);

    const debouncedApply = React.useMemo(
      () =>
        debounce((value) => {
          if (typeof onApply === "function") onApply(normHex(value));
        }, 80),
      [onApply]
    );

    const apply = (h) => {
      const normalized = normHex(h);
      setHex(normalized);
      setTempHex(normalized);
      setRecent((prev) => {
        const next = [normalized, ...prev.filter((c) => c !== normalized)];
        return next.slice(0, 8);
      });
      if (typeof onApply === "function") onApply(normalized);
    };

    const clear = () => {
      setHex("");
      setTempHex("");
      if (typeof onApply === "function") onApply(null);
    };

    const handleEyedropper = async () => {
      if (!("EyeDropper" in window)) {
        alert("EyeDropper API not available in this browser.");
        return;
      }
      try {
        // eslint-disable-next-line no-undef
        const eye = new window.EyeDropper();
        const picked = await eye.open();
        if (picked?.sRGBHex) apply(picked.sRGBHex);
      } catch (err) {
        // non-fatal; log optionally
        console.warn("Eyedropper cancelled or failed", err);
      }
    };

    const rgb = hex ? hexToRgb(hex) : { r: 255, g: 255, b: 255 };
    const cmyk = hex ? hexToCmyk(hex) : { c: 0, m: 0, y: 0, k: 0 };

    return (
      <div className="bg-panel swan-style-panel" aria-label="Background color panel">
        <div className="panel-header-compact">
          <h2 className="panel-title-compact">Background color</h2>
          <button
            className="cmyk-toggle"
            onClick={() => setShowCmyk((s) => !s)}
            aria-pressed={showCmyk}
          >
            CMYK
          </button>
        </div>

        <div className="color-picker-wrap">
          <div className="picker-wrap">
            <div className="picker-surface">
              {/* HexColorPicker returns a hex string like "#aabbcc" so normHex is fine */}
              <HexColorPicker
                color={tempHex || "#ffffff"}
                onChange={(v) => {
                  const h = normHex(v);
                  setTempHex(h);
                  debouncedApply(h);
                }}
              />
            </div>
          </div>

          <div className="hex-controls">
            <div className="hex-input-wrap">
              <input
                aria-label="Hex color code"
                className="hex-input"
                value={(tempHex || "").replace("#", "")}
                onChange={(e) => {
                  const raw = e.target.value.replace(/[^0-9a-fA-F]/g, "");
                  const newHex = raw ? `#${raw}` : "";
                  setTempHex(newHex);
                  debouncedApply(newHex);
                }}
              />

              {/* Eyedropper icon: valid SVG path (not '...') */}
              <button className="icon-btn eyedropper" onClick={handleEyedropper} title="Eyedropper" aria-label="Eyedropper">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  {/* Simple safe SVG path for an eyedropper icon */}
                  <path d="M19.07 4.93c-.78-.78-2.05-.78-2.83 0l-1.26 1.26-1.41-1.41 1.26-1.26c1.56-1.56 4.1-1.56 5.66 0 1.56 1.56 1.56 4.1 0 5.66L18.4 10.9l-1.41-1.41 1.26-1.26c.78-.78.78-2.05 0-2.83z" fill="currentColor" />
                  <path d="M3 21v-3.59l11-11L20.59 11 9.59 22H3z" fill="currentColor"/>
                </svg>
              </button>

              <button className="icon-btn clear-circle" onClick={() => apply("")} title="Transparent" aria-label="Set transparent">
                <span className="slash" />
              </button>
            </div>

            <div className="apply-row">
              <button className="btn-apply" onClick={() => apply(tempHex)}>Apply</button>
              <button className="btn-clear" onClick={clear}>Clear</button>
            </div>

            <div className="rgb-meta">RGB: {rgb.r}, {rgb.g}, {rgb.b}</div>
          </div>
        </div>

        <div className="tabs-row" role="tablist" aria-label="Color tabs">
          <button role="tab" aria-selected={activeTab === "swatches"} className={`tab ${activeTab === "swatches" ? "active" : ""}`} onClick={() => setActiveTab("swatches")}>Swatches</button>
          <button role="tab" aria-selected={activeTab === "cmyk"} className={`tab ${activeTab === "cmyk" ? "active" : ""}`} onClick={() => setActiveTab("cmyk")}>CMYK</button>
        </div>

        <div className="tab-content">
          {activeTab === "swatches" && (
            <>
              <div className="section-title">Recent colors</div>
              <div className="swatches-grid">
                {recent.length === 0 ? (
                  <div className="no-recent">No recent colors</div>
                ) : recent.map((c, idx) => (
                  <label key={c + idx} className="swatch-label" title={c}>
                    <input type="radio" name="recent-swatch" className="swatch-radio" onChange={() => apply(c)} />
                    <span className="swatch-visual" style={{ background: c }} />
                  </label>
                ))}
              </div>

              <div className="section-title" style={{ marginTop: 12 }}>Pre-set colors</div>
              <div className="swatches-grid presets-grid">
                {presets.map((p, idx) => (
                  <label key={p + idx} className="swatch-label" title={p}>
                    <input type="radio" name="preset-swatch" className="swatch-radio" onChange={() => apply(p)} />
                    <span className="swatch-visual" style={{ background: p }} />
                  </label>
                ))}
              </div>
            </>
          )}

          {activeTab === "cmyk" && (
            <div className="cmyk-panel">
              <div className="cmyk-row"><label>C</label><input value={cmyk.c} readOnly /></div>
              <div className="cmyk-row"><label>M</label><input value={cmyk.m} readOnly /></div>
              <div className="cmyk-row"><label>Y</label><input value={cmyk.y} readOnly /></div>
              <div className="cmyk-row"><label>K</label><input value={cmyk.k} readOnly /></div>
            </div>
          )}
        </div>
      </div>
    );
  }
