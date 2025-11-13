import React, { useState } from 'react';
import Login from './Login';
import VerifyOTP from './VerifyOTP';
import { sendOtpAsync, loginAsync } from '../../store/thunks/authThunks';
import { useDispatch } from 'react-redux';


const AuthFlow = () => {
  const [currentStep, setCurrentStep] = useState('login');
  const [phoneNumber, setPhoneNumber] = useState('');

  const dispatch = useDispatch();

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

  const handleBack = () => {
    setCurrentStep('login');
  };

  return (
    <>
      {currentStep === 'login' && (
        <Login onSendOTP={handleSendOTP} />
      )}

      {currentStep === 'verify' && (
        <VerifyOTP 
          phoneNumber={phoneNumber}
          onVerifyOTP={handleVerifyOTP}
          onResendOTP={handleResendOTP}
          onBack={handleBack}
        />
      )}
    </>
  );
};

export default AuthFlow;

