import React, { useState } from 'react';
import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  Container,
  Alert,
  InputAdornment,
  IconButton,
  OutlinedInput,
  FormControl,
  InputLabel
} from '@mui/material';
import { Visibility, VisibilityOff, Phone, Lock } from '@mui/icons-material';
import styles from '../styles/Login.module.css';

const Login = ({ onLogin }) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Validate phone number
    if (!phoneNumber || phoneNumber.length < 10) {
      setError('Please enter a valid phone number');
      setLoading(false);
      return;
    }

    // Validate password
    if (!password || password.length < 6) {
      setError('Password must be at least 6 characters');
      setLoading(false);
      return;
    }

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // For demo purposes, accept any valid phone/password combination
      if (phoneNumber && password) {
        onLogin({ phoneNumber, password });
      } else {
        setError('Invalid credentials');
      }
    } catch (err) {
      setError('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handlePhoneChange = (e) => {
    const value = e.target.value.replace(/\D/g, ''); // Only allow digits
    setPhoneNumber(value);
  };

  return (
    <Container component="main" maxWidth="sm">
      <Box className={styles.loginContainer}>
        {/* Floating Elements */}
        <div className={styles.floatingElement}></div>
        <div className={styles.floatingElement}></div>
        <div className={styles.floatingElement}></div>
        
        <Paper className={styles.loginCard}>
          <Box className={styles.logoContainer}>
            <Lock sx={{ fontSize: 45, color: 'white' }} />
          </Box>

          <Typography component="h1" className={styles.title}>
            Admin Login
          </Typography>
          <Typography className={styles.subtitle}>
            Enter your credentials to access the admin panel
          </Typography>

          {error && (
            <Alert severity="error" className={styles.errorAlert}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.formControl}>
              {/* <label htmlFor="phone-number">Phone Number</label> */}
              <div style={{ position: 'relative' }}>
                <Phone className={styles.inputIcon} />
                <input
                  id="phone-number"
                  type="tel"
                  className={styles.input}
                  value={phoneNumber}
                  onChange={handlePhoneChange}
                  placeholder="Enter your phone number"
                  maxLength={15}
                />
              </div>
            </div>

            <div className={styles.formControl}>
              {/* <label htmlFor="password">Password</label> */}
              <div style={{ position: 'relative' }}>
                <Lock className={styles.inputIcon} />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  className={styles.input}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                />
                <IconButton
                  className={styles.passwordToggle}
                  onClick={() => setShowPassword(!showPassword)}
                  size="small"
                >
                  
                </IconButton>
              </div>
            </div>

            <button
              type="submit"
              className={styles.submitButton}
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className={styles.loadingSpinner}></span>
                  Signing In...
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </Box>
 
        </Paper>
      </Box>
    </Container>
  );
};

export default Login; 