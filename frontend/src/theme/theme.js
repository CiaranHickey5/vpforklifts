import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
  palette: {
    primary: {
      main: "#1976d2", // Blue for primary actions
      dark: "#115293",
      light: "#42a5f5",
    },
    secondary: {
      main: "#ff8c00", // Brand orange as secondary
      dark: "#e67c00",
      light: "#ffab40",
      contrastText: "#ffffff",
    },
    error: {
      main: "#d32f2f",
      light: "#ef5350",
      dark: "#c62828",
    },
    warning: {
      main: "#ff8c00", // Use brand orange
      light: "#ffab40",
      dark: "#e67c00",
    },
    info: {
      main: "#1976d2", // Use blue
      light: "#42a5f5",
      dark: "#115293",
    },
    success: {
      main: "#2e7d32",
      light: "#4caf50",
      dark: "#1b5e20",
    },
    grey: {
      50: "#fafafa",
      100: "#f5f5f5",
      200: "#eeeeee",
      300: "#e0e0e0",
      400: "#bdbdbd",
      500: "#9e9e9e",
      600: "#757575",
      700: "#616161",
      800: "#424242",
      900: "#212121",
    },
    background: {
      default: "#fafafa",
      paper: "#ffffff",
    },
    text: {
      primary: "#1a1a1a", // Dark black from logo
      secondary: "#555555",
      disabled: "#9e9e9e",
    },
    divider: "#e0e0e0",
    // Custom brand colors
    brand: {
      orange: {
        main: "#ff8c00",
        dark: "#e67c00",
        light: "#ffab40",
        lighter: "#ffe0b2",
      },
      black: {
        main: "#1a1a1a",
        light: "#333333",
        lighter: "#555555",
      },
      blue: {
        main: "#1976d2",
        dark: "#115293",
        light: "#42a5f5",
      },
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
      fontSize: "3rem",
      color: "#1a1a1a",
    },
    h2: {
      fontWeight: 600,
      fontSize: "2.5rem",
      color: "#1a1a1a",
    },
    h3: {
      fontWeight: 600,
      fontSize: "2rem",
      color: "#1a1a1a",
    },
    h4: {
      fontWeight: 600,
      fontSize: "1.5rem",
      color: "#1a1a1a",
    },
    h5: {
      fontWeight: 600,
      fontSize: "1.25rem",
      color: "#1a1a1a",
    },
    h6: {
      fontWeight: 600,
      fontSize: "1rem",
      color: "#1a1a1a",
    },
    button: {
      fontWeight: 600,
      textTransform: "none",
    },
    body1: {
      color: "#1a1a1a",
    },
    body2: {
      color: "#555555",
    },
  },
  shape: {
    borderRadius: 12,
  },
  shadows: [
    "none",
    "0px 1px 3px rgba(26, 26, 26, 0.12), 0px 1px 2px rgba(26, 26, 26, 0.24)",
    "0px 3px 6px rgba(26, 26, 26, 0.16), 0px 3px 6px rgba(26, 26, 26, 0.23)",
    "0px 10px 20px rgba(26, 26, 26, 0.19), 0px 6px 6px rgba(26, 26, 26, 0.23)",
    "0px 14px 28px rgba(26, 26, 26, 0.25), 0px 10px 10px rgba(26, 26, 26, 0.22)",
    "0px 19px 38px rgba(26, 26, 26, 0.30), 0px 15px 12px rgba(26, 26, 26, 0.22)",
    "0px 24px 46px rgba(26, 26, 26, 0.12)",
    "0px 24px 46px rgba(26, 26, 26, 0.12)",
    "0px 24px 46px rgba(26, 26, 26, 0.12)",
    "0px 24px 46px rgba(26, 26, 26, 0.12)",
    "0px 24px 46px rgba(26, 26, 26, 0.12)",
    "0px 24px 46px rgba(26, 26, 26, 0.12)",
    "0px 24px 46px rgba(26, 26, 26, 0.12)",
    "0px 24px 46px rgba(26, 26, 26, 0.12)",
    "0px 24px 46px rgba(26, 26, 26, 0.12)",
    "0px 24px 46px rgba(26, 26, 26, 0.12)",
    "0px 24px 46px rgba(26, 26, 26, 0.12)",
    "0px 24px 46px rgba(26, 26, 26, 0.12)",
    "0px 24px 46px rgba(26, 26, 26, 0.12)",
    "0px 24px 46px rgba(26, 26, 26, 0.12)",
    "0px 24px 46px rgba(26, 26, 26, 0.12)",
    "0px 24px 46px rgba(26, 26, 26, 0.12)",
    "0px 24px 46px rgba(26, 26, 26, 0.12)",
    "0px 24px 46px rgba(26, 26, 26, 0.12)",
    "0px 24px 46px rgba(26, 26, 26, 0.12)",
  ],
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          padding: "12px 24px",
          fontSize: "1rem",
          fontWeight: 600,
          textTransform: "none",
        },
        containedPrimary: {
          backgroundColor: "#1976d2",
          color: "#ffffff",
          boxShadow: "0 4px 12px rgba(25, 118, 210, 0.3)",
          "&:hover": {
            backgroundColor: "#115293",
            boxShadow: "0 6px 16px rgba(25, 118, 210, 0.4)",
          },
        },
        containedSecondary: {
          backgroundColor: "#ff8c00",
          color: "#ffffff",
          boxShadow: "0 4px 12px rgba(255, 140, 0, 0.3)",
          "&:hover": {
            backgroundColor: "#e67c00",
            boxShadow: "0 6px 16px rgba(255, 140, 0, 0.4)",
          },
        },
        outlinedPrimary: {
          borderColor: "#1976d2",
          color: "#1976d2",
          "&:hover": {
            backgroundColor: "rgba(25, 118, 210, 0.04)",
            borderColor: "#115293",
          },
        },
        outlinedSecondary: {
          borderColor: "#ff8c00",
          color: "#ff8c00",
          "&:hover": {
            backgroundColor: "rgba(255, 140, 0, 0.04)",
            borderColor: "#e67c00",
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: "0 4px 20px rgba(26, 26, 26, 0.1)",
          border: "1px solid rgba(224, 224, 224, 0.5)",
          "&:hover": {
            boxShadow: "0 8px 30px rgba(26, 26, 26, 0.15)",
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: "#ffffff",
          color: "#1a1a1a",
          boxShadow: "0 2px 10px rgba(26, 26, 26, 0.1)",
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 600,
        },
        colorPrimary: {
          backgroundColor: "#1976d2",
          color: "#ffffff",
          "&:hover": {
            backgroundColor: "#115293",
          },
        },
        colorSecondary: {
          backgroundColor: "#ff8c00",
          color: "#ffffff",
          "&:hover": {
            backgroundColor: "#e67c00",
          },
        },
        colorSuccess: {
          backgroundColor: "#2e7d32",
          color: "#ffffff",
        },
        colorWarning: {
          backgroundColor: "#ff8c00",
          color: "#ffffff",
        },
        outlined: {
          borderWidth: 2,
          fontWeight: 600,
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        standardWarning: {
          backgroundColor: "#ffe0b2",
          color: "#1a1a1a",
          "& .MuiAlert-icon": {
            color: "#ff8c00",
          },
        },
        standardInfo: {
          backgroundColor: "#e3f2fd",
          color: "#1a1a1a",
          "& .MuiAlert-icon": {
            color: "#1976d2",
          },
        },
      },
    },
    MuiAvatar: {
      styleOverrides: {
        root: {
          backgroundColor: "#1a1a1a",
          color: "#ff8c00",
          fontWeight: 600,
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            "&:hover .MuiOutlinedInput-notchedOutline": {
              borderColor: "#ff8c00",
            },
            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
              borderColor: "#ff8c00",
            },
          },
          "& .MuiInputLabel-root.Mui-focused": {
            color: "#ff8c00",
          },
        },
      },
    },
    MuiLinearProgress: {
      styleOverrides: {
        colorPrimary: {
          backgroundColor: "#e0e0e0",
          "& .MuiLinearProgress-bar": {
            backgroundColor: "#ff8c00",
          },
        },
      },
    },
    MuiFab: {
      styleOverrides: {
        primary: {
          backgroundColor: "#ff8c00",
          color: "#ffffff",
          "&:hover": {
            backgroundColor: "#e67c00",
          },
        },
      },
    },
    MuiToggleButton: {
      styleOverrides: {
        root: {
          "&.Mui-selected": {
            backgroundColor: "#ff8c00",
            color: "#ffffff",
            "&:hover": {
              backgroundColor: "#e67c00",
            },
          },
        },
      },
    },
  },
});
