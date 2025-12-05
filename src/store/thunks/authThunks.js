import { createAsyncThunk } from '@reduxjs/toolkit';
import { privateApi, publicApi } from '../../util/axios';
import { API_V1_ENDPOINTS } from '../../config/api';

/**
 * Async thunk to initialize authentication on app startup
 * Checks for existing token and validates it
 */
export const initializeAuthAsync = createAsyncThunk(
  'auth/initializeAuth',
  async (_, { rejectWithValue }) => {
    try {
      const response = await privateApi.get(API_V1_ENDPOINTS.CURRENT_USER);
      const data = response.data;
      // Extract user from response - could be data.user or data.data.user
      const user = data?.data?.user || data?.user || data;
      return {
        user
      };
    } catch (error) {
      console.error('Auth initialization error:', error);
      // Clear invalid token
      localStorage.removeItem('authToken');
      return rejectWithValue(error.response?.data?.message || error.message || 'Failed to initialize auth');
    }
  }
);

/**
 * Async thunk to send OTP for login
 * Makes API call to send OTP to the provided phone number
 */
export const sendOtpAsync = createAsyncThunk(
  'auth/sendOtp',
  async ({ phone }, { rejectWithValue }) => {
    try {
      const response = await publicApi.post(API_V1_ENDPOINTS.SEND_ADMIN_OTP, {
        phone,
      });

      const data = response.data;

      return {
        message: data.message || 'OTP sent successfully',
      };
    } catch (error) {
      console.error('Send OTP error:', error);
      return rejectWithValue(
        error.response?.data?.message || error.message || 'Failed to send OTP'
      );
    }
  }
);

/**
 * Async thunk to send OTP for registration
 * Makes API call to send OTP to the provided phone number for registration
 */
export const sendRegisterOtpAsync = createAsyncThunk(
  'auth/sendRegisterOtp',
  async ({ phone }, { rejectWithValue }) => {
    try {
      const response = await publicApi.post(API_V1_ENDPOINTS.SEND_REGISTER_OTP, {
        phone,
      });

      const data = response.data;

      return {
        message: data.message || 'OTP sent successfully',
      };
    } catch (error) {
      console.error('Send Register OTP error:', error);
      return rejectWithValue(
        error.response?.data?.message || error.message || 'Failed to send OTP'
      );
    }
  }
);


/**
 * Async thunk to handle login
 * Makes API call to verify OTP and then stores token and user data
 */
export const loginAsync = createAsyncThunk(
  'auth/login',
  async ({ phone, otp }, { rejectWithValue }) => {
    try {
      const response = await publicApi.post(API_V1_ENDPOINTS.ADMIN_LOGIN, {
        phone,
        otp,
        isAdminLogin: true, // Flag to indicate this is an admin login attempt
      });

      const data = response.data;

      if (!data.token || !data.user) {
        return rejectWithValue(data.message || 'Invalid OTP');
      }

      localStorage.setItem('authToken', data.token);

      return {
        token: data.token,
        user: data.user,
        message: data.message,
      };
    } catch (error) {
      console.error('Login error:', error);
      return rejectWithValue(
        error.response?.data?.message || error.message || 'Could not connect to server. Please check your internet connection and try again.'
      );
    }
  }
);

/**
 * Async thunk to handle registration
 * Makes API call to register a new user
 */
export const registerAsync = createAsyncThunk(
  'auth/register',
  async ({ phone, fullName, otp }, { rejectWithValue }) => {
    try {
      const response = await publicApi.post(API_V1_ENDPOINTS.REGISTER_VERIFY_OTP, {
        phone,
        fullName,
        otp,
        role: 'admin', // Set role to admin for admin frontend registrations
      });

      const data = response.data;

      if (!data.token || !data.user) {
        return rejectWithValue(data.message || 'Registration failed');
      }

      localStorage.setItem('authToken', data.token);

      return {
        token: data.token,
        user: data.user,
        message: data.message || 'Registration successful',
      };
    } catch (error) {
      console.error('Registration error:', error);
      return rejectWithValue(
        error.response?.data?.message || error.message || 'Failed to register. Please check your internet connection and try again.'
      );
    }
  }
);


/**
 * Async thunk to handle Google login
 * Makes API call with Google ID token and stores token and user data
 */
export const googleLoginAsync = createAsyncThunk(
  'auth/googleLogin',
  async ({ idToken }, { rejectWithValue }) => {
    try {
      const response = await publicApi.post(API_V1_ENDPOINTS.GOOGLE_LOGIN, {
        idToken,
        role: 'admin', // Set role to admin for admin frontend Google login
      });

      const data = response.data;

      if (!data.token || !data.user) {
        return rejectWithValue(data.message || 'Google login failed');
      }

      localStorage.setItem('authToken', data.token);

      return {
        token: data.token,
        user: data.user,
        message: data.message || 'Google login successful',
      };
    } catch (error) {
      console.error('Google login error:', error);
      return rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          'Google login failed. Please try again.'
      );
    }
  }
);

/**
 * Async thunk to handle logout
 * Makes API call to logout and clears token from localStorage
 */
export const logoutAsync = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      localStorage.removeItem('authToken');
      return true;
    } catch (error) {
      console.error('Logout error:', error);
      return rejectWithValue(error.message || 'Failed to logout');
    }
  }
);
