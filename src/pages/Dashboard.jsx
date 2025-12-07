import React, { useMemo, useRef } from 'react';
import { Container, Typography, Grid, Paper, Button, Box, Skeleton } from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import { useStudents } from '../context/StudentContext';
import { Line, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend, BarElement } from 'chart.js';
import { exportElementToPdf } from '../utils/exportPdf';
import { useNotify } from '../context/NotificationContext';

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend, BarElement);

export default function Dashboard() {
  const { students, loading, fetchStudents } = useStudents();
  const notify = useNotify();
  const reportRef = useRef();

  const totalStudents = students.length;
  const avgGpa = students.length ? (students.reduce((s, x) => s + (x.gpa || 0), 0) / students.length).toFixed(2) : '--';
  const atRiskCount = students.filter((s) => s.gpa < 2.5).length;
  const topCount = students.slice().sort((a, b) => b.gpa - a.gpa).slice(0, 3).length;

  const gpaBins = useMemo(() => {
    const bins = [0, 0, 0, 0];
    students.forEach((s) => {
      const g = s.gpa || 0;
      if (g < 1) bins[0] += 1;
      else if (g < 2) bins[1] += 1;
      else if (g < 3) bins[2] += 1;
      else bins[3] += 1;
    });
    return bins;
  }, [students]);

  const avgByTerm = useMemo(() => {
    const map = {};
    students.forEach((s) => {
      (s.gpaHistory || []).forEach((g, idx) => {
        map[idx] = map[idx] || { total: 0, count: 0 };
        map[idx].total += g;
        map[idx].count += 1;
      });
    });

    const labels = Object.keys(map)
      .sort((a, b) => a - b)
      .map((k) => `Term ${parseInt(k, 10) + 1}`);
    const data = labels.map((_, idx) => {
      const v = map[idx];
      return v ? Number((v.total / v.count).toFixed(2)) : 0;
    });

    return { labels, data };
  }, [students]);

  const barData = { labels: ['0-1', '1-2', '2-3', '3-4'], datasets: [{ label: 'Students', data: gpaBins, backgroundColor: ['#f44336', '#ff9800', '#ffeb3b', '#4caf50'] }] };

  const lineData = { labels: avgByTerm.labels, datasets: [{ label: 'Average GPA', data: avgByTerm.data, borderColor: '#1976d2', backgroundColor: 'rgba(25,118,210,0.15)', tension: 0.3, fill: true }] };

  async function handleExportPdf() {
    try {
      await exportElementToPdf(reportRef.current, 'dashboard-report.pdf');
      notify.show('Exported dashboard to PDF', 'success');
    } catch (err) {
      console.error(err);
      notify.show('PDF export failed', 'error');
    }
  }

  return (
    <Container sx={{ mt: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h4">Dashboard</Typography>
        <Box>
          <Button startIcon={<RefreshIcon />} onClick={fetchStudents} sx={{ mr: 1 }}>
            Refresh
          </Button>
          <Button variant="outlined" startIcon={<PictureAsPdfIcon />} onClick={handleExportPdf}>
            Export PDF
          </Button>
        </Box>
      </Box>

      <div ref={reportRef}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={3}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="subtitle2">Total Students</Typography>
              {loading ? <Skeleton variant="text" width={80} /> : <Typography variant="h5">{totalStudents}</Typography>}
            </Paper>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="subtitle2">Average GPA</Typography>
              {loading ? <Skeleton variant="text" width={80} /> : <Typography variant="h5">{avgGpa}</Typography>}
            </Paper>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="subtitle2">Top Performers</Typography>
              {loading ? <Skeleton variant="text" width={80} /> : <Typography variant="h5">{topCount}</Typography>}
            </Paper>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="subtitle2">Students at Risk</Typography>
              {loading ? <Skeleton variant="text" width={80} /> : <Typography variant="h5">{atRiskCount}</Typography>}
            </Paper>
          </Grid>

          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="subtitle1">GPA Distribution</Typography>
              {loading ? <Skeleton variant="rectangular" height={200} /> : <Bar data={barData} options={{ animation: { duration: 800 } }} />}
            </Paper>
          </Grid>

          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="subtitle1">Average GPA by Term</Typography>
              {loading ? <Skeleton variant="rectangular" height={200} /> : <Line data={lineData} options={{ animation: { duration: 1000 } }} />}
            </Paper>
          </Grid>
        </Grid>
      </div>
    </Container>
  );
}