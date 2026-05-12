import apiClient from './apiClient';

// GET /departments — List all departments (optional name search)
export const getAllDepartments = async (search = '') => {
  const response = await apiClient.get('/departments', {
    params: search ? { search } : {},
  });
  return response.data; // { departments: [...] }
};

// GET /departments/:id — Get a department by ID
export const getDepartmentById = async (id) => {
  const response = await apiClient.get(`/departments/${id}`);
  return response.data; // { department_id, name, count: { courses, student_profiles } }
};

// POST /departments — Create a department  { name }
export const createDepartment = async (name) => {
  const response = await apiClient.post('/departments', { name });
  return response.data; // { department_id, name }
};

// PATCH /departments/:id — Update a department  { name }
export const updateDepartment = async (id, name) => {
  const response = await apiClient.patch(`/departments/${id}`, { name });
  return response.data; // { department_id, name }
};

// DELETE /departments/:id — Delete a department
export const deleteDepartment = async (id) => {
  const response = await apiClient.delete(`/departments/${id}`);
  return response.data; // { message: "Department deleted successfully" }
};
