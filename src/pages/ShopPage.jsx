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
  Card,
  CardContent,
  Stack,
  Chip,
  Pagination,
  ToggleButton,
  ToggleButtonGroup,
  Skeleton,
  Fade,
  InputAdornment,
  Slider,
  Button,
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

  // Local state for filters
  const [searchTerm, setSearchTerm] = useState("");
  const [brandFilter, setBrandFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [sortBy, setSortBy] = useState("default");
  const [viewMode, setViewMode] = useState("grid");
  const [currentPage, setCurrentPage] = useState(1);
  const [priceRange, setPriceRange] = useState([0, 50000]);
  const [loading, setLoading] = useState(false);
  const itemsPerPage = 12;

  // Get unique values for filters
  const brands = [...new Set(forklifts.map((f) => f.brand))];
  const types = [...new Set(forklifts.map((f) => f.type))];
  const maxPrice = Math.max(...forklifts.map((f) => f.price));

  // Filter and sort logic
  const filteredAndSortedForklifts = useMemo(() => {
    let filtered = forklifts.filter((forklift) => {
      const matchesSearch =
        searchTerm === "" ||
        forklift.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
        forklift.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
        forklift.sku.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesBrand =
        brandFilter === "all" || forklift.brand === brandFilter;
      const matchesType = typeFilter === "all" || forklift.type === typeFilter;
      const matchesPrice =
        forklift.price >= priceRange[0] && forklift.price <= priceRange[1];

      return matchesSearch && matchesBrand && matchesType && matchesPrice;
    });

    // Sort
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
        // Keep original order
        break;
    }

    return filtered;
  }, [forklifts, searchTerm, brandFilter, typeFilter, sortBy, priceRange]);

  // Pagination
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
    searchTerm !== "" ||
    brandFilter !== "all" ||
    typeFilter !== "all" ||
    priceRange[0] !== 0 ||
    priceRange[1] !== maxPrice;

  if (selectedForklift) {
    return <ProductDetail />;
  }

  return (
    <Box sx={{ py: 4 }}>
      <Container maxWidth="xl">
        {/* Header */}
        <Box sx={{ mb: 6, textAlign: "center" }}>
          <Typography variant="h2" sx={{ fontWeight: "bold", mb: 2 }}>
            Our Forklift Collection
          </Typography>
          <Typography variant="h6" color="text.secondary">
            Browse our complete range of new and refurbished forklifts
          </Typography>
          <Chip
            label={`${filteredAndSortedForklifts.length} products available`}
            color="primary"
            sx={{ mt: 2 }}
          />
        </Box>

        <Grid container spacing={4}>
          {/* Filters Sidebar */}
          <Grid item xs={12} lg={3}>
            <Card sx={{ position: "sticky", top: 20 }}>
              <CardContent>
                <Stack spacing={3}>
                  <Box>
                    <Stack
                      direction="row"
                      alignItems="center"
                      justifyContent="space-between"
                      sx={{ mb: 2 }}
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
                    </Stack>
                  </Box>

                  {/* Search */}
                  <TextField
                    label="Search products"
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

                  {/* Brand Filter */}
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

                  {/* Type Filter */}
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

                  {/* Price Range */}
                  <Box>
                    <Typography variant="subtitle1" sx={{ mb: 2 }}>
                      Price Range: €{priceRange[0].toLocaleString()} - €
                      {priceRange[1].toLocaleString()}
                    </Typography>
                    <Slider
                      value={priceRange}
                      onChange={(e, newValue) => setPriceRange(newValue)}
                      valueLabelDisplay="auto"
                      min={0}
                      max={maxPrice}
                      step={1000}
                      valueLabelFormat={(value) => `€${value.toLocaleString()}`}
                    />
                  </Box>

                  {/* Sort */}
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
              </CardContent>
            </Card>
          </Grid>

          {/* Products Grid */}
          <Grid item xs={12} lg={9}>
            {/* Results Header */}
            <Box
              sx={{
                mb: 3,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: 2,
              }}
            >
              <Typography variant="h6">
                {filteredAndSortedForklifts.length} results
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

            {/* Loading State */}
            {loading ? (
              <Grid container spacing={3}>
                {Array.from(new Array(6)).map((_, index) => (
                  <Grid item xs={12} sm={6} lg={4} key={index}>
                    <Card>
                      <Skeleton variant="rectangular" height={200} />
                      <CardContent>
                        <Skeleton variant="text" height={32} />
                        <Skeleton variant="text" height={24} />
                        <Skeleton variant="text" height={48} />
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            ) : (
              <Fade in={!loading} timeout={300}>
                <Box>
                  {/* Products Grid */}
                  <Grid container spacing={3}>
                    {paginatedForklifts.map((forklift) => (
                      <Grid
                        item
                        xs={12}
                        sm={viewMode === "list" ? 12 : 6}
                        lg={viewMode === "list" ? 12 : 4}
                        key={forklift.id}
                      >
                        <ProductCard forklift={forklift} />
                      </Grid>
                    ))}
                  </Grid>

                  {/* No Results */}
                  {filteredAndSortedForklifts.length === 0 && (
                    <Box sx={{ textAlign: "center", py: 8 }}>
                      <Typography
                        variant="h6"
                        color="text.secondary"
                        sx={{ mb: 2 }}
                      >
                        No products found matching your criteria
                      </Typography>
                      <Button onClick={clearFilters} variant="outlined">
                        Clear Filters
                      </Button>
                    </Box>
                  )}

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <Box
                      sx={{ mt: 6, display: "flex", justifyContent: "center" }}
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
            )}
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default ShopPage;
