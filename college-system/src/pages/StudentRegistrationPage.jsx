
import { useState, useEffect } from 'react';
import CourseTableRegistration from '../components/student/StuentRegestration/CourseTable';
import AvailableCourses from '../components/student/StuentRegestration/AvailableCourses';
import { getStudentScheduleByWeek } from '../services/scheduleService';
import { getStudentCourses, getAvailableOfferings, getStudentLabs } from '../services/registrationService';

export default function StudentRegistrationPage() {
    const [enrolledCourses, setEnrolledCourses] = useState([]);
    const [loadingEnrolled, setLoadingEnrolled] = useState(true);

    // When set, AvailableCourses will automatically open lab selection.
    // Contains { courseCode, realLectureId } so the register-lab API can be called.
    const [courseNeedingLabReselect, setCourseNeedingLabReselect] = useState(null);

    // Queue of additional courses that also need lab assignment (processed after the first).
    const [pendingLabQueue, setPendingLabQueue] = useState([]);

    useEffect(() => {
        const loadEnrolledCourses = async () => {
            try {
                setLoadingEnrolled(true);

                // Fetch schedule, credits, labs (for reliable lab IDs), and offerings (for lecture-only IDs) in parallel
                const [scheduleData, studentCoursesData, studentLabsData, offeringsData] = await Promise.all([
                    getStudentScheduleByWeek(0),
                    getStudentCourses(),
                    getStudentLabs(),
                    getAvailableOfferings(),
                ]);

                // courseCode → credits
                const creditsMap = {};
                // courseCode → lecture section ID  ← primary source for register-lab / unregister calls
                const lectureIdMap = {};
                (studentCoursesData.courses ?? []).forEach(c => {
                    if (c.status === 'enrolled') {
                        creditsMap[c.code] = c.credits ?? 0;
                        lectureIdMap[c.code] = c.id; // id = lecture section ID
                    }
                });

                // courseCode → real lab section ID (from /courses/student/labs — most reliable source)
                const labsMap = {};
                (studentLabsData.labs ?? []).forEach(lab => {
                    labsMap[lab.code] = lab.id;
                });

                // courseCode → offering (fallback: get lecture section ID for lecture-only courses)
                const offeringsMap = {};
                (offeringsData.offerings ?? offeringsData ?? []).forEach(o => {
                    offeringsMap[o.courseCode] = o;
                });

                const schedule = scheduleData.schedule ?? [];
                const enrolled = [];

                schedule.forEach(dayEntry => {
                    const { day, classes = [] } = dayEntry;
                    classes.forEach(cls => {
                        const isLab = cls.type === 'lab';
                        const uid = `${cls.courseCode}-${day}-${cls.startTime}`;

                        // Normalize helpers — schedule API and offerings may use different
                        // day-name formats ("Thu" vs "Thursday") and time formats ("10:00" vs "10:00:00").
                        const normDay = (d = '') => d.trim().toLowerCase().slice(0, 3); // "Thursday" → "thu"
                        const normTime = (t = '') => t.trim().slice(0, 5);             // "10:00:00" → "10:00"

                        // Match this schedule entry against available-offerings lecture sections
                        const offering = offeringsMap[cls.courseCode];
                        const lectureSections = offering?.lectures ?? [];
                        const matchedLecture = lectureSections.find(
                            s =>
                                normDay(s.day_of_week) === normDay(day) &&
                                normTime(s.start_time) === normTime(cls.startTime)
                        );

                        enrolled.push({
                            lectureId: uid,
                            labId: isLab ? uid : null,
                            course: cls.courseCode,
                            courseName: cls.courseName,
                            instructor: cls.instructor,
                            schedule: `${day} ${cls.startTime}-${cls.endTime}`,
                            credits: isLab ? 0 : (creditsMap[cls.courseCode] ?? 0),
                            isLab,
                            location: cls.location ?? null,
                            // Reliable lab ID from /courses/student/labs
                            realLabId: labsMap[cls.courseCode] ?? null,
                            // Lecture section ID — prefer /courses/student (direct, no string matching)
                            // then fall back to day/time matching against available-offerings.
                            realSectionId: lectureIdMap[cls.courseCode] ?? matchedLecture?.id ?? null,
                        });
                    });
                });

                setEnrolledCourses(enrolled);

                // ── Detect courses enrolled without a lab ───────────────────────────
                // A course needs lab selection when:
                //   • it has a lecture entry in the schedule (isLab=false)
                //   • it has NO lab entry in the schedule (type !== 'lab')
                //   • the available offering defines labs (so it's not a lecture-only course)
                const scheduledLectureCodes = new Set(
                    enrolled.filter(e => !e.isLab).map(e => e.course)
                );
                const scheduledLabCodes = new Set(
                    enrolled.filter(e => e.isLab).map(e => e.course)
                );

                const needsLabQueue = [];
                scheduledLectureCodes.forEach(code => {
                    if (!scheduledLabCodes.has(code)) {
                        const offering = offeringsMap[code];
                        if ((offering?.labs ?? []).length > 0) {
                            const lectureEntry = enrolled.find(e => !e.isLab && e.course === code);
                            needsLabQueue.push({
                                courseCode: code,
                                realLectureId: lectureEntry?.realSectionId ?? null,
                            });
                        }
                    }
                });

                if (needsLabQueue.length > 0) {
                    setCourseNeedingLabReselect(needsLabQueue[0]);
                    setPendingLabQueue(needsLabQueue.slice(1));
                }
            } catch {
                // Show empty table on failure — user can still add new courses
            } finally {
                setLoadingEnrolled(false);
            }
        };

        loadEnrolledCourses();
    }, []);

    const handleAddCourse = (course) => {
        setEnrolledCourses(prev =>
            prev.find(c => c.lectureId === course.lectureId)
                ? prev
                : [...prev, course]
        );
    };

    /**
     * Called by CourseTable after the API unregister call succeeds.
     * removeType: 'lecture' → remove the whole course (lecture + any lab).
     * removeType: 'lab'     → remove only lab entries; keep lecture; prompt lab reselection.
     */
    const handleRemoveCourse = (course, removeType) => {
        if (removeType === 'lecture') {
            // Lecture unregistration removes both lecture and lab server-side
            setEnrolledCourses(prev => prev.filter(c => c.course !== course.course));
        } else {
            // Lab removed — keep the lecture, remove lab entry from the grid,
            // then queue this course for lab re-selection.
            setEnrolledCourses(prev => prev.filter(c => !(c.isLab && c.course === course.course)));

            const lectureEntry = enrolledCourses.find(c => !c.isLab && c.course === course.course);
            const newItem = {
                courseCode: course.course,
                realLectureId: lectureEntry?.realSectionId ?? null,
            };
            // If another course is already pending in the picker, append to queue.
            // Otherwise, trigger immediately so AvailableCourses opens the picker.
            if (courseNeedingLabReselect) {
                setPendingLabQueue(q => [...q, newItem]);
            } else {
                setCourseNeedingLabReselect(newItem);
            }
        }
    };

    return (
        <div className="max-w-8xl px-4 sm:px-6 md:px-8 py-4 sm:py-6">
            <div className="bg-white rounded-xl shadow-sm p-8 border border-gray-200">
                <h1 className="text-3xl font-bold text-slate-900 mb-6">Course Registration</h1>

                {/* Registered Courses Section */}
                <div className="mb-8 sm:mb-10 md:mb-12">
                    {loadingEnrolled ? (
                        <div className="animate-pulse">
                            <div className="h-6 bg-gray-200 rounded w-40 mb-4" />
                            <div className="bg-gray-100 rounded-xl h-48 border border-gray-200" />
                        </div>
                    ) : (
                        <CourseTableRegistration
                            enrolledCourses={enrolledCourses}
                            onRemoveCourse={handleRemoveCourse}
                        />
                    )}
                </div>

                {/* Available Courses Section */}
                <div className="mt-8 sm:mt-10 md:mt-12">
                    <AvailableCourses
                        enrolledCourses={enrolledCourses}
                        onAddCourse={handleAddCourse}
                        courseNeedingLabReselect={courseNeedingLabReselect}
                        onClearLabReselect={() => {
                            if (pendingLabQueue.length > 0) {
                                const [next, ...rest] = pendingLabQueue;
                                setPendingLabQueue(rest);
                                setCourseNeedingLabReselect(next);
                            } else {
                                setCourseNeedingLabReselect(null);
                            }
                        }}
                    />
                </div>
            </div>
        </div>
    );
}