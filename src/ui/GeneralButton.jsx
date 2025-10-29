import React from "react";

const GeneralButton = ({
  onClick,
  buttonText = "Click Me",
  bgcolor = "blue-800",
  textColor = "white",
  roundedClass = "rounded-sm",
  paddingY=2,
  paddingX = 6
}) => {
  return (
    <div>
      <button
        onClick={onClick}
        className={`cursor-pointer border border-${bgcolor} text-${textColor} bg-${bgcolor} font-medium py-${paddingY} px-${paddingX} ${roundedClass} transition duration-300`}
      >
        {buttonText}
      </button>
    </div>
  );
};

export default GeneralButton;
