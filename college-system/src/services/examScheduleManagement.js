import apiClient from './apiClient';

// GET /exams/all - Retrieve all created exams for admin management
export const getAllExams = async () => {
	const response = await apiClient.get('/exams/all');
	return response.data; // { success, count, data: [...] }
};

// GET /exams/active-courses - Retrieve active course offerings for dropdowns
export const getActiveCourseOfferings = async () => {
	const response = await apiClient.get('/exams/active-courses');
	return response.data; // { success, count, data: [...] }
};

// POST /exams/set - Create a new exam
export const createExam = async (examData) => {
	const response = await apiClient.post('/exams/set', examData);
	return response.data;
};

// PUT /exams/set/{exam_id} - Update an existing exam
export const updateExam = async (examId, examData) => {
	const response = await apiClient.put(`/exams/set/${examId}`, examData);
	return response.data;
};

// DELETE /exams/set/{exam_id} - Delete an exam
export const deleteExam = async (examId) => {
	const response = await apiClient.delete(`/exams/set/${examId}`);
	return response.data;
};
