import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, TextField, Select, MenuItem, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

function CreateScenario() {
  const [open, setOpen] = useState(true);
  const [name, setName] = useState('');
  const [base, setBase] = useState('');
  const [description, setDescription] = useState('');
  const navigate = useNavigate();

  const handleCreate = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/scenarios/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          type: base,
          objective: description,
        }),
      });
      const data = await response.json();
      if (response.ok) {
        console.log('Scenario created:', data);
        setOpen(false);
        navigate('/demand-review');
      } else {
        console.error('Error creating scenario:', data.error);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <Dialog open={open} onClose={() => navigate('/')}>
      <DialogTitle>Create New Plan</DialogTitle>
      <DialogContent>
        <TextField label="Scenario Name" value={name} onChange={(e) => setName(e.target.value)} sx={{ mt: 2, width: '100%' }} />
        <Select value={base} onChange={(e) => setBase(e.target.value)} sx={{ mt: 2, width: '100%' }} displayEmpty>
          <MenuItem value=""><em>Select Week</em></MenuItem>
          <MenuItem value="Week 45">Week 45</MenuItem>
          <MenuItem value="Week 46">Week 46</MenuItem>
          <MenuItem value="Week 47">Week 47</MenuItem>
          <MenuItem value="Week 48">Week 48</MenuItem>
          <MenuItem value="Week 49">Week 49</MenuItem>
          <MenuItem value="Week 50">Week 50</MenuItem>
          <MenuItem value="Week 51">Week 51</MenuItem>
          <MenuItem value="Week 52">Week 52</MenuItem>
        </Select>
        <TextField label="Description" multiline rows={4} value={description} onChange={(e) => setDescription(e.target.value)} sx={{ mt: 2, width: '100%' }} />
        <Button variant="contained" color="primary" onClick={handleCreate} sx={{ mt: 2 }}>Create Scenario</Button>
        <Button variant="contained" color="secondary" onClick={() => navigate('/')} sx={{ mt: 2, ml: 2 }}>Cancel</Button>
      </DialogContent>
    </Dialog>
  );
}

export default CreateScenario;