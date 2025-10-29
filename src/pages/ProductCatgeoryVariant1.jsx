import React, { useEffect, useState } from "react";
import Banner from "../ui/Banner";
import ProductCard from "../ui/ProductCard";
import { IoIosArrowRoundForward } from "react-icons/io";
import RoundCard from "../ui/RoundCard";
import { useNavigate } from "react-router-dom";
import Breadcrumb from "../components/BreadCrumb";
import { FaHome, FaBox } from "react-icons/fa";
import FAQPage from "../ui/FAQPage";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";


// adapt backend Product → your ProductCard props
const toCardItem = (p) => ({
  id: p._id || p.slug || p.title,         // key
  title: p.title,
  subtitle: p.subtitle || "",
  badge: p.badge || "",
  price: p.priceText || "",               // ProductCard expects `price`
  image: p.image,
  rating: p.rating ?? 0,
  slug: p.slug,
});

export default function ProductCatgeoryVariant1() {
  const navigate = useNavigate();

  const [shapes, setShapes] = useState([]);
  const [papers, setPapers] = useState([]);
  const [specialty, setSpecialty] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const [r1, r2, r3] = await Promise.all([
          fetch(`${API_BASE}/api/products?group=shape`),
          fetch(`${API_BASE}/api/products?group=paper`),
          fetch(`${API_BASE}/api/products?group=specialty`),
        ]);
        if (!r1.ok || !r2.ok || !r3.ok) throw new Error("API request failed");

        const [d1, d2, d3] = await Promise.all([r1.json(), r2.json(), r3.json()]);
        if (cancelled) return;

        setShapes(d1.map(toCardItem));
        setPapers(d2.map(toCardItem));
        setSpecialty(d3.map(toCardItem));
      } catch (e) {
        if (!cancelled) setErr(e.message || "Failed to load products");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const breadcrumbItems = [
    { name: "Home", href: "/", icon: <FaHome /> },
    { name: "Products Category", href: "/products-category", icon: <FaBox /> },
  ];

  if (loading) return <div className="p-8">Loading…</div>;
  if (err) return <div className="p-8 text-red-600">Error: {err}</div>;

  return (
    <div>
      <Breadcrumb items={breadcrumbItems} />
      <div>
        <img src="/ss.png" alt="banner" />
      </div>

      <section className="m-8">
        {/* Shop by shapes */}
        <div>
          <h3 className="text-xl font-bold px-4 my-3">Shop by shapes</h3>
          <p className="px-4 mb-2">Select from various shapes & sizes.</p>

          <div className="grid md:grid-cols-5 gap-6 m-4">
            {shapes.map((item) => (
              <ProductCard
                key={item.id}
                item={item}
                onClick={() =>
                  navigate(
                    `/products/visiting-card/${item.slug || encodeURIComponent(item.title)}`
                  )
                }
              />
            ))}
          </div>
        </div>

        {/* Shop by papers & textures */}
        <div className="mt-10">
          <h3 className="text-xl font-bold px-4 my-3">Shop by papers & textures</h3>
          <p className="px-4 mb-2">Most Popular</p>

          <div className="grid md:grid-cols-5 gap-6 m-4">
            {papers.map((item) => (
              <ProductCard
                key={item.id}
                item={item}
                onClick={() =>
                  navigate(`/products/visiting-card/${item.slug || encodeURIComponent(item.title)}`)
                }
              />
            ))}
          </div>
        </div>

        {/* Specialty */}
        <div className="mt-10">
          <h3 className="text-xl font-bold px-4 my-3">
            Shop specialty business cards
          </h3>
          <p className="px-4 mb-2">
            Make a statement with our selection of specialty cards, intended for
            unique projects and uses
          </p>

          <div className="grid md:grid-cols-3 m-4">
            {specialty.map((item) => (
              <ProductCard
                key={item.id}
                item={item}
                onClick={() =>
                  navigate(`/products/visiting-card/${item.slug || encodeURIComponent(item.title)}`)
                }
              />
            ))}
          </div>
        </div>

        {/* Creative ways… (kept as-is; wire to dynamic “industries” later if you want) */}
        <div className="mt-10">
          <h3 className="text-xl font-bold px-4 my-3">
            Creative ways to use your cards
          </h3>
          <div className="flex items-center justify-between">
            <p className="px-4 mb-2 max-w-xl">
              Looking for something specific? Check out these on-trend templates
              for top industries.
            </p>
            <div className="flex items-center text-blue-500 ">
              <a href="">See more Business Card templates </a>
              <IoIosArrowRoundForward size={30} />
            </div>
          </div>

          {/* Keep your existing RoundCard data for now, or add an Industries API later */}
          {/* <div className="grid md:grid-cols-5 gap-6 m-4">
            {industries.map((item) => (
              <RoundCard
                key={item.id}
                item={item}
                onClick={() => navigate(`/description/${item.slug}`)}
              />
            ))}
          </div> */}
        </div>
      </section>

      <FAQPage />
    </div>
  );
}
