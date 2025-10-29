import React, { useState, useEffect } from "react";
import GeneralButton from "../ui/WhiteButton";
import WhiteButton from "../ui/WhiteButton";

const BannerCarousel = ({ banners, autoPlayInterval = 5000 }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Handle next/previous navigation
  const goToSlide = (index) => {
    if (isTransitioning || index === currentIndex) return;

    setIsTransitioning(true);
    setCurrentIndex(index);

    // Reset transitioning state after animation completes
    setTimeout(() => setIsTransitioning(false), 800);
  };

  const goToNext = () => {
    goToSlide((currentIndex + 1) % banners.length);
  };

  const goToPrev = () => {
    goToSlide((currentIndex - 1 + banners.length) % banners.length);
  };

  // Auto-play functionality
  useEffect(() => {
    if (autoPlayInterval <= 0) return;

    const timer = setTimeout(goToNext, autoPlayInterval);
    return () => clearTimeout(timer);
  }, [currentIndex, autoPlayInterval]);

  const displayBanners = banners;

  return (
    <div className="relative w-full h-96 md:h-[500px] overflow-hidden rounded-2xl shadow-2xl group">
      {/* Main carousel container */}
      <div className="relative w-full h-full">
        {displayBanners.map((banner, index) => (
          <div
            key={banner.id}
            className={`absolute inset-0 transition-all duration-1000 ease-in-out transform ${
              index === currentIndex
                ? "opacity-100 scale-100 z-10"
                : "opacity-0 scale-105 z-0"
            }`}
          >
            {/* Background image with overlay */}
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${banner.image})` }}
            >
              <div className={`absolute inset-0 ${banner.overlay}`}></div>
            </div>

            {/* Content */}
            <div className="container mx-auto h-full flex items-center relative z-10">
              <div
                className={`flex-1 pl-6 md:pl-12 lg:pl-24 ${banner.textColor}`}
              >
                <h2 className="text-3xl md:text-5xl font-bold mb-3 animate-fade-in">
                  {banner.title}
                </h2>
                <p className="text-lg md:text-xl mb-6 max-w-md animate-fade-in-up">
                  {banner.description}
                </p>
                <WhiteButton text={banner.ctaText} link={banner.ctaLink} />
              </div>
              <div className="hidden md:flex absolute -top-40 -right-40 flex-1 justify-center items-center animate-float">
                <div className="w-[440px] h-[440px] bg-white/10 rounded-full backdrop-blur-sm flex items-center justify-center">
                  <div className="w-[340px] h-[340px] bg-white/20 rounded-full flex items-center justify-center">
                    <div className="w-[240px] h-[240px] bg-white/30 rounded-full"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation arrows with hover effect */}
      <button
        onClick={goToPrev}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full p-3 shadow-md transition-all z-20 opacity-0 group-hover:opacity-100"
        aria-label="Previous banner"
      >
        <svg
          className="w-6 h-6 text-gray-800"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
          />
        </svg>
      </button>
      <button
        onClick={goToNext}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full p-3 shadow-md transition-all z-20 opacity-0 group-hover:opacity-100"
        aria-label="Next banner"
      >
        <svg
          className="w-6 h-6 text-gray-800"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
      </button>

      {/* Indicator dots */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-3 z-20">
        {displayBanners.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-all ${
              index === currentIndex
                ? "bg-white scale-125 ring-2 ring-offset-2 ring-white"
                : "bg-white bg-opacity-50 hover:bg-opacity-75"
            }`}
            aria-label={`Go to banner ${index + 1}`}
          />
        ))}
      </div>

      {/* Progress bar */}
      <div className="absolute top-0 left-0 right-0 h-1.5 bg-white bg-opacity-30 z-20">
        <div
          className="h-full bg-white transition-all duration-100 ease-linear"
          style={{
            width: isTransitioning ? "100%" : "0%",
            transitionDuration: `${autoPlayInterval}ms`,
          }}
        ></div>
      </div>

      {/* Decorative elements */}
      <div className="absolute top-6 right-6 z-20">
        <span className="px-3 py-1 bg-black/70 text-white text-sm rounded-full">
          {currentIndex + 1} / {displayBanners.length}
        </span>
      </div>
    </div>
  );
};

export default BannerCarousel;
