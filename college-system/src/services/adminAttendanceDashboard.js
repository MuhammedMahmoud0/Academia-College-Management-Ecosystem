import apiClient from './apiClient';

// GET /attendance/admin/overall-rate
export const getOverallAttendanceRate = async () => {
  const response = await apiClient.get('/attendance/admin/overall-rate');
  return response.data;
};

// GET /attendance/admin/lowest-courses
export const getLowestAttendanceCourses = async (limit = 5) => {
  const response = await apiClient.get('/attendance/admin/lowest-courses', {
    params: { limit },
  });
  return response.data;
};

// GET /attendance/admin/trend
export const getAttendanceTrend = async (params = {}) => {
  const response = await apiClient.get('/attendance/admin/trend', { params });
  return response.data;
};

// GET /attendance/admin/dept-comparison
export const getDepartmentComparison = async (params = {}) => {
  const response = await apiClient.get('/attendance/admin/dept-comparison', {
    params, // department_id, semester, course_code
  });
  return response.data;
};

// GET /attendance/admin/distribution
export const getAttendanceDistribution = async (params = {}) => {
  const response = await apiClient.get('/attendance/admin/distribution', {
    params, // department_id, semester, course_code
  });
  return response.data;
};

// GET /attendance/admin/top-students
export const getTopPerformingStudents = async (params = {}) => {
  const response = await apiClient.get('/attendance/admin/top-students', {
    params, // department_id, semester, course_code, limit
  });
  return response.data;
};

// GET /attendance/admin/students
export const getStudentsAttendance = async (params = {}) => {
  const response = await apiClient.get('/attendance/admin/students', {
    params, // department_id, course_code, search
  });
  return response.data;
};
