import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Typography, Box, Container } from '@mui/material';

const SplashScreen = () => {
  const navigate = useNavigate();

  const handleNavigation = (role) => {
    switch (role) {
      case 'manager':
        navigate('/manager');
        break;
      case 'resident':
        navigate('/resident');
        break;
      case 'driver':
        navigate('/employee');
        break;
      default:
        break;
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'darkgreen',  // Dark green background
        color: '#fff',
        p: 2, // Padding for smaller screens
      }}
    >
      <Container maxWidth="sm">
        <Box
          sx={{
            textAlign: 'center',
            mb: 4,
          }}
        >
          <Typography
            variant="h3"
            sx={{
              fontWeight: 'bold',
              mb: 3,
              fontSize: { xs: '2rem', md: '2.5rem' }, // Adjust font size for mobile
            }}
          >
            Welcome to Eco Clean
          </Typography>
        </Box>
        
        {/* Buttons Section */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 2,  // Spacing between buttons
            alignItems: 'center',
          }}
        >
          <Button
            variant="contained"
            color="primary"
            fullWidth
            sx={{
              py: 1.5,  // Increase button padding
              borderRadius: '8px',
              fontSize: { xs: '1rem', md: '1.2rem' }, // Adjust font size for buttons
              bgcolor: '#388e3c',  // Custom button color
              '&:hover': {
                bgcolor: '#2e7d32',
              },
            }}
            onClick={() => handleNavigation('manager')}
          >
            Manager
          </Button>

          <Button
            variant="contained"
            color="primary"
            fullWidth
            sx={{
              py: 1.5,
              borderRadius: '8px',
              fontSize: { xs: '1rem', md: '1.2rem' },
              bgcolor: '#388e3c',
              '&:hover': {
                bgcolor: '#2e7d32',
              },
            }}
            onClick={() => handleNavigation('resident')}
          >
            Resident
          </Button>

          <Button
            variant="contained"
            color="primary"
            fullWidth
            sx={{
              py: 1.5,
              borderRadius: '8px',
              fontSize: { xs: '1rem', md: '1.2rem' },
              bgcolor: '#388e3c',
              '&:hover': {
                bgcolor: '#2e7d32',
              },
            }}
            onClick={() => handleNavigation('driver')}
          >
            Driver
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default SplashScreen;
