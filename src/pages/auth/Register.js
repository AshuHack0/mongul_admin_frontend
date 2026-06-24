import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Alert
} from '@mui/material';
import { PersonAdd, Phone } from '@mui/icons-material';
import styles from '../../styles/Login.module.css';

const Register = ({ onSendOTP, onSwitchToLogin }) => {
  const [countryCode, setCountryCode] = useState('+91');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [fullName, setFullName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [recentPhone, setRecentPhone] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Validate full name
    if (!fullName || fullName.trim().length < 2) {
      setError('Please enter a valid full name (at least 2 characters)');
      setLoading(false);
      return;
    }

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
      const result = await onSendOTP(fullPhoneNumber, fullName.trim());

      if (result?.success) {
        setOtpSent(true);
        setRecentPhone(fullPhoneNumber);
      } else {
        setError(result?.message || 'Failed to send OTP');
      }
    } catch (err) {
      setError(err?.message || 'Network error. Please try again.');
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

  const handleFullNameChange = (e) => {
    const value = e.target.value;
    // Allow letters, spaces, and common name characters
    if (/^[a-zA-Z\s'-]*$/.test(value) || value === '') {
      setFullName(value);
    }
  };

  return (
    <Box className={styles.loginContainer}>
      <div className={styles.floatingElement}></div>
      <div className={styles.floatingElement}></div>
      <div className={styles.floatingElement}></div>

      <div className={styles.loginLayout}>
        <div className={styles.brandPanel}>
          <div className={styles.brandGlow}></div>
          <div className={styles.brandBadge}>
            <PersonAdd sx={{ fontSize: 36, color: 'white' }} />
          </div>
          <Typography component="h2" className={styles.brandHeadline}>
            Join Mongul Admin
          </Typography>
          <Typography className={styles.brandDescription}>
            Create your admin account and start managing your platform with powerful tools and insights.
          </Typography>
          <div className={styles.brandHighlights}>
            <div className={styles.highlightItem}>
              <span className={styles.highlightDot}></span>
              Quick and secure registration process
            </div>
            <div className={styles.highlightItem}>
              <span className={styles.highlightDot}></span>
              Access to comprehensive admin dashboard
            </div>
            <div className={styles.highlightItem}>
              <span className={styles.highlightDot}></span>
              Full control over platform operations
            </div>
          </div>
        </div>

        <Paper className={styles.loginCard} elevation={0}>
          <Typography component="h1" className={styles.title}>
            Create Account
          </Typography>
          <Typography className={styles.subtitle}>
            Enter your details to create your admin account
          </Typography>

          {error && (
            <Alert severity="error" className={styles.errorAlert}>
              {error}
            </Alert>
          )}

          {otpSent && (
            <Alert severity="success" className={styles.successAlert}>
              OTP sent successfully to {recentPhone}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.formControl}>
              <label htmlFor="full-name" className={styles.label}>
                Full Name
              </label>
              <div style={{ position: 'relative' }}>
                <PersonAdd className={styles.inputIcon} />
                <input
                  id="full-name"
                  type="text"
                  className={styles.input}
                  value={fullName}
                  onChange={handleFullNameChange}
                  placeholder="Enter your full name"
                  maxLength={50}
                  required
                />
              </div>
            </div>

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
                  required
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

            <Typography className={styles.consentText}>
              By tapping Send OTP, you agree to receive a one-time SMS to verify your identity.
            </Typography>

            {onSwitchToLogin && (
              <Typography className={styles.switchText}>
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={onSwitchToLogin}
                  className={styles.switchButton}
                >
                  Sign in
                </button>
              </Typography>
            )}
          </Box>
        </Paper>
      </div>
    </Box>
  );
};

export default Register;

