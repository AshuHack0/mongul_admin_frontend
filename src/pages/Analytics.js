import React from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  LinearProgress,
  Avatar,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Divider,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  People,
  ShoppingCart,
  AttachMoney,
  Visibility,
  BarChart,
  PieChart,
  Timeline,
  Download,
  FilterList
} from '@mui/icons-material';

const Analytics = () => {
  const metrics = [
    {
      title: 'Total Revenue',
      value: '$125,430',
      change: 12.5,
      trend: 'up',
      icon: <AttachMoney />,
      color: '#4caf50'
    },
    {
      title: 'Total Orders',
      value: '2,847',
      change: 8.2,
      trend: 'up',
      icon: <ShoppingCart />,
      color: '#2196f3'
    },
    {
      title: 'Active Users',
      value: '1,234',
      change: -3.1,
      trend: 'down',
      icon: <People />,
      color: '#ff9800'
    },
    {
      title: 'Page Views',
      value: '45,678',
      change: 15.7,
      trend: 'up',
      icon: <Visibility />,
      color: '#f44336'
    }
  ];

  const topProducts = [
    { name: 'Product A', sales: 234, revenue: 12340, growth: 12.5 },
    { name: 'Product B', sales: 189, revenue: 9870, growth: 8.3 },
    { name: 'Product C', sales: 156, revenue: 7560, growth: -2.1 },
    { name: 'Product D', sales: 134, revenue: 6540, growth: 15.7 },
    { name: 'Product E', sales: 98, revenue: 4320, growth: 5.2 }
  ];

  const recentActivity = [
    { action: 'New order placed', user: 'John Doe', time: '2 minutes ago', type: 'order' },
    { action: 'User registered', user: 'Sarah Wilson', time: '5 minutes ago', type: 'user' },
    { action: 'Payment received', user: 'Mike Johnson', time: '10 minutes ago', type: 'payment' },
    { action: 'Product added', user: 'Admin', time: '15 minutes ago', type: 'product' }
  ];

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 700 }}>
          Analytics Dashboard
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <FormControl size="small">
            <InputLabel>Time Period</InputLabel>
            <Select value="7d" label="Time Period">
              <MenuItem value="1d">Last 24 Hours</MenuItem>
              <MenuItem value="7d">Last 7 Days</MenuItem>
              <MenuItem value="30d">Last 30 Days</MenuItem>
              <MenuItem value="90d">Last 90 Days</MenuItem>
            </Select>
          </FormControl>
          <Button variant="outlined" startIcon={<Download />}>
            Export Data
          </Button>
        </Box>
      </Box>

      {/* Key Metrics */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        {metrics.map((metric, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <Box>
                    <Typography color="textSecondary" gutterBottom variant="body2">
                      {metric.title}
                    </Typography>
                    <Typography variant="h4" component="div" sx={{ fontWeight: 700, mb: 1 }}>
                      {metric.value}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      {metric.trend === 'up' ? (
                        <TrendingUp sx={{ color: 'success.main', fontSize: 16 }} />
                      ) : (
                        <TrendingDown sx={{ color: 'error.main', fontSize: 16 }} />
                      )}
                      <Typography
                        variant="body2"
                        sx={{
                          color: metric.trend === 'up' ? 'success.main' : 'error.main',
                          fontWeight: 600,
                        }}
                      >
                        {metric.change}%
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        vs last period
                      </Typography>
                    </Box>
                  </Box>
                  <Avatar
                    sx={{
                      background: metric.color,
                      width: 56,
                      height: 56,
                    }}
                  >
                    {metric.icon}
                  </Avatar>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3}>
        {/* Sales Chart */}
        <Grid item xs={12} md={8}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Sales Overview
                </Typography>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button size="small" startIcon={<BarChart />}>
                    Bar
                  </Button>
                  <Button size="small" startIcon={<Timeline />}>
                    Line
                  </Button>
                  <Button size="small" startIcon={<PieChart />}>
                    Pie
                  </Button>
                </Box>
              </Box>
              
              {/* Placeholder for chart */}
              <Box
                sx={{
                  height: 300,
                  background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
                  borderRadius: 2,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#666',
                  fontSize: '1.2rem'
                }}
              >
                📊 Interactive Chart Component
                <br />
                <Typography variant="body2" sx={{ mt: 1 }}>
                  Chart.js or Recharts integration would go here
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Top Products */}
        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                Top Products
              </Typography>
              <List sx={{ p: 0 }}>
                {topProducts.map((product, index) => (
                  <React.Fragment key={index}>
                    <ListItem sx={{ px: 0 }}>
                      <ListItemAvatar>
                        <Avatar sx={{ background: '#667eea', fontSize: '0.8rem' }}>
                          {index + 1}
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={product.name}
                        secondary={
                          <Box>
                            <Typography variant="body2" color="textSecondary">
                              {product.sales} sales • ${product.revenue}
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                              {product.growth > 0 ? (
                                <TrendingUp sx={{ color: 'success.main', fontSize: 14 }} />
                              ) : (
                                <TrendingDown sx={{ color: 'error.main', fontSize: 14 }} />
                              )}
                              <Typography
                                variant="caption"
                                sx={{
                                  color: product.growth > 0 ? 'success.main' : 'error.main',
                                  fontWeight: 600,
                                }}
                              >
                                {product.growth}%
                              </Typography>
                            </Box>
                          </Box>
                        }
                      />
                    </ListItem>
                    {index < topProducts.length - 1 && <Divider variant="inset" component="li" />}
                  </React.Fragment>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Recent Activity */}
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                Recent Activity
              </Typography>
              <List sx={{ p: 0 }}>
                {recentActivity.map((activity, index) => (
                  <React.Fragment key={index}>
                    <ListItem sx={{ px: 0 }}>
                      <ListItemAvatar>
                        <Avatar
                          sx={{
                            background: activity.type === 'order' ? '#4caf50' :
                                        activity.type === 'user' ? '#2196f3' :
                                        activity.type === 'payment' ? '#ff9800' : '#f44336',
                            width: 32,
                            height: 32,
                            fontSize: '0.8rem'
                          }}
                        >
                          {activity.type === 'order' ? 'O' :
                           activity.type === 'user' ? 'U' :
                           activity.type === 'payment' ? 'P' : 'A'}
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={activity.action}
                        secondary={`${activity.user} • ${activity.time}`}
                      />
                    </ListItem>
                    {index < recentActivity.length - 1 && <Divider variant="inset" component="li" />}
                  </React.Fragment>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Performance Metrics */}
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                Performance Metrics
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {[
                  { label: 'Conversion Rate', value: 3.2, target: 5.0, color: '#4caf50' },
                  { label: 'Average Order Value', value: 45.2, target: 50.0, color: '#2196f3' },
                  { label: 'Customer Retention', value: 78.5, target: 80.0, color: '#ff9800' },
                  { label: 'Page Load Time', value: 2.1, target: 1.5, color: '#f44336' }
                ].map((metric, index) => (
                  <Box key={index}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2" color="textSecondary">
                        {metric.label}
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {metric.value}%
                      </Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={(metric.value / metric.target) * 100}
                      sx={{
                        height: 8,
                        borderRadius: 4,
                        backgroundColor: 'rgba(0,0,0,0.1)',
                        '& .MuiLinearProgress-bar': {
                          background: metric.color,
                          borderRadius: 4,
                        },
                      }}
                    />
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Analytics; 