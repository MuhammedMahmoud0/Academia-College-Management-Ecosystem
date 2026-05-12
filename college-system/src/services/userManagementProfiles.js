import apiClient from './apiClient';

export const getManagedStudentProfile = async (studentId) => {
  const response = await apiClient.get(`/users/management/students/${studentId}/profile`);
  return response.data;
};

export const getManagedStudentGradesHistory = async (studentId) => {
  const response = await apiClient.get(`/users/management/students/${studentId}/grades-history`);
  return response.data;
};

export const getManagedDoctorProfile = async (userId) => {
  const response = await apiClient.get(`/users/management/doctors/${userId}/profile`);
  return response.data;
};

export const getManagedDoctorCourses = async (userId) => {
  const response = await apiClient.get(`/users/management/doctors/${userId}/courses`);
  return response.data;
};

export const getManagedTeachingAssistantProfile = async (userId) => {
  const response = await apiClient.get(`/users/management/teaching-assistants/${userId}/profile`);
  return response.data;
};

export const getManagedTeachingAssistantCourses = async (userId) => {
  const response = await apiClient.get(`/users/management/teaching-assistants/${userId}/courses`);
  return response.data;
};

export const getManagedAdmins = async () => {
  const response = await apiClient.get('/users/management/admins');
  return response.data;
};

export const createManagedAdmin = async (payload) => {
  const response = await apiClient.post('/users/management/admins', payload);
  return response.data;
};
