import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import CategoryBanner from "../ui/CategoryBanner";
import Breadcrumb from "../components/BreadCrumb";
import { FaHome, FaBox, FaChevronDown, FaChevronRight } from "react-icons/fa";
import ProductCard from "../ui/ProductCard";
import FAQPage from "../ui/FAQPage";

const categories = [
  {
    name: "Labels",
    subcategories: [
      "Product & Packaging Labels",
      "Return Address Labels",
      "Shipping and Mailing Labels",
      "Transparent Labels",
    ],
  },
  {
    name: "Stickers",
    subcategories: [
      "Sheet Stickers",
      "Sticker Singles",
      "Custom Shape Stickers",
      "Visiting Card Stickers",
      "Window Stickers",
      "Custom Floor Stickers",
      "Cricket Bat Stickers",
      "Custom Car Stickers",
      "Metal Stickers",
      "Custom Car Door Decals",
      "Glow in the Dark Stickers",
    ],
  },
  {
    name: "Packaging",
    subcategories: [
      "Packaging Sleeves",
      "Corrugated Boxes",
      "Flat Mailer Boxes",
      "Multipurpose Boxes",
      "Product Boxes",
      "Cloth Lined Green Envelope",
      "Courier Bags",
      "Standup Pouches",
      "Wrapping Paper",
    ],
  },
];

const productData = [
  {
    id: 1,
    title: "Glossy",
    price: "100 starting at Rs.200",
    image:
      "https://i.pinimg.com/1200x/f3/45/8f/f3458fa81422ef7ed36afda036c79ab2.jpg",
    rating: 4.5,
  },
  {
    id: 2,
    price: "100 starting at Rs.200",
    title: "Matte",
    image:
      "https://i.pinimg.com/736x/4e/83/cc/4e83cc93db6d801fcdf43a80260f5ff6.jpg",
    rating: 4,
  },
  {
    id: 3,
    price: "100 starting at Rs.200",
    title: "Non-Tearable",
    image:
      "https://i.pinimg.com/1200x/10/8c/a5/108ca553f2af688b174c0be0b7e8ebe9.jpg",
    rating: 4.6,
  },
  {
    id: 4,
    price: "100 starting at Rs.200",
    title: "Spot UV",
    image:
      "https://i.pinimg.com/736x/7c/55/45/7c5545b873248e15028123f6ad8c9eb3.jpg",
    rating: 4.2,
  },
  {
    id: 5,
    price: "100 starting at Rs.200",
    title: "Raised Foil Visiting Cards",
    image:
      "https://i.pinimg.com/736x/9c/d9/f6/9cd9f609a2fb04110292d861bd2cf326.jpg",
    rating: 4.3,
  },
  {
    id: 6,
    price: "100 starting at Rs.200",
    title: "Premium Plus Glossy",
    image:
      "https://i.pinimg.com/736x/51/28/78/512878bffcbe9de5f067d92c63dc64bd.jpg",
    rating: 3.5,
  },
  {
    id: 7,
    price: "100 starting at Rs.200",
    title: "Magnetic Visiting Cards",
    image:
      "https://i.pinimg.com/736x/90/44/4c/90444c661f02b9c8032011dc3c8e4c16.jpg",
    rating: 3.8,
  },
  {
    id: 8,
    price: "100 starting at Rs.200",
    title: "Transparent Visiting Cards",
    image:
      "https://i.pinimg.com/736x/29/22/cc/2922cced7a1ec00540ad82182d8c4958.jpg",
    rating: 3.8,
  },
  {
    id: 9,
    price: "100 starting at Rs.200",
    title: "Bulk Visiting Cards",
    image:
      "https://i.pinimg.com/736x/38/12/d6/3812d6c5959c7f2cc0d8189ebaab0c76.jpg",
    rating: 3.8,
  },
  {
    id: 10,
    price: "100 starting at Rs.200",
    title: "Velvet Touch",
    image:
      "https://i.pinimg.com/736x/49/0c/6d/490c6d21db8885d6e57df94426600cde.jpg",
    rating: 3.8,
  },
];

const ProductCategoryVariant2 = () => {
  const navigate = useNavigate();
  const [expandedCategories, setExpandedCategories] = useState({});
  const [selectedCategory, setSelectedCategory] = useState("Labels");

  const breadcrumbItems = [
    { name: "Home", href: "/", icon: <FaHome /> },
    { name: "Products Category", href: "/products-category", icon: <FaBox /> },
  ];

  const toggleCategory = (categoryName) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [categoryName]: !prev[categoryName],
    }));
  };

  const handleCategorySelect = (categoryName) => {
    setSelectedCategory(categoryName);
    // You could also filter products based on the selected category here
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Breadcrumb items={breadcrumbItems} />
      <CategoryBanner
        bgColor="bg-pink-100"
        title="Labels, Stickers & Packaging"
        description="Promote your business logo with customized stickers, labels, and packaging."
        image="https://images.unsplash.com/photo-1597481308307-1a5b262a544f?q=80&w=871&auto=format&fit=crop"
        buttons={[
          { label: "Labels", onClick: () => alert("Labels clicked!") },
          { label: "Stickers", onClick: () => alert("Stickers clicked!") },
          { label: "Packaging", onClick: () => alert("Packaging clicked!") },
        ]}
      />
      <div className="relative container mx-auto px-4 py-6 ">
        <div className="min-h-screen absolute -top-62 bg-white rounded-lg shadow p-4 w-[300px]">
          <h3 className="text-2xl font-bold text-gray-800 mb-4">
            Labels, Stickers & Packaging
          </h3>
          {/* Sidebar for Categories */}
          <div className=" p-4">
            <h4 className="text-lg font-semibold text-gray-700 mb-4 border-b pb-2">
              Categories
            </h4>

            <div className="space-y-2">
              {categories.map((category) => (
                <div
                  key={category.name}
                  className="border-b border-gray-100 last:border-b-0"
                >
                  <button
                    onClick={() => {
                      toggleCategory(category.name);
                      handleCategorySelect(category.name);
                    }}
                    className={`w-full flex items-center justify-between p-2 rounded-md ${
                      selectedCategory === category.name
                        ? "bg-blue-50 text-blue-600"
                        : "hover:bg-gray-50"
                    }`}
                  >
                    <span className="font-medium">{category.name}</span>
                    {expandedCategories[category.name] ? (
                      <FaChevronDown size={14} />
                    ) : (
                      <FaChevronRight size={14} />
                    )}
                  </button>

                  {expandedCategories[category.name] && (
                    <div className="pl-6 py-2 space-y-1">
                      {category.subcategories.map((subcategory) => (
                        <button
                          key={subcategory}
                          className="block w-full text-left p-2 text-sm text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-md"
                        >
                          {subcategory}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="ml-[340px] flex flex-col md:flex-row gap-6">
          {/* Main Content Area */}
          <div className="w-full ">
            <div className="bg-white rounded-lg shadow p-4 mb-6">
              <h4 className="text-xl font-semibold text-gray-800 mb-2">
                Custom {selectedCategory}
              </h4>
              <p className="text-gray-600">
                Browse our selection of premium {selectedCategory.toLowerCase()}{" "}
                to find the perfect fit for your needs.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
              {productData.map((item) => (
                <ProductCard
                  key={item.id}
                  item={item}
                  onClick={() => navigate(`/description`)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
      <FAQPage />
    </div>
  );
};

export default ProductCategoryVariant2;
