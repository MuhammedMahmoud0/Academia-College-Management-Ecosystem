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

export const getManagedStudents = async ({ page = 1, limit = 10, search = '' } = {}) => {
	const response = await api.get('/users/management/students', {
		headers: getAuthHeaders(),
		params: {
			page,
			limit,
			...(search ? { search } : {}),
		},
	});

	return response.data;
};

export const getManagedDoctors = async ({ page = 1, limit = 10, search = '', role = '' } = {}) => {
	const response = await api.get('/users/management/staff', {
		headers: getAuthHeaders(),
		params: {
			page,
			limit,
			...(search ? { search } : {}),
			...(role && role !== 'all' ? { role } : {}),
		},
	});

	return response.data;
};

export const createStudentUser = async (payload) => {
	const response = await api.post('/users/students', payload, {
		headers: getAuthHeaders(),
	});

	return response.data;
};

export const createNonStudentUser = async (payload) => {
	const response = await api.post('/users', payload, {
		headers: getAuthHeaders(),
	});

	return response.data;
};

export const uploadStudentsExcelFile = async (file) => {
	const formData = new FormData();
	formData.append('file', file);

	const response = await api.post('/users/upload-excel/students', formData, {
		headers: {
			...getAuthHeaders(),
			'Content-Type': 'multipart/form-data',
		},
	});

	return response.data;
};

export const uploadNonStudentsExcelFile = async (file) => {
	const formData = new FormData();
	formData.append('file', file);

	const response = await api.post('/users/upload-excel', formData, {
		headers: {
			...getAuthHeaders(),
			'Content-Type': 'multipart/form-data',
		},
	});

	return response.data;
};

export const getDepartments = async (search = '') => {
	const response = await api.get('/departments', {
		headers: getAuthHeaders(),
		params: search ? { search } : {},
	});

	return response.data;
};

export const deleteStudentUser = async (userId) => {
	const response = await api.delete(`/users/${userId}`, {
		headers: getAuthHeaders(),
	});

	return response.data;
};

export const deleteManagedUser = async (userId) => {
	const response = await api.delete(`/users/${userId}`, {
		headers: getAuthHeaders(),
	});

	return response.data;
};

export const updateManagedUser = async (userId, payload) => {
	const isFormDataPayload = typeof FormData !== 'undefined' && payload instanceof FormData;

	const response = await api.patch(`/users/${userId}`, payload, {
		headers: {
			...getAuthHeaders(),
			...(isFormDataPayload ? { 'Content-Type': 'multipart/form-data' } : {}),
		},
	});

	return response.data;
};

export const updateStudentUser = async (userId, payload) => {
	const response = await api.patch(`/users/${userId}`, payload, {
		headers: getAuthHeaders(),
	});

	return response.data;
};

export const updateStudentLeaderRole = async (userId, role) => {
	const response = await api.patch(`/users/students/${userId}/role`, { role }, {
		headers: getAuthHeaders(),
	});

	return response.data;
};

export const deleteDoctorUser = deleteManagedUser;
export const updateDoctorUser = updateManagedUser;
