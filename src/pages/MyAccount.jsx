// MyAccount.js
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Dashboard from "./Dashboard/Dashboard";
import AccountProfile from "./Dashboard/AccountProfile";
import MyProjects from "./Dashboard/MyProjects";
import DesignServices from "./Dashboard/DesignServices";
import WebsitesDigital from "./Dashboard/WebsitesDigital";
import BrandKit from "./Dashboard/BrandKit";
import MyUploads from "./Dashboard/MyUploads";
import MyFavorites from "./Dashboard/MyFavorites";
import OrderHistory from "./Dashboard/OrderHistory";
import Subscriptions from "./Dashboard/Subscriptions";
import AccountSettings from "./Dashboard/AccountSettings";
import PaymentDelivery from "./Dashboard/PaymentDelivery";

const MyAccount = () => {
  const { tabId } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(tabId || "dashboard");

  // Update active tab when URL parameter changes
  useEffect(() => {
    if (tabId) {
      setActiveTab(tabId);
    }
  }, [tabId]);

  // Navigation categories with their items
  const navCategories = [
    {
      name: "Account",
      items: [
        {
          id: "dashboard",
          name: "Dashboard",
          url: "/account/dashboard",
        },
        {
          id: "profile",
          name: "Account Profile",
          url: "/account/profile",
          isNew: true,
        },
      ]
    },
    {
      name: "Workspace",
      items: [
        { id: "projects", name: "My Projects", url: "/account/projects" },
        { id: "design", name: "My Design Services", url: "/account/design" },
        { id: "websites", name: "Websites & Digital", url: "/account/websites" },
        { id: "brand", name: "Brand Kit", url: "/account/brand" },
        { id: "uploads", name: "My Uploads", url: "/account/uploads" },
        { id: "favorites", name: "My Favorites", url: "/account/favorites" },
      ]
    },
    {
      name: "Orders",
      items: [
        { id: "orders", name: "Order History & Reorder", url: "/account/orders" },
        {
          id: "subscriptions",
          name: "Subscriptions",
          url: "/account/subscriptions",
        },
      ]
    },
    {
      name: "Settings",
      items: [
        { id: "account-settings", name: "Account Settings", url: "/account/account-settings" },
        { id: "payment-delivery", name: "Payment & Delivery", url: "/account/payment-delivery" },
      ]
    }
  ];

  // Handle tab click - update URL and active tab
  const handleTabClick = (tabId, url) => {
    setActiveTab(tabId);
    navigate(url);
  };

  // Render different content based on active tab
  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <Dashboard />;
      case "profile":
        return <AccountProfile />;
      case "projects":
        return <MyProjects />;
      case "design":
        return <DesignServices />;
      case "websites":
        return <WebsitesDigital />;
      case "brand":
        return <BrandKit />;
      case "uploads":
        return <MyUploads />;
      case "favorites":
        return <MyFavorites />;
      case "orders":
        return <OrderHistory />;
      case "subscriptions":
        return <Subscriptions />;
      case "account-settings":
        return <AccountSettings />;
      case "payment-delivery":
        return <PaymentDelivery />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Navigation */}
          <div className="w-full lg:w-1/4">
            <div className="bg-white rounded-lg shadow p-6">
              <nav>
                {navCategories.map((category, categoryIndex) => (
                  <div key={categoryIndex} className="mb-6 last:mb-0">
                    <h3 className="text-sm font-medium text-slate-800 uppercase tracking-wider mb-2">
                      {category.name}
                    </h3>
                    <ul className="space-y-2">
                      {category.items.map((item) => (
                        <li key={item.id}>
                          <a
                            href={item.url}
                            className={`flex items-center py-2 px-3 rounded-md hover:bg-gray-100 ${
                              activeTab === item.id
                                ? "bg-blue-50 text-blue-600 font-medium"
                                : "text-gray-700"
                            }`}
                            onClick={(e) => {
                              e.preventDefault();
                              handleTabClick(item.id, item.url);
                            }}
                          >
                            {item.name}
                            {item.isNew && (
                              <span className="ml-2 bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded-full">
                                NEW
                              </span>
                            )}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="w-full ">{renderContent()}</div>
        </div>
      </div>
    </div>
  );
};

export default MyAccount;