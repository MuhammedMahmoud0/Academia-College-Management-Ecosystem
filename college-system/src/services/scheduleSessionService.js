import axios from 'axios';

// Use proxy in development, full URL in production
const BASE_URL = import.meta.env.DEV
  ? '/api/v1'
  : import.meta.env.VITE_API_URL;

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

const getAuthHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
});

// ─── Available Offerings (schedule grid data) ────────────────────────────────

/**
 * Get available course offerings for the current semester.
 * Response shape: { semester, offerings: [{ courseName, courseCode, creditHours, lectures: [...], labs: [...] }] }
 */
export const getAvailableOfferings = async () => {
  const response = await api.get('/registration/available-offerings', {
    headers: getAuthHeaders(),
  });
  return response.data;
};

// ─── Teachers ─────────────────────────────────────────────────────────────────

/**
 * Get all teachers/doctors.
 * Response shape: array or { data: [...] } or { teachers: [...] }
 */
export const getAllTeachers = async () => {
  const response = await api.get('/teachers', {
    headers: getAuthHeaders(),
  });
  // Normalise to array
  const raw = response.data;
  if (Array.isArray(raw)) return raw;
  if (Array.isArray(raw?.data)) return raw.data;
  if (Array.isArray(raw?.teachers)) return raw.teachers;
  return [];
};

// ─── Lectures ─────────────────────────────────────────────────────────────────

/**
 * Create a new lecture.
 * @param {{ offeringId, instructorId, capacity, dayOfWeek, startTime, endTime, location, group }} payload
 */
export const createLecture = async (payload) => {
  const response = await api.post('/courses/lectures', payload, {
    headers: getAuthHeaders(),
  });
  return response.data;
};

/**
 * Update an existing lecture (offeringId cannot be changed).
 * @param {number} lectureId
 * @param {{ instructorId, capacity, dayOfWeek, startTime, endTime, location, group }} payload
 */
export const updateLecture = async (lectureId, payload) => {
  const response = await api.patch(`/courses/lectures/${lectureId}`, payload, {
    headers: getAuthHeaders(),
  });
  return response.data;
};

/**
 * Delete a lecture by ID.
 * @param {number} lectureId
 */
export const deleteLecture = async (lectureId) => {
  const response = await api.delete(`/courses/lectures/${lectureId}`, {
    headers: getAuthHeaders(),
  });
  return response.data;
};

// ─── Tutorial / Labs ──────────────────────────────────────────────────────────

/**
 * Create a new tutorial/lab session.
 * @param {{ offeringId, taId, type, capacity, dayOfWeek, startTime, endTime, location, group }} payload
 */
export const createTutorialLab = async (payload) => {
  const response = await api.post('/courses/tutorials-labs', payload, {
    headers: getAuthHeaders(),
  });
  return response.data;
};

/**
 * Update an existing tutorial/lab session (offeringId cannot be changed).
 * @param {number} tutorialLabId
 * @param {{ taId, type, capacity, dayOfWeek, startTime, endTime, location, group }} payload
 */
export const updateTutorialLab = async (tutorialLabId, payload) => {
  const response = await api.patch(`/courses/tutorials-labs/${tutorialLabId}`, payload, {
    headers: getAuthHeaders(),
  });
  return response.data;
};

/**
 * Delete a tutorial/lab session by ID.
 * @param {number} tutorialLabId
 */
export const deleteTutorialLab = async (tutorialLabId) => {
  const response = await api.delete(`/courses/tutorials-labs/${tutorialLabId}`, {
    headers: getAuthHeaders(),
  });
  return response.data;
};
