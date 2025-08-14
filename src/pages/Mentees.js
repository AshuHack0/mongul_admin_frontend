import React, { useState, useEffect } from 'react';
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
  InputLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Rating
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
  Schedule,
  Person,
  CalendarToday,
  AccessTime,
  VerifiedUser,
  Business,
  Description
} from '@mui/icons-material';
import { API_ENDPOINTS } from '../config/api';
import axios from 'axios';

const Mentees = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [mentees, setMentees] = useState([]);
  const [selectedMentee, setSelectedMentee] = useState(null);
  const [openModal, setOpenModal] = useState(false);

  const getMentees = async () => {
    try {
      const response = await axios.get(`${API_ENDPOINTS.MENTEE_LIST}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        },
      });
      
      // Map the API response to match the expected format
      const mappedMentees = response.data.data.map(mentee => ({
        id: mentee._id,
        name: mentee.fullName || 'N/A',
        email: mentee.email || 'N/A',
        phone: mentee.phone || 'N/A',
        expertise: mentee.expertise && mentee.expertise.length > 0 ? mentee.expertise.join(', ') : 
                   mentee.categories && mentee.categories.length > 0 ? mentee.categories.join(', ') : 'N/A',
        experience: mentee.yearofexperience ? `${mentee.yearofexperience} years` : 
                   mentee.experience || 'N/A',
        rating: mentee.averageRating || 0,
        totalSessions: mentee.totalReviews || 0,
        status: mentee.mentorApplicationStatus || 'pending',
        joinDate: mentee.createdAt ? new Date(mentee.createdAt).toLocaleDateString() : 'N/A',
        hourlyRate: mentee.hourlyRate || 0,
        bio: mentee.bio || '',
        isAvailable: mentee.isAvailable || false,
        mentorType: mentee.mentorType || 'basic',
        profilePicture: mentee.profilePicture || null,
        createdAt: mentee.createdAt,
        updatedAt: mentee.updatedAt,
        isEmailVerified: mentee.isEmailVerified,
        role: mentee.role || 'mentee',
        accessLevel: mentee.accessLevel || 'user'
      }));
      
      setMentees(mappedMentees);
    } catch (error) {
      console.error('Error fetching mentees:', error);
      setMentees([]);
    }
  };

  useEffect(() => {
    getMentees();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved': return 'success';
      case 'rejected': return 'error';
      case 'pending': return 'warning';
      default: return 'default';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'approved': return <CheckCircle />;
      case 'rejected': return <Cancel />;
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

  const handleViewMentee = (mentee) => {
    setSelectedMentee(mentee);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedMentee(null);
  };

  const filteredMentees = mentees.filter(mentee => {
    const matchesSearch = mentee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         mentee.expertise.toLowerCase().includes(searchTerm.toLowerCase()) ||
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
                placeholder="Search mentees by name, expertise, or email..."
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
                  <MenuItem value="approved">Approved</MenuItem>
                  <MenuItem value="rejected">Rejected</MenuItem>
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
                  <TableCell sx={{ fontWeight: 600 }}>Expertise</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Rating</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Sessions</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredMentees.map((mentee) => (
                  <TableRow key={mentee.id} hover>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Avatar 
                          sx={{ background: '#667eea' }}
                          src={mentee.profilePicture}
                        >
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
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {mentee.expertise}
                        </Typography>
                        <Typography variant="caption" color="textSecondary">
                          {mentee.experience} experience
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Rating value={mentee.rating} precision={0.1} size="small" readOnly />
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {mentee.rating}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {mentee.totalSessions}
                        </Typography>
                        <Typography variant="caption" color="textSecondary">
                          sessions completed
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
                        <IconButton 
                          size="small" 
                          color="primary"
                          onClick={() => handleViewMentee(mentee)}
                        >
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

      {/* Mentee Details Modal */}
      <Dialog 
        open={openModal} 
        onClose={handleCloseModal}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 2,
          borderBottom: '1px solid #e0e0e0',
          pb: 2
        }}>
          <Avatar 
            sx={{ width: 56, height: 56, background: '#667eea' }}
            src={selectedMentee?.profilePicture}
          >
            {selectedMentee?.name?.charAt(0)}
          </Avatar>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 600 }}>
              {selectedMentee?.name}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              {selectedMentee?.email}
            </Typography>
            <Chip 
              label={selectedMentee?.role} 
              color="primary" 
              size="small" 
              sx={{ mt: 1 }}
            />
          </Box>
        </DialogTitle>
        
        <DialogContent sx={{ pt: 3 }}>
          <Grid container spacing={3}>
            {/* Basic Information */}
            <Grid item xs={12} md={6}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: '#1976d2' }}>
                Basic Information
              </Typography>
              <List dense>
                <ListItem>
                  <ListItemIcon>
                    <Person color="primary" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Full Name" 
                    secondary={selectedMentee?.name || 'N/A'} 
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <Email color="primary" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Email" 
                    secondary={selectedMentee?.email || 'N/A'} 
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <Phone color="primary" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Phone" 
                    secondary={selectedMentee?.phone || 'N/A'} 
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <VerifiedUser color="primary" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Access Level" 
                    secondary={selectedMentee?.accessLevel || 'N/A'} 
                  />
                </ListItem>
              </List>
            </Grid>

            {/* Professional Details */}
            <Grid item xs={12} md={6}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: '#1976d2' }}>
                Professional Details
              </Typography>
              <List dense>
                <ListItem>
                  <ListItemIcon>
                    <School color="primary" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Experience" 
                    secondary={selectedMentee?.experience || 'N/A'} 
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <AccessTime color="primary" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Hourly Rate" 
                    secondary={`$${selectedMentee?.hourlyRate || 0}/hr`} 
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <VerifiedUser color="primary" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Mentor Type" 
                    secondary={selectedMentee?.mentorType || 'N/A'} 
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <CheckCircle color="primary" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Status" 
                    secondary={
                      <Chip
                        icon={getStatusIcon(selectedMentee?.status)}
                        label={selectedMentee?.status}
                        color={getStatusColor(selectedMentee?.status)}
                        size="small"
                        sx={{ textTransform: 'capitalize' }}
                      />
                    } 
                  />
                </ListItem>
              </List>
            </Grid>

            {/* Expertise & Categories */}
            <Grid item xs={12}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: '#1976d2' }}>
                Expertise & Categories
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {selectedMentee?.expertise && selectedMentee.expertise !== 'N/A' ? (
                  selectedMentee.expertise.split(', ').map((skill, index) => (
                    <Chip 
                      key={index} 
                      label={skill} 
                      color="primary" 
                      variant="outlined"
                      size="small"
                    />
                  ))
                ) : (
                  <Typography variant="body2" color="textSecondary">
                    No expertise areas specified
                  </Typography>
                )}
              </Box>
            </Grid>

            {/* Bio */}
            {selectedMentee?.bio && (
              <Grid item xs={12}>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: '#1976d2' }}>
                  Bio
                </Typography>
                <Typography variant="body2" sx={{ 
                  p: 2, 
                  bgcolor: '#f5f5f5', 
                  borderRadius: 1,
                  lineHeight: 1.6
                }}>
                  {selectedMentee.bio}
                </Typography>
              </Grid>
            )}

            {/* Statistics */}
            <Grid item xs={12}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: '#1976d2' }}>
                Statistics
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} md={4}>
                  <Card sx={{ textAlign: 'center', p: 2 }}>
                    <Rating value={selectedMentee?.rating || 0} precision={0.1} readOnly />
                    <Typography variant="h6" sx={{ mt: 1, fontWeight: 600 }}>
                      {selectedMentee?.rating || 0}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Average Rating
                    </Typography>
                  </Card>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Card sx={{ textAlign: 'center', p: 2 }}>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      {selectedMentee?.totalSessions || 0}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Total Reviews
                    </Typography>
                  </Card>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Card sx={{ textAlign: 'center', p: 2 }}>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      {selectedMentee?.isAvailable ? 'Yes' : 'No'}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Available for Sessions
                    </Typography>
                  </Card>
                </Grid>
              </Grid>
            </Grid>

            {/* Additional Details */}
            <Grid item xs={12}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: '#1976d2' }}>
                Additional Details
              </Typography>
              <List dense>
                <ListItem>
                  <ListItemIcon>
                    <CalendarToday color="primary" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Created" 
                    secondary={selectedMentee?.createdAt ? new Date(selectedMentee.createdAt).toLocaleDateString() : 'N/A'} 
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <CalendarToday color="primary" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Last Updated" 
                    secondary={selectedMentee?.updatedAt ? new Date(selectedMentee.updatedAt).toLocaleDateString() : 'N/A'} 
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <VerifiedUser color="primary" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Email Verified" 
                    secondary={selectedMentee?.isEmailVerified ? 'Yes' : 'No'} 
                  />
                </ListItem>
              </List>
            </Grid>
          </Grid>
        </DialogContent>
        
        <DialogActions sx={{ p: 3, borderTop: '1px solid #e0e0e0' }}>
          <Button onClick={handleCloseModal} variant="outlined">
            Close
          </Button>
          <Button 
            variant="contained" 
            startIcon={<Edit />}
            onClick={() => {
              // TODO: Implement edit functionality
              console.log('Edit mentee:', selectedMentee);
            }}
          >
            Edit Mentee
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Mentees; 