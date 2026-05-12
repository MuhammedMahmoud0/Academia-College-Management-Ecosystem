import apiClient from './apiClient';

// Get student profile information
export const getStudentProfile = async () => {
  const response = await apiClient.get('/student/profile');
  return response.data;
};

// Update student profile information
export const updateStudentProfile = async (data) => {
  const response = await apiClient.put('/student/profile', data);
  return response.data;
};