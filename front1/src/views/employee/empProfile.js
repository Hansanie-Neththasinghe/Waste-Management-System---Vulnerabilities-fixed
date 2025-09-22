import React, { useEffect, useState } from 'react';
import { Container, Avatar, Typography, Grid, TextField, Button, IconButton, Box, Divider } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import LogoutIcon from '@mui/icons-material/Logout';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Header, Footer } from '../../components/header';
import { useNavigate } from 'react-router-dom';

const EmployeeProfile = () => {
  const navigate = useNavigate();

  // Fetch employee data from localStorage
  const employeeData = localStorage.getItem('employee');
  let employee = null;

  try {
    employee = employeeData ? JSON.parse(employeeData) : null;
  } catch (e) {
    console.error('Invalid employee data in localStorage', e);
    employee = null;
  }

  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState(employee || {});
  const [formData, setFormData] = useState(profileData || {});
  const [passwordData, setPasswordData] = useState({ oldPassword: '', newPassword: '' });

  // Handle profile editing toggle
  const handleEditClick = () => setIsEditing(!isEditing);

  // Handle input changes for the profile form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle password input change
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData({ ...passwordData, [name]: value });
  };

  // Save profile changes
  const handleSaveClick = async () => {
    try {
      await axios.put(`http://localhost:2025/api/employee/${employee._id}`, formData);
      setProfileData(formData);
      setIsEditing(false);
      toast.success('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating employee profile:', error);
      toast.error('Error updating profile. Please try again.');
    }
  };

  // Handle password change
  const handlePasswordChangeClick = () => {
    if (passwordData.newPassword !== '') {
      toast.success('Password changed successfully!');
      setPasswordData({ oldPassword: '', newPassword: '' });
    } else {
      toast.error('Please enter a new password.');
    }
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('employee');
    toast.success('Logged out successfully!');
    navigate('/employee'); // Redirect to login page
  };

  return (
    <div>
      <Header />
      <Container sx={{ mt: 4 }}>
        <Grid container justifyContent="center">
          <Grid item xs={12} sm={8} md={6}>
            <Box sx={{ p: 3, bgcolor: 'white', borderRadius: '16px', boxShadow: 3 }}>
              {/* Avatar and Employee Name */}
              <Grid container justifyContent="center" sx={{ mb: 3 }}>
                <Avatar sx={{ width: 100, height: 100, bgcolor: '#1976d2', fontSize: 36 }}>
                  {profileData.name ? profileData.name.charAt(0) : 'E'}
                </Avatar>
              </Grid>
              <Typography
                variant="h4"
                align="center"
                gutterBottom
                sx={{ color: '#333', fontWeight: 600, fontSize: '1.8rem' }}
              >
                {profileData.name || 'Dave Sil'}
              </Typography>

              {/* Profile Info */}
              <Grid container spacing={2} sx={{ mt: 2 }}>
                <Grid item xs={12}>
                  <Typography variant="body1" gutterBottom sx={{ color: '#666' }}>
                    <strong>Email:</strong>{' '}
                    {isEditing ? (
                      <TextField
                        fullWidth
                        name="email"
                        value={formData.email || ''}
                        onChange={handleInputChange}
                        variant="outlined"
                      />
                    ) : (
                      <span>{profileData.email || 'No Email Provided'}</span>
                    )}
                  </Typography>
                </Grid>

                <Grid item xs={12}>
                  <Typography variant="body1" gutterBottom sx={{ color: '#666' }}>
                    <strong>Contact:</strong>{' '}
                    {isEditing ? (
                      <TextField
                        fullWidth
                        name="contactNumber"
                        value={formData.contactNumber || ''}
                        onChange={handleInputChange}
                        variant="outlined"
                      />
                    ) : (
                      <span>{profileData.contactNumber || 'No Contact Provided'}</span>
                    )}
                  </Typography>
                </Grid>

                <Grid item xs={12}>
                  <Typography variant="body1" gutterBottom sx={{ color: '#666' }}>
                    <strong>Address:</strong>{' '}
                    {isEditing ? (
                      <TextField
                        fullWidth
                        name="address"
                        value={formData.address || ''}
                        onChange={handleInputChange}
                        variant="outlined"
                      />
                    ) : (
                      <span>{profileData.address || 'No Address Provided'}</span>
                    )}
                  </Typography>
                </Grid>
              </Grid>

              {/* Password Change */}
              <Divider sx={{ my: 3 }} />
              <Typography variant="h6" gutterBottom sx={{ color: '#1976d2', fontWeight: 600 }}>
                Change Password
              </Typography>
              {/* <TextField
                fullWidth
                name="oldPassword"
                label="Old Password"
                type="password"
                value={passwordData.oldPassword}
                onChange={handlePasswordChange}
                variant="outlined"
                sx={{ mb: 2 }}
              /> */}
              {/* <TextField
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
              </Button> */}

              {/* Edit and Save Buttons */}
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
            </Box>
          </Grid>
        </Grid>

        {/* Toast Notification Container */}
        <ToastContainer />
      </Container>
      <Footer role="employee" />
    </div>
  );
};

export default EmployeeProfile;
