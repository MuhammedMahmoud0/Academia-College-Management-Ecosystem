import axios from 'axios';

const BASE_URL = '/api/v1';

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

const getAuthHeaders = () => {
  const token = localStorage.getItem('auth_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// GET /departments — List all departments (optional name search)
export const getAllDepartments = async (search = '') => {
  const response = await api.get('/departments', {
    headers: getAuthHeaders(),
    params: search ? { search } : {},
  });
  return response.data; // { departments: [...] }
};

// GET /departments/:id — Get a department by ID
export const getDepartmentById = async (id) => {
  const response = await api.get(`/departments/${id}`, {
    headers: getAuthHeaders(),
  });
  return response.data; // { department_id, name, count: { courses, student_profiles } }
};

// POST /departments — Create a department  { name }
export const createDepartment = async (name) => {
  const response = await api.post('/departments', { name }, {
    headers: getAuthHeaders(),
  });
  return response.data; // { department_id, name }
};

// PATCH /departments/:id — Update a department  { name }
export const updateDepartment = async (id, name) => {
  const response = await api.patch(`/departments/${id}`, { name }, {
    headers: getAuthHeaders(),
  });
  return response.data; // { department_id, name }
};

// DELETE /departments/:id — Delete a department
export const deleteDepartment = async (id) => {
  const response = await api.delete(`/departments/${id}`, {
    headers: getAuthHeaders(),
  });
  return response.data; // { message: "Department deleted successfully" }
};
