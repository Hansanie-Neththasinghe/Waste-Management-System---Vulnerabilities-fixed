import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Typography, CircularProgress, Box } from '@mui/material';

function OAuthSuccess() {
  const navigate = useNavigate();

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
        
        // Redirect to resident home after a brief delay
        setTimeout(() => {
          navigate('/resident/home');
        }, 2000);
      } catch (error) {
        console.error('Error parsing OAuth data:', error);
        navigate('/resident?error=auth_failed');
      }
    } else {
      navigate('/resident?error=invalid_response');
    }
  }, [navigate]);

  return (
    <Container component="main" maxWidth="xs" sx={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center' 
    }}>
      <Box textAlign="center">
        <CircularProgress color="success" size={60} />
        <Typography variant="h6" sx={{ mt: 2, color: 'green.700' }}>
          Signing you in...
        </Typography>
        <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
          Please wait while we complete your Google authentication.
        </Typography>
      </Box>
    </Container>
  );
}

export default OAuthSuccess;