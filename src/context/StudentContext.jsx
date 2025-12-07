import React, { createContext, useContext, useEffect, useState } from 'react';
import studentService from '../services/studentService';

const StudentContext = createContext();

export function StudentProvider({ children }) {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function fetchStudents() {
    setLoading(true);
    setError(null);
    try {
      const data = await studentService.getAll();
      setStudents(data);
    } catch (err) {
      setError(err.message || 'Failed to load students');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchStudents();
  }, []);

  async function addStudent(payload) {
    const created = await studentService.create(payload);
    setStudents((s) => [created, ...s]);
    return created;
  }

  async function updateStudent(id, payload) {
    const updated = await studentService.update(id, payload);
    setStudents((s) => s.map((st) => (st.id === updated.id ? updated : st)));
    return updated;
  }

  async function deleteStudent(id) {
    await studentService.remove(id);
    setStudents((s) => s.filter((st) => st.id !== id));
  }

  return (
    <StudentContext.Provider value={{ students, loading, error, fetchStudents, addStudent, updateStudent, deleteStudent }}>
      {children}
    </StudentContext.Provider>
  );
}

export const useStudents = () => useContext(StudentContext);