import React, { useState } from "react";
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Button,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Chip,
  Stack,
  Avatar,
  Alert,
  TextField,
  InputAdornment,
  Menu,
  MenuItem,
  Tooltip,
} from "@mui/material";
import {
  Add,
  Edit,
  Delete,
  Search,
  MoreVert,
  TrendingUp,
  Inventory,
  Star,
  Business,
} from "@mui/icons-material";
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
    error,
    clearError,
  } = useApp();

  const [searchTerm, setSearchTerm] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedForklift, setSelectedForklift] = useState(null);

  // Filter forklifts based on search
  const filteredForklifts = forklifts.filter(
    (forklift) =>
      forklift.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
      forklift.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
      forklift.sku.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculate stats
  const stats = {
    total: forklifts.length,
    toyota: forklifts.filter((f) => f.brand === "Toyota").length,
    doosan: forklifts.filter((f) => f.brand === "Doosan").length,
    featured: forklifts.filter((f) => f.featured).length,
    totalValue: forklifts.reduce((sum, f) => sum + f.price, 0),
  };

  const handleMenuClick = (event, forklift) => {
    setAnchorEl(event.currentTarget);
    setSelectedForklift(forklift);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedForklift(null);
  };

  const handleEdit = () => {
    setEditingForklift(selectedForklift);
    setIsEditing(true);
    setCurrentPage("admin-edit");
    handleMenuClose();
  };

  const handleDelete = () => {
    setDeleteId(selectedForklift.id);
    setShowDeleteConfirm(true);
    handleMenuClose();
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          sx={{ mb: 3 }}
        >
          <Box>
            <Typography variant="h3" sx={{ fontWeight: "bold", mb: 1 }}>
              Admin Dashboard
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Manage your forklift inventory and listings
            </Typography>
          </Box>

          <Button
            onClick={handleCreateForklift}
            variant="contained"
            size="large"
            startIcon={<Add />}
            sx={{ px: 4 }}
          >
            Add New Forklift
          </Button>
        </Stack>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }} onClose={clearError}>
            {error}
          </Alert>
        )}
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ bgcolor: "primary.50" }}>
            <CardContent>
              <Stack direction="row" alignItems="center" spacing={2}>
                <Avatar sx={{ bgcolor: "primary.main" }}>
                  <Inventory />
                </Avatar>
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: "bold" }}>
                    {stats.total}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Forklifts
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ bgcolor: "success.50" }}>
            <CardContent>
              <Stack direction="row" alignItems="center" spacing={2}>
                <Avatar sx={{ bgcolor: "success.main" }}>
                  <Business />
                </Avatar>
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: "bold" }}>
                    {stats.toyota}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Toyota Models
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ bgcolor: "warning.50" }}>
            <CardContent>
              <Stack direction="row" alignItems="center" spacing={2}>
                <Avatar sx={{ bgcolor: "warning.main" }}>
                  <Star />
                </Avatar>
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: "bold" }}>
                    {stats.featured}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Featured Products
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ bgcolor: "info.50" }}>
            <CardContent>
              <Stack direction="row" alignItems="center" spacing={2}>
                <Avatar sx={{ bgcolor: "info.main" }}>
                  <TrendingUp />
                </Avatar>
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: "bold" }}>
                    €{stats.totalValue.toLocaleString()}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Inventory Value
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Forklift Management */}
      <Card>
        <CardContent sx={{ p: 0 }}>
          {/* Search Header */}
          <Box sx={{ p: 3, borderBottom: 1, borderColor: "divider" }}>
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              spacing={2}
            >
              <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                Forklift Inventory ({filteredForklifts.length})
              </Typography>

              <TextField
                placeholder="Search forklifts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                size="small"
                sx={{ width: 300 }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search />
                    </InputAdornment>
                  ),
                }}
              />
            </Stack>
          </Box>

          {/* Table */}
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Product</TableCell>
                  <TableCell>Brand</TableCell>
                  <TableCell>Capacity</TableCell>
                  <TableCell>Price</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredForklifts.map((forklift) => (
                  <TableRow
                    key={forklift.id}
                    sx={{ "&:hover": { bgcolor: "grey.50" } }}
                  >
                    <TableCell>
                      <Stack direction="row" spacing={2} alignItems="center">
                        <Box
                          component="img"
                          src={forklift.image}
                          alt={forklift.model}
                          sx={{
                            width: 60,
                            height: 60,
                            borderRadius: 1,
                            objectFit: "cover",
                          }}
                        />
                        <Box>
                          <Typography
                            variant="subtitle1"
                            sx={{ fontWeight: "medium" }}
                          >
                            {forklift.model}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            SKU: {forklift.sku}
                          </Typography>
                          {forklift.featured && (
                            <Chip
                              label="Featured"
                              size="small"
                              color="warning"
                              sx={{ ml: 1 }}
                            />
                          )}
                        </Box>
                      </Stack>
                    </TableCell>

                    <TableCell>
                      <Chip label={forklift.brand} variant="outlined" />
                    </TableCell>

                    <TableCell>{forklift.capacity}</TableCell>

                    <TableCell>
                      <Typography
                        variant="subtitle2"
                        sx={{ fontWeight: "bold" }}
                      >
                        {forklift.priceFormatted}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {forklift.hirePrice}
                      </Typography>
                    </TableCell>

                    <TableCell>
                      <Chip
                        label={forklift.status}
                        color={
                          forklift.status === "In Stock" ? "success" : "default"
                        }
                        size="small"
                      />
                    </TableCell>

                    <TableCell align="center">
                      <Stack
                        direction="row"
                        spacing={1}
                        justifyContent="center"
                      >
                        <Tooltip title="Edit">
                          <IconButton
                            onClick={() => {
                              setEditingForklift(forklift);
                              setIsEditing(true);
                              setCurrentPage("admin-edit");
                            }}
                            color="primary"
                            size="small"
                          >
                            <Edit />
                          </IconButton>
                        </Tooltip>

                        <Tooltip title="Delete">
                          <IconButton
                            onClick={() => {
                              setDeleteId(forklift.id);
                              setShowDeleteConfirm(true);
                            }}
                            color="error"
                            size="small"
                          >
                            <Delete />
                          </IconButton>
                        </Tooltip>

                        <Tooltip title="More options">
                          <IconButton
                            onClick={(e) => handleMenuClick(e, forklift)}
                            size="small"
                          >
                            <MoreVert />
                          </IconButton>
                        </Tooltip>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Empty State */}
          {filteredForklifts.length === 0 && (
            <Box sx={{ textAlign: "center", py: 8 }}>
              <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
                {searchTerm
                  ? "No forklifts match your search"
                  : "No forklifts found"}
              </Typography>
              {!searchTerm && (
                <Button
                  onClick={handleCreateForklift}
                  variant="contained"
                  startIcon={<Add />}
                >
                  Add Your First Forklift
                </Button>
              )}
            </Box>
          )}
        </CardContent>
      </Card>

      {/* Action Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleEdit}>
          <Edit sx={{ mr: 1 }} />
          Edit
        </MenuItem>
        <MenuItem onClick={handleDelete} sx={{ color: "error.main" }}>
          <Delete sx={{ mr: 1 }} />
          Delete
        </MenuItem>
      </Menu>
    </Container>
  );
};

export default AdminPage;
