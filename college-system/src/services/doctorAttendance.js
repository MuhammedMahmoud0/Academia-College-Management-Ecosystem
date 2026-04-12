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

/**
 * Get average attendance rate for a lecture or tutorial
 * @param {Object} params - The query parameters
 * @param {number} [params.lecture_id]
 * @param {number} [params.tutorial_lab_id]
 */
export const getAverageAttendance = async (params = {}) => {
  const response = await api.get('/attendance/stats/avg', {
    headers: getAuthHeaders(),
    params,
  });
  return response.data;
};

/**
 * Get lowest attendance students for a lecture or tutorial
 * @param {Object} params - The query parameters
 * @param {number} [params.lecture_id]
 * @param {number} [params.tutorial_lab_id]
 * @param {number} [params.limit=3]
 */
export const getLowestAttendance = async (params = {}) => {
  const response = await api.get('/attendance/stats/lowest', {
    headers: getAuthHeaders(),
    params,
  });
  return response.data;
};

/**
 * Get weekly attendance trend for a lecture or tutorial
 * @param {Object} params - The query parameters
 * @param {number} [params.lecture_id]
 * @param {number} [params.tutorial_lab_id]
 */
export const getAttendanceTrend = async (params = {}) => {
  const response = await api.get('/attendance/stats/trend', {
    headers: getAuthHeaders(),
    params,
  });
  return response.data;
};

/**
 * Get attendance grid data (all students x all dates)
 * @param {Object} params - The query parameters
 * @param {number} [params.lecture_id]
 * @param {number} [params.tutorial_lab_id]
 */
export const getAttendanceGrid = async (params = {}) => {
  const response = await api.get('/attendance/grid', {
    headers: getAuthHeaders(),
    params,
  });
  return response.data;
};

/**
 * Update attendance record for a student
 * @param {Object} data - The payload
 * @param {string} data.student_user_id
 * @param {number} [data.lecture_id]
 * @param {number} [data.tutorial_lab_id]
 * @param {string} data.session_date
 * @param {string} data.status
 */
export const updateAttendanceRecord = async (data) => {
  const response = await api.put('/attendance/records/update', data, {
    headers: getAuthHeaders(),
  });
  return response.data;
};
