import React from 'react';
import { Drawer, List, ListItemButton, ListItemText, Toolbar, Divider, Box } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';

const drawerWidth = 240;

const navItems = [
  { label: 'Dashboard', to: '/dashboard' },
  { label: 'Students', to: '/students' },
  { label: 'Reports', to: '/reports' }
];

export default function Sidebar({ mobileOpen, onClose, width = drawerWidth }) {
  const navigate = useNavigate();
  const location = useLocation();

  const drawerContent = (
    <div>
      <Toolbar />
      <Divider />
      <List>
        {navItems.map((item) => (
          <ListItemButton
            key={item.to}
            selected={location.pathname === item.to}
            onClick={() => {
              navigate(item.to);
              if (onClose) onClose();
            }}
          >
            <ListItemText primary={item.label} />
          </ListItemButton>
        ))}
      </List>
      <Box sx={{ p: 2, mt: 'auto' }}>
        <small style={{ color: 'gray' }}>Developed By Masai T</small>
      </Box>
    </div>
  );

  return (
    <>
      {/* Mobile drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={onClose}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', sm: 'none' },
          '& .MuiDrawer-paper': { width }
        }}
      >
        {drawerContent}
      </Drawer>

      {/* Desktop drawer */
      }
      <Drawer
        variant="permanent"
        open
        sx={{
          display: { xs: 'none', sm: 'block' },
          '& .MuiDrawer-paper': {
            width,
            boxSizing: 'border-box'
          }
        }}
      >
        {drawerContent}
      </Drawer>
    </>
  );
}