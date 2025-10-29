import React from "react";

const FeaturesCard = ({ icon, color, title, description, features }) => {
  return (
    <div
      className={`bg-gradient-to-br from-${color}-50 to-white p-8 rounded-2xl shadow-sm hover:shadow-md transition duration-300`}
    >
      <div className="flex items-start mb-6">
        <div className={`bg-${color}-100 p-3 rounded-lg mr-4`}>{icon}</div>
        <div>
          <h3 className="text-2xl font-bold text-gray-800 mb-2">{title}</h3>
          <p className="text-gray-600">{description}</p>
        </div>
      </div>
      <div className="mt-6">
        <div className="flex space-x-2">
          {features &&
            features.map((feature, index) => (
              <div key={index} className="mt-2">
                <span
                  className={`bg-${color}-100 text-${color}-800 text-sm font-medium px-3 py-1 rounded-full`}
                >
                  {feature}
                </span>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default FeaturesCard;
