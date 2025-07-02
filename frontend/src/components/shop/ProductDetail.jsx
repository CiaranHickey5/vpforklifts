import React from "react";
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  Chip,
  Stack,
  Avatar,
  Paper,
  Divider,
  Alert,
} from "@mui/material";
import {
  ArrowBack,
  Star,
  CheckCircle,
  Phone,
  Email,
  ElectricBolt,
  LocalShipping,
  Security,
  Support,
  Speed,
  Handyman,
} from "@mui/icons-material";
import { useApp } from "../../context/AppContext";

const ProductDetail = () => {
  const { selectedForklift, setSelectedForklift, navigateTo } = useApp();

  if (!selectedForklift) return null;

  const features = [
    { icon: <Speed />, text: "Fully Serviced" },
    { icon: <LocalShipping />, text: "Immediate Delivery" },
    { icon: <Support />, text: "24/7 Support" },
    { icon: <Security />, text: "Warranty Included" },
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Back Button */}
      <Button
        onClick={() => setSelectedForklift(null)}
        startIcon={<ArrowBack />}
        variant="outlined"
        sx={{ mb: 4 }}
      >
        Back to products
      </Button>

      <Grid container spacing={6}>
        {/* Image */}
        <Grid item xs={12} lg={6}>
          <Stack spacing={3}>
            <Paper elevation={2} sx={{ borderRadius: 2, overflow: "hidden" }}>
              <Box sx={{ position: "relative" }}>
                <Box
                  component="img"
                  src={selectedForklift.image}
                  alt={selectedForklift.model}
                  sx={{
                    width: "100%",
                    height: 400,
                    objectFit: "cover",
                  }}
                />

                <Chip
                  label={selectedForklift.status}
                  color="success"
                  size="small"
                  sx={{
                    position: "absolute",
                    top: 16,
                    left: 16,
                    fontWeight: "bold",
                  }}
                />

                {selectedForklift.featured && (
                  <Avatar
                    sx={{
                      bgcolor: "warning.main",
                      position: "absolute",
                      top: 16,
                      right: 16,
                      width: 36,
                      height: 36,
                      boxShadow: 2,
                    }}
                  >
                    <Star sx={{ color: "white", fontSize: 20 }} />
                  </Avatar>
                )}
              </Box>
            </Paper>

            {/* Trust / Reasons */}
            <Paper elevation={1}>
              <CardContent>
                <Typography
                  variant="h6"
                  fontWeight="bold"
                  gutterBottom
                  sx={{ display: "flex", alignItems: "center", gap: 1 }}
                >
                  <CheckCircle color="success" />
                  Why Choose This Forklift
                </Typography>

                <Divider sx={{ mb: 2 }} />

                <Grid container spacing={2}>
                  {features.map((feature, index) => (
                    <Grid item xs={12} sm={6} key={index}>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <Avatar
                          sx={{
                            bgcolor: "primary.main",
                            width: 28,
                            height: 28,
                          }}
                        >
                          {React.cloneElement(feature.icon, {
                            sx: { fontSize: 16, color: "white" },
                          })}
                        </Avatar>
                        <Typography variant="body2" color="text.secondary">
                          {feature.text}
                        </Typography>
                      </Stack>
                    </Grid>
                  ))}
                </Grid>
              </CardContent>
            </Paper>
          </Stack>
        </Grid>

        {/* Details */}
        <Grid item xs={12} lg={6}>
          <Stack spacing={4}>
            {/* Header */}
            <Box>
              <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
                <Chip
                  label={selectedForklift.brand}
                  variant="outlined"
                  size="small"
                />
                <Chip
                  icon={<ElectricBolt />}
                  label={selectedForklift.type}
                  color="primary"
                  size="small"
                />
                <Chip
                  label={`SKU: ${selectedForklift.sku}`}
                  variant="outlined"
                  size="small"
                />
              </Stack>

              <Typography variant="h4" fontWeight="bold" gutterBottom>
                {selectedForklift.model}
              </Typography>
            </Box>

            {/* Pricing */}
            <Paper elevation={1}>
              <CardContent>
                <Stack
                  direction="row"
                  alignItems="baseline"
                  spacing={2}
                  sx={{ mb: 2 }}
                >
                  <Typography
                    variant="h4"
                    fontWeight="bold"
                    color="primary.main"
                  >
                    {selectedForklift.priceFormatted}
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{
                      textDecoration: "line-through",
                      color: "text.secondary",
                    }}
                  >
                    €{Math.round(selectedForklift.price * 1.2).toLocaleString()}
                  </Typography>
                  <Chip
                    label={`Save €${Math.round(
                      selectedForklift.price * 0.2
                    ).toLocaleString()}`}
                    color="error"
                    size="small"
                  />
                </Stack>

                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ fontStyle: "italic" }}
                >
                  Or hire from €{selectedForklift.hirePrice} / week
                </Typography>
              </CardContent>
            </Paper>

            {/* Description */}
            <Paper elevation={1}>
              <CardContent>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  Description
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ lineHeight: 1.6 }}
                >
                  {selectedForklift.description}
                </Typography>
              </CardContent>
            </Paper>

            {/* Features */}
            <Paper elevation={1}>
              <CardContent>
                <Typography
                  variant="h6"
                  fontWeight="bold"
                  gutterBottom
                  sx={{ display: "flex", alignItems: "center", gap: 1 }}
                >
                  <Star color="warning" />
                  Key Features
                </Typography>
                <Divider sx={{ mb: 2 }} />

                <Grid container spacing={2}>
                  {selectedForklift.features.map((feature, index) => (
                    <Grid item xs={12} sm={6} key={index}>
                      <Stack
                        direction="row"
                        spacing={1}
                        alignItems="center"
                        sx={{
                          p: 1,
                          bgcolor: "grey.50",
                          borderRadius: 1,
                        }}
                      >
                        <CheckCircle color="primary" sx={{ fontSize: 20 }} />
                        <Typography variant="body2">{feature}</Typography>
                      </Stack>
                    </Grid>
                  ))}
                </Grid>
              </CardContent>
            </Paper>

            {/* Specifications */}
            <Paper elevation={1}>
              <CardContent>
                <Typography
                  variant="h6"
                  fontWeight="bold"
                  gutterBottom
                  sx={{ display: "flex", alignItems: "center", gap: 1 }}
                >
                  <Handyman color="primary" />
                  Specifications
                </Typography>
                <Divider sx={{ mb: 2 }} />

                <Grid container spacing={2}>
                  {Object.entries(selectedForklift.specs || {}).map(
                    ([key, value]) => (
                      <Grid item xs={12} sm={6} key={key}>
                        <Paper
                          variant="outlined"
                          sx={{ p: 2, bgcolor: "grey.50" }}
                        >
                          <Typography
                            variant="caption"
                            color="text.secondary"
                            sx={{
                              textTransform: "uppercase",
                              letterSpacing: 1,
                            }}
                          >
                            {key}
                          </Typography>
                          <Typography variant="body2" fontWeight="bold">
                            {value}
                          </Typography>
                        </Paper>
                      </Grid>
                    )
                  )}
                </Grid>
              </CardContent>
            </Paper>

            {/* Actions */}
            <Stack spacing={2}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Button
                    onClick={() => navigateTo("contact")}
                    variant="contained"
                    size="large"
                    startIcon={<Email />}
                    fullWidth
                    sx={{ py: 1.5 }}
                  >
                    Request Quote
                  </Button>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Button
                    href="tel:+35351293208"
                    variant="outlined"
                    color="primary"
                    size="large"
                    startIcon={<Phone />}
                    fullWidth
                    sx={{ py: 1.5 }}
                  >
                    Call to Order
                  </Button>
                </Grid>
              </Grid>

              <Alert
                severity="info"
                sx={{ mt: 2 }}
                action={
                  <Button
                    component="a"
                    href="tel:+35351293208"
                    color="inherit"
                    size="small"
                    variant="outlined"
                  >
                    Call Now
                  </Button>
                }
              >
                <Typography variant="subtitle2" fontWeight="bold">
                  Need it urgently?
                </Typography>
                <Typography variant="body2">
                  Call us now for same-day delivery!{" "}
                  <strong>+353 (0) 51 293 208</strong>
                </Typography>
              </Alert>
            </Stack>
          </Stack>
        </Grid>
      </Grid>
    </Container>
  );
};

export default ProductDetail;
