import React from "react";
import {
  Box,
  Container,
  Grid,
  Typography,
  Stack,
  Divider,
  Button,
  Avatar,
  Chip,
  Paper,
} from "@mui/material";
import {
  Phone,
  Email,
  LocationOn,
  Schedule,
  Star,
  CheckCircle,
  Build,
  LocalShipping,
  Security,
  Emergency,
} from "@mui/icons-material";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const contactInfo = [
    {
      icon: <Phone />,
      label: "Main Office",
      value: "+353 (0) 51 293 208",
      href: "tel:+35351293208",
    },
    {
      icon: <Phone />,
      label: "Mobile / Emergency",
      value: "+353 (0) 87 250 1934",
      href: "tel:+353872501934",
    },
    {
      icon: <Email />,
      label: "Email",
      value: "sales@virgilpowerforklifts.com",
      href: "mailto:sales@virgilpowerforklifts.com",
    },
    {
      icon: <LocationOn />,
      label: "Location",
      value: "Waterford, Ireland",
      href: null,
    },
  ];

  const services = [
    "Forklift Sales",
    "Forklift Hire/Rental",
    "Emergency Breakdown Service",
    "Maintenance & Repair",
    "Parts & Accessories",
    "Fleet Management",
  ];

  const serviceAreas = [
    "Waterford",
    "Cork",
    "Dublin",
    "Kilkenny",
    "Tipperary",
    "Wexford",
    "Limerick",
    "All Ireland",
  ];

  const certifications = [
    { icon: <Security />, text: "25+ Years Experience" },
    { icon: <CheckCircle />, text: "Fully Insured" },
    { icon: <Star />, text: "500+ Happy Customers" },
  ];

  return (
    <Box sx={{ bgcolor: "#1a1a1a", color: "white", mt: "auto" }}>
      {/* Main Footer Content */}
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Grid container spacing={6}>
          {/* Company Info */}
          <Grid item xs={12} md={4}>
            <Stack spacing={3}>
              {/* Company Description */}
              <Box>
                <Typography
                  variant="body1"
                  sx={{ color: "grey.300", mb: 3, lineHeight: 1.6 }}
                >
                  Ireland's leading specialists in the supply and hire of new
                  and refurbished forklifts. Serving industry and independent
                  traders nationwide with 25+ years of experience.
                </Typography>

                {/* Certifications */}
                <Stack spacing={1}>
                  {certifications.map((cert, index) => (
                    <Stack
                      key={index}
                      direction="row"
                      spacing={1}
                      alignItems="center"
                    >
                      <Box sx={{ color: "#ff8c00" }}>{cert.icon}</Box>
                      <Typography variant="body2" sx={{ color: "grey.300" }}>
                        {cert.text}
                      </Typography>
                    </Stack>
                  ))}
                </Stack>
              </Box>
            </Stack>
          </Grid>

          {/* Contact Information */}
          <Grid item xs={12} md={4}>
            <Typography
              variant="h6"
              sx={{ fontWeight: "bold", mb: 3, color: "#ff8c00" }}
            >
              Contact Information
            </Typography>

            <Stack spacing={2.5}>
              {contactInfo.map((contact, index) => (
                <Box key={index}>
                  <Stack direction="row" spacing={2} alignItems="flex-start">
                    <Box sx={{ color: "#ff8c00", mt: 0.5 }}>{contact.icon}</Box>
                    <Box>
                      <Typography
                        variant="body2"
                        sx={{ color: "grey.400", fontSize: "0.875rem" }}
                      >
                        {contact.label}
                      </Typography>
                      {contact.href ? (
                        <Typography
                          component="a"
                          href={contact.href}
                          variant="body1"
                          sx={{
                            color: "white",
                            textDecoration: "none",
                            fontWeight: "medium",
                            "&:hover": {
                              color: "#ff8c00",
                              textDecoration: "underline",
                            },
                          }}
                        >
                          {contact.value}
                        </Typography>
                      ) : (
                        <Typography
                          variant="body1"
                          sx={{ color: "white", fontWeight: "medium" }}
                        >
                          {contact.value}
                        </Typography>
                      )}
                    </Box>
                  </Stack>
                </Box>
              ))}

              {/* Business Hours */}
              <Box>
                <Stack direction="row" spacing={2} alignItems="flex-start">
                  <Box sx={{ color: "#ff8c00", mt: 0.5 }}>
                    <Schedule />
                  </Box>
                  <Box>
                    <Typography
                      variant="body2"
                      sx={{ color: "grey.400", fontSize: "0.875rem" }}
                    >
                      Business Hours
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{ color: "white", fontWeight: "medium" }}
                    >
                      Mon-Fri: 9AM-5PM
                    </Typography>
                    <Typography variant="body2" sx={{ color: "grey.300" }}>
                      Emergency support 24/7
                    </Typography>
                  </Box>
                </Stack>
              </Box>
            </Stack>
          </Grid>

          {/* Services & Areas */}
          <Grid item xs={12} md={4}>
            <Stack spacing={4}>
              {/* Services */}
              <Box>
                <Typography
                  variant="h6"
                  sx={{ fontWeight: "bold", mb: 3, color: "#ff8c00" }}
                >
                  Our Services
                </Typography>
                <Stack spacing={1}>
                  {services.map((service, index) => (
                    <Stack
                      key={index}
                      direction="row"
                      spacing={1}
                      alignItems="center"
                    >
                      <CheckCircle sx={{ fontSize: 16, color: "#ff8c00" }} />
                      <Typography variant="body2" sx={{ color: "grey.300" }}>
                        {service}
                      </Typography>
                    </Stack>
                  ))}
                </Stack>
              </Box>

              {/* Service Areas */}
              <Box>
                <Typography
                  variant="h6"
                  sx={{ fontWeight: "bold", mb: 2, color: "#ff8c00" }}
                >
                  Service Areas
                </Typography>
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                  {serviceAreas.map((area, index) => (
                    <Chip
                      key={index}
                      label={area}
                      size="small"
                      sx={{
                        bgcolor: "rgba(255, 140, 0, 0.1)",
                        color: "#ff8c00",
                        border: "1px solid rgba(255, 140, 0, 0.3)",
                        "&:hover": {
                          bgcolor: "rgba(255, 140, 0, 0.2)",
                        },
                      }}
                    />
                  ))}
                </Box>
              </Box>
            </Stack>
          </Grid>
        </Grid>
      </Container>

      <Divider sx={{ borderColor: "rgba(255, 255, 255, 0.1)" }} />

      {/* FIXED: Professional Emergency CTA Strip */}
      <Box
        sx={{
          background: "linear-gradient(135deg, #1976d2 0%, #ff8c00 100%)",
          py: 4,
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Background Pattern */}
        <Box
          sx={{
            position: "absolute",
            top: -20,
            right: -20,
            width: 100,
            height: 100,
            borderRadius: "50%",
            background: "rgba(255, 255, 255, 0.1)",
            filter: "blur(40px)",
          }}
        />
        <Box
          sx={{
            position: "absolute",
            bottom: -30,
            left: -30,
            width: 120,
            height: 120,
            borderRadius: "50%",
            background: "rgba(255, 255, 255, 0.05)",
            filter: "blur(50px)",
          }}
        />

        <Container maxWidth="lg" sx={{ position: "relative", zIndex: 1 }}>
          <Paper
            elevation={0}
            sx={{
              bgcolor: "rgba(255, 255, 255, 0.15)",
              backdropFilter: "blur(10px)",
              border: "1px solid rgba(255, 255, 255, 0.2)",
              borderRadius: 3,
              p: 4,
              color: "white",
            }}
          >
            <Stack
              direction={{ xs: "column", md: "row" }}
              justifyContent="space-between"
              alignItems="center"
              spacing={3}
            >
              <Stack direction="row" spacing={3} alignItems="center">
                <Avatar
                  sx={{
                    bgcolor: "rgba(255, 255, 255, 0.2)",
                    color: "white",
                    width: 64,
                    height: 64,
                  }}
                >
                  <Emergency sx={{ fontSize: 32 }} />
                </Avatar>
                <Box>
                  <Typography
                    variant="h5"
                    sx={{
                      fontWeight: "bold",
                      color: "white",
                      mb: 1,
                      textShadow: "1px 1px 2px rgba(0,0,0,0.3)",
                    }}
                  >
                    Emergency Breakdown Service
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{
                      color: "rgba(255, 255, 255, 0.9)",
                      lineHeight: 1.4,
                    }}
                  >
                    Forklift broken down? We provide immediate replacement
                    forklifts to keep your business running.
                  </Typography>
                </Box>
              </Stack>

              <Stack spacing={2} alignItems={{ xs: "stretch", md: "flex-end" }}>
                <Button
                  href="tel:+353872501934"
                  variant="contained"
                  size="large"
                  startIcon={<Phone />}
                  sx={{
                    bgcolor: "white",
                    color: "#1976d2",
                    px: 4,
                    py: 2,
                    fontSize: "1.1rem",
                    fontWeight: "bold",
                    whiteSpace: "nowrap",
                    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.2)",
                    "&:hover": {
                      bgcolor: "#f5f5f5",
                      transform: "translateY(-2px)",
                      boxShadow: "0 6px 25px rgba(0, 0, 0, 0.3)",
                    },
                    transition: "all 0.3s ease",
                  }}
                >
                  Emergency Call
                </Button>
                <Typography
                  variant="h6"
                  sx={{
                    color: "white",
                    fontWeight: "bold",
                    textAlign: { xs: "center", md: "right" },
                    textShadow: "1px 1px 2px rgba(0,0,0,0.3)",
                  }}
                >
                  +353 87 250 1934
                </Typography>
              </Stack>
            </Stack>
          </Paper>
        </Container>
      </Box>

      <Divider sx={{ borderColor: "rgba(255, 255, 255, 0.1)" }} />

      {/* Bottom Bar */}
      <Box sx={{ py: 3, bgcolor: "rgba(0, 0, 0, 0.3)" }}>
        <Container maxWidth="lg">
          <Stack
            direction={{ xs: "column", md: "row" }}
            justifyContent="space-between"
            alignItems="center"
            spacing={2}
          >
            <Typography variant="body2" sx={{ color: "grey.400" }}>
              © {currentYear} Virgil Power Forklifts. All rights reserved.
            </Typography>
          </Stack>
        </Container>
      </Box>
    </Box>
  );
};

export default Footer;
