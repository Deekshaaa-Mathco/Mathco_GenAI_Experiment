import React, { useState } from 'react';
import { TextField, Button, Paper, Typography, Box, Alert } from '@mui/material';
import { Link } from 'react-router-dom';

import { useAuth } from '../context/AuthContext';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      await login(username, password);
    } catch (err) {
      setError('Invalid credentials');
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        backgroundColor: 'var(--coca-cola-white)',
      }}
    >
      <Paper elevation={3} sx={{ p: 4, width: '100%', maxWidth: 400 }}>
        {/* <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
          <img src="/logo.png" alt="Coca-Cola Logo" style={{ height: '60px' }} />
        </Box> */}
        <Typography variant="h4" component="h1" gutterBottom align="center" sx={{ color: 'var(--coca-cola-black)' }}>
          Login
        </Typography>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="username"
            label="Username"
            name="username"
            autoComplete="username"
            autoFocus
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            sx={{ '& .MuiInputBase-input': { color: 'black' } }}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            sx={{ '& .MuiInputBase-input': { color: 'black' } }}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2, backgroundColor: 'var(--coca-cola-red)', color: 'var(--coca-cola-white)' }}
          >
            Sign In
          </Button>
          <Box sx={{ textAlign: 'center' }}>
            <Link to="/register">
              Don't have an account? Register here
            </Link>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
}

export default Login;
