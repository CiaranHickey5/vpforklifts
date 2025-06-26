import React from "react";
import { ArrowLeft } from "lucide-react";
import { useApp } from "../../context/AppContext";

const ProductDetail = () => {
  const { selectedForklift, setSelectedForklift, navigateTo } = useApp();

  if (!selectedForklift) return null;

  return (
    <div>
      <button
        onClick={() => setSelectedForklift(null)}
        className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6"
      >
        <ArrowLeft className="w-5 h-5" />
        Back to products
      </button>

      <div className="grid lg:grid-cols-2 gap-12">
        <div>
          <img
            src={selectedForklift.image}
            alt={selectedForklift.model}
            className="w-full h-96 object-cover rounded-lg"
          />
        </div>

        <div>
          <h1 className="text-3xl font-bold mb-2">{selectedForklift.model}</h1>
          <p className="text-lg text-gray-600 mb-4">{selectedForklift.brand}</p>

          <div className="flex items-center gap-4 mb-6">
            <span className="text-3xl font-bold text-blue-600">
              {selectedForklift.priceFormatted}
            </span>
            <span className="text-gray-400">or</span>
            <span className="text-xl">
              Hire from {selectedForklift.hirePrice}
            </span>
          </div>

          <p className="text-gray-700 mb-6">{selectedForklift.description}</p>

          <div className="mb-6">
            <h3 className="font-bold mb-3">Key Features</h3>
            <ul className="list-disc list-inside text-gray-700">
              {selectedForklift.features.map((feature, idx) => (
                <li key={idx}>{feature}</li>
              ))}
            </ul>
          </div>

          <div className="flex gap-4">
            <button
              onClick={() => navigateTo("contact")}
              className="flex-1 bg-blue-600 text-white py-3 rounded-md font-semibold hover:bg-blue-700 transition-colors"
            >
              Request Quote
            </button>
            <a
              href="tel:+35351293208"
              className="flex-1 bg-gray-200 text-gray-900 py-3 rounded-md font-semibold hover:bg-gray-300 transition-colors text-center"
            >
              Call to Order
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
