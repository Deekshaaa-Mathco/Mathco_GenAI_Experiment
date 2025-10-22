import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, CardContent, Typography, Grid, Table, TableBody, TableRow, TableCell, TableHead, Button, Box } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WarningIcon from '@mui/icons-material/Warning';
import { Link } from 'react-router-dom';
import Breadcrumbs from './Breadcrumbs';

function Dashboard() {
  const [kpis, setKpis] = useState({
    forecast_accuracy: 0,
    bias: 0,
    plan_attainment: 0,
    oos_risk_skus: 0,
  });
  const [planningCalendar, setPlanningCalendar] = useState([]);
  const [demandPlans, setDemandPlans] = useState([]);
  const [supplyPlans, setSupplyPlans] = useState([]);

  useEffect(() => {
    // FIXED: ONE CALL TO LIVE BACKEND
    const fetchDashboardData = async () => {
      try {
        console.log('🔄 Fetching dashboard data...');
        const response = await axios.get('https://mathco-gen-ai-experiment-backend.vercel.app/api/dashboard');
        const { planningCalendar, demandPlans, supplyPlans, forecastMetrics } = response.data;
        
        setPlanningCalendar(planningCalendar);
        setDemandPlans(demandPlans);
        setSupplyPlans(supplyPlans);
        setKpis(forecastMetrics);
        
        console.log('✅ Dashboard data loaded:', response.data);
      } catch (error) {
        console.error('❌ Dashboard error:', error);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', fontSize: '1.2em' }}>
      <Breadcrumbs />
      
      {/* KPI Cards */}
      <Grid container spacing={2} sx={{ mt: 2, width: '100%', flexShrink: 0 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ backgroundColor: 'white', transition: 'transform 0.2s', '&:hover': { transform: 'scale(1.05)' }, width: '300px', height: '150px' }}>
            <CardContent>
              <Typography variant="h6">Forecast Accuracy</Typography>
              <Typography variant="h4">{kpis.forecast_accuracy}%</Typography>
              <CheckCircleIcon color="success" />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ backgroundColor: 'white', transition: 'transform 0.2s', '&:hover': { transform: 'scale(1.05)' }, width: '300px', height: '150px' }}>
            <CardContent>
              <Typography variant="h6">Forecast Bias</Typography>
              <Typography variant="h4">{kpis.bias}%</Typography>
              <CheckCircleIcon color="success" />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ backgroundColor: 'white', transition: 'transform 0.2s', '&:hover': { transform: 'scale(1.05)' }, width: '300px', height: '150px' }}>
            <CardContent>
              <Typography variant="h6">Plan Attainment</Typography>
              <Typography variant="h4">{kpis.plan_attainment}%</Typography>
              <CheckCircleIcon color="success" />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ backgroundColor: 'white', transition: 'transform 0.2s', '&:hover': { transform: 'scale(1.05)' }, width: '300px', height: '150px' }}>
            <CardContent>
              <Typography variant="h6">OOS Risk</Typography>
              <Typography variant="h4">{kpis.oos_risk_skus} SKUs</Typography>
              <WarningIcon color="warning" />
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Planning Calendar Table - NOW FROM DB! */}
      <Typography variant="h6" sx={{ mt: 4, mb: 1, flexShrink: 0 }}>Planning Calendar</Typography>
      <Table sx={{ border: '1px solid #ddd', borderRadius: '10px', mb: 4, flexShrink: 0 }}>
        <TableHead>
          <TableRow sx={{ backgroundColor: 'black', color: 'white' }}>
            <TableCell sx={{ color: 'white' }}>Week</TableCell>
            <TableCell sx={{ color: 'white' }}>Status</TableCell>
            <TableCell sx={{ color: 'white', padding: '6px' }}>Activities</TableCell>
            <TableCell sx={{ color: 'white', padding: '6px' }}>Owner</TableCell>
            <TableCell sx={{ color: 'white' }}>Due Date</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {planningCalendar.map((item, index) => (
            <TableRow key={index} sx={{ '&:hover': { backgroundColor: '#e0e0e0' } }}>
              <TableCell>{item.week}</TableCell>
              <TableCell>{item.status}</TableCell>
              <TableCell>{item.activities}</TableCell>
              <TableCell>{item.owner}</TableCell>
              <TableCell>{item.due_date}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Demand & Supply Plans Tables */}
      <Grid container spacing={0} sx={{ mt: 2, flexGrow: 1, width: '100%' }}>
        {/* Demand Plans */}
        <Grid item xs={6} md={6}>
          <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography variant="h6">Demand Plans</Typography>
            <Button variant="contained" sx={{ backgroundColor: 'var(--coca-cola-red)', color: 'var(--coca-cola-white)' }} component={Link} to="/create-scenario">
              + Demand Plan
            </Button>
          </Box>
          <Table sx={{ border: '1px solid #ddd', borderRadius: '10px', width: '100%' }}>
            <TableHead>
              <TableRow sx={{ backgroundColor: 'black', color: 'white' }}>
                <TableCell sx={{ color: 'white' }}>Plan Name</TableCell>
                <TableCell sx={{ color: 'white' }}>Status</TableCell>
                <TableCell sx={{ color: 'white' }}>Created Date</TableCell>
                <TableCell sx={{ color: 'white' }}>Last Modified</TableCell>
                <TableCell sx={{ color: 'white' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {demandPlans.map((plan, index) => (
                <TableRow key={index} sx={{ '&:hover': { backgroundColor: '#e0e0e0' } }}>
                  <TableCell>{plan.plan_name}</TableCell>
                  <TableCell>{plan.status}</TableCell>
                  <TableCell>{plan.created_date}</TableCell>
                  <TableCell>{plan.last_modified}</TableCell>
                  <TableCell>
                    <Button component={Link} to="/demand-review" size="small" variant="outlined" sx={{ borderColor: '#C8102E', color: '#C8102E' }}>
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Grid>

        {/* Supply Plans */}
        <Grid item xs={6} md={6}>
          <Box sx={{ mb: 2 }}>
            <Typography variant="h6">Supply Plans</Typography>
          </Box>
          <Table sx={{ border: '1px solid #ddd', borderRadius: '10px', width: '100%' }}>
            <TableHead>
              <TableRow sx={{ backgroundColor: 'black', color: 'white' }}>
                <TableCell sx={{ color: 'white' }}>Plan Name</TableCell>
                <TableCell sx={{ color: 'white' }}>Status</TableCell>
                <TableCell sx={{ color: 'white' }}>Created Date</TableCell>
                <TableCell sx={{ color: 'white' }}>Last Modified</TableCell>
                <TableCell sx={{ color: 'white' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {supplyPlans.map((plan, index) => (
                <TableRow key={index} sx={{ '&:hover': { backgroundColor: '#e0e0e0' } }}>
                  <TableCell>{plan.plan_name}</TableCell>
                  <TableCell>{plan.status}</TableCell>
                  <TableCell>{plan.created_date}</TableCell>
                  <TableCell>{plan.last_modified}</TableCell>
                  <TableCell>
                    <Button component={Link} to="/supply-planning" size="small" variant="outlined" sx={{ borderColor: '#C8102E', color: '#C8102E' }}>
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Grid>
      </Grid>
    </div>
  );
}

export default Dashboard;