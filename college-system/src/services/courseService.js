import axios from 'axios';

const BASE_URL = '/api/v1';

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

const getAuthHeaders = () => {
  const token = localStorage.getItem('auth_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// GET /courses/all — Retrieve all courses
export const getAllCourses = async () => {
  const response = await api.get('/courses/all', {
    headers: getAuthHeaders(),
  });
  return response.data; // { courses: [...], total }
};

// POST /courses — Create a new course
export const createCourse = async (courseData) => {
  // courseData: { code, name, credits, department, prerequisites: ["CODE1", ...] }
  const response = await api.post('/courses', courseData, {
    headers: getAuthHeaders(),
  });
  return response.data;
};

// PATCH /courses/{code} — Update a course
export const updateCourse = async (code, courseData) => {
  // courseData: { name, prerequisites: ["CODE1", ...] }
  const response = await api.patch(`/courses/${code}`, courseData, {
    headers: getAuthHeaders(),
  });
  return response.data;
};

// DELETE /courses/{code} — Delete a course
export const deleteCourse = async (code) => {
  const response = await api.delete(`/courses/${code}`, {
    headers: getAuthHeaders(),
  });
  return response.data;
};

// GET /courses/student — Get student's enrolled courses and grades
export const getStudentCourses = async () => {
  const response = await api.get('/courses/student', {
    headers: getAuthHeaders(),
  });
  return response.data;
};
