import React, { useEffect, useState } from 'react';
import { Container, Box, Typography, Grid, Avatar, Button, IconButton, TextField, Divider } from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { Header, Footer } from '../../components/header'; 
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const UserProfile = () => {
  const manager = JSON.parse(localStorage.getItem('manager'));
  
  const [formData, setFormData] = useState({
    firstName: manager.firstName,
    lastName: manager.lastName,
    email: manager.email,
    phoneNumber: manager.phoneNumber,
    password: '',
  });
  const [isEditing, setIsEditing] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const navigate = useNavigate();

  // Update the time every second
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formattedDate = format(currentTime, 'PPP');
  const formattedTime = format(currentTime, 'p');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleEditClick = () => setIsEditing(true);

  const handleSaveClick = async () => {
    try {
      const response = await axios.put(`http://localhost:2025/api/manager/${manager._id}`, formData);
      if (response.status === 200) {
        localStorage.setItem('manager', JSON.stringify(response.data));
        setIsEditing(false);
        toast.success('Profile updated successfully!');
      }
    } catch (error) {
      toast.error('Failed to update profile. Please try again.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('manager');
    navigate('/manager');
  };

  return (
    <div>
      <Header />
      <Container sx={{ mt: 4 }}>
        <Grid container justifyContent="center">
          <Grid item xs={12} sm={8} md={6}>
            <Box
              sx={{
                p: 3,
                backgroundColor: '#ffffff',
                borderRadius: 3,
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
              }}
            >
              <Grid container justifyContent="center" sx={{ mb: 3 }}>
                <Avatar
                  sx={{
                    width: 100,
                    height: 100,
                    bgcolor: '#1976d2',
                    fontSize: 36,
                  }}
                >
                  {formData.firstName.charAt(0)}
                </Avatar>
              </Grid>

              <Typography
                variant="h4"
                align="center"
                gutterBottom
                sx={{ fontWeight: 600, fontSize: '1.8rem', color: '#333' }}
              >
                {formData.firstName} {formData.lastName}
              </Typography>

              {/* Profile Info */}
              <Divider sx={{ my: 3 }} />
              <Typography variant="h6" gutterBottom sx={{ color: '#1976d2', fontWeight: 600 }}>
                Profile Information
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Typography variant="body1" sx={{ color: '#666' }}>
                    <strong>Email:</strong>{' '}
                    {isEditing ? (
                      <TextField
                        fullWidth
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        variant="outlined"
                      />
                    ) : (
                      <span>{formData.email}</span>
                    )}
                  </Typography>
                </Grid>

                <Grid item xs={12}>
                  <Typography variant="body1" sx={{ color: '#666' }}>
                    <strong>Phone Number:</strong>{' '}
                    {isEditing ? (
                      <TextField
                        fullWidth
                        name="phoneNumber"
                        value={formData.phoneNumber}
                        onChange={handleInputChange}
                        variant="outlined"
                      />
                    ) : (
                      <span>{formData.phoneNumber}</span>
                    )}
                  </Typography>
                </Grid>
              </Grid>

              {/* Password Change */}
              <Divider sx={{ my: 3 }} />
              <Typography variant="h6" gutterBottom sx={{ color: '#1976d2', fontWeight: 600 }}>
                Change Password
              </Typography>
              <TextField
                fullWidth
                name="password"
                label="New Password"
                type="password"
                value={formData.password}
                onChange={handleInputChange}
                variant="outlined"
                sx={{ mb: 2 }}
                disabled={!isEditing}
              />

              {/* Action Buttons */}
              <Box display="flex" justifyContent="center" sx={{ mt: 3 }}>
                {isEditing ? (
                  <Button
                    variant="contained"
                    color="primary"
                    startIcon={<SaveIcon />}
                    onClick={handleSaveClick}
                    sx={{ mr: 2 }}
                  >
                    Save Changes
                  </Button>
                ) : (
                  <IconButton onClick={handleEditClick} color="primary">
                    <EditIcon />
                  </IconButton>
                )}
              </Box>

              {/* Logout Button */}
              <Box display="flex" justifyContent="center" sx={{ mt: 3 }}>
                <Button
                  variant="contained"
                  color="error"
                  startIcon={<LogoutIcon />}
                  onClick={handleLogout}
                  sx={{ width: '100%' }}
                >
                  Logout
                </Button>
              </Box>
            </Box>
          </Grid>
        </Grid>

        {/* Toast Notification Container */}
        <ToastContainer />
      </Container>

      <Footer role="manager" />
    </div>
  );
};

export default UserProfile;
