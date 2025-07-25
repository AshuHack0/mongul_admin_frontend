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
  Rating,
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
  School,
  Star,
  CheckCircle,
  Pending,
  Cancel,
  Email,
  Phone,
  LocationOn,
  Work,
  Schedule
} from '@mui/icons-material';

const Mentors = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const mentors = [
    {
      id: 'MENT-001',
      name: 'Dr. Sarah Wilson',
      email: 'sarah.wilson@example.com',
      phone: '+1234567890',
      expertise: 'Data Science',
      experience: '8 years',
      rating: 4.9,
      totalSessions: 156,
      activeMentees: 12,
      status: 'active',
      location: 'San Francisco, CA',
      company: 'Google',
      hourlyRate: 120
    },
    {
      id: 'MENT-002',
      name: 'Prof. Mike Johnson',
      email: 'mike.johnson@example.com',
      phone: '+1234567891',
      expertise: 'Web Development',
      experience: '12 years',
      rating: 4.8,
      totalSessions: 134,
      activeMentees: 8,
      status: 'active',
      location: 'New York, NY',
      company: 'Microsoft',
      hourlyRate: 95
    },
    {
      id: 'MENT-003',
      name: 'Alex Chen',
      email: 'alex.chen@example.com',
      phone: '+1234567892',
      expertise: 'Machine Learning',
      experience: '6 years',
      rating: 4.7,
      totalSessions: 89,
      activeMentees: 6,
      status: 'active',
      location: 'Seattle, WA',
      company: 'Amazon',
      hourlyRate: 110
    },
    {
      id: 'MENT-004',
      name: 'Dr. Emily Davis',
      email: 'emily.davis@example.com',
      phone: '+1234567893',
      expertise: 'Product Management',
      experience: '10 years',
      rating: 4.6,
      totalSessions: 98,
      activeMentees: 9,
      status: 'inactive',
      location: 'Austin, TX',
      company: 'Apple',
      hourlyRate: 105
    },
    {
      id: 'MENT-005',
      name: 'David Kim',
      email: 'david.kim@example.com',
      phone: '+1234567894',
      expertise: 'Mobile Development',
      experience: '7 years',
      rating: 4.5,
      totalSessions: 67,
      activeMentees: 4,
      status: 'pending',
      location: 'Boston, MA',
      company: 'Meta',
      hourlyRate: 90
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

  const filteredMentors = mentors.filter(mentor => {
    const matchesSearch = mentor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         mentor.expertise.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         mentor.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || mentor.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 700 }}>
          Mentors Management
        </Typography>
       
      </Box>

      {/* Filters */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                placeholder="Search mentors by name, expertise, or email..."
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
            <Grid item xs={12} md={3}>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<Schedule />}
                sx={{ height: 56 }}
              >
                View Schedule
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Mentors Table */}
      <Card>
        <CardContent>
          <TableContainer component={Paper} sx={{ boxShadow: 'none' }}>
            <Table>
              <TableHead>
                <TableRow sx={{ background: '#f5f5f5' }}>
                  <TableCell sx={{ fontWeight: 600 }}>Mentor</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Expertise</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Rating</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Sessions</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Rate</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredMentors.map((mentor) => (
                  <TableRow key={mentor.id} hover>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Avatar sx={{ background: '#667eea' }}>
                          {mentor.name.charAt(0)}
                        </Avatar>
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            {mentor.name}
                          </Typography>
                          <Typography variant="caption" color="textSecondary">
                            {mentor.email}
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                            <Work sx={{ fontSize: 12, color: 'text.secondary' }} />
                            <Typography variant="caption" color="textSecondary">
                              {mentor.company}
                            </Typography>
                          </Box>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {mentor.expertise}
                        </Typography>
                        <Typography variant="caption" color="textSecondary">
                          {mentor.experience} experience
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Rating value={mentor.rating} precision={0.1} size="small" readOnly />
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {mentor.rating}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {mentor.totalSessions}
                        </Typography>
                        <Typography variant="caption" color="textSecondary">
                          {mentor.activeMentees} active mentees
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        ${mentor.hourlyRate}/hr
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        icon={getStatusIcon(mentor.status)}
                        label={mentor.status}
                        color={getStatusColor(mentor.status)}
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

export default Mentors; 