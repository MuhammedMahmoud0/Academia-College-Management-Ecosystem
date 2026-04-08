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
 * Get doctor alerts (active tasks, expired tasks, ungraded submissions, low score counts)
 * @returns {Promise} Object containing alerts data
 */
export const getDoctorAlerts = async () => {
  const token = getAuthToken();
  const response = await api.get('/doctor/alerts', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

/**
 * Get assigned courses & enrollment stats for the doctor
 * @returns {Promise} Object containing courses data
 */
export const getDoctorCourses = async () => {
  const token = getAuthToken();
  const response = await api.get('/doctor/courses', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

/**
 * Get teacher/TA schedule
 * @returns {Promise} Object containing schedule data
 */
export const getTASchedule = async () => {
  const token = getAuthToken();
  const response = await api.get('/teachers/schedule', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};
