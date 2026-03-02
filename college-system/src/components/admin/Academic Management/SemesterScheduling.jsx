import { useState } from 'react';
import ScheduleClassCard from './ScheduleClassCard';
import AddLectureModal from './AddLectureModal';
import AddLabModal from './AddLabModal';

export default function SemesterScheduling() {
  const [scheduleData, setScheduleData] = useState({
    schedule: [
      {
        day: 'Sunday',
        date: '2025-12-14',
        classes: [],
      },
      {
        day: 'Monday',
        date: '2025-12-15',
        classes: [
          {
            courseId: 'CS301',
            courseCode: 'CS301',
            courseName: 'Database Systems',
            startTime: '09:00:00',
            endTime: '10:30:00',
            location: 'Building A, Room 201',
            instructor: 'Dr. Sarah Johnson',
            type: 'lecture',
          },
          {
            courseId: 'CS301',
            courseCode: 'CS301',
            courseName: 'Database Systems',
            startTime: '14:00:00',
            endTime: '16:00:00',
            location: 'Lab 5',
            instructor: 'TA Mike Brown',
            type: 'lab',
          },
        ],
      },
      {
        day: 'Tuesday',
        date: '2025-12-16',
        classes: [],
      },
      {
        day: 'Wednesday',
        date: '2025-12-17',
        classes: [],
      },
      {
        day: 'Thursday',
        date: '2025-12-18',
        classes: [],
      },
      {
        day: 'Friday',
        date: '2025-12-19',
        classes: [],
      },
      {
        day: 'Saturday',
        date: '2025-12-20',
        classes: [],
      },
    ],
  });

  const [isLectureModalOpen, setIsLectureModalOpen] = useState(false);
  const [isLabModalOpen, setIsLabModalOpen] = useState(false);
  const [editingLecture, setEditingLecture] = useState(null);
  const [editingLab, setEditingLab] = useState(null);

  const handleEditClass = (classData) => {
    if (classData.type === 'lecture') {
      setEditingLecture(classData);
      setIsLectureModalOpen(true);
    } else {
      setEditingLab(classData);
      setIsLabModalOpen(true);
    }
  };

  const handleDeleteClass = (classData) => {
    if (window.confirm(`Are you sure you want to delete this ${classData.type}?${classData.type === 'lecture' ? ' This will delete the entire section.' : ''}`)) {
      setScheduleData(prev => ({
        schedule: prev.schedule.map(day => ({
          ...day,
          classes: day.classes.filter(c => 
            !(c.courseId === classData.courseId && 
              c.startTime === classData.startTime && 
              c.day === classData.day)
          ),
        })),
      }));
    }
  };

  const handleSaveLecture = (formData) => {
    // Add or update lecture logic here
    console.log('Save Lecture:', formData);
    // You would typically make an API call here
    setEditingLecture(null);
  };

  const handleSaveLab = (formData) => {
    // Add or update lab logic here
    console.log('Save Lab:', formData);
    // You would typically make an API call here
    setEditingLab(null);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 p-4 md:p-6 border-b border-gray-200 bg-gradient-to-r from-slate-50 to-gray-50">
        <div>
          <h2 className="text-lg md:text-xl font-semibold text-gray-800">Fall 2025 Schedule</h2>
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
          {scheduleData.schedule.map((dayData) => (
            <div key={dayData.day} className="flex flex-col">
              {/* Day Header */}
              <div className="bg-gradient-to-r from-gray-700 to-gray-800 text-white rounded-t-lg px-3 py-3 mb-3">
                <h3 className="font-bold text-center text-base md:text-lg">
                  {dayData.day}
                </h3>
                <p className="text-center text-xs text-gray-300 mt-1">
                  {new Date(dayData.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </p>
              </div>

              {/* Classes Container */}
              <div className="flex flex-col gap-2.5">
                {dayData.classes.length > 0 ? (
                  dayData.classes.map((classData, index) => (
                    <div key={`${classData.courseId}-${classData.startTime}-${index}`} className="h-[140px]">
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
      />

      <AddLabModal
        isOpen={isLabModalOpen}
        onClose={() => {
          setIsLabModalOpen(false);
          setEditingLab(null);
        }}
        onSave={handleSaveLab}
        editingLab={editingLab}
      />
    </div>
  );
}
