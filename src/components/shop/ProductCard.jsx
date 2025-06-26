import React from "react";
import { useApp } from "../../context/AppContext";

const ProductCard = ({ forklift }) => {
  const {
    setSelectedForklift,
    isAuthenticated,
    setEditingForklift,
    setIsEditing,
    setCurrentPage,
    setDeleteId,
    setShowDeleteConfirm,
  } = useApp();

  return (
    <div className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow">
      <img
        src={forklift.image}
        alt={forklift.model}
        className="w-full h-48 object-cover rounded-t-lg cursor-pointer"
        onClick={() => setSelectedForklift(forklift)}
      />
      <div className="p-4">
        <h3 className="font-bold text-lg mb-1">{forklift.model}</h3>
        <p className="text-sm text-gray-600 mb-2">
          {forklift.brand} • {forklift.type}
        </p>
        <p className="text-xl font-bold text-blue-600 mb-3">
          {forklift.priceFormatted}
        </p>
        <button
          onClick={() => setSelectedForklift(forklift)}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition-colors"
        >
          View Details
        </button>
        {isAuthenticated && (
          <div className="flex gap-2 mt-2">
            <button
              onClick={() => {
                setEditingForklift(forklift);
                setIsEditing(true);
                setCurrentPage("admin-edit");
              }}
              className="flex-1 bg-gray-600 text-white py-1 rounded hover:bg-gray-700 transition-colors text-sm"
            >
              Edit
            </button>
            <button
              onClick={() => {
                setDeleteId(forklift.id);
                setShowDeleteConfirm(true);
              }}
              className="flex-1 bg-red-600 text-white py-1 rounded hover:bg-red-700 transition-colors text-sm"
            >
              Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
