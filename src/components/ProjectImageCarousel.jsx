import React, { useEffect, useState } from "react";
import Slider from "react-slick";

// Custom Arrow Components
const NextArrow = ({ onClick }) => (
  <button
    className="absolute top-1/2 -translate-y-1/2 right-0 z-10 w-6 h-6 flex items-center justify-center rounded-full bg-white shadow-md hover:bg-gray-200 hover:scale-110 transition-all duration-300"
    onClick={onClick}
  >
    <svg
      className="w-5 h-5 text-gray-700"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  </button>
);

const PrevArrow = ({ onClick }) => (
  <button
    className="absolute top-1/2 -translate-y-1/2 left-0 z-10 w-6 h-6 flex items-center justify-center rounded-full bg-white shadow-md hover:bg-gray-200 hover:scale-110 transition-all duration-300"
    onClick={onClick}
  >
    <svg
      className="w-5 h-5 text-gray-700"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  </button>
);

export default function ProjectImageCarousel({
  images,
  smallWidth = "w-40",
  smallHeight = "h-28",
  bigWidth = "max-w-5xl",
  bigHeight = "max-h-[85vh]",
  showArrows = true, // 👈 dynamic arrows toggle
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [startIndex, setStartIndex] = useState(0);

  useEffect(() => {
    // Hide default slick arrows
    const style = document.createElement("style");
    style.textContent = `
      .slick-prev:before, .slick-next:before {
        display: none !important;
      }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  const smallSettings = {
    dots: false,
    infinite: true,
    speed: 400,
    slidesToShow: 1,
    slidesToScroll: 1,
    nextArrow: showArrows ? <NextArrow /> : null,
    prevArrow: showArrows ? <PrevArrow /> : null,
  };

  const bigSettings = {
    dots: true,
    infinite: true,
    speed: 400,
    slidesToShow: 1,
    slidesToScroll: 1,
    initialSlide: startIndex,
    nextArrow: showArrows ? <NextArrow /> : null,
    prevArrow: showArrows ? <PrevArrow /> : null,
  };

  return (
    <>
      {/* Small Carousel */}
      <div
        className={`${smallWidth} ${smallHeight} bg-gray-100 rounded overflow-hidden relative`}
      >
        <Slider {...smallSettings}>
          {images.map((src, idx) => (
            <div key={idx} className={`${smallWidth} ${smallHeight}`}>
              <img
                src={src}
                alt={`project-${idx}`}
                className={`w-full ${smallHeight} object-cover rounded cursor-pointer`}
                onClick={() => {
                  setStartIndex(idx);
                  setIsOpen(true);
                }}
              />
            </div>
          ))}
        </Slider>
      </div>

      {/* Big Modal Carousel */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center">
          <div className="relative w-full h-full flex items-center justify-center">
            {/* Close button */}
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-6 right-6 text-white text-3xl z-20"
            >
              ✕
            </button>

            {/* Carousel Container */}
            <div className={`w-full ${bigWidth} px-6`}>
              <Slider {...bigSettings}>
                {images.map((src, idx) => (
                  <div key={idx} className="flex justify-center items-center">
                    <img
                      src={src}
                      alt={`big-${idx}`}
                      className={`${bigHeight} max-w-[90vw] object-contain rounded-lg mx-auto`}
                    />
                  </div>
                ))}
              </Slider>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
