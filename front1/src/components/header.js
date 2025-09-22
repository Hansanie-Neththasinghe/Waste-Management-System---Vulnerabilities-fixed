import React from 'react';
import { AppBar, Toolbar, Typography, BottomNavigation, BottomNavigationAction } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import BarChartIcon from '@mui/icons-material/BarChart';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { useNavigate } from 'react-router-dom';

function Header() {
  return (
    <AppBar position="static" sx={{ bgcolor: 'lightgreen' }}>
      <Toolbar>
        <Typography
          variant="h6"
          noWrap
          component="div"
          sx={{ fontWeight: 'bold', color: 'white', flexGrow: 1 }}
        >
          Eco Clean
        </Typography>
      </Toolbar>
    </AppBar>
  );
}

function Footer({ role }) {
    const [value, setValue] = React.useState(0);
    const navigate = useNavigate();
  
    const handleNavigation = (newValue) => {
      setValue(newValue);
      switch (newValue) {
        case 0:
          navigate(`/${role}/home`);  // Home URL changes based on role
          break;
        case 1:
          navigate(`/${role}/job`);  // Calendar or any other section
          break;
        case 2:
          navigate(`/${role}/report`);  // Reports or similar feature
          break;
        case 3:
          navigate(`/${role}/profile`);  // Profile URL changes based on role
          break;
        default:
          break;
      }
    };
  
    return (
      <BottomNavigation
        value={value}
        onChange={(event, newValue) => handleNavigation(newValue)}
        showLabels
        sx={{
          position: 'fixed',
          bottom: 0,
          width: '100%',
          bgcolor: 'white',
          boxShadow: 3,
        }}
      >
        <BottomNavigationAction label="Home" icon={<HomeIcon />} />
        <BottomNavigationAction label="Job" icon={<CalendarTodayIcon />} />
        <BottomNavigationAction label="Report" icon={<BarChartIcon />} />
        <BottomNavigationAction label="Profile" icon={<AccountCircleIcon />} />
      </BottomNavigation>
    );
}

export { Header, Footer };
