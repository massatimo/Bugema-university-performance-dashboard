import React, { useState } from 'react';
import { Box, Toolbar } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import NavBar from './NavBar';
import Sidebar from './Sidebar';
import HeaderBanner from './HeaderBanner';

const drawerWidth = 240;

export default function Layout({ children }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const theme = useTheme();

  function handleOpenSidebar() {
    setMobileOpen(true);
  }
  function handleCloseSidebar() {
    setMobileOpen(false);
  }

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: theme.palette.background.default }}>
      <NavBar onOpenSidebar={handleOpenSidebar} />
      <Sidebar mobileOpen={mobileOpen} onClose={handleCloseSidebar} width={drawerWidth} />

      {/* main content: add left margin on sm+ screens so drawer doesn't overlap */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          ml: { sm: `${drawerWidth}px` } // reserve space on larger screens
        }}
      >
        <Toolbar />
        {/* Big heading banner */}
        <HeaderBanner />

        {/* Page content */}
        {children}

        {/* Footer */}
        <Box className="app-footer">
          Developed by Masai Timothy — Bugema University
        </Box>
      </Box>
    </Box>
  );
}