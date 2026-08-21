// src/theme/theme.js

import { createTheme } from "@mui/material/styles";
import colors from "./colors";

const theme = createTheme({
  palette: {
    mode: "dark",

    primary: {
      main: colors.primary.main,
    },

    secondary: {
      main: colors.secondary.main,
    },

    background: {
      default: colors.background.default,
      paper: colors.background.paper,
    },

    text: {
      primary: colors.text.primary,
      secondary: colors.text.secondary,
    },

    success: {
      main: colors.success.main,
    },

    warning: {
      main: colors.warning.main,
    },

    error: {
      main: colors.error.main,
    },

    divider: colors.divider,
  },

  typography: {
    fontFamily: [
      "Poppins",
      "Roboto",
      "Arial",
      "sans-serif",
    ].join(","),

    h1: {
      fontSize: "3.5rem",
      fontWeight: 700,
    },

    h2: {
      fontSize: "2.8rem",
      fontWeight: 700,
    },

    h3: {
      fontSize: "2.2rem",
      fontWeight: 600,
    },

    h4: {
      fontSize: "1.8rem",
      fontWeight: 600,
    },

    h5: {
      fontSize: "1.4rem",
      fontWeight: 600,
    },

    h6: {
      fontSize: "1.2rem",
      fontWeight: 600,
    },

    body1: {
      fontSize: "1rem",
      lineHeight: 1.8,
    },

    body2: {
      fontSize: "0.95rem",
    },

    button: {
      textTransform: "none",
      fontWeight: 600,
    },
  },

  shape: {
    borderRadius: 14,
  },

  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          padding: "10px 24px",
          fontWeight: 600,
        },
      },
    },

    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: colors.background.paper,
          borderRadius: 16,
          boxShadow: "0 8px 24px rgba(0,0,0,0.3)",
        },
      },
    },

    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: "rgba(15,23,42,0.8)",
          backdropFilter: "blur(12px)",
          boxShadow: "none",
        },
      },
    },
  },
});

export default theme;