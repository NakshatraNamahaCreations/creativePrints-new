// src/pages/Studio.jsx
import React, { useEffect,  useRef, useState } from "react";
import * as FabricNS from "fabric";
import QRCode from "qrcode";
const fabric = (FabricNS.fabric ?? FabricNS.default ?? FabricNS);

// 89×51 mm @ 300dpi + 3mm bleed → quick fixed canvas (you can replace with buildCardPx)
const DPI = 300;
const MM2PX = (mm) => Math.round((mm / 25.4) * DPI);
const CARD = {
  widthMM: 89, heightMM: 51, bleedMM: 3,
  get w() { return MM2PX(this.widthMM + this.bleedMM * 2); },
  get h() { return MM2PX(this.heightMM + this.bleedMM * 2); },
  get bleed() { return MM2PX(this.bleedMM); }
};

export default function Studio() {
  // sides
  const [side, setSide] = useState("front");
  const [frontJSON, setFrontJSON] = useState(null);
  const [backJSON, setBackJSON] = useState(null);
  const [frontThumb, setFrontThumb] = useState("");
  const [backThumb, setBackThumb] = useState("");

  // canvas + inspector
  const canvasRef = useRef(null);
  const fabricRef = useRef(null);
  const [zoom, setZoom] = useState(1);
  const [inspector, setInspector] = useState(null);

  // history
  const undoRef = useRef([]);  // stack of JSON
  const redoRef = useRef([]);

  // init canvas
  useEffect(() => {
    const c = new fabric.Canvas(canvasRef.current, {
      backgroundColor: "#ffffff",
      preserveObjectStacking: true,
      selection: true,
    });
    fabricRef.current = c;

    const pr = window.devicePixelRatio || 1;
    c.setWidth(CARD.w);
    c.setHeight(CARD.h);
    c.setZoom(pr);

    // basic snapping to 10px grid
    c.on("object:moving", (e) => {
      const o = e.target; if (!o) return;
      o.left = Math.round((o.left || 0) / 10) * 10;
      o.top  = Math.round((o.top  || 0) / 10) * 10;
    });

    // inspector sync
    const sync = () => {
      const obj = c.getActiveObject();
      if (!obj) return setInspector(null);
      setInspector({
        type: obj.type,
        text: obj.text,
        fill: obj.fill || "#333333",
        fontSize: obj.fontSize || 18,
        fontFamily: obj.fontFamily || "Inter, Arial, sans-serif",
        opacity: obj.opacity ?? 1,
        angle: obj.angle || 0,
        w: Math.round(obj.width * obj.scaleX || 0),
        h: Math.round(obj.height * obj.scaleY || 0),
      });
    };
    c.on("selection:created", sync);
    c.on("selection:updated", sync);
    c.on("selection:cleared", () => setInspector(null));
    c.on("object:modified", snapshot);
    c.on("object:added", snapshot);
    c.on("object:removed", snapshot);

    // start with a clean background layer rect (non-deletable)
    const bg = new fabric.Rect({ left: 0, top: 0, width: CARD.w, height: CARD.h, fill: "#ffffff", selectable: false, evented: false });
    c.add(bg);
    snapshot(); // first state
    renderThumb(); // first thumb

    return () => c.dispose();
  }, []);

  // helpers
  const canvas = () => fabricRef.current;

  function snapshot() {
    const c = canvas(); if (!c) return;
    const j = c.toJSON();
    undoRef.current.push(j);
    redoRef.current.length = 0;
    saveSideJSON(j);
    renderThumb();
  }
  function saveSideJSON(json) {
    if (side === "front") setFrontJSON(json); else setBackJSON(json);
  }
  function loadSideJSON(json) {
    const c = canvas(); if (!c || !json) return;
    c.loadFromJSON(json, () => c.renderAll());
  }
  function renderThumb() {
    const c = canvas(); if (!c) return;
    const png = c.toDataURL({ format: "png", multiplier: 0.2 });
    if (side === "front") setFrontThumb(png); else setBackThumb(png);
  }

  // side switch
  function switchSide(next) {
    const curJSON = canvas().toJSON();
    saveSideJSON(curJSON);
    if (next === "front") {
      setSide("front");
      loadSideJSON(frontJSON ?? curJSON);
    } else {
      setSide("back");
      if (!backJSON) {
        // create new back with white bg rect
        const c = canvas();
        c.clear();
        c.add(new fabric.Rect({ left: 0, top: 0, width: CARD.w, height: CARD.h, fill: "#ffffff", selectable: false, evented: false }));
        c.renderAll();
        snapshot();
      } else {
        loadSideJSON(backJSON);
      }
    }
  }

  // tools
  function addText() {
    const t = new fabric.IText("Your text", {
      left: CARD.w * 0.1, top: CARD.h * 0.2,
      fontFamily: "Inter, Arial, sans-serif",
      fontSize: 24, fill: "#333333",
    });
    canvas().add(t).setActiveObject(t);
    canvas().requestRenderAll();
  }

  function addRect() {
    const r = new fabric.Rect({
      left: CARD.w * 0.1, top: CARD.h * 0.75,
      width: 300, height: 40,
      rx: 8, ry: 8,
      fill: "#4376AE"
    });
    canvas().add(r).setActiveObject(r);
    canvas().requestRenderAll();
  }

  async function addQR(url = "https://example.com") {
    const dataUrl = await QRCode.toDataURL(url, { margin: 0, width: 256 });
    fabric.Image.fromURL(dataUrl, (img) => {
      img.set({ left: CARD.w * 0.75, top: CARD.h * 0.6 });
      img.scaleToWidth(100);
      canvas().add(img).setActiveObject(img);
      canvas().requestRenderAll();
    });
  }

  function onUpload(file) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      fabric.Image.fromURL(reader.result, (img) => {
        img.set({ left: CARD.w * 0.1, top: CARD.h * 0.1, crossOrigin: "anonymous" });
        img.scaleToWidth(220);
        canvas().add(img).setActiveObject(img);
        canvas().requestRenderAll();
      });
    };
    reader.readAsDataURL(file);
  }

  function setBackground(color) {
    const c = canvas();
    c.setBackgroundColor(color, c.requestRenderAll.bind(c));
  }

  function applyInspector(patch) {
    const obj = canvas().getActiveObject(); if (!obj) return;
    obj.set(patch);
    canvas().requestRenderAll();
    setInspector((v) => ({ ...v, ...patch }));
  }

  function bringForward() {
    const obj = canvas().getActiveObject(); if (!obj) return;
    obj.bringForward(); canvas().requestRenderAll();
  }
  function sendBackward() {
    const obj = canvas().getActiveObject(); if (!obj) return;
    obj.sendBackwards(); canvas().requestRenderAll();
  }
  function removeActive() {
    const obj = canvas().getActiveObject(); if (!obj) return;
    canvas().remove(obj); canvas().discardActiveObject(); canvas().requestRenderAll();
  }

  function doUndo() {
    const c = canvas(); if (!c) return;
    if (undoRef.current.length <= 1) return; // keep at least initial
    const cur = undoRef.current.pop();
    redoRef.current.push(cur);
    const prev = undoRef.current[undoRef.current.length - 1];
    loadSideJSON(prev);
    saveSideJSON(prev);
    renderThumb();
  }
  function doRedo() {
    const c = canvas(); if (!c) return;
    if (!redoRef.current.length) return;
    const next = redoRef.current.pop();
    undoRef.current.push(next);
    loadSideJSON(next);
    saveSideJSON(next);
    renderThumb();
  }

  function zoomIn() { const z = Math.min(2, zoom + 0.1); setZoom(z); canvas().setZoom(z * (window.devicePixelRatio || 1)); canvas().renderAll(); }
  function zoomOut() { const z = Math.max(0.3, zoom - 0.1); setZoom(z); canvas().setZoom(z * (window.devicePixelRatio || 1)); canvas().renderAll(); }
  function exportPNG() {
    const data = canvas().toDataURL({ format: "png", multiplier: 1 });
    const a = document.createElement("a"); a.href = data; a.download = `card-${side}.png`; a.click();
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] h-[calc(100vh-80px)]">
      {/* LEFT SIDEBAR */}
      <aside className="border-r p-4 space-y-6 overflow-auto">
        <h2 className="text-lg font-semibold">Editor</h2>

        {/* Tabs (simple buttons) */}
        <div className="space-y-4">
          {/* TEXT */}
          <section>
            <div className="font-medium mb-2">Text</div>
            <button className="px-3 py-2 rounded bg-black text-white" onClick={addText}>Add Text</button>
            {inspector?.type?.includes("text") && (
              <div className="mt-3 space-y-2">
                <input className="w-full border rounded px-2 py-1"
                       value={inspector.text ?? ""}
                       onChange={(e)=>applyInspector({ text: e.target.value })} />
                <div className="flex gap-2">
                  <input type="number" className="border rounded px-2 py-1 w-24"
                         value={inspector.fontSize}
                         onChange={(e)=>applyInspector({ fontSize: parseInt(e.target.value||"0",10) })}/>
                  <input type="color" className="w-10 h-10"
                         value={rgbToHex(inspector.fill)}
                         onChange={(e)=>applyInspector({ fill: e.target.value })}/>
                </div>
              </div>
            )}
          </section>

          {/* UPLOADS */}
          <section>
            <div className="font-medium mb-2">Uploads</div>
            <input type="file" accept="image/*" onChange={(e)=>onUpload(e.target.files?.[0])}/>
          </section>

          {/* GRAPHICS */}
          <section>
            <div className="font-medium mb-2">Graphics</div>
            <button className="px-3 py-2 rounded border" onClick={addRect}>Add Accent Bar</button>
          </section>

          {/* QR */}
          <section>
            <div className="font-medium mb-2">QR code</div>
            <button className="px-3 py-2 rounded border" onClick={()=>addQR(prompt("QR text/URL","https://example.com") || "https://example.com")}>Add QR</button>
          </section>

          {/* BACKGROUND */}
          <section>
            <div className="font-medium mb-2">Background</div>
            <div className="flex gap-2">
              {["#ffffff","#f8fafc","#f1f5f9","#0f172a","#4376AE","#58A28A"].map(c=>(
                <button key={c} className="h-8 w-8 rounded-full border" style={{background:c}} onClick={()=>setBackground(c)} />
              ))}
            </div>
          </section>

          {/* LAYERS */}
          <section>
            <div className="font-medium mb-2">Layers</div>
            <div className="flex gap-2">
              <button className="px-2 py-1 border rounded" onClick={bringForward}>Bring ↑</button>
              <button className="px-2 py-1 border rounded" onClick={sendBackward}>Send ↓</button>
              <button className="px-2 py-1 border rounded" onClick={removeActive}>Delete</button>
            </div>
          </section>
        </div>
      </aside>

      {/* MAIN AREA */}
      <main className="flex flex-col">
        {/* Toolbar */}
        <div className="flex items-center gap-2 p-3 border-b">
          <button className="px-2 py-1 border rounded" onClick={doUndo}>Undo</button>
          <button className="px-2 py-1 border rounded" onClick={doRedo}>Redo</button>
          <div className="mx-3 h-5 w-px bg-gray-200" />
          <button className="px-2 py-1 border rounded" onClick={zoomOut}>-</button>
          <span className="text-sm w-16 text-center">{Math.round(zoom*100)}%</span>
          <button className="px-2 py-1 border rounded" onClick={zoomIn}>+</button>
          <div className="mx-3 h-5 w-px bg-gray-200" />
          <button className="px-2 py-1 border rounded" onClick={exportPNG}>Export PNG</button>
        </div>

        {/* Canvas */}
        <div className="flex-1 flex items-center justify-center bg-slate-50">
          <div className="rounded-xl bg-white p-4 shadow">
            <canvas ref={canvasRef} width={CARD.w} height={CARD.h}/>
          </div>
        </div>

        {/* Side selector with thumbnails */}
        <div className="border-t p-3 flex items-center gap-3">
          <button
            onClick={()=>switchSide("front")}
            className={`border rounded ${side==='front'?'ring-2 ring-black':''}`}>
            <img alt="Front" src={frontThumb} className="h-16 w-auto"/>
            <div className="text-center text-xs font-semibold">Front</div>
          </button>
          <button
            onClick={()=>switchSide("back")}
            className={`border rounded ${side==='back'?'ring-2 ring-black':''}`}>
            <img alt="Back" src={backThumb} className="h-16 w-auto"/>
            <div className="text-center text-xs font-semibold">Back</div>
          </button>
        </div>
      </main>
    </div>
  );
}

// tiny helper: normalize rgb() to hex for <input type="color">
function rgbToHex(c) {
  if (!c) return "#333333";
  if (c.startsWith("#")) return c;
  const m = c.match(/\d+/g); if (!m) return "#333333";
  const [r,g,b] = m.map(Number);
  return "#" + [r,g,b].map(v=>v.toString(16).padStart(2,"0")).join("");
}
