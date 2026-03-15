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

// GET /exams/all - Retrieve all created exams for admin management
export const getAllExams = async () => {
	const response = await api.get('/exams/all', {
		headers: getAuthHeaders(),
	});

	return response.data; // { success, count, data: [...] }
};

// GET /exams/active-courses - Retrieve active course offerings for dropdowns
export const getActiveCourseOfferings = async () => {
	const response = await api.get('/exams/active-courses', {
		headers: getAuthHeaders(),
	});

	return response.data; // { success, count, data: [...] }
};

// POST /exams/set - Create a new exam
export const createExam = async (examData) => {
	const response = await api.post('/exams/set', examData, {
		headers: getAuthHeaders(),
	});

	return response.data;
};

// PUT /exams/set/{exam_id} - Update an existing exam
export const updateExam = async (examId, examData) => {
	const response = await api.put(`/exams/set/${examId}`, examData, {
		headers: getAuthHeaders(),
	});

	return response.data;
};

// DELETE /exams/set/{exam_id} - Delete an exam
export const deleteExam = async (examId) => {
	const response = await api.delete(`/exams/set/${examId}`, {
		headers: getAuthHeaders(),
	});

	return response.data;
};
