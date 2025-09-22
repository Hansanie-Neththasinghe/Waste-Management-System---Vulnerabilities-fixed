import React, { useEffect, useState } from 'react';
import { Container, Typography, Card, CardContent, CardActions, Button, Grid, Dialog, DialogTitle, DialogContent, DialogActions, Box } from '@mui/material';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Header, Footer } from '../../components/header';

// Function to group jobs by date
const groupJobsByDate = (jobs) => {
  return jobs.reduce((groups, job) => {
    const jobDate = new Date(job.date).toLocaleDateString();
    if (!groups[jobDate]) {
      groups[jobDate] = [];
    }
    groups[jobDate].push(job);
    return groups;
  }, {});
};

const EmployeeHome = () => {
  const employeeData = localStorage.getItem('employee');
  let employee = null;

  try {
    employee = employeeData ? JSON.parse(employeeData) : null;
  } catch (e) {
    console.error('Invalid employee data in localStorage', e);
    employee = null;
  }

  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [wasteBins, setWasteBins] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);

  // Fetch jobs assigned to the employee
  useEffect(() => {
    const fetchJobs = async () => {
      if (employee && employee._id) {
        try {
          const response = await axios.get(`http://localhost:2025/api/job`);
          const assignedJobs = response.data.jobs.filter(job => job.employee === employee._id && job.status !== 'Complete');
          setJobs(assignedJobs.sort((a, b) => new Date(b.date) - new Date(a.date))); // Sort jobs by date (most recent first)
        } catch (error) {
          console.error('Error fetching jobs:', error);
          toast.error('Failed to load jobs');
        }
      }
    };
    fetchJobs();
  }, [employee]);

  // Open dialog and fetch waste bins for the selected job's resident
  const handleJobClick = async (job) => {
    try {
      setSelectedJob(job);
      const response = await axios.get(`http://localhost:2025/api/wastebin/${job.residentID}`);
      setWasteBins(response.data.wasteBins);
      setOpenDialog(true);
    } catch (error) {
      console.error('Error fetching waste bins:', error);
      toast.error('Failed to load waste bins');
    }
  };

  // Handle job completion (mark as "Complete")
  const handleCompleteCollection = async () => {
    try {
      let totalPlasticWeight = 0;
  
      // Calculate total plastic weight
      wasteBins.forEach((bin) => {
        if (bin.binType === 'Plastic') {
          totalPlasticWeight += bin.currentWeight;
        }
      });
  
      // Calculate points to be added (10kg = 1 point)
      const pointsToAdd = Math.floor(totalPlasticWeight / 10);
  
      // Update the job status to "Complete"
      await axios.put(`http://localhost:2025/api/job/${selectedJob._id}`, { status: 'Complete' });
  
      // Reset the current weight of all waste bins
      const updatedBins = wasteBins.map(async (bin) => {
        return await axios.put(`http://localhost:2025/api/wastebin/weight/${bin.binID}/`, { newWeight: 0 });
      });
      await Promise.all(updatedBins);
  
      // Update the resident's total points if plastic was collected
      if (pointsToAdd > 0) {
        const residentResponse = await axios.get(`http://localhost:2025/api/resident/${selectedJob.resident}`);
        const updatedPoints = residentResponse.data.totalPoints + pointsToAdd;
  
        // Update the resident's points in the backend
        await axios.put(`http://localhost:2025/api/resident/${residentResponse.data._id}`, {
          totalPoints: updatedPoints,
        });
  
        toast.success(`${pointsToAdd} points added to resident for plastic collection!`);
      }
  
      // Success message for completing the collection
      toast.success('Collection completed successfully!');
      setJobs(jobs.filter(job => job._id !== selectedJob._id));
      setOpenDialog(false);
    } catch (error) {
      console.error('Error completing collection:', error);
      toast.error('Failed to complete the collection');
    }
  };
  

  // Group jobs by date
  const jobsByDate = groupJobsByDate(jobs);

  return (
    <div>
      <Header />

      {/* Main Content */}
      <Container sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          Assigned Jobs
        </Typography>

        {/* Display Jobs Grouped by Date */}
        {Object.keys(jobsByDate).map((date) => (
          <Box key={date} sx={{ mb: 4 }}>
            {/* Date Heading */}
            <Typography variant="h5" gutterBottom sx={{ mb: 2, fontWeight: 'bold', color: '#1976d2' }}>
              {date}
            </Typography>

            {/* Responsive Grid for Job Cards */}
            <Grid container spacing={2}>
              {jobsByDate[date].map((job) => (
                <Grid item xs={12} sm={6} md={4} key={job._id}>
                  <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                    <CardContent>
                      <Typography variant="h6">Job ID: {job._id}</Typography>
                      <Typography variant="subtitle1">Resident: {job.resident}</Typography>
                      <Typography variant="body2">
                        Date: {new Date(job.date).toLocaleDateString()}
                      </Typography>
                      <Typography variant="body2">Status: {job.status}</Typography>
                    </CardContent>
                    <CardActions sx={{ mt: 'auto' }}>
                      <Button
                        variant="contained"
                        color="primary"
                        fullWidth
                        onClick={() => handleJobClick(job)}
                      >
                        View Waste Bins
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        ))}

        {/* Waste Bin Dialog */}
        <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
          <DialogTitle>Waste Bins for Job {selectedJob?._id}</DialogTitle>
          <DialogContent>
            {wasteBins.length > 0 ? (
              <Grid container spacing={2}>
                {wasteBins.map((bin) => (
                  <Grid item xs={12} key={bin._id}>
                    <Box sx={{ p: 2, backgroundColor: 'lightgray', borderRadius: 1 }}>
                      <Typography variant="body1"><strong>Bin ID:</strong> {bin.binID}</Typography>
                      <Typography variant="body2"><strong>Type:</strong> {bin.binType}</Typography>
                      <Typography variant="body2"><strong>Current Weight:</strong> {bin.currentWeight} kg</Typography>
                      <Typography variant="body2"><strong>Max Weight:</strong> {bin.maxWeight} kg</Typography>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            ) : (
              <Typography>No waste bins found for this resident</Typography>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDialog(false)}>Close</Button>
            <Button onClick={handleCompleteCollection} variant="contained" color="success">
              Complete Collection
            </Button>
          </DialogActions>
        </Dialog>

        {/* Toast Notifications */}
        <ToastContainer />
      </Container>

      <Footer role="employee" />
    </div>
  );
};

export default EmployeeHome;
