import React, { useState } from 'react';
import Login from './Login';
import Register from './Register';
import VerifyOTP from './VerifyOTP';
import RegisterVerifyOTP from './RegisterVerifyOTP';
import { sendOtpAsync, sendRegisterOtpAsync, loginAsync, registerAsync } from '../../store/thunks/authThunks';
import { useDispatch } from 'react-redux';


const AuthFlow = () => {
  const [currentStep, setCurrentStep] = useState('login');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [fullName, setFullName] = useState('');

  const dispatch = useDispatch();

  // Login flow handlers
  const handleSendOTP = async (phone) => {
    try {
      await dispatch(sendOtpAsync({ phone })).unwrap();
      setPhoneNumber(phone);
      setCurrentStep('verify');
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: typeof error === 'string' ? error : error?.message || 'Failed to send OTP',
      };
    }
  };

  const handleVerifyOTP = async (otp) => {
    try {
      await dispatch(loginAsync({ phone: phoneNumber, otp })).unwrap();
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: typeof error === 'string' ? error : error?.message || 'Invalid OTP',
      };
    }
  };

  const handleResendOTP = async () => {
    try {
      await dispatch(sendOtpAsync({ phone: phoneNumber })).unwrap();
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: typeof error === 'string' ? error : error?.message || 'Failed to resend OTP',
      };
    }
  };

  // Register flow handlers
  const handleSendRegisterOTP = async (phone, name) => {
    try {
      await dispatch(sendRegisterOtpAsync({ phone })).unwrap();
      setPhoneNumber(phone);
      setFullName(name);
      setCurrentStep('register-verify');
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: typeof error === 'string' ? error : error?.message || 'Failed to send OTP',
      };
    }
  };

  const handleVerifyRegisterOTP = async (otp) => {
    try {
      await dispatch(registerAsync({ phone: phoneNumber, fullName, otp })).unwrap();
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: typeof error === 'string' ? error : error?.message || 'Invalid OTP',
      };
    }
  };

  const handleResendRegisterOTP = async () => {
    try {
      await dispatch(sendRegisterOtpAsync({ phone: phoneNumber })).unwrap();
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: typeof error === 'string' ? error : error?.message || 'Failed to resend OTP',
      };
    }
  };

  const handleBack = () => {
    if (currentStep === 'verify') {
      setCurrentStep('login');
    } else if (currentStep === 'register-verify') {
      setCurrentStep('register');
    }
  };

  const handleSwitchToRegister = () => {
    setCurrentStep('register');
  };

  const handleSwitchToLogin = () => {
    setCurrentStep('login');
  };

  return (
    <>
      {currentStep === 'login' && (
        <Login 
          onSendOTP={handleSendOTP}
          onSwitchToRegister={handleSwitchToRegister}
        />
      )}

      {currentStep === 'register' && (
        <Register 
          onSendOTP={handleSendRegisterOTP}
          onSwitchToLogin={handleSwitchToLogin}
        />
      )}

      {currentStep === 'verify' && (
        <VerifyOTP 
          phoneNumber={phoneNumber}
          onVerifyOTP={handleVerifyOTP}
          onResendOTP={handleResendOTP}
          onBack={handleBack}
        />
      )}

      {currentStep === 'register-verify' && (
        <RegisterVerifyOTP 
          phoneNumber={phoneNumber}
          fullName={fullName}
          onVerifyOTP={handleVerifyRegisterOTP}
          onResendOTP={handleResendRegisterOTP}
          onBack={handleBack}
        />
      )}
    </>
  );
};

export default AuthFlow;

