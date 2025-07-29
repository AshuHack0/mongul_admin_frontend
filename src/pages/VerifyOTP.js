import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Container,
  Alert,
  IconButton
} from '@mui/material';
import { Security, ArrowBack } from '@mui/icons-material';
import styles from '../styles/Login.module.css';
import { API_ENDPOINTS } from '../config/api';

const VerifyOTP = ({ phoneNumber, onVerifyOTP, onBack }) => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(300); // 5 minutes in seconds
  const [canResend, setCanResend] = useState(false);

  // Timer countdown
  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer(prev => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    } else {
      setCanResend(true);
    }
  }, [timer]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleOtpChange = (index, value) => {
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      // Auto-focus next input
      if (value && index < 5) {
        const nextInput = document.getElementById(`otp-${index + 1}`);
        if (nextInput) nextInput.focus();
      }
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      if (prevInput) prevInput.focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const otpString = otp.join('');
    if (otpString.length !== 6) {
      setError('Please enter a valid 6-digit OTP');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(API_ENDPOINTS.ADMIN_LOGIN, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          phone: phoneNumber, 
          otp: otpString 
        }),
      });

      const data = await response.json();

      if (data.success) {
        onVerifyOTP(data);
      } else {
        setError(data.message || 'Invalid OTP');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setError('');
    setLoading(true);

    try {
      const response = await fetch(API_ENDPOINTS.SEND_ADMIN_OTP, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phone: phoneNumber }),
      });

      const data = await response.json();

      if (data.success) {
        setTimer(300); // Reset timer to 5 minutes
        setCanResend(false);
        setOtp(['', '', '', '', '', '']); // Clear OTP fields
        setError('');
      } else {
        setError(data.message || 'Failed to resend OTP');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
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
            <Security sx={{ fontSize: 45, color: 'white' }} />
          </Box>

          <Typography component="h1" className={styles.title}>
            Verify OTP
          </Typography>
          <Typography className={styles.subtitle}>
            Enter the 6-digit code sent to {phoneNumber}
          </Typography>

          {error && (
            <Alert severity="error" className={styles.errorAlert}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.otpContainer}>
              {otp.map((digit, index) => (
                <input
                  key={index}
                  id={`otp-${index}`}
                  type="text"
                  className={styles.otpInput}
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  maxLength={1}
                  autoFocus={index === 0}
                />
              ))}
            </div>

            <div className={styles.timerContainer}>
              <Typography variant="body2" color="textSecondary">
                {timer > 0 ? (
                  `Resend OTP in ${formatTime(timer)}`
                ) : (
                  'OTP expired'
                )}
              </Typography>
            </div>

            <button
              type="submit"
              className={styles.submitButton}
              disabled={loading || otp.join('').length !== 6}
            >
              {loading ? (
                <>
                  <span className={styles.loadingSpinner}></span>
                  Verifying...
                </>
              ) : (
                'Verify OTP'
              )}
            </button>

            <div className={styles.actionButtons}>
              <button
                type="button"
                className={styles.backButton}
                onClick={onBack}
                disabled={loading}
              >
                <ArrowBack sx={{ fontSize: 20 }} />
                Back
              </button>

              <button
                type="button"
                className={styles.resendButton}
                onClick={handleResendOTP}
                disabled={loading || !canResend}
              >
                Resend OTP
              </button>
            </div>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default VerifyOTP; 