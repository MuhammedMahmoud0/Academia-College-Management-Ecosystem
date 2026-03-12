import axios from 'axios';

const BASE_URL = '/api/v1';

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.warn('Authentication failed - token may be invalid or expired');
    }
    return Promise.reject(error);
  }
);

/**
 * Get community feed with all posts
 * @param {number} page - Page number for pagination (default: 1)
 * @param {number} limit - Number of posts per page (default: 10)
 * @returns {Promise} Promise with posts data
 */
export const getCommunityFeed = async (page = 1, limit = 10) => {
  const response = await api.get('/community/feed', {
    params: { page, limit }
  });
  return response.data;
};

/**
 * Get suggested groups for the user
 * @returns {Promise} Promise with suggested groups data
 */
export const getSuggestedGroups = async () => {
  const response = await api.get('/community/groups/suggested');
  return response.data;
};

export default {
  getCommunityFeed,
  getSuggestedGroups
};
