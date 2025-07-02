import React, { useState, useMemo } from "react";
import {
  Container,
  Typography,
  Box,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper,
  Stack,
  Button,
  InputAdornment,
  Slider,
  ToggleButton,
  ToggleButtonGroup,
  Pagination,
  Fade,
  Divider,
} from "@mui/material";
import {
  Search,
  GridView,
  ViewList,
  FilterList,
  Clear,
} from "@mui/icons-material";
import { useApp } from "../context/AppContext";
import ProductCard from "../components/shop/ProductCard";
import ProductDetail from "../components/shop/ProductDetail";

const ShopPage = () => {
  const { selectedForklift, forklifts } = useApp();

  const [searchTerm, setSearchTerm] = useState("");
  const [brandFilter, setBrandFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [sortBy, setSortBy] = useState("default");
  const [viewMode, setViewMode] = useState("grid");
  const [currentPage, setCurrentPage] = useState(1);
  const [priceRange, setPriceRange] = useState([0, 50000]);
  const itemsPerPage = 12;

  const brands = [...new Set(forklifts.map((f) => f.brand))];
  const types = [...new Set(forklifts.map((f) => f.type))];
  const maxPrice = Math.max(...forklifts.map((f) => f.price), 50000);

  const filteredAndSortedForklifts = useMemo(() => {
    let filtered = forklifts.filter((f) => {
      const matchesSearch =
        searchTerm === "" ||
        f.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
        f.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
        f.sku.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesBrand = brandFilter === "all" || f.brand === brandFilter;
      const matchesType = typeFilter === "all" || f.type === typeFilter;
      const matchesPrice = f.price >= priceRange[0] && f.price <= priceRange[1];

      return matchesSearch && matchesBrand && matchesType && matchesPrice;
    });

    switch (sortBy) {
      case "name":
        filtered.sort((a, b) => a.model.localeCompare(b.model));
        break;
      case "price-low":
        filtered.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        filtered.sort((a, b) => b.price - a.price);
        break;
      case "featured":
        filtered.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
        break;
      default:
        break;
    }
    return filtered;
  }, [forklifts, searchTerm, brandFilter, typeFilter, sortBy, priceRange]);

  const totalPages = Math.ceil(
    filteredAndSortedForklifts.length / itemsPerPage
  );
  const paginatedForklifts = filteredAndSortedForklifts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const clearFilters = () => {
    setSearchTerm("");
    setBrandFilter("all");
    setTypeFilter("all");
    setSortBy("default");
    setPriceRange([0, maxPrice]);
    setCurrentPage(1);
  };

  const hasActiveFilters =
    searchTerm ||
    brandFilter !== "all" ||
    typeFilter !== "all" ||
    priceRange[0] !== 0 ||
    priceRange[1] !== maxPrice;

  if (selectedForklift) {
    return <ProductDetail />;
  }

  return (
    <Box sx={{ py: 4, bgcolor: "grey.50", minHeight: "100vh" }}>
      <Container maxWidth="xl">
        <Box sx={{ mb: 5, textAlign: "center" }}>
          <Typography variant="h3" color="primary.main" gutterBottom>
            Our Forklift Collection
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Browse our range of new and refurbished forklifts
          </Typography>
          <Typography
            variant="caption"
            sx={{ mt: 1, display: "block", color: "text.secondary" }}
          >
            {filteredAndSortedForklifts.length} products available
          </Typography>
        </Box>

        <Grid container spacing={4}>
          {/* Sidebar Filters */}
          <Grid item xs={12} md={4} lg={3}>
            <Paper elevation={2} sx={{ p: 3 }}>
              <Stack spacing={3}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Typography
                    variant="h6"
                    sx={{ display: "flex", alignItems: "center", gap: 1 }}
                  >
                    <FilterList /> Filters
                  </Typography>
                  {hasActiveFilters && (
                    <Button
                      onClick={clearFilters}
                      size="small"
                      startIcon={<Clear />}
                      color="secondary"
                    >
                      Clear
                    </Button>
                  )}
                </Box>

                <Divider />

                <TextField
                  label="Search"
                  variant="outlined"
                  fullWidth
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Search />
                      </InputAdornment>
                    ),
                  }}
                />

                <FormControl fullWidth>
                  <InputLabel>Brand</InputLabel>
                  <Select
                    value={brandFilter}
                    label="Brand"
                    onChange={(e) => setBrandFilter(e.target.value)}
                  >
                    <MenuItem value="all">All Brands</MenuItem>
                    {brands.map((brand) => (
                      <MenuItem key={brand} value={brand}>
                        {brand}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <FormControl fullWidth>
                  <InputLabel>Type</InputLabel>
                  <Select
                    value={typeFilter}
                    label="Type"
                    onChange={(e) => setTypeFilter(e.target.value)}
                  >
                    <MenuItem value="all">All Types</MenuItem>
                    {types.map((type) => (
                      <MenuItem key={type} value={type}>
                        {type}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <Box>
                  <Typography variant="subtitle2" sx={{ mb: 1 }}>
                    Price Range: €{priceRange[0]} - €{priceRange[1]}
                  </Typography>
                  <Slider
                    value={priceRange}
                    onChange={(e, newValue) => setPriceRange(newValue)}
                    valueLabelDisplay="auto"
                    min={0}
                    max={maxPrice}
                    step={1000}
                    valueLabelFormat={(value) => `€${value}`}
                  />
                </Box>

                <FormControl fullWidth>
                  <InputLabel>Sort By</InputLabel>
                  <Select
                    value={sortBy}
                    label="Sort By"
                    onChange={(e) => setSortBy(e.target.value)}
                  >
                    <MenuItem value="default">Default</MenuItem>
                    <MenuItem value="featured">Featured First</MenuItem>
                    <MenuItem value="name">Name A-Z</MenuItem>
                    <MenuItem value="price-low">Price: Low to High</MenuItem>
                    <MenuItem value="price-high">Price: High to Low</MenuItem>
                  </Select>
                </FormControl>
              </Stack>
            </Paper>
          </Grid>

          {/* Products Section */}
          <Grid item xs={12} md={8} lg={9}>
            <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  flexWrap: "wrap",
                  gap: 2,
                }}
              >
                <Typography variant="subtitle1">
                  {filteredAndSortedForklifts.length} Results
                  {hasActiveFilters && " (filtered)"}
                </Typography>

                <ToggleButtonGroup
                  value={viewMode}
                  exclusive
                  onChange={(e, newMode) => newMode && setViewMode(newMode)}
                  size="small"
                >
                  <ToggleButton value="grid">
                    <GridView />
                  </ToggleButton>
                  <ToggleButton value="list">
                    <ViewList />
                  </ToggleButton>
                </ToggleButtonGroup>
              </Box>
            </Paper>

            <Fade in timeout={300}>
              <Box>
                <Grid container spacing={3}>
                  {paginatedForklifts.map((forklift) => (
                    <Grid
                      item
                      xs={12}
                      sm={viewMode === "list" ? 12 : 6}
                      md={viewMode === "list" ? 12 : 4}
                      key={forklift.id}
                    >
                      <ProductCard forklift={forklift} />
                    </Grid>
                  ))}
                </Grid>

                {filteredAndSortedForklifts.length === 0 && (
                  <Box sx={{ textAlign: "center", py: 6 }}>
                    <Typography color="text.secondary" variant="body1">
                      No products found matching your criteria
                    </Typography>
                    <Button
                      onClick={clearFilters}
                      variant="outlined"
                      sx={{ mt: 2 }}
                    >
                      Clear Filters
                    </Button>
                  </Box>
                )}

                {totalPages > 1 && (
                  <Box
                    sx={{ mt: 4, display: "flex", justifyContent: "center" }}
                  >
                    <Pagination
                      count={totalPages}
                      page={currentPage}
                      onChange={(e, page) => {
                        setCurrentPage(page);
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }}
                      color="primary"
                      size="large"
                      showFirstButton
                      showLastButton
                    />
                  </Box>
                )}
              </Box>
            </Fade>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default ShopPage;
