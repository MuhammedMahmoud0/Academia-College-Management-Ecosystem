import axios from 'axios';

const BASE_URL = '/api/v1';

const api = axios.create({
	baseURL: BASE_URL,
	headers: {
		'Content-Type': 'application/json',
	},
});

const getAuthHeaders = () => ({
	Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
});

/**
 * Get notifications list for the authenticated user.
 * Endpoint: GET /notifications?page=&limit=
 * @param {{ page?: number, limit?: number }} params
 */
export const getNotifications = async ({ page = 1, limit = 20 } = {}) => {
	const token = localStorage.getItem('auth_token');

	if (!token) {
		const authError = new Error('Authentication required');
		authError.status = 401;
		throw authError;
	}

	const response = await api.get('/notifications', {
		params: {
			page,
			limit,
		},
		headers: {
			...getAuthHeaders(),
			Authorization: `Bearer ${token}`,
		},
	});

	return response.data?.data || response.data;
};
