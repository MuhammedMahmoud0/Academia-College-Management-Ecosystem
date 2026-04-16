import axios from 'axios';

const BASE_URL = '/api/v1';

const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

const getAuthHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
});

/**
 * GET /financials
 * Returns all financial records (department credit-hour prices).
 * @param {string} [departmentId] - optional UUID to filter by department
 */
export const getFinancials = async (departmentId) => {
  const params = {};
  if (departmentId) params.departmentId = departmentId;
  const response = await api.get('/financials', {
    headers: getAuthHeaders(),
    params,
  });
  return response.data; // { financials: [...] }
};

/**
 * GET /financials/:id
 * Returns a single financial record by ID.
 * @param {number} id
 */
export const getFinancialById = async (id) => {
  const response = await api.get(`/financials/${id}`, {
    headers: getAuthHeaders(),
  });
  return response.data;
};

/**
 * POST /financials
 * Creates a new credit-hour pricing record for a department.
 * @param {{ department_id: string, credit_price: number }} payload
 */
export const createFinancial = async (payload) => {
  const response = await api.post('/financials', payload, {
    headers: getAuthHeaders(),
  });
  return response.data;
};

/**
 * PATCH /financials/:id
 * Updates the credit_price of an existing financial record.
 * @param {number} id
 * @param {number} credit_price
 */
export const updateFinancial = async (id, credit_price) => {
  const response = await api.patch(
    `/financials/${id}`,
    { credit_price },
    { headers: getAuthHeaders() }
  );
  return response.data;
};

/**
 * DELETE /financials/:id
 * Deletes a financial record. Admin / super_admin only.
 * @param {number} id
 */
export const deleteFinancial = async (id) => {
  const response = await api.delete(`/financials/${id}`, {
    headers: getAuthHeaders(),
  });
  return response.data;
};
