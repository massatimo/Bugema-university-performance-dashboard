import React, { useState } from 'react';
import { Container, Typography, Button, Box } from '@mui/material';
import StudentTable from '../components/StudentTable';
import StudentFormModal from '../components/StudentFormModal';
import { useStudents } from '../context/StudentContext';
import { useNavigate } from 'react-router-dom';
import ConfirmDialog from '../components/ConfirmDialog';
import { useNotify } from '../context/NotificationContext';

export default function Students() {
  const { students, addStudent, updateStudent, deleteStudent } = useStudents();
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const navigate = useNavigate();
  const notify = useNotify();
  const [confirm, setConfirm] = useState({ open: false, target: null });

  function handleView(s) {
    navigate(`/students/${s.id}`);
  }

  function handleEdit(s) {
    setEditing(s);
    setModalOpen(true);
  }

  function handleDeleteRequest(s) {
    setConfirm({ open: true, target: s });
  }

  async function handleDeleteConfirm() {
    const s = confirm.target;
    try {
      await deleteStudent(s.id);
      notify.show('Student deleted', 'success');
    } catch (err) {
      notify.show('Delete failed', 'error');
    } finally {
      setConfirm({ open: false, target: null });
    }
  }

  async function handleSave(data) {
    try {
      if (editing) {
        await updateStudent(editing.id, { ...editing, ...data });
        notify.show('Student updated', 'success');
        setEditing(null);
      } else {
        await addStudent({ ...data, courses: [], gpaHistory: [data.gpa] });
        notify.show('Student added', 'success');
      }
      setModalOpen(false);
    } catch (err) {
      notify.show('Save failed', 'error');
    }
  }

  return (
    <Container sx={{ mt: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h4">Students</Typography>
        <Button variant="contained" onClick={() => setModalOpen(true)}>
          Add Student
        </Button>
      </Box>

      <StudentTable students={students} onView={(s) => handleView(s)} onEdit={(s) => handleEdit(s)} onDelete={(s) => handleDeleteRequest(s)} />

      <StudentFormModal open={modalOpen} onClose={() => { setModalOpen(false); setEditing(null); }} initial={editing} onSave={handleSave} />

      <ConfirmDialog
        open={confirm.open}
        title="Delete student"
        description={`Are you sure you want to delete ${confirm.target ? `${confirm.target.firstName} ${confirm.target.lastName}` : ''}? This action cannot be undone.`}
        onClose={() => setConfirm({ open: false, target: null })}
        onConfirm={handleDeleteConfirm}
      />
    </Container>
  );
}