import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Box, CssBaseline, ThemeProvider, createTheme, Typography, Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import { Computer, Smartphone } from '@mui/icons-material';
import AuthFlow from './pages/AuthFlow';
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
import Rooms from './pages/Rooms';
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
    MuiCssBaseline: {
      styleOverrides: `
        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(50px) scale(0.9);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
      `,
    },
  },
});

// Component to sync activeTab with current location
const AppContent = ({ isAuthenticated, setIsAuthenticated }) => {
  const [activeTab, setActiveTab] = useState('/dashboard');
  const [isMobile, setIsMobile] = useState(false);
  const [showMobileDialog, setShowMobileDialog] = useState(false);
  const location = useLocation();

  // Check if user is on mobile device
  // useEffect(() => {
  //   const checkMobile = () => {
  //     const userAgent = navigator.userAgent.toLowerCase();
  //     const isMobileDevice = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent);
  //     const isSmallScreen = window.innerWidth <= 568;
      
  //     if (isMobileDevice || isSmallScreen) {
  //       setIsMobile(true);
  //       setShowMobileDialog(true);
  //     }
  //   };

  //   checkMobile();
  //   window.addEventListener('resize', checkMobile);
    
  //   return () => window.removeEventListener('resize', checkMobile);
  // }, []);

  const handleCloseMobileDialog = () => {
    setShowMobileDialog(false);
  };

  // Sync activeTab with current location
  useEffect(() => {
    setActiveTab(location.pathname);
  }, [location.pathname]);

  const handleLoginSuccess = (data) => {
    console.log('Login successful:', data);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    // Clear stored data
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    setIsAuthenticated(false);
    setActiveTab('/dashboard');
  };

  const handleTabChange = (path) => {
    setActiveTab(path);
  };

  if (!isAuthenticated) {
    return <AuthFlow onLoginSuccess={handleLoginSuccess} />;
  }

  // Mobile warning dialog
  if (isMobile) {
    return (
      <Dialog 
        open={showMobileDialog} 
        onClose={handleCloseMobileDialog}
        maxWidth="sm"
        fullWidth
        sx={{
          '& .MuiDialog-paper': {
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: '20px',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.15)',
            maxWidth: '500px',
            width: '90%',
            margin: '20px',
            animation: 'slideInUp 0.4s ease-out'
          },
          '& .MuiBackdrop-root': {
            background: 'rgba(0, 0, 0, 0.6)',
            backdropFilter: 'blur(5px)'
          }
        }}
      >
        <DialogTitle sx={{ textAlign: 'center', p: 4, pb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2, justifyContent: 'center' }}>
            <Computer sx={{ fontSize: 40, color: '#667eea' }} />
            <Smartphone sx={{ fontSize: 40, color: '#f093fb' }} />
          </Box>
          <Typography variant="h5" sx={{ 
            fontWeight: 700, 
            color: '#2c3e50',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontSize: '1.75rem'
          }}>
            Desktop Access Required
          </Typography>
        </DialogTitle>
        <DialogContent sx={{ p: 4, pt: 0 }}>
          <Typography variant="body1" sx={{ mb: 2, color: '#64748b', lineHeight: 1.6 }}>
            The Mongul Admin Panel is designed for desktop use to provide the best experience with full functionality.
          </Typography>
          <Typography variant="body1" sx={{ mb: 3, color: '#64748b', lineHeight: 1.6 }}>
            Please access this panel from a desktop computer or laptop for optimal performance and complete feature access.
          </Typography>
          <Box sx={{ 
            p: 2, 
            background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)',
            borderRadius: 2,
            border: '1px solid rgba(102, 126, 234, 0.2)'
          }}>
            <Typography variant="body2" sx={{ fontWeight: 600, color: '#667eea', mb: 1 }}>
              💡 Recommended:
            </Typography>
            <Typography variant="body2" sx={{ color: '#64748b' }}>
              • Use a desktop computer or laptop<br/>
              • Ensure screen resolution of 1024px or higher<br/>
              • Use a modern web browser (Chrome, Firefox, Safari, Edge)
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 4, pt: 0, justifyContent: 'center' }}>
          <Button 
            onClick={handleCloseMobileDialog}
            variant="contained"
            sx={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              fontWeight: 600,
              px: 3,
              py: 1.5,
              borderRadius: 2,
              '&:hover': {
                background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)'
              }
            }}
          >
            I Understand
          </Button>
        </DialogActions>
      </Dialog>
    );
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
          <Route path="/rooms" element={<Rooms />} />
          <Route path="/" element={<Navigate to="/dashboard" replace />} /> 
          
        </Routes>
      </Box>
    </Box>
  );
};

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check for existing authentication on app load
  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    const user = localStorage.getItem('adminUser');
    
    if (token && user) {
      setIsAuthenticated(true);
    }
  }, []);

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
