import React, { useEffect, useState } from 'react';
import { Bar, Line } from 'react-chartjs-2';
import { Container, Typography, Grid, Card, CardContent, Box } from '@mui/material';
import { Chart, CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend } from 'chart.js';
import apiClient from '../../utils/apiClient';
import { Header, Footer } from '../../components/header';

// Register Chart.js components
Chart.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend);

const EmployeeReport = () => {
  const [jobStats, setJobStats] = useState(null);
  const [chartData, setChartData] = useState(null);
  const [monthlyData, setMonthlyData] = useState(null);
  const [loading, setLoading] = useState(false);

  // Get employee data from localStorage
  const employeeData = localStorage.getItem('employee');
  let employee = null;
  try {
    employee = employeeData ? JSON.parse(employeeData) : null;
  } catch (e) {
    console.error('Invalid employee data in localStorage', e);
    employee = null;
  }

  // Fetch job statistics for the employee
  useEffect(() => {
    const fetchJobStats = async () => {
      setLoading(true);
      try {
        if (!employee || !employee._id) {
          console.error('No employee data available');
          setLoading(false);
          return;
        }

        // Fetch all jobs for this employee
        const response = await apiClient.get('/job');
        const employeeJobs = response.data.jobs.filter(job => job.employee === employee._id);

        // Calculate statistics
        const totalJobs = employeeJobs.length;
        const completedJobs = employeeJobs.filter(job => job.status === 'Complete').length;
        const pendingJobs = employeeJobs.filter(job => job.status !== 'Complete').length;
        const completionRate = totalJobs > 0 ? ((completedJobs / totalJobs) * 100).toFixed(1) : 0;

        setJobStats({
          totalJobs,
          completedJobs,
          pendingJobs,
          completionRate
        });

        // Prepare chart data for job status
        setChartData({
          labels: ['Completed Jobs', 'Pending Jobs'],
          datasets: [{
            label: 'Job Status',
            data: [completedJobs, pendingJobs],
            backgroundColor: ['#4caf50', '#ff9800'],
            borderColor: ['#4caf50', '#ff9800'],
            borderWidth: 1,
          }]
        });

        // Prepare monthly completion data
        const monthlyStats = {};
        employeeJobs.forEach(job => {
          const monthYear = new Date(job.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
          if (!monthlyStats[monthYear]) {
            monthlyStats[monthYear] = { completed: 0, total: 0 };
          }
          monthlyStats[monthYear].total++;
          if (job.status === 'Complete') {
            monthlyStats[monthYear].completed++;
          }
        });

        const sortedMonths = Object.keys(monthlyStats).sort((a, b) => new Date(a) - new Date(b));
        const completedData = sortedMonths.map(month => monthlyStats[month].completed);
        const totalData = sortedMonths.map(month => monthlyStats[month].total);

        setMonthlyData({
          labels: sortedMonths,
          datasets: [
            {
              label: 'Completed Jobs',
              data: completedData,
              borderColor: '#4caf50',
              backgroundColor: 'rgba(76, 175, 80, 0.1)',
              tension: 0.1
            },
            {
              label: 'Total Jobs',
              data: totalData,
              borderColor: '#2196f3',
              backgroundColor: 'rgba(33, 150, 243, 0.1)',
              tension: 0.1
            }
          ]
        });

        setLoading(false);
      } catch (error) {
        console.error('Error fetching job statistics:', error);
        setLoading(false);
      }
    };

    fetchJobStats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [employee?._id]); // Only depend on the employee ID

  if (!employee) {
    return (
      <div>
        <Header />
        <Container>
          <Typography variant="h4" gutterBottom>
            Employee Reports
          </Typography>
          <Typography variant="h6" color="error">
            No employee data found. Please log in again.
          </Typography>
        </Container>
        <Footer role="employee" />
      </div>
    );
  }

  return (
    <div>
      <Header />
      <Container sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          My Job Performance
        </Typography>
        <Typography variant="h6" color="textSecondary" gutterBottom>
          Employee: {employee.firstName} {employee.lastName} (ID: {employee.employeeID})
        </Typography>

        {loading ? (
          <Typography variant="h6">Loading data...</Typography>
        ) : (
          <>
            {/* Statistics Cards */}
            {jobStats && (
              <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} sm={6} md={3}>
                  <Card>
                    <CardContent>
                      <Typography color="textSecondary" gutterBottom>
                        Total Jobs
                      </Typography>
                      <Typography variant="h4">
                        {jobStats.totalJobs}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Card>
                    <CardContent>
                      <Typography color="textSecondary" gutterBottom>
                        Completed Jobs
                      </Typography>
                      <Typography variant="h4" color="success.main">
                        {jobStats.completedJobs}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Card>
                    <CardContent>
                      <Typography color="textSecondary" gutterBottom>
                        Pending Jobs
                      </Typography>
                      <Typography variant="h4" color="warning.main">
                        {jobStats.pendingJobs}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Card>
                    <CardContent>
                      <Typography color="textSecondary" gutterBottom>
                        Completion Rate
                      </Typography>
                      <Typography variant="h4" color="primary.main">
                        {jobStats.completionRate}%
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            )}

            {/* Charts */}
            <Grid container spacing={3}>
              {/* Job Status Chart */}
              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Job Status Overview
                    </Typography>
                    <Box sx={{ height: 300 }}>
                      {chartData ? (
                        <Bar
                          data={chartData}
                          options={{
                            responsive: true,
                            maintainAspectRatio: false,
                            scales: {
                              y: {
                                beginAtZero: true,
                                title: {
                                  display: true,
                                  text: 'Number of Jobs'
                                }
                              }
                            },
                            plugins: {
                              legend: {
                                display: false
                              },
                              title: {
                                display: true,
                                text: 'Current Job Status Distribution'
                              }
                            }
                          }}
                        />
                      ) : (
                        <Typography>No data available</Typography>
                      )}
                    </Box>
                  </CardContent>
                </Card>
              </Grid>

              {/* Monthly Trend Chart */}
              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Monthly Performance Trend
                    </Typography>
                    <Box sx={{ height: 300 }}>
                      {monthlyData ? (
                        <Line
                          data={monthlyData}
                          options={{
                            responsive: true,
                            maintainAspectRatio: false,
                            scales: {
                              y: {
                                beginAtZero: true,
                                title: {
                                  display: true,
                                  text: 'Number of Jobs'
                                }
                              },
                              x: {
                                title: {
                                  display: true,
                                  text: 'Month'
                                }
                              }
                            },
                            plugins: {
                              legend: {
                                position: 'top'
                              },
                              title: {
                                display: true,
                                text: 'Job Completion Trend Over Time'
                              }
                            }
                          }}
                        />
                      ) : (
                        <Typography>No monthly data available</Typography>
                      )}
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </>
        )}
      </Container>
      <Footer role="employee" />
    </div>
  );
};

export default EmployeeReport;