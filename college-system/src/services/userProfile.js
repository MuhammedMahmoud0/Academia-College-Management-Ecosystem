import apiClient from './apiClient';

export const getStudentProfile = async () => {
  const response = await apiClient.get('/student/profile');
  return response.data;
};

export const updateStudentProfile = async (formData) => {
  const response = await apiClient.put('/student/profile', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};
