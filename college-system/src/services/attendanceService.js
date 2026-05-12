import apiClient from './apiClient';

/**
 * Start a live QR-based attendance session.
 * @param {{ lecture_id?: number, tutorial_lab_id?: number, session_date: string, isLive: boolean, longitude?: number, latitude?: number }} payload
 */
export const startAttendanceSession = async (payload) => {
  const response = await apiClient.post('/attendance/sessions/start', payload);
  return response.data;
};

/**
 * Get current state of an attendance session (present/absent students).
 * @param {string} sessionId
 */
export const getSessionDetails = async (sessionId) => {
  const response = await apiClient.get(`/attendance/sessions/${sessionId}`);
  return response.data;
};

/**
 * End the live attendance session and persist records.
 * @param {string} sessionId
 */
export const endAttendanceSession = async (sessionId) => {
  const response = await apiClient.post(`/attendance/sessions/${sessionId}/end`, {});
  return response.data;
};

/**
 * Manually toggle a student's attendance status (present ↔ absent).
 * @param {string} sessionId
 * @param {string} studentUserId
 */
export const toggleStudentAttendance = async (sessionId, studentUserId) => {
  const response = await apiClient.put(
    `/attendance/sessions/${sessionId}/toggle`,
    { student_user_id: studentUserId }
  );
  return response.data;
};
