import React, { useEffect, useState } from "react";
import Banner from "../ui/Banner";
import ProductCard from "../ui/ProductCard";
import { IoIosArrowRoundForward } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import Breadcrumb from "../components/BreadCrumb";
import { FaHome, FaBox } from "react-icons/fa";
import FAQPage from "../ui/FAQPage";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

const toCardItem = (p) => ({
  id: p._id || p.slug || p.title,
  title: p.title,
  subtitle: p.subtitle || "",
  badge: p.badge || "",
  price: p.priceText || "",
  image: p.image,
  rating: p.rating ?? 0,
  slug: p.slug,
});

export default function TshirtCategoryVariant1() {
  const navigate = useNavigate();

  const [papers, setPapers] = useState([]);
  const [specialty, setSpecialty] = useState([]);
  const [tshirts, setTshirts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const [r2, r3, r4] = await Promise.all([
          fetch(`${API_BASE}/api/products?group=paper`),
          fetch(`${API_BASE}/api/products?group=specialty`),
          fetch(`${API_BASE}/api/tshirts`),
        ]);

        if (!r2.ok || !r3.ok || !r4.ok) {
          const texts = await Promise.all([r2.text(), r3.text(), r4.text()]);
          throw new Error("APIs failed: " + texts.join(" | "));
        }

        const [d2, d3, d4] = await Promise.all([r2.json(), r3.json(), r4.json()]);
        if (cancelled) return;

        setPapers(d2.map(toCardItem));
        setSpecialty(d3.map(toCardItem));
        setTshirts(d4.map(toCardItem));
      } catch (e) {
        if (!cancelled) setErr(e.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => (cancelled = true);
  }, []);

  const breadcrumbItems = [
    { name: "Home", href: "/", icon: <FaHome /> },
    { name: "T-Shirt Category", href: "/tshirt-category", icon: <FaBox /> },
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

        {/* 🔥 T-shirt section moved to top */}
        <div>
          <h3 className="text-2xl font-bold px-4 my-3">T-shirts</h3>
          <p className="px-4 mb-4">Shop our T-shirt collection</p>

          <div className="grid md:grid-cols-4 gap-6 m-4">
            {tshirts.map((item) => (
              <ProductCard
                key={item.id}
                item={item}
                onClick={() =>
                  navigate(
                    `/products/tshirt/${item.slug || encodeURIComponent(item.title)}`
                  )
                }
              />
            ))}
          </div>
        </div>

        {/* 📌 Shop by papers */}
        <div className="mt-10">
          <h3 className="text-xl font-bold px-4 my-3">Shop by papers & textures</h3>
          <p className="px-4 mb-2">Most Popular</p>

          <div className="grid md:grid-cols-5 gap-6 m-4">
            {papers.map((item) => (
              <ProductCard
                key={item.id}
                item={item}
                onClick={() =>
                  navigate(`/products/visiting-card/${item.slug}`)
                }
              />
            ))}
          </div>
        </div>

        {/* 📌 Specialty */}
        <div className="mt-10">
          <h3 className="text-xl font-bold px-4 my-3">Shop specialty business cards</h3>
          <p className="px-4 mb-2">
            Make a statement with premium specialty cards
          </p>

          <div className="grid md:grid-cols-3 gap-6 m-4">
            {specialty.map((item) => (
              <ProductCard
                key={item.id}
                item={item}
                onClick={() =>
                  navigate(`/products/visiting-card/${item.slug}`)
                }
              />
            ))}
          </div>
        </div>

        {/* Creative ways */}
        <div className="mt-10">
          <h3 className="text-xl font-bold px-4 my-3">
            Creative ways to use your cards
          </h3>

          <div className="flex items-center justify-between">
            <p className="px-4 mb-2 max-w-xl">
              Looking for something specific? Check out trendy templates.
            </p>

            <div className="flex items-center text-blue-500">
              <a href="">See more Business Card templates</a>
              <IoIosArrowRoundForward size={30} />
            </div>
          </div>
        </div>
      </section>

      <FAQPage />
    </div>
  );
}
