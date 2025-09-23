import axios from 'axios';
import { API_CONFIG } from '../config/constants';

// Create axios instance with base configuration
const apiClient = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
});

// Request interceptor to add authentication token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token expiration
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('authToken');
      localStorage.removeItem('resident');
      localStorage.removeItem('manager');
      localStorage.removeItem('employee');
      
      // Redirect to login based on current user type
      const currentPath = window.location.pathname;
      if (currentPath.includes('/manager')) {
        window.location.href = '/manager';
      } else if (currentPath.includes('/employee')) {
        window.location.href = '/employee';
      } else {
        window.location.href = '/resident';
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;