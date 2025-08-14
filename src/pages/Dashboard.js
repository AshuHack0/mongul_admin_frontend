import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Avatar,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  ListItemIcon,
  Divider,
  Button,
  LinearProgress,
  Paper,
  IconButton,
  Tooltip,
  Badge,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import {
  People,
  School,
  TrendingUp,
  Schedule,
  CheckCircle,
  Pending,
  Cancel,
  Star,
  Message,
  VideoCall,
  Assignment,
  EmojiEvents,
  MoreVert,
  ArrowForward,
  Visibility,
  PersonAdd,
  Grade,
  Work,
  Psychology,
  Computer,
  Smartphone,
  Email,
  Phone,
  VerifiedUser,
  CalendarToday,
  AccessTime
} from '@mui/icons-material';
import styles from '../styles/dashboard.module.css';
import { API_ENDPOINTS } from '../config/api';
import axios from 'axios';

const Dashboard = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [showMobileDialog, setShowMobileDialog] = useState(false);
  const [menteeBecomeMentorQueue, setMenteeBecomeMentorQueue] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedMentor, setSelectedMentor] = useState(null);
  const [openMentorModal, setOpenMentorModal] = useState(false);

  const getMenteeBecomeMentorQueue = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(`${API_ENDPOINTS.MENTEE_BECOME_MENTOR_QUEUE}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        },
      });
      setMenteeBecomeMentorQueue(response.data.data); 
      console.log('Raw API response:', response.data.data);
    } catch (error) {
      console.error('Error fetching mentee become mentor queue:', error);
      setError('Failed to fetch aspiring mentors data');
      setMenteeBecomeMentorQueue([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getMenteeBecomeMentorQueue();
  }, []);
 
  // Check if user is on mobile device
  useEffect(() => {
    const checkMobile = () => {
      const userAgent = navigator.userAgent.toLowerCase();
      const isMobileDevice = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent);
      const isSmallScreen = window.innerWidth <= 768;
      
      if (isMobileDevice || isSmallScreen) {
        setIsMobile(true);
        setShowMobileDialog(true);
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleCloseMobileDialog = () => {
    setShowMobileDialog(false);
  };

  const handleCloseMentorModal = () => {
    setOpenMentorModal(false);
    setSelectedMentor(null);
  };

  const handleViewMentor = (mentor) => {
    setSelectedMentor(mentor);
    setOpenMentorModal(true);
  };

  const handleApproveMentor = async (mentorId) => {
    try {
      console.log('Approving mentor:', mentorId);
      
      // Make API call to approve mentor
      const response = await axios.put(
        `${API_ENDPOINTS.APPROVE_MENTOR}/${mentorId}/approve`,
        {},
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      console.log('Approve mentor response:', response.data);
      
      if (response.data.success) {
        // Update local state
        setMenteeBecomeMentorQueue(prevQueue => 
          prevQueue.map(mentor => 
            mentor._id === mentorId 
              ? { ...mentor, mentorApplicationStatus: 'approved' }
              : mentor
          )
        );
        
        // Update selected mentor in modal
        setSelectedMentor(prev => prev ? { ...prev, mentorApplicationStatus: 'approved' } : null);
        
        // Close modal
        handleCloseMentorModal();
        
        // Show success message (you can add a toast notification here)
        alert('Mentor approved successfully!');
      } else {
        throw new Error(response.data.message || 'Failed to approve mentor');
      }
    } catch (error) {
      console.error('Error approving mentor:', error);
      // Show error message
      alert(`Error approving mentor: ${error.response?.data?.message || error.message}`);
    }
  };

  const handleRejectMentor = async (mentorId) => {
    try {
      console.log('Rejecting mentor:', mentorId);
      
      // For now, we'll update the status locally since there might not be a reject endpoint
      // TODO: Implement reject API call when backend endpoint is available
      
      // Update local state
      setMenteeBecomeMentorQueue(prevQueue => 
        prevQueue.map(mentor => 
          mentor._id === mentorId 
            ? { ...mentor, mentorApplicationStatus: 'rejected' }
            : mentor
        )
      );
      
      // Update selected mentor in modal
      setSelectedMentor(prev => prev ? { ...prev, mentorApplicationStatus: 'rejected' } : null);
      
      // Close modal
      handleCloseMentorModal();
      
      // Show success message
      alert('Mentor rejected successfully!');
      
      // TODO: When you add the reject endpoint, uncomment this code:
      /*
      const response = await axios.put(
        `${API_ENDPOINTS.REJECT_MENTOR}/${mentorId}/reject`,
        {},
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      if (response.data.success) {
        // Update local state and close modal
        // ... same logic as above
      }
      */
      
    } catch (error) {
      console.error('Error rejecting mentor:', error);
      alert(`Error rejecting mentor: ${error.response?.data?.message || error.message}`);
    }
  };

  // Mobile warning dialog
  if (isMobile) {
    return (
      <Dialog 
        open={showMobileDialog} 
        onClose={handleCloseMobileDialog}
        maxWidth="sm"
        fullWidth
        className={styles.mobileDialog}
      >
        <DialogTitle className={styles.mobileDialogTitle}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <Computer sx={{ fontSize: 40, color: '#667eea' }} />
            <Smartphone sx={{ fontSize: 40, color: '#f093fb' }} />
          </Box>
          <Typography variant="h5" sx={{ fontWeight: 700, color: '#2c3e50' }}>
            Desktop Access Required
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1" sx={{ mb: 2, color: '#64748b', lineHeight: 1.6 }}>
            The Mongul Admin Panel is designed for desktop use to provide the best experience with full functionality.
          </Typography>
          <Typography variant="body1" sx={{ mb: 3, color: '#64748b', lineHeight: 1.6 }}>
            Please access this panel from a desktop computer or laptop for optimal performance and complete feature access.
          </Typography>
          <Box sx={{ 
            p: 2, 
            background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)',
            borderRadius: 2,
            border: '1px solid rgba(102, 126, 234, 0.2)'
          }}>
            <Typography variant="body2" sx={{ fontWeight: 600, color: '#667eea', mb: 1 }}>
              💡 Recommended:
            </Typography>
            <Typography variant="body2" sx={{ color: '#64748b' }}>
              • Use a desktop computer or laptop<br/>
              • Ensure screen resolution of 1024px or higher<br/>
              • Use a modern web browser (Chrome, Firefox, Safari, Edge)
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 0 }}>
          <Button 
            onClick={handleCloseMobileDialog}
            variant="contained"
            sx={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              fontWeight: 600,
              px: 3,
              py: 1.5,
              borderRadius: 2,
              '&:hover': {
                background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)'
              }
            }}
          >
            I Understand
          </Button>
        </DialogActions>
      </Dialog>
    );
  }

  const stats = [
    {
      title: 'Total Mentors',
      value: '156',
      change: '+12%',
      trend: 'up',
      icon: <School />,
      color: '#667eea'
    },
    {
      title: 'Active Mentees',
      value: '2,847',
      change: '+8%',
      trend: 'up',
      icon: <People />,
      color: '#f093fb'
    },
    {
      title: 'Active Sessions',
      value: '89',
      change: '+15%',
      trend: 'up',
      icon: <Schedule />,
      color: '#4facfe'
    },
    {
      title: 'Completion Rate',
      value: '94.2%',
      change: '+2.1%',
      trend: 'up',
      icon: <CheckCircle />,
      color: '#43e97b'
    }
  ];

  const recentSessions = [
    { mentor: 'Dr. Sarah Wilson', mentee: 'John Doe', program: 'Data Science', status: 'completed', time: '2 hours ago', avatar: 'SW' },
    { mentor: 'Prof. Mike Johnson', mentee: 'Lisa Brown', program: 'Web Development', status: 'ongoing', time: '1 hour ago', avatar: 'MJ' },
    { mentor: 'Alex Chen', mentee: 'David Smith', program: 'Machine Learning', status: 'scheduled', time: '3 hours ago', avatar: 'AC' },
    { mentor: 'Dr. Emily Davis', mentee: 'Maria Garcia', program: 'Product Management', status: 'completed', time: '5 hours ago', avatar: 'ED' }
  ];

  const topMentors = [
    { name: 'Dr. Sarah Wilson', rating: 4.9, sessions: 45, mentees: 12, avatar: 'SW', specialty: 'Data Science' },
    { name: 'Prof. Mike Johnson', rating: 4.8, sessions: 38, mentees: 10, avatar: 'MJ', specialty: 'Web Development' },
    { name: 'Alex Chen', rating: 4.7, sessions: 32, mentees: 8, avatar: 'AC', specialty: 'Machine Learning' },
    { name: 'Dr. Emily Davis', rating: 4.6, sessions: 28, mentees: 7, avatar: 'ED', specialty: 'Product Management' }
  ];

  const programProgress = [
    { name: 'Data Science', enrolled: 156, completed: 89, progress: 57, color: '#667eea' },
    { name: 'Web Development', enrolled: 234, completed: 167, progress: 71, color: '#f093fb' },
    { name: 'Machine Learning', enrolled: 98, completed: 45, progress: 46, color: '#4facfe' },
    { name: 'Product Management', enrolled: 123, completed: 78, progress: 63, color: '#43e97b' }
  ];

  // Map API data to match UI expectations
  const mappedAspiringMentors = menteeBecomeMentorQueue.map(mentor => ({
    id: mentor._id,
    name: mentor.fullName || 'N/A',
    fullName: mentor.fullName || 'N/A', // Keep original field for modal
    avatar: mentor.fullName ? mentor.fullName.split(' ').map(n => n[0]).join('').toUpperCase() : 'N/A',
    currentRole: mentor.credentials || 'N/A',
    targetSpecialty: mentor.categories && mentor.categories.length > 0 ? mentor.categories.join(', ') : 'N/A',
    experience: mentor.yearofexperience ? `${mentor.yearofexperience} years` : mentor.experience || 'N/A',
    progress: 75, // Default progress since not available in API
    status: mentor.mentorApplicationStatus || 'pending',
    mentorApplicationStatus: mentor.mentorApplicationStatus || 'pending', // Keep original field for modal
    skills: mentor.expertise && mentor.expertise.length > 0 ? mentor.expertise : 
            mentor.categories && mentor.categories.length > 0 ? mentor.categories : ['N/A'],
    rating: mentor.averageRating || 0,
    sessionsCompleted: mentor.totalReviews || 0,
    applicationDate: mentor.createdAt ? new Date(mentor.createdAt).toLocaleDateString() : 'N/A',
    bio: mentor.bio || '',
    mentorType: mentor.mentorType || 'basic',
    email: mentor.email || 'N/A',
    phone: mentor.phone || 'N/A',
    isEmailVerified: mentor.isEmailVerified || false,
    profilePicture: mentor.profilePicture || '',
    specializations: mentor.specializations || {},
    updatedAt: mentor.updatedAt,
    // Keep all original fields for modal compatibility
    categories: mentor.categories || [],
    expertise: mentor.expertise || [],
    yearofexperience: mentor.yearofexperience || 0,
    credentials: mentor.credentials || '',
    hourlyRate: mentor.hourlyRate || 0,
    isAvailable: mentor.isAvailable || false,
    averageRating: mentor.averageRating || 0,
    totalReviews: mentor.totalReviews || 0,
    createdAt: mentor.createdAt,
    role: mentor.role || 'mentor',
    accessLevel: mentor.accessLevel || 'user'
  }));

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return { bg: '#e8f5e8', color: '#2e7d32', text: 'Completed' };
      case 'ongoing': return { bg: '#e3f2fd', color: '#1976d2', text: 'Ongoing' };
      case 'scheduled': return { bg: '#fff3e0', color: '#f57c00', text: 'Scheduled' };
      default: return { bg: '#f5f5f5', color: '#757575', text: 'Unknown' };
    }
  };

  const getApplicationStatus = (status) => {
    switch (status) {
      case 'approved': return { bg: '#e8f5e8', color: '#2e7d32', text: 'Approved', icon: <CheckCircle fontSize="small" /> };
      case 'pending': return { bg: '#e3f2fd', color: '#1976d2', text: 'Pending', icon: <Schedule fontSize="small" /> };
      case 'rejected': return { bg: '#ffebee', color: '#d32f2f', text: 'Rejected', icon: <Cancel fontSize="small" /> };
      default: return { bg: '#f5f5f5', color: '#757575', text: 'Unknown', icon: <Cancel fontSize="small" /> };
    }
  };

  return (
    <Box className={styles.container}>
      {/* Header Section */}
      <Box className={styles.header}>
        <Box>
          <Typography variant="h3" className={styles.title}>
            Mongul Mentoring Dashboard
          </Typography>
          <Typography variant="body1" className={styles.subtitle}>
            Welcome back! Here's what's happening with your mentoring platform.
          </Typography>
        </Box>
      </Box>

      {/* Key Metrics */}
      <Grid container spacing={3} className={styles.statsGrid}>
        {stats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card className={styles.statCard}>
              <CardContent className={styles.statContent}>
                <Box className={styles.statHeader}>
                  <Box className={styles.statInfo}>
                    <Typography variant="body2" className={styles.statTitle}>
                      {stat.title}
                    </Typography>
                    <Typography variant="h3" className={styles.statValue} style={{ color: stat.color }}>
                      {stat.value}
                    </Typography>
                    <Box className={styles.statChange}>
                      <TrendingUp className={styles.trendIcon} />
                      <Typography variant="body2" className={styles.changeText}>
                        {stat.change}
                      </Typography>
                      <Typography variant="body2" className={styles.changeLabel}>
                        vs last month
                      </Typography>
                    </Box>
                  </Box>
                  <Avatar className={styles.statAvatar} style={{ background: stat.color }}>
                    {stat.icon}
                  </Avatar>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3}>
        {/* Recent Sessions */}
        <Grid item xs={12} lg={6}>
          <Card className={styles.card}>
            <CardContent className={styles.cardContent}>
              <Box className={styles.cardHeader}>
                <Typography variant="h6" className={styles.cardTitle}>
                  <Schedule className={styles.cardIcon} />
                  Recent Sessions
                </Typography>
                <IconButton size="small">
                  <MoreVert />
                </IconButton>
              </Box>
              <List className={styles.sessionList}>
                {recentSessions.map((session, index) => {
                  const statusStyle = getStatusColor(session.status);
                  return (
                    <React.Fragment key={index}>
                      <ListItem className={styles.sessionItem}>
                        <ListItemAvatar>
                          <Avatar className={styles.sessionAvatar}>
                            {session.avatar}
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={
                            <Box className={styles.sessionHeader}>
                              <Typography variant="body1" className={styles.sessionTitle}>
                                {session.mentor} → {session.mentee}
                              </Typography>
                              <Chip
                                label={statusStyle.text}
                                size="small"
                                className={styles.statusChip}
                                style={{ backgroundColor: statusStyle.bg, color: statusStyle.color }}
                              />
                            </Box>
                          }
                          secondary={
                            <Box className={styles.sessionDetails}>
                              <Typography variant="body2" className={styles.programName}>
                                {session.program}
                              </Typography>
                              <Typography variant="body2" className={styles.sessionTime}>
                                {session.time}
                              </Typography>
                            </Box>
                          }
                        />
                      </ListItem>
                      {index < recentSessions.length - 1 && <Divider variant="inset" component="li" />}
                    </React.Fragment>
                  );
                })}
              </List>
              <Box className={styles.viewAllButton}>
                <Button variant="text" endIcon={<ArrowForward />} className={styles.viewButton}>
                  View All Sessions
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Top Mentors */}
        <Grid item xs={12} lg={6}>
          <Card className={styles.card}>
            <CardContent className={styles.cardContent}>
              <Box className={styles.cardHeader}>
                <Typography variant="h6" className={styles.cardTitle}>
                  <Star className={styles.cardIcon} />
                  Top Performing Mentors
                </Typography>
                <IconButton size="small">
                  <MoreVert />
                </IconButton>
              </Box>
              <List className={styles.mentorList}>
                {topMentors.map((mentor, index) => (
                  <React.Fragment key={index}>
                    <ListItem className={styles.mentorItem}>
                      <ListItemAvatar>
                        <Avatar className={`${styles.mentorAvatar} ${styles[`rank${index + 1}`]}`}>
                          {index + 1}
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <Typography variant="body1" className={styles.mentorName}>
                            {mentor.name}
                          </Typography>
                        }
                        secondary={
                          <Box className={styles.mentorDetails}>
                            <Box className={styles.mentorRating}>
                              <Star className={styles.starIcon} />
                              <Typography variant="body2" className={styles.ratingText}>
                                {mentor.rating}
                              </Typography>
                              <Typography variant="body2" className={styles.specialty}>
                                • {mentor.specialty}
                              </Typography>
                            </Box>
                            <Typography variant="caption" className={styles.mentorStats}>
                              {mentor.sessions} sessions • {mentor.mentees} mentees
                            </Typography>
                          </Box>
                        }
                      />
                    </ListItem>
                    {index < topMentors.length - 1 && <Divider variant="inset" component="li" />}
                  </React.Fragment>
                ))}
              </List>
              <Box className={styles.viewAllButton}>
                <Button variant="text" endIcon={<ArrowForward />} className={styles.viewButton}>
                  View All Mentors
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Aspiring Mentors Section */}
        <Grid item xs={12}>
          <Card className={styles.card}>
            <CardContent className={styles.cardContent}>
              <Box className={styles.cardHeader}>
                <Typography variant="h6" className={styles.cardTitle}>
                  <PersonAdd className={styles.cardIcon} />
                  Aspiring Mentors
                </Typography>
                <Box className={styles.statusChips}>
                  <Chip 
                    label={`${mappedAspiringMentors.filter(m => m.status === 'approved').length} Approved`}
                    size="small"
                    className={styles.approvedChip}
                  />
                  <Chip 
                    label={`${mappedAspiringMentors.filter(m => m.status === 'pending').length} Pending`}
                    size="small"
                    className={styles.reviewChip}
                  />
                  <Chip 
                    label={`${mappedAspiringMentors.filter(m => m.status === 'rejected').length} Rejected`}
                    size="small"
                    className={styles.reviewChip}
                  />
                  <IconButton size="small">
                    <MoreVert />
                  </IconButton>
                </Box>
              </Box>
              
              <Grid container spacing={3}>
                {mappedAspiringMentors.map((mentor, index) => {
                  const statusStyle = getApplicationStatus(mentor.status);
                  return (
                    <Grid item xs={12} md={6} lg={4} key={index}>
                      <Card className={styles.mentorCard}>
                        <CardContent className={styles.mentorCardContent}>
                          <Box className={styles.mentorCardHeader}>
                            <Badge
                              overlap="circular"
                              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                              badgeContent={
                                <Avatar className={styles.statusBadge} style={{ background: statusStyle.color }}>
                                  {statusStyle.icon}
                                </Avatar>
                              }
                            >
                              <Avatar className={styles.mentorCardAvatar}>
                                {mentor.avatar}
                              </Avatar>
                            </Badge>
                            <Box className={styles.mentorCardInfo}>
                              <Typography variant="h6" className={styles.mentorCardName}>
                                {mentor.name}
                              </Typography>
                              <Typography variant="body2" className={styles.mentorCardRole}>
                                {mentor.currentRole}
                              </Typography>
                            </Box>
                          </Box>

                          <Box className={styles.mentorCardDetails}>
                            <Typography variant="body2" className={styles.targetSpecialty}>
                              Target Specialty: {mentor.targetSpecialty}
                            </Typography>
                            <Typography variant="caption" className={styles.experience}>
                              {mentor.experience} experience • {mentor.sessionsCompleted} sessions completed
                            </Typography>
                          </Box>

                          <Box className={styles.progressSection}>
                            <Box className={styles.progressHeader}>
                              <Typography variant="body2" className={styles.progressLabel}>
                                Progress
                              </Typography>
                              <Typography variant="body2" className={styles.progressValue}>
                                {mentor.progress}%
                              </Typography>
                            </Box>
                            <LinearProgress
                              variant="determinate"
                              value={mentor.progress}
                              className={styles.progressBar}
                            />
                          </Box>

                          <Box className={styles.skillsSection}>
                            {mentor.skills.slice(0, 3).map((skill, skillIndex) => (
                              <Chip
                                key={skillIndex}
                                label={skill}
                                size="small"
                                className={styles.skillChip}
                              />
                            ))}
                            {mentor.skills.length > 3 && (
                              <Chip
                                label={`+${mentor.skills.length - 3}`}
                                size="small"
                                className={styles.moreSkillsChip}
                              />
                            )}
                          </Box>

                          <Box className={styles.mentorCardFooter}>
                            <Box className={styles.ratingSection}>
                              <Star className={styles.ratingStar} />
                              <Typography variant="body2" className={styles.ratingValue}>
                                {mentor.rating}
                              </Typography>
                            </Box>
                            <Chip
                              label={statusStyle.text}
                              size="small"
                              icon={statusStyle.icon}
                              className={styles.statusChip}
                              style={{ backgroundColor: statusStyle.bg, color: statusStyle.color }}
                            />
                          </Box>
                          
                          <Box className={styles.mentorCardActions}>
                            <Button
                              variant="outlined"
                              size="small"
                              startIcon={<Visibility />}
                              onClick={() => handleViewMentor(mentor)}
                              className={styles.viewButton}
                            >
                              View Details
                            </Button>
                          </Box>
                        </CardContent>
                      </Card>
                    </Grid>
                  );
                })}
              </Grid>

              <Box className={styles.reviewButton}>
                <Button 
                  variant="contained"
                  startIcon={<PersonAdd />}
                  className={styles.reviewAllButton}
                >
                  Review All Applications
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Program Progress */}
         
      </Grid>

      {/* Mentor Details Modal */}
      <Dialog 
        open={openMentorModal} 
        onClose={handleCloseMentorModal}
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
            sx={{ width: 64, height: 64, background: '#667eea' }}
            src={selectedMentor?.profilePicture}
          >
            {selectedMentor?.fullName?.charAt(0) || 'N/A'}
          </Avatar>
          <Box sx={{ flex: 1 }}>
            <Typography variant="h5" sx={{ fontWeight: 600 }}>
              {selectedMentor?.fullName || 'N/A'}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              {selectedMentor?.email || 'N/A'}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
              <Phone sx={{ fontSize: 16, color: 'text.secondary' }} />
              <Typography variant="body2" color="textSecondary">
                {selectedMentor?.phone || 'Phone not provided'}
              </Typography>
            </Box>
          </Box>
          <Box sx={{ textAlign: 'right' }}>
            <Chip
              icon={getApplicationStatus(selectedMentor?.mentorApplicationStatus || 'pending').icon}
              label={(selectedMentor?.mentorApplicationStatus || 'pending').toUpperCase()}
              color={selectedMentor?.mentorApplicationStatus === 'approved' ? 'success' : 
                     selectedMentor?.mentorApplicationStatus === 'rejected' ? 'error' : 'warning'}
              size="medium"
              sx={{ textTransform: 'capitalize', fontWeight: 600 }}
            />
          </Box>
        </DialogTitle>
        
        <DialogContent sx={{ pt: 3 }}>
          {/* Status Section - Prominently displayed */}
          <Box sx={{ 
            mb: 3, 
            p: 2, 
            bgcolor: selectedMentor?.mentorApplicationStatus === 'approved' ? '#e8f5e8' : 
                     selectedMentor?.mentorApplicationStatus === 'rejected' ? '#ffebee' : '#fff3e0',
            borderRadius: 2,
            border: `2px solid ${
              selectedMentor?.mentorApplicationStatus === 'approved' ? '#4caf50' : 
              selectedMentor?.mentorApplicationStatus === 'rejected' ? '#f44336' : '#ff9800'
            }`
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              {getApplicationStatus(selectedMentor?.mentorApplicationStatus || 'pending').icon}
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Application Status: {(selectedMentor?.mentorApplicationStatus || 'pending').toUpperCase()}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {selectedMentor?.mentorApplicationStatus === 'approved' ? 'This mentor has been approved and can start accepting sessions.' :
                   selectedMentor?.mentorApplicationStatus === 'rejected' ? 'This mentor application has been rejected.' :
                   'This mentor application is pending review.'}
                </Typography>
              </Box>
            </Box>
          </Box>

          <Grid container spacing={3}>
            {/* Basic Information */}
            <Grid item xs={12} md={6}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: '#1976d2' }}>
                Basic Information
              </Typography>
              <List dense>
                <ListItem>
                  <ListItemIcon>
                    <Work sx={{ color: 'primary' }} />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Full Name" 
                    secondary={selectedMentor?.fullName || 'N/A'} 
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <Email sx={{ color: 'primary' }} />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Email" 
                    secondary={selectedMentor?.email || 'N/A'} 
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <Phone sx={{ color: 'primary' }} />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Phone" 
                    secondary={selectedMentor?.phone || 'N/A'} 
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <Work sx={{ color: 'primary' }} />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Credentials" 
                    secondary={selectedMentor?.credentials || 'N/A'} 
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <VerifiedUser sx={{ color: 'primary' }} />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Role" 
                    secondary={selectedMentor?.role || 'N/A'} 
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <Work sx={{ color: 'primary' }} />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Access Level" 
                    secondary={selectedMentor?.accessLevel || 'N/A'} 
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
                    <School sx={{ color: 'primary' }} />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Years of Experience" 
                    secondary={selectedMentor?.yearofexperience ? `${selectedMentor.yearofexperience} years` : 'N/A'} 
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <Work sx={{ color: 'primary' }} />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Experience Description" 
                    secondary={selectedMentor?.experience || 'N/A'} 
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <VerifiedUser sx={{ color: 'primary' }} />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Mentor Type" 
                    secondary={selectedMentor?.mentorType || 'Basic'} 
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    {/* <AccessTime sx={{ color: 'primary' }} /> */}
                  </ListItemIcon>
                  <ListItemText 
                    primary="Hourly Rate" 
                    secondary={selectedMentor?.hourlyRate ? `$${selectedMentor.hourlyRate}/hr` : 'Not set'} 
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <CheckCircle sx={{ color: 'primary' }} />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Available for Sessions" 
                    secondary={selectedMentor?.isAvailable ? 'Yes' : 'No'} 
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <CheckCircle sx={{ color: 'primary' }} />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Status" 
                    secondary={
                      <Chip
                        icon={getApplicationStatus(selectedMentor?.mentorApplicationStatus || 'pending').icon}
                        label={selectedMentor?.mentorApplicationStatus || 'pending'}
                        color={selectedMentor?.mentorApplicationStatus === 'approved' ? 'success' : 
                               selectedMentor?.mentorApplicationStatus === 'rejected' ? 'error' : 'warning'}
                        size="small"
                        sx={{ textTransform: 'capitalize' }}
                      />
                    } 
                  />
                </ListItem>
              </List>
            </Grid>

            {/* Categories & Specializations */}
            <Grid item xs={12}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: '#1976d2' }}>
                Categories & Specializations
              </Typography>
              
              {/* Main Categories */}
              {selectedMentor?.categories && selectedMentor.categories.length > 0 && (
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1, color: '#1976d2' }}>
                    Main Categories:
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {selectedMentor.categories.map((category, index) => (
                      <Chip 
                        key={index} 
                        label={category} 
                        color="primary" 
                        variant="outlined"
                        size="medium"
                      />
                    ))}
                  </Box>
                </Box>
              )}

              {/* Specializations */}
              {selectedMentor?.specializations && Object.keys(selectedMentor.specializations).length > 0 && (
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1, color: '#1976d2' }}>
                    Specializations:
                  </Typography>
                  {Object.entries(selectedMentor.specializations).map(([category, skills]) => (
                    <Box key={category} sx={{ mb: 2 }}>
                      <Typography variant="body2" sx={{ fontWeight: 500, mb: 0.5, color: '#666' }}>
                        {category}:
                      </Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, ml: 2 }}>
                        {skills.map((skill, index) => (
                          <Chip 
                            key={index} 
                            label={skill} 
                            color="secondary" 
                            variant="outlined"
                            size="small"
                          />
                        ))}
                      </Box>
                    </Box>
                  ))}
                </Box>
              )}

              {/* Expertise (if available) */}
              {selectedMentor?.expertise && selectedMentor.expertise.length > 0 && (
                <Box>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1, color: '#1976d2' }}>
                    Additional Expertise:
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {selectedMentor.expertise.map((skill, index) => (
                      <Chip 
                        key={index} 
                        label={skill} 
                        color="info" 
                        variant="outlined"
                        size="small"
                      />
                    ))}
                  </Box>
                </Box>
              )}

              {(!selectedMentor?.categories || selectedMentor.categories.length === 0) && 
               (!selectedMentor?.specializations || Object.keys(selectedMentor.specializations).length === 0) &&
               (!selectedMentor?.expertise || selectedMentor.expertise.length === 0) && (
                <Typography variant="body2" color="textSecondary">
                  No categories or specializations specified
                </Typography>
              )}
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

            {/* Statistics & Verification */}
            <Grid item xs={12}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: '#1976d2' }}>
                Statistics & Verification
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} md={3}>
                  <Card sx={{ textAlign: 'center', p: 2 }}>
                    <Star sx={{ color: 'primary', fontSize: 32 }} />
                    <Typography variant="h6" sx={{ mt: 1, fontWeight: 600 }}>
                      {selectedMentor?.averageRating || 0}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Average Rating
                    </Typography>
                  </Card>
                </Grid>
                <Grid item xs={12} md={3}>
                  <Card sx={{ textAlign: 'center', p: 2 }}>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      {selectedMentor?.totalReviews || 0}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Total Reviews
                    </Typography>
                  </Card>
                </Grid>
                <Grid item xs={12} md={3}>
                  <Card sx={{ textAlign: 'center', p: 2 }}>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      {selectedMentor?.isEmailVerified ? 'Yes' : 'No'}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Email Verified
                    </Typography>
                  </Card>
                </Grid>
                <Grid item xs={12} md={3}>
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
                    <CalendarToday sx={{ color: 'primary' }} />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Application Date" 
                    secondary={selectedMentor?.createdAt ? new Date(selectedMentor.createdAt).toLocaleDateString() : 'N/A'} 
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <CalendarToday sx={{ color: 'primary' }} />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Last Updated" 
                    secondary={selectedMentor?.updatedAt ? new Date(selectedMentor.updatedAt).toLocaleDateString() : 'N/A'} 
                  />
                </ListItem>
              </List>
            </Grid>
          </Grid>
        </DialogContent>
        
        <DialogActions sx={{ p: 3, borderTop: '1px solid #e0e0e0' }}>
          <Button onClick={handleCloseMentorModal} variant="outlined">
            Close
          </Button>
          
          {/* Show approve/reject buttons only for pending mentors */}
          {selectedMentor?.mentorApplicationStatus === 'pending' && (
            <>
              <Button 
                variant="contained" 
                color="success"
                startIcon={<CheckCircle />}
                onClick={() => handleApproveMentor(selectedMentor._id)}
                sx={{ mr: 1 }}
              >
                Approve
              </Button>
              <Button 
                variant="contained" 
                color="error"
                startIcon={<Cancel />}
                onClick={() => handleRejectMentor(selectedMentor._id)}
              >
                Reject
              </Button>
            </>
          )}
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Dashboard; 