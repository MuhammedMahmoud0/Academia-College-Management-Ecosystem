import { useState, useEffect } from 'react';
import { getAvailableOfferings, registerCourses, registerLab } from '../../../services/registrationService';
import { useToast } from '../../../hooks/useToast';

// ── Skeleton card while loading ─────────────────────────────────────────────
function SkeletonCard() {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 animate-pulse">
      <div className="flex justify-between mb-3">
        <div className="h-4 bg-gray-200 rounded w-2/3" />
        <div className="h-5 bg-gray-200 rounded w-14" />
      </div>
      <div className="h-3 bg-gray-200 rounded w-1/2 mb-4" />
      <div className="h-3 bg-gray-200 rounded w-3/4 mb-2" />
      <div className="h-3 bg-gray-200 rounded w-1/3 mb-5" />
      <div className="h-9 bg-gray-200 rounded-lg" />
    </div>
  );
}

// ── Single available-course card ─────────────────────────────────────────────
function CourseCard({ offering, isEnrolled, onAdd }) {
  const firstLecture = offering.lectures?.[0];
  const totalCapacity = offering.lectures?.reduce((s, l) => s + (l.capacity || 0), 0) ?? 0;
  const totalEnrolled = offering.lectures?.reduce((s, l) => s + (l.enrolled || 0), 0) ?? 0;
  const full = totalCapacity > 0 && totalEnrolled >= totalCapacity;

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow p-5 flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-sm font-semibold text-gray-900 leading-tight pr-2">
          {offering.courseName}
        </h3>
        <span className="shrink-0 text-xs font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
          {offering.courseCode}
        </span>
      </div>

      {/* Instructor */}
      {firstLecture && (
        <p className="text-xs text-gray-500 mb-3">with {firstLecture.instructor}</p>
      )}

      {/* Schedule snippet */}
      {firstLecture && (
        <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-1">
          <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {firstLecture.day_of_week} {firstLecture.start_time}–{firstLecture.end_time}
        </div>
      )}

      {/* Credits + capacity */}
      <div className="flex justify-between items-center text-xs mt-1 mb-4">
        <span className="font-medium text-gray-700">{offering.creditHours} Credits</span>
        <span className={`font-medium ${full ? 'text-red-500' : 'text-gray-500'}`}>
          {totalEnrolled}/{totalCapacity} Registered
        </span>
      </div>

      {/* Action button */}
      <button
        disabled={full || isEnrolled}
        onClick={() => onAdd(offering)}
        className={`mt-auto w-full py-2 rounded-lg text-sm font-semibold transition-colors cursor-pointer flex items-center justify-center gap-2
          ${isEnrolled
            ? 'bg-emerald-50 text-emerald-600 border border-emerald-200 cursor-default'
            : full
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-indigo-600 hover:bg-indigo-700 text-white'
          }`}
      >
        {isEnrolled ? (
          <>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            Enrolled
          </>
        ) : full ? 'Full' : (
          <>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Add Course
          </>
        )}
      </button>
    </div>
  );
}

// ── Single lab/lecture section card ──────────────────────────────────────────
function SectionCard({ section, onSelect, loading }) {
  const spotsLeft = (section.capacity || 0) - (section.enrolled || 0);
  const full = spotsLeft <= 0;

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow p-5 flex flex-col">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
          Group {section.group_number}
        </span>
        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${full ? 'bg-red-100 text-red-600' : 'bg-emerald-100 text-emerald-600'}`}>
          {full ? 'Full' : `${spotsLeft} spots left`}
        </span>
      </div>

      <div className="space-y-1.5 mb-4 text-xs text-gray-600">
        {/* Day & time */}
        <div className="flex items-center gap-1.5">
          <svg className="w-3.5 h-3.5 shrink-0 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{section.day_of_week} {section.start_time}–{section.end_time}</span>
        </div>
        {/* Location */}
        {section.location && (
          <div className="flex items-center gap-1.5">
            <svg className="w-3.5 h-3.5 shrink-0 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span>{section.location}</span>
          </div>
        )}
        {/* Instructor */}
        {section.instructor && (
          <div className="flex items-center gap-1.5">
            <svg className="w-3.5 h-3.5 shrink-0 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <span>{section.instructor}</span>
          </div>
        )}
      </div>

      <button
        disabled={full || loading}
        onClick={() => onSelect(section)}
        className={`mt-auto w-full py-2 rounded-lg text-sm font-semibold transition-colors cursor-pointer
          ${full
            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
            : 'bg-indigo-600 hover:bg-indigo-700 text-white'
          }`}
      >
        {loading ? 'Registering…' : 'Select'}
      </button>
    </div>
  );
}

// ── Main component ───────────────────────────────────────────────────────────
export default function AvailableCourses({
  enrolledCourses = [],
  onAddCourse,
  courseNeedingLabReselect = null,
  onClearLabReselect,
}) {
  const toast = useToast();
  const [offerings, setOfferings] = useState([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState(null);

  // 'courses'  → show all course cards
  // 'lectures' → show lecture section picker
  // 'labs'     → show lab section picker
  const [view, setView]                         = useState('courses');
  const [selectedOffering, setSelectedOffering] = useState(null);
  const [selectedLecture, setSelectedLecture]   = useState(null);
  const [registering, setRegistering]           = useState(false);
  // True when re-selecting a lab for an already-enrolled lecture
  const [isLabReselect, setIsLabReselect]       = useState(false);
  // Real lecture section ID needed by POST /registration/register-lab during reselect
  const [reselectLectureId, setReselectLectureId] = useState(null);

  // ── Fetch available offerings on mount ──────────────────────────────────
  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const data = await getAvailableOfferings();
        // API returns { semester, offerings: [...] }
        setOfferings(data.offerings ?? data ?? []);
      } catch (err) {
        setError(err?.response?.data?.error || 'Failed to load available courses.');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  // ── Auto-open lab selection when a course has no lab assigned ──────────
  useEffect(() => {
    if (!courseNeedingLabReselect || loading || offerings.length === 0) return;
    // Guard: don't re-trigger if we're already handling a reselect
    if (isLabReselect) return;

    const { courseCode, realLectureId } = courseNeedingLabReselect;
    const offering = offerings.find(o => o.courseCode === courseCode);

    if (offering?.labs?.length > 0) {
      setSelectedLecture(offering.lectures?.[0] ?? null);
      setSelectedOffering(offering);
      setIsLabReselect(true);
      // realLectureId now comes directly from GET /courses/student (no string matching)
      setReselectLectureId(realLectureId ?? null);
      setView('labs');
      // NOTE: do NOT call onClearLabReselect here.
      // It is called in handleSelectLab after the user actually picks a lab,
      // so the queue isn't advanced until the current selection is complete.
    } else {
      // Offering not found or has no labs — skip this entry and advance the queue.
      onClearLabReselect?.();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courseNeedingLabReselect, loading, offerings]);

  const enrolledCourseCodes = new Set(enrolledCourses.map(c => c.course));

  // ── Step 1: user clicks "Add Course" → always show lecture picker first ──
  const handleAddCourse = (offering) => {
    setSelectedOffering(offering);
    // Always let the user pick their lecture group first
    if ((offering.lectures ?? []).length > 0) {
      setView('lectures');
    } else if ((offering.labs ?? []).length > 0) {
      // Edge case: labs but no lectures
      setView('labs');
    }
  };

  // ── Step 2a: user picks a lecture ─────────────────────────────────────────
  const handleSelectLecture = async (lecture) => {
    // If this course also has labs, save the lecture and move to lab picker.
    // Registration happens only after both lecture + lab are chosen.
    if ((selectedOffering?.labs ?? []).length > 0) {
      setSelectedLecture(lecture);
      setView('labs');
      return;
    }

    // No labs — register the lecture-only course immediately.
    setRegistering(true);
    try {
      await registerCourses([lecture.id], []);
    } catch (err) {
      const msg = err?.response?.data?.error || 'Registration failed. Please try again.';
      toast.error(msg, 6000);
      setRegistering(false);
      return; // stop — do not add to schedule
    }
    onAddCourse?.({
      lectureId: lecture.id,
      labId: null,
      course: selectedOffering.courseCode,
      courseName: selectedOffering.courseName ?? selectedOffering.courseCode,
      instructor: lecture.instructor,
      schedule: `${lecture.day_of_week} ${lecture.start_time}-${lecture.end_time}`,
      location: lecture.location ?? null,
      credits: selectedOffering.creditHours,
      isLab: false,
      realSectionId: lecture.id, // for future DELETE { lectureId }
    });
    toast.success(`Successfully registered for ${selectedOffering.courseName ?? selectedOffering.courseCode}!`);
    setRegistering(false);
    setView('courses');
    setSelectedOffering(null);
    setSelectedLecture(null);
  };

  // ── Step 2b: user picks a lab ───────────────────────────────────────────
  const handleSelectLab = async (lab) => {
    setRegistering(true);
    try {
      if (isLabReselect) {
        // Lecture already enrolled — assign only the new lab via register-lab endpoint.
        if (!reselectLectureId) {
          toast.error('Could not determine your lecture enrollment ID. Please refresh the page and try again.', 6000);
          setRegistering(false);
          return;
        }
        await registerLab(reselectLectureId, lab.id);
      } else {
        // New registration: lecture + lab must be registered together.
        await registerCourses([selectedLecture.id], [lab.id]);
      }
    } catch (err) {
      const msg = err?.response?.data?.error || 'Registration failed. Please try again.';
      toast.error(msg, 6000);
      setRegistering(false);
      return; // stop — do not add to schedule
    }

    // ── Lecture slot entry (only for new registrations, not reselect) ────
    if (!isLabReselect && selectedLecture) {
      onAddCourse?.({
        lectureId: selectedLecture.id,
        labId: lab.id,
        course: selectedOffering.courseCode,
        courseName: selectedOffering.courseName ?? selectedOffering.courseCode,
        instructor: selectedLecture.instructor,
        schedule: `${selectedLecture.day_of_week} ${selectedLecture.start_time}-${selectedLecture.end_time}`,
        location: selectedLecture.location ?? null,
        credits: selectedOffering.creditHours,
        isLab: false,
        realSectionId: selectedLecture.id, // for DELETE { lectureId }
        realLabId: lab.id,                 // so lab ID is known if lecture is later removed
      });
    }

    // ── Lab slot entry (both new registration and reselect) ──────────────
    onAddCourse?.({
      lectureId: `lab_${lab.id}`,
      labId: lab.id,
      course: selectedOffering.courseCode,
      courseName: selectedOffering.courseName ?? selectedOffering.courseCode,
      instructor: lab.instructor,
      schedule: `${lab.day_of_week} ${lab.start_time}-${lab.end_time}`,
      location: lab.location ?? null,
      credits: 0, // credits are on the lecture entry only
      isLab: true,
      realLabId: lab.id,                            // for DELETE { tutorialLabId }
      realSectionId: selectedLecture?.id ?? null,   // companion lecture ID
    });

    toast.success(`Successfully registered for ${selectedOffering.courseName ?? selectedOffering.courseCode}!`);
    setRegistering(false);
    setIsLabReselect(false);
    setReselectLectureId(null);
    setView('courses');
    setSelectedOffering(null);
    setSelectedLecture(null);
    // If this was a forced lab selection (from page load or after removal),
    // advance the queue so the next pending course (if any) is processed.
    if (isLabReselect) onClearLabReselect?.();
  };

  // ── Back button ──────────────────────────────────────────────────────────
  const handleBack = () => {
    setView('courses');
    setSelectedOffering(null);
    setSelectedLecture(null);
    setIsLabReselect(false);
  };

  // ── Render ───────────────────────────────────────────────────────────────
  return (
    <div className="w-full">
      {/* ── Section header ── */}
      <div className="flex items-center gap-3 mb-6">
        {/* Back arrow: allowed on lectures view; hidden on labs view (must pick a lab) */}
        {view === 'lectures' && (
          <button
            onClick={handleBack}
            className="flex items-center gap-1 text-sm text-indigo-600 hover:text-indigo-800 font-medium cursor-pointer"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </button>
        )}
        <h2 className="text-2xl font-bold text-slate-900">
          {view === 'courses'
            ? 'Available Courses'
            : view === 'lectures'
              ? `Select a Lecture Group — ${selectedOffering?.courseCode}`
              : isLabReselect
                ? `Re-select Lab — ${selectedOffering?.courseCode}`
                : `Select a Lab Group — ${selectedOffering?.courseCode}`}
        </h2>
        {/* Cancel: shown in labs view for new registrations.
            Hidden during reselect — user must pick a new lab after removing one. */}
        {view === 'labs' && !isLabReselect && (
          <button
            onClick={handleBack}
            className="ml-auto text-sm text-gray-500 hover:text-gray-700 font-medium cursor-pointer"
          >
            Cancel
          </button>
        )}
      </div>

      {/* ── Mandatory lab selection banner ── */}
      {view === 'labs' && isLabReselect && (
        <div className="mb-5 flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-lg px-4 py-3 text-sm text-amber-800">
          <svg className="w-5 h-5 shrink-0 mt-0.5 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
          </svg>
          <span>
            <strong>Lab selection required</strong> — you are enrolled in{' '}
            <strong>{selectedOffering?.courseName ?? selectedOffering?.courseCode}</strong> but no lab has been assigned yet.
            Please select a lab group to continue.
          </span>
        </div>
      )}

      {/* ── Error ── */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
          {error}
        </div>
      )}

      {/* ── Course cards view ── */}
      {view === 'courses' && (
        <>
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
            </div>
          ) : offerings.length === 0 ? (
            <div className="text-center py-16 text-gray-400">
              <svg className="w-10 h-10 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <p className="text-sm font-medium">No available courses at this time</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {offerings.map(offering => (
                <CourseCard
                  key={offering.courseCode}
                  offering={offering}
                  isEnrolled={enrolledCourseCodes.has(offering.courseCode)}
                  onAdd={handleAddCourse}
                />
              ))}
            </div>
          )}
        </>
      )}

      {/* ── Lecture groups view (courses with no labs) ── */}
      {view === 'lectures' && selectedOffering && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {(selectedOffering.lectures ?? []).map(lec => (
            <SectionCard
              key={lec.id}
              section={lec}
              onSelect={handleSelectLecture}
              loading={registering}
            />
          ))}
        </div>
      )}

      {/* ── Lab groups view ── */}
      {view === 'labs' && selectedOffering && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {(selectedOffering.labs ?? []).map(lab => (
            <SectionCard
              key={lab.id}
              section={lab}
              onSelect={handleSelectLab}
              loading={registering}
            />
          ))}
        </div>
      )}
    </div>
  );
}
