import React from "react";
import { Container, Typography, Box } from "@mui/material";
import { useApp } from "../context/AppContext";
import ProductGrid from "../components/shop/ProductGrid";
import ProductDetail from "../components/shop/ProductDetail";

const ShopPage = () => {
  const { selectedForklift } = useApp();

  return (
    <Box sx={{ py: 4 }}>
      <Container maxWidth="xl">
        {!selectedForklift && (
          <Box sx={{ mb: 4, textAlign: "center" }}>
            <Typography variant="h2" sx={{ fontWeight: "bold", mb: 2 }}>
              All Products
            </Typography>
            <Typography variant="h6" color="text.secondary">
              Browse our complete range of new and refurbished forklifts
            </Typography>
          </Box>
        )}

        {selectedForklift ? <ProductDetail /> : <ProductGrid />}
      </Container>
    </Box>
  );
};

export default ShopPage;
