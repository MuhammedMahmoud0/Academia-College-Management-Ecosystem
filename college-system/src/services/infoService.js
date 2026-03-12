import axios from 'axios';

const BASE_URL = '/api/v1';

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('auth_token');
  if (!token) {
    throw new Error('No authentication token found');
  }
  return {
    Authorization: `Bearer ${token}`,
  };
};

// Get student profile information
export const getStudentProfile = async () => {
  const response = await api.get('/student/profile', {
    headers: getAuthHeaders(),
  });
  return response.data;
};

// Update student profile information
export const updateStudentProfile = async (data) => {
  const response = await api.put('/student/profile', data, {
    headers: getAuthHeaders(),
  });
  return response.data;
};