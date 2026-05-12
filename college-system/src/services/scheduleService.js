import apiClient from './apiClient';

/**
 * Get teacher's schedule (Doctor/TA can view their own schedule only)
 * @returns {Promise} Object containing teacherId, teacherName, and schedule data
 */
export const getTeacherSchedule = async () => {
  const response = await apiClient.get('/teachers/schedule');
  return response.data;
};

/**
 * Get student's schedule (Student can view their own schedule only)
 * @returns {Promise} Object containing student schedule data
 */
export const getStudentSchedule = async () => {
  const response = await apiClient.get('/students/schedule');
  return response.data;
};

/**
 * GET /schedule
 * @param {number} weekOffset  0 = current week, 1 = next week, -1 = previous week
 * @returns {Promise<{ schedule: Array<{ day: string, date: string, classes: Array }> }>}
 */
export const getStudentScheduleByWeek = async (weekOffset = 0) => {
  // Only send the `week` param when it's non-zero; passing 0 causes a 500 on
  // some backend versions that don't handle an explicit zero offset.
  const params = weekOffset !== 0 ? { week: weekOffset } : undefined;
  const response = await apiClient.get('/schedule', { params });
  return response.data; // { schedule: [{ day, date, classes: [...] }] }
};

/**
 * Get student's exam schedule (Student can view their own exams only)
 * @returns {Promise} Object containing exam schedule data
 */
export const getStudentExamSchedule = async () => {
  const response = await apiClient.get('/exams/schedule');
  return response.data; // { success, count, data: [...] }
};

/**
 * Extract unique courses from teacher schedule
 * Groups lectures by course and day
 * @param {Object} scheduleData - Response from getTeacherSchedule
 * @returns {Array} Array of course objects with lecture IDs
 */
export const extractCoursesFromSchedule = (scheduleData) => {
  if (!scheduleData || !scheduleData.schedule) {
    return [];
  }

  const coursesMap = new Map();

  // Iterate through each day's schedule
  scheduleData.schedule.forEach(daySchedule => {
    if (daySchedule.slots && Array.isArray(daySchedule.slots)) {
      daySchedule.slots.forEach(slot => {
        const courseCode = slot.courseCode;

        if (courseCode && slot.lectureId) {
          if (!coursesMap.has(courseCode)) {
            coursesMap.set(courseCode, {
              courseCode: courseCode,
              courseName: slot.courseName,
              lectureIds: [],
              slots: []
            });
          }

          const course = coursesMap.get(courseCode);

          // Add unique lecture IDs
          if (!course.lectureIds.includes(slot.lectureId)) {
            course.lectureIds.push(slot.lectureId);
          }

          // Store slot information
          course.slots.push({
            day: daySchedule.day,
            startTime: slot.startTime,
            endTime: slot.endTime,
            lectureId: slot.lectureId,
            type: slot.type
          });
        }
      });
    }
  });

  return Array.from(coursesMap.values());
};
