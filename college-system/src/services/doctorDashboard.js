import apiClient from './apiClient';

/**
 * Get doctor alerts (active tasks, expired tasks, ungraded submissions, low score counts)
 * @returns {Promise} Object containing alerts data
 */
export const getDoctorAlerts = async () => {
  const response = await apiClient.get('/doctor/alerts');
  return response.data;
};

/**
 * Get teaching assistant alerts (active tasks, expired tasks, ungraded submissions, low score counts)
 * @returns {Promise} Object containing alerts data
 */
export const getTAAlerts = async () => {
  const response = await apiClient.get('/teaching-assistant/alerts');
  return response.data;
};

/**
 * Get assigned courses & enrollment stats for the doctor
 * @returns {Promise} Object containing courses data
 */
export const getDoctorCourses = async () => {
  const response = await apiClient.get('/doctor/courses');
  return response.data;
};

/**
 * Get teacher/TA schedule
 * @returns {Promise} Object containing schedule data
 */
export const getTASchedule = async () => {
  const response = await apiClient.get('/teachers/schedule');
  return response.data;
};
