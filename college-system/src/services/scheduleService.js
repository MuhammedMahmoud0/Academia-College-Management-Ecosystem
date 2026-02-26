import axios from 'axios';

// Use proxy in development, full URL in production
const BASE_URL = import.meta.env.DEV 
  ? '/api/v1' 
  : import.meta.env.VITE_API_URL;

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Get authorization token from localStorage
const getAuthToken = () => {
  return localStorage.getItem('auth_token');
};

/**
 * Get teacher's schedule (Doctor/TA can view their own schedule only)
 * @returns {Promise} Object containing teacherId, teacherName, and schedule data
 */
export const getTeacherSchedule = async () => {
  const token = getAuthToken();
  const response = await api.get('/teachers/schedule', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

/**
 * Get student's schedule (Student can view their own schedule only)
 * @returns {Promise} Object containing student schedule data
 */
export const getStudentSchedule = async () => {
  const token = getAuthToken();
  const response = await api.get('/students/schedule', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
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
