import React from 'react';
import { Container, Grid, Typography, Card, CardContent, CardActionArea, Box } from '@mui/material';
import PeopleIcon from '@mui/icons-material/People'; // Resident Management Icon
import DriveEtaIcon from '@mui/icons-material/DriveEta'; // Driver Management Icon
import DeleteIcon from '@mui/icons-material/Delete'; // Garbage Management Icon
import DeleteSweepIcon from '@mui/icons-material/DeleteSweep'; // Waste Bin Management Icon
import RestoreFromTrashIcon from '@mui/icons-material/RestoreFromTrash'; // Total Garbage Management Icon
import { useNavigate } from 'react-router-dom'; // For navigation
import { Header, Footer } from '../../components/header';

const ManagerReportPage = () => {
  const navigate = useNavigate();

  // Function to navigate to respective pages
  const handleNavigate = (path) => {
    navigate(path);
  };

  return (
    <div>
      <Header />
      <Container sx={{ mt: 4 }}>
        <Typography variant="h4" align="center" gutterBottom>
          Manager Report Dashboard
        </Typography>

        {/* Grid for the cards */}
        <Grid container spacing={3} justifyContent="center">
          
          {/* Resident Management */}
          <Grid item xs={12} sm={6} md={4}>
            <Card>
              <CardActionArea onClick={() => handleNavigate('/resident-management')}>
                <CardContent>
                  <Box display="flex" flexDirection="column" alignItems="center">
                    <PeopleIcon sx={{ fontSize: 50, color: 'green' }} />
                    <Typography variant="h6" gutterBottom>
                      Resident Management
                    </Typography>
                  </Box>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>

          {/* Driver Management */}
          <Grid item xs={12} sm={6} md={4}>
            <Card>
              <CardActionArea onClick={() => handleNavigate('/driver-management')}>
                <CardContent>
                  <Box display="flex" flexDirection="column" alignItems="center">
                    <DriveEtaIcon sx={{ fontSize: 50, color: 'blue' }} />
                    <Typography variant="h6" gutterBottom>
                      Driver Management
                    </Typography>
                  </Box>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>

          {/* Waste Bin Management */}
          <Grid item xs={12} sm={6} md={4}>
            <Card>
              <CardActionArea onClick={() => handleNavigate('/wastebin-management')}>
                <CardContent>
                  <Box display="flex" flexDirection="column" alignItems="center">
                    <DeleteSweepIcon sx={{ fontSize: 50, color: 'orange' }} />
                    <Typography variant="h6" gutterBottom>
                      Waste Bin Management
                    </Typography>
                  </Box>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>

          {/* Garbage Management */}
          <Grid item xs={12} sm={6} md={4}>
            <Card>
              <CardActionArea onClick={() => handleNavigate('/garbage-management')}>
                <CardContent>
                  <Box display="flex" flexDirection="column" alignItems="center">
                    <DeleteIcon sx={{ fontSize: 50, color: 'red' }} />
                    <Typography variant="h6" gutterBottom>
                      Garbage Management
                    </Typography>
                  </Box>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>

          {/* Total Garbage Management */}
          <Grid item xs={12} sm={6} md={4}>
            <Card>
              <CardActionArea onClick={() => handleNavigate('/total-garbage')}>
                <CardContent>
                  <Box display="flex" flexDirection="column" alignItems="center">
                    <RestoreFromTrashIcon sx={{ fontSize: 50, color: 'purple' }} />
                    <Typography variant="h6" gutterBottom>
                      Total Garbage Management
                    </Typography>
                  </Box>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        </Grid>

        {/* Toast Notifications */}
        <Footer role="manager" />
      </Container>
    </div>
  );
};

export default ManagerReportPage;
