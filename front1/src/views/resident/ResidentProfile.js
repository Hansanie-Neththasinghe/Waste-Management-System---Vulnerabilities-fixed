import React, { useState, useEffect } from 'react';
import { Container, Card, CardContent, Typography, Avatar, Grid, Button, TextField, IconButton, Box, Divider } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import LogoutIcon from '@mui/icons-material/Logout';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Header, Footer } from '../../components/header';
import { useNavigate } from 'react-router-dom';

const ResidentProfile = () => {
  const navigate = useNavigate();

  // Get resident data from localStorage (replace with API call as needed)
  const residentData = localStorage.getItem('resident');
  let resident = null;
  try {
    resident = residentData ? JSON.parse(residentData) : null;
  } catch (e) {
    console.error('Invalid resident data in localStorage', e);
    resident = null;
  }

  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState(resident);
  const [formData, setFormData] = useState(profileData);
  const [passwordData, setPasswordData] = useState({ oldPassword: '', newPassword: '' });
  const [totalPoints, setTotalPoints] = useState(0); // State to store total points

  // Fetch total points from the backend
  useEffect(() => {
    if (resident && resident._id) {
      const fetchTotalPoints = async () => {
        try {
          const response = await axios.get(`http://localhost:2025/api/resident/${resident.username}`);
          setTotalPoints(response.data.totalPoints);
        } catch (error) {
          console.error('Error fetching total points:', error);
        }
      };
      fetchTotalPoints();
    }
  }, [resident]);

  // Toggle Edit Mode
  const handleEditClick = () => setIsEditing(!isEditing);

  // Handle Input Changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle Password Change Input
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData({ ...passwordData, [name]: value });
  };

  // Save Profile Changes
  const handleSaveClick = async () => {
    try {
      await axios.put(`http://localhost:2025/api/resident/${resident._id}`, formData);
      setProfileData(formData);
      setIsEditing(false);
      toast.success('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating resident profile:', error);
      toast.error('Error updating profile. Please try again.');
    }
  };

  // Handle Password Change
  const handlePasswordChangeClick = () => {
    if (passwordData.newPassword !== '') {
      toast.success('Password changed successfully!');
      setPasswordData({ oldPassword: '', newPassword: '' });
    } else {
      toast.error('Please enter a new password.');
    }
  };

  // Handle Logout
  const handleLogout = () => {
    localStorage.removeItem('resident');
    toast.success('Logged out successfully!');
    navigate('/resident'); // Redirect to login page
  };

  return (
    <div>
      <Header />
      <Container sx={{ mt: 4 }}>
        <Grid container justifyContent="center">
          <Grid item xs={12} sm={8} md={6}>
            <Card
              elevation={6}
              sx={{
                p: 3,
                borderRadius: '16px',
                backgroundColor: '#ffffff',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
              }}
            >
              {/* Profile Avatar */}
              <Grid container justifyContent="center" sx={{ mb: 3 }}>
                <Avatar sx={{ width: 120, height: 120, bgcolor: '#1976d2', fontSize: 50 }}>
                  {profileData.name.charAt(0)}
                </Avatar>
              </Grid>
              <CardContent>
                {/* Profile Name */}
                <Typography
                  variant="h4"
                  align="center"
                  gutterBottom
                  sx={{ color: '#333', fontWeight: 600, fontSize: '2.2rem' }}
                >
                  {profileData.name}
                </Typography>

                {/* Total Points */}
                <Typography
                  variant="h6"
                  align="center"
                  gutterBottom
                  sx={{ color: '#1976d2', fontWeight: 600, mt: 2, mb: 3 }}
                >
                  Total Points: {totalPoints} 
                </Typography>

                {/* Profile Info */}
                <Grid container spacing={2} sx={{ mt: 2 }}>
                  <Grid item xs={12}>
                    <Typography variant="body1" gutterBottom sx={{ color: '#666', fontSize: '1rem' }}>
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
                        <span>{profileData.email}</span>
                      )}
                    </Typography>
                  </Grid>

                  <Grid item xs={12}>
                    <Typography variant="body1" gutterBottom sx={{ color: '#666', fontSize: '1rem' }}>
                      <strong>Contact:</strong>{' '}
                      {isEditing ? (
                        <TextField
                          fullWidth
                          name="contactNumber"
                          value={formData.contactNumber}
                          onChange={handleInputChange}
                          variant="outlined"
                        />
                      ) : (
                        <span>{profileData.contactNumber}</span>
                      )}
                    </Typography>
                  </Grid>

                  <Grid item xs={12}>
                    <Typography variant="body1" gutterBottom sx={{ color: '#666', fontSize: '1rem' }}>
                      <strong>Address:</strong>{' '}
                      {isEditing ? (
                        <TextField
                          fullWidth
                          name="address"
                          value={formData.address}
                          onChange={handleInputChange}
                          variant="outlined"
                        />
                      ) : (
                        <span>{profileData.address}</span>
                      )}
                    </Typography>
                  </Grid>
                </Grid>

                {/* Account Details */}
                <Divider sx={{ my: 3 }} />
                <Typography variant="h6" gutterBottom sx={{ color: '#1976d2', fontWeight: 600 }}>
                  Account Details
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Typography variant="body1" gutterBottom sx={{ color: '#666', fontSize: '1rem' }}>
                      <strong>Account Number:</strong>{' '}
                      {isEditing ? (
                        <TextField
                          fullWidth
                          name="accountNumber"
                          value={formData.accountNumber}
                          onChange={handleInputChange}
                          variant="outlined"
                        />
                      ) : (
                        <span>{profileData.accountNumber}</span>
                      )}
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="body1" gutterBottom sx={{ color: '#666', fontSize: '1rem' }}>
                      <strong>Bank:</strong>{' '}
                      {isEditing ? (
                        <TextField
                          fullWidth
                          name="bank"
                          value={formData.bank}
                          onChange={handleInputChange}
                          variant="outlined"
                        />
                      ) : (
                        <span>{profileData.bank}</span>
                      )}
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="body1" gutterBottom sx={{ color: '#666', fontSize: '1rem' }}>
                      <strong>Branch:</strong>{' '}
                      {isEditing ? (
                        <TextField
                          fullWidth
                          name="branch"
                          value={formData.branch}
                          onChange={handleInputChange}
                          variant="outlined"
                        />
                      ) : (
                        <span>{profileData.branch}</span>
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
                  name="oldPassword"
                  label="Old Password"
                  type="password"
                  value={passwordData.oldPassword}
                  onChange={handlePasswordChange}
                  variant="outlined"
                  sx={{ mb: 2 }}
                />
                <TextField
                  fullWidth
                  name="newPassword"
                  label="New Password"
                  type="password"
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                  variant="outlined"
                  sx={{ mb: 2 }}
                />
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={handlePasswordChangeClick}
                  sx={{ mb: 2, width: '100%' }}
                >
                  Change Password
                </Button>

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
                      Save
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
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Toast Notification Container */}
        <ToastContainer />
      </Container>
      <Footer role="resident" />
    </div>
  );
};

export default ResidentProfile;
