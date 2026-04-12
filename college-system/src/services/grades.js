import axios from 'axios';

const BASE_URL = '/api/v1';

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

const getAuthToken = () => {
    return localStorage.getItem('auth_token');
};

/**
 * Get student grades for a lecture (Doctor/Admin view)
 * @param {string|number} lectureId 
 * @returns {Promise} Object containing students and grades
 */
export const getLectureGrades = async (lectureId) => {
  const token = getAuthToken();
  const response = await api.get(`/grades/lecture/${lectureId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

/**
 * Get student grades for a tutorial/lab (TA view)
 * @param {string|number} tutorialLabId 
 * @returns {Promise} Object containing students and grades
 */
export const getTutorialLabGrades = async (tutorialLabId) => {
  const token = getAuthToken();
  const response = await api.get(`/grades/tutorial-lab/${tutorialLabId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

/**
 * Get the grade distribution constraints for a lecture
 * @param {string|number} lectureId 
 */
export const getGradeDistribution = async (lectureId) => {
  const token = getAuthToken();
  const response = await api.get(`/grades/lecture/${lectureId}/distribution`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

/**
 * Update the grade distribution constraints for a lecture (Doctor Only)
 * @param {string|number} lectureId 
 * @param {Object} data { work_max, mid_max, final_max }
 */
export const setGradeDistribution = async (lectureId, data) => {
  const token = getAuthToken();
  const response = await api.put(`/grades/lecture/${lectureId}/distribution`, data, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

/**
 * Modify a student's score in a Doctor's lecture
 * @param {string|number} lectureId 
 * @param {string} studentId 
 * @param {Object} data { mid_score, work_score, final_score }
 */
export const updateStudentGradeForDoctor = async (lectureId, studentId, data) => {
  const token = getAuthToken();
  const response = await api.put(`/grades/lecture/${lectureId}/student/${studentId}`, data, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

/**
 * Modify a student's score in a TA's tutorial/lab
 * @param {string|number} tutorialLabId 
 * @param {string} studentId 
 * @param {Object} data { mid_score, work_score, final_score }
 */
export const updateStudentGradeForTA = async (tutorialLabId, studentId, data) => {
  const token = getAuthToken();
  const response = await api.put(`/grades/tutorial-lab/${tutorialLabId}/student/${studentId}`, data, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

/**
 * Get grade distribution for the authenticated student.
 * Endpoint: GET /grades/my/distribution
 * @returns {Promise<{distribution: Array<{grade: string, count: number}>}>}
 */
export const getMyGradeDistribution = async () => {
  const token = getAuthToken();
  const response = await api.get('/grades/my/distribution', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data?.data || response.data;
};

/**
 * Get CGPA trend for the authenticated student.
 * Endpoint: GET /grades/my/cgpa-trend
 * @returns {Promise<{current_cgpa: number, total_semesters: number, trend: Array}>}
 */
export const getMyCgpaTrend = async () => {
  const token = getAuthToken();
  const response = await api.get('/grades/my/cgpa-trend', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data?.data || response.data;
};
