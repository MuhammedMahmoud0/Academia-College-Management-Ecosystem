import axios from 'axios';

const BASE_URL = '/api/v1';

const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

const getAuthHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
});

/**
 * Start a live QR-based attendance session.
 * @param {{ lecture_id?: number, tutorial_lab_id?: number, session_date: string, isLive: boolean, longitude?: number, latitude?: number }} payload
 */
export const startAttendanceSession = async (payload) => {
  const response = await api.post('/attendance/sessions/start', payload, {
    headers: getAuthHeaders(),
  });
  return response.data;
};

/**
 * Get current state of an attendance session (present/absent students).
 * @param {string} sessionId
 */
export const getSessionDetails = async (sessionId) => {
  const response = await api.get(`/attendance/sessions/${sessionId}`, {
    headers: getAuthHeaders(),
  });
  return response.data;
};

/**
 * End the live attendance session and persist records.
 * @param {string} sessionId
 */
export const endAttendanceSession = async (sessionId) => {
  const response = await api.post(`/attendance/sessions/${sessionId}/end`, {}, {
    headers: getAuthHeaders(),
  });
  return response.data;
};

/**
 * Manually toggle a student's attendance status (present ↔ absent).
 * @param {string} sessionId
 * @param {string} studentUserId
 */
export const toggleStudentAttendance = async (sessionId, studentUserId) => {
  const response = await api.put(
    `/attendance/sessions/${sessionId}/toggle`,
    { student_user_id: studentUserId },
    { headers: getAuthHeaders() }
  );
  return response.data;
};
