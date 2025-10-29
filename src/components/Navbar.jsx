import { useRef, useState } from "react";
import {
  FiSearch,
  FiUser,
  FiShoppingCart,
  FiMenu,
  FiX,
  FiChevronDown,
} from "react-icons/fi";
import SearchBar from "../ui/SearchBar";
import { useNavigate } from "react-router-dom";
import { MdOutlineLiveHelp ,MdOutlineFavorite } from "react-icons/md";
import { FaFolderOpen } from "react-icons/fa6";



export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeMenu, setActiveMenu] = useState(null);
  const [menuTop, setMenuTop] = useState(0);
  const navRef = useRef(null);
  const navigate = useNavigate();
  // ----------------- DATA -----------------
  const navigationData = [
    {
      id: "view-all",
      label: "View All",
      href: "/products-category-2",
      items: [],
    },
    {
      id: "visiting-cards",
      label: "Visiting Cards",
      href: "/products-category",
      items: [
        {
          category: "Visiting Cards",
          items: [
            "Standard Visiting Cards",
            "Classic Visiting Cards",
            "Rounded Corner Visiting Cards",
            "Square Visiting Cards",
            "Leaf Visiting Cards (NEW)",
            "Oval Visiting Cards (NEW)",
            "Circle Visiting Cards (NEW)",
          ],
        },
        {
          category: "Brilliant Finishes",
          items: ["Spot UV Visiting Cards", "Raised Foil Visiting Cards"],
        },
        {
          category: "Specialty Cards",
          items: ["Magnetic Visiting Cards", "Transparent Visiting Cards"],
        },
        {
          category: "Premium Papers",
          items: [
            "Premium Plus Visiting Cards",
            "Non-Tearable Visiting Cards",
            "Velvet Touch Visiting Cards",
            "Pearl Visiting Cards (NEW)",
            "Kraft Visiting Cards (NEW)",
            "Diamond Visiting Cards (NEW)",
          ],
        },
        {
          category: "Design and Logo (NEW)",
          items: ["Design Services", "Logo Maker"],
        },
        {
          category: "Visiting Cards Holder",
          items: [
            "Engraved Metal Visiting Card Holders",
            "Metal Visiting Card Holder",
            "Leatherite Visiting Cards Holder",
            "Premium Metal Card Holders (NEW)",
          ],
        },
        {
          category: "Standard Papers",
          items: [
            "Glossy Visiting Cards",
            "Matte Visiting Cards",
            "Bulk Visiting Cards (NEW)",
          ],
        },
        {
          category: "Digital Visiting Cards",
          items: ["QR Code Visiting Cards", "NFC Visiting Cards"],
        },
      ],
    },
    {
      id: "stationery",
      label: "Stationery, Letterheads & Notebooks",
      href: "/products-category-2",
      items: [
        {
          category: "Business Essentials",
          items: [
            "Business Cards",
            "Letterheads",
            "Envelopes",
            "Notepads",
            "Presentation Folders",
          ],
        },
        {
          category: "Office Supplies",
          items: ["Pens & Notebooks", "Desk Organizers", "Calendars"],
        },
      ],
    },
    {
      id: "stamps",
      label: "Stamps and Ink",
      href: "/products-category-2",
      items: [
        {
          category: "Stamping Products",
          items: [
            "Rubber Stamps",
            "Self-inking Stamps",
            "Pre-inked Stamps",
            "Dater Stamps",
          ],
        },
        { category: "Ink & Accessories", items: ["Ink Pads", "Stamp Cases"] },
      ],
    },

    {
      id: "clothing",
      label: "Clothing, Caps & Bags",
      href: "/products-category-2",
      items: [
        {
          category: "Love your new look",
          items: [
            "Clothing, Caps & Bags",
            "Custom Polo T-Shirts",
            "Printed T-Shirts",
            "Custom Office Shirts",
            "Caps",
            "Bags",
            "Reflective Safety Vest",
          ],
        },
      ],
    },

    {
      id: "bulk",
      label: "Bulk Orders",
      href: "/products-category",
      items: [
        {
          category: "Volume Orders",
          items: ["Business Cards Bulk", "Flyers in Bulk", "Postcards Bulk"],
        },
      ],
    },
    {
      id: "labels",
      label: "Labels, Stickers & Packaging",
      href: "/products-category-2",
      items: [
        {
          category: "Labels & Stickers",
          items: [
            "Product Labels",
            "Shipping Labels",
            "Custom Stickers",
            "Bumper Stickers",
          ],
        },
        {
          category: "Packaging",
          items: ["Packaging Tape", "Mailers", "Boxes"],
        },
      ],
    },
    {
      id: "drinkware",
      label: "Custom Drinkware",
      href: "/products-category",
      items: [
        {
          category: "Drinkware",
          items: ["Mugs", "Water Bottles", "Tumblers", "Glassware"],
        },
      ],
    },
    {
      id: "signs",
      label: "Signs, Posters & Marketing Materials",
      href: "/products-category-2",
      items: [
        {
          category: "Signs & Banners",
          items: ["Yard Signs", "Window Signs", "Banners", "Real Estate Signs"],
        },
        {
          category: "Posters & Flyers",
          items: ["Posters", "Flyers", "Brochures", "Postcards"],
        },
      ],
    },
    {
      id: "tshirts",
      label: "Custom Polo T-shirts",
      href: "/products-category-2",
      items: [
        {
          category: "Apparel",
          items: ["Polo Shirts", "T-Shirts", "Sweatshirts", "Jackets"],
        },
      ],
    },
    {
      id: "mugs",
      label: "Mugs, Albums & Gifts",
      href: "/products-category-2",
      items: [
        {
          category: "Made by You",
          items: [
            "Photo Albums",
            "Personalised Pens",
            "Magnets",
            "Notebooks & Diaries",
            "Calendars",
          ],
        },
        {
          category: "Home & Gifts",
          items: ["Mugs, Albums & Gifts", "Drinkware", "Mugs", "Gift Hampers"],
        },
      ],
    },
    {
      id: "winterWear",
      label: "Custom Winter Wear",
      href: "/products-category",
      items: [
        {
          category: "Weather Gear",
          items: ["Umbrellas", "Raincoats", "Rain Ponchos"],
        },
      ],
    },
  ];
  // ----------------- /DATA -----------------

  const prettifyLabel = (label) => label.split(" & ").join(" &<br/>");

  // compute dropdown top at the moment of hover; center with CSS
  const handleMenuHover = (menuId) => {
    setActiveMenu(menuId);
    const rect = navRef.current?.getBoundingClientRect();
    const nextTop = (rect?.bottom || 0) + window.scrollY;
    setMenuTop(nextTop);
  };

  const handleMenuLeave = () => setActiveMenu(null);

  return (
    <div className="w-screen ">
      {/* Top announcement bar */}
      <div className="bg-blue-800 text-white py-2 px-4 text-sm">
        <div className="max-w-7xl mx-auto flex justify-between">
          <span>Free shipping on orders over $50</span>
          <div className="hidden md:flex space-x-4">
            <a href="#" className="hover:underline">
              Help
            </a>
            <a href="#" className="hover:underline">
              Contact
            </a>
            <a href="#" className="hover:underline">
              Track Order
            </a>
          </div>
        </div>
      </div>

      {/* Top bar */}
      <div
        className="bg-white border-b border-gray-200"
        onMouseEnter={(e) => {
          e.stopPropagation();
          if (activeMenu) {
            setActiveMenu(null);
          }
        }}
      >
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center py-3">
            <div className="flex-shrink-0">
              <a href="/" className="text-2xl font-bold text-blue-800">
                CreativePrint
              </a>
            </div>

            <div className="hidden md:flex flex-1 max-w-lg mx-8">
              <SearchBar
                placeholder="Search products..."
                size="md"
                onSearch={(q) => console.log("Search:", q)}
              />
            </div>

            <div className="flex items-center space-x-6">
              <a
                href="/help"
                className="hidden md:block text-gray-700 hover:text-blue-800"
              >
                <MdOutlineLiveHelp size={20} />
              </a>
              <a
                href="/account/projects"
                className="hidden md:block text-gray-700 hover:text-blue-800"
              >
                <FaFolderOpen size={20} />
              </a>
              <a
                href="/account/favorites"
                className="hidden md:block text-gray-700 hover:text-blue-800"
              >
                <MdOutlineFavorite size={20} />
              </a>
              <a
                href="/account"
                className="hidden md:block text-gray-700 hover:text-blue-800"
              >
                <FiUser size={20} />
              </a>
              <a
                href="/cart"
                className="text-gray-700 hover:text-blue-800 relative"
              >
                <FiShoppingCart size={20} />
                <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs rounded-full h-5 w-5 grid place-content-center">
                  0
                </span>
              </a>
              <button
                className="md:hidden text-gray-700 hover:text-blue-800"
                onClick={() => setIsMenuOpen((v) => !v)}
              >
                {isMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main navigation */}
      <nav ref={navRef} className="shadow-md relative z-40">
        {/* Desktop */}
        {/* <div className="hidden md:flex bg-red-500 "> */}
        <div className="flex justify-center px-20">
          {navigationData.map((item) => {
            const formattedLabel = prettifyLabel(item.label);
            return (
              <div
                key={item.id}
                className="relative"
                onMouseEnter={() => handleMenuHover(item.id)}
              >
                <a
                  href={item.href}
                  className="px-2 py-3 text-gray-700 hover:text-blue-800 font-medium text-sm flex items-center"
                >
                  <div dangerouslySetInnerHTML={{ __html: formattedLabel }} />
                  {/* {item.items.length > 0 && (
                      <FiChevronDown className="ml-1" size={14} />
                    )} */}
                </a>
              </div>
            );
          })}
        </div>
        {/* </div> */}

        {/* FLOW, CENTERED MEGA MENU (scrolls with page) */}
        {activeMenu && (
          <div
            className="mx-auto z-30 absolute left-1/2 transform -translate-x-1/2"
            onMouseLeave={handleMenuLeave}
            onMouseEnter={() => setActiveMenu(activeMenu)}
          >
            <div
              className="
        bg-white border border-gray-200 shadow-lg 
        mx-auto w-[min(1400px,calc(100vw-28px))]
      "
            >
              {/* Check if stamps menu is active */}
              {activeMenu === "stamps" ? (
                <div className="p-6 grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
                  {[
                    {
                      img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcThCSodhNTlulS8GYh2Kc_2ddeIsnH1W4X5nA&s",
                      title: "Self Inking Stamps",
                      desc: "Same Day Delivery - Mumbai, Pune & Bangalore",
                      href: "/products/stamps/self-inking",
                    },
                    {
                      img: "https://click2print.in/wp-content/uploads/2025/01/basic-rubber-stamp.png",
                      title: "Basic Rubber Stamps",
                      desc: "Same Day Delivery - Mumbai, Pune & Bangalore",
                      href: "/products/stamps/rubber",
                    },
                    {
                      img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSOea8PgVbMspQMKWIyAft56VLcrpW3jh-vTA&s",
                      title: "Pocket Stamps",
                      desc: "Same Day Delivery - Mumbai",
                      href: "/products/stamps/pocket",
                    },
                    {
                      img: "https://www.thestampmaker.com/Images/products/Signature_stamp_Trodat_4915.jpg",
                      title: "Signature Stamps",
                      desc: "Same Day Delivery - Mumbai",
                      href: "/products/stamps/signature",
                    },
                    {
                      img: "https://i.etsystatic.com/13564764/r/il/1b622c/5385686515/il_570xN.5385686515_khvf.jpg",
                      title: "Paper Embosser",
                      desc: "High-quality embossing for documents",
                      href: "/products/stamps/embosser",
                    },
                  ].map((card, idx) => (
                    <a
                      key={idx}
                      href={card.href}
                      className="border rounded-lg shadow-sm hover:shadow-md transition bg-white block"
                    >
                      <img
                        src={card.img}
                        alt={card.title}
                        className="w-full h-44 object-cover rounded-t-lg"
                      />
                      <div className="p-4">
                        <h4 className="font-semibold text-sm text-gray-800 mb-1">
                          {card.title}
                        </h4>
                        <p className="text-xs text-gray-600">{card.desc}</p>
                      </div>
                    </a>
                  ))}
                </div>
              ) : (
                // Default text dropdown for other categories
                <div className="p-6 grid gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                  {navigationData
                    .find((n) => n.id === activeMenu)
                    ?.items.map((category, i) => (
                      <div key={i} className="min-w-0">
                        <h3 className="font-bold text-gray-800 mb-3 text-sm uppercase break-words">
                          {category.category}
                        </h3>
                        <ul className="space-y-2">
                          {category.items.map((subItem, j) => (
                            <li key={j} className="min-w-0">
                              <a
                                href="#"
                                className="text-sm text-gray-600 hover:text-blue-800 block py-1 break-words"
                              >
                                {subItem}
                              </a>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                </div>
              )}

              <div className="border-t border-gray-200 px-6 py-3 bg-gray-50 rounded-b-xl">
                <a
                  href="#"
                  className="text-blue-800 font-medium text-sm hover:underline"
                >
                  See all{" "}
                  {navigationData.find((n) => n.id === activeMenu)?.label}
                </a>
              </div>
            </div>
          </div>
        )}

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-white shadow-lg z-30 border-t">
            <div className="px-4 py-3">
              <SearchBar
                placeholder="Search products..."
                size="sm"
                className="mb-4"
                onSearch={(q) => console.log("Mobile search:", q)}
              />

              <div className="space-y-1">
                {navigationData.map((item) => (
                  <div key={item.id}>
                    <a
                      href={item.href}
                      className="block py-3 px-2 text-left font-medium text-gray-700 hover:bg-blue-50 rounded-md"
                    >
                      {item.label}
                    </a>
                  </div>
                ))}

                <a
                  href="#"
                  className="flex items-center py-3 px-2 text-gray-700 hover:bg-blue-50 rounded-md"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <FiUser className="mr-2" size={18} />
                  My Account
                </a>
              </div>
            </div>
          </div>
        )}
      </nav>
    </div>
  );
}
