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

// GET /attendance/admin/overall-rate
export const getOverallAttendanceRate = async () => {
  const response = await api.get('/attendance/admin/overall-rate', {
    headers: getAuthHeaders(),
  });
  return response.data;
};

// GET /attendance/admin/lowest-courses
export const getLowestAttendanceCourses = async (limit = 5) => {
  const response = await api.get('/attendance/admin/lowest-courses', {
    headers: getAuthHeaders(),
    params: { limit },
  });
  return response.data;
};

// GET /attendance/admin/trend
export const getAttendanceTrend = async (params = {}) => {
  const response = await api.get('/attendance/admin/trend', {
    headers: getAuthHeaders(),
    params,
  });
  return response.data;
};

// GET /attendance/admin/dept-comparison
export const getDepartmentComparison = async (params = {}) => {
  const response = await api.get('/attendance/admin/dept-comparison', {
    headers: getAuthHeaders(),
    params, // department_id, semester, course_code
  });
  return response.data;
};

// GET /attendance/admin/distribution
export const getAttendanceDistribution = async (params = {}) => {
  const response = await api.get('/attendance/admin/distribution', {
    headers: getAuthHeaders(),
    params, // department_id, semester, course_code
  });
  return response.data;
};

// GET /attendance/admin/top-students
export const getTopPerformingStudents = async (params = {}) => {
  const response = await api.get('/attendance/admin/top-students', {
    headers: getAuthHeaders(),
    params, // department_id, semester, course_code, limit
  });
  return response.data;
};

// GET /attendance/admin/students
export const getStudentsAttendance = async (params = {}) => {
  const response = await api.get('/attendance/admin/students', {
    headers: getAuthHeaders(),
    params, // department_id, course_code, search
  });
  return response.data;
};
