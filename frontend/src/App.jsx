import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme, Box } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './components/Login';
import Register from './components/Register';
import PrivateRoute from './components/PrivateRoute';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import DemandReview from './components/DemandReview';
import SupplyPlanning from './components/SupplyPlanning';
import MasterConfigurator from './components/MasterConfigurator';
import CreateScenario from './components/CreateScenario';
import SimulateScenarios from './components/SimulateScenarios';
import SimulationResults from './components/SimulationResults';
import PublishPlan from './components/PublishPlan';
import PlanPublished from './components/PlanPublished';

const theme = createTheme({
  palette: {
    primary: { main: '#F40000' }, // Coca-Cola Red
    secondary: { main: '#FFFFFF' }, // White
    background: { default: '#F5F5F5', paper: '#FFFFFF' },
    text: { primary: '#000000', secondary: '#FFFFFF' },
  },
  typography: {
    fontFamily: 'Roboto, sans-serif',
    h5: {
      fontWeight: 700,
    },
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#FFFFFF',
          color: '#000000',
          boxShadow: 'none',
          borderBottom: '1px solid #E0E0E0',
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {},
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: '10px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        },
      },
    },
    MuiTable: {
      styleOverrides: {
        root: {
          borderRadius: '10px',
          overflow: 'hidden',
        },
      },
    },
    MuiTableHead: {
      styleOverrides: {
        root: {
          backgroundColor: '#F40000',
          color: '#FFFFFF',
        },
      },
    },
  },
});

function AppContent() {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    );
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header />
      <Box sx={{ display: 'flex', flexGrow: 1, paddingTop: '80px' }}>
        <Sidebar />
        <Box component="main" sx={{ flexGrow: 1, ml: 250, p: '8px 16px 16px 16px', m: 0, mr: 1, mt: 0 }}>
          <Routes>
            <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
            <Route path="/demand-review" element={<PrivateRoute><DemandReview /></PrivateRoute>} />
            <Route path="/supply-planning" element={<PrivateRoute><SupplyPlanning /></PrivateRoute>} />
            <Route path="/master-configurator" element={<PrivateRoute><MasterConfigurator /></PrivateRoute>} />
            <Route path="/create-scenario" element={<PrivateRoute><CreateScenario /></PrivateRoute>} />
            <Route path="/simulate-scenarios" element={<PrivateRoute><SimulateScenarios /></PrivateRoute>} />
            <Route path="/simulation-results" element={<PrivateRoute><SimulationResults /></PrivateRoute>} />
            <Route path="/publish-plan" element={<PrivateRoute><PublishPlan /></PrivateRoute>} />
            <Route path="/plan-published" element={<PrivateRoute><PlanPublished /></PrivateRoute>} />
            <Route path="/login" element={<Navigate to="/" />} />
            <Route path="/register" element={<Navigate to="/" />} />
          </Routes>
        </Box>
      </Box>
    </Box>
  );
}

function App() {
  return (
    <AuthProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {/* ← FIX: ADD FUTURE FLAGS HERE! */}
        <Router future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true,
        }}>
          <AppContent />
        </Router>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;