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
        {/* Image Section */}
        <Grid item xs={12} lg={6}>
          <Stack spacing={3}>
            {/* Main Image */}
            <Paper elevation={3} sx={{ borderRadius: 3, overflow: "hidden" }}>
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

                {/* Image Badges */}
                <Chip
                  label={selectedForklift.status}
                  color="success"
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
                      width: 40,
                      height: 40,
                    }}
                  >
                    <Star sx={{ color: "white" }} />
                  </Avatar>
                )}
              </Box>
            </Paper>

            {/* Trust Indicators */}
            <Card elevation={2} sx={{ bgcolor: "primary.50" }}>
              <CardContent>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: "bold",
                    mb: 2,
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                  }}
                >
                  <CheckCircle color="success" />
                  Why Choose This Forklift?
                </Typography>
                <Grid container spacing={2}>
                  {features.map((feature, index) => (
                    <Grid item xs={6} key={index}>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <Avatar
                          sx={{
                            bgcolor: "success.main",
                            width: 24,
                            height: 24,
                          }}
                        >
                          {React.cloneElement(feature.icon, {
                            sx: { fontSize: 14 },
                          })}
                        </Avatar>
                        <Typography
                          variant="body2"
                          sx={{ fontWeight: "medium" }}
                        >
                          {feature.text}
                        </Typography>
                      </Stack>
                    </Grid>
                  ))}
                </Grid>
              </CardContent>
            </Card>
          </Stack>
        </Grid>

        {/* Details Section */}
        <Grid item xs={12} lg={6}>
          <Stack spacing={4}>
            {/* Header */}
            <Box>
              <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
                <Chip label={selectedForklift.brand} color="primary" />
                <Chip
                  icon={<ElectricBolt />}
                  label={selectedForklift.type}
                  color="secondary"
                />
                <Chip
                  label={`SKU: ${selectedForklift.sku}`}
                  variant="outlined"
                  size="small"
                />
              </Stack>

              <Typography variant="h3" sx={{ fontWeight: "bold", mb: 1 }}>
                {selectedForklift.model}
              </Typography>
            </Box>

            {/* Pricing */}
            <Card
              elevation={2}
              sx={{
                bgcolor: "background.paper",
                border: 2,
                borderColor: "primary.main",
              }}
            >
              <CardContent>
                <Stack
                  direction="row"
                  alignItems="baseline"
                  spacing={2}
                  sx={{ mb: 2 }}
                >
                  <Typography
                    variant="h3"
                    sx={{ fontWeight: "bold", color: "primary.main" }}
                  >
                    {selectedForklift.priceFormatted}
                  </Typography>
                  <Typography
                    variant="h5"
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
                    sx={{ fontWeight: "bold" }}
                  />
                </Stack>

                <Stack direction="row" alignItems="center" spacing={2}>
                  <Typography
                    variant="h6"
                    color="secondary.main"
                    sx={{ fontWeight: "bold" }}
                  >
                    Or hire from
                  </Typography>
                  <Chip
                    icon={<LocalShipping />}
                    label={selectedForklift.hirePrice}
                    color="secondary"
                    sx={{ fontWeight: "bold", fontSize: "1rem" }}
                  />
                </Stack>
              </CardContent>
            </Card>

            {/* Description */}
            <Card elevation={1}>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>
                  Description
                </Typography>
                <Typography
                  variant="body1"
                  color="text.secondary"
                  sx={{ lineHeight: 1.6 }}
                >
                  {selectedForklift.description}
                </Typography>
              </CardContent>
            </Card>

            {/* Features */}
            <Card elevation={1}>
              <CardContent>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: "bold",
                    mb: 3,
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                  }}
                >
                  <Star color="warning" />
                  Key Features
                </Typography>
                <Grid container spacing={2}>
                  {selectedForklift.features.map((feature, index) => (
                    <Grid item xs={12} sm={6} key={index}>
                      <Stack
                        direction="row"
                        spacing={1}
                        alignItems="center"
                        sx={{ p: 1, bgcolor: "primary.50", borderRadius: 1 }}
                      >
                        <CheckCircle color="primary" sx={{ fontSize: 20 }} />
                        <Typography
                          variant="body2"
                          sx={{ fontWeight: "medium" }}
                        >
                          {feature}
                        </Typography>
                      </Stack>
                    </Grid>
                  ))}
                </Grid>
              </CardContent>
            </Card>

            {/* Specifications */}
            <Card elevation={1}>
              <CardContent>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: "bold",
                    mb: 3,
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                  }}
                >
                  <Handyman color="primary" />
                  Specifications
                </Typography>
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
                          <Typography
                            variant="body1"
                            sx={{ fontWeight: "bold" }}
                          >
                            {value}
                          </Typography>
                        </Paper>
                      </Grid>
                    )
                  )}
                </Grid>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <Stack spacing={3}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Button
                    onClick={() => navigateTo("contact")}
                    variant="contained"
                    size="large"
                    startIcon={<Email />}
                    fullWidth
                    sx={{ py: 2 }}
                  >
                    Request Quote
                  </Button>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Button
                    href="tel:+35351293208"
                    variant="contained"
                    color="secondary"
                    size="large"
                    startIcon={<Phone />}
                    fullWidth
                    sx={{ py: 2 }}
                  >
                    Call to Order
                  </Button>
                </Grid>
              </Grid>

              {/* Emergency Contact */}
              <Alert
                severity="warning"
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
                <Typography variant="subtitle2" sx={{ fontWeight: "bold" }}>
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
