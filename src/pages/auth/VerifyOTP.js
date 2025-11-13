import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Alert,
} from '@mui/material';
import { Security, ArrowBack } from '@mui/icons-material';
import styles from '../../styles/Login.module.css';

const VerifyOTP = ({ phoneNumber, onVerifyOTP, onResendOTP, onBack }) => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(300); // 5 minutes in seconds
  const [canResend, setCanResend] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');

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
      const result = await onVerifyOTP(otpString);

      if (result?.success) {
        setStatusMessage('OTP verified! Redirecting...');
      } else {
        setError(result?.message || 'Invalid OTP');
      }
    } catch (err) {
      setError(err?.message || 'Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setError('');
    setStatusMessage('');
    setLoading(true);

    try {
      const result = await onResendOTP();

      if (result?.success) {
        setTimer(300); // Reset timer to 5 minutes
        setCanResend(false);
        setOtp(['', '', '', '', '', '']); // Clear OTP fields
        setStatusMessage('A new OTP has been sent to your phone.');
      } else {
        setError(result?.message || 'Failed to resend OTP');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box className={`${styles.loginContainer} ${styles.verifyContainer}`}>
      <div className={styles.floatingElement}></div>
      <div className={styles.floatingElement}></div>
      <div className={styles.floatingElement}></div>

      <div className={`${styles.loginLayout} ${styles.verifyLayout}`}>
        <div className={styles.brandPanel}>
          <div className={styles.brandGlow}></div>
          <div className={styles.brandBadge}>
            <Security sx={{ fontSize: 34, color: 'white' }} />
          </div>
          <Typography component="h2" className={styles.brandHeadline}>
            Secure Access Verification
          </Typography>
          <Typography className={styles.brandDescription}>
            For your security, we verify every login with a short one-time passcode. This keeps your
            admin controls protected even if a password is compromised.
          </Typography>
          <div className={styles.brandHighlights}>
            <div className={styles.highlightItem}>
              <span className={styles.highlightDot}></span>
              End-to-end encrypted verification
            </div>
            <div className={styles.highlightItem}>
              <span className={styles.highlightDot}></span>
              OTP expires in 5 minutes for enhanced safety
            </div>
            <div className={styles.highlightItem}>
              <span className={styles.highlightDot}></span>
              Contact support instantly if you notice suspicious activity
            </div>
          </div>
        </div>

        <Paper className={`${styles.loginCard} ${styles.verifyCard}`} elevation={0}>
          <Typography component="h1" className={styles.title}>
            Verify OTP
          </Typography>
          <Typography className={styles.subtitle}>
            Enter the 6-digit code sent to <strong>{phoneNumber}</strong>
          </Typography>

          {error && (
            <Alert severity="error" className={styles.errorAlert}>
              {error}
            </Alert>
          )}

          {statusMessage && !error && (
            <Alert severity="success" className={styles.successAlert}>
              {statusMessage}
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
              <Typography variant="body2" className={styles.timerText}>
                {timer > 0 ? (
                  <>
                    Code expires in <span className={styles.timerValue}>{formatTime(timer)}</span>
                  </>
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
      </div>
    </Box>
  );
};

export default VerifyOTP;

