import React from "react";
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  Stack,
  Avatar,
  Paper,
  useTheme,
} from "@mui/material";
import {
  ShoppingCart,
  LocalShipping,
  Build,
  Star,
  ArrowForward,
  Phone,
  Speed,
  Security,
  Support,
  LocationOn,
} from "@mui/icons-material";
import { useApp } from "../context/AppContext";

const HomePage = () => {
  const theme = useTheme();
  const { navigateTo } = useApp();

  const services = [
    {
      icon: <ShoppingCart />,
      title: "Sales",
      description:
        "New and refurbished forklifts with competitive pricing and financing options.",
      color: "primary",
      action: () => navigateTo("shop"),
      actionText: "Browse Products",
    },
    {
      icon: <LocalShipping />,
      title: "Plant Hire",
      description:
        "Emergency breakdown service with immediate replacement forklifts.",
      color: "secondary",
      action: () => navigateTo("contact"),
      actionText: "Hire Enquiry",
    },
    {
      icon: <Build />,
      title: "Service & Repair",
      description:
        "Professional maintenance and repair with delivery and collection.",
      color: "info",
      action: () => navigateTo("contact"),
      actionText: "Service Enquiry",
    },
  ];

  const features = [
    { icon: <Speed />, text: "25+ Years Experience" },
    { icon: <Security />, text: "500+ Happy Customers" },
    { icon: <Support />, text: "24/7 Support Available" },
    { icon: <LocationOn />, text: "All Ireland Coverage" },
  ];

  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          bgcolor: "primary.main",
          color: "white",
          py: { xs: 8, md: 12 },
          textAlign: "center",
        }}
      >
        <Container maxWidth="md">
          <Stack spacing={2} alignItems="center" mb={3}>
            <Star sx={{ fontSize: 40, color: "secondary.light" }} />
            <Typography variant="h5" sx={{ opacity: 0.85 }}>
              Ireland's #1 Forklift Specialists
            </Typography>
          </Stack>

          <Typography
            variant="h2"
            sx={{
              fontWeight: "bold",
              mb: 2,
              fontSize: { xs: "2rem", md: "3rem" },
            }}
          >
            Forklift hire from{" "}
            <span style={{ color: theme.palette.secondary.main }}>€80</span> per
            week
          </Typography>

          <Typography
            variant="body1"
            sx={{
              maxWidth: "700px",
              mx: "auto",
              mb: 4,
              opacity: 0.9,
            }}
          >
            Specialists in the supply and hire of new and refurbished forklifts
            for industry and independent traders.
          </Typography>

          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={2}
            justifyContent="center"
          >
            <Button
              onClick={() => navigateTo("shop")}
              variant="contained"
              color="secondary"
              endIcon={<ArrowForward />}
              size="large"
            >
              View Products
            </Button>
            <Button
              href="tel:+35351293208"
              variant="outlined"
              color="inherit"
              startIcon={<Phone />}
              size="large"
            >
              Call Us Now
            </Button>
          </Stack>
        </Container>
      </Box>

      {/* Trust Badges */}
      <Box sx={{ py: 4, bgcolor: "background.paper" }}>
        <Container maxWidth="md">
          <Grid container spacing={2} justifyContent="center">
            {features.map((feature, index) => (
              <Grid item xs={6} sm={3} key={index}>
                <Stack
                  direction="column"
                  spacing={1}
                  alignItems="center"
                  textAlign="center"
                >
                  <Avatar
                    sx={{
                      bgcolor: "secondary.main",
                      width: 48,
                      height: 48,
                    }}
                  >
                    {feature.icon}
                  </Avatar>
                  <Typography variant="body2" color="text.secondary">
                    {feature.text}
                  </Typography>
                </Stack>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Services Section */}
      <Box sx={{ py: 8, bgcolor: "grey.50" }}>
        <Container maxWidth="md" sx={{ textAlign: "center", mb: 6 }}>
          <Typography variant="h4" color="primary.main" gutterBottom>
            Our Services
          </Typography>
          <Typography variant="body1" color="text.secondary">
            From emergency replacements to full fleet management, we've got you
            covered.
          </Typography>
        </Container>

        <Container maxWidth="lg">
          <Grid container spacing={4}>
            {services.map((service, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Paper
                  elevation={2}
                  sx={{
                    p: 3,
                    textAlign: "center",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    transition: "transform 0.2s ease",
                    "&:hover": {
                      transform: "translateY(-4px)",
                      boxShadow: theme.shadows[6],
                    },
                  }}
                >
                  <Avatar
                    sx={{
                      bgcolor: theme.palette[service.color].main,
                      width: 56,
                      height: 56,
                      mx: "auto",
                      mb: 2,
                    }}
                  >
                    {service.icon}
                  </Avatar>

                  <Typography variant="h6" sx={{ mb: 1 }}>
                    {service.title}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 2 }}
                  >
                    {service.description}
                  </Typography>

                  <Button
                    onClick={service.action}
                    variant="outlined"
                    endIcon={<ArrowForward />}
                    color={service.color}
                    fullWidth
                  >
                    {service.actionText}
                  </Button>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Call to Action */}
      <Box sx={{ py: 8, bgcolor: "background.paper" }}>
        <Container maxWidth="md">
          <Paper elevation={2} sx={{ p: 4, textAlign: "center" }}>
            <Typography variant="h4" color="primary.main" gutterBottom>
              Ready to Get Started?
            </Typography>
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{ mb: 3, maxWidth: "600px", mx: "auto" }}
            >
              Don't let equipment downtime slow your business. Call us today for
              immediate assistance!
            </Typography>

            <Typography
              variant="h5"
              sx={{
                fontWeight: "bold",
                mb: 2,
                color: "text.primary",
              }}
            >
              +353 51 293 208
            </Typography>
            <Button
              href="tel:+35351293208"
              variant="contained"
              color="secondary"
              size="large"
              startIcon={<Phone />}
            >
              Call Now - Free Quote
            </Button>
          </Paper>
        </Container>
      </Box>
    </Box>
  );
};

export default HomePage;
