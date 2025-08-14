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
  Rating,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText
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
const Mentors = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [mentors, setMentors] = useState([]);
  const [selectedMentor, setSelectedMentor] = useState(null);
  const [openModal, setOpenModal] = useState(false);


  const getMentors = async () => {
    try {
      const response = await axios.get(`${API_ENDPOINTS.MENTOR_LIST}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        },
      }); 
      
      // Map the API response to match the expected format
      const mappedMentors = response.data.data.map(mentor => ({
        id: mentor._id,
        name: mentor.fullName || 'N/A',
        email: mentor.email || 'N/A',
        phone: mentor.phone || 'N/A',
        expertise: mentor.expertise && mentor.expertise.length > 0 ? mentor.expertise.join(', ') : 
                   mentor.categories && mentor.categories.length > 0 ? mentor.categories.join(', ') : 'N/A',
        experience: mentor.yearofexperience ? `${mentor.yearofexperience} years` : 
                   mentor.experience || 'N/A',
        rating: mentor.averageRating || 0,
        totalSessions: mentor.totalReviews || 0,
        activeMentees: 0, // Not available in API response
        status: mentor.mentorApplicationStatus || 'pending',
        location: 'N/A', // Not available in API response
        company: mentor.credentials || 'N/A',
        hourlyRate: mentor.hourlyRate || 0,
        bio: mentor.bio || '',
        isAvailable: mentor.isAvailable || false,
        mentorType: mentor.mentorType || 'basic',
        profilePicture: mentor.profilePicture || null,
        createdAt: mentor.createdAt,
        updatedAt: mentor.updatedAt,
        isEmailVerified: mentor.isEmailVerified
      }));
      
      setMentors(mappedMentors);
    } catch (error) {
      console.error('Error fetching mentors:', error);
      setMentors([]);
    }
  };

  useEffect(() => {
    getMentors();
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

  const filteredMentors = mentors.filter(mentor => {
    const matchesSearch = mentor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         mentor.expertise.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         mentor.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || mentor.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleViewMentor = (mentor) => {
    setSelectedMentor(mentor);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedMentor(null);
  };

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
                  <MenuItem value="approved">Approved</MenuItem>
                  <MenuItem value="rejected">Rejected</MenuItem>
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
                        <Avatar 
                          sx={{ background: '#667eea' }}
                          src={mentor.profilePicture}
                        >
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
                        <IconButton 
                          size="small" 
                          color="primary"
                          onClick={() => handleViewMentor(mentor)}
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

      {/* Mentor Details Modal */}
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
            src={selectedMentor?.profilePicture}
          >
            {selectedMentor?.name?.charAt(0)}
          </Avatar>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 600 }}>
              {selectedMentor?.name}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              {selectedMentor?.email}
            </Typography>
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
                    secondary={selectedMentor?.name || 'N/A'} 
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <Email color="primary" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Email" 
                    secondary={selectedMentor?.email || 'N/A'} 
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <Phone color="primary" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Phone" 
                    secondary={selectedMentor?.phone || 'N/A'} 
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <Business color="primary" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Credentials" 
                    secondary={selectedMentor?.company || 'N/A'} 
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
                    secondary={selectedMentor?.experience || 'N/A'} 
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <AccessTime color="primary" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Hourly Rate" 
                    secondary={`$${selectedMentor?.hourlyRate || 0}/hr`} 
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <VerifiedUser color="primary" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Mentor Type" 
                    secondary={selectedMentor?.mentorType || 'N/A'} 
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
                         icon={getStatusIcon(selectedMentor?.status)}
                         label={selectedMentor?.status}
                         color={getStatusColor(selectedMentor?.status)}
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
                {selectedMentor?.expertise && selectedMentor.expertise !== 'N/A' ? (
                  selectedMentor.expertise.split(', ').map((skill, index) => (
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
            {selectedMentor?.bio && (
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
                  {selectedMentor.bio}
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
                    <Rating value={selectedMentor?.rating || 0} precision={0.1} readOnly />
                    <Typography variant="h6" sx={{ mt: 1, fontWeight: 600 }}>
                      {selectedMentor?.rating || 0}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Average Rating
                    </Typography>
                  </Card>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Card sx={{ textAlign: 'center', p: 2 }}>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      {selectedMentor?.totalSessions || 0}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Total Reviews
                    </Typography>
                  </Card>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Card sx={{ textAlign: 'center', p: 2 }}>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      {selectedMentor?.isAvailable ? 'Yes' : 'No'}
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
                    secondary={selectedMentor?.createdAt ? new Date(selectedMentor.createdAt).toLocaleDateString() : 'N/A'} 
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <CalendarToday color="primary" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Last Updated" 
                    secondary={selectedMentor?.updatedAt ? new Date(selectedMentor.updatedAt).toLocaleDateString() : 'N/A'} 
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <VerifiedUser color="primary" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Email Verified" 
                    secondary={selectedMentor?.isEmailVerified ? 'Yes' : 'No'} 
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
              console.log('Edit mentor:', selectedMentor);
            }}
          >
            Edit Mentor
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Mentors; 