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
  Paper,
  Alert,
  MenuItem,
  CircularProgress,
  Divider,
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
  Navigation,
  CheckCircle,
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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [mapError, setMapError] = useState(false);

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

  const coordinatesString = `${BUSINESS_LAT},${BUSINESS_LNG}`;
  const mapEmbedUrl = GOOGLE_MAPS_API_KEY
    ? `https://www.google.com/maps/embed/v1/view?key=${GOOGLE_MAPS_API_KEY}&center=${coordinatesString}&zoom=15&maptype=roadmap`
    : `https://maps.google.com/maps?q=${coordinatesString}&output=embed`;

  const handleInputChange = (field) => (event) => {
    setFormData({
      ...formData,
      [field]: event.target.value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    setSubmitError("");
    setShowSuccess(false);

    if (
      !formData.name.trim() ||
      !formData.phone.trim() ||
      !formData.email.trim() ||
      !formData.message.trim()
    ) {
      setSubmitError("Please fill in all required fields.");
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch("/api/contact/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        setShowSuccess(true);
        setFormData({
          name: "",
          phone: "",
          email: "",
          service: "",
          message: "",
        });
        setTimeout(() => setShowSuccess(false), 8000);
      } else {
        setSubmitError(
          data.message || "Failed to send message. Please try again."
        );
        if (data.errors && Array.isArray(data.errors)) {
          setSubmitError(data.errors.join(" • "));
        }
      }
    } catch (error) {
      setSubmitError(
        "Network error. Please check your internet connection and try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box sx={{ py: 6, bgcolor: "background.default" }}>
      <Container maxWidth="md">
        {/* Header */}
        <Box sx={{ textAlign: "center", mb: 5 }}>
          <Typography variant="h3" color="primary.main" gutterBottom>
            Contact Us
          </Typography>
          <Typography variant="body1" color="text.secondary">
            We're here to help with sales, rentals, and service across Ireland.
            Let's find the perfect solution for your business.
          </Typography>
        </Box>

        {/* Contact Information */}
        <Grid container spacing={4} sx={{ mb: 6 }}>
          <Grid item xs={12} md={6}>
            <Paper elevation={2} sx={{ p: 3 }}>
              <Typography variant="h5" color="primary.main" gutterBottom>
                Our Contact Details
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Typography
                    sx={{ display: "flex", alignItems: "center", gap: 1 }}
                  >
                    <Phone color="primary" /> +353 51 293 208
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography
                    sx={{ display: "flex", alignItems: "center", gap: 1 }}
                  >
                    <Phone color="secondary" /> +353 87 250 1934 (24/7)
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography
                    sx={{ display: "flex", alignItems: "center", gap: 1 }}
                  >
                    <Email color="primary" /> sales@virgilpowerforklifts.com
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography
                    sx={{ display: "flex", alignItems: "center", gap: 1 }}
                  >
                    <LocationOn color="secondary" /> {BUSINESS_ADDRESS}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography
                    sx={{ display: "flex", alignItems: "center", gap: 1 }}
                  >
                    <Schedule color="action" /> Mon-Fri: 8AM-6PM (24/7 emergency
                    support)
                  </Typography>
                </Grid>
              </Grid>
            </Paper>
          </Grid>

          <Grid item xs={12} md={6}>
            <Paper elevation={2} sx={{ p: 3 }}>
              <Typography variant="h5" color="primary.main" gutterBottom>
                Our Location
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Box
                sx={{
                  width: "100%",
                  height: 300,
                  border: 1,
                  borderColor: "divider",
                  overflow: "hidden",
                  mb: 2,
                }}
              >
                {!mapError ? (
                  <iframe
                    src={mapEmbedUrl}
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    title={`${BUSINESS_NAME} Location`}
                    onError={() => setMapError(true)}
                  />
                ) : (
                  <Box sx={{ p: 2, textAlign: "center" }}>
                    <Typography variant="body2" color="text.secondary">
                      Map unavailable. Please use Google Maps for directions.
                    </Typography>
                  </Box>
                )}
              </Box>
              <Button
                variant="outlined"
                color="primary"
                size="small"
                startIcon={<Navigation />}
                href={`https://maps.google.com/?q=${coordinatesString}`}
                target="_blank"
                rel="noopener noreferrer"
                fullWidth
              >
                View on Google Maps
              </Button>
            </Paper>
          </Grid>
        </Grid>

        {/* Contact Form */}
        <Card elevation={3}>
          <Box
            sx={{
              bgcolor: "background.paper",
              borderBottom: 3,
              borderColor: "primary.main",
              p: 3,
              textAlign: "center",
            }}
          >
            <Typography variant="h4" color="primary.main">
              Send Us a Message
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Get a free quote or ask any question about our services.
            </Typography>
          </Box>

          <CardContent sx={{ p: 3 }}>
            {submitError && (
              <Alert
                severity="error"
                onClose={() => setSubmitError("")}
                sx={{ mb: 2 }}
              >
                {submitError}
              </Alert>
            )}
            {showSuccess && (
              <Alert severity="success" icon={<CheckCircle />} sx={{ mb: 2 }}>
                Thank you for your message! We’ll respond within 2 hours.
              </Alert>
            )}

            <form onSubmit={handleSubmit}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <TextField
                    label="Name"
                    variant="outlined"
                    fullWidth
                    required
                    value={formData.name}
                    onChange={handleInputChange("name")}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Phone"
                    variant="outlined"
                    fullWidth
                    required
                    value={formData.phone}
                    onChange={handleInputChange("phone")}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Email"
                    type="email"
                    variant="outlined"
                    fullWidth
                    required
                    value={formData.email}
                    onChange={handleInputChange("email")}
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormControl fullWidth required>
                    <InputLabel id="service-label">Service</InputLabel>
                    <Select
                      labelId="service-label"
                      id="service"
                      value={formData.service}
                      label="Service"
                      onChange={handleInputChange("service")}
                      displayEmpty
                    >
                      <MenuItem value="" disabled>
                        Choose a service...
                      </MenuItem>
                      <MenuItem value="Forklift Purchase">
                        Forklift Purchase
                      </MenuItem>
                      <MenuItem value="Forklift Rental/Hire">
                        Forklift Rental/Hire
                      </MenuItem>
                      <MenuItem value="Service & Repair">
                        Service & Repair
                      </MenuItem>
                      <MenuItem value="Parts & Accessories">
                        Parts & Accessories
                      </MenuItem>
                      <MenuItem value="General Inquiry">
                        General Inquiry
                      </MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Message"
                    multiline
                    rows={4}
                    variant="outlined"
                    fullWidth
                    required
                    value={formData.message}
                    onChange={handleInputChange("message")}
                  />
                </Grid>
                <Grid item xs={12} sx={{ textAlign: "center" }}>
                  <Button
                    type="submit"
                    variant="contained"
                    size="large"
                    startIcon={
                      isSubmitting ? <CircularProgress size={20} /> : <Send />
                    }
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Sending..." : "Send Message"}
                  </Button>
                </Grid>
              </Grid>
            </form>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};

export default ContactPage;
