import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Alert,
  Divider
} from '@mui/material';
import { Phone } from '@mui/icons-material';
import { GoogleLogin } from '@react-oauth/google';
import styles from '../../styles/Login.module.css';

const Login = ({ onSendOTP, onSwitchToRegister, onGoogleLogin }) => {
  const [countryCode, setCountryCode] = useState('+91');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [recentPhone, setRecentPhone] = useState('');

  const handleGoogleSuccess = async (credentialResponse) => {
    if (!credentialResponse?.credential) {
      setError('Failed to get Google credentials');
      return;
    }

    setGoogleLoading(true);
    setError('');

    try {
      const result = await onGoogleLogin(credentialResponse.credential);
      if (!result?.success) {
        setError(result?.message || 'Google login failed');
      }
    } catch (err) {
      setError(err?.message || 'Google login failed. Please try again.');
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleGoogleError = () => {
    setError('Google sign-in was cancelled or failed');
  };

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
      const result = await onSendOTP(fullPhoneNumber);

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

  return (
    <Box className={styles.loginContainer}>
      <div className={styles.floatingElement}></div>
      <div className={styles.floatingElement}></div>
      <div className={styles.floatingElement}></div>

      <div className={styles.loginLayout}>
        <div className={styles.brandPanel}>
          <div className={styles.brandGlow}></div>
          <div className={styles.brandBadge}>
            <Phone sx={{ fontSize: 36, color: 'white' }} />
          </div>
          <Typography component="h2" className={styles.brandHeadline}>
            Welcome to Mongul Admin
          </Typography>
          <Typography className={styles.brandDescription}>
            Monitor operations, track performance, and empower your team with real-time insights.
          </Typography>
          <div className={styles.brandHighlights}>
            <div className={styles.highlightItem}>
              <span className={styles.highlightDot}></span>
              Secure OTP login with instant verification
            </div>
            <div className={styles.highlightItem}>
              <span className={styles.highlightDot}></span>
              Live dashboards tailored to your business
            </div>
            <div className={styles.highlightItem}>
              <span className={styles.highlightDot}></span>
              24/7 access across devices
            </div>
          </div>
        </div>

        <Paper className={styles.loginCard} elevation={0}>
          <Typography component="h1" className={styles.title}>
            Admin Login
          </Typography>
          <Typography className={styles.subtitle}>
            Enter your phone number to receive a one-time passcode
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
              disabled={loading || googleLoading}
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

            <Box sx={{ my: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
              <Divider sx={{ flex: 1 }} />
              <Typography variant="body2" color="text.secondary">
                OR
              </Typography>
              <Divider sx={{ flex: 1 }} />
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={handleGoogleError}
                disabled={loading || googleLoading}
                useOneTap={false}
              />
            </Box>

            <Typography className={styles.consentText}>
              By tapping Send OTP, you agree to receive a one-time SMS to verify your identity.
            </Typography>

            {onSwitchToRegister && (
              <Typography className={styles.switchText}>
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={onSwitchToRegister}
                  className={styles.switchButton}
                >
                  Sign up
                </button>
              </Typography>
            )}
          </Box>
        </Paper>
      </div>
    </Box>
  );
};

export default Login;

