import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Box, CssBaseline, ThemeProvider, createTheme, Typography } from '@mui/material';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Mentors from './pages/Mentors';
import Mentees from './pages/Mentees';
import Programs from './pages/Programs';
import Sessions from './pages/Sessions';
import Analytics from './pages/Analytics';
import Payments from './pages/Payments';
import Reports from './pages/Reports';
import Support from './pages/Support';
import Settings from './pages/Settings';
import Sidebar from './components/Sidebar';

const theme = createTheme({
  palette: {
    primary: {
      main: '#667eea',
    },
    secondary: {
      main: '#764ba2',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 600,
        },
      },
    },
  },
});

// Component to sync activeTab with current location
const AppContent = ({ isAuthenticated, setIsAuthenticated }) => {
  const [activeTab, setActiveTab] = useState('/dashboard');
  const location = useLocation();

  // Sync activeTab with current location
  useEffect(() => {
    setActiveTab(location.pathname);
  }, [location.pathname]);

  const handleLogin = (credentials) => {
    console.log('Login successful:', credentials);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setActiveTab('/dashboard');
  };

  const handleTabChange = (path) => {
    setActiveTab(path);
  };

  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <Box sx={{ display: 'flex' }}>
      <Sidebar
        activeTab={activeTab}
        onTabChange={handleTabChange}
        onLogout={handleLogout}
      />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          background: '#f8f9fa',
          minHeight: '100vh',
          
        }}
      >
        <Routes>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/mentors" element={<Mentors />} />
          <Route path="/mentees" element={<Mentees />} />
          <Route path="/programs" element={<Programs />} />
          <Route path="/sessions" element={<Sessions />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/payments" element={<Payments />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/support" element={<Support />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Box>
    </Box>
  );
};

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <AppContent isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} />
      </Router>
    </ThemeProvider>
  );
}

export default App;
