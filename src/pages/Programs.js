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
  Book,
  School,
  CheckCircle,
  Pending,
  Cancel,
  People,
  Schedule,
  AttachMoney,
  TrendingUp,
  Assignment
} from '@mui/icons-material';

const Programs = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const programs = [
    {
      id: 'PROG-001',
      name: 'Data Science Fundamentals',
      category: 'Technology',
      duration: '12 weeks',
      sessions: 24,
      price: 2999,
      enrolled: 156,
      maxCapacity: 200,
      status: 'active',
      mentor: 'Dr. Sarah Wilson',
      level: 'Beginner',
      description: 'Comprehensive introduction to data science concepts and tools'
    },
    {
      id: 'PROG-002',
      name: 'Web Development Bootcamp',
      category: 'Technology',
      duration: '16 weeks',
      sessions: 32,
      price: 3499,
      enrolled: 234,
      maxCapacity: 250,
      status: 'active',
      mentor: 'Prof. Mike Johnson',
      level: 'Intermediate',
      description: 'Full-stack web development with modern technologies'
    },
    {
      id: 'PROG-003',
      name: 'Machine Learning Mastery',
      category: 'Technology',
      duration: '20 weeks',
      sessions: 40,
      price: 4499,
      enrolled: 98,
      maxCapacity: 150,
      status: 'active',
      mentor: 'Alex Chen',
      level: 'Advanced',
      description: 'Advanced machine learning algorithms and applications'
    },
    {
      id: 'PROG-004',
      name: 'Product Management',
      category: 'Business',
      duration: '14 weeks',
      sessions: 28,
      price: 3999,
      enrolled: 123,
      maxCapacity: 180,
      status: 'active',
      mentor: 'Dr. Emily Davis',
      level: 'Intermediate',
      description: 'Product strategy, development, and management'
    },
    {
      id: 'PROG-005',
      name: 'Mobile App Development',
      category: 'Technology',
      duration: '18 weeks',
      sessions: 36,
      price: 3799,
      enrolled: 87,
      maxCapacity: 120,
      status: 'pending',
      mentor: 'David Kim',
      level: 'Intermediate',
      description: 'iOS and Android app development with React Native'
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

  const getEnrollmentPercentage = (enrolled, maxCapacity) => {
    return Math.round((enrolled / maxCapacity) * 100);
  };

  const filteredPrograms = programs.filter(program => {
    const matchesSearch = program.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         program.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         program.mentor.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || program.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 700 }}>
          Programs Management
        </Typography>
        <Button 
          variant="contained" 
          sx={{ background: 'linear-gradient(45deg, #667eea, #764ba2)' }}
          startIcon={<Add />}
        >
          Create Program
        </Button>
      </Box>

      {/* Filters */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                placeholder="Search programs by name, category, or mentor..."
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
                startIcon={<TrendingUp />}
                sx={{ height: 56 }}
              >
                View Analytics
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Programs Table */}
      <Card>
        <CardContent>
          <TableContainer component={Paper} sx={{ boxShadow: 'none' }}>
            <Table>
              <TableHead>
                <TableRow sx={{ background: '#f5f5f5' }}>
                  <TableCell sx={{ fontWeight: 600 }}>Program</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Category</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Mentor</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Enrollment</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Price</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Level</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredPrograms.map((program) => (
                  <TableRow key={program.id} hover>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Avatar sx={{ background: '#667eea' }}>
                          <Book />
                        </Avatar>
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            {program.name}
                          </Typography>
                          <Typography variant="caption" color="textSecondary">
                            {program.duration} • {program.sessions} sessions
                          </Typography>
                          <Typography variant="caption" color="textSecondary" display="block">
                            {program.description}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={program.category} 
                        size="small" 
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {program.mentor}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ minWidth: 120 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            {program.enrolled}/{program.maxCapacity}
                          </Typography>
                          <Typography variant="caption" color="textSecondary">
                            {getEnrollmentPercentage(program.enrolled, program.maxCapacity)}%
                          </Typography>
                        </Box>
                        <LinearProgress
                          variant="determinate"
                          value={getEnrollmentPercentage(program.enrolled, program.maxCapacity)}
                          sx={{
                            height: 6,
                            borderRadius: 3,
                            backgroundColor: 'rgba(0,0,0,0.1)',
                            '& .MuiLinearProgress-bar': {
                              background: getEnrollmentPercentage(program.enrolled, program.maxCapacity) > 80 ? '#f44336' :
                                         getEnrollmentPercentage(program.enrolled, program.maxCapacity) > 60 ? '#ff9800' : '#4caf50',
                              borderRadius: 3,
                            },
                          }}
                        />
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        ${program.price}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={program.level}
                        color={getLevelColor(program.level)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        icon={getStatusIcon(program.status)}
                        label={program.status}
                        color={getStatusColor(program.status)}
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

export default Programs; 