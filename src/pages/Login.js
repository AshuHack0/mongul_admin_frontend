import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Container,
  Alert,
  IconButton
} from '@mui/material';
import { Phone } from '@mui/icons-material';
import styles from '../styles/Login.module.css';
import { API_ENDPOINTS } from '../config/api';

const Login = ({ onSendOTP }) => {
  const [countryCode, setCountryCode] = useState('+91');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Validate country code
    if (!countryCode || !countryCode.startsWith('+')) {
      setError('Please enter a valid country code starting with +');
      setLoading(false);
      return;
    }

    // Validate phone number
    if (!phoneNumber || phoneNumber.length < 6) {
      setError('Please enter a valid phone number');
      setLoading(false);
      return;
    }

    // Combine country code and phone number
    const fullPhoneNumber = countryCode + phoneNumber;

    try {
      // Call the backend API to send OTP
      const response = await fetch(API_ENDPOINTS.SEND_ADMIN_OTP, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phone: fullPhoneNumber }),
      });

      const data = await response.json();

      if (data.success) {
        setOtpSent(true);
        onSendOTP(fullPhoneNumber);
      } else {
        setError(data.message || 'Failed to send OTP');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCountryCodeChange = (e) => {
    const value = e.target.value;
    // Only allow + and digits
    if (/^\+?\d*$/.test(value)) {
      setCountryCode(value);
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
            <Phone sx={{ fontSize: 45, color: 'white' }} />
          </Box>

          <Typography component="h1" className={styles.title}>
            Admin Login
          </Typography>
          <Typography className={styles.subtitle}>
            Enter your phone number to receive OTP
          </Typography>

          {error && (
            <Alert severity="error" className={styles.errorAlert}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.formControl}>
              <label htmlFor="country-code" className={styles.label}>
                Country Code
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  id="country-code"
                  type="text"
                  className={styles.countryCodeInput}
                  value={countryCode}
                  onChange={handleCountryCodeChange}
                  placeholder="+91"
                  maxLength={5}
                />
              </div>
            </div>

            <div className={styles.formControl}>
              <label htmlFor="phone-number" className={styles.label}>
                Phone Number
              </label>
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

            <button
              type="submit"
              className={styles.submitButton}
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className={styles.loadingSpinner}></span>
                  Sending OTP...
                </>
              ) : (
                'Send OTP'
              )}
            </button>
          </Box>
 
        </Paper>
      </Box>
    </Container>
  );
};

export default Login; 