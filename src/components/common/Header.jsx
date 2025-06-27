import React from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Container,
  Stack,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import {
  Menu as MenuIcon,
  Close as CloseIcon,
  Phone,
  Email,
  Home,
  Store,
  ContactPhone,
  AdminPanelSettings,
  Logout,
  Login,
} from "@mui/icons-material";
import { useApp } from "../../context/AppContext";
import Logo from "./Logo";

const Header = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const {
    navigateTo,
    isMenuOpen,
    setIsMenuOpen,
    isAuthenticated,
    handleLogout,
    setShowLoginModal,
  } = useApp();

  const menuItems = [
    { label: "Home", page: "home", icon: <Home /> },
    { label: "Products", page: "shop", icon: <Store /> },
    { label: "Contact", page: "contact", icon: <ContactPhone /> },
  ];

  if (isAuthenticated) {
    menuItems.push({
      label: "Admin",
      page: "admin",
      icon: <AdminPanelSettings />,
    });
  }

  return (
    <>
      {/* Top Contact Bar */}
      <Box sx={{ bgcolor: "grey.900", color: "white", py: 1 }}>
        <Container maxWidth="xl">
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            spacing={2}
          >
            <Stack direction="row" spacing={3} alignItems="center">
              <Button
                href="tel:+35351293208"
                startIcon={<Phone />}
                sx={{
                  color: "inherit",
                  textTransform: "none",
                  "&:hover": { color: "#ff8c00" },
                }}
                size="small"
              >
                +353 (0) 51 293 208
              </Button>
              {!isMobile && (
                <Button
                  href="mailto:sales@virgilpowerforklifts.com"
                  startIcon={<Email />}
                  sx={{
                    color: "inherit",
                    textTransform: "none",
                    "&:hover": { color: "#ff8c00" },
                  }}
                  size="small"
                >
                  sales@virgilpowerforklifts.com
                </Button>
              )}
            </Stack>

            <Box>
              {isAuthenticated ? (
                <Button
                  onClick={handleLogout}
                  startIcon={<Logout />}
                  sx={{
                    color: "error.light",
                    textTransform: "none",
                    fontSize: "0.875rem",
                  }}
                  size="small"
                >
                  Logout
                </Button>
              ) : (
                <Button
                  onClick={() => setShowLoginModal(true)}
                  startIcon={<Login />}
                  sx={{
                    color: "#ff8c00",
                    textTransform: "none",
                    fontSize: "0.875rem",
                  }}
                  size="small"
                >
                  Admin Login
                </Button>
              )}
            </Box>
          </Stack>
        </Container>
      </Box>

      {/* Main Navigation */}
      <AppBar position="sticky" color="inherit" elevation={2}>
        <Container maxWidth="xl">
          <Toolbar sx={{ py: 1 }}>
            {/* Logo */}
            <Box sx={{ mr: "auto" }}>
              <Logo
                height={{ xs: 40, sm: 48, md: 56 }}
                onClick={() => navigateTo("home")}
                sx={{
                  transition: "opacity 0.3s ease",
                  "&:hover": {
                    opacity: 0.8,
                  },
                }}
              />
            </Box>

            {/* Desktop Navigation */}
            {!isMobile && (
              <Stack direction="row" spacing={2} alignItems="center">
                {menuItems.map((item) => (
                  <Button
                    key={item.page}
                    onClick={() => navigateTo(item.page)}
                    startIcon={item.icon}
                    sx={{
                      color: item.page === "admin" ? "#ff8c00" : "text.primary",
                      fontWeight: item.page === "admin" ? "bold" : "normal",
                      "&:hover": {
                        bgcolor:
                          item.page === "admin"
                            ? "rgba(255, 140, 0, 0.1)"
                            : "rgba(0, 0, 0, 0.04)",
                      },
                    }}
                  >
                    {item.label}
                  </Button>
                ))}

                {/* CTA Button */}
                <Button
                  href="tel:+35351293208"
                  variant="contained"
                  startIcon={<Phone />}
                  sx={{
                    ml: 2,
                    bgcolor: "#ff8c00",
                    color: "white",
                    "&:hover": {
                      bgcolor: "#ff6b00",
                    },
                  }}
                >
                  Call Now
                </Button>
              </Stack>
            )}

            {/* Mobile Menu Button */}
            {isMobile && (
              <IconButton
                onClick={() => setIsMenuOpen(true)}
                edge="end"
                color="inherit"
                aria-label="menu"
              >
                <MenuIcon />
              </IconButton>
            )}
          </Toolbar>
        </Container>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer
        anchor="right"
        open={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        PaperProps={{
          sx: { width: 280, bgcolor: "background.default" },
        }}
      >
        <Box sx={{ p: 2 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 3,
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: "bold" }}>
              Menu
            </Typography>
            <IconButton onClick={() => setIsMenuOpen(false)}>
              <CloseIcon />
            </IconButton>
          </Box>

          <List>
            {menuItems.map((item) => (
              <ListItem
                key={item.page}
                button
                onClick={() => navigateTo(item.page)}
                sx={{
                  borderRadius: 2,
                  mb: 1,
                  bgcolor:
                    item.page === "admin"
                      ? "rgba(255, 140, 0, 0.1)"
                      : "transparent",
                }}
              >
                <ListItemIcon
                  sx={{ color: item.page === "admin" ? "#ff8c00" : "inherit" }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.label}
                  sx={{
                    "& .MuiTypography-root": {
                      fontWeight: item.page === "admin" ? "bold" : "normal",
                      color: item.page === "admin" ? "#ff8c00" : "inherit",
                    },
                  }}
                />
              </ListItem>
            ))}
          </List>

          <Box sx={{ mt: 3, p: 2 }}>
            <Button
              href="tel:+35351293208"
              variant="contained"
              fullWidth
              startIcon={<Phone />}
              size="large"
              sx={{
                bgcolor: "#ff8c00",
                color: "white",
                "&:hover": {
                  bgcolor: "#ff6b00",
                },
              }}
            >
              Call Now - Free Quote
            </Button>
          </Box>
        </Box>
      </Drawer>
    </>
  );
};

export default Header;
