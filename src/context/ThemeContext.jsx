import React, { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext();

export function ThemeProviderCustom({ children }) {
  const [mode, setMode] = useState(() => {
    try {
      const raw = localStorage.getItem('bu_theme');
      return raw || 'light';
    } catch {
      return 'light';
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('bu_theme', mode);
    } catch {}
  }, [mode]);

  function toggleTheme() {
    setMode((m) => (m === 'light' ? 'dark' : 'light'));
  }

  return <ThemeContext.Provider value={{ mode, toggleTheme }}>{children}</ThemeContext.Provider>;
}

export const useThemeContext = () => useContext(ThemeContext);