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
  Chip,
  Avatar,
  Paper,
  useTheme,
} from "@mui/material";
import {
  ShoppingCart,
  LocalShipping,
  Build,
  Star,
  CheckCircle,
  Phone,
  ArrowForward,
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
        "New and refurbished forklifts with competitive pricing and financing options available.",
      color: "primary",
      action: () => navigateTo("shop"),
      actionText: "Browse Products",
    },
    {
      icon: <LocalShipping />,
      title: "Plant Hire",
      description:
        "Emergency breakdown service with immediate replacement forklifts to keep your operations running.",
      color: "secondary",
      action: () => navigateTo("contact"),
      actionText: "Hire Enquiry",
    },
    {
      icon: <Build />,
      title: "Service & Repair",
      description:
        "Professional maintenance and repair services with low loader delivery and collection.",
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
          background: `linear-gradient(135deg, #1976d2 0%, #42a5f5 50%, #1976d2 100%)`,
          color: "white",
          py: 12,
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Background Pattern */}
        <Box
          sx={{
            position: "absolute",
            top: -50,
            right: -50,
            width: 200,
            height: 200,
            borderRadius: "50%",
            background: "rgba(255, 140, 0, 0.1)",
            filter: "blur(60px)",
          }}
        />
        <Box
          sx={{
            position: "absolute",
            bottom: -100,
            left: -100,
            width: 300,
            height: 300,
            borderRadius: "50%",
            background: "rgba(25, 118, 210, 0.05)",
            filter: "blur(80px)",
          }}
        />

        <Container maxWidth="lg" sx={{ position: "relative", zIndex: 1 }}>
          <Box textAlign="center">
            <Chip
              icon={<Star />}
              label="Ireland's #1 Forklift Specialists"
              sx={{
                bgcolor: "rgba(255, 140, 0, 0.2)",
                color: "#ff8c00",
                border: "1px solid rgba(255, 140, 0, 0.3)",
                mb: 4,
                backdropFilter: "blur(10px)",
                fontWeight: "bold",
              }}
            />

            <Typography
              variant="h1"
              sx={{
                fontSize: { xs: "2.5rem", md: "4rem", lg: "5rem" },
                fontWeight: "bold",
                mb: 3,
                lineHeight: 1.1,
              }}
            >
              Forklift hire from{" "}
              <Box component="span" sx={{ color: "#ff8c00" }}>
                €80
              </Box>{" "}
              per week
            </Typography>

            <Typography
              variant="h5"
              sx={{
                mb: 6,
                opacity: 0.9,
                maxWidth: "800px",
                mx: "auto",
                lineHeight: 1.4,
              }}
            >
              We are specialists in the supply and hire of new and refurbished
              forklifts for industry and small independent traders
            </Typography>

            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={3}
              justifyContent="center"
              alignItems="center"
            >
              <Button
                onClick={() => navigateTo("shop")}
                variant="contained"
                color="primary"
                size="large"
                endIcon={<ArrowForward />}
                sx={{
                  px: 4,
                  py: 2,
                  fontSize: "1.1rem",
                  "&:hover": {
                    transform: "translateY(-2px)",
                  },
                  transition: "all 0.3s ease",
                }}
              >
                View Products
              </Button>

              <Button
                href="tel:+35351293208"
                variant="contained"
                color="secondary"
                size="large"
                startIcon={<Phone />}
                sx={{
                  px: 4,
                  py: 2,
                  fontSize: "1.1rem",
                  "&:hover": {
                    transform: "translateY(-2px)",
                  },
                  transition: "all 0.3s ease",
                }}
              >
                Call Us Now
              </Button>
            </Stack>
          </Box>
        </Container>
      </Box>

      {/* Trust Badges */}
      <Box sx={{ py: 4, bgcolor: "background.paper" }}>
        <Container maxWidth="lg">
          <Grid container spacing={2} justifyContent="center">
            {features.map((feature, index) => (
              <Grid item xs={6} sm={3} key={index}>
                <Stack
                  direction="row"
                  spacing={1}
                  alignItems="center"
                  justifyContent="center"
                >
                  <Avatar sx={{ bgcolor: "#ff8c00", width: 32, height: 32 }}>
                    {React.cloneElement(feature.icon, {
                      sx: { fontSize: 16, color: "white" },
                    })}
                  </Avatar>
                  <Typography
                    variant="body2"
                    sx={{ fontWeight: "medium", color: "text.secondary" }}
                  >
                    {feature.text}
                  </Typography>
                </Stack>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Services Section */}
      <Box sx={{ py: 10, bgcolor: "background.default" }}>
        <Container maxWidth="lg">
          <Box textAlign="center" sx={{ mb: 8 }}>
            <Typography variant="h2" sx={{ mb: 2, fontWeight: "bold" }}>
              Our Services
            </Typography>
            <Typography
              variant="h6"
              color="text.secondary"
              sx={{ maxWidth: "600px", mx: "auto" }}
            >
              From emergency replacements to full fleet management, we've got
              your forklift needs covered
            </Typography>
          </Box>

          <Grid container spacing={4}>
            {services.map((service, index) => (
              <Grid item xs={12} md={4} key={index}>
                <Card
                  sx={{
                    height: "100%",
                    transition: "all 0.3s ease",
                    cursor: "pointer",
                    border: "2px solid transparent",
                    "&:hover": {
                      transform: "translateY(-8px)",
                      boxShadow: theme.shadows[12],
                      borderColor:
                        service.color === "secondary"
                          ? "#ff8c00"
                          : service.color === "primary"
                          ? "#1976d2"
                          : "#0288d1",
                    },
                  }}
                  onClick={service.action}
                >
                  <CardContent
                    sx={{
                      p: 4,
                      textAlign: "center",
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    <Avatar
                      sx={{
                        bgcolor:
                          service.color === "secondary"
                            ? "#ff8c00"
                            : service.color === "primary"
                            ? "#1976d2"
                            : "#0288d1",
                        width: 80,
                        height: 80,
                        mx: "auto",
                        mb: 3,
                      }}
                    >
                      {React.cloneElement(service.icon, {
                        sx: { fontSize: 40, color: "white" },
                      })}
                    </Avatar>

                    <Typography variant="h4" sx={{ mb: 2, fontWeight: "bold" }}>
                      {service.title}
                    </Typography>

                    <Typography
                      variant="body1"
                      color="text.secondary"
                      sx={{ mb: 4, lineHeight: 1.6, flexGrow: 1 }}
                    >
                      {service.description}
                    </Typography>

                    <Button
                      onClick={service.action}
                      variant="outlined"
                      color={service.color}
                      endIcon={<ArrowForward />}
                      fullWidth
                      sx={{ mt: "auto" }}
                    >
                      {service.actionText}
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Call to Action */}
      <Box
        sx={{
          background: `linear-gradient(135deg, #ff8c00 0%, #e67c00 50%, #ff8c00 100%)`,
          color: "white",
          py: 10,
          position: "relative",
          overflow: "hidden",
        }}
      >
        <Container maxWidth="lg" sx={{ position: "relative", zIndex: 1 }}>
          <Paper
            elevation={0}
            sx={{
              bgcolor: "rgba(255,255,255,0.1)",
              backdropFilter: "blur(10px)",
              border: "1px solid rgba(255,255,255,0.2)",
              borderRadius: 4,
              p: 6,
              textAlign: "center",
            }}
          >
            <Typography variant="h2" sx={{ mb: 3, fontWeight: "bold" }}>
              Ready to Get Started?
            </Typography>

            <Typography
              variant="h6"
              sx={{ mb: 4, opacity: 0.9, maxWidth: "600px", mx: "auto" }}
            >
              Don't let equipment downtime slow your business. Call today for
              immediate assistance!
            </Typography>

            <Box sx={{ mb: 4 }}>
              <Typography
                variant="h3"
                sx={{
                  fontWeight: "bold",
                  color: "white",
                  mb: 1,
                  fontSize: { xs: "2rem", md: "3rem" },
                  textShadow: "2px 2px 4px rgba(0,0,0,0.3)",
                }}
              >
                +353 51 293 208
              </Typography>
              <Typography variant="body1" sx={{ opacity: 0.9 }}>
                Available 7 days a week
              </Typography>
            </Box>

            <Button
              href="tel:+35351293208"
              variant="contained"
              size="large"
              startIcon={<Phone />}
              sx={{
                px: 6,
                py: 2,
                fontSize: "1.2rem",
                fontWeight: "bold",
                bgcolor: "white",
                color: "#ff8c00",
                "&:hover": {
                  bgcolor: "#f5f5f5",
                  transform: "translateY(-2px)",
                },
                transition: "all 0.3s ease",
              }}
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
