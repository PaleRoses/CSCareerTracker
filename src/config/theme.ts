"use client";

import { createTheme } from "@mui/material/styles";
import {
  colors,
  typography,
  radii,
  shadows,
  transitions,
  effects,
} from "@/design-system";

const theme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: colors.primary.DEFAULT,
    },
    secondary: {
      main: colors.secondary.DEFAULT,
    },
    success: {
      main: colors.success.DEFAULT,
    },
    warning: {
      main: colors.warning.DEFAULT,
    },
    error: {
      main: colors.error.DEFAULT,
    },
    background: {
      default: colors.background.DEFAULT,
      paper: colors.background.glass,
    },
    text: {
      primary: colors.text.primary,
      secondary: colors.text.secondary,
    },
  },
  typography: {
    fontFamily: typography.fontFamily.sans,
  },
  shape: {
    borderRadius: parseInt(radii.lg) || 14,
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          background: colors.background.glass,
          backdropFilter: effects.backdropFilter.glassSm,
          WebkitBackdropFilter: effects.backdropFilter.glassSm,
          boxShadow: shadows.card,
          transition: `box-shadow ${transitions.DEFAULT}`,
          "&:hover": {
            boxShadow: shadows.cardHover,
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          fontWeight: typography.fontWeight.semibold,
          transition: `all ${transitions.DEFAULT}`,
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          transition: `all ${transitions.DEFAULT}`,
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          transition: `all ${transitions.fast}`,
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          borderRight: "none",
        },
      },
    },
  },
});

export default theme;
