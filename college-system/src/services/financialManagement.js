import apiClient from './apiClient';

/**
 * GET /financials
 * Returns all financial records (department credit-hour prices).
 * @param {string} [departmentId] - optional UUID to filter by department
 */
export const getFinancials = async (departmentId) => {
  const params = {};
  if (departmentId) params.departmentId = departmentId;
  const response = await apiClient.get('/financials', { params });
  return response.data; // { financials: [...] }
};

/**
 * GET /financials/:id
 * Returns a single financial record by ID.
 * @param {number} id
 */
export const getFinancialById = async (id) => {
  const response = await apiClient.get(`/financials/${id}`);
  return response.data;
};

/**
 * POST /financials
 * Creates a new credit-hour pricing record for a department.
 * @param {{ department_id: string, credit_price: number }} payload
 */
export const createFinancial = async (payload) => {
  const response = await apiClient.post('/financials', payload);
  return response.data;
};

/**
 * PATCH /financials/:id
 * Updates the credit_price of an existing financial record.
 * @param {number} id
 * @param {number} credit_price
 */
export const updateFinancial = async (id, credit_price) => {
  const response = await apiClient.patch(`/financials/${id}`, { credit_price });
  return response.data;
};

/**
 * DELETE /financials/:id
 * Deletes a financial record. Admin / super_admin only.
 * @param {number} id
 */
export const deleteFinancial = async (id) => {
  const response = await apiClient.delete(`/financials/${id}`);
  return response.data;
};
