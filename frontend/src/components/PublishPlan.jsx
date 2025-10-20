import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, TextField, Button, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

function PublishPlan() {
  const [open, setOpen] = useState(true); // Controlled by parent (SupplyPlanning)
  const [comment, setComment] = useState('');
  const navigate = useNavigate();

  const handlePublish = () => {
    navigate('/plan-published');
    setOpen(false);
  };

  return (
    <Dialog open={open} onClose={() => navigate('/supply-planning')}>
      <DialogTitle>Publish Confirmation</DialogTitle>
      <DialogContent>
        <Typography>✓ Lock scenario, generate MRP, notify stakeholders</Typography>
        <TextField label="Comment" multiline rows={3} value={comment} onChange={(e) => setComment(e.target.value)} sx={{ mt: 2, width: '100%' }} />
        <Button variant="contained" color="secondary" onClick={() => navigate('/supply-planning')} sx={{ mt: 2 }}>Cancel</Button>
        <Button variant="contained" color="primary" onClick={handlePublish} sx={{ mt: 2, ml: 2 }}>Publish Plan</Button>
      </DialogContent>
    </Dialog>
  );
}

export default PublishPlan;