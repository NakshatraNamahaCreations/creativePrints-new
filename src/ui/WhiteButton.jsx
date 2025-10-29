import React from "react";

const WhiteButton = ({ text, link }) => {
  return (
    <div>
      <a
        href={link}
        className="inline-block px-6 py-3 bg-white text-gray-800 font-semibold rounded-full shadow-lg hover:bg-gray-100 transition-all transform hover:scale-105 hover:shadow-xl"
      >
        {text}
        <span className="ml-2">→</span>
      </a>
    </div>
  );
};

export default WhiteButton;
