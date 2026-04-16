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
  if (!token) throw new Error('No authentication token found');
  return { Authorization: `Bearer ${token}` };
};

// GET /config/calendar — optional filters: { semester, academic_year, event_type }
export const getCalendarEvents = async (filters = {}) => {
  const params = {};
  if (filters.semester) params.semester = filters.semester;
  if (filters.academic_year) params.academic_year = filters.academic_year;
  if (filters.event_type) params.event_type = filters.event_type;

  const response = await api.get('/config/calendar', {
    headers: getAuthHeaders(),
    params,
  });
  return response.data;
};

// POST /config/calendar — create a new event
export const createCalendarEvent = async (eventData) => {
  const response = await api.post('/config/calendar', eventData, {
    headers: getAuthHeaders(),
  });
  return response.data;
};

// PATCH /config/calendar/:id — update an existing event
export const updateCalendarEvent = async (id, eventData) => {
  const response = await api.patch(`/config/calendar/${id}`, eventData, {
    headers: getAuthHeaders(),
  });
  return response.data;
};

// DELETE /config/calendar/:id — delete an event
export const deleteCalendarEvent = async (id) => {
  const response = await api.delete(`/config/calendar/${id}`, {
    headers: getAuthHeaders(),
  });
  return response.data;
};

// POST /config/registration-open — notify all students that registration is open
export const notifyRegistrationOpen = async () => {
  const response = await api.post('/config/registration-open', {}, {
    headers: getAuthHeaders(),
  });
  return response.data;
};
