import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Container, TextField, Button, Typography, Box } from '@mui/material';

const EmployeeLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:2025/api/employee/login', { username, password });

      // Store employee data in local storage or state
      localStorage.setItem('employee', JSON.stringify(response.data.data));

      // Navigate to Employee Home page or dashboard
      navigate('/employee/home');
    } catch (err) {
      if (err.response && err.response.data) {
        setError(err.response.data.message);
      } else {
        setError('An error occurred. Please try again.');
      }
      console.error('Error logging in employee:', err);
    }
  };

  return (
    <Container
      component="main"
      maxWidth="xs"
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: 'green.100',
      }}
    >
      <Box
        sx={{
          padding: 4,
          backgroundColor: 'white',
          borderRadius: 2,
          boxShadow: 3,
          textAlign: 'center',
        }}
      >
        {/* Title */}
        <Typography variant="h3" color="green" sx={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif' }}>
          Eco Clean
        </Typography>
        <Typography variant="h6" gutterBottom>
          Employee Login
        </Typography>

        {/* Login Form */}
        <form onSubmit={handleLogin}>
          <TextField
            margin="normal"
            fullWidth
            label="User Name"
            variant="outlined"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <TextField
            margin="normal"
            fullWidth
            label="Password"
            variant="outlined"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {/* Display error message */}
          {error && (
            <Typography color="error" variant="body2">
              {error}
            </Typography>
          )}

          {/* Submit Button */}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2, bgcolor: 'green.700', '&:hover': { bgcolor: 'green.800' } }}
          >
            Log in
          </Button>
        </form>

        {/* Additional Links */}
        <Box mt={2}>
          <Typography variant="body2" sx={{ color: '#2e7d32', textDecoration: 'none' }}>
            Forgot your password?
          </Typography>
        </Box>
        <Box mt={1}>
          <Typography variant="body2" sx={{ color: '#2e7d32', textDecoration: 'none' }}>
            Create account
          </Typography>
        </Box>
      </Box>
    </Container>
  );
};

export default EmployeeLogin;
