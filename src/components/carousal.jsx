
// import React, { useEffect } from "react";
// import Slider from "react-slick";
// import RoundCard from "./RoundCard";

// // Custom Arrow Components with Tailwind CSS
// const NextArrow = (props) => {
//   const { onClick } = props;
//   return (
//     <button
//       className="absolute top-1/2 -translate-y-1/2 -right-5 z-10 w-10 h-10 flex items-center justify-center rounded-full bg-white shadow-lg hover:bg-gray-800 hover:scale-110 transition-all duration-300 cursor-pointer group focus:outline-none"
//       onClick={onClick}
//       aria-label="Next slide"
//     >
//       <svg
//         className="w-5 h-5 text-gray-600 group-hover:text-white transition-colors duration-300"
//         viewBox="0 0 24 24"
//         fill="none"
//         stroke="currentColor"
//         strokeWidth="2"
//       >
//         <path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round"/>
//       </svg>
//     </button>
//   );
// };

// const PrevArrow = (props) => {
//   const { onClick } = props;
//   return (
//     <button
//       className="absolute top-1/2 -translate-y-1/2 -left-5 z-10 w-10 h-10 flex items-center justify-center rounded-full bg-white shadow-lg hover:bg-blue-500 hover:scale-110 transition-all duration-300 cursor-pointer group focus:outline-none"
//       onClick={onClick}
//       aria-label="Previous slide"
//     >
//       <svg
//         className="w-5 h-5 text-gray-600 group-hover:text-white transition-colors duration-300"
//         viewBox="0 0 24 24"
//         fill="none"
//         stroke="currentColor"
//         strokeWidth="2"
//       >
//         <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round"/>
//       </svg>
//     </button>
//   );
// };

// export default function SimpleSlider({ data, slideshow }) {
//   useEffect(() => {
//     // Hide default slick arrows
//     const style = document.createElement('style');
//     style.textContent = `
//       .slick-prev:before, .slick-next:before {
//         display: none !important;
//       }
//       .slick-prev, .slick-next {
//         width: 40px !important;
//         height: 40px !important;
//         z-index: 10 !important;
//       }
//       .slick-prev {
//         left: -50px !important;
//       }
//       .slick-next {
//         right: -50px !important;
//       }
//     `;
//     document.head.appendChild(style);

//     return () => {
//       document.head.removeChild(style);
//     };
//   }, []);

//   var settings = {
//     dots: false,
//     infinite: true,
//     speed: 500,
//     slidesToShow: slideshow,
//     slidesToScroll: 1,
//     nextArrow: <NextArrow />,
//     prevArrow: <PrevArrow />,
//     arrows: true,
//     responsive: [
//       {
//         breakpoint: 1024,
//         settings: {
//           slidesToShow: Math.min(slideshow, 3),
//           arrows: true,
//         },
//       },
//       {
//         breakpoint: 768,
//         settings: {
//           slidesToShow: Math.min(slideshow, 2),
//           arrows: true,
//         },
//       },
//       {
//         breakpoint: 480,
//         settings: {
//           slidesToShow: 1,
//           arrows: false, // Hide arrows on mobile
//         },
//       },
//     ],
//   };

//   const handleOnClick = () => {
//     alert("Card Clicked");
//   };

//   return (
//     <div className="relative mx-8"> {/* Add horizontal margin for arrow space */}
//       <Slider {...settings}>
//         {data.map((item) => (
//           <div key={item.id} className="px-2"> {/* Add padding between slides */}
//             <RoundCard
//               item={item}
//               onClick={handleOnClick}
//             />
//           </div>
//         ))}
//       </Slider>
//     </div>
//   );
// }


import React, { useEffect } from "react";
import Slider from "react-slick";
import RoundCard from "../ui/RoundCard";

// Custom Arrow Components with your color variables
const NextArrow = (props) => {
  const { onClick } = props;
  return (
    <button
      className="absolute top-1/2 -translate-y-1/2 -right-5 z-10 w-10 h-10 flex items-center justify-center rounded-full bg-white shadow-lg hover:bg-gray-200 hover:scale-110 transition-all duration-300 cursor-pointer group focus:outline-none"
      onClick={onClick}
      aria-label="Next slide"
    >
      <svg
        className="w-5 h-5 text-gray-600 group-hover:text-light transition-colors duration-300"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </button>
  );
};

const PrevArrow = (props) => {
  const { onClick } = props;
  return (
    <button
      className="absolute top-1/2 -translate-y-1/2 -left-5 z-10 w-10 h-10 flex items-center justify-center rounded-full bg-white shadow-lg hover:bg-gray-200 hover:scale-110 transition-all duration-300 cursor-pointer group focus:outline-none"
      onClick={onClick}
      aria-label="Previous slide"
    >
      <svg
        className="w-5 h-5 text-gray-600 group-hover:text-light transition-colors duration-300"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </button>
  );
};

export default function SimpleSlider({ data, slideshow }) {
  useEffect(() => {
    // Hide default slick arrows
    const style = document.createElement('style');
    style.textContent = `
      .slick-prev:before, .slick-next:before {
        display: none !important;
      }
      .slick-prev, .slick-next {
        width: 40px !important;
        height: 40px !important;
        z-index: 10 !important;
      }
      .slick-prev {
        left: -50px !important;
      }
      .slick-next {
        right: -50px !important;
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  var settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: slideshow,
    slidesToScroll: 1,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    arrows: true,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: Math.min(slideshow, 3),
          arrows: true,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: Math.min(slideshow, 2),
          arrows: true,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          arrows: false,
        },
      },
    ],
  };

  const handleOnClick = () => {
    alert("Card Clicked");
  };

  return (
    <div className="relative mx-8">
      <Slider {...settings}>
        {data.map((item) => (
          <div key={item.id} className="px-2">
            <RoundCard
              item={item}
              onClick={handleOnClick}
            />
          </div>
        ))}
      </Slider>
    </div>
  );
}