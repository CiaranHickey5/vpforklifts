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
  MenuItem,
  CircularProgress,
  Divider,
  Fade,
  Zoom,
} from "@mui/material";
import {
  Phone,
  Email,
  LocationOn,
  Schedule,
  Send,
  Emergency,
  Directions,
  Navigation,
  MyLocation,
  CheckCircle,
  Person,
  Business,
  Message,
  ContactPhone,
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
  const [submitError, setSubmitError] = useState('');
  const [mapError, setMapError] = useState(false);

  // Environment variables with fallbacks
  const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  const BUSINESS_LAT = import.meta.env.VITE_BUSINESS_LAT || "52.150543189614794";
  const BUSINESS_LNG = import.meta.env.VITE_BUSINESS_LNG || "-7.474104689710655";
  const BUSINESS_ADDRESS = import.meta.env.VITE_BUSINESS_ADDRESS || "Waterford, County Waterford, Ireland";
  const BUSINESS_NAME = import.meta.env.VITE_BUSINESS_NAME || "Virgil Power Forklifts";

  // Google Maps URLs
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

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    // Reset states
    setIsSubmitting(true);
    setSubmitError('');
    setShowSuccess(false);

    // Basic client-side validation
    if (!formData.name.trim() || !formData.phone.trim() || !formData.email.trim() || !formData.message.trim()) {
      setSubmitError('Please fill in all required fields.');
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch('/api/contact/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
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
        
        setTimeout(() => {
          setShowSuccess(false);
        }, 8000);
      } else {
        setSubmitError(data.message || 'Failed to send message. Please try again.');
        
        if (data.errors && Array.isArray(data.errors)) {
          setSubmitError(data.errors.join(' • '));
        }
      }
    } catch (error) {
      setSubmitError('Network error. Please check your internet connection and try again, or call us directly at +353 51 293 208.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleMapError = () => {
    setMapError(true);
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
    <Box sx={{ py: 8, bgcolor: 'background.default', minHeight: "100vh" }}>
      <Container maxWidth="lg">
        {/* Header */}
        <Fade in timeout={800}>
          <Box sx={{ textAlign: "center", mb: 10 }}>
            <Typography 
              variant="h2" 
              sx={{ 
                mb: 4,
                fontSize: { xs: "2.5rem", md: "3.5rem" }
              }}
            >
              Get In Touch
            </Typography>
            <Typography
              variant="h5"
              color="text.secondary"
              sx={{ 
                maxWidth: "700px", 
                mx: "auto",
                lineHeight: 1.6,
                fontSize: { xs: "1.1rem", md: "1.3rem" }
              }}
            >
              Ready to discuss your forklift needs? We're here to help with sales,
              rentals, and service across Ireland. Let's find the perfect solution for your business.
            </Typography>
          </Box>
        </Fade>

        {/* Quick Contact Bar */}
        <Zoom in timeout={1000}>
          <Paper
            elevation={8}
            sx={{
              background: (theme) => `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
              color: "white",
              p: 5,
              mb: 8,
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
                      color: "text.primary",
                      bgcolor: "rgba(255, 255, 255, 0.95)",
                      borderRadius: 2,
                      p: 4,
                      textDecoration: "none",
                      transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                      "&:hover": {
                        transform: "translateY(-8px)",
                        bgcolor: "background.paper",
                      },
                    }}
                  >
                    <Avatar
                      sx={{
                        bgcolor: "primary.main",
                        color: "white",
                        width: 64,
                        height: 64,
                        mb: 2,
                      }}
                    >
                      {item.icon}
                    </Avatar>
                    <Typography variant="h6" sx={{ mb: 1 }}>
                      {item.title}
                    </Typography>
                    <Typography variant="subtitle1" sx={{ mb: 1 }}>
                      {item.subtitle}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {item.description}
                    </Typography>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Paper>
        </Zoom>

        {/* Contact Details and Map Row */}
        <Grid container spacing={6} sx={{ mb: 8 }}>
          {/* Contact Information */}
          <Grid item xs={12} md={6}>
            <Fade in timeout={1200}>
              <Card elevation={3}>
                <CardContent sx={{ p: 5 }}>
                  <Typography variant="h4" color="primary.main" sx={{ mb: 4 }}>
                    Contact Information
                  </Typography>

                  <Stack spacing={4}>
                    {contactInfo.map((info, index) => (
                      <Box key={index}>
                        <Stack direction="row" spacing={3} alignItems="flex-start">
                          <Avatar
                            sx={{
                              bgcolor: info.color === "secondary" ? "secondary.main" : "primary.main",
                              color: "white",
                              width: 56,
                              height: 56,
                            }}
                          >
                            {info.icon}
                          </Avatar>
                          <Box sx={{ flex: 1 }}>
                            <Typography variant="h6" sx={{ mb: 1 }}>
                              {info.title}
                            </Typography>
                            {info.href ? (
                              <Typography
                                component="a"
                                href={info.href}
                                variant="body1"
                                sx={{
                                  color: info.color === "secondary" ? "secondary.main" : "primary.main",
                                  textDecoration: "none",
                                  fontSize: "1.1rem",
                                  "&:hover": { textDecoration: "underline" },
                                }}
                              >
                                {info.content}
                              </Typography>
                            ) : (
                              <Typography variant="body1" sx={{ fontSize: "1.1rem" }}>
                                {info.content}
                              </Typography>
                            )}
                            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                              {info.description}
                            </Typography>
                          </Box>
                        </Stack>
                      </Box>
                    ))}

                    <Divider sx={{ my: 2 }} />

                    <Box>
                      <Stack direction="row" spacing={3} alignItems="flex-start">
                        <Avatar sx={{ bgcolor: "secondary.main", color: "white", width: 56, height: 56 }}>
                          <Schedule />
                        </Avatar>
                        <Box>
                          <Typography variant="h6" sx={{ mb: 1 }}>
                            Business Hours
                          </Typography>
                          <Typography variant="body1" sx={{ fontSize: "1.1rem" }}>
                            Mon-Fri: 8AM-6PM
                          </Typography>
                          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                            Emergency support available 24/7
                          </Typography>
                        </Box>
                      </Stack>
                    </Box>
                  </Stack>
                </CardContent>
              </Card>
            </Fade>
          </Grid>

          {/* Map */}
          <Grid item xs={12} md={6}>
            <Fade in timeout={1400}>
              <Card elevation={3}>
                <CardContent sx={{ p: 0 }}>
                  <Box sx={{ p: 4, pb: 3 }}>
                    <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
                      <MyLocation color="secondary" sx={{ fontSize: 30 }} />
                      <Typography variant="h4" color="primary.main">
                        Find Us Here
                      </Typography>
                    </Stack>
                    <Typography variant="body1" color="text.secondary" sx={{ mb: 3, fontSize: "1.1rem" }}>
                      Click the map for instant GPS navigation to our location
                    </Typography>
                  </Box>

                  {/* Map Container */}
                  <Box
                    sx={{
                      position: "relative",
                      width: "100%",
                      height: 400,
                      overflow: "hidden",
                      border: (theme) => `3px solid ${theme.palette.grey[300]}`,
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
                        <LocationOn sx={{ fontSize: 48, color: "grey.400", mb: 1 }} />
                        <Typography variant="body2" color="text.secondary" textAlign="center">
                          Map temporarily unavailable
                          <br />
                          Use the buttons below for directions
                        </Typography>
                      </Box>
                    )}
                  </Box>

                  {/* Action Buttons */}
                  <Box sx={{ p: 4, pt: 3 }}>
                    <Stack spacing={3}>
                      <Stack direction="row" spacing={2}>
                        <Button
                          component="a"
                          href={directionsUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          variant="contained"
                          size="large"
                          startIcon={<Directions />}
                          sx={{ flex: 1, py: 1.5 }}
                        >
                          Get Directions
                        </Button>
                        <Button
                          component="a"
                          href={mapsUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          variant="outlined"
                          color="secondary"
                          size="large"
                          startIcon={<Navigation />}
                          sx={{ flex: 1, py: 1.5 }}
                        >
                          Open Maps
                        </Button>
                      </Stack>

                      {/* Coordinates Display */}
                      <Paper
                        variant="outlined"
                        sx={{
                          p: 3,
                          bgcolor: "grey.50",
                          textAlign: "center",
                        }}
                      >
                        <Typography variant="body2" color="text.secondary" sx={{ display: "block", mb: 1, fontSize: "1rem" }}>
                          📍 {BUSINESS_ADDRESS}
                        </Typography>
                        <Typography variant="caption" color="text.secondary" sx={{ fontFamily: "monospace" }}>
                          GPS: {BUSINESS_LAT}, {BUSINESS_LNG}
                        </Typography>
                      </Paper>
                    </Stack>
                  </Box>
                </CardContent>
              </Card>
            </Fade>
          </Grid>
        </Grid>

        {/* Contact Form */}
        <Fade in timeout={1600}>
          <Card elevation={4}>
            <Box
              sx={{
                background: (theme) => `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                color: "white",
                p: 5,
                textAlign: "center",
              }}
            >
              <Stack direction="row" spacing={2} alignItems="center" justifyContent="center" sx={{ mb: 2 }}>
                <Send sx={{ fontSize: 40 }} />
                <Typography variant="h3">
                  Send us a Message
                </Typography>
              </Stack>
              <Typography variant="h6" sx={{ opacity: 0.9 }}>
                Get a free quote or ask any questions about our forklift services
              </Typography>
            </Box>

            <CardContent sx={{ p: 6 }}>
              {/* Error Alert */}
              {submitError && (
                <Alert
                  severity="error"
                  sx={{ mb: 4, fontSize: "1rem" }}
                  onClose={() => setSubmitError('')}
                >
                  {submitError}
                </Alert>
              )}

              {/* Success Alert */}
              {showSuccess && (
                <Alert
                  severity="success"
                  icon={<CheckCircle />}
                  sx={{ mb: 4, fontSize: "1rem" }}
                >
                  ✅ Thank you for your message! We'll get back to you within 2 hours during business hours. Check your email for a confirmation.
                </Alert>
              )}

              <form onSubmit={handleSubmit}>
                <Grid container spacing={4}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Your Name"
                      variant="outlined"
                      fullWidth
                      required
                      value={formData.name}
                      onChange={handleInputChange("name")}
                      InputProps={{
                        startAdornment: <Person color="primary" sx={{ mr: 1 }} />,
                      }}
                      sx={{
                        "& .MuiOutlinedInput-input": { py: 2 },
                      }}
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
                      InputProps={{
                        startAdornment: <ContactPhone color="secondary" sx={{ mr: 1 }} />,
                      }}
                      sx={{
                        "& .MuiOutlinedInput-input": { py: 2 },
                      }}
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
                      InputProps={{
                        startAdornment: <Email color="primary" sx={{ mr: 1 }} />,
                      }}
                      sx={{
                        "& .MuiOutlinedInput-input": { py: 2 },
                      }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      select
                      label="Service Needed"
                      value={formData.service}
                      onChange={handleInputChange("service")}
                      fullWidth
                      variant="outlined"
                      InputProps={{
                        startAdornment: <Business color="secondary" sx={{ mr: 1 }} />,
                      }}
                      InputLabelProps={{
                        shrink: true,
                      }}
                      SelectProps={{
                        displayEmpty: true,
                      }}
                      sx={{
                        "& .MuiSelect-select": { py: 2 },
                      }}
                    >
                      <MenuItem value="" disabled>
                        Choose a service option...
                      </MenuItem>
                      <MenuItem value="Forklift Purchase">🚜 Forklift Purchase</MenuItem>
                      <MenuItem value="Forklift Rental/Hire">📅 Forklift Rental/Hire</MenuItem>
                      <MenuItem value="Service & Repair">🔧 Service & Repair</MenuItem>
                      <MenuItem value="Parts & Accessories">⚙️ Parts & Accessories</MenuItem>
                      <MenuItem value="General Inquiry">💬 General Inquiry</MenuItem>
                    </TextField>
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      label="Message"
                      multiline
                      rows={6}
                      variant="outlined"
                      fullWidth
                      required
                      placeholder="Tell us about your forklift needs, timeline, or any specific requirements. The more details you provide, the better we can assist you..."
                      value={formData.message}
                      onChange={handleInputChange("message")}
                      InputProps={{
                        startAdornment: (
                          <Message color="primary" sx={{ mr: 1, alignSelf: "flex-start", mt: 2 }} />
                        ),
                      }}
                      sx={{
                        "& .MuiOutlinedInput-input": { lineHeight: 1.6 },
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sx={{ textAlign: "center", mt: 2 }}>
                    <Button
                      type="submit"
                      variant="contained"
                      size="large"
                      startIcon={isSubmitting ? <CircularProgress size={24} color="inherit" /> : <Send />}
                      disabled={isSubmitting}
                      sx={{
                        px: 6,
                        py: 2,
                        fontSize: "1.2rem",
                        background: (theme) => `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                        "&:hover": { 
                          background: (theme) => `linear-gradient(45deg, ${theme.palette.primary.dark}, ${theme.palette.secondary.dark})`,
                          transform: "translateY(-2px)",
                        },
                        "&:disabled": { 
                          background: "grey.400",
                          color: "white",
                          transform: "none",
                        },
                        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                      }}
                    >
                      {isSubmitting ? 'Sending Your Message...' : 'Send Message'}
                    </Button>
                    
                    {!isSubmitting && (
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                        🔒 Your information is secure and will only be used to respond to your inquiry
                      </Typography>
                    )}
                  </Grid>
                </Grid>
              </form>

              {/* Features Section */}
              <Box sx={{ mt: 6, pt: 4, borderTop: 1, borderColor: "divider" }}>
                <Typography variant="h5" color="primary.main" sx={{ mb: 3, textAlign: "center" }}>
                  Why Choose Virgil Power Forklifts?
                </Typography>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6} md={3}>
                    <Box sx={{ textAlign: "center", p: 2 }}>
                      <Avatar sx={{ bgcolor: "primary.main", mx: "auto", mb: 2, width: 56, height: 56 }}>
                        <CheckCircle />
                      </Avatar>
                      <Typography variant="h6" sx={{ mb: 1 }}>
                        2-Hour Response
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Quick response to all inquiries during business hours
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <Box sx={{ textAlign: "center", p: 2 }}>
                      <Avatar sx={{ bgcolor: "secondary.main", mx: "auto", mb: 2, width: 56, height: 56 }}>
                        <Phone />
                      </Avatar>
                      <Typography variant="h6" sx={{ mb: 1 }}>
                        24/7 Emergency
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Emergency breakdown support available around the clock
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <Box sx={{ textAlign: "center", p: 2 }}>
                      <Avatar sx={{ bgcolor: "primary.main", mx: "auto", mb: 2, width: 56, height: 56 }}>
                        <LocationOn />
                      </Avatar>
                      <Typography variant="h6" sx={{ mb: 1 }}>
                        All Ireland
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Comprehensive coverage across the entire island
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <Box sx={{ textAlign: "center", p: 2 }}>
                      <Avatar sx={{ bgcolor: "secondary.main", mx: "auto", mb: 2, width: 56, height: 56 }}>
                        <Business />
                      </Avatar>
                      <Typography variant="h6" sx={{ mb: 1 }}>
                        Expert Service
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Professional technicians with years of experience
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </Box>
            </CardContent>
          </Card>
        </Fade>

        {/* Emergency Contact */}
        <Fade in timeout={1800}>
          <Alert
            severity="error"
            icon={<Emergency sx={{ fontSize: 32 }} />}
            sx={{
              mt: 6,
              p: 4,
              background: (theme) => `linear-gradient(135deg, ${theme.palette.secondary.main} 0%, ${theme.palette.secondary.dark} 100%)`,
              color: "white",
              "& .MuiAlert-icon": { color: "white" },
              border: (theme) => `2px solid ${theme.palette.secondary.dark}`,
            }}
            action={
              <Stack spacing={2} direction={{ xs: "column", sm: "row" }}>
                <Button
                  component="a"
                  href="tel:+353872501934"
                  color="inherit"
                  size="large"
                  variant="outlined"
                  startIcon={<Phone />}
                  sx={{
                    color: "white",
                    borderColor: "white",
                    px: 3,
                    py: 1,
                    "&:hover": {
                      bgcolor: "rgba(255,255,255,0.15)",
                      borderColor: "white",
                      transform: "translateY(-2px)",
                    },
                    transition: "all 0.3s",
                  }}
                >
                  Call Emergency Line
                </Button>
                <Button
                  component="a"
                  href="mailto:sales@virgilpowerforklifts.com"
                  color="inherit"
                  size="large"
                  variant="outlined"
                  startIcon={<Email />}
                  sx={{
                    color: "white",
                    borderColor: "white",
                    px: 3,
                    py: 1,
                    "&:hover": {
                      bgcolor: "rgba(255,255,255,0.15)",
                      borderColor: "white",
                      transform: "translateY(-2px)",
                    },
                    transition: "all 0.3s",
                  }}
                >
                  Send Email
                </Button>
              </Stack>
            }
          >
            <Box>
              <Typography variant="h5" sx={{ mb: 1 }}>
                🚨 Emergency Breakdown Service
              </Typography>
              <Typography variant="body1" sx={{ fontSize: "1.1rem", lineHeight: 1.6 }}>
                Forklift broken down and need immediate replacement? Our emergency response team is standing by 24/7. 
                Call our emergency hotline: <strong>+353 87 250 1934</strong> for rapid response and temporary equipment solutions.
              </Typography>
            </Box>
          </Alert>
        </Fade>

        {/* Additional Info */}
        <Fade in timeout={2000}>
          <Paper 
            elevation={2} 
            sx={{ 
              mt: 6, 
              p: 4, 
              textAlign: "center", 
              bgcolor: "grey.50"
            }}
          >
            <Typography variant="h6" color="primary.main" sx={{ mb: 2 }}>
              Trusted by Irish Businesses Since 1995
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ maxWidth: "600px", mx: "auto", lineHeight: 1.6 }}>
              From small warehouses to large distribution centers, we've been helping Irish businesses 
              optimize their material handling operations for nearly three decades. Join thousands of 
              satisfied customers who trust us with their forklift needs.
            </Typography>
            <Box sx={{ mt: 3 }}>
              <Typography variant="body2" color="text.secondary">
                🏆 Authorized dealer for major brands • 🔧 Certified technicians • 📞 Local support • 🚚 Ireland-wide delivery
              </Typography>
            </Box>
          </Paper>
        </Fade>
      </Container>
    </Box>
  );
};

export default ContactPage;