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
    console.log('🔄 Loading dashboard data...');

    // FETCH KPIs
    axios.get('https://mathco-gen-ai-experiment-backend.vercel.app/api/dashboard/kpis')
      .then(res => {
        setKpis(res.data);
        console.log('✅ KPIs:', res.data);
      })
      .catch(err => console.error('❌ KPI error:', err));

    // FETCH DEMAND PLANS (scenarios)
    axios.get('https://mathco-gen-ai-experiment-backend.vercel.app/api/scenarios')
      .then(res => {
        setDemandPlans(res.data);
        console.log('✅ Demand plans:', res.data);
      })
      .catch(err => console.error('❌ Demand error:', err));

    // FETCH SUPPLY PLANS
    axios.get('https://mathco-gen-ai-experiment-backend.vercel.app/api/supply/plans')
      .then(res => {
        setSupplyPlans(res.data);
        console.log('✅ Supply plans:', res.data);
      })
      .catch(err => console.error('❌ Supply error:', err));

    // PLANNING CALENDAR HARDCODED
    setPlanningCalendar([
      { week: 'Week 1', status: 'Completed', activities: 'Demand Review & Forecast Update', owner: 'John Doe', due_date: '2024-01-07' },
      { week: 'Week 2', status: 'In Progress', activities: 'Supply Planning & Capacity Check', owner: 'Jane Smith', due_date: '2024-01-14' },
      { week: 'Week 3', status: 'Pending', activities: 'Model Performance Review & Optimization', owner: 'Mike Johnson', due_date: '2024-01-21' },
      { week: 'Week 4', status: 'Pending', activities: 'Scenario Simulation & Risk Assessment', owner: 'Sarah Lee', due_date: '2024-01-28' }
    ]);
  }, []);

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', fontSize: '1.2em' }}>
      <Breadcrumbs />

      {/* KPI Cards - FIXED SYNTAX! */}
      <Grid container spacing={2} sx={{ mt: 2, width: '100%', flexShrink: 0 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ backgroundColor: 'white', transition: 'transform 0.2s', '&:hover': { transform: 'scale(1.05)' }, width: '300px', height: '150px' }}>
            <CardContent>
              <Typography variant="h6">Forecast Accuracy</Typography>
              <Typography variant="h4">{kpis.forecast_accuracy.toFixed(1)}%</Typography>
              <CheckCircleIcon color="success" />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ backgroundColor: 'white', transition: 'transform 0.2s', '&:hover': { transform: 'scale(1.05)' }, width: '300px', height: '150px' }}>
            <CardContent>
              <Typography variant="h6">Forecast Bias</Typography>
              <Typography variant="h4">{kpis.bias.toFixed(1)}%</Typography>
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

      {/* Planning Calendar */}
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

      {/* Demand Plans Table */}
      <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography variant="h6">Demand Plans</Typography>
        <Button variant="contained" sx={{ backgroundColor: '#C8102E', color: 'white' }} component={Link} to="/create-scenario">
          + Demand Plan
        </Button>
      </Box>
      <Box sx={{ mb: 4 }}>
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
                <TableCell>{plan.plan_name || plan.name}</TableCell>
                <TableCell>{plan.status}</TableCell>
                <TableCell>{plan.created_date ? new Date(plan.created_date).toLocaleDateString() : 'N/A'}</TableCell>
                <TableCell>{plan.last_modified ? new Date(plan.last_modified).toLocaleDateString() : 'N/A'}</TableCell>
                <TableCell>
                  <Button component={Link} to="/demand-review" size="small" variant="outlined" sx={{ borderColor: '#C8102E', color: '#C8102E' }}>
                    View
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Box>

      {/* Supply Plans Table */}
      <Typography variant="h6" sx={{ mb: 2 }}>Supply Plans</Typography>
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
              <TableCell>{plan.plan_name || plan.name}</TableCell>
              <TableCell>{plan.status}</TableCell>
              <TableCell>{plan.created_date ? new Date(plan.created_date).toLocaleDateString() : 'N/A'}</TableCell>
              <TableCell>{plan.last_modified ? new Date(plan.last_modified).toLocaleDateString() : 'N/A'}</TableCell>
              <TableCell>
                <Button component={Link} to="/supply-planning" size="small" variant="outlined" sx={{ borderColor: '#C8102E', color: '#C8102E' }}>
                  View
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

export default Dashboard;