import React, { useEffect, useState } from 'react';
import { Container, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import DeleteIcon from '@mui/icons-material/Delete';
import { Header, Footer } from '../../../components/header';

const ResidentManagement = () => {
  const [residents, setResidents] = useState([]);
  const [selectedResident, setSelectedResident] = useState(null); // Resident for viewing waste bins
  const [openDialog, setOpenDialog] = useState(false); // Control waste bin dialog

  // Fetch all residents along with waste bins
  useEffect(() => {
    const fetchResidents = async () => {
      try {
        const response = await axios.get('http://localhost:2025/api/resident');
        setResidents(response.data); // Residents already contain wastebins
      } catch (error) {
        console.error('Error fetching residents:', error);
        toast.error('Failed to load residents');
      }
    };

    fetchResidents();
  }, []);

  // Handle delete resident
  const handleDeleteResident = async (residentId) => {
    if (window.confirm('Are you sure you want to delete this resident?')) {
      try {
        await axios.delete(`http://localhost:2025/api/residents/${residentId}`);
        setResidents(residents.filter(resident => resident._id !== residentId));
        toast.success('Resident deleted successfully');
      } catch (error) {
        console.error('Error deleting resident:', error);
        toast.error('Failed to delete resident');
      }
    }
  };

  // Handle viewing waste bins for a resident
  const handleViewWasteBins = (resident) => {
    setSelectedResident(resident);
    setOpenDialog(true);
  };

  // Handle closing waste bin dialog
  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedResident(null);
  };

  return (
    <div>
      <Header />
      <Container sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          Resident Management
        </Typography>

        {/* Resident Table */}
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Resident ID</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Contact Number</TableCell>
                <TableCell>Address</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {residents.map((resident) => (
                <TableRow key={resident._id} hover onClick={() => handleViewWasteBins(resident)}>
                  <TableCell>{resident._id}</TableCell>
                  <TableCell>{resident.name}</TableCell>
                  <TableCell>{resident.email}</TableCell>
                  <TableCell>{resident.contactNumber}</TableCell>
                  <TableCell>{resident.address}</TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      color="error"
                      startIcon={<DeleteIcon />}
                      onClick={(e) => {
                        e.stopPropagation(); // Stop triggering the view wastebins dialog when clicking delete
                        handleDeleteResident(resident._id);
                      }}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Waste Bin Dialog */}
        <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
  <DialogTitle>Waste Bins for {selectedResident?.name}</DialogTitle>
  <DialogContent>
    {selectedResident?.wastebins && selectedResident.wastebins.length > 0 ? (
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Bin ID</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Current Weight (kg)</TableCell>
              <TableCell>Max Weight (kg)</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {selectedResident.wastebins.map((bin) => (
              <TableRow key={bin._id}>
                <TableCell>{bin.binID}</TableCell>
                <TableCell>{bin.binType}</TableCell>
                <TableCell>{bin.currentWeight}</TableCell>
                <TableCell>{bin.maxWeight}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    ) : (
      <Typography>No waste bins found for this resident</Typography>
    )}
  </DialogContent>
  <DialogActions>
    <Button onClick={handleCloseDialog}>Close</Button>
  </DialogActions>
</Dialog>



        {/* Toast Notifications */}
        <ToastContainer />
      </Container>
      <Footer role = "manager"/>
    </div>
  );
};

export default ResidentManagement;
