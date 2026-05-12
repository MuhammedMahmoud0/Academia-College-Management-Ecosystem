import apiClient from './apiClient';

// GET /courses/all — Retrieve all courses
export const getAllCourses = async () => {
  const response = await apiClient.get('/courses/all');
  return response.data; // { courses: [...], total }
};

// POST /courses — Create a new course
export const createCourse = async (courseData) => {
  // courseData: { code, name, credits, department, prerequisites: ["CODE1", ...] }
  const response = await apiClient.post('/courses', courseData);
  return response.data;
};

// PATCH /courses/{code} — Update a course
export const updateCourse = async (code, courseData) => {
  // courseData: { name, prerequisites: ["CODE1", ...] }
  const response = await apiClient.patch(`/courses/${code}`, courseData);
  return response.data;
};

// DELETE /courses/{code} — Delete a course
export const deleteCourse = async (code) => {
  const response = await apiClient.delete(`/courses/${code}`);
  return response.data;
};

// GET /courses/student — Get student's enrolled courses and grades
export const getStudentCourses = async () => {
  const response = await apiClient.get('/courses/student');
  return response.data;
};
