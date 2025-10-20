import React from 'react';
import { Drawer, List, ListItem, ListItemButton, ListItemText, Button, Box } from '@mui/material';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Sidebar() {
  const { logout } = useAuth();

  return (
    <Drawer variant="permanent" sx={{ width: 240, flexShrink: 0, '& .MuiDrawer-paper': { width: 240, boxSizing: 'border-box', mt: '90px', backgroundColor: '#000000', color: '#FFFFFF', display: 'flex', flexDirection: 'column', height: 'calc(100vh - 90px)' } }}>
      <List sx={{ flexGrow: 1 }}>
        <ListItem disablePadding>
          <ListItemButton component={Link} to="/" sx={{ backgroundColor: '#000000', '&:hover': { backgroundColor: '#333333' } }}>
            <ListItemText primary="Dashboard" primaryTypographyProps={{ fontSize: '1.2rem' }} />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton component={Link} to="/demand-review" sx={{ backgroundColor: '#000000', '&:hover': { transform: 'scale(1.05)', backgroundColor: '#333333' }, transition: 'transform 0.2s' }}>
            <ListItemText primary="Demand Plan" primaryTypographyProps={{ fontSize: '1.2rem' }} />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton component={Link} to="/supply-planning" sx={{ backgroundColor: '#000000', '&:hover': { transform: 'scale(1.05)', backgroundColor: '#333333' }, transition: 'transform 0.2s' }}>
            <ListItemText primary="Supply Planning" primaryTypographyProps={{ fontSize: '1.2rem' }} />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton component={Link} to="/master-configurator" sx={{ backgroundColor: '#000000', '&:hover': { transform: 'scale(1.05)', backgroundColor: '#333333' }, transition: 'transform 0.2s' }}>
            <ListItemText primary="Master Configurator" primaryTypographyProps={{ fontSize: '1.2rem' }} />
          </ListItemButton>
        </ListItem>
      </List>
      <Box sx={{ p: 2 }}>
        <Button
          onClick={logout}
          fullWidth
          sx={{
            backgroundColor: '#FF0000',
            color: 'white',
            '&:hover': { backgroundColor: '#CC0000' },
          }}
        >
          Logout
        </Button>
      </Box>
    </Drawer>
  );
}

export default Sidebar;