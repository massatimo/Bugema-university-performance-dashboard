import React, { useEffect, useState } from 'react';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Avatar,
  Checkbox,
  FormControlLabel,
  Link
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import logoUrl from '../assets/logo.svg';

export default function Login() {
  const [form, setForm] = useState({ username: '', password: '' });
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  // load saved username if user chose "remember me"
  useEffect(() => {
    try {
      const saved = localStorage.getItem('bu_remember_username');
      if (saved) {
        setForm((f) => ({ ...f, username: saved }));
        setRemember(true);
      }
    } catch {
      // ignore
    }
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    const res = await login(form);
    setLoading(false);
    if (res.ok) {
      // persist username if checked
      try {
        if (remember) localStorage.setItem('bu_remember_username', form.username);
        else localStorage.removeItem('bu_remember_username');
      } catch {}
      navigate('/dashboard');
    } else {
      alert(res.message || 'Login failed');
    }
  }

  function handleForgot() {
    // simple flow for demo - you could open a dialog instead
    alert('Forgot password? Please contact the IT department at itsupport@bugema.ac.ug');
  }

  return (
    <Box className="login-container">
      <Container maxWidth="sm">
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Avatar src={logoUrl} alt="Bugema logo" sx={{ width: 110, height: 110, margin: '0 auto' }} />
          <Typography className="login-title" component="h1" gutterBottom>
            BUGEMA UNIVERSITY
          </Typography>
          <Typography className="login-subtitle" color="text.secondary">
            Student Performance Dashboard — Staff Login
          </Typography>
        </Box>

        <Paper className="login-card" elevation={8} sx={{ p: 5 }}>
          <Box component="form" onSubmit={handleSubmit} sx={{ display: 'grid', gap: 2 }}>
            <TextField
              label="Username"
              name="username"
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
              fullWidth
              required
              inputProps={{ style: { fontSize: 16 } }}
            />
            <TextField
              label="Password"
              type="password"
              name="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              fullWidth
              required
              inputProps={{ style: { fontSize: 16 } }}
            />

            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <FormControlLabel
                control={<Checkbox checked={remember} onChange={(e) => setRemember(e.target.checked)} color="primary" />}
                label={<Typography sx={{ fontSize: 14 }}>Remember me</Typography>}
              />
              <Link component="button" variant="body2" onClick={handleForgot}>
                Forgot password?
              </Link>
            </Box>

            <Button type="submit" variant="contained" disabled={loading} fullWidth sx={{ py: 1.5, fontSize: 16 }}>
              {loading ? 'Logging in...' : 'Login'}
            </Button>
          </Box>
        </Paper>

        <Typography className="login-footer" align="center" sx={{ mt: 3 }}>
          Developed by Masai Timothy — Bugema University
        </Typography>
      </Container>
    </Box>
  );
}