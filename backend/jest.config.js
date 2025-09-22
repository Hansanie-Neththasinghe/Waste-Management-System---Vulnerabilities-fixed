module.exports = {
    testEnvironment: 'node',
    verbose: true,
    testTimeout: 30000,  // Extend timeout if needed for database initialization
    setupFilesAfterEnv: ['<rootDir>/setupTests.js'],
  };
  