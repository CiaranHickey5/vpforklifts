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

      {/* Emergency CTA Strip */}
      <Box sx={{ bgcolor: "rgba(255, 140, 0, 0.1)", py: 3 }}>
        <Container maxWidth="lg">
          <Stack
            direction={{ xs: "column", md: "row" }}
            justifyContent="space-between"
            alignItems="center"
            spacing={2}
          >
            <Box>
              <Typography
                variant="h6"
                sx={{ fontWeight: "bold", color: "#ff8c00", mb: 0.5 }}
              >
                Emergency Breakdown Service
              </Typography>
              <Typography variant="body2" sx={{ color: "grey.300" }}>
                Forklift broken down? We provide immediate replacement forklifts
                to keep your business running.
              </Typography>
            </Box>
            <Button
              href="tel:+353872501934"
              variant="contained"
              size="large"
              startIcon={<Phone />}
              sx={{
                bgcolor: "#ff8c00",
                color: "white",
                px: 4,
                whiteSpace: "nowrap",
                "&:hover": {
                  bgcolor: "#e67c00",
                },
              }}
            >
              Emergency Call: +353 87 250 1934
            </Button>
          </Stack>
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
