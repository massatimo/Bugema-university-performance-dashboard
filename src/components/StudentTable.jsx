import React, { useMemo, useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TableSortLabel,
  TablePagination,
  TextField,
  MenuItem,
  IconButton
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

export default function StudentTable({ students, onView, onEdit, onDelete }) {
  const [orderBy, setOrderBy] = useState('lastName');
  const [order, setOrder] = useState('asc');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [query, setQuery] = useState('');
  const [filterCourse, setFilterCourse] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  const courses = useMemo(() => Array.from(new Set(students.map((s) => s.course))), [students]);
  const statuses = useMemo(() => Array.from(new Set(students.map((s) => s.status))), [students]);

  function handleSort(field) {
    const isAsc = orderBy === field && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(field);
  }

  const filtered = useMemo(() => {
    let data = students.slice();
    if (query) {
      const q = query.toLowerCase();
      data = data.filter((s) => `${s.firstName} ${s.lastName}`.toLowerCase().includes(q) || s.studentId.toLowerCase().includes(q));
    }
    if (filterCourse) data = data.filter((s) => s.course === filterCourse);
    if (filterStatus) data = data.filter((s) => s.status === filterStatus);

    data.sort((a, b) => {
      const aKey = orderBy === 'gpa' ? a.gpa : `${a.lastName} ${a.firstName}`;
      const bKey = orderBy === 'gpa' ? b.gpa : `${b.lastName} ${b.firstName}`;
      if (aKey < bKey) return order === 'asc' ? -1 : 1;
      if (aKey > bKey) return order === 'asc' ? 1 : -1;
      return 0;
    });

    return data;
  }, [students, query, filterCourse, filterStatus, order, orderBy]);

  const paged = useMemo(() => filtered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage), [filtered, page, rowsPerPage]);

  return (
    <Paper sx={{ padding: 2 }}>
      <div style={{ display: 'flex', gap: 8, marginBottom: 12, flexWrap: 'wrap' }}>
        <TextField label="Search (name or ID)" value={query} onChange={(e) => setQuery(e.target.value)} size="small" />
        <TextField select label="Course" value={filterCourse} onChange={(e) => setFilterCourse(e.target.value)} size="small">
          <MenuItem value="">All</MenuItem>
          {courses.map((c) => (
            <MenuItem key={c} value={c}>
              {c}
            </MenuItem>
          ))}
        </TextField>
        <TextField select label="Status" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} size="small">
          <MenuItem value="">All</MenuItem>
          {statuses.map((s) => (
            <MenuItem key={s} value={s}>
              {s}
            </MenuItem>
          ))}
        </TextField>
      </div>

      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <TableSortLabel active={orderBy !== 'gpa'} direction={order} onClick={() => handleSort('lastName')}>
                  Name
                </TableSortLabel>
              </TableCell>
              <TableCell>ID</TableCell>
              <TableCell>Course</TableCell>
              <TableCell align="right">
                <TableSortLabel active={orderBy === 'gpa'} direction={order} onClick={() => handleSort('gpa')}>
                  GPA
                </TableSortLabel>
              </TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {paged.map((s) => (
              <TableRow key={s.id}>
                <TableCell>{`${s.firstName} ${s.lastName}`}</TableCell>
                <TableCell>{s.studentId}</TableCell>
                <TableCell>{s.course}</TableCell>
                <TableCell align="right">{(s.gpa || 0).toFixed(2)}</TableCell>
                <TableCell>{s.status}</TableCell>
                <TableCell>
                  <IconButton onClick={() => onView(s)} size="small" title="View">
                    <VisibilityIcon />
                  </IconButton>
                  <IconButton onClick={() => onEdit(s)} size="small" title="Edit">
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => onDelete(s)} size="small" title="Delete">
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}

            {paged.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  No records found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        component="div"
        count={filtered.length}
        page={page}
        onPageChange={(e, p) => setPage(p)}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={(e) => {
          setRowsPerPage(parseInt(e.target.value, 10));
          setPage(0);
        }}
      />
    </Paper>
  );
}