import React from "react";
import { Grid } from "@mui/material";
import { useApp } from "../../context/AppContext";
import ProductCard from "./ProductCard";

const ProductGrid = ({ forklifts }) => {
  // If no forklifts provided, get them from context (backward compatibility)
  const { forklifts: contextForklifts } = useApp();
  const forkliftList = forklifts || contextForklifts;

  return (
    <Grid container spacing={3}>
      {forkliftList.map((forklift) => (
        <Grid item xs={12} sm={6} lg={4} key={forklift.id}>
          <ProductCard forklift={forklift} />
        </Grid>
      ))}
    </Grid>
  );
};

export default ProductGrid;
