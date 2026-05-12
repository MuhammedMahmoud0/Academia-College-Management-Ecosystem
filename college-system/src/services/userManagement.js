import apiClient from './apiClient';

export const getManagedStudents = async ({ page = 1, limit = 10, search = '' } = {}) => {
	const response = await apiClient.get('/users/management/students', {
		params: {
			page,
			limit,
			...(search ? { search } : {}),
		},
	});
	return response.data;
};

export const getManagedDoctors = async ({ page = 1, limit = 10, search = '', role = '' } = {}) => {
	const response = await apiClient.get('/users/management/staff', {
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
	const response = await apiClient.post('/users/students', payload);
	return response.data;
};

export const createNonStudentUser = async (payload) => {
	const response = await apiClient.post('/users', payload);
	return response.data;
};

export const uploadStudentsExcelFile = async (file) => {
	const formData = new FormData();
	formData.append('file', file);

	const response = await apiClient.post('/users/upload-excel/students', formData, {
		headers: { 'Content-Type': 'multipart/form-data' },
	});
	return response.data;
};

export const uploadNonStudentsExcelFile = async (file) => {
	const formData = new FormData();
	formData.append('file', file);

	const response = await apiClient.post('/users/upload-excel', formData, {
		headers: { 'Content-Type': 'multipart/form-data' },
	});
	return response.data;
};

export const getDepartments = async (search = '') => {
	const response = await apiClient.get('/departments', {
		params: search ? { search } : {},
	});
	return response.data;
};

export const deleteStudentUser = async (userId) => {
	const response = await apiClient.delete(`/users/${userId}`);
	return response.data;
};

export const deleteManagedUser = async (userId) => {
	const response = await apiClient.delete(`/users/${userId}`);
	return response.data;
};

export const updateManagedUser = async (userId, payload) => {
	const isFormDataPayload = typeof FormData !== 'undefined' && payload instanceof FormData;

	const response = await apiClient.patch(`/users/${userId}`, payload, {
		headers: {
			...(isFormDataPayload ? { 'Content-Type': 'multipart/form-data' } : {}),
		},
	});
	return response.data;
};

export const updateStudentUser = async (userId, payload) => {
	const response = await apiClient.patch(`/users/${userId}`, payload);
	return response.data;
};

export const updateStudentLeaderRole = async (userId, role) => {
	const response = await apiClient.patch(`/users/students/${userId}/role`, { role });
	return response.data;
};

export const deleteDoctorUser = deleteManagedUser;
export const updateDoctorUser = updateManagedUser;
