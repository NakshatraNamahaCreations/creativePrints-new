// src/components/QrPanel.jsx
import React from "react";
import QRCodeLib from "qrcode"; // optional; install with `npm i qrcode` for best client-side PNG output
import "./QrPanel.css";

export default function QrPanel({ initialData = {}, onApply }) {
  const [url, setUrl] = React.useState(initialData.url || "");
  const [preview, setPreview] = React.useState(null);
  const [loadingPreview, setLoadingPreview] = React.useState(false);
  const [error, setError] = React.useState("");
  const [size, setSize] = React.useState(initialData.size || 250);
  const [generating, setGenerating] = React.useState(false);

  // PARSE OG / meta from HTML string
  const parseMetaFromHtml = (html, baseUrl) => {
    try {
      const doc = new DOMParser().parseFromString(html, "text/html");
      const ogTitle = doc.querySelector('meta[property="og:title"]')?.getAttribute("content");
      const ogDesc = doc.querySelector('meta[property="og:description"]')?.getAttribute("content");
      const ogImage = doc.querySelector('meta[property="og:image"]')?.getAttribute("content");
      const titleTag = doc.querySelector("title")?.textContent;
      const metaDesc = doc.querySelector('meta[name="description"]')?.getAttribute("content");

      let image = ogImage || null;
      if (image && baseUrl && !/^https?:\/\//i.test(image)) {
        try { image = new URL(image, baseUrl).href; } catch (e) { void e; }
      }

      return {
        title: ogTitle || titleTag || "",
        description: ogDesc || metaDesc || "",
        image,
      };
    } catch  {
      return null;
    }
  };

  // fetch preview via AllOrigins proxy (CORS friendly). Replace with your own proxy if required.
const fetchPreview = React.useCallback(async (targetUrl) => {
  setError("");
  setPreview(null);
  if (!targetUrl) return;
  setLoadingPreview(true);

  // ----- SAFE env lookup (Vite or CRA) -----
 const API_BASE = (
  // For Vite
  (typeof import.meta !== "undefined" &&
    import.meta.env &&
    import.meta.env.VITE_PREVIEW_API) ||

  // For Create-React-App
  (typeof process !== "undefined" &&
    process.env &&
    process.env.REACT_APP_PREVIEW_API) ||

  ""
).replace(/\/$/, "");

  const serverEndpoint = API_BASE ? `${API_BASE}/api/preview?url=${encodeURIComponent(targetUrl)}` : null;

  try {
    if (serverEndpoint) {
      const r = await fetch(serverEndpoint, { cache: "no-store" });
      if (r.ok) {
        const json = await r.json();
        if (json && json.ok) {
          setPreview({
            title: json.title || "",
            description: json.description || "",
            image: json.image || null,
          });
          setLoadingPreview(false);
          return;
        }
      } else {
        console.warn("Preview server returned non-OK", r.status);
      }
    }
  } catch (err) {
    console.warn("Server preview failed, falling back to public proxy:", err);
  }

  // fallback to public proxy
  try {
    const proxy = "https://api.allorigins.win/raw?url=";
    const r2 = await fetch(proxy + encodeURIComponent(targetUrl));
    if (!r2.ok) throw new Error("allorigins failed");
    const html = await r2.text();
    const parsed = parseMetaFromHtml(html, targetUrl);

    if (parsed && !parsed.image) {
      try {
        const doc = new DOMParser().parseFromString(html, "text/html");
        const firstImg = doc.querySelector("img");
        if (firstImg) {
          let src = firstImg.getAttribute("src");
          if (src && !/^https?:\/\//i.test(src)) src = new URL(src, targetUrl).href;
          parsed.image = src;
        }
      } catch (e) { void e; }
    }

    setPreview(parsed || null);
  } catch (err) {
    console.warn("preview fallback failed:", err);
    setError("Preview not available. QR will still be created.");
  } finally {
    setLoadingPreview(false);
  }
}, []);



  // generate dataURL for QR; prefer qrcode lib if present
  const generateQrDataUrl = React.useCallback(async (text, pxSize) => {
    try {
      if (QRCodeLib && typeof QRCodeLib.toDataURL === "function") {
        return await QRCodeLib.toDataURL(text, { width: pxSize, margin: 1 });
      }
    } catch (e) {
      console.warn("qrcode lib failed, fallback to google", e);
    }
    // fallback google chart url (not dataURL but fabric accepts it)
    return `https://chart.googleapis.com/chart?cht=qr&chs=${pxSize}x${pxSize}&chl=${encodeURIComponent(text)}&chld=L|1`;
  }, []);

  // when user clicks preview or types (auto preview after debounce)
  React.useEffect(() => {
    if (!url) { setPreview(null); setError(""); return; }
    const t = setTimeout(() => {
      fetchPreview(url).catch(() => {});
    }, 700);
    return () => clearTimeout(t);
  }, [url, fetchPreview]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!url) return setError("Enter a URL");
    setError("");
    setGenerating(true);
    try {
      // generate QR dataUrl or URL
      const qr = await generateQrDataUrl(url, size);
      // call onApply with the expected payload
      if (typeof onApply === "function") {
        onApply({
          dataUrl: qr,
          sizePx: size,
          left: undefined,
          top: undefined,
          scale: 1,
          selectable: true,
          meta: { source: "qr-panel", url, preview },
        });
      }
    } catch (err) {
      console.error("QR generation failed", err);
      setError("Failed to generate QR");
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="swan-display-flex swan-flex-box-flex-direction-column _addQRCodeInput_1vgzb_5" style={{padding:12}}>
      <div className="swan-display-flex swan-flex-box-flex-direction-row swan-flex-box-gap-3">
        <h2 className="swan-heading swan-text-x3large swan-font-weight-bold swan-font-skin-title-section swan-compact-mode swan-mt-1 swan-mb-0 _panelTitle_eiwej_1">QR Code</h2>
      </div>

      <p className="swan-text-standard swan-compact-mode swan-text-color-subtle swan-mb-4 swan-mt-5">Enter a valid URL and click the ‘add’ button.</p>

      <form className="swan-form" onSubmit={handleSubmit}>
        <div>
          <div className="swan-input-group swan-pb-6 swan-mb-6">
            <div className="swan-vanilla-ignore swan-input-with-floating-label swan-display-block">
              <input
                inputMode="url"
                placeholder="URL"
                aria-invalid="false"
                className="swan-input _inputPositionStyle_1wiif_26"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                id="qr-url-input"
              />
              <label htmlFor="qr-url-input">https://www.example.com/</label>
            </div>
          </div>
        </div>

        <div className="swan-mb-7 _previewContainerStyle_1wiif_5">
          <div className="swan-standard-tile swan-standard-tile-horizontal swan-p-0">
            <div className="swan-standard-tile-image" style={{paddingRight:12}}>
              <span className="swan-aspect-ratio-container swan-responsive-image-wrapper" style={{paddingBottom:"56.25%"}}>
                <span className="swan-aspect-ratio-content">
                  {preview && preview.image ? (
                    <img src={preview.image} alt="Website logo preview" className="swan-responsive-image" style={{width:"100%",height:"100%",objectFit:"cover",borderRadius:8}} />
                  ) : (
                    <div style={{width:"100%",height:"100%",background:"#f3f3f3",borderRadius:8}} />
                  )}
                </span>
              </span>
            </div>

            <div className="swan-standard-tile-contents" style={{paddingTop:8}}>
              <div className="swan-standard-tile-name _textStyle_1wiif_18">
                <div className="swan-text-xsmall swan-font-weight-bold" style={{fontSize:13}}>
                  {preview?.title || "No title available"}
                </div>
              </div>

              <div className="swan-standard-tile-description _textStyle_1wiif_18">
                <div className="swan-text-xsmall" style={{fontSize:12,color:"#555"}}>
                  {preview?.description || "No description available"}
                </div>
              </div>
            </div>
          </div>
          {loadingPreview && <div className="text-xs text-gray-500">Loading preview…</div>}
          {!loadingPreview && !preview && <div className="text-xs text-gray-500">No preview available — QR will still be generated.</div>}
        </div>

        <div style={{display:"flex",gap:8,alignItems:"center",marginBottom:16}}>
          <div style={{flex:1}}>
            <input type="number" value={size} onChange={(e)=> setSize(Number(e.target.value || 250))} className="swan-input" style={{width:120,padding:8}} />
            <div style={{fontSize:11,color:"#666"}}>Size (px)</div>
          </div>
        </div>

        <button type="submit" data-inp-action="addNewQRCodeBtn" className="swan-button swan-button-skin-primary swan-button-full-width swan-compact-mode" style={{padding:"12px 16px",background:"#6ed0f0",borderRadius:8,border:"none"}}>
          {generating ? "Adding…" : "Add QR Code"}
        </button>
        {error && <div style={{marginTop:8,color:"#b00020",fontSize:13}}>{error}</div>}
      </form>
    </div>
  );
}
