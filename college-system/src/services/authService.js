import apiClient from './apiClient';

/**
 * Authenticate with email + password.
 * Returns { message, accessToken, requiresPasswordChange }.
 * The backend also sets an HttpOnly refresh cookie automatically.
 */
export const login = async (email, password) => {
  const response = await apiClient.post('/auth/login', { email, password });
  return response.data;
};

/**
 * Fetch the currently authenticated user's profile.
 * The Authorization header is attached automatically by the apiClient interceptor.
 */
export const getCurrentUser = async () => {
  const response = await apiClient.get('/auth/me');

  // Handle different response structures from backend
  const userData = response.data.user || response.data;

  // Cache user profile (non-sensitive data) for instant display on page load
  localStorage.setItem('currentUser', JSON.stringify(userData));
  return userData;
};

/**
 * Revoke the refresh token and clear the HttpOnly cookie server-side.
 */
export const logoutAPI = async () => {
  await apiClient.post('/auth/logout');
};

/**
 * Attempt a silent token refresh using the HttpOnly refresh cookie.
 * Returns the new accessToken string on success, throws on failure.
 */
export const refreshToken = async () => {
  const response = await apiClient.post('/auth/refresh');
  return response.data.accessToken;
};