import apiClient from './apiClient';

// ─── Available Offerings (schedule grid data) ────────────────────────────────

/**
 * Get available course offerings for the current semester.
 * Response shape: { semester, offerings: [{ courseName, courseCode, creditHours, lectures: [...], labs: [...] }] }
 */
export const getAvailableOfferings = async () => {
  const response = await apiClient.get('/registration/available-offerings');
  return response.data;
};

// ─── Teachers ─────────────────────────────────────────────────────────────────

/**
 * Get all teachers/doctors.
 * Response shape: array or { data: [...] } or { teachers: [...] }
 */
export const getAllTeachers = async () => {
  const response = await apiClient.get('/teachers');
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
  const response = await apiClient.post('/courses/lectures', payload);
  return response.data;
};

/**
 * Update an existing lecture (offeringId cannot be changed).
 * @param {number} lectureId
 * @param {{ instructorId, capacity, dayOfWeek, startTime, endTime, location, group }} payload
 */
export const updateLecture = async (lectureId, payload) => {
  const response = await apiClient.patch(`/courses/lectures/${lectureId}`, payload);
  return response.data;
};

/**
 * Delete a lecture by ID.
 * @param {number} lectureId
 */
export const deleteLecture = async (lectureId) => {
  const response = await apiClient.delete(`/courses/lectures/${lectureId}`);
  return response.data;
};

// ─── Tutorial / Labs ──────────────────────────────────────────────────────────

/**
 * Create a new tutorial/lab session.
 * @param {{ offeringId, taId, type, capacity, dayOfWeek, startTime, endTime, location, group }} payload
 */
export const createTutorialLab = async (payload) => {
  const response = await apiClient.post('/courses/tutorials-labs', payload);
  return response.data;
};

/**
 * Update an existing tutorial/lab session (offeringId cannot be changed).
 * @param {number} tutorialLabId
 * @param {{ taId, type, capacity, dayOfWeek, startTime, endTime, location, group }} payload
 */
export const updateTutorialLab = async (tutorialLabId, payload) => {
  const response = await apiClient.patch(`/courses/tutorials-labs/${tutorialLabId}`, payload);
  return response.data;
};

/**
 * Delete a tutorial/lab session by ID.
 * @param {number} tutorialLabId
 */
export const deleteTutorialLab = async (tutorialLabId) => {
  const response = await apiClient.delete(`/courses/tutorials-labs/${tutorialLabId}`);
  return response.data;
};
