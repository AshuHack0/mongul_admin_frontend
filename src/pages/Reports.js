import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  TextField,
  Chip,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Divider
} from '@mui/material';
import {
  Assessment,
  Download,
  PictureAsPdf,
  TableChart,
  BarChart,
  PieChart,
  TrendingUp,
  DateRange,
  FilterList,
  Schedule,
  Visibility
} from '@mui/icons-material';

const Reports = () => {
  const [reportType, setReportType] = useState('sales');
  const [dateRange, setDateRange] = useState('7d');

  const reportTypes = [
    { value: 'sales', label: 'Sales Report', icon: <TrendingUp />, color: '#4caf50' },
    { value: 'inventory', label: 'Inventory Report', icon: <TableChart />, color: '#2196f3' },
    { value: 'users', label: 'User Report', icon: <Assessment />, color: '#ff9800' },
    { value: 'payments', label: 'Payment Report', icon: <BarChart />, color: '#f44336' }
  ];

  const recentReports = [
    { name: 'Monthly Sales Report', type: 'Sales', date: '2024-01-25', status: 'completed' },
    { name: 'Inventory Status Report', type: 'Inventory', date: '2024-01-24', status: 'completed' },
    { name: 'User Activity Report', type: 'Users', date: '2024-01-23', status: 'completed' },
    { name: 'Payment Summary Report', type: 'Payments', date: '2024-01-22', status: 'completed' }
  ];

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 700 }}>
          Reports & Analytics
        </Typography>
        <Button 
          variant="contained" 
          sx={{ background: 'linear-gradient(45deg, #667eea, #764ba2)' }}
          startIcon={<Assessment />}
        >
          Generate Report
        </Button>
      </Box>

      <Grid container spacing={3}>
        {/* Report Types */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                Generate New Report
              </Typography>
              
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <InputLabel>Report Type</InputLabel>
                    <Select
                      value={reportType}
                      onChange={(e) => setReportType(e.target.value)}
                      label="Report Type"
                    >
                      {reportTypes.map((type) => (
                        <MenuItem key={type.value} value={type.value}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Avatar sx={{ background: type.color, width: 24, height: 24 }}>
                              {type.icon}
                            </Avatar>
                            {type.label}
                          </Box>
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <InputLabel>Date Range</InputLabel>
                    <Select
                      value={dateRange}
                      onChange={(e) => setDateRange(e.target.value)}
                      label="Date Range"
                    >
                      <MenuItem value="1d">Last 24 Hours</MenuItem>
                      <MenuItem value="7d">Last 7 Days</MenuItem>
                      <MenuItem value="30d">Last 30 Days</MenuItem>
                      <MenuItem value="90d">Last 90 Days</MenuItem>
                      <MenuItem value="custom">Custom Range</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <Box sx={{ display: 'flex', gap: 2 }}>
                    <Button variant="outlined" startIcon={<PictureAsPdf />}>
                      Export as PDF
                    </Button>
                    <Button variant="outlined" startIcon={<TableChart />}>
                      Export as Excel
                    </Button>
                    <Button variant="outlined" startIcon={<BarChart />}>
                      View Chart
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Quick Stats */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                Report Statistics
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body2" color="textSecondary">
                    Total Reports
                  </Typography>
                  <Chip label="156" size="small" color="primary" />
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body2" color="textSecondary">
                    This Month
                  </Typography>
                  <Chip label="23" size="small" color="success" />
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body2" color="textSecondary">
                    Pending
                  </Typography>
                  <Chip label="3" size="small" color="warning" />
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Recent Reports */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                Recent Reports
              </Typography>
              <List sx={{ p: 0 }}>
                {recentReports.map((report, index) => (
                  <React.Fragment key={index}>
                    <ListItem sx={{ px: 0 }}>
                      <ListItemAvatar>
                        <Avatar sx={{ background: '#667eea' }}>
                          <Assessment />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={report.name}
                        secondary={`${report.type} • ${report.date}`}
                      />
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Button size="small" startIcon={<Visibility />}>
                          View
                        </Button>
                        <Button size="small" startIcon={<Download />}>
                          Download
                        </Button>
                      </Box>
                    </ListItem>
                    {index < recentReports.length - 1 && <Divider variant="inset" component="li" />}
                  </React.Fragment>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Reports; 