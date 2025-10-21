import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, CardContent, Typography, Table, TableBody, TableRow, TableCell, TableHead, Grid, Button, Tabs, Tab, Box, TextField, Dialog, DialogActions, DialogContent, DialogTitle, TableContainer, Paper, Select, MenuItem, Autocomplete } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WarningIcon from '@mui/icons-material/Warning';
import Breadcrumbs from './Breadcrumbs';
import { API_BASE_URL } from '../config/api';

function MasterConfigurator() {
  const [tabValue, setTabValue] = useState(0);
  const [data, setData] = useState({ kpis: { accuracy: 87.3, bias: 2.1, time: 2 }, models: [], topSkus: [] });
  const [reasonCodes, setReasonCodes] = useState([]);
  const [open, setOpen] = useState(false);
  const [newReasonCode, setNewReasonCode] = useState({ code: '', description: '' });
  const [editingReasonCode, setEditingReasonCode] = useState(null);
  const [sku, setSku] = useState('');
  const [dc, setDc] = useState('');
  const [volume, setVolume] = useState('');
  const [reason, setReason] = useState('');
  const [adjustments, setAdjustments] = useState([]);

  useEffect(() => {
    fetchModelPerformance();
    fetchReasonCodes();
  }, []);

  const fetchModelPerformance = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/model/performance`);
      const apiData = res.data;
      if (apiData.kpis && typeof apiData.kpis.accuracy !== 'number') {
        apiData.kpis.accuracy = 87.3;
      }
      setData(apiData || data);
    } catch (err) {
      console.error('API Error:', err);
    }
  };

  const fetchReasonCodes = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/reason-codes`);
      setReasonCodes(response.data);
    } catch (error) {
      console.error('Error fetching reason codes:', error);
    }
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleOpen = (reasonCode = null) => {
    setOpen(true);
    if (reasonCode) {
      setEditingReasonCode(reasonCode);
      setNewReasonCode({ code: reasonCode.code, description: reasonCode.description });
    } else {
      setEditingReasonCode(null);
      setNewReasonCode({ code: '', description: '' });
    }
  };

  const handleClose = () => {
    setOpen(false);
    setEditingReasonCode(null);
    setNewReasonCode({ code: '', description: '' });
  };

  const handleSave = async () => {
    try {
      if (editingReasonCode) {
        await axios.put(`${API_BASE_URL}/api/reason-codes/${editingReasonCode.id}`, newReasonCode);
      } else {
        await axios.post(`${API_BASE_URL}/api/reason-codes`, newReasonCode);
      }
      fetchReasonCodes();
      handleClose();
    } catch (error) {
      console.error('Error saving reason code:', error);
      alert('Failed to save reason code.');
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_BASE_URL}/api/reason-codes/${id}`);
      fetchReasonCodes();
    } catch (error) {
      console.error('Error deleting reason code:', error);
    }
  };

  return (
    <div>
      <Breadcrumbs />
      <Typography variant="h5" sx={{ mt: 2, mb: 2 }}>Master Configurator</Typography>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={tabValue} onChange={handleTabChange} aria-label="master configurator tabs">
          <Tab label="Commercial Inputs" sx={{ color: 'black' }} />
          <Tab label="Reason Codes" sx={{ color: 'black' }} />
          <Tab label="Model Performance" sx={{ color: 'white' }} />
        </Tabs>
      </Box>
      {tabValue === 0 && (
        <Box sx={{ mt: 2 }}>
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
              <Button variant="contained" onClick={() => {
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
              }} sx={{ mt: 2 }}>Add Adjustment</Button>
              <Typography sx={{ mt: 2 }}>Recent Adjustments</Typography>
              <Table sx={{ mt: 1, backgroundColor: 'transparent', '&:hover': { backgroundColor: '#f5f5f5' }, border: '1px solid #ddd', borderRadius: '10px' }}>
              <TableHead>
                <TableRow sx={{ backgroundColor: 'black', color: 'white' }}>
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
              <Button variant="contained" onClick={async () => {
                try {
                  await fetch(`${API_BASE_URL}/api/commercial/adjustments`, {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(adjustments),
                  });
                  window.location.href = '/demand-review';
                } catch (error) {
                  console.error('Error saving adjustments:', error);
                }
              }} sx={{ mt: 2 }}>Save & Continue</Button>
            </CardContent>
          </Card>
        </Box>
      )}
      {tabValue === 1 && (
        <Box sx={{ mt: 2 }}>
          <Button variant="contained" onClick={() => handleOpen()} sx={{ mb: 2, backgroundColor: 'var(--coca-cola-red)', color: 'var(--coca-cola-white)', '&:hover': { backgroundColor: 'var(--coca-cola-red)' } }}>
            New Reason Code
          </Button>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: 'black' }}>
                  <TableCell sx={{ color: 'white' }}>Reason Code</TableCell>
                  <TableCell sx={{ color: 'white' }}>Description</TableCell>
                  <TableCell sx={{ color: 'white' }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {reasonCodes.map((code) => (
                  <TableRow key={code.id} sx={{ '&:hover': { backgroundColor: '#e0e0e0' } }}>
                    <TableCell>{code.code}</TableCell>
                    <TableCell>{code.description}</TableCell>
                    <TableCell>
                      <Button variant="contained" onClick={() => handleOpen(code)} sx={{ mr: 1, backgroundColor: 'var(--coca-cola-red)', color: 'var(--coca-cola-white)', '&:hover': { backgroundColor: 'var(--coca-cola-red)' } }}>
                        Edit
                      </Button>
                      <Button variant="contained" onClick={() => handleDelete(code.id)} sx={{ backgroundColor: 'var(--coca-cola-red)', color: 'var(--coca-cola-white)', '&:hover': { backgroundColor: 'var(--coca-cola-red)' } }}>
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <Dialog open={open} onClose={handleClose}>
            <DialogTitle>{editingReasonCode ? 'Edit Reason Code' : 'New Reason Code'}</DialogTitle>
            <DialogContent>
              <TextField
                autoFocus
                margin="dense"
                label="Reason Code"
                fullWidth
                value={newReasonCode.code}
                onChange={(e) => setNewReasonCode({ ...newReasonCode, code: e.target.value })}
              />
              <TextField
                margin="dense"
                label="Description"
                fullWidth
                value={newReasonCode.description}
                onChange={(e) => setNewReasonCode({ ...newReasonCode, description: e.target.value })}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose}>Cancel</Button>
              <Button onClick={handleSave}>{editingReasonCode ? 'Update' : 'Create'}</Button>
            </DialogActions>
          </Dialog>
        </Box>
      )}
      {tabValue === 2 && (
        <Box sx={{ mt: 2 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={6}>
              <Card sx={{ backgroundColor: '#FFE5E5', transition: 'transform 0.2s', '&:hover': { transform: 'scale(1.05)' }, width: '300px', height: '150px' }}>
                <CardContent>
                  <Typography variant="h6">Model Accuracy</Typography>
                  <Typography variant="h4">{(data.kpis?.accuracy ?? 87.3).toFixed(1)}%</Typography>
                  <CheckCircleIcon color="success" />
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ backgroundColor: '#FFE5E5', transition: 'transform 0.2s', '&:hover': { transform: 'scale(1.05)' }, width: '300px', height: '150px' }}>
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
          <Button variant="contained" sx={{ mt: 2 }}>Retrain</Button>
        </Box>
      )}
    </div>
  );
}

export default MasterConfigurator;
