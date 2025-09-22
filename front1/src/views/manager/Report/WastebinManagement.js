import React, { useEffect, useState } from 'react';
import { Container, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button } from '@mui/material';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Header, Footer } from '../../../components/header';

const WastebinManagement = () => {
  const [wastebins, setWastebins] = useState([]);

  // Fetch all wastebins when the component loads
  useEffect(() => {
    const fetchWastebins = async () => {
      try {
        const response = await axios.get('http://localhost:2025/api/wastebin');
        setWastebins(response.data.wasteBins);
      } catch (error) {
        console.error('Error fetching wastebins:', error);
        toast.error('Failed to load wastebins');
      }
    };
    fetchWastebins();
  }, []);

  // Handle wastebin deletion by binID
  const handleDeleteWastebin = async (binID) => {
    try {
      // Use binID for deletion instead of _id
      await axios.delete(`http://localhost:2025/api/wastebin/${binID}`);
      // Filter the wastebins to remove the one with the matching binID
      setWastebins(wastebins.filter(bin => bin.binID !== binID));
      toast.success('Wastebin deleted successfully');
    } catch (error) {
      console.error('Error deleting wastebin:', error);
      toast.error('Failed to delete wastebin');
    }
  };

  return (
    <div>
      <Header />
      <Container sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          Wastebin Management
        </Typography>

        {/* Wastebin Table */}
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Bin ID</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Current Weight (kg)</TableCell>
                <TableCell>Max Weight (kg)</TableCell>
                <TableCell>Owner</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {wastebins.map((bin) => (
                <TableRow key={bin._id}>
                  <TableCell>{bin.binID}</TableCell>
                  <TableCell>{bin.binType}</TableCell>
                  <TableCell>{bin.currentWeight}</TableCell>
                  <TableCell>{bin.maxWeight}</TableCell>
                  <TableCell>{bin.owner}</TableCell>
                  <TableCell>
                    <Button variant="contained" color="secondary" onClick={() => handleDeleteWastebin(bin.binID)}>
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Toast Notifications */}
        <ToastContainer />
      </Container>
      <Footer role="manager" />
    </div>
  );
};

export default WastebinManagement;
