import axios from 'axios';

// Use proxy in development, full URL in production
const BASE_URL = import.meta.env.DEV 
  ? '/api/v1' 
  : import.meta.env.VITE_API_URL;

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const login = async (email, password) => {
  const response = await api.post('/auth/login', {
    email,
    password,
  });
  return response.data;
};

export const getCurrentUser = async (token) => {
  const response = await api.get('/auth/me', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  localStorage.setItem('currentUser', JSON.stringify(response.data));
  return response.data;
};

export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('message');
  localStorage.removeItem('currentUser');
};