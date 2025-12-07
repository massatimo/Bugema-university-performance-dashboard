import api from './api';

const studentService = {
  async getAll() {
    const res = await api.get('/students');
    return res.data;
  },
  async getById(id) {
    const res = await api.get(`/students/${id}`);
    return res.data;
  },
  async create(payload) {
    const res = await api.post('/students', payload);
    return res.data;
  },
  async update(id, payload) {
    const res = await api.put(`/students/${id}`, payload);
    return res.data;
  },
  async remove(id) {
    const res = await api.delete(`/students/${id}`);
    return res.data;
  }
};

export default studentService;