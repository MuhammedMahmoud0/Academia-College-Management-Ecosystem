import { useState, useEffect } from 'react';
import ScheduleClassCard from './ScheduleClassCard';
import AddLectureModal from './AddLectureModal';
import AddLabModal from './AddLabModal';
import {
  getAvailableOfferings,
  getAllTeachers,
  createLecture,
  updateLecture,
  deleteLecture,
  createTutorialLab,
  updateTutorialLab,
  deleteTutorialLab,
} from '../../../services/scheduleSessionService';
import { getAllOfferings } from '../../../services/courseOfferingService';
import { useToast } from '../../../hooks/useToast';

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

/** Map the available-offerings API response into a day-keyed grid. */
const buildScheduleGrid = (availableData) => {
  const dayMap = {};
  DAYS.forEach(day => { dayMap[day] = []; });

  if (availableData?.offerings) {
    availableData.offerings.forEach(offering => {
      const { courseName, courseCode } = offering;

      (offering.lectures || []).forEach(lec => {
        const day = lec.day_of_week;
        if (day in dayMap) {
          dayMap[day].push({
            id: lec.id,
            type: 'lecture',
            courseName,
            courseCode,
            startTime: lec.start_time,
            endTime: lec.end_time,
            location: lec.location,
            instructor: lec.instructor,
            capacity: lec.capacity,
            group: lec.group_number,
            dayOfWeek: day,
          });
        }
      });

      (offering.labs || []).forEach(lab => {
        const day = lab.day_of_week;
        if (day in dayMap) {
          dayMap[day].push({
            id: lab.id,
            type: 'lab',
            courseName,
            courseCode,
            startTime: lab.start_time,
            endTime: lab.end_time,
            location: lab.location,
            instructor: lab.instructor,
            capacity: lab.capacity,
            group: lab.group_number,
            dayOfWeek: day,
            labType: lab.type,
          });
        }
      });
    });
  }

  return DAYS.map(day => ({ day, classes: dayMap[day] }));
};

export default function SemesterScheduling() {
  const toast = useToast();

  // ── Data ────────────────────────────────────────────────────────────────────
  const [scheduleGrid, setScheduleGrid] = useState(DAYS.map(day => ({ day, classes: [] })));
  const [semesterLabel, setSemesterLabel] = useState('');
  const [allOfferings, setAllOfferings] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);

  // ── Modal state ─────────────────────────────────────────────────────────────
  const [isLectureModalOpen, setIsLectureModalOpen] = useState(false);
  const [isLabModalOpen, setIsLabModalOpen] = useState(false);
  const [editingLecture, setEditingLecture] = useState(null);
  const [editingLab, setEditingLab] = useState(null);
  const [isSubmittingLecture, setIsSubmittingLecture] = useState(false);
  const [isSubmittingLab, setIsSubmittingLab] = useState(false);

  // ── Initial fetch ────────────────────────────────────────────────────────────
  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      setFetchError(null);
      try {
        const [availableData, offeringsData, teachersData] = await Promise.all([
          getAvailableOfferings(),
          getAllOfferings(),
          getAllTeachers(),
        ]);

        setScheduleGrid(buildScheduleGrid(availableData));
        setSemesterLabel(availableData?.semester || 'Semester Schedule');

        const offerings = Array.isArray(offeringsData)
          ? offeringsData
          : (offeringsData?.data ?? []);
        setAllOfferings(offerings);

        setTeachers(teachersData); // already normalised in service
      } catch (err) {
        const msg = err?.response?.data?.message || 'Failed to load schedule data';
        setFetchError(msg);
        toast.error(msg);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Handlers ─────────────────────────────────────────────────────────────────
  const handleEditClass = (classData) => {
    if (classData.type === 'lecture') {
      setEditingLecture(classData);
      setIsLectureModalOpen(true);
    } else {
      setEditingLab(classData);
      setIsLabModalOpen(true);
    }
  };

  const handleDeleteClass = async (classData) => {
    if (!window.confirm(`Delete this ${classData.type}?`)) return;
    try {
      if (classData.type === 'lecture') {
        await deleteLecture(classData.id);
      } else {
        await deleteTutorialLab(classData.id);
      }
      setScheduleGrid(prev =>
        prev.map(dayData => ({
          ...dayData,
          classes: dayData.classes.filter(
            c => !(c.id === classData.id && c.type === classData.type)
          ),
        }))
      );
      toast.success(`${classData.type === 'lecture' ? 'Lecture' : 'Lab'} deleted successfully`);
    } catch (err) {
      toast.error(err?.response?.data?.message || `Failed to delete ${classData.type}`);
    }
  };

  const handleSaveLecture = async (formData) => {
    setIsSubmittingLecture(true);
    try {
      const resolveInstructorName = (id) => {
        const t = teachers.find(t => t.id === id);
        return t ? (t.name || `${t.firstName ?? ''} ${t.lastName ?? ''}`.trim()) : '';
      };

      if (editingLecture) {
        // PATCH — offeringId is not sent
        const { offeringId: _offeringId, ...patch } = formData;
        await updateLecture(editingLecture.id, {
          ...patch,
          capacity: Number(patch.capacity),
          group: String(patch.group),
        });
        const instructorName = resolveInstructorName(formData.instructorId) || editingLecture.instructor;
        setScheduleGrid(prev =>
          prev.map(dayData => ({
            ...dayData,
            classes: dayData.classes.map(c =>
              c.id === editingLecture.id && c.type === 'lecture'
                ? {
                    ...c,
                    startTime: formData.startTime,
                    endTime: formData.endTime,
                    location: formData.location,
                    instructor: instructorName,
                    capacity: Number(formData.capacity),
                    group: formData.group,
                    dayOfWeek: formData.dayOfWeek,
                  }
                : c
            ),
          }))
        );
        toast.success('Lecture updated successfully');
      } else {
        // POST — send full payload
        const response = await createLecture({
          ...formData,
          offeringId: Number(formData.offeringId),
          capacity: Number(formData.capacity),
          group: String(formData.group),
        });
        const created = response?.data || response;
        const instructorName = resolveInstructorName(formData.instructorId);
        const offeringObj = allOfferings.find(o => o.offering_id === Number(formData.offeringId));
        const newClass = {
          id: created?.id ?? created?.lectureId ?? Date.now(),
          type: 'lecture',
          courseName: offeringObj?.course_name ?? '',
          courseCode: offeringObj?.course_code ?? '',
          startTime: formData.startTime,
          endTime: formData.endTime,
          location: formData.location,
          instructor: instructorName,
          capacity: Number(formData.capacity),
          group: formData.group,
          dayOfWeek: formData.dayOfWeek,
        };
        setScheduleGrid(prev =>
          prev.map(dayData =>
            dayData.day === formData.dayOfWeek
              ? { ...dayData, classes: [...dayData.classes, newClass] }
              : dayData
          )
        );
        toast.success('Lecture created successfully');
      }

      setIsLectureModalOpen(false);
      setEditingLecture(null);
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to save lecture');
    } finally {
      setIsSubmittingLecture(false);
    }
  };

  const handleSaveLab = async (formData) => {
    setIsSubmittingLab(true);
    try {
      const resolveTaName = (id) => {
        const t = teachers.find(t => t.id === id);
        return t ? (t.name || `${t.firstName ?? ''} ${t.lastName ?? ''}`.trim()) : '';
      };

      if (editingLab) {
        const { offeringId: _offeringId, ...patch } = formData;
        await updateTutorialLab(editingLab.id, {
          ...patch,
          capacity: Number(patch.capacity),
          group: String(patch.group),
        });
        const taName = resolveTaName(formData.taId) || editingLab.instructor;
        setScheduleGrid(prev =>
          prev.map(dayData => ({
            ...dayData,
            classes: dayData.classes.map(c =>
              c.id === editingLab.id && c.type === 'lab'
                ? {
                    ...c,
                    startTime: formData.startTime,
                    endTime: formData.endTime,
                    location: formData.location,
                    instructor: taName,
                    capacity: Number(formData.capacity),
                    group: formData.group,
                    dayOfWeek: formData.dayOfWeek,
                    labType: formData.type,
                  }
                : c
            ),
          }))
        );
        toast.success('Lab updated successfully');
      } else {
        const response = await createTutorialLab({
          ...formData,
          offeringId: Number(formData.offeringId),
          capacity: Number(formData.capacity),
          group: String(formData.group),
        });
        const created = response?.data || response;
        const taName = resolveTaName(formData.taId);
        const offeringObj = allOfferings.find(o => o.offering_id === Number(formData.offeringId));
        const newClass = {
          id: created?.id ?? created?.tutorialLabId ?? Date.now(),
          type: 'lab',
          courseName: offeringObj?.course_name ?? '',
          courseCode: offeringObj?.course_code ?? '',
          startTime: formData.startTime,
          endTime: formData.endTime,
          location: formData.location,
          instructor: taName,
          capacity: Number(formData.capacity),
          group: formData.group,
          dayOfWeek: formData.dayOfWeek,
          labType: formData.type,
        };
        setScheduleGrid(prev =>
          prev.map(dayData =>
            dayData.day === formData.dayOfWeek
              ? { ...dayData, classes: [...dayData.classes, newClass] }
              : dayData
          )
        );
        toast.success('Lab created successfully');
      }

      setIsLabModalOpen(false);
      setEditingLab(null);
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to save lab');
    } finally {
      setIsSubmittingLab(false);
    }
  };

  // ── Loading / Error states ────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 flex items-center justify-center min-h-[300px]">
        <div className="flex flex-col items-center gap-3 text-gray-500">
          <svg className="animate-spin w-8 h-8 text-indigo-600" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
          </svg>
          <p className="text-sm">Loading schedule...</p>
        </div>
      </div>
    );
  }

  if (fetchError) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 flex items-center justify-center min-h-[300px]">
        <div className="text-center text-gray-500">
          <p className="text-red-500 font-medium mb-2">Failed to load schedule</p>
          <p className="text-sm">{fetchError}</p>
        </div>
      </div>
    );
  }

  // ── Render ────────────────────────────────────────────────────────────────────
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 p-4 md:p-6 border-b border-gray-200 bg-gradient-to-r from-slate-50 to-gray-50">
        <div>
          <h2 className="text-lg md:text-xl font-semibold text-gray-800">{semesterLabel}</h2>
          <p className="text-sm text-gray-500 mt-1">Manage lectures and lab sessions</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <button
            onClick={() => setIsLectureModalOpen(true)}
            className="flex items-center justify-center gap-2 bg-indigo-600 text-white px-3 md:px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors text-sm md:text-base shadow-sm"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Lecture
          </button>
          <button
            onClick={() => setIsLabModalOpen(true)}
            className="flex items-center justify-center gap-2 bg-emerald-600 text-white px-3 md:px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors text-sm md:text-base shadow-sm"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Lab
          </button>
        </div>
      </div>

      {/* Schedule Grid */}
      <div className="p-4 md:p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-3 sm:gap-4">
          {scheduleGrid.map((dayData) => (
            <div key={dayData.day} className="flex flex-col">
              {/* Day Header */}
              <div className="bg-gradient-to-r from-gray-700 to-gray-800 text-white rounded-t-lg px-3 py-3 mb-3">
                <h3 className="font-bold text-center text-base md:text-lg">{dayData.day}</h3>
              </div>

              {/* Classes */}
              <div className="flex flex-col gap-2.5">
                {dayData.classes.length > 0 ? (
                  dayData.classes.map((classData, index) => (
                    <div key={`${classData.id}-${classData.type}-${index}`} className="h-[165px]">
                      <ScheduleClassCard
                        classData={classData}
                        onEdit={handleEditClass}
                        onDelete={handleDeleteClass}
                      />
                    </div>
                  ))
                ) : (
                  <div className="border-2 border-dashed border-gray-300 rounded-lg h-[150px] flex flex-col items-center justify-center text-gray-400">
                    <svg className="w-8 h-8 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span className="text-sm">No classes</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modals */}
      <AddLectureModal
        isOpen={isLectureModalOpen}
        onClose={() => {
          setIsLectureModalOpen(false);
          setEditingLecture(null);
        }}
        onSave={handleSaveLecture}
        editingLecture={editingLecture}
        allOfferings={allOfferings}
        teachers={teachers}
        isSubmitting={isSubmittingLecture}
      />

      <AddLabModal
        isOpen={isLabModalOpen}
        onClose={() => {
          setIsLabModalOpen(false);
          setEditingLab(null);
        }}
        onSave={handleSaveLab}
        editingLab={editingLab}
        allOfferings={allOfferings}
        teachers={teachers}
        isSubmitting={isSubmittingLab}
      />
    </div>
  );
}
