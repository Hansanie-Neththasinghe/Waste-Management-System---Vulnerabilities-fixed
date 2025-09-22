import React, { useEffect, useState } from 'react';
import { Container, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, TextField, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Header, Footer } from '../../../components/header';

const DriverManagement = () => {
  const [drivers, setDrivers] = useState([]);
  const [openDialog, setOpenDialog] = useState(false); // State to handle dialog visibility
  const [newDriver, setNewDriver] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    password: '',
  });

  // Fetch all drivers when the component loads
  useEffect(() => {
    const fetchDrivers = async () => {
      try {
        const response = await axios.get('http://localhost:2025/api/employee'); // Assuming this fetches all employees including drivers
        setDrivers(response.data);
      } catch (error) {
        console.error('Error fetching drivers:', error);
        toast.error('Failed to load drivers');
      }
    };
    fetchDrivers();
  }, []);

  // Handle driver creation
  const handleCreateDriver = async () => {
    try {
      const response = await axios.post('http://localhost:2025/api/employee/create', newDriver);
      setDrivers([...drivers, response.data.data]); // Add new driver to the list
      toast.success('Driver created successfully');
      setOpenDialog(false); // Close dialog after success
    } catch (error) {
      console.error('Error creating driver:', error);
      toast.error('Failed to create driver');
    }
  };

  // Handle driver deletion
  const handleDeleteDriver = async (driverId) => {
    try {
      await axios.delete(`http://localhost:2025/api/employee/${driverId}`);
      setDrivers(drivers.filter(driver => driver._id !== driverId));
      toast.success('Driver deleted successfully');
    } catch (error) {
      console.error('Error deleting driver:', error);
      toast.error('Failed to delete driver');
    }
  };

  // Handle form input change
  const handleInputChange = (e) => {
    setNewDriver({ ...newDriver, [e.target.name]: e.target.value });
  };

  return (
    <div>
      <Header />
      <Container sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          Driver Management
        </Typography>

        {/* Button to open dialog for creating a new driver */}
        <Button variant="contained" color="primary" onClick={() => setOpenDialog(true)} sx={{ mb: 2 }}>
          Add New Driver
        </Button>

        {/* Driver Table */}
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Driver ID</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Contact Number</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {drivers.map((driver) => (
                <TableRow key={driver._id}>
                  <TableCell>{driver.username}</TableCell>
                  <TableCell>{driver.firstName} {driver.lastName}</TableCell>
                  <TableCell>{driver.email}</TableCell>
                  <TableCell>{driver.phoneNumber}</TableCell>
                  <TableCell>
                    <Button variant="contained" color="secondary" onClick={() => handleDeleteDriver(driver._id)}>
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Dialog for creating a new driver */}
        <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
          <DialogTitle>Add New Driver</DialogTitle>
          <DialogContent>
            <TextField
              label="First Name"
              name="firstName"
              value={newDriver.firstName}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Last Name"
              name="lastName"
              value={newDriver.lastName}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Email"
              name="email"
              value={newDriver.email}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Phone Number"
              name="phoneNumber"
              value={newDriver.phoneNumber}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Password"
              name="password"
              type="password"
              value={newDriver.password}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDialog(false)} color="secondary">
              Cancel
            </Button>
            <Button onClick={handleCreateDriver} color="primary">
              Create
            </Button>
          </DialogActions>
        </Dialog>

        {/* Toast Notifications */}
        <ToastContainer />
      </Container>
      <Footer role="manager" />
    </div>
  );
};

export default DriverManagement;
