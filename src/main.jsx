import './styles.css'; // <- add this line (global font & banner styles)

import React from 'react';
import { createRoot } from 'react-dom/client';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import App from './App';
import { AuthProvider } from './context/AuthContext';
import { StudentProvider } from './context/StudentContext';
import { ThemeProviderCustom } from './context/ThemeContext';
import { NotificationProvider } from './context/NotificationContext';
import createMuiTheme from '@mui/material/styles/createTheme';
import { useThemeContext } from './context/ThemeContext';

// wrapper to use ThemeContext to create MUI theme dynamically
function ThemeWrapper({ children }) {
  const { mode } = useThemeContext();
  const muiTheme = createMuiTheme({ palette: { mode }, typography: { fontFamily: "'Poppins', sans-serif" } });
  return (
    <ThemeProvider theme={muiTheme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}

function Providers() {
  return (
    <ThemeProviderCustom>
      <ThemeWrapper>
        <AuthProvider>
          <StudentProvider>
            <NotificationProvider>
              <App />
            </NotificationProvider>
          </StudentProvider>
        </AuthProvider>
      </ThemeWrapper>
    </ThemeProviderCustom>
  );
}

const root = createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Providers />
  </React.StrictMode>
);