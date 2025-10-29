import React from "react";

const OutlineButton = ({
  onClick,
  buttonText = "Click Me",
  colors = "bg-red-500",
  roundedClass = "rounded-sm",
}) => {
  return (
    <div>
      <button
        onClick={onClick}
        className={`cursor-pointer border border-${colors} text-${colors}  font-medium py-2 px-6 ${roundedClass} transition duration-300`}
      >
        {buttonText}
      </button>
    </div>
  );
};

export default OutlineButton;
