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
  Schedule,
  VideoCall,
  CheckCircle,
  Pending,
  Cancel,
  People,
  Assignment,
  TrendingUp,
  AccessTime,
  LocationOn
} from '@mui/icons-material';

const Sessions = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const sessions = [
    {
      id: 'SESS-001',
      title: 'Data Science Fundamentals - Session 1',
      mentor: 'Dr. Sarah Wilson',
      mentee: 'John Doe',
      program: 'Data Science',
      date: '2024-01-25',
      time: '10:00 AM - 11:30 AM',
      duration: '90 min',
      status: 'completed',
      type: 'Video Call',
      attendance: 'present',
      rating: 4.8,
      notes: 'Introduction to Python and basic data manipulation'
    },
    {
      id: 'SESS-002',
      title: 'Web Development - Session 3',
      mentor: 'Prof. Mike Johnson',
      mentee: 'Lisa Brown',
      program: 'Web Development',
      date: '2024-01-25',
      time: '2:00 PM - 3:30 PM',
      duration: '90 min',
      status: 'ongoing',
      type: 'Video Call',
      attendance: 'present',
      rating: null,
      notes: 'Building responsive layouts with CSS Grid'
    },
    {
      id: 'SESS-003',
      title: 'Machine Learning - Session 5',
      mentor: 'Alex Chen',
      mentee: 'David Smith',
      program: 'Machine Learning',
      date: '2024-01-26',
      time: '9:00 AM - 10:30 AM',
      duration: '90 min',
      status: 'scheduled',
      type: 'Video Call',
      attendance: 'pending',
      rating: null,
      notes: 'Neural Networks and Deep Learning'
    },
    {
      id: 'SESS-004',
      title: 'Product Management - Session 2',
      mentor: 'Dr. Emily Davis',
      mentee: 'Maria Garcia',
      program: 'Product Management',
      date: '2024-01-24',
      time: '1:00 PM - 2:30 PM',
      duration: '90 min',
      status: 'completed',
      type: 'Video Call',
      attendance: 'present',
      rating: 4.6,
      notes: 'User research and market analysis'
    },
    {
      id: 'SESS-005',
      title: 'Mobile Development - Session 1',
      mentor: 'David Kim',
      mentee: 'Alex Thompson',
      program: 'Mobile Development',
      date: '2024-01-27',
      time: '11:00 AM - 12:30 PM',
      duration: '90 min',
      status: 'cancelled',
      type: 'Video Call',
      attendance: 'absent',
      rating: null,
      notes: 'Introduction to React Native - Cancelled due to technical issues'
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'success';
      case 'ongoing': return 'primary';
      case 'scheduled': return 'warning';
      case 'cancelled': return 'error';
      default: return 'default';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return <CheckCircle />;
      case 'ongoing': return <Schedule />;
      case 'scheduled': return <Pending />;
      case 'cancelled': return <Cancel />;
      default: return <Pending />;
    }
  };

  const getAttendanceColor = (attendance) => {
    switch (attendance) {
      case 'present': return 'success';
      case 'absent': return 'error';
      case 'pending': return 'warning';
      default: return 'default';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'Video Call': return <VideoCall />;
      case 'In-Person': return <LocationOn />;
      case 'Phone Call': return <AccessTime />;
      default: return <Schedule />;
    }
  };

  const filteredSessions = sessions.filter(session => {
    const matchesSearch = session.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         session.mentor.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         session.mentee.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || session.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 700 }}>
          Sessions Management
        </Typography>
        <Button 
          variant="contained" 
          sx={{ background: 'linear-gradient(45deg, #667eea, #764ba2)' }}
          startIcon={<Add />}
        >
          Schedule Session
        </Button>
      </Box>

      {/* Filters */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                placeholder="Search sessions by title, mentor, or mentee..."
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
                  <MenuItem value="completed">Completed</MenuItem>
                  <MenuItem value="ongoing">Ongoing</MenuItem>
                  <MenuItem value="scheduled">Scheduled</MenuItem>
                  <MenuItem value="cancelled">Cancelled</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={3}>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<Assignment />}
                sx={{ height: 56 }}
              >
                View Calendar
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Sessions Table */}
      <Card>
        <CardContent>
          <TableContainer component={Paper} sx={{ boxShadow: 'none' }}>
            <Table>
              <TableHead>
                <TableRow sx={{ background: '#f5f5f5' }}>
                  <TableCell sx={{ fontWeight: 600 }}>Session</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Participants</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Date & Time</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Type</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Attendance</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Rating</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredSessions.map((session) => (
                  <TableRow key={session.id} hover>
                    <TableCell>
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          {session.title}
                        </Typography>
                        <Typography variant="caption" color="textSecondary">
                          {session.program}
                        </Typography>
                        <Typography variant="caption" color="textSecondary" display="block">
                          {session.notes}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          {session.mentor}
                        </Typography>
                        <Typography variant="caption" color="textSecondary">
                          → {session.mentee}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          {session.date}
                        </Typography>
                        <Typography variant="caption" color="textSecondary">
                          {session.time}
                        </Typography>
                        <Typography variant="caption" color="textSecondary" display="block">
                          {session.duration}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {getTypeIcon(session.type)}
                        <Typography variant="body2">
                          {session.type}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={session.attendance}
                        color={getAttendanceColor(session.attendance)}
                        size="small"
                        sx={{ textTransform: 'capitalize' }}
                      />
                    </TableCell>
                    <TableCell>
                      {session.rating ? (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            {session.rating}
                          </Typography>
                          <Typography variant="caption" color="textSecondary">
                            /5
                          </Typography>
                        </Box>
                      ) : (
                        <Typography variant="body2" color="textSecondary">
                          -
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell>
                      <Chip
                        icon={getStatusIcon(session.status)}
                        label={session.status}
                        color={getStatusColor(session.status)}
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

export default Sessions; 