import React, { createContext, useContext, useEffect, useState } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem('bu_user');
    return raw ? JSON.parse(raw) : null;
  });

  useEffect(() => {
    if (user) localStorage.setItem('bu_user', JSON.stringify(user));
    else localStorage.removeItem('bu_user');
  }, [user]);

  async function login({ username, password }) {
    try {
      const res = await api.get('/users', { params: { username, password } });
      const found = res.data[0];
      if (found) {
        const u = { id: found.id, username: found.username, name: found.name, role: found.role };
        setUser(u);
        return { ok: true, user: u };
      }
      return { ok: false, message: 'Invalid credentials' };
    } catch (err) {
      return { ok: false, message: err.message || 'Login failed' };
    }
  }

  function logout() {
    setUser(null);
  }

  return <AuthContext.Provider value={{ user, login, logout }}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);