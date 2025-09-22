import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Container, Typography, TextField, MenuItem, Button, Grid } from '@mui/material';
import { Chart, LineElement, CategoryScale, LinearScale, PointElement, Legend, Tooltip } from 'chart.js';
import axios from 'axios';
import { Header, Footer } from '../../../components/header';

// Register Chart.js components
Chart.register(LineElement, CategoryScale, LinearScale, PointElement, Legend, Tooltip);

const GarbageManagement = () => {
  const [transactions, setTransactions] = useState([]);
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState('');
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

  // Prepare chart data based on transactions, grouped by date, time, and garbage type
  const prepareChartData = (filteredTransactions) => {
    // Sort transactions by timestamp (considering both date and time)
    const sortedTransactions = filteredTransactions.sort(
      (a, b) => new Date(a.timestamp) - new Date(b.timestamp)
    );

    // Group transactions by type (Organic, Plastic, Glass)
    const groupedData = {
      Organic: [],
      Plastic: [],
      Glass: []
    };

    sortedTransactions.forEach((transaction) => {
      const dateTime = new Date(transaction.timestamp).toLocaleString(); // Include both date and time

      if (!groupedData[transaction.binType].find((t) => t.date === dateTime)) {
        groupedData[transaction.binType].push({
          date: dateTime,
          weight: transaction.currentWeight
        });
      } else {
        // If there's already a record for this date and time, add to the current weight
        const record = groupedData[transaction.binType].find((t) => t.date === dateTime);
        record.weight += transaction.currentWeight;
      }
    });

    // Prepare chart datasets for each garbage type
    const datasets = ['Organic', 'Plastic', 'Glass'].map((type) => ({
      label: `${type} Garbage`,
      data: groupedData[type].map((t) => t.weight),
      borderColor: type === 'Organic' ? 'green' : type === 'Plastic' ? 'red' : 'blue',
      fill: false,
      tension: 0.1
    }));

    // Set chart data with sorted date and time labels
    setChartData({
      labels: groupedData.Organic.map((t) => t.date), // Using Organic's dates and times (assuming all types have the same dates)
      datasets
    });
  };

  // Filter transactions by selected user or aggregate for all users
  useEffect(() => {
    if (transactions.length > 0) {
      const filteredTransactions = selectedUser
        ? transactions.filter((transaction) => transaction.binOwner === selectedUser)
        : transactions; // If no user is selected, aggregate all users' transactions

      prepareChartData(filteredTransactions);
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
          Waste Collection by User and Type
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

        {/* Line Graph */}
        <div style={{ position: 'relative', width: '100%', height: '400px' }}>
          {loading ? (
            <Typography variant="h6">Loading data...</Typography>
          ) : chartData ? (
            <Line
              data={chartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                  x: {
                    type: 'category',
                    title: {
                      display: true,
                      text: 'Date and Time'
                    }
                  },
                  y: {
                    title: {
                      display: true,
                      text: 'Weight (kg)'
                    },
                    beginAtZero: true
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

export default GarbageManagement;

