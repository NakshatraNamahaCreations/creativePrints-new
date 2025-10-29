import React from "react";
import OutlineButton from "../ui/OutlineButton";
import GeneralButton from "../ui/GeneralButton";

const AboutUs = () => {
  return (
    <div className="bg-gradient-to-b from-blue-50 to-white">
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center ">
          <div className="md:w-1/2 mb-10 md:mb-0">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
              The Leader in <span className="text-blue-800">Customisation</span>
            </h2>
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              For more than 20 years, VistaPrint has helped business owners,
              entrepreneurs and individuals create their identities with custom
              designs and professional marketing. Our online printing services
              are intended to help you find high quality customised products you
              need – visiting cards, personalized clothing, gifting products,
              and much more.
            </p>
            <div className="flex flex-wrap gap-4">
              <GeneralButton
                onClick={() => console.log("General Button Clicked")}
                buttonText="Explore Products"
                bgcolor="blue-800"
                textColor="white"
                roundedClass="rounded-md"
              />

              <OutlineButton
                onClick={() => console.log("Outline Button Clicked")}
                buttonText="Design Services"
                colors="blue-800"
                roundedClass="rounded-md"
              />
            </div>
          </div>
          <div className="w-1/2 mx-auto flex justify-end">
            <div className="relative">
              <div className="w-80 h-80 bg-blue-100 rounded-2xl transform rotate-6"></div>
              <div className="absolute top-0 left-0 w-80 h-80  rounded-2xl shadow-xl transform -rotate-3 flex items-center justify-center">
                <img src="https://specials-images.forbesimg.com/imageserve/638a98b6a088e5ce47202972/Girls-carrying-shopping-bags/960x0.jpg?fit=scale" alt="Customizable Products" className="w-full h-80 object-cover rounded-2xl" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 my-12">
        <div className="border-t border-gray-300"></div>
      </div>
    </div>
  );
};

export default AboutUs;
