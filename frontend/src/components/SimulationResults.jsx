import React from 'react';
import { Dialog, DialogTitle, DialogContent, Typography, Table, TableBody, TableRow, TableCell, TableHead, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WarningIcon from '@mui/icons-material/Warning';

function SimulationResults() {
  const navigate = useNavigate();

  return (
    <Dialog open={true} onClose={() => navigate('/supply-planning')}>
      <DialogTitle>Simulation Results</DialogTitle>
      <DialogContent>
        <Typography color="success">Simulation Completed Successfully</Typography>
        <Typography>Impact KPIs: OOS Risk Reduction -45%, Capacity Impact 89%, Service Level 97.2%</Typography>
        <Table sx={{ mt: 1, '&:hover': { backgroundColor: '#f5f5f5' }, border: '1px solid #ddd', borderRadius: '10px' }}>
          <TableHead>
            <TableRow sx={{ backgroundColor: '#C8102E', color: 'white' }}>
              <TableCell sx={{ color: 'white' }}>Simulation Changes</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow sx={{ '&:hover': { backgroundColor: '#e0e0e0' } }}><TableCell>✓ Increased priority for Coke Zero 500ml</TableCell></TableRow>
            <TableRow sx={{ '&:hover': { backgroundColor: '#e0e0e0' } }}><TableCell>✓ Shifted Coke Zero 2L to Mumbai</TableCell></TableRow>
            <TableRow sx={{ '&:hover': { backgroundColor: '#e0e0e0' } }}><TableCell>✓ Reduced stock for low-priority SKUs</TableCell></TableRow>
            <TableRow sx={{ '&:hover': { backgroundColor: '#e0e0e0' } }}><TableCell>! 3 SKUs need expedited transport</TableCell></TableRow>
          </TableBody>
        </Table>
        <Typography>Production Schedule Impact: Line 1 87% to 92%, 2 SKUs off-peak</Typography>
        <Button variant="contained" color="secondary" onClick={() => navigate('/supply-planning')} sx={{ mt: 2 }}>Close</Button>
        <Button variant="contained" color="primary" onClick={() => navigate('/supply-planning')} sx={{ mt: 2, ml: 2 }}>Apply This Scenario</Button>
      </DialogContent>
    </Dialog>
  );
}

export default SimulationResults;