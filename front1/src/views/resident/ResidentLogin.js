import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { Container, TextField, Button, Typography, Box } from '@mui/material';

function ResidentLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      // Send login request to the resident login endpoint
      const response = await axios.post('http://localhost:2025/api/resident/login', { username, password });
      console.log('Resident login successful:', response.data);

      // Store resident data in local storage
      localStorage.setItem('resident', JSON.stringify(response.data.resident));

      // Navigate to Resident Home page (adjust as needed)
      navigate('/resident/home');
    } catch (err) {
      if (err.response && err.response.data) {
        setError(err.response.data.message);
      } else {
        setError('An error occurred. Please try again.');
      }
      console.error('Error logging in resident:', err);
    }
  };

  return (
    <Container component="main" maxWidth="xs" sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'green.100' }}>
      <Box
        sx={{
          padding: 4,
          backgroundColor: 'white',
          borderRadius: 2,
          boxShadow: 3,
          textAlign: 'center',
        }}
      >
        <Typography variant="h3" color="green" sx={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif' }}>
          Eco Clean
        </Typography>
        <Typography variant="h6" gutterBottom>
          Resident Login
        </Typography>
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

          {error && (
            <Typography color="error" variant="body2">
              {error}
            </Typography>
          )}

          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2, bgcolor: 'green.700', '&:hover': { bgcolor: 'green.800' } }}
          >
            Log in
          </Button>
        </form>

        <Box mt={2}>
          <Link to="/forgot-password" style={{ color: '#2e7d32', textDecoration: 'none', fontSize: '0.875rem' }}>
            Forgot your password?
          </Link>
        </Box>
        <Box mt={1}>
          <Link to="/resident/create" style={{ color: '#2e7d32', textDecoration: 'none', fontSize: '0.875rem' }}>
            Create account
          </Link>
        </Box>
      </Box>
    </Container>
  );
}

export default ResidentLogin;
