import React, { useEffect, useState } from 'react';
import { Container, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Header, Footer } from '../../components/header';
import { format } from 'date-fns';

const JobManagement = () => {
  const [jobs, setJobs] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [employeeSearch, setEmployeeSearch] = useState('');
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);

  // Fetch jobs and employees when the component loads
  useEffect(() => {
    const fetchJobsAndEmployees = async () => {
      try {
        const jobsResponse = await axios.get('http://localhost:2025/api/job');
        const jobsWithAddress = await Promise.all(
          jobsResponse.data.jobs.map(async (job) => {
            const residentResponse = await axios.get(`http://localhost:2025/api/resident/${job.resident}`);
            return { ...job, customerAddress: residentResponse.data.address };
          })
        );
        
        // Sort jobs by date
        const sortedJobs = jobsWithAddress.sort((a, b) => new Date(a.date) - new Date(b.date));
        setJobs(sortedJobs);

        const employeesResponse = await axios.get('http://localhost:2025/api/employee');
        setEmployees(employeesResponse.data);
      } catch (error) {
        console.error('Error fetching jobs or employees:', error);
        toast.error('Failed to load data');
      }
    };

    fetchJobsAndEmployees();
  }, []);

  // Group jobs by date
  const groupJobsByDate = (jobs) => {
    return jobs.reduce((acc, job) => {
      const date = new Date(job.date).toDateString();
      if (!acc[date]) acc[date] = [];
      acc[date].push(job);
      return acc;
    }, {});
  };

  // Handle the opening of the dialog for employee allocation
  const handleOpenDialog = (job) => {
    setSelectedJob(job);
    setOpenDialog(true);
  };

  // Handle the closing of the dialog
  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEmployeeSearch('');
    setFilteredEmployees([]);
  };

  // Handle employee search
  const handleEmployeeSearch = (event) => {
    const query = event.target.value;
    setEmployeeSearch(query);
    const filtered = employees.filter((emp) => 
      emp.username.toLowerCase().includes(query.toLowerCase()) ||
      `${emp.firstName} ${emp.lastName}`.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredEmployees(filtered);
  };

  // Handle employee allocation
  const handleAllocateEmployee = async (employee) => {
    try {
      const updatedJob = { ...selectedJob, employee: employee._id, status: 'Assigned' };
      await axios.put(`http://localhost:2025/api/job/${selectedJob._id}`, updatedJob);
      const updatedJobs = jobs.map((job) => (job._id === selectedJob._id ? updatedJob : job));
      setJobs(updatedJobs);
      toast.success('Employee allocated successfully!');
      handleCloseDialog();
    } catch (error) {
      console.error('Error allocating employee:', error);
      toast.error('Failed to allocate employee');
    }
  };

  const groupedJobs = groupJobsByDate(jobs);

  return (
    <div>
      <Header />
      <Container sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          Job Management
        </Typography>

        {/* Render tables for each date */}
        {Object.keys(groupedJobs).map((date) => (
          <div key={date} style={{ marginBottom: '2rem' }}>
            <Typography variant="h5" gutterBottom>{format(new Date(date), 'PP')}</Typography>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Job ID</TableCell>
                    <TableCell>Customer ID</TableCell>
                    <TableCell>Customer Address</TableCell>
                    <TableCell>Employee</TableCell>
                    <TableCell>Date</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {groupedJobs[date].map((job) => (
                    <TableRow key={job._id}>
                      <TableCell>{job._id}</TableCell>
                      <TableCell>{job.resident}</TableCell>
                      <TableCell>{job.customerAddress || 'N/A'}</TableCell>
                      <TableCell>{job.employee ? `${job.employee}` : 'Not Assigned'}</TableCell>
                      <TableCell>{new Date(job.date).toLocaleDateString()}</TableCell>
                      <TableCell>{job.status}</TableCell>
                      <TableCell>
                        <Button variant="contained" color="primary" onClick={() => handleOpenDialog(job)}>
                          Allocate Employee
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </div>
        ))}

        {/* Dialog for employee allocation */}
        <Dialog open={openDialog} onClose={handleCloseDialog}>
          <DialogTitle>Allocate Employee</DialogTitle>
          <DialogContent>
            <TextField
              label="Search Employee"
              fullWidth
              value={employeeSearch}
              onChange={handleEmployeeSearch}
              margin="dense"
            />
            {filteredEmployees.map((employee) => (
              <Button key={employee._id} onClick={() => handleAllocateEmployee(employee)}>
                {`${employee.firstName} ${employee.lastName} (${employee.username})`}
              </Button>
            ))}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancel</Button>
          </DialogActions>
        </Dialog>

        {/* Toast Notifications */}
        <ToastContainer />
      </Container>
      <Footer role="manager" />
    </div>
  );
};

export default JobManagement;
