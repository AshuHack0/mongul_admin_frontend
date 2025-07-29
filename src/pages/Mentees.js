import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  Button,
  TextField,
  InputAdornment,
  Grid,
  Avatar,
  LinearProgress,
  Select,
  MenuItem,
  FormControl,
  InputLabel
} from '@mui/material';
import { 
  Search, 
  Add, 
  Edit, 
  Delete, 
  Visibility,
  People,
  School,
  CheckCircle,
  Pending,
  Cancel,
  Email,
  Phone,
  LocationOn,
  Assignment,
  TrendingUp,
  Schedule
} from '@mui/icons-material';

const Mentees = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const mentees = [
    {
      id: 'MENTEE-001',
      name: 'John Doe',
      email: 'john.doe@example.com',
      phone: '+1234567890',
      program: 'Data Science',
      mentor: 'Dr. Sarah Wilson',
      progress: 75,
      sessionsCompleted: 12,
      totalSessions: 16,
      status: 'active',
      joinDate: '2024-01-15',
      level: 'Intermediate'
    },
    {
      id: 'MENTEE-002',
      name: 'Lisa Brown',
      email: 'lisa.brown@example.com',
      phone: '+1234567891',
      program: 'Web Development',
      mentor: 'Prof. Mike Johnson',
      progress: 45,
      sessionsCompleted: 8,
      totalSessions: 20,
      status: 'active',
      joinDate: '2024-01-10',
      level: 'Beginner'
    },
    {
      id: 'MENTEE-003',
      name: 'David Smith',
      email: 'david.smith@example.com',
      phone: '+1234567892',
      program: 'Machine Learning',
      mentor: 'Alex Chen',
      progress: 90,
      sessionsCompleted: 18,
      totalSessions: 20,
      status: 'active',
      joinDate: '2023-12-20',
      level: 'Advanced'
    },
    {
      id: 'MENTEE-004',
      name: 'Maria Garcia',
      email: 'maria.garcia@example.com',
      phone: '+1234567893',
      program: 'Product Management',
      mentor: 'Dr. Emily Davis',
      progress: 30,
      sessionsCompleted: 6,
      totalSessions: 24,
      status: 'inactive',
      joinDate: '2024-01-05',
      level: 'Beginner'
    },
    {
      id: 'MENTEE-005',
      name: 'Alex Thompson',
      email: 'alex.thompson@example.com',
      phone: '+1234567894',
      program: 'Mobile Development',
      mentor: 'David Kim',
      progress: 60,
      sessionsCompleted: 10,
      totalSessions: 18,
      status: 'pending',
      joinDate: '2024-01-20',
      level: 'Intermediate'
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'success';
      case 'inactive': return 'error';
      case 'pending': return 'warning';
      default: return 'default';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'active': return <CheckCircle />;
      case 'inactive': return <Cancel />;
      case 'pending': return <Pending />;
      default: return <Pending />;
    }
  };

  const getLevelColor = (level) => {
    switch (level) {
      case 'Beginner': return 'info';
      case 'Intermediate': return 'warning';
      case 'Advanced': return 'success';
      default: return 'default';
    }
  };

  const filteredMentees = mentees.filter(mentee => {
    const matchesSearch = mentee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         mentee.program.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         mentee.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || mentee.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 700 }}>
          Mentees Management
        </Typography>
       
      </Box>

      {/* Filters */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                placeholder="Search mentees by name, program, or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <FormControl fullWidth>
                <InputLabel>Status Filter</InputLabel>
                <Select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  label="Status Filter"
                >
                  <MenuItem value="all">All Status</MenuItem>
                  <MenuItem value="active">Active</MenuItem>
                  <MenuItem value="inactive">Inactive</MenuItem>
                  <MenuItem value="pending">Pending</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
          </Grid>
        </CardContent>
      </Card>

      {/* Mentees Table */}
      <Card>
        <CardContent>
          <TableContainer component={Paper} sx={{ boxShadow: 'none' }}>
            <Table>
              <TableHead>
                <TableRow sx={{ background: '#f5f5f5' }}>
                  <TableCell sx={{ fontWeight: 600 }}>Mentee</TableCell>
                
                  <TableCell sx={{ fontWeight: 600 }}>Sessions Completed</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredMentees.map((mentee) => (
                  <TableRow key={mentee.id} hover>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Avatar sx={{ background: '#667eea' }}>
                          {mentee.name.charAt(0)}
                        </Avatar>
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            {mentee.name}
                          </Typography>
                          <Typography variant="caption" color="textSecondary">
                            {mentee.email}
                          </Typography>
                          <Typography variant="caption" color="textSecondary" display="block">
                            Joined: {mentee.joinDate}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box>
                       
                        <Typography variant="caption" color="textSecondary">
                          {mentee.sessionsCompleted}  sessions
                        </Typography>
                      </Box>
                    </TableCell>
                  
                
                   
                    <TableCell>
                      <Chip
                        icon={getStatusIcon(mentee.status)}
                        label={mentee.status}
                        color={getStatusColor(mentee.status)}
                        size="small"
                        sx={{ textTransform: 'capitalize' }}
                      />
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <IconButton size="small" color="primary">
                          <Visibility />
                        </IconButton>
                        <IconButton size="small" color="primary">
                          <Edit />
                        </IconButton>
                        <IconButton size="small" color="error">
                          <Delete />
                        </IconButton>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Mentees; 