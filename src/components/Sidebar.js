import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Box,
  Typography,
  Divider,
  Avatar,
  Chip,
  Alert,
  Paper,
  LinearProgress,
  Tooltip
} from '@mui/material';
import {
  Dashboard,
  People,
  School,
  Assessment,
  Settings,
  Notifications,
  Analytics,
  Group,
  Payment,
  Support,
  Logout,
  Book,
  Schedule,
  TrendingUp,
  AccessTime,
  Warning,
  Timer,
  Security,
  VerifiedUser,
  Language,
  Computer,
  Wifi,
  LocationOn,
  Info
} from '@mui/icons-material';

const drawerWidth = 280;

const menuItems = [
  { text: 'Dashboard', icon: <Dashboard />, path: '/dashboard' },
  { text: 'Mentors', icon: <School />, path: '/mentors' },
  { text: 'Mentees', icon: <People />, path: '/mentees' },
  // { text: 'Programs', icon: <Book />, path: '/programs' },
  // { text: 'Sessions', icon: <Schedule />, path: '/sessions' },
  // { text: 'Analytics', icon: <Analytics />, path: '/analytics' },
  // { text: 'Payments', icon: <Payment />, path: '/payments' },
  // { text: 'Reports', icon: <Assessment />, path: '/reports' },
  // { text: 'Support', icon: <Support />, path: '/support' },
  // { text: 'Settings', icon: <Settings />, path: '/settings' },
];

const Sidebar = ({ activeTab, onTabChange, onLogout }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [sessionTime, setSessionTime] = useState(0);
  const [tokenExpiry, setTokenExpiry] = useState(null);
  const [showExpiryWarning, setShowExpiryWarning] = useState(false);
  const [systemInfo, setSystemInfo] = useState({
    ip: 'Loading...',
    browser: '',
    os: '',
    screenResolution: '',
    timezone: '',
    language: '',
    city: '',
    country: '',
    isp: ''
  });

  // Get system information
  useEffect(() => {
    const getSystemInfo = async () => {
      try {
        // Get IP address
        const ipResponse = await fetch('https://api.ipify.org?format=json');
        const ipData = await ipResponse.json();
        
        // Get detailed IP info
        const geoResponse = await fetch(`https://ipapi.co/${ipData.ip}/json/`);
        const geoData = await geoResponse.json();

        setSystemInfo({
          ip: ipData.ip,
          browser: getBrowserInfo(),
          os: getOSInfo(),
          screenResolution: `${window.screen.width}x${window.screen.height}`,
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          language: navigator.language,
          city: geoData.city || 'Unknown',
          country: geoData.country_name || 'Unknown',
          isp: geoData.org || 'Unknown'
        });
      } catch (error) {
        console.log('Error fetching IP info:', error);
        setSystemInfo({
          ip: '192.168.1.1',
          browser: getBrowserInfo(),
          os: getOSInfo(),
          screenResolution: `${window.screen.width}x${window.screen.height}`,
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          language: navigator.language,
          city: 'Local Network',
          country: 'Local',
          isp: 'Local ISP'
        });
      }
    };

    getSystemInfo();
  }, []);

  const getBrowserInfo = () => {
    const userAgent = navigator.userAgent;
    if (userAgent.includes('Chrome')) return 'Chrome';
    if (userAgent.includes('Firefox')) return 'Firefox';
    if (userAgent.includes('Safari')) return 'Safari';
    if (userAgent.includes('Edge')) return 'Edge';
    return 'Unknown Browser';
  };

  const getOSInfo = () => {
    const userAgent = navigator.userAgent;
    if (userAgent.includes('Windows')) return 'Windows';
    if (userAgent.includes('Mac')) return 'macOS';
    if (userAgent.includes('Linux')) return 'Linux';
    if (userAgent.includes('Android')) return 'Android';
    if (userAgent.includes('iOS')) return 'iOS';
    return 'Unknown OS';
  };

  // Load user data on component mount
  useEffect(() => {
    const userData = localStorage.getItem('adminUser');
    const token = localStorage.getItem('adminToken');
    
    if (userData) {
      setUser(JSON.parse(userData));
    }

    // Set session start time
    const sessionStart = localStorage.getItem('sessionStart');
    if (!sessionStart) {
      localStorage.setItem('sessionStart', Date.now().toString());
    }

    // Calculate token expiry (assuming 24 hours from login)
    if (token) {
      const loginTime = localStorage.getItem('loginTime') || Date.now();
      const expiryTime = parseInt(loginTime) + (24 * 60 * 60 * 1000); // 24 hours
      setTokenExpiry(expiryTime);
    }
  }, []);

  // Update session timer and check token expiry
  useEffect(() => {
    const interval = setInterval(() => {
      // Update session time
      const sessionStart = localStorage.getItem('sessionStart');
      if (sessionStart) {
        const elapsed = Math.floor((Date.now() - parseInt(sessionStart)) / 1000);
        setSessionTime(elapsed);
      }

      // Check token expiry
      if (tokenExpiry) {
        const timeLeft = tokenExpiry - Date.now();
        if (timeLeft <= 0) {
          // Token expired, logout
          handleLogout();
        } else if (timeLeft <= 5 * 60 * 1000) { // 5 minutes warning
          setShowExpiryWarning(true);
        }
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [tokenExpiry]);

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const formatTimeLeft = (milliseconds) => {
    const hours = Math.floor(milliseconds / (1000 * 60 * 60));
    const minutes = Math.floor((milliseconds % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((milliseconds % (1000 * 60)) / 1000);
    
    if (hours > 0) {
      return `${hours}h ${minutes}m ${seconds}s`;
    } else if (minutes > 0) {
      return `${minutes}m ${seconds}s`;
    } else {
      return `${seconds}s`;
    }
  };

  const getExpiryColor = (milliseconds) => {
    if (milliseconds <= 5 * 60 * 1000) return '#f44336'; // Red for < 5 min
    if (milliseconds <= 30 * 60 * 1000) return '#ff9800'; // Orange for < 30 min
    if (milliseconds <= 60 * 60 * 1000) return '#ffc107'; // Yellow for < 1 hour
    return '#4caf50'; // Green for > 1 hour
  };

  const getExpiryProgress = (milliseconds) => {
    const totalTime = 24 * 60 * 60 * 1000; // 24 hours
    const remaining = Math.max(0, milliseconds);
    return (remaining / totalTime) * 100;
  };

  const handleNavigation = (path) => {
    onTabChange(path);
    navigate(path);
  };

  const handleLogout = () => {
    // Clear all stored data
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    localStorage.removeItem('sessionStart');
    localStorage.removeItem('loginTime');
    
    // Call the logout callback
    onLogout();
  };

  const getInitials = (name) => {
    if (!name) return 'A';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const getAccessLevelColor = (level) => {
    switch (level) {
      case 'superadmin':
        return 'linear-gradient(135deg, #ff6b6b 0%, #ee5a24 50%, #ff4757 100%)';
      case 'admin':
        return 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #667eea 100%)';
      default:
        return 'linear-gradient(135deg, #4caf50 0%, #45a049 50%, #4caf50 100%)';
    }
  };

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
          background: 'linear-gradient(180deg, #1a237e 0%, #283593 30%, #3949ab 70%, #3f51b5 100%)',
          color: 'white',
          border: 'none',
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.03"%3E%3Ccircle cx="30" cy="30" r="2"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
            pointerEvents: 'none',
          },
        },
      }}
    >
      {/* Animated background elements */}
      <Box
        sx={{
          position: 'absolute',
          top: '10%',
          right: '-20px',
          width: '100px',
          height: '100px',
          background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)',
          borderRadius: '50%',
          animation: 'float 6s ease-in-out infinite',
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          bottom: '20%',
          left: '-30px',
          width: '150px',
          height: '150px',
          background: 'radial-gradient(circle, rgba(255,255,255,0.05) 0%, transparent 70%)',
          borderRadius: '50%',
          animation: 'float 8s ease-in-out infinite reverse',
        }}
      />

      <Box sx={{ p: 3, position: 'relative', zIndex: 1 }}>
        {/* User Profile Section with Enhanced Styling */}
        <Box 
          sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            mb: 3,
            p: 2,
            background: 'rgba(255, 255, 255, 0.1)',
            borderRadius: 3,
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
          }}
        >
          <Avatar
            sx={{
              width: 60,
              height: 60,
              background: user ? getAccessLevelColor(user.accessLevel) : 'linear-gradient(135deg, #ff6b6b, #ee5a24)',
              mr: 2,
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
              border: '3px solid rgba(255, 255, 255, 0.3)',
              animation: 'pulse 2s ease-in-out infinite',
            }}
          >
            {user ? getInitials(user.fullName) : 'A'}
          </Avatar>
          <Box sx={{ flex: 1 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5 }}>
              {user ? user.fullName : 'Admin User'}
            </Typography>
            <Chip
              icon={<VerifiedUser sx={{ fontSize: 16 }} />}
              label={user ? user.accessLevel : 'Admin'}
              size="small"
              sx={{
                background: 'rgba(255, 255, 255, 0.2)',
                color: 'white',
                fontSize: '0.7rem',
                textTransform: 'capitalize',
                fontWeight: 600,
                border: '1px solid rgba(255, 255, 255, 0.3)',
                '& .MuiChip-icon': { color: 'white' },
              }}
            />
          </Box>
        </Box>
        
        {user && user.email && (
          <Box 
            sx={{ 
              mb: 2, 
              p: 1.5,
              background: 'rgba(255, 255, 255, 0.05)',
              borderRadius: 2,
              border: '1px solid rgba(255, 255, 255, 0.1)',
            }}
          >
            <Typography variant="body2" sx={{ opacity: 0.9, textAlign: 'center' }}>
              {user.email}
            </Typography>
          </Box>
        )}

        <Typography variant="body2" sx={{ opacity: 0.8, mb: 3, textAlign: 'center' }}>
          Welcome back, {user ? user.fullName?.split(' ')[0] || 'Administrator' : 'Administrator'}
        </Typography>

        {/* System Information Section */}
        <Paper 
          elevation={0}
          sx={{ 
            p: 2, 
            mb: 2, 
            background: 'rgba(255, 255, 255, 0.08)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            borderRadius: 3,
            backdropFilter: 'blur(10px)',
            color: 'white',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
            <Computer sx={{ fontSize: 18, mr: 1.5, opacity: 0.9, color: 'white' }} />
            <Typography variant="caption" sx={{ opacity: 0.8, fontWeight: 600, color: 'white' }}>
              System Information
            </Typography>
          </Box>
          
          {/* IP Address */}
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <Wifi sx={{ fontSize: 14, mr: 1, opacity: 0.7, color: 'white' }} />
            <Typography variant="caption" sx={{ opacity: 0.7, mr: 1, color: 'white' }}>
              IP:
            </Typography>
            <Typography variant="caption" sx={{ fontWeight: 600, fontFamily: 'monospace', color: 'white' }}>
              {systemInfo.ip}
            </Typography>
          </Box>

          {/* Location */}
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <LocationOn sx={{ fontSize: 14, mr: 1, opacity: 0.7, color: 'white' }} />
            <Typography variant="caption" sx={{ opacity: 0.7, mr: 1, color: 'white' }}>
              Location:
            </Typography>
            <Typography variant="caption" sx={{ fontWeight: 600, color: 'white' }}>
              {systemInfo.city}, {systemInfo.country}
            </Typography>
          </Box>

          {/* Browser & OS */}
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <Language sx={{ fontSize: 14, mr: 1, opacity: 0.7, color: 'white' }} />
            <Typography variant="caption" sx={{ opacity: 0.7, mr: 1, color: 'white' }}>
              Browser:
            </Typography>
            <Typography variant="caption" sx={{ fontWeight: 600, color: 'white' }}>
              {systemInfo.browser} on {systemInfo.os}
            </Typography>
          </Box>

          {/* Screen Resolution */}
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <Info sx={{ fontSize: 14, mr: 1, opacity: 0.7, color: 'white' }} />
            <Typography variant="caption" sx={{ opacity: 0.7, mr: 1, color: 'white' }}>
              Resolution:
            </Typography>
            <Typography variant="caption" sx={{ fontWeight: 600, fontFamily: 'monospace', color: 'white' }}>
              {systemInfo.screenResolution}
            </Typography>
          </Box>

          {/* Timezone */}
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <AccessTime sx={{ fontSize: 14, mr: 1, opacity: 0.7, color: 'white' }} />
            <Typography variant="caption" sx={{ opacity: 0.7, mr: 1, color: 'white' }}>
              Timezone:
            </Typography>
            <Typography variant="caption" sx={{ fontWeight: 600, color: 'white' }}>
              {systemInfo.timezone}
            </Typography>
          </Box>
        </Paper>

        {/* Session Timer with Enhanced Design */}
        <Box 
          sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            mb: 2,
            p: 1.5,
            background: 'rgba(255, 255, 255, 0.08)',
            borderRadius: 2,
            border: '1px solid rgba(255, 255, 255, 0.15)',
          }}
        >
          <AccessTime sx={{ fontSize: 18, mr: 1.5, opacity: 0.9 }} />
          <Box sx={{ flex: 1 }}>
            <Typography variant="caption" sx={{ opacity: 0.7, display: 'block' }}>
              Session Duration
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 600, fontFamily: 'monospace' }}>
              {formatTime(sessionTime)}
            </Typography>
          </Box>
        </Box>

        {/* Token Expiry Display with Progress Bar */}
        {tokenExpiry && (
          <Paper 
            elevation={0}
            sx={{ 
              p: 2, 
              mb: 2, 
              background: 'rgba(255, 255, 255, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: 3,
              backdropFilter: 'blur(10px)',
              position: 'relative',
              overflow: 'hidden',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '3px',
                background: `linear-gradient(90deg, ${getExpiryColor(tokenExpiry - Date.now())} 0%, ${getExpiryColor(tokenExpiry - Date.now())} ${getExpiryProgress(tokenExpiry - Date.now())}%, rgba(255,255,255,0.1) ${getExpiryProgress(tokenExpiry - Date.now())}%, rgba(255,255,255,0.1) 100%)`,
              }
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
              <Timer sx={{ fontSize: 18, mr: 1.5, opacity: 0.9 }} />
              <Typography variant="caption" sx={{ opacity: 0.8, fontWeight: 600 }}>
                Token Expires In:
              </Typography>
            </Box>
            <Typography 
              variant="h5" 
              sx={{ 
                fontWeight: 700,
                color: getExpiryColor(tokenExpiry - Date.now()),
                textAlign: 'center',
                fontFamily: 'monospace',
                textShadow: '0 2px 4px rgba(0,0,0,0.3)',
                mb: 1,
              }}
            >
              {formatTimeLeft(tokenExpiry - Date.now())}
            </Typography>
            <LinearProgress 
              variant="determinate" 
              value={getExpiryProgress(tokenExpiry - Date.now())}
              sx={{
                height: 4,
                borderRadius: 2,
                backgroundColor: 'rgba(255,255,255,0.1)',
                '& .MuiLinearProgress-bar': {
                  background: `linear-gradient(90deg, ${getExpiryColor(tokenExpiry - Date.now())}, ${getExpiryColor(tokenExpiry - Date.now())}dd)`,
                  borderRadius: 2,
                }
              }}
            />
          </Paper>
        )}

        {/* Token Expiry Warning with Enhanced Styling */}
        {showExpiryWarning && tokenExpiry && (
          <Alert 
            severity="warning" 
            icon={<Warning sx={{ fontSize: 20 }} />}
            sx={{ 
              mb: 2, 
              fontSize: '0.7rem',
              background: 'rgba(255, 152, 0, 0.1)',
              border: '1px solid rgba(255, 152, 0, 0.3)',
              borderRadius: 2,
              '& .MuiAlert-message': { fontSize: '0.7rem' },
              animation: 'pulse 1s ease-in-out infinite',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography variant="caption" sx={{ fontWeight: 600 }}>
                Token expires in {formatTimeLeft(tokenExpiry - Date.now())}
              </Typography>
            </Box>
          </Alert>
        )}

        {/* Active Status with Enhanced Design */}
        <Box 
          sx={{ 
            display: 'flex', 
            alignItems: 'center',
            p: 1.5,
            background: 'rgba(76, 175, 80, 0.1)',
            borderRadius: 2,
            border: '1px solid rgba(76, 175, 80, 0.3)',
          }}
        >
          <Box
            sx={{
              width: 10,
              height: 10,
              borderRadius: '50%',
              background: 'linear-gradient(45deg, #4caf50, #45a049)',
              mr: 1.5,
              animation: 'pulse 2s infinite',
              boxShadow: '0 0 10px rgba(76, 175, 80, 0.5)',
            }}
          />
          <Typography variant="caption" sx={{ opacity: 0.9, fontWeight: 600 }}>
            Active Session
          </Typography>
        </Box>
      </Box>

      <Divider sx={{ background: 'rgba(255, 255, 255, 0.1)', mx: 2 }} />

      {/* Navigation Menu with Enhanced Styling */}
      <List sx={{ px: 2, py: 1, position: 'relative', zIndex: 1 }}>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding sx={{ mb: 1 }}>
            <ListItemButton
              onClick={() => handleNavigation(item.path)}
              selected={activeTab === item.path}
              sx={{
                borderRadius: 2,
                transition: 'all 0.3s ease',
                '&.Mui-selected': {
                  background: 'rgba(255, 255, 255, 0.15)',
                  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)',
                  transform: 'translateX(5px)',
                  '&:hover': {
                    background: 'rgba(255, 255, 255, 0.2)',
                  },
                },
                '&:hover': {
                  background: 'rgba(255, 255, 255, 0.1)',
                  transform: 'translateX(3px)',
                },
              }}
            >
              <ListItemIcon sx={{ color: 'white', minWidth: 40 }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={item.text}
                sx={{
                  '& .MuiListItemText-primary': {
                    fontWeight: activeTab === item.path ? 600 : 400,
                    transition: 'font-weight 0.3s ease',
                  },
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      {/* Logout Section with Enhanced Styling */}
      <Box sx={{ mt: 'auto', p: 2, position: 'relative', zIndex: 1 }}>
        <Divider sx={{ background: 'rgba(255, 255, 255, 0.1)', mb: 2 }} />
        <ListItem disablePadding>
          <ListItemButton
            onClick={handleLogout}
            sx={{
              borderRadius: 2,
              background: 'rgba(244, 67, 54, 0.1)',
              border: '1px solid rgba(244, 67, 54, 0.3)',
              transition: 'all 0.3s ease',
              '&:hover': {
                background: 'rgba(244, 67, 54, 0.2)',
                transform: 'translateY(-2px)',
                boxShadow: '0 4px 20px rgba(244, 67, 54, 0.3)',
              },
            }}
          >
            <ListItemIcon sx={{ color: '#f44336', minWidth: 40 }}>
              <Logout />
            </ListItemIcon>
            <ListItemText 
              primary="Logout" 
              sx={{
                '& .MuiListItemText-primary': {
                  fontWeight: 600,
                  color: '#f44336',
                }
              }}
            />
          </ListItemButton>
        </ListItem>
      </Box>

      <style>
        {`
          @keyframes pulse {
            0% { opacity: 1; transform: scale(1); }
            50% { opacity: 0.7; transform: scale(1.05); }
            100% { opacity: 1; transform: scale(1); }
          }
          
          @keyframes float {
            0%, 100% { transform: translateY(0px) rotate(0deg); opacity: 0.5; }
            50% { transform: translateY(-20px) rotate(180deg); opacity: 0.8; }
          }
        `}
      </style>
    </Drawer>
  );
};

export default Sidebar; 