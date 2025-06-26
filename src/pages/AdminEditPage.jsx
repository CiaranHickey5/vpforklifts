import React from 'react';
import { useApp } from '../context/AppContext';

const AdminEditPage = () => {
  const { editingForklift, setEditingForklift, handleSaveForklift, setIsEditing, setEditingForklift: setEditingNull, setCurrentPage } = useApp();
  
  return (
    <div className="py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold mb-8">{editingForklift?.id ? 'Edit Forklift' : 'Add New Forklift'}</h1>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">SKU</label>
              <input 
                type="text"
                value={editingForklift?.sku || ''}
                onChange={(e) => setEditingForklift({...editingForklift, sku: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Model</label>
              <input 
                type="text"
                value={editingForklift?.model || ''}
                onChange={(e) => setEditingForklift({...editingForklift, model: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Brand</label>
              <select 
                value={editingForklift?.brand || 'Toyota'}
                onChange={(e) => setEditingForklift({...editingForklift, brand: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="Toyota">Toyota</option>
                <option value="Doosan">Doosan</option>
                <option value="Hyster">Hyster</option>
                <option value="Caterpillar">Caterpillar</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Price (€)</label>
              <input 
                type="number"
                value={editingForklift?.price || 0}
                onChange={(e) => setEditingForklift({...editingForklift, price: parseInt(e.target.value) || 0})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea 
                value={editingForklift?.description || ''}
                onChange={(e) => setEditingForklift({...editingForklift, description: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                rows="3"
              />
            </div>
            <div className="flex gap-4">
              <button 
                onClick={() => handleSaveForklift(editingForklift)}
                className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
              >
                Save
              </button>
              <button 
                onClick={() => {setIsEditing(false); setEditingNull(null); setCurrentPage('admin');}}
                className="bg-gray-300 text-gray-700 px-6 py-2 rounded-md hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminEditPage;