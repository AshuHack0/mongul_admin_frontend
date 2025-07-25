import React from 'react';
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
  Badge
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
  Psychology
} from '@mui/icons-material';

const Dashboard = () => {
  const stats = [
    {
      title: 'Total Mentors',
      value: '156',
      change: '+12%',
      trend: 'up',
      icon: <School />,
      color: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      bgColor: 'rgba(102, 126, 234, 0.1)'
    },
    {
      title: 'Active Mentees',
      value: '2,847',
      change: '+8%',
      trend: 'up',
      icon: <People />,
      color: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      bgColor: 'rgba(240, 147, 251, 0.1)'
    },
    {
      title: 'Active Sessions',
      value: '89',
      change: '+15%',
      trend: 'up',
      icon: <Schedule />,
      color: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      bgColor: 'rgba(79, 172, 254, 0.1)'
    },
    {
      title: 'Completion Rate',
      value: '94.2%',
      change: '+2.1%',
      trend: 'up',
      icon: <CheckCircle />,
      color: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
      bgColor: 'rgba(67, 233, 123, 0.1)'
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
    <Box sx={{ 
      p: { xs: 2, md: 4 }, 
      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
      minHeight: '100vh'
    }}>
      {/* Header Section */}
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        mb: 4,
        flexDirection: { xs: 'column', md: 'row' },
        gap: 2
      }}>
        <Box>
          <Typography 
            variant="h3" 
            sx={{ 
              fontWeight: 800,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              mb: 1
            }}
          >
            Mongul Mentoring Dashboard
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ fontWeight: 500 }}>
            Welcome back! Here's what's happening with your mentoring platform.
          </Typography>
        </Box>
        
      </Box>

      {/* Key Metrics */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {stats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card sx={{ 
              height: '100%',
              background: 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: '0 12px 40px rgba(0, 0, 0, 0.15)'
              }
            }}>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <Box sx={{ flex: 1 }}>
                    <Typography 
                      color="textSecondary" 
                      gutterBottom 
                      variant="body2"
                      sx={{ fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5 }}
                    >
                      {stat.title}
                    </Typography>
                    <Typography 
                      variant="h3" 
                      component="div" 
                      sx={{ 
                        fontWeight: 800, 
                        mb: 2,
                        background: stat.color,
                        backgroundClip: 'text',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent'
                      }}
                    >
                      {stat.value}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <TrendingUp sx={{ color: '#4caf50', fontSize: 18 }} />
                      <Typography
                        variant="body2"
                        sx={{
                          color: '#4caf50',
                          fontWeight: 700,
                        }}
                      >
                        {stat.change}
                      </Typography>
                      <Typography variant="body2" color="textSecondary" sx={{ fontWeight: 500 }}>
                        vs last month
                      </Typography>
                    </Box>
                  </Box>
                  <Avatar
                    sx={{
                      background: stat.color,
                      width: 64,
                      height: 64,
                      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)'
                    }}
                  >
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
          <Card sx={{ 
            height: '100%',
            background: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
          }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography 
                  variant="h6" 
                  sx={{ 
                    fontWeight: 700, 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: 1,
                    color: '#2c3e50'
                  }}
                >
                  <Schedule sx={{ color: '#667eea' }} />
                  Recent Sessions
                </Typography>
                <IconButton size="small">
                  <MoreVert />
                </IconButton>
              </Box>
              <List sx={{ p: 0 }}>
                {recentSessions.map((session, index) => {
                  const statusStyle = getStatusColor(session.status);
                  return (
                    <React.Fragment key={index}>
                      <ListItem sx={{ px: 0, py: 2 }}>
                        <ListItemAvatar>
                          <Avatar 
                            sx={{ 
                              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                              fontWeight: 600,
                              boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)'
                            }}
                          >
                            {session.avatar}
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <Typography variant="body1" sx={{ fontWeight: 600, color: '#2c3e50' }}>
                                {session.mentor} → {session.mentee}
                              </Typography>
                              <Chip
                                label={statusStyle.text}
                                size="small"
                                sx={{ 
                                  backgroundColor: statusStyle.bg,
                                  color: statusStyle.color,
                                  fontWeight: 600,
                                  fontSize: '0.75rem'
                                }}
                              />
                            </Box>
                          }
                          secondary={
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                              <Typography variant="body2" color="textSecondary" sx={{ fontWeight: 500 }}>
                                {session.program}
                              </Typography>
                              <Typography variant="body2" color="textSecondary">
                                •
                              </Typography>
                              <Typography variant="body2" color="textSecondary">
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
              <Box sx={{ mt: 3, textAlign: 'center' }}>
                <Button 
                  variant="text" 
                  endIcon={<ArrowForward />}
                  sx={{ 
                    color: '#667eea',
                    fontWeight: 600,
                    '&:hover': {
                      backgroundColor: 'rgba(102, 126, 234, 0.04)'
                    }
                  }}
                >
                  View All Sessions
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Top Mentors */}
        <Grid item xs={12} lg={6}>
          <Card sx={{ 
            height: '100%',
            background: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
          }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography 
                  variant="h6" 
                  sx={{ 
                    fontWeight: 700, 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: 1,
                    color: '#2c3e50'
                  }}
                >
                  <Star sx={{ color: '#ffc107' }} />
                  Top Performing Mentors
                </Typography>
                <IconButton size="small">
                  <MoreVert />
                </IconButton>
              </Box>
              <List sx={{ p: 0 }}>
                {topMentors.map((mentor, index) => (
                  <React.Fragment key={index}>
                    <ListItem sx={{ px: 0, py: 2 }}>
                      <ListItemAvatar>
                        <Avatar 
                          sx={{ 
                            background: index === 0 ? 'linear-gradient(135deg, #ffd700 0%, #ffed4e 100%)' :
                                   index === 1 ? 'linear-gradient(135deg, #c0c0c0 0%, #e5e5e5 100%)' :
                                   index === 2 ? 'linear-gradient(135deg, #cd7f32 0%, #daa520 100%)' :
                                   'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            fontWeight: 700,
                            fontSize: '0.9rem',
                            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
                          }}
                        >
                          {index + 1}
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <Typography variant="body1" sx={{ fontWeight: 600, color: '#2c3e50' }}>
                            {mentor.name}
                          </Typography>
                        }
                        secondary={
                          <Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                              <Star sx={{ color: '#ffc107', fontSize: 18 }} />
                              <Typography variant="body2" sx={{ fontWeight: 700, color: '#2c3e50' }}>
                                {mentor.rating}
                              </Typography>
                              <Typography variant="body2" color="textSecondary" sx={{ fontWeight: 500 }}>
                                • {mentor.specialty}
                              </Typography>
                            </Box>
                            <Typography variant="caption" color="textSecondary" sx={{ fontWeight: 500 }}>
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
              <Box sx={{ mt: 3, textAlign: 'center' }}>
                <Button 
                  variant="text" 
                  endIcon={<ArrowForward />}
                  sx={{ 
                    color: '#667eea',
                    fontWeight: 600,
                    '&:hover': {
                      backgroundColor: 'rgba(102, 126, 234, 0.04)'
                    }
                  }}
                >
                  View All Mentors
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Aspiring Mentors Section */}
        <Grid item xs={12}>
          <Card sx={{ 
            background: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
          }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                <Typography 
                  variant="h6" 
                  sx={{ 
                    fontWeight: 700, 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: 1,
                    color: '#2c3e50'
                  }}
                >
                  <PersonAdd sx={{ color: '#667eea' }} />
                  Aspiring Mentors
                </Typography>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Chip 
                    label={`${aspiringMentors.filter(m => m.status === 'approved').length} Approved`}
                    size="small"
                    sx={{ backgroundColor: '#e8f5e8', color: '#2e7d32', fontWeight: 600 }}
                  />
                  <Chip 
                    label={`${aspiringMentors.filter(m => m.status === 'review').length} Under Review`}
                    size="small"
                    sx={{ backgroundColor: '#fff3e0', color: '#f57c00', fontWeight: 600 }}
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
                      <Card sx={{ 
                        background: 'rgba(255, 255, 255, 0.7)',
                        border: '1px solid rgba(255, 255, 255, 0.3)',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          transform: 'translateY(-2px)',
                          boxShadow: '0 8px 25px rgba(0, 0, 0, 0.1)'
                        }
                      }}>
                        <CardContent sx={{ p: 2.5 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                            <Badge
                              overlap="circular"
                              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                              badgeContent={
                                <Avatar sx={{ width: 20, height: 20, fontSize: '0.7rem', background: statusStyle.color }}>
                                  {statusStyle.icon}
                                </Avatar>
                              }
                            >
                              <Avatar 
                                sx={{ 
                                  width: 56, 
                                  height: 56,
                                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                  fontWeight: 600,
                                  fontSize: '1.2rem'
                                }}
                              >
                                {mentor.avatar}
                              </Avatar>
                            </Badge>
                            <Box sx={{ flex: 1 }}>
                              <Typography variant="h6" sx={{ fontWeight: 700, color: '#2c3e50', mb: 0.5 }}>
                                {mentor.name}
                              </Typography>
                              <Typography variant="body2" color="textSecondary" sx={{ fontWeight: 500 }}>
                                {mentor.currentRole}
                              </Typography>
                            </Box>
                          </Box>

                          <Box sx={{ mb: 2 }}>
                            <Typography variant="body2" sx={{ fontWeight: 600, color: '#2c3e50', mb: 1 }}>
                              Target Specialty: {mentor.targetSpecialty}
                            </Typography>
                            <Typography variant="caption" color="textSecondary" sx={{ fontWeight: 500 }}>
                              {mentor.experience} experience • {mentor.sessionsCompleted} sessions completed
                            </Typography>
                          </Box>

                          <Box sx={{ mb: 2 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                              <Typography variant="body2" sx={{ fontWeight: 600, color: '#2c3e50' }}>
                                Progress
                              </Typography>
                              <Typography variant="body2" sx={{ fontWeight: 700, color: '#667eea' }}>
                                {mentor.progress}%
                              </Typography>
                            </Box>
                            <LinearProgress
                              variant="determinate"
                              value={mentor.progress}
                              sx={{
                                height: 8,
                                borderRadius: 4,
                                backgroundColor: 'rgba(0,0,0,0.08)',
                                '& .MuiLinearProgress-bar': {
                                  background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
                                  borderRadius: 4,
                                },
                              }}
                            />
                          </Box>

                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 2 }}>
                            {mentor.skills.slice(0, 3).map((skill, skillIndex) => (
                              <Chip
                                key={skillIndex}
                                label={skill}
                                size="small"
                                sx={{ 
                                  fontSize: '0.7rem',
                                  backgroundColor: 'rgba(102, 126, 234, 0.1)',
                                  color: '#667eea',
                                  fontWeight: 500
                                }}
                              />
                            ))}
                            {mentor.skills.length > 3 && (
                              <Chip
                                label={`+${mentor.skills.length - 3}`}
                                size="small"
                                sx={{ 
                                  fontSize: '0.7rem',
                                  backgroundColor: 'rgba(0,0,0,0.1)',
                                  color: 'text.secondary',
                                  fontWeight: 500
                                }}
                              />
                            )}
                          </Box>

                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Star sx={{ color: '#ffc107', fontSize: 16 }} />
                              <Typography variant="body2" sx={{ fontWeight: 600, color: '#2c3e50' }}>
                                {mentor.rating}
                              </Typography>
                            </Box>
                            <Chip
                              label={statusStyle.text}
                              size="small"
                              icon={statusStyle.icon}
                              sx={{ 
                                backgroundColor: statusStyle.bg,
                                color: statusStyle.color,
                                fontWeight: 600,
                                fontSize: '0.7rem'
                              }}
                            />
                          </Box>
                        </CardContent>
                      </Card>
                    </Grid>
                  );
                })}
              </Grid>

              <Box sx={{ mt: 4, textAlign: 'center' }}>
                <Button 
                  variant="contained"
                  startIcon={<PersonAdd />}
                  sx={{ 
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    boxShadow: '0 4px 15px rgba(102, 126, 234, 0.3)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
                      boxShadow: '0 6px 20px rgba(102, 126, 234, 0.4)'
                    }
                  }}
                >
                  Review All Applications
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Program Progress */}
        <Grid item xs={12}>
          <Card sx={{ 
            background: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
          }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                <Typography 
                  variant="h6" 
                  sx={{ 
                    fontWeight: 700, 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: 1,
                    color: '#2c3e50'
                  }}
                >
                  <Assignment sx={{ color: '#667eea' }} />
                  Program Progress Overview
                </Typography>
                <IconButton size="small">
                  <MoreVert />
                </IconButton>
              </Box>
              <Grid container spacing={4}>
                {programProgress.map((program, index) => (
                  <Grid item xs={12} sm={6} md={3} key={index}>
                    <Box sx={{ 
                      p: 2, 
                      borderRadius: 2,
                      background: 'rgba(255, 255, 255, 0.5)',
                      border: '1px solid rgba(255, 255, 255, 0.3)'
                    }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                        <Typography variant="body1" sx={{ fontWeight: 700, color: '#2c3e50' }}>
                          {program.name}
                        </Typography>
                        <Typography 
                          variant="h6" 
                          sx={{ 
                            fontWeight: 800,
                            color: program.color
                          }}
                        >
                          {program.progress}%
                        </Typography>
                      </Box>
                      <LinearProgress
                        variant="determinate"
                        value={program.progress}
                        sx={{
                          height: 10,
                          borderRadius: 5,
                          backgroundColor: 'rgba(0,0,0,0.08)',
                          mb: 2,
                          '& .MuiLinearProgress-bar': {
                            background: `linear-gradient(90deg, ${program.color} 0%, ${program.color}dd 100%)`,
                            borderRadius: 5,
                            boxShadow: `0 2px 8px ${program.color}40`
                          },
                        }}
                      />
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="caption" color="textSecondary" sx={{ fontWeight: 600 }}>
                          {program.enrolled} enrolled
                        </Typography>
                        <Typography variant="caption" color="textSecondary" sx={{ fontWeight: 600 }}>
                          {program.completed} completed
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard; 