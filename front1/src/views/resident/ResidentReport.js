import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Container, Typography } from '@mui/material';
import { Chart, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import axios from 'axios';
import { Header, Footer } from '../../components/header';

// Register Chart.js components for bar chart
Chart.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const ResidentReport = () => {
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetch the logged-in user ID from localStorage (assuming you store it after login)
  const residentData = localStorage.getItem('resident');
  let resident = null;
  try {
    resident = residentData ? JSON.parse(residentData) : null;
  } catch (e) {
    console.error('Invalid resident data in localStorage', e);
    resident = null;
  } // Adjust according to your auth logic

  // Fetch transactions from the backend
  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:2025/api/transaction'); // Adjust API URL
      const allTransactions = response.data;

      // Filter transactions based on logged-in user ID
      const userTransactions = allTransactions.filter(
        (transaction) => transaction.binOwner === resident._id
      );

      // Group transactions by binType and calculate total weight for each garbage type
      const groupedData = userTransactions.reduce(
        (acc, transaction) => {
          acc[transaction.binType] += transaction.currentWeight;
          return acc;
        },
        { Organic: 0, Plastic: 0, Glass: 0 } // Initialize weights for each type
      );

      // Prepare chart datasets
      const dataset = {
        label: 'Total Waste by Type (kg)',
        data: [groupedData.Organic, groupedData.Plastic, groupedData.Glass],
        backgroundColor: ['green', 'red', 'blue'],
        borderColor: ['green', 'red', 'blue'],
        borderWidth: 1,
      };

      // Set chart data
      setChartData({
        labels: ['Organic', 'Plastic', 'Glass'],
        datasets: [dataset],
      });
      setLoading(false);
    } catch (error) {
      console.error('Error fetching transactions:', error);
      setLoading(false);
    }
  };

  // Fetch transactions when the component loads
  useEffect(() => {
    fetchTransactions();
  }, []);

  return (
    <div>
      <Header />
      <Container>
        <Typography variant="h4" gutterBottom>
          My Waste Production
        </Typography>

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
                      text: 'Waste Type',
                    },
                  },
                  y: {
                    title: {
                      display: true,
                      text: 'Weight (kg)',
                    },
                    beginAtZero: true,
                  },
                },
                plugins: {
                  legend: {
                    position: 'top',
                  },
                  title: {
                    display: true,
                    text: 'My Waste Production by Type (kg)',
                  },
                },
              }}
              height={400}
            />
          ) : (
            <Typography variant="h6">No data available</Typography>
          )}
        </div>
      </Container>
      <Footer role="resident" />
    </div>
  );
};

export default ResidentReport;
