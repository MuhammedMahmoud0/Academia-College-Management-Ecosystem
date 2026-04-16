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
 * GET /payments/invoices/me
 * Returns invoices, grouped-by-semester view, summary totals,
 * and current registration/payment period status.
 * @param {string} [status] - optional filter: 'pending' | 'paid' | 'overdue'
 */
export const getMyInvoices = async (status) => {
  const params = {};
  if (status) params.status = status;

  const response = await api.get('/payments/invoices/me', {
    headers: getAuthHeaders(),
    params,
  });
  return response.data;
};

/**
 * GET /payments/me
 * Returns semester-level payment records (payment history) for the current student.
 */
export const getMyPaymentHistory = async () => {
  const response = await api.get('/payments/me', {
    headers: getAuthHeaders(),
  });
  return response.data;
};

/**
 * POST /payments/invoices/paymob-order
 * Creates a Paymob checkout session covering ALL pending invoices.
 * Returns iframeUrl to redirect the student into the Paymob hosted payment page.
 * @param {boolean} payAll - should always be true (all-or-nothing)
 */
export const createPaymobOrder = async (payAll = true) => {
  const response = await api.post(
    '/payments/invoices/paymob-order',
    { payAll },
    { headers: getAuthHeaders() }
  );
  return response.data;
};
