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

// Get leaderboard data
export const getLeaderboard = async (type = 'gpa', limit = 50) => {
  const response = await api.get(`/leaderboard?type=${type}&limit=${limit}`, {
    headers: getAuthHeaders(),
  });
  return response.data;
};
