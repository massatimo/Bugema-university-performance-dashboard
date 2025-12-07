import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Grid,
  MenuItem
} from '@mui/material';

const statuses = ['active', 'probation', 'graduated'];

export default function StudentFormModal({ open, onClose, onSave, initial }) {
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    studentId: '',
    course: '',
    gpa: 0,
    status: 'active',
    email: '',
    phone: ''
  });

  useEffect(() => {
    if (initial) setForm({ ...initial });
    else
      setForm({
        firstName: '',
        lastName: '',
        studentId: '',
        course: '',
        gpa: 0,
        status: 'active',
        email: '',
        phone: ''
      });
  }, [initial]);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: name === 'gpa' ? parseFloat(value) : value }));
  }

  function submit() {
    if (!form.firstName || !form.lastName || !form.studentId) {
      alert('Please fill first name, last name and student ID');
      return;
    }
    onSave(form);
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{initial ? 'Edit Student' : 'Add Student'}</DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12} sm={6}>
            <TextField label="First Name" name="firstName" value={form.firstName} onChange={handleChange} fullWidth />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField label="Last Name" name="lastName" value={form.lastName} onChange={handleChange} fullWidth />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField label="Student ID" name="studentId" value={form.studentId} onChange={handleChange} fullWidth />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField label="Course" name="course" value={form.course} onChange={handleChange} fullWidth />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField label="GPA" name="gpa" type="number" inputProps={{ step: 0.1, min: 0, max: 4 }} value={form.gpa} onChange={handleChange} fullWidth />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField select label="Status" name="status" value={form.status} onChange={handleChange} fullWidth>
              {statuses.map((s) => (
                <MenuItem value={s} key={s}>
                  {s}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField label="Email" name="email" value={form.email} onChange={handleChange} fullWidth />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField label="Phone" name="phone" value={form.phone} onChange={handleChange} fullWidth />
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={submit} variant="contained">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}