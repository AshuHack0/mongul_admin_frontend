import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  Chip,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Divider,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Alert
} from '@mui/material';
import {
  Support as SupportIcon,
  Chat,
  PriorityHigh,
  CheckCircle,
  Pending,
  Cancel,
  Add,
  Search,
  FilterList,
  Message,
  Phone,
  Email,
  Schedule
} from '@mui/icons-material';

const Support = () => {
  const [statusFilter, setStatusFilter] = useState('all');

  const tickets = [
    {
      id: 'TICKET-001',
      customer: 'John Doe',
      email: 'john@example.com',
      subject: 'Payment Issue',
      message: 'I am unable to complete my payment. Please help.',
      priority: 'high',
      status: 'open',
      date: '2024-01-25',
      agent: 'Sarah Wilson'
    },
    {
      id: 'TICKET-002',
      customer: 'Mike Johnson',
      email: 'mike@example.com',
      subject: 'Order Tracking',
      message: 'Where is my order? It has been 5 days.',
      priority: 'medium',
      status: 'in-progress',
      date: '2024-01-24',
      agent: 'David Smith'
    },
    {
      id: 'TICKET-003',
      customer: 'Lisa Brown',
      email: 'lisa@example.com',
      subject: 'Account Access',
      message: 'I cannot log into my account.',
      priority: 'high',
      status: 'resolved',
      date: '2024-01-23',
      agent: 'Sarah Wilson'
    },
    {
      id: 'TICKET-004',
      customer: 'David Wilson',
      email: 'david@example.com',
      subject: 'Product Return',
      message: 'I want to return a defective product.',
      priority: 'low',
      status: 'closed',
      date: '2024-01-22',
      agent: 'Mike Johnson'
    }
  ];

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'error';
      case 'medium': return 'warning';
      case 'low': return 'success';
      default: return 'default';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'open': return 'error';
      case 'in-progress': return 'warning';
      case 'resolved': return 'success';
      case 'closed': return 'default';
      default: return 'default';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'open': return <Pending />;
      case 'in-progress': return <Schedule />;
      case 'resolved': return <CheckCircle />;
      case 'closed': return <Cancel />;
      default: return <Pending />;
    }
  };

  const filteredTickets = tickets.filter(ticket => 
    statusFilter === 'all' || ticket.status === statusFilter
  );

  const openTickets = tickets.filter(t => t.status === 'open').length;
  const inProgressTickets = tickets.filter(t => t.status === 'in-progress').length;
  const resolvedTickets = tickets.filter(t => t.status === 'resolved').length;
  const totalTickets = tickets.length;

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 700 }}>
          Customer Support
        </Typography>
        <Button 
          variant="contained" 
          sx={{ background: 'linear-gradient(45deg, #667eea, #764ba2)' }}
          startIcon={<Add />}
        >
          New Ticket
        </Button>
      </Box>

      {/* Support Summary */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar sx={{ background: '#f44336' }}>
                  <Pending />
                </Avatar>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>
                    {openTickets}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Open Tickets
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar sx={{ background: '#ff9800' }}>
                  <Schedule />
                </Avatar>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>
                    {inProgressTickets}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    In Progress
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar sx={{ background: '#4caf50' }}>
                  <CheckCircle />
                </Avatar>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>
                    {resolvedTickets}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Resolved
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar sx={{ background: '#2196f3' }}>
                  <SupportIcon />
                </Avatar>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>
                    {totalTickets}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Total Tickets
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Quick Actions */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                Support Tickets
              </Typography>
              
              <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                <TextField
                  placeholder="Search tickets..."
                  size="small"
                  sx={{ flexGrow: 1 }}
                  InputProps={{
                    startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />,
                  }}
                />
                <FormControl size="small" sx={{ minWidth: 150 }}>
                  <InputLabel>Status</InputLabel>
                  <Select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    label="Status"
                  >
                    <MenuItem value="all">All Status</MenuItem>
                    <MenuItem value="open">Open</MenuItem>
                    <MenuItem value="in-progress">In Progress</MenuItem>
                    <MenuItem value="resolved">Resolved</MenuItem>
                    <MenuItem value="closed">Closed</MenuItem>
                  </Select>
                </FormControl>
              </Box>

              <List sx={{ p: 0 }}>
                {filteredTickets.map((ticket, index) => (
                  <React.Fragment key={index}>
                    <ListItem sx={{ px: 0, flexDirection: 'column', alignItems: 'flex-start' }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', mb: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Avatar sx={{ background: '#667eea', width: 32, height: 32 }}>
                            {ticket.customer.charAt(0)}
                          </Avatar>
                          <Box>
                            <Typography variant="body2" sx={{ fontWeight: 500 }}>
                              {ticket.customer}
                            </Typography>
                            <Typography variant="caption" color="textSecondary">
                              {ticket.email}
                            </Typography>
                          </Box>
                        </Box>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <Chip
                            label={ticket.priority}
                            color={getPriorityColor(ticket.priority)}
                            size="small"
                            sx={{ textTransform: 'capitalize' }}
                          />
                          <Chip
                            icon={getStatusIcon(ticket.status)}
                            label={ticket.status.replace('-', ' ')}
                            color={getStatusColor(ticket.status)}
                            size="small"
                            sx={{ textTransform: 'capitalize' }}
                          />
                        </Box>
                      </Box>
                      <Box sx={{ width: '100%', mb: 1 }}>
                        <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5 }}>
                          {ticket.subject}
                        </Typography>
                        <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
                          {ticket.message}
                        </Typography>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Typography variant="caption" color="textSecondary">
                            {ticket.date} • Assigned to {ticket.agent}
                          </Typography>
                          <Box sx={{ display: 'flex', gap: 1 }}>
                            <Button size="small" startIcon={<Message />}>
                              Reply
                            </Button>
                            <Button size="small" startIcon={<CheckCircle />}>
                              Resolve
                            </Button>
                          </Box>
                        </Box>
                      </Box>
                    </ListItem>
                    {index < filteredTickets.length - 1 && <Divider variant="inset" component="li" />}
                  </React.Fragment>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Support Channels */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                Support Channels
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Button
                  variant="outlined"
                  startIcon={<Chat />}
                  fullWidth
                  sx={{ justifyContent: 'flex-start', py: 1.5 }}
                >
                  Live Chat Support
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<Phone />}
                  fullWidth
                  sx={{ justifyContent: 'flex-start', py: 1.5 }}
                >
                  Phone Support
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<Email />}
                  fullWidth
                  sx={{ justifyContent: 'flex-start', py: 1.5 }}
                >
                  Email Support
                </Button>
              </Box>
            </CardContent>
          </Card>

          {/* Quick Help */}
          <Card sx={{ mt: 3 }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                Quick Help
              </Typography>
              <Alert severity="info" sx={{ mb: 2 }}>
                <strong>Need immediate help?</strong><br />
                Our support team is available 24/7
              </Alert>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Typography variant="body2" color="textSecondary">
                  • Check our FAQ section
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  • Submit a support ticket
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  • Contact us via live chat
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Support; 