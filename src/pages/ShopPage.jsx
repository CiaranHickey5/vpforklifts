import React from 'react';
import { useApp } from '../context/AppContext';
import ProductGrid from '../components/shop/ProductGrid';
import ProductDetail from '../components/shop/ProductDetail';

const ShopPage = () => {
  const { selectedForklift } = useApp();
  
  return (
    <div className="py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold mb-8">All Products</h1>
        
        {selectedForklift ? (
          <ProductDetail />
        ) : (
          <ProductGrid />
        )}
      </div>
    </div>
  );
};

export default ShopPage;