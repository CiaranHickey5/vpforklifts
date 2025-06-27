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
      content: "Waterford, Ireland",
      description: "Serving all of Ireland",
      color: "secondary",
    },
  ];

  const benefits = [
    "25+ years of experience",
    "Largest forklift inventory in Ireland",
    "Same-day delivery available",
    "24/7 emergency support",
    "Competitive pricing guaranteed",
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
            background: "linear-gradient(135deg, #1976d2 0%, #ff8c00 100%)",
            color: "white",
            p: 4,
            mb: 6,
            borderRadius: 3,
          }}
        >
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <Card
                sx={{
                  bgcolor: "rgba(255,255,255,0.15)",
                  backdropFilter: "blur(10px)",
                  color: "white",
                  textAlign: "center",
                  cursor: "pointer",
                  transition: "transform 0.3s ease",
                  border: "1px solid rgba(255,255,255,0.2)",
                  "&:hover": {
                    transform: "translateY(-4px)",
                    bgcolor: "rgba(255,255,255,0.2)",
                  },
                }}
                component="a"
                href="tel:+35351293208"
              >
                <CardContent>
                  <Phone sx={{ fontSize: 40, mb: 2 }} />
                  <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1 }}>
                    Call Us Now
                  </Typography>
                  <Typography variant="h5" sx={{ fontWeight: "bold" }}>
                    +353 51 293 208
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.8, mt: 1 }}>
                    Available 7 days a week
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={4}>
              <Card
                sx={{
                  bgcolor: "rgba(255,255,255,0.15)",
                  backdropFilter: "blur(10px)",
                  color: "white",
                  textAlign: "center",
                  cursor: "pointer",
                  transition: "transform 0.3s ease",
                  border: "1px solid rgba(255,255,255,0.2)",
                  "&:hover": {
                    transform: "translateY(-4px)",
                    bgcolor: "rgba(255,255,255,0.2)",
                  },
                }}
                component="a"
                href="mailto:sales@virgilpowerforklifts.com"
              >
                <CardContent>
                  <Email sx={{ fontSize: 40, mb: 2 }} />
                  <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1 }}>
                    Email Us
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                    sales@virgilpowerforklifts.com
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.8, mt: 1 }}>
                    We reply within 2 hours
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={4}>
              <Card
                sx={{
                  bgcolor: "rgba(255,255,255,0.15)",
                  backdropFilter: "blur(10px)",
                  color: "white",
                  textAlign: "center",
                  border: "1px solid rgba(255,255,255,0.2)",
                }}
              >
                <CardContent>
                  <LocationOn sx={{ fontSize: 40, mb: 2 }} />
                  <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1 }}>
                    Visit Us
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                    Waterford, Ireland
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.8, mt: 1 }}>
                    All Ireland coverage
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Paper>

        <Grid container spacing={6}>
          {/* Contact Information */}
          <Grid item xs={12} lg={4}>
            <Stack spacing={4}>
              {/* Contact Details */}
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
                      <Stack
                        direction="row"
                        spacing={2}
                        alignItems="flex-start"
                      >
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

              {/* Why Choose Us - FIXED: Updated background color */}
              <Card
                elevation={2}
                sx={{ bgcolor: "primary.50", border: "1px solid #1976d2" }}
              >
                <CardContent sx={{ p: 4 }}>
                  <Stack
                    direction="row"
                    spacing={1}
                    alignItems="center"
                    sx={{ mb: 3 }}
                  >
                    <Star sx={{ color: "#ff8c00" }} />
                    <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                      Why Choose Virgil Power?
                    </Typography>
                  </Stack>

                  <Stack spacing={2}>
                    {benefits.map((benefit, index) => (
                      <Stack
                        key={index}
                        direction="row"
                        spacing={1}
                        alignItems="center"
                      >
                        <CheckCircle sx={{ color: "#ff8c00", fontSize: 20 }} />
                        <Typography
                          variant="body2"
                          sx={{ fontWeight: "medium" }}
                        >
                          {benefit}
                        </Typography>
                      </Stack>
                    ))}
                  </Stack>
                </CardContent>
              </Card>
            </Stack>
          </Grid>

          {/* Contact Form */}
          <Grid item xs={12} lg={8}>
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
                      <TextField
                        label="Service Needed"
                        select
                        variant="outlined"
                        fullWidth
                        value={formData.service}
                        onChange={handleInputChange("service")}
                        SelectProps={{ native: true }}
                      >
                        <option value="">Select a service...</option>
                        <option value="purchase">Forklift Purchase</option>
                        <option value="rental">Forklift Rental/Hire</option>
                        <option value="service">Service & Repair</option>
                        <option value="general">General Inquiry</option>
                      </TextField>
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

                {/* Emergency Contact - FIXED: Updated styling */}
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
                    Forklift broken down and need immediate replacement? Call
                    our emergency line: <strong>+353 87 250 1934</strong>
                  </Typography>
                </Alert>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default ContactPage;
