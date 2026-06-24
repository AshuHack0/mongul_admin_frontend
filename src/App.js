import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import { Provider } from "react-redux";
import { GoogleOAuthProvider } from "@react-oauth/google";
import store from "./store";
import { AuthGate } from "./layout/AuthGate";
import AppRoutes from "./routes/AppRoutes";
import { GOOGLE_CLIENT_ID } from "./config/google";

const theme = createTheme({
  palette: {
    primary: {
      main: "#18181b",
      light: "#52525b",
      dark: "#000000",
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#71717a",
      contrastText: "#ffffff",
    },
    background: {
      default: "#f5f5f5",
      paper: "#ffffff",
    },
    text: {
      primary: "#111111",
      secondary: "#6b7280",
    },
    divider: "#e5e5e5",
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h4: { fontWeight: 700 },
    h5: { fontWeight: 700 },
    h6: { fontWeight: 600 },
    subtitle1: { fontWeight: 500 },
    button: { fontWeight: 600, letterSpacing: 0 },
  },
  shape: {
    borderRadius: 8,
  },
  shadows: [
    "none",
    "0 1px 2px rgba(0,0,0,0.06)",
    "0 1px 4px rgba(0,0,0,0.08)",
    "0 2px 8px rgba(0,0,0,0.08)",
    "0 4px 12px rgba(0,0,0,0.08)",
    "0 4px 16px rgba(0,0,0,0.10)",
    ...Array(19).fill("none"),
  ],
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        "*": { boxSizing: "border-box" },
        body: { backgroundColor: "#f5f5f5" },
      },
    },
    MuiCard: {
      defaultProps: { elevation: 0 },
      styleOverrides: {
        root: {
          borderRadius: 8,
          border: "1px solid #e5e5e5",
          boxShadow: "none",
        },
      },
    },
    MuiPaper: {
      defaultProps: { elevation: 0 },
      styleOverrides: {
        root: {
          backgroundImage: "none",
          border: "1px solid #e5e5e5",
          borderRadius: 8,
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 6,
          textTransform: "none",
          fontWeight: 600,
          fontSize: "0.8125rem",
          boxShadow: "none",
          "&:hover": { boxShadow: "none" },
        },
        contained: {
          backgroundColor: "#18181b",
          color: "#ffffff",
          "&:hover": { backgroundColor: "#000000" },
        },
        outlined: {
          borderColor: "#d4d4d8",
          color: "#18181b",
          "&:hover": { borderColor: "#a1a1aa", backgroundColor: "#fafafa" },
        },
        text: {
          color: "#18181b",
          "&:hover": { backgroundColor: "#f4f4f5" },
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 6,
          backgroundColor: "#ffffff",
          "& .MuiOutlinedInput-notchedOutline": { borderColor: "#e5e5e5" },
          "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#a1a1aa" },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: "#18181b",
            borderWidth: 1.5,
          },
        },
        input: { padding: "10px 14px" },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: { fontSize: "0.875rem", color: "#6b7280" },
      },
    },
    MuiTableHead: {
      styleOverrides: {
        root: {
          "& .MuiTableCell-head": {
            backgroundColor: "#fafafa",
            color: "#52525b",
            fontWeight: 600,
            fontSize: "0.7rem",
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            borderBottom: "1px solid #e5e5e5",
            padding: "11px 16px",
          },
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderBottom: "1px solid #f4f4f5",
          padding: "13px 16px",
          fontSize: "0.875rem",
          color: "#111111",
        },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          "&:last-child td": { borderBottom: 0 },
          "&:hover": { backgroundColor: "#fafafa" },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 5,
          fontWeight: 600,
          fontSize: "0.7rem",
        },
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: { borderColor: "#e5e5e5" },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          borderRadius: 5,
          fontSize: "0.75rem",
          backgroundColor: "#111111",
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: { borderRadius: 10, border: "1px solid #e5e5e5" },
      },
    },
    MuiSelect: {
      styleOverrides: {
        icon: { color: "#6b7280" },
      },
    },
  },
});

function App() {
  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <AuthGate>
            <Router>
              <AppRoutes />
            </Router>
          </AuthGate>
        </ThemeProvider>
      </Provider>
    </GoogleOAuthProvider>
  );
}

export default App;
