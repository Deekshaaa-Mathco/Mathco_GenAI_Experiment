import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, CardContent, Typography, Grid, Table, TableBody, TableRow, TableCell, TableHead, Button, Box } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WarningIcon from '@mui/icons-material/Warning';
import { Link } from 'react-router-dom';
import Breadcrumbs from './Breadcrumbs';
import { API_BASE_URL } from '../config/api';

function Dashboard() {
  const [kpis, setKpis] = useState({
    forecast_accuracy: 0,
    bias: 0,
    plan_attainment: 0,
    oos_risk_skus: 0,
  });
  const [demandPlans, setDemandPlans] = useState([]);
  const [supplyPlans, setSupplyPlans] = useState([]);

  useEffect(() => {
    // Fetch KPIs
    axios.get(`${API_BASE_URL}/api/dashboard/kpis`)
      .then(res => setKpis({ ...kpis, ...res.data }))
      .catch(error => console.error('Error fetching KPIs:', error));

    // Fetch demand plans
    axios.get(`${API_BASE_URL}/api/scenarios`)
      .then(res => {
        if (Array.isArray(res.data)) {
          setDemandPlans(res.data);
        } else {
          console.error('Unexpected data format for demand plans:', res.data);
          setDemandPlans([]);
        }
      })
      .catch(error => {
        console.error('Error fetching demand plans:', error);
        setDemandPlans([]);
      });

    // Fetch supply plans
    axios.get(`${API_BASE_URL}/api/supply/plans`)
      .then(res => {
        if (Array.isArray(res.data)) {
          setSupplyPlans(res.data);
        } else {
          console.error('Unexpected data format for supply plans:', res.data);
          setSupplyPlans([]);
        }
      })
      .catch(error => {
        console.error('Error fetching supply plans:', error);
        setSupplyPlans([]);
      });
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

      {/* Planning Calendar Table */}
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
          {/* Mock data for planning calendar */}
          <TableRow sx={{ '&:hover': { backgroundColor: '#e0e0e0' } }}>
            <TableCell>Week 1</TableCell>
            <TableCell>Completed</TableCell>
            <TableCell>Demand Review & Forecast Update</TableCell>
            <TableCell>John Doe</TableCell>
            <TableCell>2024-01-07</TableCell>
          </TableRow>
          <TableRow sx={{ '&:hover': { backgroundColor: '#e0e0e0' } }}>
            <TableCell>Week 2</TableCell>
            <TableCell>In Progress</TableCell>
            <TableCell>Supply Planning & Capacity Check</TableCell>
            <TableCell>Jane Smith</TableCell>
            <TableCell>2024-01-14</TableCell>
          </TableRow>
          <TableRow sx={{ '&:hover': { backgroundColor: '#e0e0e0' } }}>
            <TableCell>Week 3</TableCell>
            <TableCell>Pending</TableCell>
            <TableCell>Model Performance Review & Optimization</TableCell>
            <TableCell>Mike Johnson</TableCell>
            <TableCell>2024-01-21</TableCell>
          </TableRow>
          <TableRow sx={{ '&:hover': { backgroundColor: '#e0e0e0' } }}>
            <TableCell>Week 4</TableCell>
            <TableCell>Pending</TableCell>
            <TableCell>Scenario Simulation & Risk Assessment</TableCell>
            <TableCell>Sarah Lee</TableCell>
            <TableCell>2024-01-28</TableCell>
          </TableRow>
        </TableBody>
      </Table>

      {/* Tables */}
      <Grid container spacing={0} sx={{ mt: 2, flexGrow: 1, width: '100%' }}>
        {/* Demand Plans Table */}
        <Grid item xs={6} md={6} sx={{ display: 'flex', flexDirection: 'column', height: '100%', width: '50%' }}>
          <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', justifyContent: 'flex-start' }}>
            <Typography variant="h6" sx={{ mr: 100 }}>Demand Plans</Typography>
            <Button variant="contained" sx={{ backgroundColor: 'var(--coca-cola-red)', color: 'var(--coca-cola-white)', '&:hover': { backgroundColor: 'var(--coca-cola-red)' } }} component={Link} to="/create-scenario">
              + Demand Plan
            </Button>
          </Box>
          <Box sx={{ flexGrow: 1, height: '100%', overflow: 'auto', border: '1px solid #ddd', borderRadius: '10px', width: '100%' }}>
            <Table sx={{ width: '100%' }}>
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
                {Array.isArray(demandPlans) && demandPlans.map((plan) => (
                  <TableRow key={plan.id} sx={{ '&:hover': { backgroundColor: '#e0e0e0' } }}>
                    <TableCell>{plan.name}</TableCell>
                    <TableCell>{plan.status}</TableCell>
                    <TableCell>{plan.created_date || '2024-01-01'}</TableCell>
                    <TableCell>{plan.last_modified || '2024-01-05'}</TableCell>
                    <TableCell>
                      <Button
                        component={Link}
                        to="/demand-review"
                        size="small"
                        variant="outlined"
                        sx={{ mr: 1, borderColor: '#C8102E', color: '#C8102E', '&:hover': { backgroundColor: '#C8102E', color: '#FFFFFF' } }}
                      >
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Box>
        </Grid>

        {/* Supply Plans Table */}
        <Grid item xs={6} md={6} sx={{ display: 'flex', flexDirection: 'column', height: '100%', width: '50%' }}>
          <Box sx={{ mb: 2 }}>
            <Typography variant="h6">Supply Plans</Typography>
          </Box>
          <Box sx={{ flexGrow: 1, height: '100%', overflow: 'auto', border: '1px solid #ddd', borderRadius: '10px', width: '100%' }}>
            <Table sx={{ width: '100%' }}>
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
                {Array.isArray(supplyPlans) && supplyPlans.map((plan) => (
                  <TableRow key={plan.id} sx={{ '&:hover': { backgroundColor: '#e0e0e0' } }}>
                    <TableCell>{plan.name}</TableCell>
                    <TableCell>{plan.status}</TableCell>
                    <TableCell>{plan.created_date || '2024-01-02'}</TableCell>
                    <TableCell>{plan.last_modified || '2024-01-06'}</TableCell>
                    <TableCell>
                      <Button
                        component={Link}
                        to="/supply-planning"
                        size="small"
                        variant="outlined"
                        sx={{ mr: 1, borderColor: '#C8102E', color: '#C8102E', '&:hover': { backgroundColor: '#C8102E', color: '#FFFFFF' } }}
                      >
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Box>
        </Grid>
      </Grid>
    </div>
  );
}

export default Dashboard;