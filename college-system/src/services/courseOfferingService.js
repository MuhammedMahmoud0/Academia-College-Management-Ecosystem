import apiClient from './apiClient';

// GET /course-offerings
export const getAllOfferings = async () => {
  const response = await apiClient.get('/course-offerings');
  return response.data; // { success, count, data: [...] }
};

// POST /course-offerings
export const createOffering = async (payload) => {
  // payload: { course_code, semester, year }
  const response = await apiClient.post('/course-offerings', payload);
  return response.data; // { success, message, data: { offering_id, ... } }
};

// PUT /course-offerings/{offering_id}
export const updateOffering = async (offeringId, payload) => {
  // payload: { semester, year }
  const response = await apiClient.put(`/course-offerings/${offeringId}`, payload);
  return response.data;
};

// DELETE /course-offerings/{offering_id}
export const deleteOffering = async (offeringId) => {
  const response = await apiClient.delete(`/course-offerings/${offeringId}`);
  return response.data;
};
