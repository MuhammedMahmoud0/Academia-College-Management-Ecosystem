import apiClient from './apiClient';

const getAuthToken = () => {
  // Token is now in memory — access via apiClient interceptor.
  // This helper exists only for code paths that need the raw value
  // (e.g. socket auth). The interceptor handles all HTTP requests automatically.
  import('./apiClient').then(({ getAccessToken }) => getAccessToken());
};

/**
 * Get student grades for a lecture (Doctor/Admin view)
 * @param {string|number} lectureId 
 * @returns {Promise} Object containing students and grades
 */
export const getLectureGrades = async (lectureId) => {
  const response = await apiClient.get(`/grades/lecture/${lectureId}`);
  return response.data;
};

/**
 * Get student grades for a tutorial/lab (TA view)
 * @param {string|number} tutorialLabId 
 * @returns {Promise} Object containing students and grades
 */
export const getTutorialLabGrades = async (tutorialLabId) => {
  const response = await apiClient.get(`/grades/tutorial-lab/${tutorialLabId}`);
  return response.data;
};

/**
 * Get the grade distribution constraints for a lecture
 * @param {string|number} lectureId 
 */
export const getGradeDistribution = async (lectureId) => {
  const response = await apiClient.get(`/grades/lecture/${lectureId}/distribution`);
  return response.data;
};

/**
 * Update the grade distribution constraints for a lecture (Doctor Only)
 * @param {string|number} lectureId 
 * @param {Object} data { work_max, mid_max, final_max }
 */
export const setGradeDistribution = async (lectureId, data) => {
  const response = await apiClient.put(`/grades/lecture/${lectureId}/distribution`, data);
  return response.data;
};

/**
 * Modify a student's score in a Doctor's lecture
 * @param {string|number} lectureId 
 * @param {string} studentId 
 * @param {Object} data { mid_score, work_score, final_score }
 */
export const updateStudentGradeForDoctor = async (lectureId, studentId, data) => {
  const response = await apiClient.put(`/grades/lecture/${lectureId}/student/${studentId}`, data);
  return response.data;
};

/**
 * Modify a student's score in a TA's tutorial/lab
 * @param {string|number} tutorialLabId 
 * @param {string} studentId 
 * @param {Object} data { mid_score, work_score, final_score }
 */
export const updateStudentGradeForTA = async (tutorialLabId, studentId, data) => {
  const response = await apiClient.put(`/grades/tutorial-lab/${tutorialLabId}/student/${studentId}`, data);
  return response.data;
};

/**
 * Get grade distribution for the authenticated student.
 * Endpoint: GET /grades/my/distribution
 * @returns {Promise<{distribution: Array<{grade: string, count: number}>}>}
 */
export const getMyGradeDistribution = async () => {
  const response = await apiClient.get('/grades/my/distribution');
  return response.data?.data || response.data;
};

/**
 * Get CGPA trend for the authenticated student.
 * Endpoint: GET /grades/my/cgpa-trend
 * @returns {Promise<{current_cgpa: number, total_semesters: number, trend: Array}>}
 */
export const getMyCgpaTrend = async () => {
  const response = await apiClient.get('/grades/my/cgpa-trend');
  return response.data?.data || response.data;
};
