// src/components/TemplatePreview.jsx
import React, { useMemo } from "react";
import { findTemplate } from "../templates";

/* ---------------------------
   Small shared helpers
   ---------------------------*/

// Generic logo box moved to top so helper templates can use it
const LogoBox = ({ logoUrl = "", size = 32, radius = 4, border = true }) => (
  <div
    style={{
      width: size,
      height: size,
      borderRadius: radius,
      border: border ? "1px solid rgba(0,0,0,0.15)" : "none",
      backgroundColor: logoUrl ? "transparent" : "#f0f0f0",
      backgroundImage: logoUrl ? `url(${logoUrl})` : "none",
      backgroundSize: "cover",
      backgroundPosition: "center",
    }}
  />
);

// Minimal Rounded viewport wrapper (small safe-zone/rounded container)
function RoundedCornerViewport({ width = 320, height = 200, radius = 18, bleed = 8, children }) {
  return (
    <div
      style={{
        width,
        height,
        borderRadius: radius,
        overflow: "hidden",
        background: "#fff",
        position: "relative",
        border: "1px solid rgba(0,0,0,0.08)",
        boxSizing: "border-box",
      }}
    >
      {/* safety dashed */}
      <div
        style={{
          position: "absolute",
          inset: bleed,
          borderRadius: radius - bleed,
          border: "1px dashed rgba(0,0,0,0.10)",
          pointerEvents: "none",
        }}
      />
      <div style={{ width: "100%", height: "100%", position: "relative" }}>{children}</div>
    </div>
  );
}

/* ---------------------------
   Rounded templates (helpers)
   Keep these small and do not destructure unused props
   ---------------------------*/

// Minimal rounded card (use inside TemplatePreview when templateId === "rounded_minimal")
function RoundedMinimal({ palette = {}, data = {} }) {
  const company = data.companyName || "Company Name";
  const full = data.fullName || "Full Name";
  const phone = data.phone || "";
  const web = data.web || "";

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        padding: 14,
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        fontFamily: "Inter, system-ui, Arial",
      }}
    >
      <div style={{ textAlign: "center" }}>
        {data.logoUrl ? (
          <div
            style={{
              width: 84,
              height: 84,
              margin: "6px auto",
              backgroundImage: `url(${data.logoUrl})`,
              backgroundSize: "contain",
              backgroundRepeat: "no-repeat",
              backgroundPosition: "center",
            }}
          />
        ) : (
          <div style={{ width: 84, height: 84, margin: "6px auto", background: "#f3f3f3", borderRadius: 6 }} />
        )}
        <div style={{ fontWeight: 800, fontSize: 16, color: palette.accent || "#0B3A82" }}>{company}</div>
        <div style={{ marginTop: 6, fontSize: 11, color: palette.primary || "#444" }}>{data.companyMessage || ""}</div>
      </div>

      <div style={{ textAlign: "center", marginTop: 6 }}>
        <div style={{ fontWeight: 700 }}>{full}</div>
        <div style={{ fontSize: 12, color: "#666" }}>{phone}</div>
        <div style={{ fontSize: 11, color: "#666", marginTop: 6 }}>{web}</div>
      </div>
    </div>
  );
}

// Wave rounded card (use when templateId === "rounded_wave")
function RoundedWave({ palette = {}, data = {} }) {
  const company = data.companyName || "Company Name";
  const full = data.fullName || "Full Name";
  const phone = data.phone || "";
  const web = data.web || "";

  return (
    <div style={{ width: "100%", height: "100%", position: "relative", fontFamily: "Inter,system-ui,Arial" }}>
      {/* Top accent */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 0,
          height: "36%",
          background: `linear-gradient(180deg, ${palette.accent || "#0B3A82"} 0%, ${palette.accent2 || "#067C4F"} 100%)`,
        }}
      />

      {/* white lower cut with curve */}
      <svg viewBox="0 0 100 40" preserveAspectRatio="none" style={{ position: "absolute", left: 0, right: 0, top: "28%", height: "26%" }}>
        <path d="M0,35 C20,10 80,10 100,35 L100,100 L0,100 Z" fill="#fff" />
      </svg>

      {/* Content */}
      <div style={{ position: "absolute", inset: 12, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
        <div style={{ color: "#fff", fontWeight: 800, fontSize: 14 }}>{company}</div>
        <div style={{ background: "#fff", padding: 8, borderRadius: 8 }}>
          <div style={{ fontWeight: 700 }}>{full}</div>
          <div style={{ fontSize: 12, color: "#555" }}>{data.jobTitle || ""}</div>
          <div style={{ marginTop: 6, fontSize: 11, color: "#666" }}>{phone}</div>
        </div>
        <div style={{ fontSize: 11, textAlign: "right", color: palette.accent || "#0B3A82" }}>{web}</div>
      </div>
    </div>
  );
}

// Photo style (use when templateId === "rounded_photo")
function RoundedPhoto({ palette = {}, data = {} }) {
  const company = data.companyName || "Company Name";
  const full = data.fullName || "Full Name";
  const phone = data.phone || "";
  const web = data.web || "";

  return (
    <div style={{ width: "100%", height: "100%", display: "flex", fontFamily: "Inter,system-ui,Arial" }}>
      <div style={{ flex: "0 0 40%", background: "#eee", display: "flex", alignItems: "center", justifyContent: "center" }}>
        {data.photo1 ? (
          <div style={{ width: "90%", height: "90%", backgroundImage: `url(${data.photo1})`, backgroundSize: "cover", backgroundPosition: "center", borderRadius: 6 }} />
        ) : (
          <div style={{ width: "80%", height: "56%", background: "#f4f4f6", borderRadius: 6 }} />
        )}
      </div>

      <div style={{ flex: "1 1 60%", padding: 12, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
        <div>
          <div style={{ fontWeight: 800, color: palette.accent || "#0B3A82" }}>{company}</div>
          <div style={{ fontSize: 12, color: "#666", marginTop: 6 }}>{data.companyMessage || ""}</div>
        </div>

        <div style={{ textAlign: "right" }}>
          <div style={{ fontWeight: 700 }}>{full}</div>
          <div style={{ fontSize: 12, color: "#555" }}>{phone}</div>
          <div style={{ fontSize: 11, color: palette.primary || "#333", marginTop: 6 }}>{web}</div>
        </div>
      </div>
    </div>
  );
}

/* ---------------------------
   Main TemplatePreview component
   --------------------------- */
export default function TemplatePreview({
  templateId,
  paletteId,
  data = {},
  width = 320,
  height = 180,
  className = "",
}) {
  const template = useMemo(() => findTemplate(templateId), [templateId]);

  const palette = useMemo(() => {
    if (!template) return {};
    return template.palettes?.find((p) => p.id === paletteId) || template.palettes?.[0] || {};
  }, [template, paletteId]);

  // common fields with safe defaults
  const companyName = data.companyName?.trim() || "Company Name";
  const fullName = data.fullName?.trim() || "Full Name";
  const jobTitle = data.jobTitle?.trim() || "Job Title";
  const web = data.web?.trim() || "website.com";
 const logoUrl = (data && (data.logoUrl || data.image || data.photo1 || "")) || "";


  // Destructure additional fields used in templates to avoid no-undef
  const { phone = "", email = "", address = "", address1 = "", address2 = "", companyMessage = "" } = data || {};

  // === square / rounded template variants that use the helpers above
  if (templateId === "rounded_minimal") {
    return (
      <RoundedCornerViewport width={width} height={height} radius={18} bleed={8}>
        <RoundedMinimal palette={palette} data={data} />
      </RoundedCornerViewport>
    );
  }

  if (templateId === "rounded_wave") {
    return (
      <RoundedCornerViewport width={width} height={height} radius={18} bleed={8}>
        <RoundedWave palette={palette} data={data} />
      </RoundedCornerViewport>
    );
  }

  if (templateId === "rounded_photo") {
    return (
      <RoundedCornerViewport width={width} height={height} radius={18} bleed={8}>
        <RoundedPhoto palette={palette} data={data} />
      </RoundedCornerViewport>
    );
  }
  // === Square single logo (new) ===
  if (templateId === "vp_square_single_logo" || templateId === "vp_square_single_logo_alt") {
    return (
      <div
        className={className}
        style={{
          width,
          height,
          borderRadius: "10px",
          border: "1px solid #ddd",
          backgroundColor: palette.bg || "#fff",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "space-between",
          padding: 12,
          fontFamily: "Inter, system-ui, Arial, sans-serif",
        }}
      >
        {/* Top area: image */}
        <div
          style={{
            width: "100%",
            height: "70%",
            backgroundColor: "#f4f4f6",
            borderRadius: 8,
            overflow: "hidden",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {logoUrl ? (
            <div
              style={{
                width: "70%",
                height: "70%",
                backgroundImage: `url(${logoUrl})`,
                backgroundSize: "contain",
                backgroundRepeat: "no-repeat",
                backgroundPosition: "center",
              }}
            />
          ) : (
            <div
              style={{
                color: "#aaa",
                fontWeight: 700,
                fontSize: "16px",
                letterSpacing: 0.6,
              }}
            >
              Your Logo
            </div>
          )}
        </div>

        {/* Bottom area */}
        <div
          style={{
            textAlign: "center",
            width: "100%",
            marginTop: 8,
          }}
        >
          <div
            style={{
              fontWeight: 700,
              fontSize: "14px",
              color: palette.primary || "#222",
            }}
          >
            {companyName}
          </div>
          <div
            style={{
              fontSize: "11px",
              color: "#555",
              marginTop: 4,
            }}
          >
            {phone || "Phone / Other"}
          </div>
        </div>
      </div>
    );
  }

  // ===== Template: vp_ribbon =====
  if (templateId === "vp_ribbon") {
    return (
      <div
        className={className}
        style={{
          width,
          height,
          borderRadius: "8px",
          border: "1px solid #ddd",
          backgroundColor: palette.bg || "#fff",
          position: "relative",
          overflow: "hidden",
          fontFamily:
            '"Inter", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
        }}
      >
        {/* gray vertical bar on left */}
        <div
          style={{
            position: "absolute",
            inset: "0 auto 0 0",
            width: "10%",
            backgroundColor: "#E5E7EB",
          }}
        />

        {/* top-left name / job */}
        <div
          style={{
            position: "absolute",
            left: "15%",
            top: "18%",
            fontSize: "14px",
            fontWeight: 700,
            lineHeight: 1.2,
            color: palette.accent || "#C52B2B",
          }}
        >
          {fullName}
          <div
            style={{
              fontSize: "10px",
              fontWeight: 400,
              paddingTop:"5px",
              color: palette.primary || "#333",
            }}
          >
            {jobTitle}
          </div>
        </div>

        {/* ribbon bar across middle */}
        <div
          style={{
            position: "absolute",
            left: "10%",
            right: "5%",
            top: "48%",
            minHeight: "20px",
            backgroundColor: palette.accent || "#C52B2B",
            borderTop: `3px solid ${
              palette.accent2 || palette.accent || "#8F1E1E"
            }`,
            display: "flex",
            alignItems: "center",
            paddingLeft: "16px",
            color: "#fff",
            fontWeight: 600,
            fontSize: "11px",
            lineHeight: 1.2,
          }}
        >
          {companyName}
        </div>

        {/* web bottom-right */}
        <div
          style={{
            position: "absolute",
            right: "12%",
            bottom: "12%",
            fontSize: "10px",
            fontWeight: 500,
            color: palette.accent || "#C52B2B",
          }}
        >
          {web}
        </div>

        {/* logo placeholder top-right */}
        <div
          style={{
            position: "absolute",
            right: "12%",
            top: "16%",
          }}
        >
          <LogoBox size={40} radius={4} logoUrl={logoUrl}/>
        </div>
      </div>
    );
  }

  // ===== Template: lh_premium_letterhead (basic letterhead for Premium Letterhead product) =====
  if (templateId === "premium-letterhead") {
    const headerBg = `linear-gradient(135deg, ${
      palette.primary || "#0B3A82"
    } 0%, ${palette.accent || "#2563EB"} 55%, ${palette.accent2 || "#E5E7EB"} 100%)`;

    return (
      <div
        className={className}
        style={{
          width,
          height,
          borderRadius: 8,
          border: "1px solid #e5e7eb",
          backgroundColor: "#ffffff",
          position: "relative",
          overflow: "hidden",
          fontFamily: 'Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
        }}
      >
        {/* TOP BAND */}
        <div
          style={{
            height: "18%",
            padding: "10px 18px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            background: headerBg,
            color: "#ffffff",
          }}
        >
          <div style={{ lineHeight: 1.2 }}>
            <div
              style={{
                fontSize: 12,
                fontWeight: 700,
                letterSpacing: 0.4,
              }}
            >
              {companyName}
            </div>
            <div
              style={{
                fontSize: 9,
                marginTop: 4,
                opacity: 0.9,
              }}
            >
              {companyMessage?.trim() || "Professional branded letterhead"}
            </div>
          </div>

          {/* logo box on the right */}
          <LogoBox size={34} radius={4} logoUrl={logoUrl} />
        </div>

        {/* BODY – fake text lines */}
        {/* <div
          style={{
            position: "absolute",
            top: "20%",
            bottom: "22%",
            left: 22,
            right: 22,
          }}
        >
          {Array.from({ length: 7 }).map((_, idx) => (
            <div
              key={idx}
              style={{
                height: 3,
                borderRadius: 9999,
                backgroundColor: "#e5e7eb",
                marginTop: idx === 0 ? 14 : 8,
                width: `${90 - idx * 6}%`,
              }}
            />
          ))}
        </div> */}

        {/* FOOTER – contact bar */}
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            bottom: 0,
            height: "18%",
            borderTop: "1px solid #e5e7eb",
            backgroundColor: palette.accent2 || "#f9fafb",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "8px 18px",
            fontSize: 9,
            color: "#4b5563",
          }}
        >
          <div style={{ lineHeight: 1.4 }}>
            <div>{address1 || address || "Address Line 1"}</div>
            <div>{address2 || "City, State – PIN"}</div>
          </div>

          <div style={{ textAlign: "right", lineHeight: 1.4 }}>
            <div>{phone || "Phone"}</div>
            <div>{email || "you@email.com"}</div>
            <div>{web}</div>
          </div>
        </div>
      </div>
    );
  }


 if (templateId === "vp_ribbon2") {
    return (
      <div
        className={className}
        style={{
          width,
          height,
          borderRadius: "8px",
          border: "1px solid #ddd",
          backgroundColor: palette.bg || "#fff",
          position: "relative",
          overflow: "hidden",
          fontFamily:
            '"Inter", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
        }}
      >
        {/* gray vertical bar on left */}
        <div
          style={{
            position: "absolute",
            inset: "0 auto 0 0",
            width: "10%",
            backgroundColor: "#E5E7EB",
          }}
        />

        {/* top-left name / job */}
        <div
          style={{
            position: "absolute",
            left: "15%",
            top: "18%",
            fontSize: "14px",
            fontWeight: 700,
            lineHeight: 1.2,
            color: palette.accent || "#C52B2B",
          }}
        >
          {fullName}
          <div
            style={{
              fontSize: "10px",
              fontWeight: 400,
              paddingTop:"5px",
              color: palette.primary || "#333",
            }}
          >
            {jobTitle}
          </div>
        </div>

        {/* ribbon bar across middle */}
        <div
          style={{
            position: "absolute",
            left: "10%",
            right: "5%",
            top: "48%",
            minHeight: "20px",
            backgroundColor: palette.accent || "#C52B2B",
            borderTop: `3px solid ${
              palette.accent2 || palette.accent || "#8F1E1E"
            }`,
            display: "flex",
            alignItems: "center",
            paddingLeft: "16px",
            color: "#fff",
            fontWeight: 600,
            fontSize: "11px",
            lineHeight: 1.2,
          }}
        >
          {companyName}
        </div>

        {/* web bottom-right */}
        <div
          style={{
            position: "absolute",
            right: "12%",
            bottom: "12%",
            fontSize: "10px",
            fontWeight: 500,
            color: palette.accent || "#C52B2B",
          }}
        >
          {web}
        </div>

        {/* logo placeholder top-right */}
        <div
          style={{
            position: "absolute",
            right: "12%",
            top: "16%",
          }}
        >
          <LogoBox size={40} radius={4} logoUrl={logoUrl}/>
        </div>
      </div>
    );
  }
  // ===== Template: vp_top_banner =====
  if (templateId === "vp_top_banner") {
    return (
      <div
        className={className}
        style={{
          width,
          height,
          borderRadius: "8px",
          border: "1px solid #ddd",
          backgroundColor: palette.bg || "#fff",
          position: "relative",
          overflow: "hidden",
          fontFamily:
            '"Inter", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
        }}
      >
        {/* top colored bar */}
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 0,
            height: "30%",
            backgroundColor: palette.accent || "#9BC243",
            borderBottom: `4px solid ${
              palette.accent2 || "#6F8E2A"
            }`,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "6px 30px",
            color: "#fff",
            fontWeight: 700,
            fontSize: "12px",
            
            lineHeight: 1.2,
          }}
        >
          {/* logo on left */}
          <LogoBox size={42} radius={4} border={true} logoUrl={logoUrl}/>

          {/* company name on right */}
          <div
            style={{
              // marginRight:"15px",
              flex: "1 1 auto",
              textAlign: "right",
              fontSize: "11px",
            }}
          >
            {companyName}
          </div>
        </div>

        {/* name + job under banner */}
        <div
          style={{
            position: "absolute",
            left: "10%",
            top: "42%",
            fontWeight: 700,
            fontSize: "13px",
            lineHeight: 1.2,
            color: palette.primary || "#333",
          }}
        >
          {fullName}
          <div
            style={{
              fontSize: "10px",
              fontWeight: 500,
              color: "#666",
              paddingTop:"5px"
            }}
          >
            {jobTitle}
          </div>
        </div>

        {/* website bottom-left */}
        <div
          style={{
            position: "absolute",
            left: "10%",
            bottom: "12%",
            fontSize: "10px",
            fontWeight: 500,
            color: palette.accent || "#9BC243",
          }}
        >
          {web}
        </div>
      </div>
    );
  }

  // ===== Template: vp_bottom_wave =====
  if (templateId === "vp_bottom_wave") {
    return (
      <div
        className={className}
        style={{
          width,
          height,
          borderRadius: "8px",
          border: "1px solid #ddd",
          backgroundColor: palette.bg || "#fff",
          position: "relative",
          overflow: "hidden",
          fontFamily:
            '"Inter", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
        }}
      >
        {/* angled wave on right bottom */}
        <div
          style={{
            position: "absolute",
            right: "-10%",
            bottom: 0,
            width: "110%",
            height: "63%",
            backgroundColor: palette.accent || "#004AAD",
            transform: "skewY(-18deg)",
            transformOrigin: "top right",
          }}
        />

        {/* name + title left top */}
        <div
          style={{
            position: "absolute",
            left: "6%",
            top: "20%",
            fontWeight: 800,
            fontSize: "14px",
            lineHeight: 1.2,
            color: palette.primary || "#222",
          }}
        >
          {fullName}
          <div
            style={{
              fontSize: "10px",
              fontWeight: 500,
              paddingTop:"5px",
              color: "#4B5563",
            }}
          >
            {jobTitle}
          </div>
        </div>

        {/* company in accent color */}
        <div
          style={{
            position: "absolute",
            left: "6%",
            top: "42%",
            fontWeight: 700,
            fontSize: "12px",
            color: palette.accent || "#004AAD",
          }}
        >
          {companyName}
        </div>

        {/* logo box top-right */}
        <div
          style={{
            position: "absolute",
            right: "12%",
            top: "16%",
          }}
        >
          <LogoBox size={42} radius={4} logoUrl={logoUrl} />
        </div>

        {/* website near wave */}
        <div
          style={{
            position: "absolute",
            left: "40%",
            bottom: "5%",
            fontSize: "10px",
            fontWeight: 600,
            color: "#fff",
          }}
        >
          {web}
        </div>
      </div>
    );
  }

  // ===== Template: vp_screenshot_match =====
  if (templateId === "vp_screenshot_match") {
    return (
      <div
        className={className}
        style={{
          width,
          height,
          borderRadius: "8px",
          border: "1px solid #ddd",
          backgroundColor: palette.bg || "#fff",
          position: "relative",
          overflow: "hidden",
          fontFamily:
            '"Inter", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
        }}
      >
        {/* cream footer block with top accent line */}
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            bottom: 0,
            height: "35%",
            backgroundColor: palette.cream || "#F2EBC7",
            borderTop: `3px solid ${
              palette.accent2 || palette.accent || "#0B3A82"
            }`,
          }}
        />

        {/* logo box top-left */}
        <div
          style={{
            position: "absolute",
            left: "8%",
            top: "16%",
          }}
        >
          <LogoBox size={42} radius={4} logoUrl={logoUrl}/>
        </div>

        {/* company + tagline */}
        <div
          style={{
            position: "absolute",
            left: "36%",
            top: "15%",
            lineHeight: 1.2,
            fontFamily: '"Playfair Display", Georgia, serif',
            fontWeight: 700,
            fontSize: "13px",
            color: palette.accent || "#0B3A82",
          }}
        >
          {companyName}
          <div
            style={{
              fontSize: "10px",
              fontWeight: 400,
              paddingTop:"8px",
              color: palette.primary || "#2A2A2A",
            }}
          >
            {companyMessage?.trim() || "Tagline goes here"}
          </div>
        </div>

        {/* footer fullName + web in cream area */}
        <div
          style={{
            position: "absolute",
            left: "8%",
            bottom: "10%",
            fontFamily: '"Playfair Display", Georgia, serif',
            fontWeight: 700,
            fontSize: "12px",
            color: palette.accent || "#0B3A82",
            lineHeight: 1.2,
          }}
        >
          {fullName}
          <div
            style={{
              fontSize: "10px",
              fontWeight: 400,
              color: palette.primary || "#2A2A2A",
              paddingTop:"5px",
              fontFamily:
                '"Inter", system-ui, Arial, sans-serif',
            }}
          >
            {web}
          </div>
        </div>
      </div>
    );
  }

  // ===== Template: vp_square_modern_grid =====
  if (templateId === "vp_square_modern_grid") {
    return (
      <div
        className={className}
        style={{
          width,
          height,
          borderRadius: "8px",
          border: "1px solid #ddd",
          backgroundColor: palette.bg || "#fff",
          position: "relative",
          overflow: "hidden",
          fontFamily:
            '"Inter", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
        }}
      >

        {/* ================= TOP GRID ================= */}
        {/* Left Square Logo Tile */}
        <div
          style={{
            position: "absolute",
            left: "6%",
            top: "8%",
            width: "35%",
            height: "35%",
            backgroundColor: palette.cream || "#F7F7F2",
            borderRadius: "6px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <LogoBox size={68} radius={5} logoUrl={logoUrl}/>
        </div>

        {/* Right - Company Title */}
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: "15%",
            lineHeight: 1.25,
            width: "58%",
          }}
        >
          <div
            style={{
              fontFamily: '"Playfair Display", Georgia, serif',
              fontWeight: 700,
              fontSize: "15px",
              color: palette.accent || "#0B3A82",
            }}
          >
            {companyName}
          </div>

          <div
            style={{
              fontFamily: '"Inter", system-ui, Arial',
              fontWeight: 400,
              fontSize: "11px",
              paddingTop: "6px",
              color: palette.primary || "#2A2A2A",
            }}
          >
            {companyMessage?.trim() || "Your message goes here"}
          </div>
        </div>

        {/* Divider */}
        <div
          style={{
            position: "absolute",
            left: "6%",
            top: "65%",
            width: "88%",
            height: "2px",
            backgroundColor: palette.accent2 || palette.accent || "#0B3A82",
          }}
        />

        {/* =================== BOTTOM GRID ==================== */}
        {/* Left Block */}
        <div
          style={{
            position: "absolute",
            left: "6%",
            top: "75%",
            width: "40%",
            lineHeight: 1.25,
          }}
        >
          <div
            style={{
              fontFamily: '"Playfair Display", Georgia, serif',
              fontWeight: 700,
              fontSize: "14px",
              color: palette.accent || "#0B3A82",
            }}
          >
            {fullName}
          </div>

          <div
            style={{
              paddingTop: "6px",
              fontFamily: '"Inter", system-ui, Arial',
              fontWeight: 400,
              fontSize: "11px",
              color: palette.primary || "#2A2A2A",
            }}
          >
            {phone}
          </div>

          <div
            style={{
              paddingTop: "4px",
              fontFamily: '"Inter", system-ui, Arial',
              fontWeight: 400,
              fontSize: "11px",
              color: palette.primary || "#2A2A2A",
            }}
          >
            {email}
          </div>
        </div>

        {/* Right Block */}
        <div
          style={{
            position: "absolute",
            left: "65%",
            top: "75%",
            width: "40%",
            lineHeight: 1.25,
          }}
        >
          <div
            style={{
              fontFamily: '"Playfair Display", Georgia, serif',
              fontWeight: 700,
              fontSize: "14px",
              color: palette.accent || "#0B3A82",
            }}
          >
            Website
          </div>

          <div
            style={{
              paddingTop: "6px",
              fontFamily: '"Inter", system-ui, Arial',
              fontWeight: 400,
              fontSize: "11px",
              color: palette.primary || "#2A2A2A",
            }}
          >
            {web}
          </div>

          <div
            style={{
              paddingTop: "4px",
              fontFamily: '"Inter", system-ui, Arial',
              fontWeight: 400,
              fontSize: "10px",
              color: palette.primary || "#2A2A2A",
              maxWidth: "90%",
            }}
          >
            {address}
          </div>
        </div>


      </div>
    );
  }

  // ===== Template: vp_square_modern_grid2 =====
  if (templateId === "vp_square_modern_grid2") {
    return (
      <div
        className={className}
        style={{
          width,
          height,
          borderRadius: "300px",
          border: "1px solid #ddd",
          backgroundColor: palette.bg || "#fff",
          position: "relative",
          overflow: "hidden",
          fontFamily:
            '"Inter", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
        }}
      >

        {/* ================= TOP GRID ================= */}
        {/* Left Square Logo Tile */}
        <div
          style={{
            position: "absolute",
            left: "30%",
            top: "8%",
            width: "35%",
            height: "35%",
            backgroundColor: palette.cream || "#F7F7F2",
            borderRadius: "6px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <LogoBox size={68} radius={5} logoUrl={logoUrl}/>
        </div>

        {/* Right - Company Title */}
        <div
          style={{
            position: "absolute",
            left: "30%",
            top: "48%",
            lineHeight: 1.25,
            width: "58%",
          }}
        >
          <div
            style={{
              fontFamily: '"Playfair Display", Georgia, serif',
              fontWeight: 700,
              fontSize: "15px",
              color: palette.accent || "#0B3A82",
            }}
          >
            {companyName}
          </div>

          <div
            style={{
              fontFamily: '"Inter", system-ui, Arial',
              fontWeight: 400,
              fontSize: "11px",
              paddingTop: "6px",
              paddingLeft:"15px",
              color: palette.primary || "#2A2A2A",
            }}
          >
            {companyMessage?.trim() || "Your message goes here"}
          </div>
        </div>

        {/* Divider */}
        <div
          style={{
            position: "absolute",
            left: "6%",
            top: "65%",
            width: "88%",
            height: "2px",
            backgroundColor: palette.accent2 || palette.accent || "#0B3A82",
          }}
        />

        {/* =================== BOTTOM GRID ==================== */}
        {/* Left Block */}
        <div
          style={{
            position: "absolute",
            left: "38%",
            top: "75%",
            width: "40%",
            lineHeight: 1.25,
          }}
        >
          <div
            style={{
              fontFamily: '"Playfair Display", Georgia, serif',
              fontWeight: 700,
              fontSize: "14px",
              color: palette.accent || "#0B3A82",
            }}
          >
            {fullName}
          </div>

  

          <div
            style={{
              paddingTop: "4px",
              fontFamily: '"Inter", system-ui, Arial',
              fontWeight: 400,
              fontSize: "11px",
              color: palette.primary || "#2A2A2A",
            }}
          >
            {email}
          </div>
        </div>

      </div>
    );
  }
  // ===== Template: vp_standard_nnc =====
  if (templateId === "vp_standard_nnc") {
    const footerBg = palette.accent || "#0E3B53";
    const footerAccent = palette.accent2 || "#0B2C3B";
    const primary = palette.primary || "#FFC61A";

    return (
      <div
        className={className}
        style={{
          width,
          height,
          borderRadius: "8px",
          border: "1px solid #ddd",
          backgroundColor: palette.bg || "#fff",
          position: "relative",
          overflow: "hidden",
          fontFamily: 'Inter, system-ui, Arial, sans-serif',
        }}
      >
        {/* Top white area (visual) */}
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 0,
            height: "60%",
            backgroundColor: palette.bg || "#fff",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "flex-start",
            paddingTop: Math.max(8, (height * 0.03)) /* small top pad */,
          }}
        >
          {/* centered small square logo */}
          <div
            style={{
              width: Math.max(36, width * 0.16),
              height: Math.max(36, height * 0.22),
              borderRadius: 6,
              overflow: "hidden",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 8,
            }}
          >
            {logoUrl ? (
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  backgroundImage: `url(${logoUrl})`,
                  backgroundSize: "contain",
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "center",
                }}
              />
            ) : (
              <LogoBox size={Math.max(42, width * 0.12)} radius={6} logoUrl={logoUrl}/>
            )}
          </div>

          {/* Big initials / company name (center) */}
          <div
            style={{
              fontSize: Math.max(16, width * 0.08),
              fontWeight: 800,
              color: primary,
              textAlign: "center",
              lineHeight: 1,
              letterSpacing: 0.5,
              marginBottom: 6,
            }}
          >
            {companyName}
          </div>

          {/* small company message under brand */}
          <div
            style={{
              fontSize: Math.max(9, width * 0.032),
              fontWeight: 600,
              color: footerAccent,
              textAlign: "center",
              opacity: 0.95,
            }}
          >
            {companyMessage?.trim() || "Company message"}
          </div>
        </div>



        {/* Footer band */}
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: "60%",
            bottom: 0,
            backgroundColor: footerBg,
            display: "flex",
            paddingLeft: "6%",
            paddingRight: "6%",
            alignItems: "center",
          }}
        >
          {/* left column (accent name, job, phone) */}
          <div style={{ flex: "0 0 45%", color: "#E6EEF3" }}>
            <div style={{ fontWeight: 800, fontSize: Math.max(10, width * 0.036), color: primary }}>
              {companyName}
            </div>
            <div style={{ fontSize: Math.max(8, width * 0.028), marginTop: 6, opacity: 0.95 }}>
              {jobTitle || "Job Title"}
            </div>
            <div style={{ fontSize: Math.max(9, width * 0.03), marginTop: 6, fontWeight: 700 }}>
              {phone || "Phone / Other"}
            </div>
          </div>

          {/* right column (address lines and web) */}
          <div style={{ flex: "1 1 55%", color: "#E6EEF3", textAlign: "right" }}>
            <div style={{ fontSize: Math.max(9, width * 0.03), fontWeight: 700 }}>
              {address1 || "Address Line 1"}
            </div>
            <div style={{ fontSize: Math.max(9, width * 0.03), marginTop: 6 }}>
              {address2 || "Address Line 2"}
            </div>
            <div style={{ fontSize: Math.max(9, width * 0.03), marginTop: 6, fontWeight: 600, color: primary }}>
              {web}
            </div>
          </div>
        </div>

        {/* subtle diagonal glossy overlay on footer (pure CSS) */}
        <div
          aria-hidden
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: "60%",
            bottom: 0,
            pointerEvents: "none",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute",
              left: "55%",
              top: "-10%",
              width: "60%",
              height: "160%",
              transform: "skewX(-18deg)",
              background:
                "linear-gradient(120deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02) 40%, rgba(255,255,255,0) 70%)",
              opacity: 0.6,
            }}
          />
        </div>
      </div>
    );
  }

  // ===== Template: vp_square_single_logo =====
  if (templateId === "vp_square_single_logo" || templateId === "vp_square_single_logo_alt") {
    // logoUrl may be blob: or normal URL; LogoBox handles it
    return (
      <div
        className={className}
        style={{
          width,
          height,
          borderRadius: "8px",
          border: "1px solid #ddd",
          backgroundColor: palette.bg || "#fff",
          position: "relative",
          overflow: "hidden",
          fontFamily: 'Inter, system-ui, Arial, sans-serif',
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "space-between",
          padding: 12,
        }}
      >
        {/* Top area: image fill */}
        <div style={{
          width: "100%",
          height: "68%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#f4f4f6",
          borderRadius: 6,
          overflow: "hidden"
        }}>
          {/* If logoUrl present, show it, else show a stylised placeholder */}
          {logoUrl ? (
            <div
              style={{
                width: "70%",
                height: "70%",
                backgroundImage: `url(${logoUrl})`,
                backgroundSize: "contain",
                backgroundRepeat: "no-repeat",
                backgroundPosition: "center",
              }}
            />
          ) : (
            // simple placeholder "Your Logo" indicator
            <div style={{
              width: "70%",
              height: "70%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#9aa0a6",
              fontWeight: 700,
              fontSize: 18,
              letterSpacing: 0.6,
              textAlign: "center"
            }}>
              Your Logo
            </div>
          )}
        </div>

        {/* Bottom area: company name + phone */}
        <div style={{
          width: "100%",
          marginTop: 8,
          textAlign: "center",
        }}>
          <div style={{
            fontSize: 13,
            fontWeight: 700,
            color: palette.primary || "#222",
            marginBottom: 6,
          }}>
            {companyName}
          </div>

          <div style={{
            fontSize: 11,
            fontWeight: 400,
            color: "#555"
          }}>
            {phone || "Phone / Other"}
          </div>
        </div>
      </div>
    );
  }

   // ===== Template: vp_standard_nnc =====
  if (templateId === "vp_standard_nnc2") {
    const footerBg = palette.accent || "#0E3B53";
    const footerAccent = palette.accent2 || "#0B2C3B";
    const primary = palette.primary || "#FFC61A";

    return (
      <div
        className={className}
        style={{
          width,
          height,
          borderRadius: "8px",
          border: "1px solid #ddd",
          backgroundColor: palette.bg || "#fff",
          position: "relative",
          overflow: "hidden",
          fontFamily: 'Inter, system-ui, Arial, sans-serif',
        }}
      >
        {/* Top white area (visual) */}
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 0,
            height: "60%",
            backgroundColor: palette.bg || "#fff",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "flex-start",
            paddingTop: Math.max(8, (height * 0.03)) /* small top pad */,
          }}
        >
          {/* centered small square logo */}
          <div
            style={{
              width: Math.max(36, width * 0.16),
              height: Math.max(36, height * 0.22),
              borderRadius: 6,
              overflow: "hidden",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 8,
            }}
          >
            {logoUrl ? (
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  backgroundImage: `url(${logoUrl})`,
                  backgroundSize: "contain",
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "center",
                }}
              />
            ) : (
              <LogoBox size={Math.max(42, width * 0.12)} radius={6} />
            )}
          </div>

          {/* Big initials / company name (center) */}
          <div
            style={{
              fontSize: Math.max(16, width * 0.08),
              fontWeight: 800,
              color: primary,
              textAlign: "center",
              lineHeight: 1,
              letterSpacing: 0.5,
              marginBottom: 6,
            }}
          >
            {companyName}
          </div>

          {/* small company message under brand */}
          <div
            style={{
              fontSize: Math.max(9, width * 0.032),
              fontWeight: 600,
              color: footerAccent,
              textAlign: "center",
              opacity: 0.95,
            }}
          >
            {companyMessage?.trim() || "Company message"}
          </div>
        </div>



        {/* Footer band */}
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: "60%",
            bottom: 0,
            backgroundColor: footerBg,
            display: "flex",
            paddingLeft: "6%",
            paddingRight: "6%",
            alignItems: "center",
          }}
        >
          {/* left column (accent name, job, phone) */}
          <div style={{ flex: "0 0 45%", color: "#E6EEF3" }}>
            <div style={{ fontWeight: 800, fontSize: Math.max(10, width * 0.036), color: primary }}>
              {companyName}
            </div>
            <div style={{ fontSize: Math.max(8, width * 0.028), marginTop: 6, opacity: 0.95 }}>
              {jobTitle || "Job Title"}
            </div>
            <div style={{ fontSize: Math.max(9, width * 0.03), marginTop: 6, fontWeight: 700 }}>
              {phone || "Phone / Other"}
            </div>
          </div>

          {/* right column (address lines and web) */}
          <div style={{ flex: "1 1 55%", color: "#E6EEF3", textAlign: "right" }}>
            <div style={{ fontSize: Math.max(9, width * 0.03), fontWeight: 700 }}>
              {address1 || "Address Line 1"}
            </div>
            <div style={{ fontSize: Math.max(9, width * 0.03), marginTop: 6 }}>
              {address2 || "Address Line 2"}
            </div>
            <div style={{ fontSize: Math.max(9, width * 0.03), marginTop: 6, fontWeight: 600, color: primary }}>
              {web}
            </div>
          </div>
        </div>

        {/* subtle diagonal glossy overlay on footer (pure CSS) */}
        <div
          aria-hidden
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: "60%",
            bottom: 0,
            pointerEvents: "none",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute",
              left: "55%",
              top: "-10%",
              width: "60%",
              height: "160%",
              transform: "skewX(-18deg)",
              background:
                "linear-gradient(120deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02) 40%, rgba(255,255,255,0) 70%)",
              opacity: 0.6,
            }}
          />
        </div>
      </div>
    );
  }

  // ===== Template: vp_screenshot_match =====
  if (templateId === "vp_screenshot_match1") {
    return (
      <div
        className={className}
        style={{
          width,
          height,
          borderRadius: "300px",
          border: "1px solid #ddd",
          backgroundColor: palette.bg || "#fff",
          position: "relative",
          overflow: "hidden",
          fontFamily:
            '"Inter", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
        }}
      >
        {/* cream footer block with top accent line */}
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            bottom: 0,
            height: "35%",
            backgroundColor: palette.cream || "#F2EBC7",
            borderTop: `3px solid ${
              palette.accent2 || palette.accent || "#0B3A82"
            }`,
          }}
        />

        {/* logo box top-left */}
        <div
          style={{
            position: "absolute",
            left: "35%",
            top: "10%",
          }}
        >
          <LogoBox size={92} radius={4} logoUrl={logoUrl}/>
        </div>

        {/* company + tagline */}
        <div
          style={{
            position: "absolute",
            left: "34%",
            top: "45%",
            lineHeight: 1.2,
            fontFamily: '"Playfair Display", Georgia, serif',
            fontWeight: 700,
            fontSize: "13px",
            color: palette.accent || "#0B3A82",
          }}
        >
          {companyName}
          <div
            style={{
              fontSize: "10px",
              fontWeight: 400,
              paddingTop:"8px",
              paddingLeft:"10px",
              color: palette.primary || "#2A2A2A",
            }}
          >
            {companyMessage?.trim() || "Tagline goes here"}
          </div>
        </div>

        {/* footer fullName + web in cream area */}
        <div
          style={{
            position: "absolute",
            left: "40%",
            bottom: "10%",
            fontFamily: '"Playfair Display", Georgia, serif',
            fontWeight: 700,
            fontSize: "12px",
            color: palette.accent || "#0B3A82",
            lineHeight: 1.2,
          }}
        >
          {fullName}
          <div
            style={{
              fontSize: "10px",
              fontWeight: 400,
              color: palette.primary || "#2A2A2A",
              paddingTop:"5px",
              fontFamily:
                '"Inter", system-ui, Arial, sans-serif',
            }}
          >
            {web}
          </div>
        </div>
      </div>
    );
  }

  
  // ===== Template: vp_screenshot_match =====
  if (templateId === "vp_screenshot_match2") {
    return (
      <div
        className={className}
        style={{
          width,
          height,
          borderRadius: "300px",
          border: "1px solid #ddd",
          backgroundColor: palette.bg || "#fff",
          position: "relative",
          overflow: "hidden",
          fontFamily:
            '"Inter", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
        }}
      >
        {/* cream footer block with top accent line */}
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            bottom: 0,
            height: "35%",
            backgroundColor: palette.cream || "#F2EBC7",
            borderTop: `3px solid ${
              palette.accent2 || palette.accent || "#0B3A82"
            }`,
          }}
        />

        {/* logo box top-left */}
        <div
          style={{
            position: "absolute",
            left: "35%",
            top: "10%",
          }}
        >
          <LogoBox size={92} radius={4} logoUrl={logoUrl}/>
        </div>

        {/* company + tagline */}
        <div
          style={{
            position: "absolute",
            left: "34%",
            top: "45%",
            lineHeight: 1.2,
            fontFamily: '"Playfair Display", Georgia, serif',
            fontWeight: 700,
            fontSize: "13px",
            color: palette.accent || "#0B3A82",
          }}
        >
          {companyName}
          <div
            style={{
              fontSize: "10px",
              fontWeight: 400,
              paddingTop:"8px",
              paddingLeft:"10px",
              color: palette.primary || "#2A2A2A",
            }}
          >
            {companyMessage?.trim() || "Tagline goes here"}
          </div>
        </div>

        {/* footer fullName + web in cream area */}
        <div
          style={{
            position: "absolute",
            left: "40%",
            bottom: "10%",
            fontFamily: '"Playfair Display", Georgia, serif',
            fontWeight: 700,
            fontSize: "12px",
            color: palette.accent || "#0B3A82",
            lineHeight: 1.2,
          }}
        >
          {fullName}
          <div
            style={{
              fontSize: "10px",
              fontWeight: 400,
              color: palette.primary || "#2A2A2A",
              paddingTop:"5px",
              fontFamily:
                '"Inter", system-ui, Arial, sans-serif',
            }}
          >
            {web}
          </div>
        </div>
      </div>
    );
  }



  // Example inside TemplatePreview render path
if (templateId === "rounded_minimal") {
  return (
    <RoundedCornerViewport width={width} height={height} radius={18} bleed={8}>
      <RoundedMinimal palette={palette} data={data} width={width} height={height} />
    </RoundedCornerViewport>
  );
}

if (templateId === "rounded_wave") {
  return (
    <RoundedCornerViewport width={width} height={height} radius={18} bleed={8}>
      <RoundedWave palette={palette} data={data} width={width} height={height} />
    </RoundedCornerViewport>
  );
}

if (templateId === "rounded_photo") {
  return (
    <RoundedCornerViewport width={width} height={height} radius={18} bleed={8}>
      <RoundedPhoto palette={palette} data={data} width={width} height={height} />
    </RoundedCornerViewport>
  );
}


  // fallback, unknown template id
  return (
    <div
      className={className}
      style={{
        width,
        height,
        borderRadius: "8px",
        border: "1px solid #ddd",
        backgroundColor: "#f7f7f8",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#999",
        fontSize: "12px",
        textAlign: "center",
      }}
    >
      {template ? template.name : templateId}
    </div>
  );
}
