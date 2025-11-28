import React from "react";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Footer from "./components/Footer";
import ProductCatgeoryVariant1 from "./pages/ProductCatgeoryVariant1";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Routes, Route, Navigate } from "react-router-dom";
import Description from "./pages/Description";
import SquareVisitingCardTemplates from "./pages/SquareVisitingCardTemplates";
import MyAccount from "./pages/MyAccount";

import "react-inner-image-zoom/lib/styles.min.css";
import CanvaButton from "./components/CanvaButton";
import OAuthHandler from "./components/OAuthHandler";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import OrderDetails from "./pages/OrderDetails";
import ProductCatgeoryVariant2 from "./pages/ProductCatgeoryVariant2";
import HelpCenter from "./pages/HelpCenter";

// newly added pages for template flow
import TemplateGallery from "./pages/TemplateGallery";
import Designer from "./pages/Designer";
import Studio from "./pages/Studio";
import ReviewPage from "./pages/ReviewPage";
import TshirtCatgeoryVariant1 from "./pages/TshirtCatgeoryVariant1";

const App = () => {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />

        {/* product category pages */}
        <Route path="/products-category" element={<ProductCatgeoryVariant1 />} />
        <Route path="/products-category-2" element={<ProductCatgeoryVariant2 />} />
        <Route path="/tshirt-category" element={<TshirtCatgeoryVariant1 />} />
        {/* product description */}
        <Route path="/products/:category/:slug" element={<Description />} />
         
        {/* user account */}
        <Route path="/account/:tabId?" element={<MyAccount />} />
        <Route path="/account" element={<MyAccount />} />

        {/* cart & checkout */}
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/order-details" element={<OrderDetails />} />

        {/* help center */}
        <Route path="/help" element={<HelpCenter />} />

        {/* square visiting card templates */}
        <Route
          path="/visiting-cards/square/templates"
          element={<SquareVisitingCardTemplates />}
        />

        {/* new: pre-built template gallery and fabric designer */}
        <Route path="/designs" element={<TemplateGallery />} />
        <Route path="/designer/:templateId" element={<Designer />} />

        {/* <Route path="/review" element={<ReviewPage />} /> */}

        {/* <Route path="/design/:templateId" element={<Designer />} /> */}
  <Route path="/review/:sessionId" element={<ReviewPage />} />
{/* <Route path="/studio" element={<Studio />} /> */}

        {/* optional extras */}
        {/* <Route path="/" element={<CanvaButton />} /> */}
        {/* <Route path="/oauth/callback" element={<OAuthHandler />} /> */}

        {/* catch-all */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
      <Footer />
    </>
  );
};

export default App;
