import apiClient from './apiClient';

/**
 * Fetch payment management cards data for admin
 * @returns {Promise<Object>} Cards data and metadata
 */
export const getPaymentCards = async () => {
  const response = await apiClient.get('/payments/admin/cards');
  return response.data;
};

/**
 * Fetch student payments table rows
 * @param {Object} filters - Optional filters: date (YYYY-MM-DD), payMethod, status, limit
 * @returns {Promise<Object>} Payments array and total count
 */
export const getStudentPayments = async (filters = {}) => {
  const params = new URLSearchParams();

  if (filters.date) params.append('date', filters.date);
  if (filters.payMethod && filters.payMethod !== 'all') params.append('payMethod', filters.payMethod);
  if (filters.status && filters.status !== 'all') params.append('status', filters.status);
  if (filters.limit) params.append('limit', filters.limit);

  const response = await apiClient.get(`/payments/admin/student-payments?${params.toString()}`);
  return response.data;
};
