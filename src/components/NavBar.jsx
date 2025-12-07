import React from 'react';
import { AppBar, Toolbar, IconButton, Typography, Box, InputBase, Avatar, Menu, MenuItem } from '@mui/material';
import { styled, alpha } from '@mui/material/styles';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import AccountCircle from '@mui/icons-material/AccountCircle';
import { useThemeContext } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import logoUrl from '../assets/logo.svg';

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  display: 'flex',
  alignItems: 'center',
  height: 40,
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.action.hover, 0.06),
  '&:hover': { backgroundColor: alpha(theme.palette.action.hover, 0.08) },
  marginLeft: 0,
  width: '100%',
  maxWidth: 420,
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(1)
  }
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 1),
  height: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  paddingLeft: theme.spacing(1),
  width: '100%'
}));

export default function NavBar({ onOpenSidebar }) {
  const { mode, toggleTheme } = useThemeContext();
  const { user, logout } = useAuth();
  const [anchor, setAnchor] = React.useState(null);

  function handleMenuOpen(e) {
    setAnchor(e.currentTarget);
  }
  function handleMenuClose() {
    setAnchor(null);
  }
  function handleLogout() {
    handleMenuClose();
    logout();
  }

  return (
    <AppBar
      position="fixed"
      color="primary"
      elevation={1}
      sx={{
        zIndex: (theme) => theme.zIndex.drawer + 1
      }}
    >
      <Toolbar>
        <IconButton edge="start" color="inherit" onClick={onOpenSidebar} sx={{ mr: 1 }}>
          <MenuIcon />
        </IconButton>

        {/* Logo */}
        <Box component="img" src={logoUrl} alt="Bugema logo" sx={{ height: 40, mr: 1 }} />

        <Typography variant="h6" noWrap component="div" sx={{ display: { xs: 'none', sm: 'block' }, mr: 2 }}>
          Bugema University
        </Typography>

        <Search sx={{ flexGrow: { xs: 1, sm: 0 } }}>
          <SearchIconWrapper>
            <SearchIcon />
          </SearchIconWrapper>
          <StyledInputBase placeholder="Search students…" inputProps={{ 'aria-label': 'search' }} />
        </Search>

        <Box sx={{ flexGrow: 1 }} />

        <IconButton color="inherit" onClick={toggleTheme} sx={{ ml: 1 }}>
          {mode === 'light' ? <Brightness4Icon /> : <Brightness7Icon />}
        </IconButton>

        <IconButton size="large" color="inherit" onClick={handleMenuOpen} sx={{ ml: 1 }}>
          {user?.name ? <Avatar sx={{ width: 32, height: 32 }}>{user.name[0]}</Avatar> : <AccountCircle />}
        </IconButton>

        <Menu anchorEl={anchor} open={Boolean(anchor)} onClose={handleMenuClose}>
          <MenuItem onClick={handleMenuClose}>Profile</MenuItem>
          <MenuItem
            onClick={() => {
              handleMenuClose();
              handleLogout();
            }}
          >
            Logout
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
}