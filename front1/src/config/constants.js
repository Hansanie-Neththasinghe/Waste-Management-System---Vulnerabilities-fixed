export const API_CONFIG = {
  BASE_URL: process.env.REACT_APP_API_URL || 'http://localhost:2025/api',
  TIMEOUT: 10000,
  VERSION: process.env.REACT_APP_API_VERSION || 'v1'
};

export const APP_CONFIG = {
  CLIENT_URL: process.env.REACT_APP_CLIENT_URL || 'http://localhost:3000',
  ENV: process.env.REACT_APP_ENV || 'development'
};