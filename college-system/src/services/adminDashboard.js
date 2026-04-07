import axios from 'axios';

const BASE_URL = '/api/v1';

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

const getAuthHeaders = () => {
  const token = localStorage.getItem('auth_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// GET /admin/alerts — Get system alerts (needs attention)
// Response: { count, data: [{ priority, message, link }] }
export const getAdminAlerts = async () => {
  const response = await api.get('/admin/alerts', {
    headers: getAuthHeaders(),
  });
  return response.data;
};

// GET /admin/activity — Get recent activity feed
// Params: limit (max 50, default 10)
// Response: { count, data: [{ type, timestamp, description, link }] }
export const getAdminActivity = async (limit = 10) => {
  const response = await api.get('/admin/activity', {
    headers: getAuthHeaders(),
    params: { limit },
  });
  return response.data;
};

// GET /admin/stats/enrollment-trends — Get enrollment trends by year
// Params: from (default 2021), to (default current year)
// Response: { data: [{ year, student_count }] }
export const getEnrollmentTrends = async (from = 2021, to = new Date().getFullYear()) => {
  const response = await api.get('/admin/stats/enrollment-trends', {
    headers: getAuthHeaders(),
    params: { from, to },
  });
  return response.data;
};

// GET /admin/stats/payment-aging — Get outstanding payment aging buckets
// Response: { total_overdue_students, data: [{ label, student_count }] }
export const getPaymentAging = async () => {
  const response = await api.get('/admin/stats/payment-aging', {
    headers: getAuthHeaders(),
  });
  return response.data;
};

// POST /admin/reports/{reportType} — Generate an admin report and return JSON data
// reportType: 'student-reports' | 'academic-transcript' | 'revenue' | 'retention' | 'faculty-workload' | 'course-popularity'
// body: optional filters e.g. { department_id, limit, student_id, ... }
// Response: { report_type, generated_at, total, data: [...] }
export const generateReport = async (reportType, body = {}) => {
  const response = await api.post(`/admin/reports/${reportType}`, body, {
    headers: getAuthHeaders(),
  });
  return response.data;
};
