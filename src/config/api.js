// API Configuration
// const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8086';
const API_BASE_URL =  'http://localhost:8086';
// Debug logging
 

export const API_ENDPOINTS = {
  // Auth endpoints
  SEND_ADMIN_OTP: `${API_BASE_URL}/api/auth/send-admin-otp`,
  ADMIN_LOGIN: `${API_BASE_URL}/api/auth/admin-login`,
  MENTOR_LIST: `${API_BASE_URL}/api/users/mentor-list`,
  MENTEE_LIST: `${API_BASE_URL}/api/users/mentee-list`, 
  MENTEE_BECOME_MENTOR_QUEUE: `${API_BASE_URL}/api/users/mentee/become-mentor-queue`,
  // Mentor approval endpoints
  APPROVE_MENTOR: `${API_BASE_URL}/api/users/mentor`,
  REJECT_MENTOR: `${API_BASE_URL}/api/users/mentor`,
  // Add other endpoints here as needed
  // USERS: `${API_BASE_URL}/api/users`,
  // PROGRAMS: `${API_BASE_URL}/api/programs`,
  // etc.
};

export default API_BASE_URL; 