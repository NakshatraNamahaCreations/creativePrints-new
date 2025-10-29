import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Modal from "../ui/Modal";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";
import OfferdiscountTextCarousal from "../components/OfferdiscountTextCarousal";
import Stars from "../ui/Star";
import TemplateCard from "../ui/TemplateCard";
import PersonalizePanel from "../ui/PersonalizePanel";
import UploadTile from "../ui/UploadTile";
import DesignerCtaTile from "../ui/DesignerCtaTile";
import Pagination from "../ui/Pagination";
import ReviewsSection from "../ui/ReviewsPage";
import BusinessCardConfigurator from "../ui/BusinessCardConfigurator";
import Breadcrumb from "../components/BreadCrumb";
import { HiTemplate } from "react-icons/hi";
import { FaHome, FaBox, FaBookReader } from "react-icons/fa";

const TEMPLATES = [
  {
    id: "t1",
    title: "Elegant Black",
    img: "https://images.unsplash.com/photo-1545239351-1141bd82e8a6?q=80&w=1200&auto=format&fit=crop",
    colors: ["#1E1E1E", "#7F4A4A", "#274D3D", "#213B64", "#2B2B2B"],
    qtyBase: 100,
    priceFrom: 230,
    // to: "/configurator/t1",
  },
  {
    id: "t2",
    title: "Blue Accent",
    img: "https://images.unsplash.com/photo-1516387938699-a93567ec168e?q=80&w=1200&auto=format&fit=crop",
    colors: ["#204D72", "#B65D7A", "#7F4A4A", "#2F6B50", "#6FA5C6"],
    qtyBase: 100,
    priceFrom: 230,
    // to: "/configurator/t2",
  },
  {
    id: "t3",
    title: "Minimal Mono",
    img: "https://images.unsplash.com/photo-1586717799252-bd134ad00e26?q=80&w=1200&auto=format&fit=crop",
    colors: ["#EFE7EC", "#1D1B1C", "#D9C7BD", "#8A817C", "#544E4B"],
    qtyBase: 100,
    priceFrom: 230,
    // to: "/configurator/t3",
  },
  {
    id: "t4",
    title: "Sleek Dark",
    img: "https://images.unsplash.com/photo-1531297484001-80022131f5a1?q=80&w=1200&auto=format&fit=crop",
    colors: ["#111111", "#6E6E6E", "#C0C0C0"],
    qtyBase: 100,
    priceFrom: 230,
    // to: "/configurator/t4",
  },
  {
    id: "t5",
    title: "Clean White",
    img: "https://images.unsplash.com/photo-1503602642458-232111445657?q=80&w=1200&auto=format&fit=crop",
    colors: ["#F5F5F5", "#D0E6F6", "#2C3E50"],
    qtyBase: 100,
    priceFrom: 230,
    // to: "/configurator/t5",
  },
  {
    id: "t6",
    title: "Soft Pastel",
    img: "https://images.unsplash.com/photo-1519710164239-da123dc03ef4?q=80&w=1200&auto=format&fit=crop",
    colors: ["#F1E6E6", "#D7C9C9", "#9A8F97"],
    qtyBase: 100,
    priceFrom: 230,
    // to: "/configurator/t6",
  },
  {
    id: "t7",
    title: "Golden Luxe",
    img: "https://images.unsplash.com/photo-1503602642458-232111445657?q=80&w=1200&auto=format&fit=crop",
    colors: ["#000000", "#FFD700", "#8B7500"],
    qtyBase: 100,
    priceFrom: 230,
    // to: "/configurator/t7",
  },
  {
    id: "t8",
    title: "Green Nature",
    img: "https://images.unsplash.com/photo-1501004318641-b39e6451bec6?q=80&w=1200&auto=format&fit=crop",
    colors: ["#1B4332", "#40916C", "#95D5B2"],
    qtyBase: 100,
    priceFrom: 230,
    // to: "/configurator/t8",
  },
  {
    id: "t9",
    title: "Royal Purple",
    img: "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?q=80&w=1200&auto=format&fit=crop",
    colors: ["#3D0066", "#7F00FF", "#C77DFF"],
    qtyBase: 100,
    priceFrom: 230,
    // to: "/configurator/t9",
  },
  {
    id: "t10",
    title: "Modern Gray",
    img: "https://images.unsplash.com/photo-1501004318641-b39e6451bec6?q=80&w=1200&auto=format&fit=crop",
    colors: ["#333333", "#777777", "#DDDDDD"],
    qtyBase: 100,
    priceFrom: 230,
    // to: "/configurator/t10",
  },
  {
    id: "t11",
    title: "Rustic Brown",
    img: "https://images.unsplash.com/photo-1503602642458-232111445657?q=80&w=1200&auto=format&fit=crop",
    colors: ["#4E342E", "#6D4C41", "#A1887F"],
    qtyBase: 100,
    priceFrom: 230,
    // to: "/configurator/t11",
  },
  {
    id: "t12",
    title: "Ocean Blue",
    img: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1200&auto=format&fit=crop",
    colors: ["#003049", "#0077B6", "#90E0EF"],
    qtyBase: 100,
    priceFrom: 230,
    // to: "/configurator/t12",
  },
  {
    id: "t13",
    title: "Coral Pop",
    img: "https://images.unsplash.com/photo-1558981285-6f0c94958bb6?q=80&w=1200&auto=format&fit=crop",
    colors: ["#FF6F61", "#FFB4A2", "#E5989B"],
    qtyBase: 100,
    priceFrom: 230,
    // to: "/configurator/t13",
  },
  {
    id: "t14",
    title: "Classic Navy",
    img: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=1200&auto=format&fit=crop",
    colors: ["#001F54", "#034078", "#1282A2"],
    qtyBase: 100,
    priceFrom: 230,
    // to: "/configurator/t14",
  },
  {
    id: "t15",
    title: "Minimal Beige",
    img: "https://images.unsplash.com/photo-1519710164239-da123dc03ef4?q=80&w=1200&auto=format&fit=crop",
    colors: ["#F5F5DC", "#D2B48C", "#8B7D6B"],
    qtyBase: 100,
    priceFrom: 230,
    // to: "/configurator/t15",
  },
  {
    id: "t16",
    title: "Soft Pastel",
    img: "https://images.unsplash.com/photo-1519710164239-da123dc03ef4?q=80&w=1200&auto=format&fit=crop",
    colors: ["#F1E6E6", "#D7C9C9", "#9A8F97"],
    qtyBase: 100,
    priceFrom: 230,
    // to: "/configurator/t6",
  },
  {
    id: "t17",
    title: "Golden Luxe",
    img: "https://images.unsplash.com/photo-1503602642458-232111445657?q=80&w=1200&auto=format&fit=crop",
    colors: ["#000000", "#FFD700", "#8B7500"],
    qtyBase: 100,
    priceFrom: 230,
    // to: "/configurator/t7",
  },
  {
    id: "t18",
    title: "Green Nature",
    img: "https://images.unsplash.com/photo-1501004318641-b39e6451bec6?q=80&w=1200&auto=format&fit=crop",
    colors: ["#1B4332", "#40916C", "#95D5B2"],
    qtyBase: 100,
    priceFrom: 230,
    // to: "/configurator/t8",
  },
];

export default function SquareVisitingCardTemplates() {
  const [wish, setWish] = useState({});
  const toggleWish = (id) => setWish((w) => ({ ...w, [id]: !w[id] }));
  const rating = 4.6;

  const [currentPage, setCurrentPage] = useState(1);
  const [designsPerPage, setDesignsPerPage] = useState(24);

  const [open, setOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null);

  const totalResults = useMemo(() => 1008, []);
  const totalPages = Math.ceil(totalResults / designsPerPage);
  const displayedCards = TEMPLATES.slice(
    0,
    Math.min(totalResults, TEMPLATES.length)
  ); // Limit to available templates

  // Calculate the cards to display for the current page
  const indexOfLastCard = currentPage * designsPerPage;
  const indexOfFirstCard = indexOfLastCard - designsPerPage;
  const currentCards = displayedCards.slice(indexOfFirstCard, indexOfLastCard);

  const reviews = [
    {
      id: 1,
      title: "test",
      body: "fdgfdg",
      name: "anjali",
      rating: 4,
      date: "2025-08-20",
      verified: false,
    },
    {
      id: 2,
      title: "Classic Visiting Cards",
      body: "superb",
      name: "anant j.",
      rating: 5,
      date: "2025-08-18",
      verified: true,
    },
    {
      id: 3,
      title: "Great Job!",
      body: "Loved it",
      name: "saakshi s.",
      rating: 5,
      date: "2025-08-17",
      verified: true,
    },
  ];

  // Handle page change
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const nextPage = () =>
    currentPage < totalPages && setCurrentPage(currentPage + 1);
  const prevPage = () => currentPage > 1 && setCurrentPage(currentPage - 1);
  const breadcrumbItems = [
    { name: "Home", href: "/", icon: <FaHome /> },
  { name: "Products Category", href: "/products-category", icon: <FaBox /> },
    { name: "Description", href: "/description", icon: <FaBookReader /> },
    { name: "Templates", href: "/visiting-cards/square/templates", icon: <HiTemplate /> },
  ];
  return (
    <div className="bg-white">
      <OfferdiscountTextCarousal />
      <Breadcrumb items={breadcrumbItems} />
    
      {/* Title + blurb */}
      <div className="mt-2 flex flex-col md:flex-row md:items-start md:justify-between gap-6 py-2 px-6">
        <h1 className="text-2xl md:text-[32px] leading-tight font-bold text-gray-900">
          Design Gallery: Square Visiting Cards
        </h1>
        <p className="max-w-2xl text-gray-700 leading-7 text-[16px]">
          Find popular design templates for Square Visiting Cards — or browse
          more Square Visiting Cards designs in our gallery.
        </p>
      </div>

      {/* Rating */}
      <div className="flex items-center gap-3 py-2 px-6">
        <Stars value={rating} size="w-7 h-7" />
        <span className="text-gray-900 font-semibold">{rating}</span>
      </div>

      <hr className="mt-2 border-gray-200" />

      {/* Search + totals + favourites */}
      <div className="px-6 flex items-center justify-between gap-4 mt-4">
        <div className="relative" style={{ width: 420 }}>
          <input
            className="w-full rounded-full border border-gray-300 bg-white px-5 py-3 pr-12 outline-none placeholder:text-gray-500"
            placeholder="Search templates"
          />
          <Search
            className="absolute right-4 top-1/2 -translate-y-1/2"
            size={20}
          />
        </div>

        <div className="text-gray-600">{totalResults} results</div>

        <button className="rounded-full border border-gray-300 px-5 py-2.5 flex items-center gap-2 text-gray-800 hover:bg-gray-50">
          <span className="text-[18px] leading-none">♡</span> Favourites
        </button>
      </div>

      {/* Tiles Row */}
      <div className="px-6 py-6">
        <div className="flex gap-6">
          {/* First Column: PersonalizePanel */}
          <div className="w-[280px] flex-shrink-0">
            <PersonalizePanel />
          </div>

          {/* Second Column: UploadTile, TemplateCards, DesignerCtaTile */}
          <div className="flex-1">
            <div className="flex flex-wrap gap-6">
              <UploadTile baseQty={100} priceFrom={230} />
              {currentCards.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => {
                    setSelectedTemplate(t);
                    setOpen(true);
                  }}
                  className="p-0 m-0 bg-transparent border-0 cursor-pointer"
                  aria-label={`Open configurator for ${t.title}`}
                >
                  <TemplateCard
                    {...t}
                    isFavorite={!!wish[t.id]}
                    onToggleFavorite={toggleWish}
                  />
                </button>
              ))}

              <DesignerCtaTile />
            </div>
          </div>
        </div>

        {/* Pagination */}
        <div className="px-6 py-4 flex items-center justify-between">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />

          <div className="relative">
            <select
              className="appearance-none rounded-full border border-gray-300 bg-white px-4 py-2 pr-8 outline-none text-gray-800 hover:bg-gray-50"
              value={designsPerPage}
              onChange={(e) => {
                setDesignsPerPage(Number(e.target.value));
                setCurrentPage(1); // Reset to first page on per-page change
              }}
            >
              <option value={12}>12 per page</option>
              <option value={24}>24 per page</option>
              <option value={48}>48 per page</option>
            </select>
            <span className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none">
              ▼
            </span>
          </div>
        </div>
        <Modal isOpen={open} onClose={() => setOpen(false)}>
          <BusinessCardConfigurator
            template={selectedTemplate}
            onClose={() => setOpen(false)}
          />
        </Modal>
        <section className="px-6 pt-10 pb-14 mt-4 border-t border-gray-200 ">
          <h2 className="text-1xl md:text-3xl font-extrabold tracking-tight text-gray-900 max-w-4xl">
            Classic Visiting Cards: Let’s bring your vision to life.
          </h2>

          <div
            className="mt-6 max-w-3xl text-gray-700 text-[14px] leading-8 space-y-4 "
            style={{ marginRight: "20%" }}
          >
            <p>
              Looking for an easy and stress-free way to create custom Classic
              Visiting Cards? Vistaprint is here to help. We have a wide
              assortment of fully customisable Classic Visiting Cards templates,
              including options with space for custom images, logos and more.
            </p>
            <p>
              Working with your own bespoke design? No problem – we’re ready
              with a design upload experience that lets you skip ahead and focus
              on the product choices that are relevant to you. You can even team
              up with one of our professional designers to create a completely
              original look for your Classic Visiting Cards.
            </p>
            <p>
              Whatever your need, we’re ready to make it happen – and we’re not
              satisfied until you’re satisfied. Ready to create? Great – so are
              we.
            </p>
          </div>
        </section>

        <section className="">
          <div className="">
            <ReviewsSection reviews={reviews} total={122} />
          </div>
        </section>
      </div>
    </div>
  );
}
