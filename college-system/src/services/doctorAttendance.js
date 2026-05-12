import apiClient from './apiClient';

/**
 * Get average attendance rate for a lecture or tutorial
 * @param {Object} params - The query parameters
 * @param {number} [params.lecture_id]
 * @param {number} [params.tutorial_lab_id]
 */
export const getAverageAttendance = async (params = {}) => {
  const response = await apiClient.get('/attendance/stats/avg', { params });
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
  const response = await apiClient.get('/attendance/stats/lowest', { params });
  return response.data;
};

/**
 * Get weekly attendance trend for a lecture or tutorial
 * @param {Object} params - The query parameters
 * @param {number} [params.lecture_id]
 * @param {number} [params.tutorial_lab_id]
 */
export const getAttendanceTrend = async (params = {}) => {
  const response = await apiClient.get('/attendance/stats/trend', { params });
  return response.data;
};

/**
 * Get attendance grid data (all students x all dates)
 * @param {Object} params - The query parameters
 * @param {number} [params.lecture_id]
 * @param {number} [params.tutorial_lab_id]
 */
export const getAttendanceGrid = async (params = {}) => {
  const response = await apiClient.get('/attendance/grid', { params });
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
  const response = await apiClient.put('/attendance/records/update', data);
  return response.data;
};
