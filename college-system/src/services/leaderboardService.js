import apiClient from './apiClient';

// Get leaderboard data
export const getLeaderboard = async (type = 'gpa', limit = 50) => {
  const response = await apiClient.get(`/leaderboard?type=${type}&limit=${limit}`);
  return response.data;
};
