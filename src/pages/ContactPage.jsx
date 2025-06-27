import React, { useState } from "react";
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  TextField,
  Button,
  Stack,
  Avatar,
  Paper,
  Alert,
  Chip,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
} from "@mui/material";
import {
  Phone,
  Email,
  LocationOn,
  Schedule,
  Send,
  CheckCircle,
  Star,
  Emergency,
  Directions,
  Navigation,
  MyLocation,
} from "@mui/icons-material";

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    service: "",
    message: "",
  });
  const [showSuccess, setShowSuccess] = useState(false);
  const [mapError, setMapError] = useState(false);

  // Environment variables with fallbacks
  const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  const BUSINESS_LAT =
    import.meta.env.VITE_BUSINESS_LAT || "52.150543189614794";
  const BUSINESS_LNG =
    import.meta.env.VITE_BUSINESS_LNG || "-7.474104689710655";
  const BUSINESS_ADDRESS =
    import.meta.env.VITE_BUSINESS_ADDRESS ||
    "Waterford, County Waterford, Ireland";
  const BUSINESS_NAME =
    import.meta.env.VITE_BUSINESS_NAME || "Virgil Power Forklifts";

  // Google Maps URLs using exact coordinates for Waterford location
  const coordinatesString = `${BUSINESS_LAT},${BUSINESS_LNG}`;
  const mapEmbedUrl = GOOGLE_MAPS_API_KEY
    ? `https://www.google.com/maps/embed/v1/view?key=${GOOGLE_MAPS_API_KEY}&center=${coordinatesString}&zoom=15&maptype=roadmap`
    : `https://maps.google.com/maps?q=${coordinatesString}&output=embed`;

  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${coordinatesString}`;
  const mapsUrl = `https://maps.google.com/?q=${coordinatesString}`;

  const handleInputChange = (field) => (event) => {
    setFormData({
      ...formData,
      [field]: event.target.value,
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
      setFormData({
        name: "",
        phone: "",
        email: "",
        service: "",
        message: "",
      });
    }, 3000);
  };

  const handleMapError = () => {
    setMapError(true);
    console.error("Failed to load Google Maps");
  };

  const contactInfo = [
    {
      icon: <Phone />,
      title: "Main Office",
      content: "+353 (0) 51 293 208",
      href: "tel:+35351293208",
      description: "Primary contact line",
      color: "primary",
    },
    {
      icon: <Phone />,
      title: "Mobile",
      content: "+353 (0) 87 250 1934",
      href: "tel:+353872501934",
      description: "24/7 emergency support",
      color: "secondary",
    },
    {
      icon: <Email />,
      title: "Email",
      content: "sales@virgilpowerforklifts.com",
      href: "mailto:sales@virgilpowerforklifts.com",
      description: "Sales & general inquiries",
      color: "primary",
    },
    {
      icon: <LocationOn />,
      title: "Location",
      content: BUSINESS_ADDRESS,
      description: "Serving all of Ireland",
      color: "secondary",
    },
  ];

  return (
    <Box sx={{ py: 6 }}>
      <Container maxWidth="lg">
        {/* Header */}
        <Box sx={{ textAlign: "center", mb: 8 }}>
          <Typography variant="h2" sx={{ fontWeight: "bold", mb: 3 }}>
            Get In Touch
          </Typography>
          <Typography
            variant="h6"
            color="text.secondary"
            sx={{ maxWidth: "600px", mx: "auto" }}
          >
            Ready to discuss your forklift needs? We're here to help with sales,
            rentals, and service across Ireland
          </Typography>
        </Box>

        {/* Quick Contact Bar */}
        <Paper
          elevation={3}
          sx={{
            background: "linear-gradient(to right, #1976d2, #ff8c00)",
            color: "white",
            p: 4,
            mb: 6,
            borderRadius: 3,
          }}
        >
          <Grid container spacing={4} justifyContent="center">
            {[
              {
                icon: <Phone />,
                title: "Call Us Now",
                subtitle: "+353 51 293 208",
                description: "Available 7 days a week",
                href: "tel:+35351293208",
              },
              {
                icon: <Email />,
                title: "Email Us",
                subtitle: "sales@virgilpowerforklifts.com",
                description: "We reply within 2 hours",
                href: "mailto:sales@virgilpowerforklifts.com",
              },
              {
                icon: <LocationOn />,
                title: "Visit Us",
                subtitle: BUSINESS_ADDRESS,
                description: "All Ireland coverage",
                href: null,
              },
            ].map((item, idx) => (
              <Grid item xs={12} sm={6} md={4} key={idx}>
                <Card
                  component={item.href ? "a" : "div"}
                  href={item.href || undefined}
                  elevation={0}
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    textAlign: "center",
                    color: "black",
                    bgcolor: "rgba(255, 255, 255, 0.95)",
                    borderRadius: 2,
                    p: 4,
                    textDecoration: "none",
                    transition: "transform 0.3s, box-shadow 0.3s",
                    "&:hover": {
                      transform: "translateY(-4px)",
                      boxShadow: 6,
                      bgcolor: "white",
                    },
                  }}
                >
                  <Avatar
                    sx={{
                      bgcolor: "#1976d2",
                      color: "white",
                      width: 56,
                      height: 56,
                      mb: 2,
                    }}
                  >
                    {item.icon}
                  </Avatar>
                  <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1 }}>
                    {item.title}
                  </Typography>
                  <Typography variant="subtitle1" sx={{ fontWeight: "medium" }}>
                    {item.subtitle}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ color: "text.secondary", mt: 1 }}
                  >
                    {item.description}
                  </Typography>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Paper>

        {/* Contact Details and Map Row */}
        <Grid container spacing={4} sx={{ mb: 6 }}>
          {/* Contact Information */}
          <Grid item xs={12} md={6}>
            <Card elevation={2}>
              <CardContent sx={{ p: 4 }}>
                <Typography variant="h5" sx={{ fontWeight: "bold", mb: 3 }}>
                  Contact Information
                </Typography>

                <Stack spacing={3}>
                  {contactInfo.map((info, index) => (
                    <Box key={index}>
                      <Stack
                        direction="row"
                        spacing={2}
                        alignItems="flex-start"
                      >
                        <Avatar
                          sx={{
                            bgcolor:
                              info.color === "secondary"
                                ? "#ff8c00"
                                : "#1976d2",
                            color: "white",
                          }}
                        >
                          {info.icon}
                        </Avatar>
                        <Box>
                          <Typography
                            variant="subtitle1"
                            sx={{ fontWeight: "bold" }}
                          >
                            {info.title}
                          </Typography>
                          {info.href ? (
                            <Typography
                              component="a"
                              href={info.href}
                              variant="body1"
                              sx={{
                                color:
                                  info.color === "secondary"
                                    ? "#ff8c00"
                                    : "#1976d2",
                                textDecoration: "none",
                                fontWeight: "medium",
                                "&:hover": { textDecoration: "underline" },
                              }}
                            >
                              {info.content}
                            </Typography>
                          ) : (
                            <Typography
                              variant="body1"
                              sx={{ fontWeight: "medium" }}
                            >
                              {info.content}
                            </Typography>
                          )}
                          <Typography variant="body2" color="text.secondary">
                            {info.description}
                          </Typography>
                        </Box>
                      </Stack>
                    </Box>
                  ))}

                  <Box>
                    <Stack direction="row" spacing={2} alignItems="flex-start">
                      <Avatar sx={{ bgcolor: "#ff8c00", color: "white" }}>
                        <Schedule />
                      </Avatar>
                      <Box>
                        <Typography
                          variant="subtitle1"
                          sx={{ fontWeight: "bold" }}
                        >
                          Business Hours
                        </Typography>
                        <Typography
                          variant="body1"
                          sx={{ fontWeight: "medium" }}
                        >
                          Mon-Fri: 8AM-6PM
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Emergency support available 24/7
                        </Typography>
                      </Box>
                    </Stack>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          {/* Map */}
          <Grid item xs={12} md={6}>
            <Card elevation={2}>
              <CardContent sx={{ p: 0 }}>
                <Box sx={{ p: 3, pb: 2 }}>
                  <Stack
                    direction="row"
                    spacing={1}
                    alignItems="center"
                    sx={{ mb: 2 }}
                  >
                    <MyLocation sx={{ color: "#ff8c00" }} />
                    <Typography variant="h5" sx={{ fontWeight: "bold" }}>
                      Find Us Here
                    </Typography>
                  </Stack>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 2 }}
                  >
                    Click the map for instant GPS navigation to our location
                  </Typography>
                </Box>

                {/* Map Container */}
                <Box
                  sx={{
                    position: "relative",
                    width: "100%",
                    height: 350,
                    borderRadius: "0 0 16px 16px",
                    overflow: "hidden",
                    border: "3px solid #e0e0e0",
                    boxShadow: "inset 0 2px 8px rgba(0,0,0,0.1)",
                  }}
                >
                  {!mapError ? (
                    <iframe
                      src={mapEmbedUrl}
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      allowFullScreen=""
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      title={`${BUSINESS_NAME} Location - ${BUSINESS_ADDRESS}`}
                      onError={handleMapError}
                    />
                  ) : (
                    <Box
                      sx={{
                        height: "100%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        bgcolor: "grey.100",
                        flexDirection: "column",
                        p: 3,
                      }}
                    >
                      <LocationOn
                        sx={{ fontSize: 48, color: "grey.400", mb: 1 }}
                      />
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        textAlign="center"
                      >
                        Map temporarily unavailable
                        <br />
                        Use the buttons below for directions
                      </Typography>
                    </Box>
                  )}
                </Box>

                {/* Action Buttons */}
                <Box sx={{ p: 3, pt: 2 }}>
                  <Stack spacing={2}>
                    <Stack direction="row" spacing={2}>
                      <Button
                        component="a"
                        href={directionsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        variant="contained"
                        size="medium"
                        startIcon={<Directions />}
                        sx={{
                          flex: 1,
                          bgcolor: "#1976d2",
                          "&:hover": { bgcolor: "#115293" },
                        }}
                      >
                        Get Directions
                      </Button>
                      <Button
                        component="a"
                        href={mapsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        variant="outlined"
                        size="medium"
                        startIcon={<Navigation />}
                        sx={{
                          flex: 1,
                          borderColor: "#ff8c00",
                          color: "#ff8c00",
                          "&:hover": {
                            bgcolor: "rgba(255, 140, 0, 0.04)",
                            borderColor: "#e67c00",
                          },
                        }}
                      >
                        Open Maps
                      </Button>
                    </Stack>

                    {/* Coordinates Display */}
                    <Paper
                      variant="outlined"
                      sx={{
                        p: 2,
                        bgcolor: "grey.50",
                        textAlign: "center",
                      }}
                    >
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ display: "block", mb: 0.5 }}
                      >
                        📍 {BUSINESS_ADDRESS}
                      </Typography>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ fontFamily: "monospace" }}
                      >
                        GPS: {BUSINESS_LAT}, {BUSINESS_LNG}
                      </Typography>
                    </Paper>
                  </Stack>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Contact Form */}
        <Card elevation={2}>
          <CardContent sx={{ p: 4 }}>
            <Stack
              direction="row"
              spacing={2}
              alignItems="center"
              sx={{ mb: 4 }}
            >
              <Send color="primary" />
              <Box>
                <Typography variant="h5" sx={{ fontWeight: "bold" }}>
                  Send us a Message
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Get a free quote or ask any questions
                </Typography>
              </Box>
            </Stack>

            {showSuccess && (
              <Alert
                severity="success"
                sx={{
                  mb: 3,
                  "& .MuiAlert-icon": { color: "#ff8c00" },
                  bgcolor: "rgba(255, 140, 0, 0.1)",
                  border: "1px solid #ff8c00",
                }}
              >
                Thank you for your message! We'll get back to you within 2
                hours.
              </Alert>
            )}

            <form onSubmit={handleSubmit}>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Your Name"
                    variant="outlined"
                    fullWidth
                    required
                    value={formData.name}
                    onChange={handleInputChange("name")}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Phone Number"
                    variant="outlined"
                    fullWidth
                    required
                    value={formData.phone}
                    onChange={handleInputChange("phone")}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Email Address"
                    type="email"
                    variant="outlined"
                    fullWidth
                    required
                    value={formData.email}
                    onChange={handleInputChange("email")}
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormControl fullWidth sx={{ mb: 3 }}>
                    <InputLabel id="service-label">Service</InputLabel>
                    <Select
                      labelId="service-label"
                      id="service"
                      value={formData.service}
                      label="Service"
                      onChange={handleInputChange("service")}
                    >
                      <MenuItem value="">
                        <em>None</em>
                      </MenuItem>
                      <MenuItem value="purchase">Forklift Purchase</MenuItem>
                      <MenuItem value="rental">Forklift Rental/Hire</MenuItem>
                      <MenuItem value="service">Service & Repair</MenuItem>
                      <MenuItem value="general">General Inquiry</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Message"
                    multiline
                    rows={5}
                    variant="outlined"
                    fullWidth
                    required
                    placeholder="Tell us about your forklift needs, timeline, or any specific requirements..."
                    value={formData.message}
                    onChange={handleInputChange("message")}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button
                    type="submit"
                    variant="contained"
                    size="large"
                    startIcon={<Send />}
                    sx={{
                      px: 4,
                      py: 1.5,
                      bgcolor: "#1976d2",
                      "&:hover": { bgcolor: "#115293" },
                    }}
                  >
                    Send Message
                  </Button>
                </Grid>
              </Grid>
            </form>

            {/* Emergency Contact */}
            <Alert
              severity="error"
              icon={<Emergency />}
              sx={{
                mt: 4,
                bgcolor: "#ff8c00",
                color: "white",
                "& .MuiAlert-icon": { color: "white" },
                border: "1px solid #e67c00",
              }}
              action={
                <Button
                  component="a"
                  href="tel:+353872501934"
                  color="inherit"
                  size="small"
                  variant="outlined"
                  sx={{
                    color: "white",
                    borderColor: "white",
                    "&:hover": {
                      bgcolor: "rgba(255,255,255,0.1)",
                      borderColor: "white",
                    },
                  }}
                >
                  Call Now
                </Button>
              }
            >
              <Typography variant="subtitle2" sx={{ fontWeight: "bold" }}>
                Emergency Breakdown Service
              </Typography>
              <Typography variant="body2">
                Forklift broken down and need immediate replacement? Call our
                emergency line: <strong>+353 87 250 1934</strong>
              </Typography>
            </Alert>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};

export default ContactPage;
