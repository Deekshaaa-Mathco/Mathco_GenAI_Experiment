import React from 'react';
import { AppBar, Toolbar, Typography, Box, Button } from '@mui/material';
import { useAuth } from '../context/AuthContext';

function Header() {
  const { user, logout, isAuthenticated } = useAuth();

  return (
    <AppBar position="fixed" sx={{ borderRadius: '0 0 10px 10px', zIndex: 1300, backgroundColor: 'var(--coca-cola-black)' }}>
      <Toolbar>
        <Box sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
          <img src="/Logo.png" alt="Logo" style={{ height: '100px' }} />
        </Box>
        <Typography variant="h5" component="div" sx={{ flexGrow: 1, color: 'var(--coca-cola-white)' }}>
          <b>  Bottling System </b>
        </Typography>
        {isAuthenticated && (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography variant="body1" sx={{ mr: 2, color: 'var(--coca-cola-white)' }}>
              Welcome, {user?.username}
            </Typography>
            <Button color="inherit" onClick={logout}>
              Logout
            </Button>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
}

export default Header;
