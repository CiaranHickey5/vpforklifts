import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel,
  Chip,
  Stack,
  Alert,
  Divider,
  IconButton,
  Paper,
  InputAdornment,
  CircularProgress,
} from "@mui/material";
import {
  ArrowBack,
  Save,
  Add,
  Delete,
  Euro,
  Image as ImageIcon,
  Info,
} from "@mui/icons-material";
import { useApp } from "../context/AppContext";

const AdminEditPage = () => {
  const {
    editingForklift,
    setEditingForklift,
    handleSaveForklift,
    setIsEditing,
    setCurrentPage,
    loading,
    error,
    clearError,
  } = useApp();

  const [localForklift, setLocalForklift] = useState(editingForklift || {});
  const [validationErrors, setValidationErrors] = useState({});
  const [newFeature, setNewFeature] = useState("");
  const [newSpecKey, setNewSpecKey] = useState("");
  const [newSpecValue, setNewSpecValue] = useState("");

  useEffect(() => {
    if (editingForklift) {
      setLocalForklift(editingForklift);
    }
  }, [editingForklift]);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => clearError(), 5000);
      return () => clearTimeout(timer);
    }
  }, [error, clearError]);

  const validateForm = () => {
    const errors = {};

    if (!localForklift.sku?.trim()) {
      errors.sku = "SKU is required";
    }

    if (!localForklift.model?.trim()) {
      errors.model = "Model is required";
    }

    if (!localForklift.brand) {
      errors.brand = "Brand is required";
    }

    if (!localForklift.capacity?.trim()) {
      errors.capacity = "Capacity is required";
    }

    if (!localForklift.lift?.trim()) {
      errors.lift = "Lift height is required";
    }

    if (!localForklift.price || localForklift.price <= 0) {
      errors.price = "Valid price is required";
    }

    if (!localForklift.hirePrice?.trim()) {
      errors.hirePrice = "Hire price is required";
    }

    if (!localForklift.description?.trim()) {
      errors.description = "Description is required";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (field, value) => {
    setLocalForklift((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Clear validation error for this field
    if (validationErrors[field]) {
      setValidationErrors((prev) => ({
        ...prev,
        [field]: undefined,
      }));
    }
  };

  const handleSave = () => {
    if (validateForm()) {
      handleSaveForklift(localForklift);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditingForklift(null);
    setCurrentPage("admin");
  };

  const addFeature = () => {
    if (newFeature.trim()) {
      const features = localForklift.features || [];
      setLocalForklift((prev) => ({
        ...prev,
        features: [...features, newFeature.trim()],
      }));
      setNewFeature("");
    }
  };

  const removeFeature = (index) => {
    const features = localForklift.features || [];
    setLocalForklift((prev) => ({
      ...prev,
      features: features.filter((_, i) => i !== index),
    }));
  };

  const addSpec = () => {
    if (newSpecKey.trim() && newSpecValue.trim()) {
      const specs = localForklift.specs || {};
      setLocalForklift((prev) => ({
        ...prev,
        specs: {
          ...specs,
          [newSpecKey.trim()]: newSpecValue.trim(),
        },
      }));
      setNewSpecKey("");
      setNewSpecValue("");
    }
  };

  const removeSpec = (key) => {
    const specs = localForklift.specs || {};
    const newSpecs = { ...specs };
    delete newSpecs[key];
    setLocalForklift((prev) => ({
      ...prev,
      specs: newSpecs,
    }));
  };

  const isNewForklift = !editingForklift?.id;

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Button onClick={handleCancel} startIcon={<ArrowBack />} sx={{ mb: 2 }}>
          Back to Admin
        </Button>

        <Typography variant="h3" sx={{ fontWeight: "bold", mb: 1 }}>
          {isNewForklift ? "Add New Forklift" : "Edit Forklift"}
        </Typography>

        <Typography variant="body1" color="text.secondary">
          {isNewForklift
            ? "Create a new forklift listing"
            : "Update forklift information"}
        </Typography>
      </Box>

      {/* Error Alert */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={clearError}>
          {error}
        </Alert>
      )}

      <Grid container spacing={4}>
        {/* Main Form */}
        <Grid item xs={12} lg={8}>
          <Stack spacing={4}>
            {/* Basic Information */}
            <Card>
              <CardContent sx={{ p: 4 }}>
                <Typography variant="h5" sx={{ mb: 3, fontWeight: "bold" }}>
                  Basic Information
                </Typography>

                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="SKU *"
                      fullWidth
                      value={localForklift.sku || ""}
                      onChange={(e) => handleInputChange("sku", e.target.value)}
                      error={!!validationErrors.sku}
                      helperText={validationErrors.sku}
                      placeholder="e.g., TOY-3WE-001"
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth error={!!validationErrors.brand}>
                      <InputLabel>Brand *</InputLabel>
                      <Select
                        value={localForklift.brand || "Toyota"}
                        label="Brand *"
                        onChange={(e) =>
                          handleInputChange("brand", e.target.value)
                        }
                      >
                        <MenuItem value="Toyota">Toyota</MenuItem>
                        <MenuItem value="Doosan">Doosan</MenuItem>
                        <MenuItem value="Hyster">Hyster</MenuItem>
                        <MenuItem value="Caterpillar">Caterpillar</MenuItem>
                        <MenuItem value="Linde">Linde</MenuItem>
                        <MenuItem value="Still">Still</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      label="Model *"
                      fullWidth
                      value={localForklift.model || ""}
                      onChange={(e) =>
                        handleInputChange("model", e.target.value)
                      }
                      error={!!validationErrors.model}
                      helperText={validationErrors.model}
                      placeholder="e.g., 3-Wheel Electric Forklift"
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth>
                      <InputLabel>Type</InputLabel>
                      <Select
                        value={localForklift.type || "Electric"}
                        label="Type"
                        onChange={(e) =>
                          handleInputChange("type", e.target.value)
                        }
                      >
                        <MenuItem value="Electric">Electric</MenuItem>
                        <MenuItem value="Diesel">Diesel</MenuItem>
                        <MenuItem value="Gas">Gas</MenuItem>
                        <MenuItem value="Hybrid">Hybrid</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth>
                      <InputLabel>Status</InputLabel>
                      <Select
                        value={localForklift.status || "In Stock"}
                        label="Status"
                        onChange={(e) =>
                          handleInputChange("status", e.target.value)
                        }
                      >
                        <MenuItem value="In Stock">In Stock</MenuItem>
                        <MenuItem value="Coming Soon">Coming Soon</MenuItem>
                        <MenuItem value="Sold">Sold</MenuItem>
                        <MenuItem value="On Hire">On Hire</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      label="Description *"
                      multiline
                      rows={4}
                      fullWidth
                      value={localForklift.description || ""}
                      onChange={(e) =>
                        handleInputChange("description", e.target.value)
                      }
                      error={!!validationErrors.description}
                      helperText={validationErrors.description}
                      placeholder="Describe the forklift's key features and benefits..."
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>

            {/* Specifications */}
            <Card>
              <CardContent sx={{ p: 4 }}>
                <Typography variant="h5" sx={{ mb: 3, fontWeight: "bold" }}>
                  Specifications
                </Typography>

                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Capacity *"
                      fullWidth
                      value={localForklift.capacity || ""}
                      onChange={(e) =>
                        handleInputChange("capacity", e.target.value)
                      }
                      error={!!validationErrors.capacity}
                      helperText={validationErrors.capacity}
                      placeholder="e.g., 1,500-2,000 kg"
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Lift Height *"
                      fullWidth
                      value={localForklift.lift || ""}
                      onChange={(e) =>
                        handleInputChange("lift", e.target.value)
                      }
                      error={!!validationErrors.lift}
                      helperText={validationErrors.lift}
                      placeholder="e.g., Up to 6,000 mm"
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Price (€) *"
                      type="number"
                      fullWidth
                      value={localForklift.price || ""}
                      onChange={(e) =>
                        handleInputChange(
                          "price",
                          parseInt(e.target.value) || 0
                        )
                      }
                      error={!!validationErrors.price}
                      helperText={validationErrors.price}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Euro />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Hire Price *"
                      fullWidth
                      value={localForklift.hirePrice || ""}
                      onChange={(e) =>
                        handleInputChange("hirePrice", e.target.value)
                      }
                      error={!!validationErrors.hirePrice}
                      helperText={validationErrors.hirePrice}
                      placeholder="e.g., €180/week"
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      label="Image URL"
                      fullWidth
                      value={localForklift.image || ""}
                      onChange={(e) =>
                        handleInputChange("image", e.target.value)
                      }
                      placeholder="https://example.com/image.jpg"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <ImageIcon />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>

            {/* Features */}
            <Card>
              <CardContent sx={{ p: 4 }}>
                <Typography variant="h5" sx={{ mb: 3, fontWeight: "bold" }}>
                  Features
                </Typography>

                <Box sx={{ mb: 3 }}>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <TextField
                      label="Add Feature"
                      value={newFeature}
                      onChange={(e) => setNewFeature(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && addFeature()}
                      size="small"
                      sx={{ flexGrow: 1 }}
                    />
                    <Button
                      onClick={addFeature}
                      variant="outlined"
                      startIcon={<Add />}
                      disabled={!newFeature.trim()}
                    >
                      Add
                    </Button>
                  </Stack>
                </Box>

                <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                  {(localForklift.features || []).map((feature, index) => (
                    <Chip
                      key={index}
                      label={feature}
                      onDelete={() => removeFeature(index)}
                      color="primary"
                      variant="outlined"
                    />
                  ))}
                </Stack>
              </CardContent>
            </Card>

            {/* Additional Specs */}
            <Card>
              <CardContent sx={{ p: 4 }}>
                <Typography variant="h5" sx={{ mb: 3, fontWeight: "bold" }}>
                  Additional Specifications
                </Typography>

                <Box sx={{ mb: 3 }}>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <TextField
                      label="Specification Name"
                      value={newSpecKey}
                      onChange={(e) => setNewSpecKey(e.target.value)}
                      size="small"
                      sx={{ flex: 1 }}
                    />
                    <TextField
                      label="Value"
                      value={newSpecValue}
                      onChange={(e) => setNewSpecValue(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && addSpec()}
                      size="small"
                      sx={{ flex: 1 }}
                    />
                    <Button
                      onClick={addSpec}
                      variant="outlined"
                      startIcon={<Add />}
                      disabled={!newSpecKey.trim() || !newSpecValue.trim()}
                    >
                      Add
                    </Button>
                  </Stack>
                </Box>

                <Stack spacing={2}>
                  {Object.entries(localForklift.specs || {}).map(
                    ([key, value]) => (
                      <Paper key={key} variant="outlined" sx={{ p: 2 }}>
                        <Stack
                          direction="row"
                          alignItems="center"
                          justifyContent="space-between"
                        >
                          <Box>
                            <Typography
                              variant="subtitle2"
                              color="text.secondary"
                            >
                              {key}
                            </Typography>
                            <Typography
                              variant="body1"
                              sx={{ fontWeight: "medium" }}
                            >
                              {value}
                            </Typography>
                          </Box>
                          <IconButton
                            onClick={() => removeSpec(key)}
                            color="error"
                            size="small"
                          >
                            <Delete />
                          </IconButton>
                        </Stack>
                      </Paper>
                    )
                  )}
                </Stack>
              </CardContent>
            </Card>
          </Stack>
        </Grid>

        {/* Sidebar */}
        <Grid item xs={12} lg={4}>
          <Stack spacing={3} sx={{ position: "sticky", top: 20 }}>
            {/* Quick Settings */}
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold" }}>
                  Settings
                </Typography>

                <FormControlLabel
                  control={
                    <Switch
                      checked={localForklift.featured || false}
                      onChange={(e) =>
                        handleInputChange("featured", e.target.checked)
                      }
                    />
                  }
                  label="Featured Product"
                />
              </CardContent>
            </Card>

            {/* Actions */}
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 3, fontWeight: "bold" }}>
                  Actions
                </Typography>

                <Stack spacing={2}>
                  <Button
                    onClick={handleSave}
                    variant="contained"
                    size="large"
                    startIcon={
                      loading ? <CircularProgress size={20} /> : <Save />
                    }
                    disabled={loading}
                    fullWidth
                  >
                    {loading ? "Saving..." : "Save Forklift"}
                  </Button>

                  <Button
                    onClick={handleCancel}
                    variant="outlined"
                    size="large"
                    fullWidth
                    disabled={loading}
                  >
                    Cancel
                  </Button>
                </Stack>
              </CardContent>
            </Card>

            {/* Help */}
            <Card sx={{ bgcolor: "info.50" }}>
              <CardContent>
                <Stack
                  direction="row"
                  spacing={1}
                  alignItems="center"
                  sx={{ mb: 2 }}
                >
                  <Info color="info" />
                  <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                    Tips
                  </Typography>
                </Stack>

                <Typography variant="body2" color="text.secondary">
                  • Use clear, descriptive model names
                  <br />
                  • Include all relevant features
                  <br />
                  • Ensure image URLs are accessible
                  <br />• Set competitive pricing
                </Typography>
              </CardContent>
            </Card>
          </Stack>
        </Grid>
      </Grid>
    </Container>
  );
};

export default AdminEditPage;
