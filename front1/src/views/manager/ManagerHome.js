import React, { useEffect, useState } from 'react';
import { AppBar, Toolbar, Typography, Container, Box, Paper, Grid, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, Button, MenuItem, TextField } from '@mui/material';
import { format } from 'date-fns';
import { Header, Footer } from '../../components/header';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import AddIcon from '@mui/icons-material/Add';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ManagerHome = () => {
  const manager = JSON.parse(localStorage.getItem('manager'));
  const [currentTime, setCurrentTime] = useState(new Date());
  const [residentCount, setResidentCount] = useState(0);
  const [wasteBinCount, setWasteBinCount] = useState(0);
  const [open, setOpen] = useState(false);
  const [binType, setBinType] = useState('');
  const [maxWeight, setMaxWeight] = useState('');

  useEffect(() => {
    const fetchResidentCount = async () => {
      try {
        const response = await axios.get('http://localhost:2025/api/resident/count');
        setResidentCount(response.data.count);
      } catch (error) {
        console.error('Error fetching resident count:', error);
      }
    };
    fetchResidentCount();
  }, []);

  useEffect(() => {
    const fetchWasteBinCount = async () => {
      try {
        const response = await axios.get('http://localhost:2025/api/wasteBin/count');
        setWasteBinCount(response.data.totalWasteBins);
      } catch (error) {
        console.error('Error fetching waste bin count:', error);
      }
    };
    fetchWasteBinCount();
  }, []);

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

  const handleClickOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleCreateWasteBin = async () => {
    if (!binType || !maxWeight) {
      toast.error("Please fill all fields");
      return;
    }

    try {
      await axios.post('http://localhost:2025/api/wasteBin', { binType, maxWeight });
      setWasteBinCount(wasteBinCount + 1);
      toast.success('Waste bin created successfully!');
      handleClose();
    } catch (error) {
      console.error('Error creating waste bin:', error);
      toast.error('Failed to create waste bin');
    }
  };

  return (
    <div style={{ background: 'linear-gradient(180deg, #f0f4f8 0%, #ffffff 100%)', minHeight: '100vh', position: 'relative', overflow: 'hidden' }}>
      <Header />

      {/* Background Gradient Shapes */}
      <Box sx={{ position: 'absolute', top: '-50px', right: '-100px', width: '300px', height: '300px', background: 'rgba(33, 150, 243, 0.2)', borderRadius: '50%' }} />
      <Box sx={{ position: 'absolute', bottom: '-150px', left: '-150px', width: '400px', height: '400px', background: 'rgba(76, 175, 80, 0.2)', borderRadius: '50%' }} />

      <AppBar position="static" sx={{ bgcolor: 'white', p: 1, boxShadow: 'none' }}>
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'black' }}>
            {getGreetingMessage()}, {manager.firstName}
          </Typography>
          <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'black' }}>
            {formattedDate} | {formattedTime}
          </Typography>
        </Toolbar>
      </AppBar>

      <Container sx={{ mt: 4, position: 'relative', zIndex: 1 }}>
        <Grid container spacing={4}>
          <Grid item xs={12}>
            <Swiper spaceBetween={30} slidesPerView={1} pagination={{ clickable: true }} style={{ height: '250px' }}>
              <SwiperSlide>
                <Paper
                  elevation={4}
                  sx={{
                    height: 'auto',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    background: 'linear-gradient(135deg, #2196F3, #21CBF3)',
                    padding: '20px',
                    borderRadius: '16px',
                    color: '#ffffff',
                    boxShadow: '0px 10px 30px rgba(0,0,0,0.2)',
                  }}
                >
                  <Typography variant="h5" sx={{ fontWeight: 'bold' }}>Total Residents: {residentCount}</Typography>
                </Paper>
              </SwiperSlide>
              <SwiperSlide>
                <Paper
                  elevation={4}
                  sx={{
                    height: 'auto',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    background: 'linear-gradient(135deg, #66bb6a, #a5d6a7)',
                    padding: '20px',
                    borderRadius: '16px',
                    color: '#ffffff',
                    boxShadow: '0px 10px 30px rgba(0,0,0,0.2)',
                  }}
                >
                  <Typography variant="h5" sx={{ fontWeight: 'bold' }}>Waste Bins: {wasteBinCount}</Typography>
                  <IconButton onClick={handleClickOpen} color="primary" sx={{ ml: 2, color: '#ffffff' }}>
                    <AddIcon />
                  </IconButton>
                </Paper>
              </SwiperSlide>
              <SwiperSlide>
                <Paper
                  elevation={4}
                  sx={{
                    height: 'auto',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    background: 'linear-gradient(135deg, #ff8a65, #ff7043)',
                    padding: '20px',
                    borderRadius: '16px',
                    color: '#ffffff',
                    boxShadow: '0px 10px 30px rgba(0,0,0,0.2)',
                  }}
                >
                  <Typography variant="h5" sx={{ fontWeight: 'bold' }}>Total Jobs: 120</Typography>
                </Paper>
              </SwiperSlide>
              <SwiperSlide>
                <Paper
                  elevation={4}
                  sx={{
                    height: 'auto',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    background: 'linear-gradient(135deg, #ba68c8, #ab47bc)',
                    padding: '20px',
                    borderRadius: '16px',
                    color: '#ffffff',
                    boxShadow: '0px 10px 30px rgba(0,0,0,0.2)',
                  }}
                >
                  <Typography variant="h5" sx={{ fontWeight: 'bold' }}>Total Drivers: 50</Typography>
                </Paper>
              </SwiperSlide>
            </Swiper>
          </Grid>
        </Grid>
      </Container>

      <Dialog open={open} onClose={handleClose} PaperProps={{ sx: { borderRadius: '16px', padding: '20px' } }}>
        <DialogTitle>Create a New Waste Bin</DialogTitle>
        <DialogContent>
          <TextField
            select
            label="Bin Type"
            value={binType}
            onChange={(e) => setBinType(e.target.value)}
            fullWidth
            margin="dense"
            variant="outlined"
          >
            <MenuItem value="Organic">Organic</MenuItem>
            <MenuItem value="Plastic">Plastic</MenuItem>
            <MenuItem value="Glass">Glass</MenuItem>
          </TextField>
          <TextField
            label="Max Weight (kg)"
            value={maxWeight}
            onChange={(e) => setMaxWeight(e.target.value)}
            fullWidth
            margin="dense"
            variant="outlined"
            type="number"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} sx={{ color: '#1976d2' }}>Cancel</Button>
          <Button onClick={handleCreateWasteBin} color="primary">Create</Button>
        </DialogActions>
      </Dialog>

      <ToastContainer />

      <Footer role="manager" />
    </div>
  );
};

export default ManagerHome;
