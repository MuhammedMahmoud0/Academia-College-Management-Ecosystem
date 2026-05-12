import apiClient from './apiClient';

/**
 * GET /registration/available-offerings
 * Returns { semester, offerings: [{ courseName, courseCode, creditHours, lectures: [...], labs: [...] }] }
 */
export const getAvailableOfferings = async () => {
  const response = await apiClient.get('/registration/available-offerings');
  return response.data;
};

/**
 * POST /registration/register
 * Body: { selectedLectureIds: [id, ...], selectedLabIds: [id, ...] }
 * Returns: { message, enrollments, details: [{ student_user_id, lecture_id, tutorial_lab_id, status }] }
 */
export const registerCourses = async (selectedLectureIds, selectedLabIds) => {
  const response = await apiClient.post('/registration/register', {
    selectedLectureIds,
    selectedLabIds,
  });
  return response.data;
};

/**
 * GET /courses/student
 * Returns the student's currently enrolled courses.
 * Response: { courses: [{ id, code, name, credits, instructor, semester, year, grade, status }], cumulativeGPA, totalCredits }
 */
export const getStudentCourses = async () => {
  const response = await apiClient.get('/courses/student');
  return response.data;
};

/**
 * GET /courses/student/labs
 * Returns the student's enrolled lab/tutorial sections.
 * Response: { labs: [{ id, code, name, credits, instructor, type, group, semester, year, grade, status }] }
 */
export const getStudentLabs = async () => {
  const response = await apiClient.get('/courses/student/labs');
  return response.data;
};

/**
 * DELETE /registration/unregister
 * Body: { lectureId }          → removes entire course (lecture + lab)
 * Body: { tutorialLabId }      → removes lab only, lecture enrollment stays
 * Returns: { message, courseCode, enrollmentsDeleted }
 */
export const unregisterCourse = async (lectureId, tutorialLabId) => {
  // Send ONLY the relevant field — backend decides what to remove based on which key is present.
  // Sending both (even with one as null) can cause unintended server-side behavior.
  const data = lectureId != null
    ? { lectureId }
    : { tutorialLabId };

  const response = await apiClient.delete('/registration/unregister', { data });
  return response.data;
};

/**
 * POST /registration/register-lab
 * Body: { lectureId, labId }
 * Use after unregistering a lab to pick a different lab for an already-enrolled lecture.
 * Returns: 201 on success
 */
export const registerLab = async (lectureId, labId) => {
  const response = await apiClient.post('/registration/register-lab', { lectureId, labId });
  return response.data;
};
