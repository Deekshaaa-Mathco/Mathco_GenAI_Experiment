import React from 'react';
import { Typography, Table, TableBody, TableRow, TableCell, TableHead, Button, Box, Card, CardContent, Grid } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WarningIcon from '@mui/icons-material/Warning';
import Breadcrumbs from './Breadcrumbs';

function SimulateScenarios() {
  const navigate = useNavigate();

  const scenarios = [
    {
      name: 'Minimize Out of Stock Risk',
      kpis: 'OOS Risk Reduction -45%, Capacity Impact 89%, Service Level 97.2%',
      changes: [
        '✓ Increased priority for Coke Zero 500ml',
        '✓ Shifted Coke Zero 2L to Mumbai',
        '✓ Reduced stock for low-priority SKUs',
        '! 3 SKUs need expedited transport'
      ],
      impact: 'Production Schedule Impact: Line 1 87% to 92%, 2 SKUs off-peak'
    },
    {
      name: 'Maximize Capacity Utilization',
      kpis: 'OOS Risk Reduction -30%, Capacity Impact 95%, Service Level 96.5%',
      changes: [
        '✓ Optimized line utilization across plants',
        '✓ Shifted production to high-capacity lines',
        '✓ Reduced changeover times',
        '! 2 SKUs need expedited transport'
      ],
      impact: 'Production Schedule Impact: Line 2 85% to 95%, 1 SKU off-peak'
    },
    {
      name: 'Maximize Profitability',
      kpis: 'OOS Risk Reduction -20%, Capacity Impact 80%, Service Level 98.0%',
      changes: [
        '✓ Prioritized high-margin SKUs',
        '✓ Reduced production for low-margin items',
        '✓ Optimized DC allocation for cost savings',
        '! 1 SKU needs expedited transport'
      ],
      impact: 'Production Schedule Impact: Line 3 90% to 88%, 3 SKUs off-peak'
    },
    {
      name: 'Balanced Approach',
      kpis: 'OOS Risk Reduction -35%, Capacity Impact 87%, Service Level 97.5%',
      changes: [
        '✓ Balanced priority across SKUs',
        '✓ Moderate capacity utilization',
        '✓ Optimized for both risk and profit',
        '! 2 SKUs need expedited transport'
      ],
      impact: 'Production Schedule Impact: Line 1 88% to 90%, 2 SKUs off-peak'
    }
  ];

  return (
    <Box sx={{ p: 3 }}>
      <Breadcrumbs />
      <Typography variant="h4" gutterBottom sx={{ color: 'black' }}>
        Simulate Scenarios
      </Typography>
      <Grid container spacing={3}>
        {scenarios.map((scenario, index) => (
          <Grid item xs={6} key={index}>
            <Card sx={{ border: '1px solid #ddd', borderRadius: '10px', height: '100%' }}>
              <CardContent>
                <Typography variant="h6" sx={{ color: 'black', mb: 2 }}>
                  {scenario.name}
                </Typography>
                <Typography color="success" sx={{ mb: 1 }}>Simulation Completed Successfully</Typography>
                <Typography sx={{ mb: 2 }}>Impact KPIs: {scenario.kpis}</Typography>
                <Table sx={{ mt: 1, '&:hover': { backgroundColor: '#f5f5f5' }, border: '1px solid #ddd', borderRadius: '10px' }}>
                  <TableHead>
                    <TableRow sx={{ backgroundColor: 'black', color: 'white' }}>
                      <TableCell sx={{ color: 'white' }}>Simulation Changes</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {scenario.changes.map((change, idx) => (
                      <TableRow key={idx} sx={{ '&:hover': { backgroundColor: '#e0e0e0' } }}>
                        <TableCell>{change}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                <Typography sx={{ mt: 2 }}>{scenario.impact}</Typography>
                <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
                  <Button variant="contained" color="primary" onClick={() => navigate('/supply-planning')}>
                    Apply This Scenario
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
        <Button variant="contained" color="secondary" onClick={() => navigate('/supply-planning')}>
          Back to Supply Planning
        </Button>
      </Box>
    </Box>
  );
}

export default SimulateScenarios;
