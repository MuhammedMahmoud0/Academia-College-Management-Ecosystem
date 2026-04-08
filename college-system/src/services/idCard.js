import axios from 'axios';

const BASE_URL = '/api/v1';

const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

const getAuthHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
});

/**
 * Fetch digital student ID front data.
 */
export const getDigitalIdFront = async () => {
  const response = await api.get('/student/digital-id/front', {
    headers: getAuthHeaders(),
  });
  return response.data;
};

/**
 * Fetch digital student ID back data.
 */
export const getDigitalIdBack = async () => {
  const response = await api.get('/student/digital-id/back', {
    headers: getAuthHeaders(),
  });
  return response.data;
};
