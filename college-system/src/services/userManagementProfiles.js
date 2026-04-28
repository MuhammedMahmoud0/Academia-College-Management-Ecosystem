import axios from 'axios';

const BASE_URL = '/api/v1';

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

const getAuthHeaders = () => {
  const token = localStorage.getItem('auth_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const getManagedStudentProfile = async (studentId) => {
  const response = await api.get(`/users/management/students/${studentId}/profile`, {
    headers: getAuthHeaders(),
  });

  return response.data;
};

export const getManagedStudentGradesHistory = async (studentId) => {
  const response = await api.get(`/users/management/students/${studentId}/grades-history`, {
    headers: getAuthHeaders(),
  });

  return response.data;
};

export const getManagedDoctorProfile = async (userId) => {
  const response = await api.get(`/users/management/doctors/${userId}/profile`, {
    headers: getAuthHeaders(),
  });

  return response.data;
};

export const getManagedDoctorCourses = async (userId) => {
  const response = await api.get(`/users/management/doctors/${userId}/courses`, {
    headers: getAuthHeaders(),
  });

  return response.data;
};

export const getManagedTeachingAssistantProfile = async (userId) => {
  const response = await api.get(`/users/management/teaching-assistants/${userId}/profile`, {
    headers: getAuthHeaders(),
  });

  return response.data;
};

export const getManagedTeachingAssistantCourses = async (userId) => {
  const response = await api.get(`/users/management/teaching-assistants/${userId}/courses`, {
    headers: getAuthHeaders(),
  });

  return response.data;
};

export const getManagedAdmins = async () => {
  const response = await api.get('/users/management/admins', {
    headers: getAuthHeaders(),
  });

  return response.data;
};

export const createManagedAdmin = async (payload) => {
  const response = await api.post('/users/management/admins', payload, {
    headers: getAuthHeaders(),
  });

  return response.data;
};
