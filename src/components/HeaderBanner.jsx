import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import watermark from '../assets/bg.svg';
import logo from '../assets/logo.svg';

export default function HeaderBanner() {
  return (
    <Box
      className="header-banner"
      sx={{
        backgroundColor: 'transparent'
      }}
    >
      {/* Watermark (SVG) placed absolutely via CSS class; imported URL used in img */}
      <img src={watermark} alt="watermark" className="header-banner__watermark" />

      <Box sx={{ textAlign: 'center' }}>
        <img src={logo} alt="logo" style={{ height: 48, display: 'block', margin: '0 auto 6px' }} />
        <Typography variant="h3" component="div" className="header-banner__title" sx={{ color: 'text.primary' }}>
          BUGEMA UNIVERSITY
        </Typography>
        <Typography className="header-banner__sub">Student Performance Dashboard</Typography>
      </Box>
    </Box>
  );
}