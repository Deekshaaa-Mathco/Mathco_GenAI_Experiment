import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, CardContent, Typography, Table, TableBody, TableRow, TableCell, TableHead, Grid, Button } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import Breadcrumbs from './Breadcrumbs';

function ModelPerformance() {
  const [data, setData] = useState({ kpis: { accuracy: 87.3, bias: 2.1, time: 2 }, models: [], topSkus: [] });

  useEffect(() => {
    axios.get('/api/model/performance')
      .then(res => {
        const apiData = res.data;
        // Ensure accuracy is a number
        if (apiData.kpis && typeof apiData.kpis.accuracy !== 'number') {
          apiData.kpis.accuracy = 87.3;
        }
        setData(apiData || data);
      })
      .catch(err => console.error('API Error:', err));
  }, []);

  return (
    <div>
      <Breadcrumbs />
      <Grid container spacing={2} sx={{ mt: 2 }}>
        <Grid item xs={12} sm={6} md={6}>
          <Card sx={{ backgroundColor: 'white', transition: 'transform 0.2s', '&:hover': { transform: 'scale(1.05)' }, width: '300px', height: '150px' }}>
            <CardContent>
              <Typography variant="h6">Model Accuracy</Typography>
              <Typography variant="h4">{(data.kpis?.accuracy ?? 87.3).toFixed(1)}%</Typography>
              <CheckCircleIcon color="success" />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ backgroundColor: 'white', transition: 'transform 0.2s', '&:hover': { transform: 'scale(1.05)' }, width: '300px', height: '150px' }}>
            <CardContent>
              <Typography variant="h6">Bias</Typography>
              <Typography variant="h4">{(data.kpis?.bias ?? 2.1).toFixed(1)}%</Typography>
              <CheckCircleIcon color="success" />
            </CardContent>
          </Card>
        </Grid>

      </Grid>
      <Typography variant="h6" sx={{ mt: 2 }}>Model Performance</Typography>
      <Table sx={{ mt: 1, '&:hover': { backgroundColor: '#f5f5f5' }, border: '1px solid #ddd', borderRadius: '10px' }}>
        <TableHead>
          <TableRow sx={{ backgroundColor: 'black', color: 'white' }}>
            <TableCell sx={{ color: 'white' }}>Model</TableCell>
            <TableCell sx={{ color: 'white' }}>Score</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.models && data.models.map((m, idx) => (
            <TableRow key={idx} sx={{ '&:hover': { backgroundColor: '#e0e0e0' } }}>
              <TableCell>{m.name}</TableCell>
              <TableCell>{m.score}%</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Typography variant="h6" sx={{ mt: 2 }}>Top SKUs by Error</Typography>
      <Table sx={{ mt: 1, '&:hover': { backgroundColor: '#f5f5f5' }, border: '1px solid #ddd', borderRadius: '10px' }}>
        <TableHead>
          <TableRow sx={{ backgroundColor: 'black', color: 'white' }}>
            <TableCell sx={{ color: 'white' }}>SKU</TableCell>
            <TableCell sx={{ color: 'white' }}>Error Rate</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.topSkus && data.topSkus.map((s, idx) => (
            <TableRow key={idx} sx={{ '&:hover': { backgroundColor: '#e0e0e0' } }}>
              <TableCell>{s.name}</TableCell>
              <TableCell>{s.performance}%</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

    </div>
  );
}

export default ModelPerformance;
