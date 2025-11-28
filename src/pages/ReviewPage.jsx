// src/pages/ReviewPage.jsx
import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import * as FabricNS from "fabric";
import { findTemplate } from "../templates";
import { buildCardPx } from "../utils/cardDims";

const fabric = FabricNS.fabric ?? FabricNS.default ?? FabricNS;
const CARD = buildCardPx(300);

export default function ReviewPage() {
  const { sessionId } = useParams();
  const navigate = useNavigate();

  // server-loaded session
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  // approval checkbox
  const [agree, setAgree] = useState(false);

  // which side are we previewing in UI ("front" | "back")
  const [side, setSide] = useState("front");

  // fabric refs (only used if we fallback render instead of screenshot)
  const canvasRef = useRef(null);
  const fabricRef = useRef(null);

  // --- 1. Fetch session from backend ---
  useEffect(() => {
    async function fetchSession() {
      try {
        setLoading(true);
        setLoadError("");

        const res = await fetch(
          `http://localhost:5000/api/design-session/${sessionId}`
        );
        if (!res.ok) throw new Error("Failed to load design");

        const json = await res.json();
        if (!json.ok) throw new Error("Bad response from server");

        setSession(json.session);
      } catch (err) {
        console.error(err);
        setLoadError("Unable to load your saved design.");
      } finally {
        setLoading(false);
      }
    }

    fetchSession();
  }, [sessionId]);

  // --- 2. Setup Fabric once (used only for fallback)
  useEffect(() => {
    if (!canvasRef.current) return;
    const c = new fabric.Canvas(canvasRef.current, {
      backgroundColor: "#fff",
      preserveObjectStacking: true,
      selection: false,
    });
    fabricRef.current = c;

    const ratio = window.devicePixelRatio || 1;
    c.setHeight(CARD.h);
    c.setWidth(CARD.w);
    c.setZoom(ratio);

    return () => c.dispose();
  }, []);

  // --- 3. Fallback render when we DON'T have screenshots for that side ---
  useEffect(() => {
    if (!session || !fabricRef.current) return;

    // If we have screenshots for both sides, we won't use fallback.
    // Fallback only runs if we do NOT have screenshot for currently selected side.
    const hasFrontPng =
      !!session.previewFrontPng || !!session.previewPng;
    const hasBackPng = !!session.previewBackPng;

    if (side === "front" && hasFrontPng) return;
    if (side === "back" && hasBackPng) return;

    // otherwise render bakedEls[side] into Fabric
    const {
      templateId,
      paletteId,
      data = {},
      bakedFrontEls = [],
      bakedBackEls = [],
      posOverrides = {},
      styleOverrides = {},
      shapeOverrides = {},
    } = session;

    const tplBase = findTemplate(templateId);
    if (!tplBase) return;

    const palette =
      tplBase.palettes?.find((p) => p.id === paletteId) ||
      tplBase.palettes?.[0];

    const c = fabricRef.current;
    c.clear();

    const resolveColor = (val) => {
      if (!val) return val;
      if (val === "{bg}") return palette?.bg || "#fff";
      if (val === "{primary}") return palette?.primary || "#111";
      if (val === "{accent}") return palette?.accent || "#06f";
      if (val === "{accent2}")
        return palette?.accent2 || palette?.accent || "#06f";
      if (val === "{cream}") return palette?.cream || "#fbf9ce";
      return val;
    };

    const toPx = (v, axis) => {
      if (typeof v === "string" && v.endsWith("%")) {
        return axis === "x"
          ? (parseFloat(v) / 100) * CARD.w
          : (parseFloat(v) / 100) * CARD.h;
      }
      return v ?? 0;
    };

    const loadFabricImage = (u, options = {}) => {
      const maybe = fabric.Image.fromURL(u, options);
      if (maybe && typeof maybe.then === "function") return maybe; // fabric v6+
      return new Promise((resolve) => {
        fabric.Image.fromURL(u, (img) => resolve(img), options); // fabric v4/v5
      });
    };

    const sideEls = side === "front" ? bakedFrontEls : bakedBackEls;

    // build/render each baked el
    sideEls.forEach((el, idx) => {
      const elId = el._elId || el.id || `el-${idx}`;

      const ovPos = posOverrides[elId] || {};
      const ovShape = shapeOverrides[elId] || {};
      const ovStyle = el.bindTo
        ? styleOverrides[el.bindTo]
        : undefined;

      // final position
      const xPct = ovPos.xPct != null ? `${ovPos.xPct}%` : el.x;
      const yPct = ovPos.yPct != null ? `${ovPos.yPct}%` : el.y;

      // Skip empty/deleted text/image
      if (
        el.bindTo &&
        (el.type === "text" ||
          el.type === "textbox" ||
          el.type === "image")
      ) {
        const userVal = data[el.bindTo];
        const isEmpty =
          userVal == null || String(userVal).trim().length === 0;
        if (isEmpty) return;
      }

      // TEXT
      if (el.type === "text" || el.type === "textbox") {
        const textVal = el.bindTo
          ? data[el.bindTo] ?? el.text ?? ""
          : el.text ?? "";

        const fontSize =
          (ovStyle && ovStyle.fontSize) ||
          el.fontSize ||
          14;

        const obj = new fabric.Text(String(textVal), {
          left: toPx(xPct, "x"),
          top: toPx(yPct, "y"),
          fontFamily: el.fontFamily || "Inter, system-ui, Arial",
          fontWeight: el.fontWeight || 400,
          fontSize,
          fill: resolveColor(el.fill) || "#111",
          selectable: false,
          evented: false,
        });

        c.add(obj);
      }

      // RECT
      if (el.type === "rect") {
        const baseW =
          el.w === "100%" ? CARD.w : toPx(el.w, "x");
        const baseH =
          el.h === "100%" ? CARD.h : toPx(el.h, "y");

        const finalW = ovShape.wPx ?? baseW;
        const finalH = ovShape.hPx ?? baseH;

        const obj = new fabric.Rect({
          left: toPx(xPct, "x"),
          top: toPx(yPct, "y"),
          width: finalW,
          height: finalH,
          fill: resolveColor(el.fill),
          rx: el.rounded
            ? typeof el.rounded === "number"
              ? el.rounded
              : 8
            : el.rx ?? 0,
          ry: el.rounded
            ? typeof el.rounded === "number"
              ? el.rounded
              : 8
            : el.ry ?? 0,
          selectable: false,
          evented: false,
        });

        c.add(obj);
      }

      // POLYGON
      if (el.type === "polygon") {
        const basePts = (el.points || []).map((p) => ({
          x: toPx(p.x, "x"),
          y: toPx(p.y, "y"),
        }));

        const pts = ovShape.points || basePts;

        const obj = new fabric.Polygon(pts, {
          left: 0,
          top: 0,
          fill: resolveColor(el.fill) || "transparent",
          stroke: resolveColor(el.stroke),
          strokeWidth: el.strokeWidth ?? 0,
          selectable: false,
          evented: false,
        });

        c.add(obj);
      }

      // IMAGE
      if (el.type === "image") {
        const left = toPx(xPct, "x");
        const top = toPx(yPct, "y");
        const boxW = toPx(el.w, "x");
        const boxH = toPx(el.h, "y");

        const url = el.bindTo ? data[el.bindTo] : el.src;
        if (!url) return;

        // temporary placeholder while async loads
        const holder = new fabric.Rect({
          left,
          top,
          width: boxW,
          height: boxH,
          fill: "#EEE",
          stroke: "#DDD",
          selectable: false,
          evented: false,
        });
        c.add(holder);

        const opts = String(url).startsWith("blob:")
          ? {}
          : { crossOrigin: "anonymous" };

        loadFabricImage(url, opts).then((img) => {
          const iw = img.width || 1;
          const ih = img.height || 1;
          const fitScale = Math.min(boxW / iw, boxH / ih);

          if (ovShape.scaleX && ovShape.scaleY) {
            img.set({
              left,
              top,
              scaleX: ovShape.scaleX,
              scaleY: ovShape.scaleY,
              selectable: false,
              evented: false,
            });
          } else {
            img.set({
              left,
              top,
              scaleX: fitScale,
              scaleY: fitScale,
              selectable: false,
              evented: false,
            });
          }

          if (el.mask === "circle" || el.mask === "rounded") {
            const clip =
              el.mask === "circle"
                ? new fabric.Circle({
                    radius:
                      Math.min(boxW, boxH) /
                      2 /
                      (img.scaleX || 1),
                    left:
                      boxW /
                      2 /
                      (img.scaleX || 1),
                    top:
                      boxH /
                      2 /
                      (img.scaleY || 1),
                    originX: "center",
                    originY: "center",
                  })
                : new fabric.Rect({
                    width:
                      boxW / (img.scaleX || 1),
                    height:
                      boxH / (img.scaleY || 1),
                    rx: 8 / (img.scaleX || 1),
                    ry: 8 / (img.scaleY || 1),
                    left: 0,
                    top: 0,
                    originX: "left",
                    originY: "top",
                  });
            clip.absolutePositioned = false;
            img.clipPath = clip;
          }

          img.set({
            selectable: false,
            evented: false,
          });

          c.add(img);
          c.remove(holder);
          c.requestRenderAll();
        });
      }
    });

    c.renderAll();
  }, [session, side]);

  // --- Continue button ---
  const handleContinue = () => {
    if (!agree) return;
    navigate("/checkout", { state: { sessionId } });
  };

  // ---- UI states ----
  if (loading) {
    return <div className="p-6">Loading your design…</div>;
  }

  if (loadError) {
    return (
      <div className="p-6 text-red-600">
        {loadError}
        <button
          className="ml-4 underline"
          onClick={() => navigate(-1)}
        >
          Go back
        </button>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="p-6">
        No session data.
        <button
          className="ml-4 underline"
          onClick={() => navigate(-1)}
        >
          Go back
        </button>
      </div>
    );
  }

  // placeholder warning logic (front side defaults)
  const DEFAULTS = {
    companyName: "Company Name",
    companyMessage: "Company Message",
    fullName: "Full Name",
    jobTitle: "Job Title",
    email: "Email / Other",
    address1: "Address Line 1",
    address2: "Address Line 2",
    cityStatePin: "City, State – PIN",
    phone: "Phone / Other",
    fax: "Fax / Other",
    web: "Web / Other",
    logoUrl: "",
  };

  const placeholderFront = [];
  const frontCheckKeys = [
    "fullName",
    "jobTitle",
    "email",
    "phone",
    "fax",
    "web",
    "companyName",
    "address1",
    "address2",
    "cityStatePin",
    "logoUrl",
  ];

  frontCheckKeys.forEach((k) => {
    if ((session.data?.[k] ?? "") === (DEFAULTS[k] ?? "")) {
      placeholderFront.push(
        k === "web"
          ? "Web / Other"
          : k === "fax"
          ? "Fax / Other"
          : k === "phone"
          ? "Phone / Other"
          : k === "email"
          ? "Email / Other"
          : k === "companyName"
          ? "Company Name"
          : k === "address1"
          ? "Address Line 1"
          : k === "address2"
          ? "Address Line 2"
          : k === "cityStatePin"
          ? "City, State – PIN"
          : k === "fullName"
          ? "Full Name"
          : k === "jobTitle"
          ? "Job Title"
          : k
      );
    }
  });

  // decide which preview to show for the current side
  // priority:
  // - if side==="front": previewFrontPng, fallback previewPng (legacy)
  // - if side==="back" : previewBackPng
  let sidePreviewSrc = "";
  if (side === "front") {
    sidePreviewSrc =
      session.previewFrontPng ||
      session.previewPng || // legacy single-side
      "";
  } else if (side === "back") {
    sidePreviewSrc = session.previewBackPng || "";
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_520px] min-h-[80vh]">
      {/* LEFT: preview */}
      <div className="bg-[#f7f7f8] flex flex-col items-center justify-start p-6">
        {/* side toggle buttons */}
        <div className="flex gap-2 mb-4">
          <button
            type="button"
            className={`px-4 py-2 rounded border ${
              side === "front"
                ? "bg-black text-white"
                : "bg-white text-black"
            }`}
            onClick={() => setSide("front")}
          >
            Front
          </button>
          <button
            type="button"
            className={`px-4 py-2 rounded border ${
              side === "back"
                ? "bg-black text-white"
                : "bg-white text-black"
            }`}
            onClick={() => setSide("back")}
          >
            Back
          </button>
        </div>

        <div className="rounded-xl bg-white p-4 shadow border">
          {sidePreviewSrc ? (
            // show the screenshot captured in Designer
            <img
              src={sidePreviewSrc}
              alt={`${side} preview`}
              className="max-w-full h-auto rounded"
            />
          ) : (
            // Fallback Fabric render if screenshot for that side isn't available
            <canvas
              ref={canvasRef}
              width={CARD.w}
              height={CARD.h}
              aria-label="Card preview"
            />
          )}
        </div>
      </div>

      {/* RIGHT: review panel */}
      <div className="p-6 flex flex-col">
        <h2 className="text-3xl font-bold">Review your design</h2>
        <p className="mt-3">
          Please confirm that your text, logo, and layout are correct.
          This is what will go to print.
        </p>

        <ul className="list-disc pl-6 mt-4 space-y-2 text-sm">
          <li>Spelling and phone numbers are correct</li>
          <li>Nothing important is too close to the edge</li>
          <li>Logos are not blurry or pixelated</li>
        </ul>

        {placeholderFront.length > 0 && (
          <div className="mt-6 border border-red-200 bg-red-50 rounded-lg p-4">
            <div className="font-semibold text-red-700">
              Empty items won't be printed
            </div>
            <div className="text-sm mt-1">
              We noticed you left some placeholder text/images.
              These won't get printed.
            </div>
            <div className="mt-3 text-sm">
              <div>
                <span className="font-semibold">Front:&nbsp;</span>
                {placeholderFront.map((x, i) => (
                  <span
                    key={i}
                    className="mr-2 underline cursor-pointer"
                    onClick={() => {
                      // Send them back to Designer to fix
                      navigate(-1);
                    }}
                  >
                    {x}
                    {i < placeholderFront.length - 1 ? "," : "."}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        <div className="mt-auto pt-6">
          <label className="flex items-start gap-3 text-sm">
            <input
              type="checkbox"
              className="mt-1"
              checked={agree}
              onChange={(e) => setAgree(e.target.checked)}
            />
            <span>
              I confirm I have rights to use this design and I
              approve it for printing.
            </span>
          </label>

          <div className="grid grid-cols-2 gap-4 mt-4">
            <button
              type="button"
              className={`py-3 rounded text-white ${
                agree
                  ? "bg-black"
                  : "bg-gray-400 cursor-not-allowed"
              }`}
              onClick={handleContinue}
              disabled={!agree}
            >
              Continue
            </button>

            <button
              type="button"
              className="py-3 rounded border"
              onClick={() => navigate(-1)}
            >
              Edit my design
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
