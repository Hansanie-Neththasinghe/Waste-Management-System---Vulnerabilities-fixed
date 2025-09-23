import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { Container, TextField, Button, Typography, Box, Divider } from '@mui/material';
import GoogleIcon from '@mui/icons-material/Google';

function ResidentLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Handle OAuth success callback
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    const userParam = urlParams.get('user');

    if (token && userParam) {
      try {
        const user = JSON.parse(decodeURIComponent(userParam));
        
        // Store user data and token
        localStorage.setItem('resident', JSON.stringify(user));
        localStorage.setItem('authToken', token);
        
        // Navigate to resident home
        navigate('/resident/home');
      } catch (error) {
        console.error('Error parsing OAuth callback data:', error);
        setError('Authentication failed. Please try again.');
      }
    }

    const errorMessage = urlParams.get('message');
    if (errorMessage) {
      setError(decodeURIComponent(errorMessage));
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      // Send login request to the resident login endpoint
      const response = await axios.post('http://localhost:2025/api/resident/login', { username, password });
      console.log('Resident login successful:', response.data);

      // Store both resident data and token in local storage
      localStorage.setItem('resident', JSON.stringify(response.data.resident));
      localStorage.setItem('authToken', response.data.token);

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

  const handleGoogleSignIn = () => {
    // Redirect to Google OAuth endpoint
    window.location.href = 'http://localhost:2025/auth/google';
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

        {/* Divider */}
        <Divider sx={{ my: 3 }}>
          <Typography variant="body2" color="textSecondary">
            OR
          </Typography>
        </Divider>

        {/* Google Sign-In Button */}
        <Button
          fullWidth
          variant="outlined"
          startIcon={<GoogleIcon />}
          onClick={handleGoogleSignIn}
          sx={{ 
            mb: 2, 
            borderColor: '#db4437', 
            color: '#db4437',
            '&:hover': { 
              borderColor: '#c23321', 
              backgroundColor: '#fdf2f2' 
            } 
          }}
        >
          Continue with Google
        </Button>

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
