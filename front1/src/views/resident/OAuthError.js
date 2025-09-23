import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Typography, Button, Box, Alert } from '@mui/material';

function OAuthError() {
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState('Authentication failed');

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const message = urlParams.get('message');
    
    if (message) {
      setErrorMessage(decodeURIComponent(message));
    }
  }, []);

  const handleRetry = () => {
    navigate('/resident');
  };

  return (
    <Container component="main" maxWidth="xs" sx={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center' 
    }}>
      <Box textAlign="center">
        <Alert severity="error" sx={{ mb: 3 }}>
          <Typography variant="h6">
            Authentication Failed
          </Typography>
        </Alert>
        
        <Typography variant="body1" color="textSecondary" sx={{ mb: 3 }}>
          {errorMessage}
        </Typography>
        
        <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
          There was an issue with your Google authentication. Please try again.
        </Typography>
        
        <Button
          variant="contained"
          onClick={handleRetry}
          sx={{ 
            bgcolor: 'green.700', 
            '&:hover': { bgcolor: 'green.800' } 
          }}
        >
          Try Again
        </Button>
      </Box>
    </Container>
  );
}

export default OAuthError;