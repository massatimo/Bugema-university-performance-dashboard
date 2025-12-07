import React, { useMemo, useRef } from 'react';
import { Container, Typography, Paper, List, ListItem, ListItemText, Button, Grid, Skeleton } from '@mui/material';
import { useStudents } from '../context/StudentContext';
import { useNotify } from '../context/NotificationContext';
import { exportElementToPdf } from '../utils/exportPdf';
import GetAppIcon from '@mui/icons-material/GetApp';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';

function toCsv(rows) {
  const header = Object.keys(rows[0] || {}).join(',');
  const lines = rows.map((r) => Object.values(r).map((v) => `"${String(v).replace(/"/g, '""')}"`).join(','));
  return [header, ...lines].join('\n');
}

export default function Reports() {
  const { students, loading } = useStudents();
  const notify = useNotify();
  const areaRef = useRef();

  const avgPerCourse = useMemo(() => {
    const map = {};
    students.forEach((s) => {
      if (!map[s.course]) map[s.course] = { total: 0, count: 0 };
      map[s.course].total += s.gpa || 0;
      map[s.course].count += 1;
    });
    return Object.entries(map).map(([course, v]) => ({ course, avgGpa: (v.total / v.count).toFixed(2), count: v.count }));
  }, [students]);

  const topPerformers = useMemo(() => students.slice().sort((a, b) => b.gpa - a.gpa).slice(0, 5), [students]);

  const atRisk = useMemo(() => students.filter((s) => s.gpa < 2.5), [students]);

  function exportCsv(rows, filename = 'report.csv') {
    if (rows.length === 0) {
      notify.show('No data to export', 'info');
      return;
    }
    const csv = toCsv(rows);
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
    notify.show('CSV exported', 'success');
  }

  async function handleExportPdf() {
    try {
      await exportElementToPdf(areaRef.current, 'reports.pdf', { orientation: 'portrait' });
      notify.show('Reports exported to PDF', 'success');
    } catch (err) {
      console.error(err);
      notify.show('PDF export failed', 'error');
    }
  }

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Reports
      </Typography>

      <Paper sx={{ p: 2, mb: 2 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs>
            <Typography variant="subtitle1">Summary</Typography>
            <Typography variant="body2" color="text.secondary">
              Quick snapshot of overall performance and report exports.
            </Typography>
          </Grid>

          <Grid item>
            <Button startIcon={<GetAppIcon />} onClick={() => exportCsv(avgPerCourse.map((r) => ({ course: r.course, avgGpa: r.avgGpa, count: r.count })), 'avg-per-course.csv')} sx={{ mr: 1 }}>
              Export CSV
            </Button>
            <Button variant="outlined" startIcon={<PictureAsPdfIcon />} onClick={handleExportPdf}>
              Export PDF
            </Button>
          </Grid>
        </Grid>
      </Paper>

      <div ref={areaRef}>
        <Paper sx={{ p: 2, mb: 2 }}>
          <Typography variant="h6">Average GPA per Course</Typography>
          {loading ? (
            <Skeleton variant="rectangular" height={120} />
          ) : (
            <List>
              {avgPerCourse.map((r) => (
                <ListItem key={r.course}>
                  <ListItemText primary={r.course} secondary={`Average GPA: ${r.avgGpa} — Students: ${r.count}`} />
                </ListItem>
              ))}
            </List>
          )}
        </Paper>

        <Paper sx={{ p: 2, mb: 2 }}>
          <Typography variant="h6">Top Performing Students</Typography>
          {loading ? (
            <Skeleton variant="rectangular" height={120} />
          ) : (
            <List>
              {topPerformers.map((s) => (
                <ListItem key={s.id}>
                  <ListItemText primary={`${s.firstName} ${s.lastName}`} secondary={`GPA: ${s.gpa}`} />
                </ListItem>
              ))}
            </List>
          )}
          <Button sx={{ mt: 1 }} onClick={() => exportCsv(topPerformers.map((s) => ({ name: `${s.firstName} ${s.lastName}`, gpa: s.gpa })), 'top-students.csv')}>
            Export Top Students CSV
          </Button>
        </Paper>

        <Paper sx={{ p: 2 }}>
          <Typography variant="h6">Students at Risk (GPA below 2.5)</Typography>
          {loading ? (
            <Skeleton variant="rectangular" height={120} />
          ) : (
            <List>
              {atRisk.map((s) => (
                <ListItem key={s.id}>
                  <ListItemText primary={`${s.firstName} ${s.lastName}`} secondary={`GPA: ${s.gpa}`} />
                </ListItem>
              ))}
            </List>
          )}
          <Button sx={{ mt: 1 }} onClick={() => exportCsv(atRisk.map((s) => ({ name: `${s.firstName} ${s.lastName}`, gpa: s.gpa })), 'at-risk.csv')}>
            Export At-Risk CSV
          </Button>
        </Paper>
      </div>
    </Container>
  );
}