import React from 'react';
import { useApp } from '../../context/AppContext';

const DeleteConfirmModal = () => {
  const { handleDeleteForklift, setShowDeleteConfirm, setDeleteId, deleteId } = useApp();
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-md w-full">
        <h2 className="text-2xl font-bold mb-4">Confirm Delete</h2>
        <p className="text-gray-700 mb-6">Are you sure you want to delete this forklift?</p>
        <div className="flex gap-4">
          <button 
            onClick={() => handleDeleteForklift(deleteId)}
            className="flex-1 bg-red-600 text-white py-2 rounded-md hover:bg-red-700 transition-colors"
          >
            Delete
          </button>
          <button 
            onClick={() => {setShowDeleteConfirm(false); setDeleteId(null);}}
            className="flex-1 bg-gray-200 text-gray-800 py-2 rounded-md hover:bg-gray-300 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmModal;