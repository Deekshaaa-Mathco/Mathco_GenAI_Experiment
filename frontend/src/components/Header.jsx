import React from 'react';
import { AppBar, Toolbar, Typography, Box, Button } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import { useAuth } from '../context/AuthContext';

function Header() {
  const { user, logout, isAuthenticated } = useAuth();

  return (
    <AppBar 
      position="fixed" 
      sx={{ 
        borderRadius: '0 0 10px 10px', 
        zIndex: 1300, 
        backgroundColor: 'var(--coca-cola-black)',
        // ← FIX: REMOVE WHITE BORDER!
        boxShadow: 'none !important',           // NO SHADOW
        borderBottom: 'none !important'         // NO BORDER
      }}
    >
      <Toolbar sx={{ 
        // ← ALSO FIX TOOLBAR PADDING
        px: 2, 
        minHeight: '80px' 
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
          <img src="/logo.png" alt="Logo" style={{ height: '100px' }} />
        </Box>
        <Typography 
          variant="h5" 
          component="div" 
          sx={{ 
            flexGrow: 1, 
            color: 'var(--coca-cola-white)',
            fontWeight: 700
          }}
        >
          Bottling System
        </Typography>
        {isAuthenticated && (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <PersonIcon sx={{ mr: 1, color: 'var(--coca-cola-white)' }} />
            <Typography variant="h6" sx={{ mr: 2, color: 'var(--coca-cola-white)' }}>
              Welcome, {user?.username}
            </Typography>
            <Button 
              color="inherit" 
              onClick={logout}
              sx={{ 
                color: 'var(--coca-cola-white)',
                '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)' }
              }}
            >
              Logout
            </Button>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
}

export default Header;