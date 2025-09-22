import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Container, Typography, TextField, MenuItem, Button, Grid } from '@mui/material';
import { Chart, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import axios from 'axios';
import { Header, Footer } from '../../../components/header';

// Register Chart.js components for bar chart
Chart.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const WasteBarChart = () => {
  const [transactions, setTransactions] = useState([]);
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState(''); // Selected user state
  const [users, setUsers] = useState([]);

  // Fetch transactions from the backend
  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:2025/api/transaction'); // Adjust API URL
      setTransactions(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching transactions:', error);
      setLoading(false);
    }
  };

  // Fetch all users (residents) to allow selection of a user
  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://localhost:2025/api/resident'); // Adjust API URL for fetching users
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  // Filter transactions by selected user and prepare chart data
  useEffect(() => {
    if (transactions.length > 0) {
      // Filter transactions based on whether a user is selected or not
      const filteredTransactions = selectedUser
        ? transactions.filter((transaction) => transaction.binOwner === selectedUser)
        : transactions; // If no user is selected, use all transactions

      // Group transactions by waste type (Organic, Plastic, Glass) and sum the weight
      const groupedData = filteredTransactions.reduce(
        (acc, transaction) => {
          acc[transaction.binType] += transaction.currentWeight;
          return acc;
        },
        { Organic: 0, Plastic: 0, Glass: 0 } // Initial weight for each type is 0
      );

      // Prepare chart datasets
      const dataset = {
        label: 'Total Waste by Type (kg)',
        data: [groupedData.Organic, groupedData.Plastic, groupedData.Glass],
        backgroundColor: ['green', 'red', 'blue'],
        borderColor: ['green', 'red', 'blue'],
        borderWidth: 1
      };

      // Set chart data
      setChartData({
        labels: ['Organic', 'Plastic', 'Glass'],
        datasets: [dataset]
      });
    }
  }, [transactions, selectedUser]);

  // Fetch transactions and users when component mounts
  useEffect(() => {
    fetchTransactions();
    fetchUsers();
  }, []);

  return (
    <div>
      <Header />
      <Container>
        <Typography variant="h4" gutterBottom>
          Waste Production by Type
        </Typography>

        {/* Filter Section */}
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              select
              label="Select User"
              value={selectedUser}
              onChange={(e) => setSelectedUser(e.target.value)}
              fullWidth
            >
              <MenuItem value="">All Users</MenuItem> {/* Option for all users */}
              {users.map((user) => (
                <MenuItem key={user._id} value={user._id}>
                  {user.name}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Button
              variant="contained"
              color="primary"
              onClick={fetchTransactions}
              fullWidth
              sx={{ height: '100%' }}
            >
              Refresh Data
            </Button>
          </Grid>
        </Grid>

        {/* Bar Graph */}
        <div style={{ position: 'relative', width: '100%', height: '400px' }}>
          {loading ? (
            <Typography variant="h6">Loading data...</Typography>
          ) : chartData ? (
            <Bar
              data={chartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                  x: {
                    title: {
                      display: true,
                      text: 'Waste Type'
                    }
                  },
                  y: {
                    title: {
                      display: true,
                      text: 'Weight (kg)'
                    },
                    beginAtZero: true
                  }
                },
                plugins: {
                  legend: {
                    position: 'top'
                  },
                  title: {
                    display: true,
                    text: 'Waste Production by Type (kg)'
                  }
                }
              }}
              height={400}
            />
          ) : (
            <Typography variant="h6">No data available</Typography>
          )}
        </div>

        {/* Toast Notifications */}
        {/* <ToastContainer /> */}
      </Container>
      <Footer role="manager" />
    </div>
  );
};

export default WasteBarChart;
