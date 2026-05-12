import apiClient from './apiClient';

// GET /config/calendar — optional filters: { semester, academic_year, event_type }
export const getCalendarEvents = async (filters = {}) => {
  const params = {};
  if (filters.semester) params.semester = filters.semester;
  if (filters.academic_year) params.academic_year = filters.academic_year;
  if (filters.event_type) params.event_type = filters.event_type;

  const response = await apiClient.get('/config/calendar', { params });
  return response.data;
};

// POST /config/calendar — create a new event
export const createCalendarEvent = async (eventData) => {
  const response = await apiClient.post('/config/calendar', eventData);
  return response.data;
};

// PATCH /config/calendar/:id — update an existing event
export const updateCalendarEvent = async (id, eventData) => {
  const response = await apiClient.patch(`/config/calendar/${id}`, eventData);
  return response.data;
};

// DELETE /config/calendar/:id — delete an event
export const deleteCalendarEvent = async (id) => {
  const response = await apiClient.delete(`/config/calendar/${id}`);
  return response.data;
};

// POST /config/registration-open — notify all students that registration is open
export const notifyRegistrationOpen = async () => {
  const response = await apiClient.post('/config/registration-open', {});
  return response.data;
};
