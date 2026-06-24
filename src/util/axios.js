import axios from "axios";
import { API_BASE_URL } from "../config/api";
import store from "../store";
import { logoutAsync } from "../store/thunks/authThunks";

// Instance for authenticated requests
export const privateApi = axios.create({
  baseURL: API_BASE_URL,
});

// Instance for public requests
export const publicApi = axios.create({
  baseURL: API_BASE_URL,
});

// Add token only to private requests
privateApi.interceptors.request.use(
  async config => {
    try {
      const token = localStorage.getItem('authToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    } catch (error) {
      console.error('Error accessing localStorage:', error);
      return config;
    }
  },
  error => {
    return Promise.reject(error);
  },
);

// Handle response errors for private API (401 should logout)
const handlePrivateApiError = async error => {
  if (error.response?.status === 401) {
    try {
      store.dispatch(logoutAsync());
    } catch (storageError) {
      console.error('Error clearing auth from localStorage:', storageError);
      store.dispatch(logoutAsync());
    }
  }
  return Promise.reject(error);
};

// Handle response errors for public API (no logout needed)
const handlePublicApiError = error => {
  // Just pass through errors for public API
  return Promise.reject(error);
};

privateApi.interceptors.response.use(
  response => response,
  handlePrivateApiError,
);

publicApi.interceptors.response.use(
  response => response,
  handlePublicApiError,
);
