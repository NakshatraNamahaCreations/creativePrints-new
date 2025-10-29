import React, { useState, useEffect, useMemo } from "react";
import { useParams, Link, useLocation } from "react-router-dom";
import { FaWhatsapp, FaHome, FaBox, FaBookReader } from "react-icons/fa";
import { Image as ImageIcon, UploadCloud } from "lucide-react";
import InnerImageZoom from "react-inner-image-zoom";
// import "react-inner-image-zoom/styles.css";
import OfferdiscountTextCarousal from "../components/OfferdiscountTextCarousal";
import Breadcrumb from "../components/BreadCrumb";
import ProductCarousal from "../ui/ProductCarousal";
import ReviewsSection from "../ui/ReviewsPage";
import FAQPage from "../ui/FAQPage";

function Description() {
  const { slug } = useParams();
  const location = useLocation();

  // sanitize API base (no trailing slash)
  const API_BASE = useMemo(() => {
    const raw = import.meta.env.VITE_API_URL || "";
    return raw.endsWith("/") ? raw.slice(0, -1) : raw;
  }, []);

  // ---- state hooks (always at top) ----
  const [product, setProduct] = useState(null);
  const [error, setError] = useState("");
  const [selectedSpeed, setSelectedSpeed] = useState("");
  const [showAllQty, setShowAllQty] = useState(false);
  const [activeIdx, setActiveIdx] = useState(0);

  // Build image list from product (safe when product is null)
  const images = useMemo(() => {
    const out = [];
    if (product?.image) out.push({ src: product.image, alt: product.title || "" });
    if (Array.isArray(product?.gallery)) {
      for (const g of product.gallery) {
        if (g?.src) out.push({ src: g.src, alt: g.alt || product?.title || "" });
      }
    }
    return out.length ? out : [{ src: "/placeholder.jpg", alt: "No image" }];
  }, [product]);

  const safeIdx = Math.min(activeIdx, Math.max(0, images.length - 1));
  const activeSrc = images[safeIdx]?.src || "/placeholder.jpg";

  const handleImgError = (e) => {
    e.currentTarget.onerror = null;
    e.currentTarget.src = "/placeholder.jpg";
  };

  // fetch hook (also at top level)
  useEffect(() => {
    let alive = true;
    setError("");
    setProduct(null);

    (async () => {
      try {
        const res = await fetch(`${API_BASE}/api/products/${slug}`);
        if (!res.ok) {
          const body = await res.json().catch(() => ({}));
          throw new Error(body?.error || `HTTP ${res.status}`);
        }
        const data = await res.json();
        if (alive) setProduct(data);
      } catch (e) {
        if (alive) setError(e.message || "Failed to load product");
      }
    })();

    return () => { alive = false; };
  }, [API_BASE, slug]);

  // ---- early returns come AFTER all hooks ----
  if (error) {
    return (
      <div className="p-10 text-center">
        <p className="text-red-600 font-semibold mb-2">Couldn’t load product.</p>
        <p className="text-gray-600">{error}</p>
        <Link to="/products-category" className="mt-4 inline-block underline">
          Back to products
        </Link>
      </div>
    );
  }

  if (!product) {
    return <div className="p-10 text-center">Loading product...</div>;
  }

  // ---- rest of UI (can safely use product now) ----
  const quantities = product.quantities || [];
  const visibleQty = showAllQty ? quantities : quantities.slice(0, 3);

  const breadcrumbItems = [
    { name: "Home", href: "/", icon: <FaHome /> },
    { name: "Products Category", href: "/products-category", icon: <FaBox /> },
    { name: product.title, href: location.pathname, icon: <FaBookReader /> },
  ];

  const productUrl = typeof window !== "undefined" ? window.location.href : "";
  const waHref = `https://wa.me/?text=${encodeURIComponent(
    `Check this product: ${product.title}\n${productUrl}`
  )}`;

  const rating = Number(product.rating || 0);
  const stars = "★★★★★".split("").map((s, i) => (
    <span key={i} className={i < Math.round(rating) ? "text-yellow-500" : "text-gray-300"}>★</span>
  ));

  return (
    <div>
      <OfferdiscountTextCarousal />
      <Breadcrumb items={breadcrumbItems} />

      {/* 2-column layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-5">
        {/* Left: image gallery */}
        <div className="flex flex-col items-center md:sticky md:top-6">
          <div className="w-[500px] max-w-full h-[400px] overflow-hidden">
            <InnerImageZoom
              src={activeSrc}
              zoomSrc={activeSrc}
              zoomType="hover"
              zoomScale={1.5}
              alt={product.title}
              className="object-contain w-full h-full"
              imgAttributes={{
                referrerPolicy: "no-referrer",
                onError: handleImgError,
              }}
            />
          </div>

          {/* Thumbnails */}
          {images.length > 1 && (
            <div className="flex flex-wrap gap-3 mt-4">
              {images.map((img, i) => (
                <button
                  key={`${img.src}-${i}`}
                  type="button"
                  onClick={() => setActiveIdx(i)}
                  className={`rounded-md border ${i === safeIdx ? "border-blue-600" : "border-gray-300"} p-0.5`}
                  aria-label={`Thumbnail ${i + 1}`}
                >
                  <img
                    src={img.src}
                    alt={img.alt || `Thumb ${i + 1}`}
                    className="w-20 h-20 object-cover rounded-md"
                    referrerPolicy="no-referrer"
                    onError={handleImgError}
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: product info */}
        <div className="flex flex-col space-y-4">
          <h2 className="text-2xl font-semibold">{product.title}</h2>

          <div className="flex items-center">
            <span className="text-lg">{stars}</span>
            <span className="text-gray-600 ml-2 text-base">({rating.toFixed(1)})</span>
          </div>

          {product.subtitle && <p className="text-gray-600">{product.subtitle}</p>}

          {/* Highlights */}
          {product.highlights?.length > 0 && (
            <ul className="list-disc list-inside text-gray-600 space-y-2">
              {product.highlights.map((h, i) => (
                <li key={i} dangerouslySetInnerHTML={{ __html: h }} />
              ))}
            </ul>
          )}

          <a
            href={waHref}
            target="_blank"
            rel="noreferrer"
            className="mt-2 bg-green-500 hover:bg-green-600 text-white py-2 px-6 rounded-lg flex items-center justify-center gap-2"
          >
            <FaWhatsapp size={20} /> Share on WhatsApp
          </a>

          {product.badges?.length > 0 &&
            product.badges.map((b, i) => (
              <p key={i} className="text-gray-600">• {b}</p>
            ))}

          {/* Pricing */}
          <div className="pt-6 space-y-4">
            {product.basePriceNote && (
              <p className="text-lg font-semibold">{product.basePriceNote}</p>
            )}
            {product.shippingBanner?.labelHtml && (
              <p
                className="text-gray-900"
                dangerouslySetInnerHTML={{ __html: product.shippingBanner.labelHtml }}
              />
            )}

            {/* Delivery Speed */}
            {product.deliveryOptions?.length > 0 && (
              <div>
                <h3 className="text-xl font-semibold mb-3">Delivery Speed</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {product.deliveryOptions.map((opt, i) => (
                    <button
                      key={`${opt.value}-${i}`}
                      onClick={() => setSelectedSpeed(opt.value)}
                      className={`rounded-xl px-5 py-4 border-2 ${
                        selectedSpeed === opt.value
                          ? "border-black/80 bg-gray-100"
                          : "border-gray-300 bg-white"
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantities */}
            {quantities.length > 0 && (
              <div>
                <h3 className="text-xl font-semibold mb-3">Quantity</h3>
                {visibleQty.map((q, i) => (
                  <div
                    key={`${q.qty}-${i}`}
                    className="flex justify-between border border-gray-300 rounded-xl px-4 py-4 hover:border-black/60 cursor-pointer"
                  >
                    <span>{q.qty}</span>
                    <span className="font-semibold">
                      ₹{q.price}{" "}
                      {q.unit != null && (
                        <span className="text-sm text-gray-500">₹{q.unit} / unit</span>
                      )}
                    </span>
                  </div>
                ))}
                {quantities.length > 3 && (
                  <button
                    onClick={() => setShowAllQty((v) => !v)}
                    className="underline text-gray-900 mt-2"
                  >
                    {showAllQty ? "Hide quantities" : "See more quantities"}
                  </button>
                )}
              </div>
            )}

            {/* Upload/Browse */}
            <div className="space-y-3">
              <Link to={`/designs?product=${slug}`} className="block">
                <div className="flex items-center justify-between rounded-xl bg-sky-300 px-5 py-5 hover:shadow-md">
                  <div>
                    <h4 className="font-semibold text-lg">Browse designs</h4>
                    <p>Choose one of our templates</p>
                  </div>
                  <ImageIcon size={28} />
                </div>
              </Link>

              <div className="flex items-center justify-between rounded-xl border border-gray-300 bg-white px-5 py-5">
                <div>
                  <h4 className="font-semibold text-lg">Upload design</h4>
                  <p>Have a design? Upload and edit it</p>
                </div>
                <UploadCloud size={26} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Overview Sections */}
      {product.overviewSections?.map((sec, i) => {
        const media = sec.media?.src ? (
          <img
            src={sec.media.src}
            alt={sec.media.alt || ""}
            className="rounded-xl shadow-lg"
            referrerPolicy="no-referrer"
            onError={handleImgError}
          />
        ) : null;

        return (
          <section
            key={i}
            className="px-5 md:px-8 lg:px-12 py-12 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center"
          >
            {sec.mediaPosition === "right" ? (
              <>
                <div>
                  <h2 className="text-2xl font-bold">{sec.title}</h2>
                  <div
                    className="mt-4 text-gray-700 leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: sec.bodyHtml || "" }}
                  />
                </div>
                {media}
              </>
            ) : (
              <>
                {media}
                <div>
                  <h2 className="text-2xl font-bold">{sec.title}</h2>
                  <div
                    className="mt-4 text-gray-700 leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: sec.bodyHtml || "" }}
                  />
                </div>
              </>
            )}
          </section>
        );
      })}

      {/* Related, Reviews, FAQ */}
      <section className="p-8">
        <h2 className="text-2xl font-bold px-4">Related Products</h2>
        <ProductCarousal data={[]} slideshow={5} />
      </section>

      <ReviewsSection reviews={product.reviews || []} total={product.reviews?.length || 0} />
      <FAQPage />
    </div>
  );
}

export default Description;
