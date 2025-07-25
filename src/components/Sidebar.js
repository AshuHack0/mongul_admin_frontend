import React from 'react';
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
  Chip
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
  TrendingUp
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

  const handleNavigation = (path) => {
    onTabChange(path);
    navigate(path);
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
          background: 'linear-gradient(180deg, #1a237e 0%, #283593 50%, #3949ab 100%)',
          color: 'white',
          border: 'none',
        },
      }}
    >
      <Box sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Avatar
            sx={{
              width: 50,
              height: 50,
              background: 'linear-gradient(45deg, #ff6b6b, #ee5a24)',
              mr: 2,
            }}
          >
            M
          </Avatar>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Mongul Admin
            </Typography>
            <Chip
              label="Admin"
              size="small"
              sx={{
                background: 'rgba(255, 255, 255, 0.2)',
                color: 'white',
                fontSize: '0.7rem',
              }}
            />
          </Box>
        </Box>
        
        <Typography variant="body2" sx={{ opacity: 0.8, mb: 3 }}>
          Welcome back, Administrator
        </Typography>
      </Box>

      <Divider sx={{ background: 'rgba(255, 255, 255, 0.1)' }} />

      <List sx={{ px: 2, py: 1 }}>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding sx={{ mb: 1 }}>
            <ListItemButton
              onClick={() => handleNavigation(item.path)}
              selected={activeTab === item.path}
              sx={{
                borderRadius: 2,
                '&.Mui-selected': {
                  background: 'rgba(255, 255, 255, 0.15)',
                  '&:hover': {
                    background: 'rgba(255, 255, 255, 0.2)',
                  },
                },
                '&:hover': {
                  background: 'rgba(255, 255, 255, 0.1)',
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
                  },
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      <Box sx={{ mt: 'auto', p: 2 }}>
        <Divider sx={{ background: 'rgba(255, 255, 255, 0.1)', mb: 2 }} />
        <ListItem disablePadding>
          <ListItemButton
            onClick={onLogout}
            sx={{
              borderRadius: 2,
              '&:hover': {
                background: 'rgba(255, 255, 255, 0.1)',
              },
            }}
          >
            <ListItemIcon sx={{ color: 'white', minWidth: 40 }}>
              <Logout />
            </ListItemIcon>
            <ListItemText primary="Logout" />
          </ListItemButton>
        </ListItem>
      </Box>
    </Drawer>
  );
};

export default Sidebar; 