import apiClient from './apiClient';

export const getStudentAttendanceDashboard = async () => {
	const response = await apiClient.get('/attendance/my-history');
	return response.data?.data || response.data;
};
