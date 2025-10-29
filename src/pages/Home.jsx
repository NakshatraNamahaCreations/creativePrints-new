import React from "react";
import OfferdiscountTextCarousal from "../components/OfferdiscountTextCarousal";
import BusinessCardBanner from "../ui/Banner";
import RoundCard from "../ui/RoundCard";
import SimpleSlider from "../components/carousal";
import ProductCarousal from "../components/ProductCarousal";
import BannerCarousel from "../components/BannerCarousel";
import NewsletterSubscription from "../components/NewsletterSubscription";
import AboutUs from "../components/AboutUs";
import FeaturesCard from "../ui/featuresCard";
import { GoGift } from "react-icons/go";
import { IoShieldCheckmarkOutline } from "react-icons/io5";
import GeneralButton from "../ui/GeneralButton";
import OutlineButton from "../ui/OutlineButton";

const data = [
  {
    id: 1,
    title: "Wireless Bluetooth Earbuds",
   
    image: "/products/earbuds.webp",
  },
  {
    id: 2,
    title: "Stainless Steel Water Bottle",
    image: "/products/bottle.webp",
  },
  {
    id: 3,
    title: "Organic Cotton T-Shirt",
    image: "/products/tshirt.webp",
  },
  {
    id: 4,
    title: "Smart Fitness Tracker",
    image: "/products/fitness.jpeg",
  },
  {
    id: 5,
    title: "Professional Chef's Knife",
    image: "/products/knife.webp",
  },
  {
    id: 6,
    title: "Yoga Mat Non-Slip",
    image: "/products/yogamat.webp",
  },
  {
    id: 7,
    title: "Mechanical Keyboard",
    image: "/products/keyboard.webp",
  },
  {
    id: 8,
    title: "Portable Power Bank",
    image: "/products/powerbank.jpeg",
  },
  {
    id: 9,
    title: "Ceramic Coffee Mug Set",
    image: "/products/mugs.webp",
  },
  {
    id: 10,
    title: "Wireless Charging Stand",
    image: "/products/wirelesscharger.webp",
  },
  {
    id: 11,
    title: "Bluetooth Portable Speaker",
    image: "/products/speaker.jpeg", 
  },
  {
    id: 12,
    title: "Men's Leather Wallet",
    image: "/products/wallet.webp",
  },
  {
    id: 13,
    title: "Women's Running Shoes",
    image: "/products/runningshoes.webp",
  },
  {
    id: 14,
    title: "Air Purifier for Home",
    image: "/products/purifier.webp",
  },
];

const recentlyViewData = [
  {
    id: 1,
    title: "Wireless Bluetooth Earbuds",
    subtitle: "Noise cancelling with 24hr battery life",
    image:
      "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80",
  },
  {
    id: 2,
    title: "Stainless Steel Water Bottle",
    subtitle: "Insulated, keeps drinks hot/cold for 12 hours",
    image:
      "https://images.unsplash.com/photo-1602143407151-7111542de6e8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80",
  },
  {
    id: 3,
    title: "Organic Cotton T-Shirt",
    subtitle: "100% organic cotton, comfortable fit",
    image:
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80",
  },
  {
    id: 4,
    title: "Smart Fitness Tracker",
    subtitle: "Track steps, heart rate, and sleep patterns",
    image:
      "https://images.unsplash.com/photo-1576243345690-4e4b79b63288?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80",
  },
  {
    id: 5,
    title: "Professional Chef's Knife",
    subtitle: "High-carbon steel, razor-sharp edge",
    image:
      "https://images.unsplash.com/photo-1602063238987-b6783ff91331?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fGtpdGNoZW4lMjBrbml2ZXN8ZW58MHx8MHx8fDA%3D",
  },
  {
    id: 6,
    title: "Yoga Mat Non-Slip",
    subtitle: "Extra thick for joint comfort, eco-friendly",
    image:
      "https://i.pinimg.com/1200x/0d/63/26/0d63267a7d15f497798cc7019353d245.jpg",
  },
  {
    id: 7,
    title: "Mechanical Keyboard",
    subtitle: "RGB backlit, tactile switches for gaming",
    image:
      "https://images.unsplash.com/photo-1541140532154-b024d705b90a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80",
  },
  {
    id: 8,
    title: "Portable Power Bank",
    subtitle: "10000mAh capacity, fast charging",
    image:
      "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80",
  },
  {
    id: 9,
    title: "Ceramic Coffee Mug Set",
    subtitle: "Set of 4, dishwasher and microwave safe",
    image:
      "https://images.unsplash.com/photo-1544787219-7f47ccb76574?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80",
  },
  {
    id: 10,
    title: "Wireless Charging Stand",
    subtitle: "Fast charging for all Qi-enabled devices",
    image:
      "https://i.pinimg.com/1200x/33/a9/ca/33a9ca93546c49f27778046c51ecd189.jpg",
  },
  {
    id: 11,
    title: "Bluetooth Portable Speaker",
    subtitle: "360° sound, waterproof, 20hr playtime",
    image:
      "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80",
  },
  {
    id: 12,
    title: "Men's Leather Wallet",
    subtitle: "Genuine leather, RFID blocking technology",
    image:
      "https://images.unsplash.com/photo-1627123424574-724758594e93?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80",
  },
];

const prodcutdata = [
  {
    id: 1,
    title: "Wireless Bluetooth Earbuds",
    subtitle: "Noise cancelling with 24hr battery life",
    badge: "Buy 25 @Rs.1500",
    image:
      "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80",
  },
  {
    id: 2,
    title: "Stainless Steel Water Bottle",
    subtitle: "Insulated, keeps drinks hot/cold for 12 hours",
    image:
      "https://images.unsplash.com/photo-1602143407151-7111542de6e8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80",
  },
  {
    id: 3,
    title: "Organic Cotton T-Shirt",
    subtitle: "100% organic cotton, comfortable fit",
    badge: "Buy 25 @Rs.150",
    image:
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80",
  },
  {
    id: 4,
    title: "Smart Fitness Tracker",
    subtitle: "Track steps, heart rate, and sleep patterns",
    badge: "Best Seller",
    image:
      "https://images.unsplash.com/photo-1576243345690-4e4b79b63288?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80",
  },
  {
    id: 5,
    title: "Professional Chef's Knife",
    subtitle: "High-carbon steel, razor-sharp edge",
    image:
      "https://images.unsplash.com/photo-1602063238987-b6783ff91331?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fGtpdGNoZW4lMjBrbml2ZXN8ZW58MHx8MHx8fDA%3D",
  },
  {
    id: 6,
    title: "Yoga Mat Non-Slip",
    subtitle: "Extra thick for joint comfort, eco-friendly",
    badge: "Buy 25 @Rs.250",
    image:
      "https://i.pinimg.com/1200x/0d/63/26/0d63267a7d15f497798cc7019353d245.jpg",
  },
  {
    id: 7,
    title: "Mechanical Keyboard",
    subtitle: "RGB backlit, tactile switches for gaming",
    image:
      "https://images.unsplash.com/photo-1541140532154-b024d705b90a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80",
  },
  {
    id: 8,
    title: "Portable Power Bank",
    subtitle: "10000mAh capacity, fast charging",
    badge: "Buy 25 @Rs.1000",
    image:
      "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80",
  },
  {
    id: 9,
    title: "Ceramic Coffee Mug Set",
    subtitle: "Set of 4, dishwasher and microwave safe",
    image:
      "https://images.unsplash.com/photo-1544787219-7f47ccb76574?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80",
  },
  {
    id: 10,
    title: "Wireless Charging Stand",
    subtitle: "Fast charging for all Qi-enabled devices",
    badge: "Buy 25 @Rs.300",
    image:
      "https://i.pinimg.com/1200x/33/a9/ca/33a9ca93546c49f27778046c51ecd189.jpg",
  },
  {
    id: 11,
    title: "Bluetooth Portable Speaker",
    subtitle: "360° sound, waterproof, 20hr playtime",
    image:
      "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80",
  },
  {
    id: 12,
    title: "Men's Leather Wallet",
    subtitle: "Genuine leather, RFID blocking technology",
    badge: "Buy 25 @Rs.300",
    image:
      "https://images.unsplash.com/photo-1627123424574-724758594e93?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80",
  },
];

// Sample banners data with real images from Unsplash
const defaultBanners = [
  {
    id: 1,
    title: "Summer Collection 2023",
    description:
      "Discover our new summer arrivals with up to 40% off on selected items",
    ctaText: "Shop Now",
    ctaLink: "#",
    background: "bg-gradient-to-r from-amber-400 to-orange-500",
    image:
      "https://images.unsplash.com/photo-1534452203293-494d7ddbf7e0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80",
    textColor: "text-white",
    overlay: "bg-gradient-to-r from-black/40 to-transparent",
  },
  {
    id: 2,
    title: "Tech Innovation Sale",
    description: "Latest gadgets with exclusive discounts and free shipping",
    ctaText: "Explore Tech",
    ctaLink: "#",
    background: "bg-gradient-to-r from-blue-600 to-indigo-800",
    image:
      "https://images.unsplash.com/photo-1498049794561-7780e7231661?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80",
    textColor: "text-white",
    overlay: "bg-gradient-to-l from-black/50 to-transparent",
  },
  {
    id: 3,
    title: "Home Essentials",
    description:
      "Transform your living space with our curated collection of home decor",
    ctaText: "Discover More",
    ctaLink: "#",
    background: "bg-gradient-to-r from-emerald-500 to-teal-700",
    image:
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80",
    textColor: "text-white",
    overlay: "bg-gradient-to-b from-black/30 to-transparent",
  },
  {
    id: 4,
    title: "Fitness Gear",
    description:
      "Get fit with our premium collection of workout equipment and apparel",
    ctaText: "Shop Fitness",
    ctaLink: "#",
    background: "bg-gradient-to-r from-rose-500 to-pink-600",
    image:
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80",
    textColor: "text-white",
    overlay: "bg-gradient-to-t from-black/40 to-transparent",
  },
];

const featuresCardData = [
  {
    id: 1,
    icon: <GoGift />,
    color: "blue",
    title: "High Quality Products",
    description:
      "Our wide selection of high-quality products and online design tools make it easy for you to customize and order your favourite products.",
    features: ["Quality Materials", "Easy Design Tools", "Fast Turnaround"],
  },
  {
    id: 2,
    color: "green",
    icon: <IoShieldCheckmarkOutline />,
    title: "Free replacement or Full Refund",
    description:
      "We stand by everything we sell. So if you're not satisfied, we'll make it right with a free replacement or full refund.",
    features: ["Satisfaction Guarantee", "Easy Returns", "Quick Refunds"],
  },
];

const Home = () => {
  return (
    <div className="">
      <OfferdiscountTextCarousal />

      <BusinessCardBanner
        colorScheme="amber"
        initials="JD"
        name="John Doe"
        title="Marketing Director"
        company="Global Marketing Inc."
        tagline="Quality That Speaks Volumes"
        priceText="500 Premium Cards at $99"
        backgroundImage="bg2.jpg"
        cardImage="https://images.unsplash.com/photo-1603400521630-9f2de124b33b?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8ODB8fHNob3BwaW5nfGVufDB8fDB8fHww"
        shadow="2xl"
        bannerHeight="400px"
        buttons={[
          {
            label: "Order Now",
            action: () => (window.location.href = "/order"),
          },
        ]}
      />

      <BusinessCardBanner
        colorScheme="pink"
        initials="JD"
        name="John Doe"
        title="Marketing Director"
        company="Global Marketing Inc."
        tagline="Quality That Speaks Volumes"
        priceText="500 Premium Cards at $99"
        backgroundImage="bg5.jpg"
        cardImage="https://images.unsplash.com/photo-1603400521630-9f2de124b33b?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8ODB8fHNob3BwaW5nfGVufDB8fDB8fHww"
        shadow="2xl"
        contentSide="justify-end"
      />

      <section className="p-8">
        <div>
          <h2 className="text-2xl font-bold px-4">Explore all categories</h2>
          <SimpleSlider data={data} slideshow={5} />
        </div>
        <div className="py-10">
          <h2 className="text-2xl font-bold px-4">
            Your recently viewed items
          </h2>
          <ProductCarousal data={recentlyViewData} slideshow={5} />
        </div>
        <div className="">
          <h2 className="text-2xl font-bold px-4">Our Most Popular Products</h2>
          <ProductCarousal data={prodcutdata} slideshow={5} />
        </div>
        <div className="py-5">
          <h2 className="text-2xl font-bold px-4">Trending</h2>
          <ProductCarousal data={prodcutdata} slideshow={5} />
        </div>

        <BannerCarousel banners={defaultBanners} autoPlayInterval={4000} />
        <div className="py-5">
          <h2 className="text-2xl font-bold px-4">Explore More</h2>
          <ProductCarousal data={prodcutdata} slideshow={5} />
        </div>
        <div className="py-5">
          <h2 className="text-2xl font-bold px-4">New Arrivals </h2>
          <ProductCarousal data={prodcutdata} slideshow={5} />
        </div>

        <NewsletterSubscription />
        <AboutUs />

        <div className="grid md:grid-cols-2 gap-12">
          {featuresCardData.map((feature) => (
            <FeaturesCard key={feature.id} {...feature} />
          ))}
        </div>

        {/* Features Section */}

        <div className="container mx-auto px-4 pt-20">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Even <span className="text-blue-800">Low Quantities</span> @ Best
              Prices
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We offer low/ single product quantities at affordable prices
              without compromising on quality.
            </p>
          </div>
        </div>
      </section>
      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-blue-900 to-blue-700 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Create Something Amazing?
          </h2>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto mb-8">
            Join thousands of satisfied customers who have transformed their
            businesses with our custom products.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <GeneralButton
              onClick={() => console.log("General Button Clicked")}
              buttonText="Start Designing"
              bgcolor="white"
              textColor="blue-800"
              roundedClass="rounded-md"
            />

            <OutlineButton
              onClick={() => console.log("Outline Button Clicked")}
              buttonText="Design Services"
              colors="white"
              roundedClass="rounded-md"
            />
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
