import apiClient from './apiClient';

/**
 * Fetch digital student ID front data.
 */
export const getDigitalIdFront = async () => {
  const response = await apiClient.get('/student/digital-id/front');
  return response.data;
};

/**
 * Fetch digital student ID back data.
 */
export const getDigitalIdBack = async () => {
  const response = await apiClient.get('/student/digital-id/back');
  return response.data;
};
