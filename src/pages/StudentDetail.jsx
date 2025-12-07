import React, { useEffect, useState, useRef } from 'react';
import { Container, Typography, Paper, Grid, List, ListItem, ListItemText, Button, Box, Avatar, Skeleton } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import studentService from '../services/studentService';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend } from 'chart.js';
import EditIcon from '@mui/icons-material/Edit';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import { exportElementToPdf } from '../utils/exportPdf';
import { useNotify } from '../context/NotificationContext';

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend);

export default function StudentDetail() {
  const { id } = useParams();
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const areaRef = useRef();
  const navigate = useNavigate();
  const notify = useNotify();

  useEffect(() => {
    setLoading(true);
    studentService
      .getById(id)
      .then((res) => setStudent(res))
      .catch(() => setStudent(null))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading)
    return (
      <Container sx={{ mt: 4 }}>
        <Skeleton variant="text" width={240} height={40} />
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 2 }}>
              <Skeleton variant="circular" width={64} height={64} />
              <Skeleton variant="text" />
              <Skeleton variant="text" />
            </Paper>
          </Grid>
          <Grid item xs={12} md={8}>
            <Paper sx={{ p: 2 }}>
              <Skeleton variant="rectangular" height={240} />
            </Paper>
          </Grid>
        </Grid>
      </Container>
    );
  if (!student) return <Container sx={{ mt: 4 }}>Not found</Container>;

  const labels = student.gpaHistory?.map((_, idx) => `Term ${idx + 1}`) || [];
  const data = { labels, datasets: [{ label: 'GPA', data: student.gpaHistory || [], borderColor: '#1976d2', backgroundColor: 'rgba(25,118,210,0.2)', tension: 0.3, fill: true }] };

  async function handleExportPdf() {
    try {
      await exportElementToPdf(areaRef.current, `${student.firstName}_${student.lastName}_profile.pdf`);
      notify.show('Student profile exported to PDF', 'success');
    } catch (err) {
      console.error(err);
      notify.show('PDF export failed', 'error');
    }
  }

  return (
    <Container sx={{ mt: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h4">
          {student.firstName} {student.lastName}
        </Typography>
        <Box>
          <Button startIcon={<EditIcon />} sx={{ mr: 1 }} onClick={() => navigate(`/students`, { state: { editId: student.id } })}>
            Edit
          </Button>
          <Button variant="outlined" startIcon={<PictureAsPdfIcon />} onClick={handleExportPdf}>
            Export Profile PDF
          </Button>
        </Box>
      </Box>

      <div ref={areaRef}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 2 }}>
              <Box display="flex" flexDirection="column" alignItems="center" gap={1}>
                <Avatar sx={{ width: 80, height: 80 }}>{student.firstName[0]}</Avatar>
                <Typography variant="h6">
                  {student.firstName} {student.lastName}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {student.studentId}
                </Typography>
              </Box>

              <List>
                <ListItem>
                  <ListItemText primary="Course" secondary={student.course} />
                </ListItem>
                <ListItem>
                  <ListItemText primary="GPA" secondary={student.gpa} />
                </ListItem>
                <ListItem>
                  <ListItemText primary="Status" secondary={student.status} />
                </ListItem>
                <ListItem>
                  <ListItemText primary="Email" secondary={student.email} />
                </ListItem>
                <ListItem>
                  <ListItemText primary="Phone" secondary={student.phone} />
                </ListItem>
              </List>
            </Paper>
          </Grid>

          <Grid item xs={12} md={8}>
            <Paper sx={{ p: 2, mb: 2 }}>
              <Typography variant="subtitle1">GPA Trend</Typography>
              <Line data={data} options={{ animation: { duration: 900 } }} />
            </Paper>

            <Paper sx={{ p: 2 }}>
              <Typography variant="subtitle1">Courses & Grades</Typography>
              <List>
                {student.courses?.map((c) => (
                  <ListItem key={c.code}>
                    <ListItemText primary={`${c.code} — ${c.name}`} secondary={`Grade: ${c.grade}`} />
                  </ListItem>
                ))}
              </List>
            </Paper>
          </Grid>
        </Grid>
      </div>
    </Container>
  );
}