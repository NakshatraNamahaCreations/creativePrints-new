import { FaEdit, FaCopy, FaTrash, FaUserTie } from "react-icons/fa";
import ProjectImageCarousel from "../../components/ProjectImageCarousel";

const MyProjects = () => {
  const projects = [
    {
      name: "Soft Coasters",
      edited: "9 hours ago",
      productName: "Soft Coasters",
      deliverySpeed: "Standard",
      id: "f8f33dc9-7d26-4e23-a2b8-b5c9da46133",
      created: "28 August 2025",
      images: [
        "https://i.pinimg.com/736x/98/aa/a9/98aaa9f7fb6f1bb870c31df097eefef2.jpg",
        "https://i.pinimg.com/736x/26/84/e7/2684e78ec374a7adde58e191e3980fbb.jpg",
        "https://i.pinimg.com/736x/fe/f0/ca/fef0ca668799471d75e23436b6a1c9e6.jpg",
      ],
      price: "4 starting at ₹220.00",
    },
    {
      name: "Classic Visiting Cards",
      edited: "22 Aug",
      productName: "Visiting Cards",
      deliverySpeed: "Express",
      id: "abc123",
      created: "22 August 2025",
      images: [
        "https://i.pinimg.com/736x/10/1f/39/101f391a03945446866a6858f11b5abc.jpg",
        "https://i.pinimg.com/736x/98/aa/a9/98aaa9f7fb6f1bb870c31df097eefef2.jpg",
      ],
      price: "100 starting at ₹200.00",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <h2 className="font-semibold text-lg">My Projects</h2>
        </div>

        <div className="divide-y">
          {projects.map((project, idx) => (
            <div
              key={idx}
              className="flex flex-col md:flex-row items-start md:items-center p-6 gap-6 hover:bg-gray-50 transition"
            >
              {/* Carousel Thumbnail */}
              <ProjectImageCarousel images={project.images} />

              {/* Details */}
              <div className="flex-1 space-y-1">
                <h3 className="font-medium text-gray-900 flex items-center gap-2">
                  {project.name}
                  <button className="text-gray-500 hover:text-gray-700 text-sm">
                    <FaEdit />
                  </button>
                </h3>
                <p className="text-sm text-gray-500">Edited {project.edited}</p>
                <p className="text-sm text-gray-600">
                  <b>Product Name:</b> {project.productName}
                </p>
                <p className="text-sm text-gray-600">
                  <b>Delivery Speed:</b> {project.deliverySpeed}
                </p>
                <p className="text-xs text-gray-500">
                  Identification #: {project.id}
                </p>
                <p className="text-xs text-gray-500">
                  Created on: {project.created}
                </p>
                <button className="mt-2 bg-blue-100 hover:bg-blue-200 text-blue-800 px-3 py-1.5 rounded-md text-sm">
                  Add to cart
                </button>
                <p className="text-sm font-medium text-gray-700 mt-1">
                  {project.price}
                </p>
              </div>

              {/* Actions */}
              <div className="flex flex-row md:flex-col gap-3 mt-4 md:mt-0">
                <button className="text-gray-700 hover:text-black text-sm flex items-center gap-1">
                  <FaEdit /> Edit
                </button>
                <button className="text-gray-700 hover:text-black text-sm flex items-center gap-1">
                  <FaCopy /> Copy
                </button>
                <button className="text-gray-700 hover:text-black text-sm flex items-center gap-1">
                  <FaTrash /> Delete
                </button>
                <button className="text-gray-700 hover:text-black text-sm flex items-center gap-1">
                  <FaUserTie /> Work with a designer
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MyProjects;
