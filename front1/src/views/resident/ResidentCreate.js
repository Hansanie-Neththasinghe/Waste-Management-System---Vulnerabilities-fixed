import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Container, TextField, Button, Typography, Box } from '@mui/material';
import { toast, ToastContainer } from 'react-toastify'; // Import toast components
import 'react-toastify/dist/ReactToastify.css'; // Import toast styles

function CreateAccount() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState(''); // Add confirm password state
  const [email, setEmail] = useState('');
  const [name, setName] = useState(''); // Add name state
  const [contactNumber, setContactNumber] = useState(''); // Add contact number state
  const [address, setAddress] = useState(''); // Add address state
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleCreateAccount = async (e) => {
    e.preventDefault();
    setError('');

    // Validate password and confirm password match
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      // Call the backend to create a new resident account
      const response = await axios.post('http://localhost:2025/api/resident', { 
        username, 
        password, 
        email, 
        name, 
        contactNumber, 
        address // Include the new required fields
      });
      console.log('Resident account created successfully:', response.data);

      // Show success toast notification
      toast.success('Account created successfully! Please login.');

      // Redirect to login page after a short delay
      setTimeout(() => {
        navigate('/resident/');
      }, 2000);
    } catch (err) {
      // Handle backend error responses such as username or email already exists
      if (err.response && err.response.data) {
        setError(err.response.data.message);
      } else {
        setError('An error occurred. Please try again.');
      }
      console.error('Error creating resident account:', err);
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
          Create Resident Account
        </Typography>
        <form onSubmit={handleCreateAccount}>
          <TextField
            margin="normal"
            fullWidth
            label="Full Name"
            variant="outlined"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <TextField
            margin="normal"
            fullWidth
            label="Contact Number"
            variant="outlined"
            value={contactNumber}
            onChange={(e) => setContactNumber(e.target.value)}
            required
          />
          <TextField
            margin="normal"
            fullWidth
            label="Address"
            variant="outlined"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
          />
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
            label="Email"
            variant="outlined"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
          <TextField
            margin="normal"
            fullWidth
            label="Confirm Password"
            variant="outlined"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
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
            Create Account
          </Button>
        </form>
      </Box>

      {/* Toast Container to display toast notifications */}
      <ToastContainer position="top-center" />
    </Container>
  );
}

export default CreateAccount;
