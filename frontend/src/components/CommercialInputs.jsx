import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography, Button, TextField, Select, MenuItem, Table, TableBody, TableRow, TableCell, TableHead, Autocomplete } from '@mui/material';
import { Link, useLocation } from 'react-router-dom';
import Breadcrumbs from './Breadcrumbs';

function CommercialInputs() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const skuFromQuery = queryParams.get('sku');

  const [sku, setSku] = useState(skuFromQuery || '');
  const [dc, setDc] = useState('');
  const [volume, setVolume] = useState('');
  const [reason, setReason] = useState('');
  const [adjustments, setAdjustments] = useState([]);

  useEffect(() => {
    if (skuFromQuery) {
      fetch(`http://localhost:3001/api/commercial/adjustments/${skuFromQuery}`)
        .then(res => res.json())
        .then(data => setAdjustments(data))
        .catch(err => console.error('Error fetching adjustments:', err));
    }
  }, [skuFromQuery]);

  const handleAddAdjustment = () => {
    if (sku && dc && volume && reason) {
      const newAdjustment = {
        sku,
        dc,
        volume: parseInt(volume),
        reason,
        date: new Date().toISOString().split('T')[0]
      };
      setAdjustments([...adjustments, newAdjustment]);
      setSku('');
      setDc('');
      setVolume('');
      setReason('');
    }
  };

  const handleSaveContinue = async () => {
    try {
      // Save adjustments to backend
      await fetch('http://localhost:3001/api/commercial/adjustments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(adjustments),
      });
      // Navigate to demand review
      window.location.href = '/demand-review';
    } catch (error) {
      console.error('Error saving adjustments:', error);
    }
  };

  return (
    <div>
      <Breadcrumbs />
      <Card sx={{ mt: 2 }}>
        <CardContent>
          <Typography>Upload Section</Typography>
          <input type="file" accept=".xlsx" />
          <Typography sx={{ mt: 2 }}>Manual Adjustment</Typography>
          <TextField label="SKU" value={sku} onChange={(e) => setSku(e.target.value)} sx={{ mt: 1, width: '100%' }} />
          <Select value={dc} onChange={(e) => setDc(e.target.value)} sx={{ mt: 1, width: '100%' }} displayEmpty>
            <MenuItem value=""><em>Select DC</em></MenuItem>
            <MenuItem value="Bangalore DC">Bangalore DC</MenuItem>
            <MenuItem value="Delhi DC">Delhi DC</MenuItem>
          </Select>
          <TextField label="Additional Volume" value={volume} onChange={(e) => setVolume(e.target.value)} sx={{ mt: 1, width: '100%' }} />
          <Autocomplete
            freeSolo
            options={['Promotional Campaign', 'Marketing Event']}
            value={reason}
            onChange={(event, newValue) => setReason(newValue || '')}
            onInputChange={(event, newInputValue) => setReason(newInputValue)}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Reason"
                placeholder="Select or enter reason"
                sx={{ mt: 1, width: '100%' }}
              />
            )}
          />
          <Button variant="contained" onClick={handleAddAdjustment} sx={{ mt: 2 }}>Add Adjustment</Button>
          <Typography sx={{ mt: 2 }}>Recent Adjustments</Typography>
          <Table sx={{ mt: 1, backgroundColor: 'transparent', '&:hover': { backgroundColor: '#f5f5f5' }, border: '1px solid #ddd', borderRadius: '10px' }}>
            <TableHead>
              <TableRow sx={{ backgroundColor: '#C8102E', color: 'white' }}>
                <TableCell sx={{ color: 'white' }}>SKU</TableCell>
                <TableCell sx={{ color: 'white' }}>DC</TableCell>
                <TableCell sx={{ color: 'white' }}>Volume</TableCell>
                <TableCell sx={{ color: 'white' }}>Reason</TableCell>
                <TableCell sx={{ color: 'white' }}>Date</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {adjustments.map((adj, idx) => (
                <TableRow key={idx} sx={{ '&:hover': { backgroundColor: '#e0e0e0' } }}>
                  <TableCell>{adj.sku}</TableCell>
                  <TableCell>{adj.dc}</TableCell>
                  <TableCell>{adj.volume}</TableCell>
                  <TableCell>{adj.reason}</TableCell>
                  <TableCell>{adj.date}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <Button variant="contained" component={Link} to="/demand-review" sx={{ mt: 2 }}>Back to Review</Button>
          <Button variant="contained" onClick={handleSaveContinue} sx={{ mt: 2, ml: 2 }}>Save & Continue</Button>
        </CardContent>
      </Card>
    </div>
  );
}

export default CommercialInputs;