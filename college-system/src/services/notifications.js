import apiClient from './apiClient';

/**
 * Get notifications list for the authenticated user.
 * Endpoint: GET /notifications?page=&limit=
 * @param {{ page?: number, limit?: number }} params
 */
export const getNotifications = async ({ page = 1, limit = 20 } = {}) => {
	const response = await apiClient.get('/notifications', {
		params: { page, limit },
	});
	return response.data?.data || response.data;
};

/**
 * Get unread notification count for the authenticated user.
 * Endpoint: GET /notifications/unread-count
 */
export const getUnreadCount = async () => {
	const response = await apiClient.get('/notifications/unread-count');
	return response.data;
};

/**
 * Mark a specific notification as read.
 * Endpoint: PATCH /notifications/:id/read
 * @param {number|string} notificationId
 */
export const markNotificationAsRead = async (notificationId) => {
	const response = await apiClient.patch(`/notifications/${notificationId}/read`, {});
	return response.data;
};

/**
 * Mark all notifications as read for the authenticated user.
 * Endpoint: PATCH /notifications/mark-all-read
 */
export const markAllAsRead = async () => {
	const response = await apiClient.patch('/notifications/mark-all-read', {});
	return response.data;
};

/**
 * Delete a specific notification.
 * Endpoint: DELETE /notifications/:id
 * @param {number|string} notificationId
 */
export const deleteNotification = async (notificationId) => {
	const response = await apiClient.delete(`/notifications/${notificationId}`);
	return response.data;
};

/**
 * Delete all notifications for the authenticated user.
 * Endpoint: DELETE /notifications
 */
export const deleteAllNotifications = async () => {
	const response = await apiClient.delete('/notifications');
	return response.data;
};

/**
 * Get notification preferences for the authenticated user.
 * Endpoint: GET /notifications/preferences
 */
export const getNotificationPreferences = async () => {
	const response = await apiClient.get('/notifications/preferences');
	return response.data;
};

/**
 * Get list of users (Admin only).
 * Endpoint: GET /users
 */
export const getUsersList = async () => {
	const response = await apiClient.get('/users');
	return response.data?.data || response.data;
};

/**
 * Update notification preferences for the authenticated user.
 * Endpoint: PUT /notifications/preferences
 * @param {Object} preferences - The preferences object to update
 */
export const updateNotificationPreferences = async (preferences) => {
	const response = await apiClient.put('/notifications/preferences', preferences);
	return response.data;
};

/**
 * Create a notification for a user (Admin only).
 * Endpoint: POST /notifications
 * @param {Object} notificationData - { user_id, message, type }
 */
export const createNotification = async (notificationData) => {
	const response = await apiClient.post('/notifications', notificationData);
	return response.data;
};

/**
 * Create notifications for multiple users (Admin only).
 * Endpoint: POST /notifications/bulk
 * @param {Object} bulkData - { user_ids: [], message, type }
 */
export const createBulkNotifications = async (bulkData) => {
	const response = await apiClient.post('/notifications/bulk', bulkData);
	return response.data;
};
