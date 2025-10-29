import React from "react";
import Slider from "react-slick";

export default function OfferdiscountTextCarousal() {
  var settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
  };
  return (
    <Slider {...settings}>
      <div className="bg-black p-2">
        <h3 className="text-white text-center">
          Buy More, Save More! Flat 5% OFF on Orders ₹10,000+ | Code: SAVE5{" "}
        </h3>
      </div>
      <div className="bg-black p-2">
        <h3 className="text-white text-center">
          {" "}
          FREE SHIPPING on all Orders! | 📞 Need Assistance? Call at{" "}
          <a href="tel:01234-56789" className="">
            01234-56789
          </a>
        </h3>
      </div>
    </Slider>
  );
}
