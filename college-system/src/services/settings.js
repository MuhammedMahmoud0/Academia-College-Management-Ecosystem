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

export const updatePassword = async (passwordData) => {
  const response = await api.put('/settings/password', passwordData, {
    headers: getAuthHeaders(),
  });
  return response.data;
};

export const getNonStudentProfile = async () => {
  const response = await api.get('/users/profile', {
    headers: getAuthHeaders(),
  });
  return response.data;
};

export const updateNonStudentProfile = async (profileData) => {
  const response = await api.patch('/users/profile', profileData, {
    headers: {
      ...getAuthHeaders(),
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};
