import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, CardContent, Typography, Table, TableBody, TableRow, TableCell, TableHead, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import WarningIcon from '@mui/icons-material/Warning';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import Breadcrumbs from './Breadcrumbs'; // Fixed: singular "Breadcrumb"

function ApplyConstraints() {
  const [constraints, setConstraints] = useState({
    warehouse: [],
    production: []
  });

  const handleSaveContinue = async () => {
    try {
      // Save constraints to backend
      await fetch('http://localhost:3001/api/constraints/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(constraints),
      });
      // Navigate to supply planning
      window.location.href = '/supply-planning';
    } catch (error) {
      console.error('Error saving constraints:', error);
    }
  };

  useEffect(() => {
    // Mock data or API call
    setConstraints({
      warehouse: [
        { dc: 'Bangalore DC', max: 50000, available: 12500, util: 75 },
        { dc: 'Delhi DC', max: 45000, available: 4500, util: 90 },
        { dc: 'Mumbai DC', max: 60000, available: 18000, util: 70 }
      ],
      production: [
        { plant: 'Bangalore', line: 'Line 1', max: 40000, planned: 36800, util: 92 },
        { plant: 'Bangalore', line: 'Line 2', max: 35000, planned: 30000, util: 86 },
        { plant: 'Mumbai', line: 'Line 3', max: 28000, planned: 18200, util: 65 }
      ]
    });
  }, []);

  return (
    <div>
      <Breadcrumbs />
      <Card sx={{ mt: 2 }}>
        <CardContent>
          <Typography variant="h6">Warehouse Capacity Constraints</Typography>
          <Table sx={{ mt: 1, '&:hover': { backgroundColor: '#f5f5f5' }, border: '1px solid #ddd', borderRadius: '10px' }}>
            <TableHead>
              <TableRow sx={{ backgroundColor: '#C8102E', color: 'white' }}>
                <TableCell sx={{ color: 'white' }}>DC</TableCell>
                <TableCell sx={{ color: 'white' }}>Max Capacity</TableCell>
                <TableCell sx={{ color: 'white' }}>Available</TableCell>
                <TableCell sx={{ color: 'white' }}>Utilization</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {constraints.warehouse.map((c, idx) => (
                <TableRow key={idx} sx={{ '&:hover': { backgroundColor: '#e0e0e0' } }}>
                  <TableCell>{c.dc}</TableCell>
                  <TableCell>{c.max.toLocaleString()}</TableCell>
                  <TableCell>{c.available.toLocaleString()}</TableCell>
                  <TableCell>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      {c.util}%
                      {c.util > 85 ? <WarningIcon color="warning" /> : <CheckCircleIcon color="success" />}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <Typography variant="h6" sx={{ mt: 3 }}>Production Capacity Constraints</Typography>
          <Table sx={{ mt: 1, '&:hover': { backgroundColor: '#f5f5f5' }, border: '1px solid #ddd', borderRadius: '10px' }}>
            <TableHead>
              <TableRow sx={{ backgroundColor: '#C8102E', color: 'white' }}>
                <TableCell sx={{ color: 'white' }}>Plant - Line</TableCell>
                <TableCell sx={{ color: 'white' }}>Max Capacity</TableCell>
                <TableCell sx={{ color: 'white' }}>Planned</TableCell>
                <TableCell sx={{ color: 'white' }}>Utilization</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {constraints.production.map((c, idx) => (
                <TableRow key={idx} sx={{ '&:hover': { backgroundColor: '#e0e0e0' } }}>
                  <TableCell>{c.plant} - {c.line}</TableCell>
                  <TableCell>{c.max.toLocaleString()}</TableCell>
                  <TableCell>{c.planned.toLocaleString()}</TableCell>
                  <TableCell>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      {c.util}%
                      {c.util > 85 ? <WarningIcon color="warning" /> : <CheckCircleIcon color="success" />}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <div style={{ marginTop: '24px', display: 'flex', gap: '16px' }}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleSaveContinue}
              sx={{ px: 4 }}
            >
              Save & Continue
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default ApplyConstraints;