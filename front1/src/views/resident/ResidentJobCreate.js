import React, { useState, useEffect } from 'react';
import { Container, Box, Typography, Button, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Header, Footer } from '../../components/header';

const ResidentJobCreate = () => {
  const residentData = localStorage.getItem('resident');
  let resident = null;

  try {
    resident = residentData ? JSON.parse(residentData) : null;
  } catch (e) {
    console.error('Invalid resident data in localStorage', e);
    resident = null;
  }

  const [jobs, setJobs] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date()); // The date selected in the calendar
  const [openDialog, setOpenDialog] = useState(false); // Controls the dialog for viewing/creating a job
  const [currentJob, setCurrentJob] = useState(null); // The job for the selected date

  // Fetch jobs created by the resident
  useEffect(() => {
    if (resident && resident._id) {
      const fetchJobs = async () => {
        try {
          const response = await axios.get(`http://localhost:2025/api/job/`);
          const residentJobs = response.data.jobs.filter(job => job.resident === resident.username);
          setJobs(residentJobs);
        } catch (error) {
          console.error('Error fetching jobs:', error);
        }
      };
      fetchJobs();
    }
  }, [resident]);

  // Open dialog to view or create a job for the selected date
  const handleOpenDialog = (date) => {
    const jobOnDate = jobs.find(job => new Date(job.date).toDateString() === date.toDateString());
    setSelectedDate(date);
    setCurrentJob(jobOnDate || null);
    setOpenDialog(true);
  };

  // Close dialog
  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  // Handle job creation
  const handleCreateJob = async () => {
    if (currentJob) {
      toast.error('Job already exists for this date');
      return;
    }
    try {
      const newJob = {
        resident: resident.username,
        residentID: resident._id,
        date: selectedDate,
        status: 'Incomplete',
      };
      await axios.post('http://localhost:2025/api/job/create', newJob);
      toast.success('Job created successfully!');
      setJobs([...jobs, newJob]); // Update jobs state to include the new job
      handleCloseDialog(); // Close the dialog after successful creation
    } catch (error) {
      console.error('Error creating job:', error);
      toast.error('Failed to create job');
    }
  };

  // Handle job deletion
  const handleDeleteJob = async () => {
    if (currentJob) {
      try {
        await axios.delete(`http://localhost:2025/api/job/${currentJob._id}`);
        toast.success('Job deleted successfully!');
        setJobs(jobs.filter(job => job._id !== currentJob._id)); // Remove the job from the state
        handleCloseDialog();
      } catch (error) {
        console.error('Error deleting job:', error);
        toast.error('Failed to delete job');
      }
    }
  };

  // Function to check if a job exists on a given date
  const hasJobOnDate = (date) => {
    return jobs.some((job) => new Date(job.date).toDateString() === date.toDateString());
  };

  // Function to display jobs on the calendar
  const tileContent = ({ date, view }) => {
    if (view === 'month' && hasJobOnDate(date)) {
      return (
        <Box
          sx={{
            backgroundColor: '#4caf50',
            borderRadius: '50%',
            height: 10,
            width: 10,
            margin: 'auto',
            marginTop: 5,
          }}
        />
      );
    }
    return null;
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header />
      <Container
        sx={{
          flexGrow: 1,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: 'calc(100vh - 64px)', // Full height minus header
        }}
      >
        <Box
          sx={{
            width: '100%',
            maxWidth: '1200px',
            height: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Calendar
            onClickDay={handleOpenDialog}
            value={selectedDate}
            tileContent={tileContent}
            style={{
              width: '100%',
              height: '100%',
            }}
          />
        </Box>

        {/* Job Creation/View Dialog */}
        <Dialog open={openDialog} onClose={handleCloseDialog}>
          <DialogTitle>{currentJob ? 'View Job' : 'Create Job'}</DialogTitle>
          <DialogContent>
            <Typography variant="body1" gutterBottom>
              Date: {selectedDate.toDateString()}
            </Typography>
            {currentJob ? (
              <>
                <Typography variant="body1" gutterBottom>
                  Job Status: {currentJob.status}
                </Typography>
                {/* Show more job details if needed */}
              </>
            ) : (
              <Typography variant="body1" gutterBottom>
                No job found for this date. You can create a new job.
              </Typography>
            )}
          </DialogContent>
          <DialogActions>
            {currentJob ? (
              <>
                <Button onClick={handleDeleteJob} variant="contained" color="secondary">
                  Delete Job
                </Button>
              </>
            ) : (
              <Button onClick={handleCreateJob} variant="contained" color="primary">
                Create Job
              </Button>
            )}
            <Button onClick={handleCloseDialog}>Close</Button>
          </DialogActions>
        </Dialog>

        {/* Toast Notifications */}
        <ToastContainer />
      </Container>
      <Footer role="resident" />
    </div>
  );
};

export default ResidentJobCreate;
