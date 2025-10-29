import React, { useMemo, useState } from "react";

export default function BusinessCardConfigurator({ template = {}, onClose }) {
  const accentStart = template.colors?.[0] || "#111111";

  const [orientation, setOrientation] = useState("horizontal");
  const [side, setSide] = useState("front");
  const [accentColor, setAccentColor] = useState(accentStart);

  const colours = template.colors || ["#111111", "#6b6b6b", "#c7c7c7"];

  const previewStyle = useMemo(() => {
    const common = {
      background: "#fff",
      borderRadius: 8,
      boxShadow: "0 6px 20px rgba(0,0,0,.08)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      position: "relative",
      transition: "all .25s ease, transform 0.6s ease",
      transform: "rotateY(0deg)",
      transformStyle: "preserve-3d",
    };
    return orientation === "vertical"
      ? { ...common, width: 210, height: 440 }
      : { ...common, width: 440, height: 210 };
  }, [orientation]);

  const handleOrientationChange = (newOrientation) => {
    setOrientation(newOrientation);
    if (newOrientation === "vertical") {
      setAccentColor("#23408B");
    } else {
      setAccentColor("#32984D");
    }
  };

  return (
    <div style={{ width: "min(1200px, 95vw)", color: "#111" }}>
      <style>
        {`
          .card-preview:hover {
            transform: rotateY(360deg);
          }
        `}
      </style>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <h2 style={{ margin: 0, fontSize: 24, fontWeight: 800 }}>
        </h2>
        {onClose && (
          <button
            onClick={onClose}
            aria-label="Close"
            style={{ border: "1px solid #e5e7eb", padding: "6px 10px", borderRadius: 8, background: "#fff", cursor: "pointer" }}
          >
            ✕
          </button>
        )}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 420px", gap: 24 }}>
        <div style={{ background: "#f5f6f7", borderRadius: 12, minHeight: 520, display: "grid", placeItems: "center" }}>
          <div style={previewStyle} className="card-preview">
            <div
              style={{
                position: "absolute",
                inset: 8,
                borderRadius: 8,
                border: `2px solid ${accentColor}`,
                pointerEvents: "none",
              }}
            />
            <CardMock side={side} orientation={orientation} accentColor={accentColor} />
          </div>

          <div style={{ display: "flex", gap: 12, marginTop: 18 }}>
            <button onClick={() => setSide("front")} aria-pressed={side === "front"} style={pill(side === "front")}>Front</button>
            <button onClick={() => setSide("back")} aria-pressed={side === "back"} style={pill(side === "back")}>Back</button>
          </div>
        </div>

        <div style={{ padding: 8 }}>
          <p style={{ margin: "0 0 8px", fontSize: 16 }}>
            <strong>{template.qtyBase ?? 100}</strong> from <strong>₹{template.priceFrom ?? 230}.00</strong>
          </p>
          <a href="#" style={{ display: "inline-block", color: "#0a6a4f", textDecoration: "none", fontWeight: 600, marginTop: 2 }}>
            Free delivery <span style={{ textDecoration: "underline" }}>by 30 August</span> to 110001
          </a>

          <section style={{ marginTop: 24 }}>
            <div style={{ fontWeight: 700, marginBottom: 10 }}>Colours</div>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              {colours.map((c) => (
                <button
                  key={c}
                  onClick={() => setAccentColor(c)}
                  aria-label={`Choose colour ${c}`}
                  style={swatch(c, accentColor === c)}
                />
              ))}
            </div>
          </section>

          <section style={{ marginTop: 24 }}>
            <div style={{ fontWeight: 700, marginBottom: 10 }}>Product Orientation</div>
            <div style={{ display: "flex", gap: 14 }}>
              <button
                type="button"
                onClick={() => handleOrientationChange("vertical")}
                aria-pressed={orientation === "vertical"}
                style={optionCard(orientation === "vertical")}
              >
                <div style={{ fontWeight: 700, marginBottom: 6 }}>Vertical</div>
                <div style={{ color: "#6b7280" }}>+₹0.00</div>
              </button>

              <button
                type="button"
                onClick={() => handleOrientationChange("horizontal")}
                aria-pressed={orientation === "horizontal"}
                style={optionCard(orientation === "horizontal")}
              >
                <div style={{ fontWeight: 700, marginBottom: 6 }}>Horizontal</div>
                <div style={{ color: "#6b7280" }}>+₹0.00</div>
              </button>
            </div>
          </section>

          <button
            onClick={() => alert(`Edit with: ${orientation}, ${side}, accent ${accentColor}, template: ${template.title || "Unknown"}`)}
            style={{ marginTop: 24, width: "100%", background: "#77d2f6", color: "#0b2a33", border: "none", borderRadius: 12, padding: "16px 18px", fontWeight: 800, fontSize: 18, cursor: "pointer" }}
          >
            Edit my design
          </button>
          {/* <Link to="/businesscard" className="block">
          <button
            style={{ marginTop: 24, width: "100%", background: "#77d2f6", color: "#0b2a33", border: "none", borderRadius: 12, padding: "16px 18px", fontWeight: 800, fontSize: 18, cursor: "pointer" }}
          >
            Edit my design
          </button>
         </Link> */}
        </div>
      </div>
    </div>
  );
}

function CardMock({ side, orientation, accentColor }) {
  const isVertical = orientation === "vertical";
  return (
    <div
      style={{
        width: isVertical ? 180 : 400,
        height: isVertical ? 400 : 180,
        background: "#ffffff",
        border: "1px solid #e7e9ec",
        padding: 16,
        display: "grid",
        alignContent: "start",
        gap: 10,
      }}
    >
      {side === "front" ? (
        <>
          <div
            style={{
              width: 90,
              height: 90,
              background: "#e9eef2",
              borderRadius: 6,
              display: "grid",
            }}
          >
            Logo
          </div>
          <div style={{ fontWeight: 700, color: accentColor }}>Company Name</div>
          <div style={{ color: accentColor }}>Job Title</div>
        </>
      ) : (
        <>
          <div style={{ fontWeight: 700, marginBottom: 6, color: accentColor }}>About</div>
          <Divider />
          <div style={{ fontWeight: 700, marginBottom: 6, color: accentColor }}>Contact</div>
          <Lines count={3} />
        </>
      )}
    </div>
  );
}

function Divider() { return <div style={{ height: 1, background: "#eef1f4", margin: "2px 0 6px" }} />; }
function Lines({ count = 3 }) {
  return (
    <div style={{ display: "grid", gap: 6 }}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} style={{ height: 10, background: "#f1f4f7", borderRadius: 4 }} />
      ))}
    </div>
  );
}

function pill(active) {
  return {
    background: active ? "#111" : "#fff",
    color: active ? "#fff" : "#111",
    border: active ? "2px solid #111" : "1px solid #d9dde3",
    padding: "12px 22px",
    borderRadius: 12,
    fontWeight: 700,
    cursor: "pointer",
  };
}

function optionCard(active) {
  return {
    width: 210,
    background: "#fff",
    borderRadius: 12,
    padding: "14px 16px",
    border: active ? "2px solid #111" : "1px solid #e3e6ea",
    boxShadow: active ? "0 6px 18px rgba(0,0,0,.06)" : "none",
    textAlign: "left",
    cursor: "pointer",
    transition: "border-color .15s ease, box-shadow .15s ease",
  };
}

function swatch(hex, selected) {
  const isLight = hex.toLowerCase() === "#ffffff";
  return {
    width: 36,
    height: 36,
    borderRadius: 999,
    background: hex,
    border: isLight ? "1px solid #dcdfe4" : "none",
    outline: selected ? "3px solid #111" : "3px solid transparent",
    cursor: "pointer",
  };
}