import React, { useState } from 'react';
import Login from './Login';
import VerifyOTP from './VerifyOTP';

const AuthFlow = ({ onLoginSuccess }) => {
  const [currentStep, setCurrentStep] = useState('login'); // 'login' or 'verify'
  const [phoneNumber, setPhoneNumber] = useState('');

  const handleSendOTP = (phone) => {
    setPhoneNumber(phone);
    setCurrentStep('verify');
  };

  const handleVerifyOTP = (data) => {
    // Store the token and user data
    localStorage.setItem('adminToken', data.token);
    localStorage.setItem('adminUser', JSON.stringify(data.user));
    
    // Store login time for session management
    localStorage.setItem('loginTime', Date.now().toString());
    
    // Call the success callback
    onLoginSuccess(data);
  };

  const handleBack = () => {
    setCurrentStep('login');
    setPhoneNumber('');
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
          onBack={handleBack}
        />
      )}
    </>
  );
};

export default AuthFlow; 