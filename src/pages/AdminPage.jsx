import React from "react";
import { Plus } from "lucide-react";
import { useApp } from "../context/AppContext";

const AdminPage = () => {
  const {
    forklifts,
    handleCreateForklift,
    setEditingForklift,
    setIsEditing,
    setCurrentPage,
    setDeleteId,
    setShowDeleteConfirm,
  } = useApp();

  return (
    <div className="py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <button
            onClick={handleCreateForklift}
            className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Add New Forklift
          </button>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-gray-600">Total Forklifts</p>
            <p className="text-2xl font-bold">{forklifts.length}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-gray-600">Toyota Models</p>
            <p className="text-2xl font-bold">
              {forklifts.filter((f) => f.brand === "Toyota").length}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-gray-600">Doosan Models</p>
            <p className="text-2xl font-bold">
              {forklifts.filter((f) => f.brand === "Doosan").length}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-gray-600">Featured</p>
            <p className="text-2xl font-bold">
              {forklifts.filter((f) => f.featured).length}
            </p>
          </div>
        </div>

        {/* Forklift Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Model
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Brand
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {forklifts.map((forklift) => (
                <tr key={forklift.id}>
                  <td className="px-6 py-4">{forklift.model}</td>
                  <td className="px-6 py-4">{forklift.brand}</td>
                  <td className="px-6 py-4">{forklift.priceFormatted}</td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => {
                        setEditingForklift(forklift);
                        setIsEditing(true);
                        setCurrentPage("admin-edit");
                      }}
                      className="text-blue-600 hover:text-blue-900 mr-3"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => {
                        setDeleteId(forklift.id);
                        setShowDeleteConfirm(true);
                      }}
                      className="text-red-600 hover:text-red-900"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
