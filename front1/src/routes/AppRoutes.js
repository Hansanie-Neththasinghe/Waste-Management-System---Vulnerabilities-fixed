import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
//Common Components
import SplashScreen from '../components/SplashScreen';

//Manager Components
import ManagerLogin from '../views/manager/ManagerLogin';
import ManagerHome from '../views/manager/ManagerHome';
import ManagerProfile from '../views/manager/ManagerProfile';
import ManagerJob from '../views/manager/ManagerJob';
import ManagerReport from '../views/manager/ManagerReport';
import ResidentManagement from '../views/manager/Report/ResidentManagement';
import WastebinManagement from '../views/manager/Report/WastebinManagement';
import DriverManagement from '../views/manager/Report/DriverManagement';
import WasteBarChart from '../views/manager/Report/TotalGarbage';
import GarbageManagement from '../views/manager/Report/GarbageManagement';
//Resident Components
import ResidentLogin from '../views/resident/ResidentLogin';
import ResidentCreate from '../views/resident/ResidentCreate';
import ResidentHome from '../views/resident/ResidentHome';
import ResidentProfile from '../views/resident/ResidentProfile';
import ResidentJobCreate from '../views/resident/ResidentJobCreate';
import ResidentReport from '../views/resident/ResidentReport';
//Emp Components
import EmpLogin from '../views/employee/empLogin';
import EmpHome from '../views/employee/empHome';
import EmpProfile from '../views/employee/empProfile';

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SplashScreen />} />
        <Route path="/manager" element={<ManagerLogin />} />
        <Route path="/manager/home" element={<ManagerHome />} />
        <Route path="/manager/profile" element={<ManagerProfile />} />
        <Route path="/manager/job" element={<ManagerJob />} />
        <Route path="/manager/report" element={<ManagerReport />} />
        <Route path="/resident-management" element={<ResidentManagement />} />
        <Route path="/wastebin-management" element={<WastebinManagement />} />
        <Route path="/driver-management" element={<DriverManagement />} />
        <Route path="/garbage-management" element={<GarbageManagement />} />
        <Route path="/total-garbage" element={<WasteBarChart />} />

        <Route path="/resident" element={<ResidentLogin />} />
        <Route path="/resident/create" element={<ResidentCreate />} />
        <Route path="/resident/home" element={<ResidentHome />} />
        <Route path="/resident/profile" element={<ResidentProfile />} />
        <Route path="/resident/job" element={<ResidentJobCreate />} />
        <Route path="/resident/report" element={<ResidentReport />} />

        <Route path="/employee" element={<EmpLogin />} />
        <Route path="/employee/home" element={<EmpHome />} />
        <Route path="/employee/profile" element={<EmpProfile />} />
        {/* Add more routes for residents and drivers */}
      </Routes>
    </Router>
  );
};

export default AppRoutes;
