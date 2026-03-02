import axios from 'axios';

const BASE_URL = import.meta.env.DEV
  ? '/api/v1'
  : import.meta.env.VITE_API_URL;

const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

const getAuthHeaders = () => {
  const token = localStorage.getItem('auth_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// GET /course-offerings
export const getAllOfferings = async () => {
  const response = await api.get('/course-offerings', {
    headers: getAuthHeaders(),
  });
  return response.data; // { success, count, data: [...] }
};

// POST /course-offerings
export const createOffering = async (payload) => {
  // payload: { course_code, semester, year }
  const response = await api.post('/course-offerings', payload, {
    headers: getAuthHeaders(),
  });
  return response.data; // { success, message, data: { offering_id, ... } }
};

// PUT /course-offerings/{offering_id}
export const updateOffering = async (offeringId, payload) => {
  // payload: { semester, year }
  const response = await api.put(`/course-offerings/${offeringId}`, payload, {
    headers: getAuthHeaders(),
  });
  return response.data;
};

// DELETE /course-offerings/{offering_id}
export const deleteOffering = async (offeringId) => {
  const response = await api.delete(`/course-offerings/${offeringId}`, {
    headers: getAuthHeaders(),
  });
  return response.data;
};
