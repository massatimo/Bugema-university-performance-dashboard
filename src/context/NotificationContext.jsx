import React, { createContext, useContext, useState } from 'react';
import { Snackbar, Alert } from '@mui/material';

const NotificationContext = createContext();

export function NotificationProvider({ children }) {
  const [notif, setNotif] = useState({ open: false, message: '', severity: 'info' });

  function show(message, severity = 'info') {
    setNotif({ open: true, message, severity });
  }

  function close() {
    setNotif((n) => ({ ...n, open: false }));
  }

  return (
    <NotificationContext.Provider value={{ show }}>
      {children}
      <Snackbar open={notif.open} autoHideDuration={3500} onClose={close} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
        <Alert onClose={close} severity={notif.severity} sx={{ width: '100%' }}>
          {notif.message}
        </Alert>
      </Snackbar>
    </NotificationContext.Provider>
  );
}

export const useNotify = () => useContext(NotificationContext);