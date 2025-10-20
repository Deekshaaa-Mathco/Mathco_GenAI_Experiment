import React from 'react';
import { Dialog, DialogTitle, DialogContent, Typography, Button } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

function PlanPublished() {
  const navigate = useNavigate();

  return (
    <Dialog open={true} onClose={() => navigate('/')} maxWidth="sm" fullWidth>
      <DialogTitle>Plan Published Successfully</DialogTitle>
      <DialogContent>
        <div style={{ textAlign: 'center', padding: '20px' }}>
          <CheckCircleIcon color="success" sx={{ fontSize: 60, mb: 2 }} />
          <Typography variant="h6" sx={{ mb: 2 }}>Plan Published Successfully</Typography>
          <Typography sx={{ mb: 3 }}>Your supply plan has been published and all stakeholders have been notified via email</Typography>
          <Button variant="contained" component={Link} to="/" sx={{ mt: 2 }}>Back to Dashboard</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default PlanPublished;