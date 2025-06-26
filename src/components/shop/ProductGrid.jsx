import React from "react";
import { useApp } from "../../context/AppContext";
import ProductCard from "./ProductCard";

const ProductGrid = () => {
  const { paginatedForklifts } = useApp();

  return (
    <div className="grid md:grid-cols-3 gap-6">
      {paginatedForklifts.map((forklift) => (
        <ProductCard key={forklift.id} forklift={forklift} />
      ))}
    </div>
  );
};

export default ProductGrid;
