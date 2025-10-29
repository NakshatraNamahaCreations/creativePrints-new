import React, { useState } from "react";
import OutlineButton from "./OutlineButton";

const BusinessCardBanner = ({
  // Personalization props
  initials = "GK",
  name = "Gaurav Kumar",
  title = "Senior Designer",
  company = "Creative Solutions Inc.",

  // Content props
  tagline = "My Name, My Pride",
  priceText = "100 Visiting Cards at Rs 200",

  // Visual props
  colorScheme = "indigo",
  backgroundImage = null,
  cardImage = "https://images.unsplash.com/photo-1544928147-79a2dbc9f123?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1074&q=80",

  // Action props
  onOrderNow = () => alert("Order Now clicked!"),
  onLearnMore = () => alert("Learn More clicked!"),

  // Style customization
  borderRadius = "none",
  shadow = "xl",
  animated = true,
  bannerHeight = "300px",
  contentSide = "justify-start",
  buttons = [
    { label: "Order Now", action: () => alert("Order Now clicked!") },
    { label: "Learn More", action: () => alert("Learn More clicked!") },
  ],
}) => {
  const [isPressed, setIsPressed] = useState(false);

  const colorMap = {
    indigo: {
      gradient: "from-indigo-500 to-purple-600",
      bg: "indigo-100",
      text: "indigo-600",
      button: "indigo-600",
      border: "indigo-200",
    },
    pink: {
      gradient: "from-pink-500 to-pink-600",
      bg: "pink-100",
      text: "pink-600",
      button: "pink-600",
      border: "pink-200",
    },
    blue: {
      gradient: "from-blue-500 to-green-600",
      bg: "blue-100",
      text: "blue-600",
      button: "blue-600",
      border: "blue-200",
    },
    red: {
      gradient: "from-red-500 to-orange-600",
      bg: "red-100",
      text: "red-600",
      button: "red-600",
      border: "red-200",
    },
    teal: {
      gradient: "from-teal-500 to-cyan-600",
      bg: "teal-100",
      text: "teal-600",
      button: "teal-600",
      border: "teal-200",
    },
    amber: {
      gradient: "from-amber-500 to-orange-600",
      bg: "amber-100",
      text: "amber-600",
      button: "amber-600",
      border: "amber-200",
    },
    violet: {
      gradient: "from-violet-500 to-fuchsia-600",
      bg: "violet-100",
      text: "violet-600",
      button: "violet-600",
      border: "violet-200",
    },
  };

  const borderRadiusMap = {
    none: "rounded-none",
    sm: "rounded-sm",
    md: "rounded-md",
    lg: "rounded-lg",
    xl: "rounded-xl",
    "2xl": "rounded-2xl",
    full: "rounded-full",
  };

  const shadowMap = {
    none: "shadow-none",
    sm: "shadow-sm",
    md: "shadow-md",
    lg: "shadow-lg",
    xl: "shadow-xl",
    "2xl": "shadow-2xl",
  };

  const colors = colorMap[colorScheme];
  const roundedClass = borderRadiusMap[borderRadius];
  const shadowClass = shadowMap[shadow];

  return (
    <div
      className={` max-w-[1400px] mx-auto ${
        animated ? "transition-all duration-300 transform" : ""
      }`}
    >
  
      <div
        className={`bg-white ${roundedClass} ${shadowClass} overflow-hidden relative h-[${bannerHeight}] flex items-center ${contentSide}`}
      >
        {/* Background image with overlay */}
        {backgroundImage && (
          <div className="absolute inset-0 z-0 ">
            <img
              src={backgroundImage}
              alt="Background"
              className="w-full h-full object-cover opacity-80"
            />
          </div>
        )}

        <div className="relative z-10 p-8 md:p-10">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6  p-4  max-w-[700px]">
            {/* Business card image */}
            <div className="flex-shrink-0">
              <div
                className={`w-32 h-48 md:w-40 md:h-56 ${roundedClass} overflow-hidden border-2 border-${colors.border} ${shadowClass}`}
              >
                <img
                  src={cardImage}
                  alt="Business Card Design"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Content */}
            <div className="flex-grow text-center md:text-left">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
                {tagline}
              </h2>
              <p className="text-gray-600 mb-2">
                Premium Quality Visiting Cards
              </p>

              <div
                className={`price-tag inline-block bg-gradient-to-r ${colors.gradient} text-white font-semibold py-3 px-6 ${roundedClass} mt-4`}
              >
                <span className="text-lg">{priceText}</span>
              </div>

              <div className="mt-8 flex flex-col sm:flex-row justify-center md:justify-start space-y-4 sm:space-y-0 sm:space-x-4">
                {buttons.map((button, index) => (
                  <OutlineButton
                    key={index}
                    onClick={button.action}
                    buttonText={button.label}
                    colors={colors}
                    roundedClass={roundedClass}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* </div> */}
    </div>
  );
};

export default BusinessCardBanner;
