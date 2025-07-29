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
  Smartphone
} from '@mui/icons-material';
import styles from '../styles/dashboard.module.css';

const Dashboard = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [showMobileDialog, setShowMobileDialog] = useState(false);

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

  const aspiringMentors = [
    {
      name: 'Sarah Chen',
      avatar: 'SC',
      currentRole: 'Senior Developer',
      targetSpecialty: 'Full Stack Development',
      experience: '5 years',
      progress: 85,
      status: 'review',
      skills: ['React', 'Node.js', 'Python'],
      rating: 4.8,
      sessionsCompleted: 24,
      applicationDate: '2024-01-15'
    },
    {
      name: 'Michael Rodriguez',
      avatar: 'MR',
      currentRole: 'Data Analyst',
      targetSpecialty: 'Data Science',
      experience: '3 years',
      progress: 72,
      status: 'approved',
      skills: ['Python', 'SQL', 'Machine Learning'],
      rating: 4.6,
      sessionsCompleted: 18,
      applicationDate: '2024-01-10'
    },
    {
      name: 'Emily Watson',
      avatar: 'EW',
      currentRole: 'UX Designer',
      targetSpecialty: 'Product Design',
      experience: '4 years',
      progress: 68,
      status: 'pending',
      skills: ['Figma', 'User Research', 'Prototyping'],
      rating: 4.7,
      sessionsCompleted: 15,
      applicationDate: '2024-01-20'
    },
    {
      name: 'David Kim',
      avatar: 'DK',
      currentRole: 'DevOps Engineer',
      targetSpecialty: 'Cloud Architecture',
      experience: '6 years',
      progress: 91,
      status: 'approved',
      skills: ['AWS', 'Docker', 'Kubernetes'],
      rating: 4.9,
      sessionsCompleted: 32,
      applicationDate: '2024-01-05'
    },
    {
      name: 'Lisa Thompson',
      avatar: 'LT',
      currentRole: 'Marketing Manager',
      targetSpecialty: 'Digital Marketing',
      experience: '4 years',
      progress: 45,
      status: 'review',
      skills: ['SEO', 'Google Ads', 'Analytics'],
      rating: 4.5,
      sessionsCompleted: 12,
      applicationDate: '2024-01-25'
    }
  ];

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
      case 'review': return { bg: '#fff3e0', color: '#f57c00', text: 'Under Review', icon: <Pending fontSize="small" /> };
      case 'pending': return { bg: '#e3f2fd', color: '#1976d2', text: 'Pending', icon: <Schedule fontSize="small" /> };
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
                    label={`${aspiringMentors.filter(m => m.status === 'approved').length} Approved`}
                    size="small"
                    className={styles.approvedChip}
                  />
                  <Chip 
                    label={`${aspiringMentors.filter(m => m.status === 'review').length} Under Review`}
                    size="small"
                    className={styles.reviewChip}
                  />
                  <IconButton size="small">
                    <MoreVert />
                  </IconButton>
                </Box>
              </Box>
              
              <Grid container spacing={3}>
                {aspiringMentors.map((mentor, index) => {
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
    </Box>
  );
};

export default Dashboard; 