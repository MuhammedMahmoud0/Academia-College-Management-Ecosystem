import apiClient from './apiClient';

export const updatePassword = async (passwordData) => {
  const response = await apiClient.put('/settings/password', passwordData);
  return response.data;
};

export const getNonStudentProfile = async () => {
  const response = await apiClient.get('/users/profile');
  return response.data;
};

export const updateNonStudentProfile = async (profileData) => {
  const response = await apiClient.patch('/users/profile', profileData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};
