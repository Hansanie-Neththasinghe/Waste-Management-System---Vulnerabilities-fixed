import React, { useEffect, useState } from 'react';
import { AppBar, Toolbar, Typography, Container, Box, Paper, Grid, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, List, ListItem, ListItemText, CircularProgress } from '@mui/material';
import { format } from 'date-fns';
import { Header, Footer } from '../../components/header';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AddIcon from '@mui/icons-material/Add';
import axios from 'axios';
//import MonetizationOnOutlinedIcon from '@mui/icons-material/MonetizationOnOutlined'; // Black and white coin icon

const ResidentHome = () => {
  const residentData = localStorage.getItem('resident');
  let resident = null;

  try {
    resident = residentData ? JSON.parse(residentData) : null;
  } catch (e) {
    console.error('Invalid resident data in localStorage', e);
    resident = null;
  }

  const [currentTime, setCurrentTime] = useState(new Date());
  const [wasteBins, setWasteBins] = useState([]);
  const [totalPoints, setTotalPoints] = useState(); // State to hold total points
  const [open, setOpen] = useState(false); // For opening the dialog to add a new waste bin
  const [binID, setBinID] = useState(''); // Store binID when adding a new waste bin
  const [searchResults, setSearchResults] = useState([]); // Store search results for waste bins

  // Fetch the waste bins owned by the resident and total points from the backend
  useEffect(() => {
    if (resident && resident._id) {
      const fetchWasteBinsAndPoints = async () => {
        try {
          const wasteBinResponse = await axios.get(`http://localhost:2025/api/wastebin/${resident._id}`);
          setWasteBins(wasteBinResponse.data.wasteBins);

          const pointsResponse = await axios.get(`http://localhost:2025/api/resident/${resident.username}`);
          setTotalPoints(pointsResponse.data.totalPoints);
        } catch (error) {
          console.error('Error fetching resident data:', error);
        }
      };

      fetchWasteBinsAndPoints();
    }
  }, [resident]);

  // Update the time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const getGreetingMessage = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  const formattedDate = format(currentTime, 'PPP');
  const formattedTime = format(currentTime, 'p');

  // Handle opening and closing of the dialog
  const handleClickOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  // Handle search for available waste bins
  const handleSearchChange = async (e) => {
    const query = e.target.value;
    setBinID(query); // Update binID based on user input

    if (query.length > 1) {
      try {
        const response = await axios.get(`http://localhost:2025/api/wasteBin/search`, { params: { query } });
        setSearchResults(response.data.availableWasteBins); // Update search results
      } catch (error) {
        console.error('Error searching for available waste bins:', error);
      }
    } else {
      setSearchResults([]); // Clear search results if query is too short
    }
  };

  // Handle adding a new waste bin to the resident by updating the bin's owner
  const handleAddWasteBin = async (selectedBinID) => {
    try {
      const response = await axios.post(`http://localhost:2025/api/wasteBin/assignOwner`, {
        residentId: resident._id,
        binID: selectedBinID
      });

      // Fetch updated waste bins after successful assignment
      setWasteBins([...wasteBins, response.data.wasteBin]);
      toast.success('Waste bin added successfully!');
      setBinID('');
      setSearchResults([]);
      handleClose(); // Close the dialog after successful addition
    } catch (error) {
      console.error('Error adding waste bin:', error);
      toast.error('Failed to add waste bin');
    }
  };

  const getBinColor = (binType) => {
    switch (binType) {
      case 'Organic': return '#4caf50';
      case 'Plastic': return '#f44336';
      case 'Glass': return '#2196f3';
      default: return '#9e9e9e';
    }
  };

  const renderGauge = (currentWeight, maxWeight, binType) => {
    const percentage = (currentWeight / maxWeight) * 100;
    const color = getBinColor(binType);

    return (
      <Box position="relative" display="inline-flex">
        <CircularProgress
          variant="determinate"
          value={percentage}
          size={120}
          thickness={5}
          sx={{ color }}
        />
        <Box
          position="absolute"
          top="50%"
          left="50%"
          sx={{ transform: 'translate(-50%, -50%)', color: color }}
        >
          <Typography variant="caption" component="div">
            {`${Math.round(percentage)}%`}
          </Typography>
        </Box>
      </Box>
    );
  };

  return (
    <div style={{ overflowY: 'auto' }}>
      {/* Header */}
      <Header />

      {/* Greeting, Date, and Time */}
      <AppBar position="static" sx={{ bgcolor: 'white', p: 1 }}>
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'black' }}>
            {getGreetingMessage()}, {resident ? resident.name : 'Guest'}
          </Typography>
          <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'black' }}>
            {formattedDate} | {formattedTime}
          </Typography>
        </Toolbar>
      </AppBar>
      {/* Total Points Below Header
      <Box
        sx={{
          backgroundColor: '#1976d2',
          color: 'black',
          padding: '12px 16px',
          borderRadius: 8,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          mt: 2,
        }}
      >
        <MonetizationOnOutlinedIcon sx={{ mr: 1 }} />
        <Typography variant="h6">{totalPoints} Points</Typography>
      </Box> */}

      {/* Content */}
      <Container sx={{ mt: 4 }}>
        <Grid container spacing={2}>
          {/* Display Waste Bins */}
          <Grid item xs={12}>
            {wasteBins.length > 0 ? (
              <Grid container spacing={3}>
                {wasteBins.map((bin, index) => (
                  <Grid item xs={12} sm={6} md={4} key={index}>
                    <Paper
                      elevation={3}
                      sx={{
                        p: 3,
                        textAlign: 'center',
                        backgroundColor: 'white',
                        borderRadius: 2,
                        position: 'relative',
                      }}
                    >
                      <Typography variant="h6">{bin.binID}</Typography>
                      <Typography variant="subtitle1">{bin.binType} Waste</Typography>
                      <Box mt={2}>
                        {renderGauge(bin.currentWeight, bin.maxWeight, bin.binType)}
                      </Box>
                      <Typography variant="subtitle2" sx={{ mt: 1 }}>
                        Current Weight: {bin.currentWeight} kg
                      </Typography>
                      <Typography variant="subtitle2" sx={{ mt: 1 }}>
                        Max Capacity: {bin.maxWeight} kg
                      </Typography>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            ) : (
              <Box
                sx={{
                  height: 150,
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  backgroundColor: 'white',
                  borderRadius: 2,
                  textAlign: 'center',
                }}
              >
                <Typography variant="h6">
                  No waste bins found. Click the + icon to add waste bins.
                </Typography>
                <IconButton onClick={handleClickOpen} color="primary" sx={{ ml: 2 }}>
                  <AddIcon />
                </IconButton>
              </Box>
            )}
          </Grid>

          {/* Button to Add More Waste Bins */}
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <Paper
                elevation={3}
                sx={{
                  p: 3,
                  backgroundColor: '#f5f5f5',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderRadius: 2,
                  cursor: 'pointer',
                  transition: '0.3s',
                  '&:hover': {
                    backgroundColor: '#e0e0e0',
                  },
                }}
                onClick={handleClickOpen}
              >
                <Typography variant="h6" sx={{ mr: 2 }}>
                  Add More Waste Bins
                </Typography>
                <AddIcon />
              </Paper>
            </Box>
          </Grid>
        </Grid>
      </Container>

      {/* Dialog for Adding New Waste Bin */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Add a Waste Bin</DialogTitle>
        <DialogContent>
          <TextField
            label="Search Bin ID"
            value={binID}
            onChange={handleSearchChange}
            fullWidth
            margin="dense"
          />
          <List>
            {searchResults.map((bin) => (
              <ListItem button key={bin.binID} onClick={() => handleAddWasteBin(bin.binID)}>
                <ListItemText primary={`Bin ID: ${bin.binID} | Type: ${bin.binType}`} />
              </ListItem>
            ))}
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
        </DialogActions>
      </Dialog>

      {/* Toast Notification Container */}
      <ToastContainer />

      {/* Footer */}
      <Footer role="resident" />
    </div>
  );
};

export default ResidentHome;
