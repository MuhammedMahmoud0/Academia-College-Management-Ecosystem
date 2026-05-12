import apiClient from './apiClient';

const authHeaders = () => ({});  // token auto-attached by apiClient interceptor

/**
 * POST /tasks
 * Create a new task linked to a lecture or tutorial/lab.
 * Exactly one of lecture_id or tutorial_lab_id must be non-zero.
 *
 * @param {{ title: string, description: string, due_date: string, lecture_id?: number, tutorial_lab_id?: number }} taskData
 * @returns {Promise<{ message: string, task: object }>}
 */
export const createTask = async (taskData) => {
  const response = await apiClient.post('/tasks', taskData);
  return response.data;
};

/**
 * GET /tasks
 * Retrieve tasks for a lecture or tutorial/lab.
 * Provide exactly one of lecture_id or tutorial_lab_id.
 *
 * @param {{ lecture_id?: number, tutorial_lab_id?: number }} params
 * @returns {Promise<{ tasks: object[], total: number }>}
 */
export const getTasks = async (params = {}) => {
  const response = await apiClient.get('/tasks', { params });
  return response.data;
};

/**
 * GET /tasks/{taskId}
 * Get a single task by its ID.
 *
 * @param {number} taskId
 * @returns {Promise<object>} task object
 */
export const getTaskById = async (taskId) => {
  const response = await apiClient.get(`/tasks/${taskId}`);
  return response.data;
};

/**
 * PUT /tasks/{taskId}
 * Update a task (title, description, due_date).
 *
 * @param {number} taskId
 * @param {{ title?: string, description?: string, due_date?: string }} updates
 * @returns {Promise<{ message: string, task: object }>}
 */
export const updateTask = async (taskId, updates) => {
  const response = await apiClient.put(`/tasks/${taskId}`, updates);
  return response.data;
};

/**
 * DELETE /tasks/{taskId}
 * Delete a task by its ID.
 *
 * @param {number} taskId
 * @returns {Promise<{ message: string }>}
 */
export const deleteTask = async (taskId) => {
  const response = await apiClient.delete(`/tasks/${taskId}`);
  return response.data;
};

/**
 * Helper: Extract all unique lecture and tutorial/lab slots from the teacher's
 * schedule response so the UI can show friendly names instead of raw IDs.
 *
 * Returns an array of option objects:
 *   { id, type ('lecture'|'tutorial'|'lab'), courseCode, courseName, label, day, startTime, endTime }
 *
 * @param {object} scheduleData - Response from getTeacherSchedule()
 * @returns {Array}
 */
export const extractScheduleOptions = (scheduleData) => {
  if (!scheduleData || !scheduleData.schedule) return [];

  const options = [];
  const seen = new Set(); // avoid duplicates (same id can appear on multiple days)

  scheduleData.schedule.forEach((daySchedule) => {
    if (!Array.isArray(daySchedule.slots)) return;

    daySchedule.slots.forEach((slot) => {
      if (slot.lectureId) {
        const key = `lecture-${slot.lectureId}`;
        if (!seen.has(key)) {
          seen.add(key);
          options.push({
            id: slot.lectureId,
            type: 'lecture',
            courseCode: slot.courseCode,
            courseName: slot.courseName,
            day: daySchedule.day,
            startTime: slot.startTime,
            endTime: slot.endTime,
            location: slot.location,
            label: `[Lecture] ${slot.courseName} (${slot.courseCode}) — ${daySchedule.day} ${slot.startTime}`,
          });
        }
      } else if (slot.tutorialLabId) {
        const key = `${slot.type}-${slot.tutorialLabId}`;
        if (!seen.has(key)) {
          seen.add(key);
          options.push({
            id: slot.tutorialLabId,
            type: slot.type, // 'tutorial' | 'lab'
            courseCode: slot.courseCode,
            courseName: slot.courseName,
            day: daySchedule.day,
            startTime: slot.startTime,
            endTime: slot.endTime,
            location: slot.location,
            label: `[${slot.type.charAt(0).toUpperCase() + slot.type.slice(1)}] ${slot.courseName} (${slot.courseCode}) — ${daySchedule.day} ${slot.startTime}`,
          });
        }
      }
    });
  });

  return options;
};

/**
 * GET /tasks/{taskId}/submissions
 * Get all submissions for a task (staff only).
 *
 * @param {number} taskId
 * @returns {Promise<{ submissions: object[], total: number }>}
 */
export const getTaskSubmissions = async (taskId) => {
  const response = await apiClient.get(`/tasks/${taskId}/submissions`);
  return response.data;
};

/**
 * PUT /tasks/{taskId}/submissions/{submissionId}/grade
 * Assign a numeric grade to a student's submission.
 *
 * @param {number} taskId
 * @param {number} submissionId
 * @param {number} grade
 * @returns {Promise<{ message: string, submission: object }>}
 */
export const gradeSubmission = async (taskId, submissionId, grade) => {
  const response = await apiClient.put(
    `/tasks/${taskId}/submissions/${submissionId}/grade`,
    { grade }
  );
  return response.data;
};

// ─────────────────────────────────────────────────────────────────────────────
// Student-facing endpoints
// ─────────────────────────────────────────────────────────────────────────────

/**
 * GET /tasks/my/available
 * Returns all tasks available to the authenticated student through their
 * enrollments. Each task includes a `my_submission` field (null if not yet
 * submitted, or the submission object if already submitted).
 *
 * @returns {Promise<{ count: number, tasks: object[] }>}
 */
export const getMyAvailableTasks = async () => {
  const response = await apiClient.get('/tasks/my/available');
  return response.data;
};

/**
 * POST /tasks/{taskId}/submit
 * Submit (or re-submit / edit) a solution for a task.
 *
 * @param {number} taskId
 * @param {string} submissionContent - Link or plain-text answer
 * @returns {Promise<{ message: string, submission: object }>}
 */
export const submitTask = async (taskId, submissionContent) => {
  const response = await apiClient.post(
    `/tasks/${taskId}/submit`,
    { submission_content: submissionContent }
  );
  return response.data;
};

/**
 * GET /tasks/{taskId}/my-submission
 * Get the authenticated student's own submission for a specific task.
 * Returns 404 if no submission exists yet.
 *
 * @param {number} taskId
 * @returns {Promise<object>} submission object
 */
export const getMySubmission = async (taskId) => {
  const response = await apiClient.get(`/tasks/${taskId}/my-submission`);
  return response.data;
};

/**
 * DELETE /tasks/{taskId}/my-submission
 * Delete the authenticated student's own submission.
 * Only allowed before the task due_date.
 *
 * @param {number} taskId
 * @returns {Promise<{ message: string }>}
 */
export const deleteMySubmission = async (taskId) => {
  const response = await apiClient.delete(`/tasks/${taskId}/my-submission`);
  return response.data;
};
