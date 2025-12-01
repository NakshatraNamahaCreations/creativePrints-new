import { useEffect, useMemo, useRef, useState } from "react";
import * as FabricNS from "fabric";

import { findTemplate } from "../templates";
import { buildCardPx } from "../utils/cardDims";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";
const fabric = FabricNS.fabric ?? FabricNS.default ?? FabricNS;

// CATEGORY -> base px mapping (tweak as needed)
const CATEGORY_DIMENSIONS = {
  standard: { dpi: 300, widthMM: 89, heightMM: 51, cornerRadiusMM: 2 },
  "rounded-corner": { dpi: 300, widthMM: 89, heightMM: 51, cornerRadiusMM: 4 },
  rounded: { dpi: 300, widthMM: 89, heightMM: 51, cornerRadiusMM: 2 },
  labels: { dpi: 280, widthMM: 89, heightMM: 51, cornerRadiusMM: 2 },
  square: { dpi: 220, widthMM: 60, heightMM: 60, cornerRadiusMM: 2 },
  special: { dpi: 400, widthMM: 89, heightMM: 51, cornerRadiusMM: 2 },
  "circle-visiting-cards": {
    dpi: 250,
    widthMM: 59,
    heightMM: 61,
    cornerRadiusMM: 50,
  },
  "oval-visiting-cards": {
    dpi: 250,
    widthMM: 59,
    heightMM: 61,
    cornerRadiusMM: 60,
  },

  // 👇 new preview spec for letterhead
  letterhead: { dpi: 72, widthMM: 210, heightMM: 297, cornerRadiusMM: 4 },
};

const DEFAULT_SPEC = { dpi: 300, widthMM: 89, heightMM: 51, cornerRadiusMM: 0 };

// Utility helpers (pure)
const labelFromKey = (key) =>
  key
    .replace(/([A-Z])/g, " $1")
    .replace(/_/g, " ")
    .replace(/\bUrl\b/i, "URL")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/^./, (s) => s.toUpperCase());

const TYPE_HINTS = {
  email: "email",
  web: "url",
  phone: "tel",
  fax: "text",
  logoUrl: "file",
};
const toNumPos = (v) =>
  typeof v === "string" && v.endsWith("%") ? parseFloat(v) : v ?? 0;

const deriveFieldDefsFromElements = (tpl, sideKey = "front") => {
  if (!tpl) return [];
  const sideDef = tpl.sides?.[sideKey];
  const els = (sideDef?.elements || []).filter(
    (e) =>
      e.bindTo &&
      (e.type === "text" || e.type === "textbox" || e.type === "image")
  );

  const seen = new Set();
  const fields = [];
  for (const el of els) {
    const key = el.bindTo;
    if (seen.has(key)) continue;
    seen.add(key);
    if (el.formHidden) continue;

    const low = key.toLowerCase();
    const type =
      TYPE_HINTS[key] ||
      (low.includes("email")
        ? "email"
        : low.includes("web")
        ? "url"
        : low.includes("phone")
        ? "tel"
        : "text");

    fields.push({
      key,
      label: labelFromKey(key),
      type,
      y: toNumPos(el.y),
      x: toNumPos(el.x),
    });
  }

  const hasLogo = (sideDef?.elements || []).some(
    (e) => e.type === "image" && e.bindTo === "logoUrl"
  );
  if (hasLogo && !fields.some((f) => f.key === "logoUrl")) {
    fields.unshift({
      key: "logoUrl",
      label: "Logo URL",
      type: "file",
      x: 0,
      y: 0,
    });
  }

  fields.sort((a, b) => a.y - b.y || a.x - b.x);
  return fields.map((f) => [f.label, f.key, f.type]);
};

const deriveFieldDefs = (tpl, sideKey = "front") => {
  if (tpl?.form?.fields?.length) {
    return tpl.form.fields
      .filter((f) => !f.hidden)
      .sort((a, b) => (a.order ?? 9999) - (b.order ?? 9999))
      .map((f) => [f.label || labelFromKey(f.key), f.key, f.type || "text"]);
  }
  return deriveFieldDefsFromElements(tpl, sideKey);
};

const _isDraggableType = (type) =>
  ["text", "textbox", "image", "rect", "polygon"].includes(type);

function buildSideSnapshot({ tplBase, side, runtimeEls, deletedKeys }) {
  const sideDef = tplBase.sides?.[side];
  const baseSideEls = sideDef?.elements || [];

  const baseEls = baseSideEls.map((el, idx) => ({
    ...el,
    _elId: el._elId || el.id || `base-${side}-${idx}`,
    _origin: "base",
  }));

  const runEls =
    side === "front"
      ? runtimeEls.map((el, idx) => ({
          ...el,
          _elId: el._elId || el.id || `rt-${idx}`,
          _origin: "runtime",
        }))
      : [];

  const deleted = new Set(deletedKeys);
  const filtered = [...baseEls, ...runEls].filter((el) => {
    if (!el.bindTo) return true;
    return !deleted.has(el.bindTo);
  });

  return filtered;
}

export default function useDesignerEngine(templateId, navigate) {
  const templateBase = useMemo(() => findTemplate(templateId), [templateId]);

  // 🔧 BASE SPEC: choose dimensions
  const baseSpec = useMemo(() => {
    if (!templateBase) return DEFAULT_SPEC;

    // read ?product=premium-letterhead from URL (only inside hook)
    let productSlug = "";
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      productSlug = params.get("product") || "";
    }

    // hard override for premium letterhead
    if (productSlug === "premium-letterhead") {
      return CATEGORY_DIMENSIONS.letterhead;
    }

    // 1) explicit spec on template (optional)
    if (templateBase.spec && typeof templateBase.spec === "object") {
      return {
        dpi: templateBase.spec.dpi ?? DEFAULT_SPEC.dpi,
        widthMM: templateBase.spec.widthMM ?? DEFAULT_SPEC.widthMM,
        heightMM: templateBase.spec.heightMM ?? DEFAULT_SPEC.heightMM,
        cornerRadiusMM:
          templateBase.spec.cornerRadiusMM ?? DEFAULT_SPEC.cornerRadiusMM,
      };
    }

    // 2) infer from categories
    const cats = (templateBase.categories || []).map((c) =>
      String(c).toLowerCase()
    );

    for (const c of cats) {
      if (CATEGORY_DIMENSIONS[c]) return CATEGORY_DIMENSIONS[c];
      if (c.includes("square") && CATEGORY_DIMENSIONS.square)
        return CATEGORY_DIMENSIONS.square;
      if (c.includes("round") && CATEGORY_DIMENSIONS.rounded)
        return CATEGORY_DIMENSIONS.rounded;
      if (c.includes("label") && CATEGORY_DIMENSIONS.labels)
        return CATEGORY_DIMENSIONS.labels;
    }

    return DEFAULT_SPEC;
  }, [templateBase]);

  const CARD = useMemo(() => buildCardPx(baseSpec), [baseSpec]);

  const [side, setSide] = useState("front");
  const urlParams =
    typeof window !== "undefined"
      ? new URLSearchParams(window.location.search)
      : new URLSearchParams();
  const initialPaletteId = urlParams.get("palette") || "";
  const [paletteIdx, setPaletteIdx] = useState(() => {
    if (!templateBase?.palettes) return 0;
    const iMatch = templateBase.palettes.findIndex(
      (p) => p.id === initialPaletteId
    );
    return iMatch >= 0 ? iMatch : 0;
  });
  const palette = useMemo(
    () =>
      templateBase?.palettes?.[paletteIdx] ||
      templateBase?.palettes?.[0],
    [templateBase, paletteIdx]
  );

  const FIELD_DEFS = useMemo(
    () => deriveFieldDefs(templateBase, side),
    [templateBase, side]
  );

  const [runtimeEls, setRuntimeEls] = useState([]);
  const [data, setData] = useState({
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
    office: "Office Address",
    Company: "Company",
    name: "Name",
  });

  useEffect(() => {
    if (!templateBase) return;
    setData((prev) => {
      const next = { ...prev };
      for (const [, key] of FIELD_DEFS) {
        if (!(key in next)) next[key] = "";
      }
      return next;
    });
  }, [templateBase, FIELD_DEFS]);

  const canvasRef = useRef(null);
  const fabricRef = useRef(null);

  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [autoHideEmpty, setAutoHideEmpty] = useState(true);
  const [dragEnabled, setDragEnabled] = useState(true);
  const [posOverrides, setPosOverrides] = useState({});
  const [deletedKeys, setDeletedKeys] = useState(() => new Set());
  const [styleOverrides, setStyleOverrides] = useState({});
  const [shapeOverrides, setShapeOverrides] = useState({});
  const [activeEdit, setActiveEdit] = useState(null);
  const editInputRef = useRef(null);
  const [showPreview, setShowPreview] = useState(false);
  const [sessionId, setSessionId] = useState(null);

  const _toPx = (v, axis) => {
    if (typeof v === "string" && v.endsWith("%")) {
      return axis === "x"
        ? (parseFloat(v) / 100) * CARD.w
        : (parseFloat(v) / 100) * CARD.h;
    }
    return v ?? 0;
  };
  const _toPct = (px, axis) =>
    axis === "x" ? (px / CARD.w) * 100 : (px / CARD.h) * 100;

  // init Fabric canvas
  useEffect(() => {
    if (!canvasRef.current) return;

    if (fabricRef.current) {
      try {
        fabricRef.current.dispose();
      } catch (err) {
        // eslint-disable-next-line no-console
        console.warn("fabric dispose error:", err);
      }
      fabricRef.current = null;
    }

    const c = new fabric.Canvas(canvasRef.current, {
      backgroundColor: "#fff",
      preserveObjectStacking: true,
      selection: true,
    });
    fabricRef.current = c;

    const ratio = window.devicePixelRatio || 1;
    c.setHeight(CARD.h);
    c.setWidth(CARD.w);
    c.setZoom(ratio);

    return () => {
      try {
        c.dispose();
      } catch (err) {
        // eslint-disable-next-line no-console
        console.warn("dispose error:", err);
      }
      if (fabricRef.current === c) fabricRef.current = null;
    };
  }, [CARD.w, CARD.h]);

  const loadFabricImage = (url, opts = {}) => {
    const maybe = fabric.Image.fromURL(url, opts);
    if (maybe && typeof maybe.then === "function") return maybe;
    return new Promise((resolve) =>
      fabric.Image.fromURL(url, (img) => resolve(img), opts)
    );
  };

  const enumeratedTemplate = useMemo(() => {
    if (!templateBase) return null;
    const sideDef = templateBase.sides?.[side];
    const baseSideEls = sideDef?.elements || [];

    const baseEls = baseSideEls.map((el, idx) => ({
      ...el,
      _elId: el._elId || (el.id ?? `base-${side}-${idx}`),
      _origin: "base",
    }));

    const runEls =
      side === "front"
        ? runtimeEls.map((el, idx) => ({
            ...el,
            _elId: el._elId || (el.id ?? `rt-${idx}`),
            _origin: "runtime",
          }))
        : [];

    return {
      ...templateBase,
      elements: [...baseEls, ...runEls],
    };
  }, [templateBase, runtimeEls, side]);

  // main render effect (no longer depends on `data`)
  useEffect(() => {
    const tpl = enumeratedTemplate;
    const c = fabricRef.current;
    if (!tpl || !c) return;

    c.clear();

    const resolveColor = (val) => {
      if (!val) return val;
      if (val === "{bg}") return palette?.bg || "#fff";
      if (val === "{primary}") return palette?.primary || "#111";
      if (val === "{accent}") return palette?.accent || "#06f";
      if (val === "{accent2}") return palette?.accent2 || palette?.accent || "#06f";
      if (val === "{cream}") return palette?.cream || "#fbf9ce";
      return val;
    };

    const attachDblClickEdit = (obj) => {
      obj.on("mousedblclick", () => {
        if (!obj.data?.type || obj.data.type !== "text") return;
        const canvasPos = c.getElement().getBoundingClientRect();
        const bubbleLeft = (obj.left || 0) + canvasPos.left;
        const bubbleTop = (obj.top || 0) + canvasPos.top - 40;
        setActiveEdit({
          elId: obj.data.elId,
          bindTo: obj.data.bindTo,
          leftPx: bubbleLeft,
          topPx: bubbleTop,
          value: obj.text || "",
        });
        setTimeout(() => {
          if (editInputRef.current) {
            editInputRef.current.focus();
            editInputRef.current.select();
          }
        }, 0);
      });
    };

    (tpl.elements || []).forEach((el) => {
      const elId =
        el._elId || `${el.type}-${Math.random().toString(36).slice(2)}`;

      if (el.bindTo && deletedKeys.has(el.bindTo)) return;
      if (
        autoHideEmpty &&
        el.bindTo &&
        (el.type === "text" || el.type === "textbox" || el.type === "image")
      ) {
        const val = data[el.bindTo];
        const isEmpty = val == null || String(val).trim().length === 0;
        if (isEmpty) return;
      }

      const xPct =
        posOverrides[elId]?.xPct != null
          ? `${posOverrides[elId].xPct}%`
          : el.x;
      const yPct =
        posOverrides[elId]?.yPct != null
          ? `${posOverrides[elId].yPct}%`
          : el.y;

      if (el.type === "rect") {
        const baseW = el.w === "100%" ? CARD.w : _toPx(el.w, "x");
        const baseH = el.h === "100%" ? CARD.h : _toPx(el.h, "y");
        const ov = shapeOverrides[elId];
        const finalW = ov?.wPx ?? baseW;
        const finalH = ov?.hPx ?? baseH;

        const obj = new fabric.Rect({
          left: _toPx(xPct, "x"),
          top: _toPx(yPct, "y"),
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
          selectable: dragEnabled && _isDraggableType("rect"),
          hasControls: dragEnabled,
          lockUniScaling: false,
        });
        obj.set("data", { elId, type: "rect" });
        c.add(obj);
      }

      if (el.type === "polygon") {
        const basePts = (el.points || []).map((p) => ({
          x: _toPx(p.x, "x"),
          y: _toPx(p.y, "y"),
        }));
        const pts = shapeOverrides[elId]?.points ?? basePts;
        const obj = new fabric.Polygon(pts, {
          left: 0,
          top: 0,
          fill: resolveColor(el.fill) || "transparent",
          stroke: resolveColor(el.stroke),
          strokeWidth: el.strokeWidth ?? 0,
          selectable: dragEnabled && _isDraggableType("polygon"),
          hasControls: dragEnabled,
        });
        obj.set("data", { elId, type: "polygon" });
        c.add(obj);
      }

      if (el.type === "text" || el.type === "textbox") {
        const boundText = el.bindTo
          ? data[el.bindTo] ?? el.text ?? ""
          : el.text ?? "";
        const override =
          el.bindTo && styleOverrides[el.bindTo]
            ? styleOverrides[el.bindTo]
            : undefined;
        const fontSize = override?.fontSize ?? el.fontSize ?? 14;
        const obj = new fabric.Text(String(boundText), {
          left: _toPx(xPct, "x"),
          top: _toPx(yPct, "y"),
          fontFamily: el.fontFamily || "Inter, system-ui, Arial",
          fontWeight: el.fontWeight || 400,
          fontSize,
          fill: resolveColor(el.fill) || "#111",
          selectable: dragEnabled && _isDraggableType("text"),
          hasControls: dragEnabled,
          lockUniScaling: false,
        });

        obj.set("data", { elId, type: "text", bindTo: el.bindTo });
        attachDblClickEdit(obj);
        c.add(obj);
      }

      if (el.type === "image") {
        const left = _toPx(xPct, "x");
        const top = _toPx(yPct, "y");
        const boxW = _toPx(el.w, "x");
        const boxH = _toPx(el.h, "y");
        const url = el.bindTo ? data[el.bindTo] : el.src;
        if (!url) {
          const ph = new fabric.Rect({
            left,
            top,
            width: boxW,
            height: boxH,
            fill: "#EEE",
            stroke: "#DDD",
            selectable: dragEnabled && _isDraggableType("image"),
            hasControls: dragEnabled,
            lockUniScaling: false,
          });
          ph.set("data", { elId, type: "image", bindTo: el.bindTo });
          c.add(ph);
          return;
        }

        const isBlob = String(url).startsWith("blob:");
        const opts = isBlob ? {} : { crossOrigin: "anonymous" };

        const holder = new fabric.Rect({
          left,
          top,
          width: boxW,
          height: boxH,
          fill: "transparent",
          stroke: null,
          selectable: false,
          evented: false,
        });
        c.add(holder);

        loadFabricImage(url, opts).then((img) => {
          const iw = img.width || 1;
          const ih = img.height || 1;
          const baseFitScale = Math.min(boxW / iw, boxH / ih);

          const ov = shapeOverrides[elId];
          if (ov?.scaleX && ov?.scaleY) {
            img.set({
              left,
              top,
              scaleX: ov.scaleX,
              scaleY: ov.scaleY,
              selectable: dragEnabled && _isDraggableType("image"),
              hasControls: dragEnabled,
              lockUniScaling: false,
            });
          } else {
            img.set({
              left,
              top,
              scaleX: baseFitScale,
              scaleY: baseFitScale,
              selectable: dragEnabled && _isDraggableType("image"),
              hasControls: dragEnabled,
              lockUniScaling: false,
            });
          }

          if (el.mask === "circle" || el.mask === "rounded") {
            const clip =
              el.mask === "circle"
                ? new fabric.Circle({
                    radius:
                      Math.min(boxW, boxH) / 2 / (img.scaleX || 1),
                    left: boxW / 2 / (img.scaleX || 1),
                    top: boxH / 2 / (img.scaleY || 1),
                    originX: "center",
                    originY: "center",
                  })
                : new fabric.Rect({
                    width: boxW / (img.scaleX || 1),
                    height: boxH / (img.scaleY || 1),
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

          img.set("data", { elId, type: "image", bindTo: el.bindTo });
          c.add(img);
          c.remove(holder);
          c.requestRenderAll();
        });
      }
    });

    const onModified = (e) => {
      const obj = e?.target;
      if (!obj || !obj.data?.elId) return;

      if (
        obj.data?.type === "text" &&
        (obj.scaleX !== 1 || obj.scaleY !== 1)
      ) {
        const factor = (obj.scaleX + obj.scaleY) / 2;
        const curr = obj.fontSize || 16;
        const newFont = Math.max(
          8,
          Math.min(300, Math.round(curr * factor))
        );
        obj.set({ fontSize: newFont, scaleX: 1, scaleY: 1 });
        const bindTo = obj.data?.bindTo;
        if (bindTo) {
          setStyleOverrides((prev) => ({
            ...prev,
            [bindTo]: {
              ...(prev[bindTo] || {}),
              fontSize: newFont,
            },
          }));
        }
      }

      if (obj.data?.type === "image") {
        const elId = obj.data.elId;
        setShapeOverrides((prev) => ({
          ...prev,
          [elId]: {
            ...(prev[elId] || {}),
            scaleX: obj.scaleX,
            scaleY: obj.scaleY,
          },
        }));
      }

      if (obj.data?.type === "rect") {
        const elId = obj.data.elId;
        const newW = obj.width * obj.scaleX;
        const newH = obj.height * obj.scaleY;
        setShapeOverrides((prev) => ({
          ...prev,
          [elId]: {
            ...(prev[elId] || {}),
            wPx: newW,
            hPx: newH,
          },
        }));
        obj.set({
          scaleX: 1,
          scaleY: 1,
          width: newW,
          height: newH,
        });
      }

      if (obj.data?.type === "polygon") {
        const elId = obj.data.elId;
        const sx = obj.scaleX || 1;
        const sy = obj.scaleY || 1;
        const bakedPts = obj.points.map((p) => ({
          x: p.x * sx,
          y: p.y * sy,
        }));
        setShapeOverrides((prev) => ({
          ...prev,
          [elId]: {
            ...(prev[elId] || {}),
            points: bakedPts,
          },
        }));
        obj.set({
          scaleX: 1,
          scaleY: 1,
          points: bakedPts,
        });
      }

      const elId = obj.data.elId;
      const left = Math.max(0, Math.min(obj.left, CARD.w));
      const top = Math.max(0, Math.min(obj.top, CARD.h));
      setPosOverrides((prev) => ({
        ...prev,
        [elId]: {
          xPct: _toPct(left, "x"),
          yPct: _toPct(top, "y"),
        },
      }));

      c.requestRenderAll();
    };

    const onMoving = (e) => {
      const o = e?.target;
      if (!o) return;
      o.left = Math.max(0, Math.min(o.left, CARD.w));
      o.top = Math.max(0, Math.min(o.top, CARD.h));
    };

    c.on("object:modified", onModified);
    c.on("object:moving", onMoving);

    c.renderAll();

    return () => {
      c.off("object:modified", onModified);
      c.off("object:moving", onMoving);
    };
  }, [
    enumeratedTemplate,
    palette,
    // ❌ data removed here so toolbar changes don't get reset by re-render
    posOverrides,
    autoHideEmpty,
    dragEnabled,
    deletedKeys,
    styleOverrides,
    shapeOverrides,
    CARD.w,
    CARD.h,
  ]);

  const addNewTextField = () => {
    const bindTo = `custom_${Date.now()}`;
    const existing = runtimeEls.filter(
      (e) =>
        e.type === "text" &&
        String(e.bindTo || "").startsWith("custom_")
    ).length;
    const yPct = 74 + existing * 5;
    const newEl = {
      type: "text",
      bindTo,
      x: "14%",
      y: `${yPct}%`,
      fontSize: 12,
      fontWeight: 400,
      fill: "#231F20",
      editable: true,
      _elId: `rt-${Date.now()}`,
    };
    setRuntimeEls((els) => [...els, newEl]);
    setData((v) => ({ ...v, [bindTo]: "New text" }));
  };

  const deleteFieldByKey = (key) => {
    setDeletedKeys((prev) => {
      const next = new Set(prev);
      next.add(key);
      return next;
    });

    setData((v) => {
      const next = { ...v };
      if (
        key === "logoUrl" &&
        next.logoUrl &&
        String(next.logoUrl).startsWith("blob:")
      ) {
        try {
          URL.revokeObjectURL(next.logoUrl);
        } catch {
          // ignore
        }
      }
      next[key] = "";
      return next;
    });

    setRuntimeEls((els) => els.filter((e) => e.bindTo !== key));
  };

  const commitActiveEdit = () => {
    if (activeEdit && activeEdit.bindTo) {
      setData((prev) => ({
        ...prev,
        [activeEdit.bindTo]: activeEdit.value,
      }));
    }
    setActiveEdit(null);
  };

  async function renderSideAndCapture(sideKey) {
    const c = fabricRef.current;
    if (!c || !templateBase) return "";

    const bakedEls = buildSideSnapshot({
      tplBase: templateBase,
      side: sideKey,
      runtimeEls,
      deletedKeys: Array.from(deletedKeys),
    });

    const paletteObj =
      templateBase?.palettes?.[paletteIdx] ||
      templateBase?.palettes?.[0] ||
      {};

    const resolveColor = (val) => {
      if (!val) return val;
      if (val === "{bg}") return paletteObj?.bg || "#fff";
      if (val === "{primary}") return paletteObj?.primary || "#111";
      if (val === "{accent}") return paletteObj?.accent || "#06f";
      if (val === "{accent2}") return paletteObj?.accent2 || paletteObj?.accent || "#06f";
      if (val === "{cream}") return paletteObj?.cream || "#fbf9ce";
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

    const loadImg = (url, options = {}) => {
      const maybe = fabric.Image.fromURL(url, options);
      if (maybe && typeof maybe.then === "function") return maybe;
      return new Promise((resolve) =>
        fabric.Image.fromURL(url, (img) => resolve(img), options)
      );
    };

    c.clear();

    for (const el of bakedEls) {
      if (
        el.bindTo &&
        (el.type === "text" ||
          el.type === "textbox" ||
          el.type === "image")
      ) {
        if (deletedKeys.has(el.bindTo)) continue;
        const val = data[el.bindTo];
        const isEmpty = val == null || String(val).trim().length === 0;
        if (isEmpty) continue;
      }

      const elId = el._elId || el.id || `snap-${sideKey}-${Math.random()}`;
      const ovPos = posOverrides[elId] || {};
      const ovShape = shapeOverrides[elId] || {};
      const ovStyle = el.bindTo ? styleOverrides[el.bindTo] : undefined;
      const xPct = ovPos.xPct != null ? `${ovPos.xPct}%` : el.x;
      const yPct = ovPos.yPct != null ? `${ovPos.yPct}%` : el.y;

      if (el.type === "rect") {
        const baseW = el.w === "100%" ? CARD.w : toPx(el.w, "x");
        const baseH = el.h === "100%" ? CARD.h : toPx(el.h, "y");
        const finalW = ovShape.wPx ?? baseW;
        const finalH = ovShape.hPx ?? baseH;
        const r = new fabric.Rect({
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
        c.add(r);
        continue;
      }

      if (el.type === "polygon") {
        const basePts = (el.points || []).map((p) => ({
          x: toPx(p.x, "x"),
          y: toPx(p.y, "y"),
        }));
        const pts = ovShape.points ?? basePts;
        const poly = new fabric.Polygon(pts, {
          left: 0,
          top: 0,
          fill: resolveColor(el.fill) || "transparent",
          stroke: resolveColor(el.stroke),
          strokeWidth: el.strokeWidth ?? 0,
          selectable: false,
          evented: false,
        });
        c.add(poly);
        continue;
      }

      if (el.type === "text" || el.type === "textbox") {
        const boundText = el.bindTo
          ? data[el.bindTo] ?? el.text ?? ""
          : el.text ?? "";
        const fontSize = (ovStyle && ovStyle.fontSize) || el.fontSize || 14;
        const t = new fabric.Text(String(boundText), {
          left: toPx(xPct, "x"),
          top: toPx(yPct, "y"),
          fontFamily: el.fontFamily || "Inter, system-ui, Arial",
          fontWeight: el.fontWeight || 400,
          fontSize,
          fill: resolveColor(el.fill) || "#111",
          selectable: false,
          evented: false,
        });
        c.add(t);
        continue;
      }

      if (el.type === "image") {
        const left = toPx(xPct, "x");
        const top = toPx(yPct, "y");
        const boxW = toPx(el.w, "x");
        const boxH = toPx(el.h, "y");
        const url = el.bindTo ? data[el.bindTo] : el.src;
        if (!url) continue;
        // eslint-disable-next-line no-await-in-loop
        const img = await loadImg(
          url,
          String(url).startsWith("blob:")
            ? {}
            : { crossOrigin: "anonymous" }
        );
        const iw = img.width || 1;
        const ih = img.height || 1;
        const baseFit = Math.min(boxW / iw, boxH / ih);
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
            scaleX: baseFit,
            scaleY: baseFit,
            selectable: false,
            evented: false,
          });
        }
        if (el.mask === "circle" || el.mask === "rounded") {
          const clip =
            el.mask === "circle"
              ? new fabric.Circle({
                  radius:
                    Math.min(boxW, boxH) / 2 / (img.scaleX || 1),
                  left: boxW / 2 / (img.scaleX || 1),
                  top: boxH / 2 / (img.scaleY || 1),
                  originX: "center",
                  originY: "center",
                })
              : new fabric.Rect({
                  width: boxW / (img.scaleX || 1),
                  height: boxH / (img.scaleY || 1),
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
        c.add(img);
      }
    }

    c.renderAll();
    return c.toDataURL({ format: "png", quality: 1 });
  }

  async function saveSessionToServer() {
    const bakedFrontEls = buildSideSnapshot({
      tplBase: templateBase,
      side: "front",
      runtimeEls,
      deletedKeys: Array.from(deletedKeys),
    });
    const bakedBackEls = buildSideSnapshot({
      tplBase: templateBase,
      side: "back",
      runtimeEls,
      deletedKeys: Array.from(deletedKeys),
    });

    const previewFrontPng = await renderSideAndCapture("front");
    const previewBackPng = await renderSideAndCapture("back");

    const payload = {
      templateId: templateBase?.id || templateId,
      paletteId:
        templateBase?.palettes?.[paletteIdx]?.id || "",
      data,
      runtimeEls,
      deletedKeys: Array.from(deletedKeys),
      posOverrides,
      styleOverrides,
      shapeOverrides,
      bakedFrontEls,
      bakedBackEls,
      previewFrontPng,
      previewBackPng,
    };

    const url = sessionId
      ? `${API_BASE}/api/design-session/${sessionId}`
      : `${API_BASE}/api/design-session`;
    const method = sessionId ? "PUT" : "POST";
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error("Failed to save design session");
    const json = await res.json();
    if (!sessionId) setSessionId(json.id);
    return json.id;
  }

  const handleNext = async () => {
    try {
      setSaving(true);
      setSaveError("");
      const newId = await saveSessionToServer();
      if (navigate) navigate(`/review/${newId}`);
      return newId;
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err);
      setSaveError("Could not save your design. Please try again.");
      throw err;
    } finally {
      setSaving(false);
    }
  };

  return {
    templateBase,
    paletteIdx,
    setPaletteIdx,
    setShowPreview,
    saving,
    saveError,
    handleNext,

    FIELD_DEFS,
    data,
    setData,
    runtimeEls,
    addNewTextField,
    deleteFieldByKey,
    deletedKeys,
    styleOverrides,
    setStyleOverrides,
    autoHideEmpty,
    setAutoHideEmpty,
    dragEnabled,
    setDragEnabled,

    CARD,
    side,
    setSide,
    canvasRef,
    showPreview,

    fabricRef,
    activeEdit,
    setActiveEdit,
    editInputRef,
    commitActiveEdit,
  };
}
