module.exports = {
  SERVER: {
    PORT: process.env.PORT || 2025,
    NODE_ENV: process.env.NODE_ENV || 'development',
    API_VERSION: process.env.API_VERSION || 'v1'
  },
  
  DATABASE: {
    MONGO_URI: process.env.MONGO_URI
  },

  AUTH: {
    JWT_SECRET: process.env.JWT_SECRET,
    JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
    BCRYPT_SALT_ROUNDS: parseInt(process.env.BCRYPT_SALT_ROUNDS) || 12,
    SESSION_SECRET: process.env.SESSION_SECRET || 'your-session-secret'
  },

  CORS: {
    CLIENT_URL: process.env.CLIENT_URL || 'http://localhost:3000'
  },

  LOGGING: {
    LOG_LEVEL: process.env.LOG_LEVEL || 'info'
  }
};