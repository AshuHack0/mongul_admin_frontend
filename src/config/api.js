// API Configuration
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8086';

// Debug logging
 

export const API_ENDPOINTS = {
  // Auth endpoints
  SEND_ADMIN_OTP: `${API_BASE_URL}/api/auth/send-admin-otp`,
  ADMIN_LOGIN: `${API_BASE_URL}/api/auth/admin-login`,
  
  // Add other endpoints here as needed
  // USERS: `${API_BASE_URL}/api/users`,
  // PROGRAMS: `${API_BASE_URL}/api/programs`,
  // etc.
};

export default API_BASE_URL; 