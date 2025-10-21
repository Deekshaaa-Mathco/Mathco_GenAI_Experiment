
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { API_BASE_URL } from '../config/api';

function ReasonCodes() {
  const [reasonCodes, setReasonCodes] = useState([]);
  const [open, setOpen] = useState(false);
  const [newReasonCode, setNewReasonCode] = useState({ code: '', description: '' });
  const [editingReasonCode, setEditingReasonCode] = useState(null); // To store the reason code being edited

  useEffect(() => {
    fetchReasonCodes();
  }, []);

  const fetchReasonCodes = async () => {
    const response = await axios.get(`${API_BASE_URL}/api/reason-codes`);
    setReasonCodes(response.data);
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
        // Update existing reason code
        await axios.put(`${API_BASE_URL}/api/reason-codes/${editingReasonCode.id}`, newReasonCode);
      } else {
        // Create new reason code
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
    await axios.delete(`${API_BASE_URL}/api/reason-codes/${id}`);
    fetchReasonCodes();
  };

  return (
    <div>
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
        <DialogTitle>New Reason Code</DialogTitle>
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
    </div>
  );
}

export default ReasonCodes;
